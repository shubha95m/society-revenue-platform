// =====================================================
// VENDOR ORDER CONTROLLER
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { vendorService } from '../../services/vendorService';
import { requireVendor } from '../../middleware/auth';

export class VendorOrderController {

  async getOrders(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        status: searchParams.get('status') || undefined,
        societyId: searchParams.get('societyId') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await vendorService.getOrders(session.vendorId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get orders error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch orders',
          },
        },
        { status: 500 }
      );
    }
  }

  async updateOrderStatus(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.status) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Status is required',
            },
          },
          { status: 400 }
        );
      }

      const updated = await vendorService.updateOrderStatus(params.id, session.vendorId!, body.status);

      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error: any) {
      console.error('Update order status error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to update order status',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const vendorOrderController = new VendorOrderController();
