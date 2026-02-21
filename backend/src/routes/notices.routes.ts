import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { verifyToken, isSocietyAdmin } from '../lib/auth';

const router = Router();

// Authentication middleware - requires any authenticated user
async function requireAuth(req: Request, res: Response, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { code: 'NO_TOKEN', message: 'No authorization token provided' },
      });
    }

    const token = authHeader.substring(7);
    const session = await verifyToken(token);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
      });
    }

    (req as any).session = session;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'AUTH_ERROR', message: 'Authentication failed' },
    });
  }
}

// Authentication middleware - requires society admin
async function requireSocietyAdmin(req: Request, res: Response, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { code: 'NO_TOKEN', message: 'No authorization token provided' },
      });
    }

    const token = authHeader.substring(7);
    const session = await verifyToken(token);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
      });
    }

    if (!isSocietyAdmin(session)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Society admin access required' },
      });
    }

    (req as any).session = session;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'AUTH_ERROR', message: 'Authentication failed' },
    });
  }
}

// Helper function to get society ID for the authenticated user
async function getSocietyId(session: any): Promise<string | null> {
  if (session.role === 'society_admin') {
    // For society admin, get society from admin_email
    const society = await prisma.societies.findFirst({
      where: { admin_email: session.email },
      select: { id: true },
    });
    return society?.id || null;
  } else if (session.role === 'resident') {
    // For resident, get society from resident record
    const resident = await prisma.residents.findFirst({
      where: { user_id: session.userId },
      select: { society_id: true },
    });
    return resident?.society_id || null;
  }
  return null;
}

