// =====================================================
// RESIDENT COMMUNITY CONTROLLER - Votes, Complaints, Notices
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { residentService } from '../../services/residentService';
import { requireResident } from '../../middleware/auth';
import { ComplaintCreateData } from '../../types';

export class ResidentCommunityController {

  // =====================================================
  // VOTES & POLLS
  // =====================================================

  async getPolls(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        status: searchParams.get('status') as 'active' | 'completed' | undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await residentService.getPolls(session.societyId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get polls error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch polls',
          },
        },
        { status: 500 }
      );
    }
  }

  async getPollDetails(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const poll = await residentService.getPollDetails(params.id, session.residentId!, session.societyId!);

      return NextResponse.json({ success: true, data: poll }, { status: 200 });
    } catch (error: any) {
      console.error('Get poll details error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch poll details',
          },
        },
        { status: 500 }
      );
    }
  }

  async submitVote(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.optionId) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Option ID is required',
            },
          },
          { status: 400 }
        );
      }

      const voteResponse = await residentService.submitVote(
        params.id,
        session.residentId!,
        body.optionId
      );

      return NextResponse.json({ success: true, data: voteResponse }, { status: 201 });
    } catch (error: any) {
      console.error('Submit vote error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to submit vote',
          },
        },
        { status: 500 }
      );
    }
  }

  async getPollResults(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const results = await residentService.getPollResults(params.id, session.societyId!);

      return NextResponse.json({ success: true, data: results }, { status: 200 });
    } catch (error: any) {
      console.error('Get poll results error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch poll results',
          },
        },
        { status: 500 }
      );
    }
  }

  // =====================================================
  // COMPLAINTS
  // =====================================================

  async createComplaint(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.category || !body.subject || !body.description) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Category, subject, and description are required',
            },
          },
          { status: 400 }
        );
      }

      const data: ComplaintCreateData = {
        residentId: session.residentId!,
        societyId: session.societyId!,
        category: body.category,
        subject: body.subject,
        description: body.description,
        priority: body.priority,
      };

      const complaint = await residentService.createComplaint(data);

      return NextResponse.json({ success: true, data: complaint }, { status: 201 });
    } catch (error: any) {
      console.error('Create complaint error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to create complaint',
          },
        },
        { status: 500 }
      );
    }
  }

  async getComplaints(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        status: searchParams.get('status') || undefined,
        category: searchParams.get('category') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await residentService.getComplaints(session.residentId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get complaints error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch complaints',
          },
        },
        { status: 500 }
      );
    }
  }

  async getComplaintDetails(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const complaint = await residentService.getComplaintDetails(params.id, session.residentId!);

      return NextResponse.json({ success: true, data: complaint }, { status: 200 });
    } catch (error: any) {
      console.error('Get complaint details error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch complaint details',
          },
        },
        { status: 500 }
      );
    }
  }

  async addComplaintComment(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.comment) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Comment is required',
            },
          },
          { status: 400 }
        );
      }

      const comment = await residentService.addComplaintComment(
        params.id,
        session.residentId!,
        session.userId,
        body.comment
      );

      return NextResponse.json({ success: true, data: comment }, { status: 201 });
    } catch (error: any) {
      console.error('Add complaint comment error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to add comment',
          },
        },
        { status: 500 }
      );
    }
  }

  // =====================================================
  // NOTICES
  // =====================================================

  async getNotices(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        priority: searchParams.get('priority') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await residentService.getNotices(session.societyId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get notices error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch notices',
          },
        },
        { status: 500 }
      );
    }
  }

  async getNoticeDetails(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const notice = await residentService.getNoticeDetails(params.id, session.societyId!);

      return NextResponse.json({ success: true, data: notice }, { status: 200 });
    } catch (error: any) {
      console.error('Get notice details error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch notice details',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const residentCommunityController = new ResidentCommunityController();
