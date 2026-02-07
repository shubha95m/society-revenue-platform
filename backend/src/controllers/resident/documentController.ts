// =====================================================
// RESIDENT DOCUMENT CONTROLLER
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { residentService } from '../../services/residentService';
import { requireResident } from '../../middleware/auth';

export class ResidentDocumentController {

  async getDocuments(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        category: searchParams.get('category') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await residentService.getDocuments(session.societyId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get documents error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch documents',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const residentDocumentController = new ResidentDocumentController();
