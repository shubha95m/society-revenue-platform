// =====================================================
// SOCIETY FINANCIAL CONTROLLER
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { societyService } from '../../services/societyService';
import { requireSocietyAdmin } from '../../middleware/auth';

export class SocietyFinancialController {

  async getFinancialSummary(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
      const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;

      const result = await societyService.getFinancialSummary(session.societyId!, startDate, endDate);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get financial summary error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch financial summary',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const societyFinancialController = new SocietyFinancialController();
