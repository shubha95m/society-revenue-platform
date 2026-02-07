// =====================================================
// RESIDENT SERVICE REQUEST CONTROLLER
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { residentService } from '../../services/residentService';
import { requireResident } from '../../middleware/auth';
import { ServiceRequestCreateData } from '../../types';

export class ResidentServiceController {

  async browseServices(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        category: searchParams.get('category') || undefined,
        search: searchParams.get('search') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await residentService.browseServices(session.societyId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Browse services error:', error);
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

  async createServiceRequest(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.serviceId || !body.description) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Service ID and description are required',
            },
          },
          { status: 400 }
        );
      }

      const data: ServiceRequestCreateData = {
        residentId: session.residentId!,
        societyId: session.societyId!,
        serviceId: body.serviceId,
        description: body.description,
        preferredDate: body.preferredDate ? new Date(body.preferredDate) : undefined,
        preferredTime: body.preferredTime,
        urgency: body.urgency,
      };

      const serviceRequest = await residentService.createServiceRequest(data);

      return NextResponse.json(
        { success: true, data: serviceRequest },
        { status: 201 }
      );
    } catch (error: any) {
      console.error('Create service request error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to create service request',
          },
        },
        { status: 500 }
      );
    }
  }

  async getServiceRequests(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const { searchParams } = new URL(req.url);

      const filters = {
        status: searchParams.get('status') || undefined,
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
      };

      const result = await residentService.getServiceRequests(session.residentId!, filters);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Get service requests error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch service requests',
          },
        },
        { status: 500 }
      );
    }
  }

  async getServiceRequestDetails(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const request = await residentService.getServiceRequestDetails(params.id, session.residentId!);

      return NextResponse.json({ success: true, data: request }, { status: 200 });
    } catch (error: any) {
      console.error('Get service request details error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to fetch service request details',
          },
        },
        { status: 500 }
      );
    }
  }

  async cancelServiceRequest(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireResident(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      const updated = await residentService.cancelServiceRequest(
        params.id,
        session.residentId!,
        body.reason
      );

      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error: any) {
      console.error('Cancel service request error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to cancel service request',
          },
        },
        { status: 500 }
      );
    }
  }

  async rateService(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
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

      const updated = await residentService.rateService(
        params.id,
        session.residentId!,
        body.rating,
        body.review
      );

      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error: any) {
      console.error('Rate service error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to rate service',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const residentServiceController = new ResidentServiceController();
