// =====================================================
// SOCIETY DASHBOARD CONTROLLER
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { societyService } from '../../services/societyService';
import { requireSocietyAdmin } from '../../middleware/auth';

export class SocietyDashboardController {

  async getDashboard(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const dashboard = await societyService.getDashboard(session.societyId!);

      return NextResponse.json({ success: true, data: dashboard }, { status: 200 });
    } catch (error: any) {
      console.error('Get society dashboard error:', error);
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

export const societyDashboardController = new SocietyDashboardController();
