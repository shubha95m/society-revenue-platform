// =====================================================
// VENDOR MARKETPLACE CONTROLLER - Services & Products
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { vendorService } from '../../services/vendorService';
import { requireVendor } from '../../middleware/auth';

export class VendorMarketplaceController {

  // Services

  async getServices(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        societyId: searchParams.get('societyId') || undefined,
        isActive: searchParams.get('isActive') === 'true' ? true : searchParams.get('isActive') === 'false' ? false : undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await vendorService.getServices(session.vendorId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get services error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch services',
          },
        },
        { status: 500 }
      );
    }
  }

  async createService(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.societyId || !body.name || !body.category) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Society ID, name, and category are required',
            },
          },
          { status: 400 }
        );
      }

      const data = {
        vendorId: session.vendorId!,
        societyId: body.societyId,
        name: body.name,
        description: body.description,
        category: body.category,
        basePrice: body.basePrice,
        isActive: body.isActive !== undefined ? body.isActive : true,
      };

      const service = await vendorService.createService(data);

      return NextResponse.json({ success: true, data: service }, { status: 201 });
    } catch (error: any) {
      console.error('Create service error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to create service',
          },
        },
        { status: 500 }
      );
    }
  }

  async updateService(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      const updated = await vendorService.updateService(params.id, session.vendorId!, body);

      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error: any) {
      console.error('Update service error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to update service',
          },
        },
        { status: 500 }
      );
    }
  }

  // Products

  async getProducts(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        societyId: searchParams.get('societyId') || undefined,
        category: searchParams.get('category') || undefined,
        isActive: searchParams.get('isActive') === 'true' ? true : searchParams.get('isActive') === 'false' ? false : undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await vendorService.getProducts(session.vendorId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get products error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch products',
          },
        },
        { status: 500 }
      );
    }
  }

  async createProduct(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.societyId || !body.name || !body.category || !body.price || !body.unit) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Society ID, name, category, price, and unit are required',
            },
          },
          { status: 400 }
        );
      }

      const data = {
        vendorId: session.vendorId!,
        societyId: body.societyId,
        name: body.name,
        description: body.description,
        category: body.category,
        price: body.price,
        unit: body.unit,
        stockQuantity: body.stockQuantity,
        imageUrl: body.imageUrl,
        isActive: body.isActive !== undefined ? body.isActive : true,
      };

      const product = await vendorService.createProduct(data);

      return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (error: any) {
      console.error('Create product error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to create product',
          },
        },
        { status: 500 }
      );
    }
  }

  async updateProduct(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireVendor(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      const updated = await vendorService.updateProduct(params.id, session.vendorId!, body);

      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error: any) {
      console.error('Update product error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to update product',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const vendorMarketplaceController = new VendorMarketplaceController();
