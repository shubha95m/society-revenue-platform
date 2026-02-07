// =====================================================
// VENDOR ANALYTICS CONTROLLER
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { vendorService } from '../../services/vendorService';
import { requireVendor } from '../../middleware/auth';

export class VendorAnalyticsController {

  async getAnalytics(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
      const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;

      const result = await vendorService.getAnalytics(session.vendorId!, startDate, endDate);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get analytics error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch analytics',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const vendorAnalyticsController = new VendorAnalyticsController();
