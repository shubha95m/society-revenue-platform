import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { verifyToken } from '../lib/auth';

const router = Router();

// Authentication middleware
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

// Helper function to generate complaint number
async function generateComplaintNumber(): Promise<string> {
  const count = await prisma.complaints.count();
  const year = new Date().getFullYear();
  return `CMP-${year}-${String(count + 1).padStart(6, '0')}`;
}

// POST /api/complaints - Create complaint (resident)
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { title, description, category, priority } = req.body;

    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title, description, and category are required'
        },
      });
    }

    // Get resident info
    const resident = await prisma.residents.findFirst({
      where: { user_id: session.userId },
    });

    if (!resident) {
      return res.status(404).json({
        success: false,
        error: { code: 'RESIDENT_NOT_FOUND', message: 'Resident profile not found' },
      });
    }

    // Generate complaint number
    const complaintNumber = await generateComplaintNumber();

    // Create complaint
    const { randomUUID } = require('crypto');
    const complaint = await prisma.complaints.create({
      data: {
        id: randomUUID(),
        complaint_number: complaintNumber,
        society_id: resident.society_id,
        resident_id: resident.id,
        title,
        subject: title,
        description,
        category,
        priority: priority || 'medium',
        status: 'open',
      },
      include: {
        residents: {
          select: {
            id: true,
            name: true,
            flat_number: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: { complaint },
    });
  } catch (error: any) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/complaints - List complaints (filtered by role)
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { status, category, priority } = req.query;

    let complaints;

    if (session.role === 'resident') {
      // Residents see only their own complaints
      const resident = await prisma.residents.findFirst({
        where: { user_id: session.userId },
      });

      if (!resident) {
        return res.status(404).json({
          success: false,
          error: { code: 'RESIDENT_NOT_FOUND', message: 'Resident profile not found' },
        });
      }

      const whereClause: any = { resident_id: resident.id };
      if (status) whereClause.status = status;
      if (category) whereClause.category = category;
      if (priority) whereClause.priority = priority;

      complaints = await prisma.complaints.findMany({
        where: whereClause,
        include: {
          residents: {
            select: {
              id: true,
              name: true,
              flat_number: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });
    } else if (session.role === 'society_admin') {
      // Society admins see all complaints for their society
      const society = await prisma.societies.findFirst({
        where: { admin_email: session.email },
      });

      if (!society) {
        return res.status(404).json({
          success: false,
          error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found' },
        });
      }

      const whereClause: any = { society_id: society.id };
      if (status) whereClause.status = status;
      if (category) whereClause.category = category;
      if (priority) whereClause.priority = priority;

      complaints = await prisma.complaints.findMany({
        where: whereClause,
        include: {
          residents: {
            select: {
              id: true,
              name: true,
              flat_number: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });
    } else {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    res.json({
      success: true,
      data: { complaints },
    });
  } catch (error: any) {
    console.error('List complaints error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/complaints/:id - Get complaint details
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];

    const complaint = await prisma.complaints.findUnique({
      where: { id },
      include: {
        residents: {
          select: {
            id: true,
            name: true,
            flat_number: true,
            user_id: true,
          },
        },
      },
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: { code: 'COMPLAINT_NOT_FOUND', message: 'Complaint not found' },
      });
    }

    // Authorization check
    if (session.role === 'resident') {
      // Residents can only view their own complaints
      const resident = await prisma.residents.findFirst({
        where: { user_id: session.userId },
      });
      if (!resident || complaint.resident_id !== resident.id) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only view your own complaints' },
        });
      }
    } else if (session.role === 'society_admin') {
      // Society admins can only view complaints from their society
      const society = await prisma.societies.findFirst({
        where: { admin_email: session.email },
      });
      if (!society || complaint.society_id !== society.id) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only view complaints from your society' },
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    res.json({
      success: true,
      data: { complaint },
    });
  } catch (error: any) {
    console.error('Get complaint error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// PATCH /api/complaints/:id - Update complaint status/resolution (society admin only)
router.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const { status, resolution_notes } = req.body;

    // Only society admins can update complaints
    if (session.role !== 'society_admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only society admins can update complaints' },
      });
    }

    // Get society info
    const society = await prisma.societies.findFirst({
      where: { admin_email: session.email },
    });

    if (!society) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found' },
      });
    }

    // Check if complaint exists and belongs to this society
    const existingComplaint = await prisma.complaints.findUnique({
      where: { id },
    });

    if (!existingComplaint) {
      return res.status(404).json({
        success: false,
        error: { code: 'COMPLAINT_NOT_FOUND', message: 'Complaint not found' },
      });
    }

    if (existingComplaint.society_id !== society.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only update complaints from your society' },
      });
    }

    // Validation
    if (!status && !resolution_notes) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'At least one field (status or resolution_notes) is required' },
      });
    }

    // Prepare update data
    const updateData: any = {};
    if (status) {
      updateData.status = status;
      if (status === 'resolved' || status === 'closed') {
        updateData.resolved_at = new Date();
      }
    }
    if (resolution_notes) {
      updateData.resolution_notes = resolution_notes;
    }

    // Update complaint
    const complaint = await prisma.complaints.update({
      where: { id },
      data: updateData,
      include: {
        residents: {
          select: {
            id: true,
            name: true,
            flat_number: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: { complaint },
    });
  } catch (error: any) {
    console.error('Update complaint error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// DELETE /api/complaints/:id - Delete complaint (admin only)
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];

    // Only society admins and platform admins can delete complaints
    if (session.role !== 'society_admin' && session.role !== 'platform_admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only admins can delete complaints' },
      });
    }

    // Check if complaint exists
    const existingComplaint = await prisma.complaints.findUnique({
      where: { id },
    });

    if (!existingComplaint) {
      return res.status(404).json({
        success: false,
        error: { code: 'COMPLAINT_NOT_FOUND', message: 'Complaint not found' },
      });
    }

    // For society admins, verify they own the society
    if (session.role === 'society_admin') {
      const society = await prisma.societies.findFirst({
        where: { admin_email: session.email },
      });

      if (!society) {
        return res.status(404).json({
          success: false,
          error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found' },
        });
      }

      if (existingComplaint.society_id !== society.id) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only delete complaints from your society' },
        });
      }
    }

    // Delete complaint
    await prisma.complaints.delete({
      where: { id },
    });

    res.json({
      success: true,
      data: { message: 'Complaint deleted successfully' },
    });
  } catch (error: any) {
    console.error('Delete complaint error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

export default router;
