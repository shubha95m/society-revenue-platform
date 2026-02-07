// =====================================================
// VENDOR CONTRACT CONTROLLER
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { vendorService } from '../../services/vendorService';
import { requireVendor } from '../../middleware/auth';

export class VendorContractController {

  async getContracts(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        societyId: searchParams.get('societyId') || undefined,
        status: searchParams.get('status') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await vendorService.getContracts(session.vendorId!, filters);

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

export const vendorContractController = new VendorContractController();
