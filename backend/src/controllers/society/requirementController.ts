// =====================================================
// SOCIETY REQUIREMENT & PROPOSAL CONTROLLER
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { societyService } from '../../services/societyService';
import { requireSocietyAdmin } from '../../middleware/auth';

export class SocietyRequirementController {

  // Service Requirements

  async createRequirement(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.category || !body.title || !body.description) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Category, title, and description are required',
            },
          },
          { status: 400 }
        );
      }

      const data = {
        societyId: session.societyId!,
        createdBy: session.userId,
        category: body.category,
        title: body.title,
        description: body.description,
        budget: body.budget,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
      };

      const requirement = await societyService.createServiceRequirement(data);

      return NextResponse.json({ success: true, data: requirement }, { status: 201 });
    } catch (error: any) {
      console.error('Create requirement error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to create requirement',
          },
        },
        { status: 500 }
      );
    }
  }

  async getRequirements(req: NextRequest): Promise<NextResponse> {
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

      const result = await societyService.getServiceRequirements(session.societyId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get requirements error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch requirements',
          },
        },
        { status: 500 }
      );
    }
  }

  async getRequirementDetails(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const requirement = await societyService.getServiceRequirementDetails(params.id, session.societyId!);

      return NextResponse.json({ success: true, data: requirement }, { status: 200 });
    } catch (error: any) {
      console.error('Get requirement details error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch requirement details',
          },
        },
        { status: 500 }
      );
    }
  }

  // Vendor Proposals

  async getProposals(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        status: searchParams.get('status') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const requirementId = searchParams.get('requirementId') || undefined;
      const result = await societyService.getProposals(session.societyId!, requirementId, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get proposals error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch proposals',
          },
        },
        { status: 500 }
      );
    }
  }

  async approveProposal(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const updated = await societyService.approveProposal(params.id, session.societyId!);

      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error: any) {
      console.error('Approve proposal error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to approve proposal',
          },
        },
        { status: 500 }
      );
    }
  }

  async rejectProposal(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      const updated = await societyService.rejectProposal(params.id, session.societyId!, body.reason);

      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error: any) {
      console.error('Reject proposal error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to reject proposal',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const societyRequirementController = new SocietyRequirementController();
