// =====================================================
// VENDOR PROPOSAL CONTROLLER - Requirements & Proposals
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { vendorService } from '../../services/vendorService';
import { requireVendor } from '../../middleware/auth';

export class VendorProposalController {

  // Browse Requirements

  async browseRequirements(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        category: searchParams.get('category') || undefined,
        status: searchParams.get('status') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await vendorService.browseRequirements(session.vendorId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Browse requirements error:', error);
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

  // Submit Proposal

  async submitProposal(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.requirementId || !body.proposedPrice || !body.estimatedDuration || !body.description) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Requirement ID, proposed price, estimated duration, and description are required',
            },
          },
          { status: 400 }
        );
      }

      const data = {
        vendorId: session.vendorId!,
        requirementId: body.requirementId,
        proposedPrice: body.proposedPrice,
        estimatedDuration: body.estimatedDuration,
        description: body.description,
      };

      const proposal = await vendorService.submitProposal(data);

      return NextResponse.json({ success: true, data: proposal }, { status: 201 });
    } catch (error: any) {
      console.error('Submit proposal error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to submit proposal',
          },
        },
        { status: 500 }
      );
    }
  }

  // Get Proposals

  async getProposals(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        status: searchParams.get('status') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await vendorService.getProposals(session.vendorId!, filters);

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
}

export const vendorProposalController = new VendorProposalController();
