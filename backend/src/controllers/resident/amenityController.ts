// =====================================================
// RESIDENT AMENITY CONTROLLER
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { residentService } from '../../services/residentService';
import { requireResident } from '../../middleware/auth';
import { AmenityBookingCreateData } from '../../types';

export class ResidentAmenityController {

  async getAmenities(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const amenities = await residentService.getAmenities(session.societyId!);

      return NextResponse.json({ success: true, data: amenities }, { status: 200 });
    } catch (error: any) {
      console.error('Get amenities error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch amenities',
          },
        },
        { status: 500 }
      );
    }
  }

  async getBookings(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        status: searchParams.get('status') || undefined,
        upcoming: searchParams.get('upcoming') === 'true',
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await residentService.getAmenityBookings(session.residentId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get bookings error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch bookings',
          },
        },
        { status: 500 }
      );
    }
  }

  async createBooking(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.amenityId || !body.startTime || !body.endTime) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Amenity ID, start time, and end time are required',
            },
          },
          { status: 400 }
        );
      }

      const data: AmenityBookingCreateData = {
        residentId: session.residentId!,
        societyId: session.societyId!,
        amenityId: body.amenityId,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        purpose: body.purpose,
        guestCount: body.guestCount,
      };

      const booking = await residentService.createAmenityBooking(data);

      return NextResponse.json({ success: true, data: booking }, { status: 201 });
    } catch (error: any) {
      console.error('Create booking error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to create booking',
          },
        },
        { status: 500 }
      );
    }
  }

  async cancelBooking(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const updated = await residentService.cancelAmenityBooking(params.id, session.residentId!);

      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error: any) {
      console.error('Cancel booking error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to cancel booking',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const residentAmenityController = new ResidentAmenityController();
