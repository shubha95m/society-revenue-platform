import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { verifyToken } from '../lib/auth';

const router = Router();

// Authentication middleware - Allows both residents and society admins
async function requireAuth(req: Request, res: Response, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { code: 'NO_TOKEN', message: 'No authorization token provided' },
      });
    }

    const token = authHeader.substring(7);
    const session = await verifyToken(token);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
      });
    }

    (req as any).session = session;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'AUTH_ERROR', message: 'Authentication failed' },
    });
  }
}

// Society admin only middleware
async function requireSocietyAdmin(req: Request, res: Response, next: any) {
  try {
    const session = (req as any).session;

    if (session.role !== 'society_admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Society admin access required' },
      });
    }

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: { code: 'AUTH_ERROR', message: 'Authorization failed' },
    });
  }
}

// Helper function to get society ID
async function getSocietyId(session: any): Promise<string | null> {
  if (session.role === 'society_admin') {
    const society = await prisma.societies.findFirst({
      where: { admin_email: session.email },
    });
    return society?.id || null;
  } else if (session.role === 'resident') {
    const resident = await prisma.residents.findFirst({
      where: { user_id: session.userId },
    });
    return resident?.society_id || null;
  }
  return null;
}

// Helper function to get resident ID
async function getResidentId(session: any): Promise<string | null> {
  if (session.role === 'resident') {
    const resident = await prisma.residents.findFirst({
      where: { user_id: session.userId },
    });
    return resident?.id || null;
  }
  return null;
}

