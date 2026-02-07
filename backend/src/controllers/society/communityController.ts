// =====================================================
// SOCIETY COMMUNITY CONTROLLER - Votes, Complaints, Requests
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { societyService } from '../../services/societyService';
import { requireSocietyAdmin } from '../../middleware/auth';

export class SocietyCommunityController {

  // Votes & Polls

  async createPoll(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.title || !body.startDate || !body.endDate || !body.options || body.options.length < 2) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Title, start date, end date, and at least 2 options are required',
            },
          },
          { status: 400 }
        );
      }

      const data = {
        societyId: session.societyId!,
        createdBy: session.userId,
        title: body.title,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        options: body.options,
      };

      const poll = await societyService.createPoll(data);

      return NextResponse.json({ success: true, data: poll }, { status: 201 });
    } catch (error: any) {
      console.error('Create poll error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to create poll',
          },
        },
        { status: 500 }
      );
    }
  }

  async closePoll(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const updated = await societyService.closePoll(params.id, session.societyId!);

      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error: any) {
      console.error('Close poll error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to close poll',
          },
        },
        { status: 500 }
      );
    }
  }

  // Service Requests (View All)

  async getAllServiceRequests(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        status: searchParams.get('status') || undefined,
        vendorId: searchParams.get('vendorId') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await societyService.getAllServiceRequests(session.societyId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get all service requests error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch service requests',
          },
        },
        { status: 500 }
      );
    }
  }

  // Complaints (View All)

  async getAllComplaints(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        status: searchParams.get('status') || undefined,
        category: searchParams.get('category') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await societyService.getAllComplaints(session.societyId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get all complaints error:', error);
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

  async updateComplaintStatus(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.status) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Status is required',
            },
          },
          { status: 400 }
        );
      }

      const updated = await societyService.updateComplaintStatus(params.id, session.societyId!, body.status);

      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error: any) {
      console.error('Update complaint status error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to update complaint status',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const societyCommunityController = new SocietyCommunityController();
