// =====================================================
// RESIDENT ORDER CONTROLLER
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { residentService } from '../../services/residentService';
import { requireResident } from '../../middleware/auth';
import { OrderStatus } from '../../types';

export class ResidentOrderController {

  async browseMarketplace(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        category: searchParams.get('category') || undefined,
        vendorId: searchParams.get('vendorId') || undefined,
        search: searchParams.get('search') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await residentService.browseMarketplace(session.societyId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Browse marketplace error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch marketplace products',
          },
        },
        { status: 500 }
      );
    }
  }

  async createOrder(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.vendorId || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Vendor ID and items are required',
            },
          },
          { status: 400 }
        );
      }

      const data = {
        residentId: session.residentId!,
        societyId: session.societyId!,
        vendorId: body.vendorId,
        items: body.items,
        deliveryAddress: body.deliveryAddress,
        notes: body.notes,
      };

      const order = await residentService.createOrder(data);

      return NextResponse.json({ success: true, data: order }, { status: 201 });
    } catch (error: any) {
      console.error('Create order error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to create order',
          },
        },
        { status: 500 }
      );
    }
  }

  async getOrders(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        status: searchParams.get('status') as OrderStatus | undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await residentService.getOrders(session.residentId!, filters);

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

  async getOrderDetails(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const order = await residentService.getOrderDetails(params.id, session.residentId!);

      return NextResponse.json({ success: true, data: order }, { status: 200 });
    } catch (error: any) {
      console.error('Get order details error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch order details',
          },
        },
        { status: 500 }
      );
    }
  }

  async markReceived(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const updated = await residentService.markOrderReceived(params.id, session.residentId!);

      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error: any) {
      console.error('Mark order received error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to mark order as received',
          },
        },
        { status: 500 }
      );
    }
  }

  async rateOrder(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.rating || body.rating < 1 || body.rating > 5) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Rating must be between 1 and 5',
            },
          },
          { status: 400 }
        );
      }

      const updated = await residentService.rateOrder(
        params.id,
        session.residentId!,
        body.rating,
        body.review
      );

      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error: any) {
      console.error('Rate order error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to rate order',
          },
        },
        { status: 500 }
      );
    }
  }

  async disputeOrder(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.reason) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Reason is required',
            },
          },
          { status: 400 }
        );
      }

      const updated = await residentService.disputeOrder(
        params.id,
        session.residentId!,
        body.reason
      );

      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error: any) {
      console.error('Dispute order error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to dispute order',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const residentOrderController = new ResidentOrderController();