// GET /api/notices - List all notices for the user's society
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;

    // Get society ID based on user role
    const societyId = await getSocietyId(session);

    if (!societyId) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found for this user' },
      });
    }

    // Get query parameters for filtering
    const { category, priority, limit = 50, offset = 0 } = req.query;

    // Build where clause
    const where: any = {
      society_id: societyId,
      deleted_at: null,
      is_active: true,
    };

    if (category) {
      where.category = category;
    }

    if (priority) {
      where.priority = priority;
    }

    // Fetch notices with pagination
    const [notices, total] = await Promise.all([
      prisma.$queryRaw`
        SELECT
          id,
          society_id,
          title,
          content,
          category,
          priority,
          is_active,
          published_by_user_id,
          published_at,
          expires_at,
          target_towers,
          target_floors,
          views_count,
          attachments,
          created_at,
          updated_at
        FROM notices
        WHERE society_id = ${societyId}::uuid
          AND deleted_at IS NULL
          AND is_active = true
          ${category ? prisma.$queryRaw`AND category = ${category}::notice_category` : prisma.$queryRaw``}
          ${priority ? prisma.$queryRaw`AND priority = ${priority}::notice_priority` : prisma.$queryRaw``}
        ORDER BY published_at DESC
        LIMIT ${Number(limit)}
        OFFSET ${Number(offset)}
      `,
      prisma.$queryRaw`
        SELECT COUNT(*) as count
        FROM notices
        WHERE society_id = ${societyId}::uuid
          AND deleted_at IS NULL
          AND is_active = true
          ${category ? prisma.$queryRaw`AND category = ${category}::notice_category` : prisma.$queryRaw``}
          ${priority ? prisma.$queryRaw`AND priority = ${priority}::notice_priority` : prisma.$queryRaw``}
      `,
    ]);

    res.json({
      success: true,
      data: {
        notices,
        pagination: {
          total: Number((total as any)[0].count),
          limit: Number(limit),
          offset: Number(offset),
        },
      },
    });
  } catch (error: any) {
    console.error('List notices error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/notices/:id - Get notice details
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { id } = req.params;

    // Get society ID based on user role
    const societyId = await getSocietyId(session);

    if (!societyId) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found for this user' },
      });
    }

    // Fetch the notice
    const notice = await prisma.$queryRaw`
      SELECT
        id,
        society_id,
        title,
        content,
        category,
        priority,
        is_active,
        published_by_user_id,
        published_at,
        expires_at,
        target_towers,
        target_floors,
        views_count,
        attachments,
        created_at,
        updated_at
      FROM notices
      WHERE id = ${id}::uuid
        AND society_id = ${societyId}::uuid
        AND deleted_at IS NULL
    `;

    if (!notice || (notice as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOTICE_NOT_FOUND', message: 'Notice not found' },
      });
    }

    // Increment views count
    await prisma.$executeRaw`
      UPDATE notices
      SET views_count = views_count + 1
      WHERE id = ${id}::uuid
    `;

    res.json({
      success: true,
      data: { notice: (notice as any[])[0] },
    });
  } catch (error: any) {
    console.error('Get notice error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// POST /api/notices - Create a new notice (society admin only)
router.post('/', requireSocietyAdmin, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;

    // Get society ID
    const societyId = await getSocietyId(session);

    if (!societyId) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found for this admin' },
      });
    }

    // Extract and validate request body
    const {
      title,
      content,
      category,
      priority = 'normal',
      expiresAt,
      targetTowers,
      targetFloors,
      attachments,
    } = req.body;

    // Validation
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title, content, and category are required',
        },
      });
    }

    // Valid categories and priorities
    const validCategories = ['announcement', 'maintenance', 'event', 'policy', 'emergency', 'other'];
    const validPriorities = ['low', 'normal', 'high', 'urgent'];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
        },
      });
    }

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`,
        },
      });
    }

    // Create notice using raw SQL to handle ENUM types
    const result = await prisma.$queryRaw`
      INSERT INTO notices (
        society_id,
        title,
        content,
        category,
        priority,
        published_by_user_id,
        expires_at,
        target_towers,
        target_floors,
        attachments,
        is_active,
        published_at
      ) VALUES (
        ${societyId}::uuid,
        ${title},
        ${content},
        ${category}::notice_category,
        ${priority}::notice_priority,
        ${session.userId}::uuid,
        ${expiresAt ? new Date(expiresAt) : null}::timestamp,
        ${targetTowers ? `{${targetTowers.join(',')}}` : null}::text[],
        ${targetFloors ? `{${targetFloors.join(',')}}` : null}::integer[],
        ${attachments ? JSON.stringify(attachments) : '[]'}::jsonb,
        true,
        CURRENT_TIMESTAMP
      )
      RETURNING
        id,
        society_id,
        title,
        content,
        category,
        priority,
        is_active,
        published_by_user_id,
        published_at,
        expires_at,
        target_towers,
        target_floors,
        views_count,
        attachments,
        created_at,
        updated_at
    `;

    res.status(201).json({
      success: true,
      data: { notice: (result as any[])[0] },
    });
  } catch (error: any) {
    console.error('Create notice error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// PATCH /api/notices/:id - Update a notice (society admin only)
router.patch('/:id', requireSocietyAdmin, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { id } = req.params;

    // Get society ID
    const societyId = await getSocietyId(session);

    if (!societyId) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found for this admin' },
      });
    }

    // Check if notice exists and belongs to this society
    const existingNotice = await prisma.$queryRaw`
      SELECT id, society_id
      FROM notices
      WHERE id = ${id}::uuid
        AND society_id = ${societyId}::uuid
        AND deleted_at IS NULL
    `;

    if (!existingNotice || (existingNotice as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOTICE_NOT_FOUND', message: 'Notice not found' },
      });
    }

    // Extract fields to update
    const {
      title,
      content,
      category,
      priority,
      expiresAt,
      targetTowers,
      targetFloors,
      attachments,
      isActive,
    } = req.body;

    // Validation
    if (category) {
      const validCategories = ['announcement', 'maintenance', 'event', 'policy', 'emergency', 'other'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
          },
        });
      }
    }

    if (priority) {
      const validPriorities = ['low', 'normal', 'high', 'urgent'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`,
          },
        });
      }
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push(`title = $${updates.length + 1}`);
      values.push(title);
    }
    if (content !== undefined) {
      updates.push(`content = $${updates.length + 1}`);
      values.push(content);
    }
    if (category !== undefined) {
      updates.push(`category = $${updates.length + 1}::notice_category`);
      values.push(category);
    }
    if (priority !== undefined) {
      updates.push(`priority = $${updates.length + 1}::notice_priority`);
      values.push(priority);
    }
    if (expiresAt !== undefined) {
      updates.push(`expires_at = $${updates.length + 1}::timestamp`);
      values.push(expiresAt ? new Date(expiresAt) : null);
    }
    if (targetTowers !== undefined) {
      updates.push(`target_towers = $${updates.length + 1}::text[]`);
      values.push(targetTowers ? `{${targetTowers.join(',')}}` : null);
    }
    if (targetFloors !== undefined) {
      updates.push(`target_floors = $${updates.length + 1}::integer[]`);
      values.push(targetFloors ? `{${targetFloors.join(',')}}` : null);
    }
    if (attachments !== undefined) {
      updates.push(`attachments = $${updates.length + 1}::jsonb`);
      values.push(JSON.stringify(attachments));
    }
    if (isActive !== undefined) {
      updates.push(`is_active = $${updates.length + 1}`);
      values.push(isActive);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'No fields to update' },
      });
    }

    // Always update updated_at
    updates.push('updated_at = CURRENT_TIMESTAMP');

    // Update the notice
    const result = await prisma.$queryRaw`
      UPDATE notices
      SET
        ${title !== undefined ? prisma.$queryRaw`title = ${title},` : prisma.$queryRaw``}
        ${content !== undefined ? prisma.$queryRaw`content = ${content},` : prisma.$queryRaw``}
        ${category !== undefined ? prisma.$queryRaw`category = ${category}::notice_category,` : prisma.$queryRaw``}
        ${priority !== undefined ? prisma.$queryRaw`priority = ${priority}::notice_priority,` : prisma.$queryRaw``}
        ${expiresAt !== undefined ? prisma.$queryRaw`expires_at = ${expiresAt ? new Date(expiresAt) : null}::timestamp,` : prisma.$queryRaw``}
        ${targetTowers !== undefined ? prisma.$queryRaw`target_towers = ${targetTowers ? `{${targetTowers.join(',')}}` : null}::text[],` : prisma.$queryRaw``}
        ${targetFloors !== undefined ? prisma.$queryRaw`target_floors = ${targetFloors ? `{${targetFloors.join(',')}}` : null}::integer[],` : prisma.$queryRaw``}
        ${attachments !== undefined ? prisma.$queryRaw`attachments = ${JSON.stringify(attachments)}::jsonb,` : prisma.$queryRaw``}
        ${isActive !== undefined ? prisma.$queryRaw`is_active = ${isActive},` : prisma.$queryRaw``}
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}::uuid
        AND society_id = ${societyId}::uuid
      RETURNING
        id,
        society_id,
        title,
        content,
        category,
        priority,
        is_active,
        published_by_user_id,
        published_at,
        expires_at,
        target_towers,
        target_floors,
        views_count,
        attachments,
        created_at,
        updated_at
    `;

    res.json({
      success: true,
      data: { notice: (result as any[])[0] },
    });
  } catch (error: any) {
    console.error('Update notice error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// DELETE /api/notices/:id - Delete a notice (society admin only)
router.delete('/:id', requireSocietyAdmin, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { id } = req.params;

    // Get society ID
    const societyId = await getSocietyId(session);

    if (!societyId) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found for this admin' },
      });
    }

    // Check if notice exists and belongs to this society
    const existingNotice = await prisma.$queryRaw`
      SELECT id, society_id
      FROM notices
      WHERE id = ${id}::uuid
        AND society_id = ${societyId}::uuid
        AND deleted_at IS NULL
    `;

    if (!existingNotice || (existingNotice as any[]).length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOTICE_NOT_FOUND', message: 'Notice not found' },
      });
    }

    // Soft delete the notice
    await prisma.$executeRaw`
      UPDATE notices
      SET deleted_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}::uuid
        AND society_id = ${societyId}::uuid
    `;

    res.json({
      success: true,
      data: { message: 'Notice deleted successfully' },
    });
  } catch (error: any) {
    console.error('Delete notice error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

export default router;
