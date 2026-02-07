// =====================================================
// VENDOR FINANCIAL CONTROLLER - Earnings & Transactions
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { vendorService } from '../../services/vendorService';
import { requireVendor } from '../../middleware/auth';

export class VendorFinancialController {

  async getEarnings(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
      const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;

      const result = await vendorService.getEarnings(session.vendorId!, startDate, endDate);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get earnings error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch earnings',
          },
        },
        { status: 500 }
      );
    }
  }

  async getTransactions(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        type: searchParams.get('type') || undefined,
        status: searchParams.get('status') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await vendorService.getTransactions(session.vendorId!, filters);

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
}

export const vendorFinancialController = new VendorFinancialController();
