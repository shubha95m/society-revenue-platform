// =====================================================
// RESIDENT PAYMENT CONTROLLER
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { residentService } from '../../services/residentService';
import { requireResident } from '../../middleware/auth';

export class ResidentPaymentController {

  async getTransactions(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        type: searchParams.get('type') || undefined,
        status: searchParams.get('status') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await residentService.getTransactions(session.residentId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get transactions error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch transactions',
          },
        },
        { status: 500 }
      );
    }
  }

  async getInvoices(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        paid: searchParams.get('paid') === 'true' ? true : searchParams.get('paid') === 'false' ? false : undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await residentService.getInvoices(session.residentId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get invoices error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch invoices',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const residentPaymentController = new ResidentPaymentController();
