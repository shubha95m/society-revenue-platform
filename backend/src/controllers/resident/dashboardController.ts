// =====================================================
// RESIDENT DASHBOARD CONTROLLER
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { residentService } from '../../services/residentService';
import { requireResident } from '../../middleware/auth';

export class ResidentDashboardController {

  async getDashboard(req: NextRequest): Promise<NextResponse> {
    try {
      // Authenticate
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) {
        return authResult;
      }

      const session = authResult;

      if (!session.residentId || !session.societyId) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_SESSION',
              message: 'Resident information not found in session',
            },
          },
          { status: 400 }
        );
      }

      // Get dashboard data
      const dashboard = await residentService.getDashboard(session.residentId, session.societyId);

      return NextResponse.json(
        {
          success: true,
          data: dashboard,
        },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Get dashboard error:', error);
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

export const residentDashboardController = new ResidentDashboardController();
