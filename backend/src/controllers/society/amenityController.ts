// =====================================================
// SOCIETY AMENITY CONTROLLER
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { societyService } from '../../services/societyService';
import { requireSocietyAdmin } from '../../middleware/auth';

export class SocietyAmenityController {

  async createAmenity(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.name || !body.location || body.costPerHour === undefined) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Name, location, and cost per hour are required',
            },
          },
          { status: 400 }
        );
      }

      const data = {
        societyId: session.societyId!,
        name: body.name,
        description: body.description,
        location: body.location,
        capacity: body.capacity,
        costPerHour: body.costPerHour,
        isActive: body.isActive !== undefined ? body.isActive : true,
      };

      const amenity = await societyService.createAmenity(data);

      return NextResponse.json({ success: true, data: amenity }, { status: 201 });
    } catch (error: any) {
      console.error('Create amenity error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to create amenity',
          },
        },
        { status: 500 }
      );
    }
  }

  async updateAmenity(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      const updated = await societyService.updateAmenity(params.id, session.societyId!, body);

      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error: any) {
      console.error('Update amenity error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to update amenity',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const societyAmenityController = new SocietyAmenityController();
