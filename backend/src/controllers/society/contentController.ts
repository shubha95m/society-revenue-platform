// =====================================================
// SOCIETY CONTENT CONTROLLER - Notices & Documents
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { societyService } from '../../services/societyService';
import { requireSocietyAdmin } from '../../middleware/auth';

export class SocietyContentController {

  // Notices

  async createNotice(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.title || !body.content) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Title and content are required',
            },
          },
          { status: 400 }
        );
      }

      const data = {
        societyId: session.societyId!,
        createdBy: session.userId,
        title: body.title,
        content: body.content,
        priority: body.priority || 'medium',
      };

      const notice = await societyService.createNotice(data);

      return NextResponse.json({ success: true, data: notice }, { status: 201 });
    } catch (error: any) {
      console.error('Create notice error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to create notice',
          },
        },
        { status: 500 }
      );
    }
  }

  async deleteNotice(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const result = await societyService.deleteNotice(params.id, session.societyId!);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Delete notice error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to delete notice',
          },
        },
        { status: 500 }
      );
    }
  }

  // Documents

  async uploadDocument(req: NextRequest): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const body = await req.json();

      if (!body.name || !body.category || !body.fileUrl) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Name, category, and file URL are required',
            },
          },
          { status: 400 }
        );
      }

      const data = {
        societyId: session.societyId!,
        uploadedBy: session.userId,
        name: body.name,
        category: body.category,
        fileUrl: body.fileUrl,
        fileSize: body.fileSize,
        mimeType: body.mimeType,
      };

      const document = await societyService.uploadDocument(data);

      return NextResponse.json({ success: true, data: document }, { status: 201 });
    } catch (error: any) {
      console.error('Upload document error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to upload document',
          },
        },
        { status: 500 }
      );
    }
  }

  async deleteDocument(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const authResult = await requireSocietyAdmin(req as any);
      if (authResult instanceof NextResponse) return authResult;

      const session = authResult;
      const result = await societyService.deleteDocument(params.id, session.societyId!);

      return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
      console.error('Delete document error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'Failed to delete document',
          },
        },
        { status: 500 }
      );
    }
  }
}

export const societyContentController = new SocietyContentController();
