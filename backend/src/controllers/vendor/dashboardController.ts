// =====================================================
// VENDOR DASHBOARD CONTROLLER
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { vendorService } from '../../services/vendorService';
import { requireVendor } from '../../middleware/auth';

export class VendorDashboardController {

  async getDashboard(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const dashboard = await vendorService.getDashboard(session.vendorId!);

      return NextResponse.json({ success: true, data: dashboard }, { status: 200 });
    } catch (error: any) {
      console.error('Get vendor dashboard error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch dashboard',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const vendorDashboardController = new VendorDashboardController();
