// =====================================================
// SOCIETY VENDOR MANAGEMENT CONTROLLER
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { societyService } from '../../services/societyService';
import { requireSocietyAdmin } from '../../middleware/auth';

export class SocietyVendorController {

  async getVendors(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        status: searchParams.get('status') || undefined,
        search: searchParams.get('search') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await societyService.getVendors(session.societyId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get vendors error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch vendors',
          },
        },
        { status: 500 }
      );
    }
  }

  async getVendorDetails(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const vendor = await societyService.getVendorDetails(params.id, session.societyId!);

      return NextResponse.json({ success: true, data: vendor }, { status: 200 });
    } catch (error: any) {
      console.error('Get vendor details error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch vendor details',
          },
        },
        { status: 500 }
      );
    }
  }

  async approveVendor(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const updated = await societyService.approveVendor(params.id, session.societyId!);

      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error: any) {
      console.error('Approve vendor error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to approve vendor',
          },
        },
        { status: 500 }
      );
    }
  }

  async suspendVendor(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      const result = await societyService.suspendVendor(params.id, session.societyId!, body.reason);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Suspend vendor error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to suspend vendor',
          },
        },
        { status: 500 }
      );
    }
  }

  // Contracts

  async createContract(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.vendorId || !body.title || !body.amount || !body.startDate || !body.endDate) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Vendor ID, title, amount, start date, and end date are required',
            },
          },
          { status: 400 }
        );
      }

      const data = {
        societyId: session.societyId!,
        vendorId: body.vendorId,
        proposalId: body.proposalId,
        title: body.title,
        description: body.description,
        amount: body.amount,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        terms: body.terms,
      };

      const contract = await societyService.createContract(data);

      return NextResponse.json({ success: true, data: contract }, { status: 201 });
    } catch (error: any) {
      console.error('Create contract error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to create contract',
          },
        },
        { status: 500 }
      );
    }
  }

  async getContracts(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        vendorId: searchParams.get('vendorId') || undefined,
        status: searchParams.get('status') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await societyService.getContracts(session.societyId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get contracts error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch contracts',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const societyVendorController = new SocietyVendorController();