// GET /api/proposals - List proposals (society-specific)
router.get('/proposals', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const societyId = await getSocietyId(session);

    if (!societyId) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found for user' },
      });
    }

    const { status, type } = req.query;

    const where: any = { society_id: societyId };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    const proposals = await prisma.proposals.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    // Manually fetch votes for each proposal
    const proposalsWithVotes = await Promise.all(
      proposals.map(async (proposal) => {
        const votes = await prisma.votes.findMany({
          where: { proposal_id: proposal.id },
          select: {
            id: true,
            vote_value: true,
            created_at: true,
          },
        });
        return { ...proposal, votes };
      })
    );

    // Add vote counts to each proposal
    const proposalsWithCounts = proposalsWithVotes.map((proposal: any) => {
      const voteCount = {
        total: proposal.votes.length,
        yes: proposal.votes.filter((v: any) => v.vote_value === 'yes').length,
        no: proposal.votes.filter((v: any) => v.vote_value === 'no').length,
        abstain: proposal.votes.filter((v: any) => v.vote_value === 'abstain').length,
      };

      return {
        ...proposal,
        voteCount,
      };
    });

    res.json({
      success: true,
      data: { proposals: proposalsWithCounts },
    });
  } catch (error: any) {
    console.error('List proposals error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/proposals/:id - Get proposal details
router.get('/proposals/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const societyId = await getSocietyId(session);

    if (!societyId) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found for user' },
      });
    }

    const proposal = await prisma.proposals.findFirst({
      where: {
        id,
        society_id: societyId,
      },
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROPOSAL_NOT_FOUND', message: 'Proposal not found' },
      });
    }

    // Manually fetch votes with resident info
    const votes = await prisma.votes.findMany({
      where: { proposal_id: id },
      orderBy: { created_at: 'desc' },
    });

    // Manually fetch resident info for each vote
    const votesWithResidents = await Promise.all(
      votes.map(async (vote) => {
        const resident = await prisma.residents.findUnique({
          where: { id: vote.resident_id },
          select: {
            id: true,
            name: true,
            flat_number: true,
          },
        });
        return { ...vote, residents: resident };
      })
    );

    // Calculate vote statistics
    const voteCount = {
      total: votesWithResidents.length,
      yes: votesWithResidents.filter((v: any) => v.vote_value === 'yes').length,
      no: votesWithResidents.filter((v: any) => v.vote_value === 'no').length,
      abstain: votesWithResidents.filter((v: any) => v.vote_value === 'abstain').length,
    };

    // Check if current user has voted
    let userVote = null;
    if (session.role === 'resident') {
      const residentId = await getResidentId(session);
      if (residentId) {
        userVote = votesWithResidents.find((v: any) => v.resident_id === residentId);
      }
    }

    res.json({
      success: true,
      data: {
        proposal: {
          ...proposal,
          votes: votesWithResidents,
          voteCount,
          userVote: userVote ? { vote_value: userVote.vote_value, created_at: userVote.created_at } : null,
        },
      },
    });
  } catch (error: any) {
    console.error('Get proposal error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// POST /api/proposals - Create proposal (society admin only)
router.post('/proposals', requireAuth, requireSocietyAdmin, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { title, description, type, start_date, end_date } = req.body;

    // Validate required fields
    if (!title || !description || !type || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title, description, type, start_date, and end_date are required'
        },
      });
    }

    const societyId = await getSocietyId(session);
    if (!societyId) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found for admin' },
      });
    }

    // Validate dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const now = new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid date format' },
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'End date must be after start date' },
      });
    }

    if (endDate <= now) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'End date must be in the future' },
      });
    }

    // Determine status based on start date
    const status = startDate <= now ? 'active' : 'pending';

    const proposal = await prisma.proposals.create({
      data: {
        id: crypto.randomUUID(),
        society_id: societyId,
        title,
        description,
        type,
        status,
        start_date: startDate,
        end_date: endDate,
        created_by: session.userId,
      },
    });

    res.status(201).json({
      success: true,
      data: { proposal },
    });
  } catch (error: any) {
    console.error('Create proposal error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// PATCH /api/proposals/:id - Update proposal (society admin only)
router.patch('/proposals/:id', requireAuth, requireSocietyAdmin, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { title, description, type, status, start_date, end_date } = req.body;

    const societyId = await getSocietyId(session);
    if (!societyId) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found for admin' },
      });
    }

    // Check if proposal exists and belongs to the society
    const existingProposal = await prisma.proposals.findFirst({
      where: {
        id,
        society_id: societyId,
      },
    });

    if (!existingProposal) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROPOSAL_NOT_FOUND', message: 'Proposal not found' },
      });
    }

    // Don't allow updates to closed proposals
    if (existingProposal.status === 'closed') {
      return res.status(400).json({
        success: false,
        error: { code: 'PROPOSAL_CLOSED', message: 'Cannot update a closed proposal' },
      });
    }

    // Build update data
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (status !== undefined) updateData.status = status;

    if (start_date) {
      const startDate = new Date(start_date);
      if (isNaN(startDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid start date format' },
        });
      }
      updateData.start_date = startDate;
    }

    if (end_date) {
      const endDate = new Date(end_date);
      if (isNaN(endDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid end date format' },
        });
      }
      updateData.end_date = endDate;
    }

    // Validate dates if both are provided
    if (updateData.start_date && updateData.end_date) {
      if (updateData.end_date <= updateData.start_date) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'End date must be after start date' },
        });
      }
    }

    const proposal = await prisma.proposals.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      data: { proposal },
    });
  } catch (error: any) {
    console.error('Update proposal error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// POST /api/proposals/:id/vote - Cast vote (resident)
router.post('/proposals/:id/vote', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { vote_value } = req.body;

    // Validate vote value
    if (!vote_value || !['yes', 'no', 'abstain'].includes(vote_value)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Vote value must be yes, no, or abstain' },
      });
    }

    const residentId = await getResidentId(session);
    if (!residentId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only residents can vote' },
      });
    }

    const societyId = await getSocietyId(session);
    if (!societyId) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found for resident' },
      });
    }

    // Check if proposal exists and belongs to the society
    const proposal = await prisma.proposals.findFirst({
      where: {
        id,
        society_id: societyId,
      },
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROPOSAL_NOT_FOUND', message: 'Proposal not found' },
      });
    }

    // Check if proposal is active and within voting period
    const now = new Date();
    if (proposal.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: { code: 'PROPOSAL_NOT_ACTIVE', message: 'Proposal is not active for voting' },
      });
    }

    if (now < proposal.start_date) {
      return res.status(400).json({
        success: false,
        error: { code: 'VOTING_NOT_STARTED', message: 'Voting has not started yet' },
      });
    }

    if (now > proposal.end_date) {
      return res.status(400).json({
        success: false,
        error: { code: 'VOTING_ENDED', message: 'Voting period has ended' },
      });
    }

    // Check if user has already voted
    const existingVote = await prisma.votes.findFirst({
      where: {
        proposal_id: id,
        resident_id: residentId,
      },
    });

    if (existingVote) {
      // Update existing vote
      const updatedVote = await prisma.votes.update({
        where: { id: existingVote.id },
        data: { vote_value },
      });

      // Fetch resident info separately
      const resident = await prisma.residents.findUnique({
        where: { id: updatedVote.resident_id },
        select: {
          id: true,
          name: true,
          flat_number: true,
        },
      });

      res.json({
        success: true,
        data: {
          vote: { ...updatedVote, residents: resident },
          message: 'Vote updated successfully',
        },
      });
    } else {
      // Create new vote
      const vote = await prisma.votes.create({
        data: {
          id: crypto.randomUUID(),
          proposal_id: id,
          resident_id: residentId,
          vote_value,
        },
      });

      // Fetch resident info separately
      const resident = await prisma.residents.findUnique({
        where: { id: vote.resident_id },
        select: {
          id: true,
          name: true,
          flat_number: true,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          vote: { ...vote, residents: resident },
          message: 'Vote cast successfully',
        },
      });
    }
  } catch (error: any) {
    console.error('Cast vote error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/proposals/:id/results - Get voting results
router.get('/proposals/:id/results', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const societyId = await getSocietyId(session);

    if (!societyId) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found for user' },
      });
    }

    // Check if proposal exists and belongs to the society
    const proposal = await prisma.proposals.findFirst({
      where: {
        id,
        society_id: societyId,
      },
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROPOSAL_NOT_FOUND', message: 'Proposal not found' },
      });
    }

    // Fetch votes separately
    const votes = await prisma.votes.findMany({
      where: { proposal_id: id },
    });

    // Manually fetch resident info for each vote
    const votesWithResidents = await Promise.all(
      votes.map(async (vote) => {
        const resident = await prisma.residents.findUnique({
          where: { id: vote.resident_id },
          select: {
            id: true,
            name: true,
            flat_number: true,
          },
        });
        return { ...vote, residents: resident };
      })
    );

    // Get total eligible voters (all residents in society)
    const totalResidents = await prisma.residents.count({
      where: { society_id: societyId },
    });

    // Calculate vote statistics
    const totalVotes = votesWithResidents.length;
    const yesVotes = votesWithResidents.filter((v: any) => v.vote_value === 'yes').length;
    const noVotes = votesWithResidents.filter((v: any) => v.vote_value === 'no').length;
    const abstainVotes = votesWithResidents.filter((v: any) => v.vote_value === 'abstain').length;

    const participationRate = totalResidents > 0 ? (totalVotes / totalResidents) * 100 : 0;
    const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
    const noPercentage = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0;
    const abstainPercentage = totalVotes > 0 ? (abstainVotes / totalVotes) * 100 : 0;

    const results = {
      proposal: {
        id: proposal.id,
        title: proposal.title,
        description: proposal.description,
        type: proposal.type,
        status: proposal.status,
        start_date: proposal.start_date,
        end_date: proposal.end_date,
      },
      statistics: {
        totalEligibleVoters: totalResidents,
        totalVotes,
        participationRate: Math.round(participationRate * 100) / 100,
        yesVotes,
        noVotes,
        abstainVotes,
        yesPercentage: Math.round(yesPercentage * 100) / 100,
        noPercentage: Math.round(noPercentage * 100) / 100,
        abstainPercentage: Math.round(abstainPercentage * 100) / 100,
      },
      votes: votesWithResidents.map((vote: any) => ({
        id: vote.id,
        vote_value: vote.vote_value,
        created_at: vote.created_at,
        resident: vote.residents,
      })),
    };

    res.json({
      success: true,
      data: { results },
    });
  } catch (error: any) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

export default router;
