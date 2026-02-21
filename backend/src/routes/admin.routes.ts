import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { verifyToken } from '../lib/auth';

const router = Router();

// Authentication middleware for platform admin
async function requirePlatformAdmin(req: Request, res: Response, next: any) {
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

    if (session.role !== 'platform_admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Platform admin access required' },
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

// GET /api/admin/dashboard
router.get('/dashboard', requirePlatformAdmin, async (req: Request, res: Response) => {
  try {
    // Get platform-wide statistics
    const [
      totalSocieties,
      totalVendors,
      totalResidents,
      totalRevenue,
      pendingSocieties,
      pendingVendors,
      activeOrders,
    ] = await Promise.all([
      prisma.societies.count({ where: { status: 'approved' } }),
      prisma.vendors.count({ where: { status: 'approved' } }),
      prisma.residents.count({ where: { status: 'active' } }),
      prisma.orders.aggregate({
        where: { status: 'completed' },
        _sum: { total_amount: true },
      }),
      prisma.societies.count({ where: { status: 'pending' } }),
      prisma.vendors.count({ where: { status: 'pending' } }),
      prisma.orders.count({ where: { status: { in: ['pending', 'in_progress'] } } }),
    ]);

    // Get recent activities
    const recentSocieties = await prisma.societies.findMany({
      where: { status: 'pending' },
      orderBy: { created_at: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        total_flats: true,
        created_at: true,
      },
    });

    const recentVendors = await prisma.vendors.findMany({
      where: { status: 'pending' },
      orderBy: { created_at: 'desc' },
      take: 5,
      select: {
        id: true,
        business_name: true,
        business_type: true,
        city: true,
        state: true,
        created_at: true,
      },
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalSocieties,
          totalVendors,
          totalResidents,
          totalRevenue: totalRevenue._sum.total_amount || 0,
          pendingSocieties,
          pendingVendors,
          activeOrders,
        },
        recentActivities: {
          societies: recentSocieties,
          vendors: recentVendors,
        },
      },
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/admin/societies
router.get('/societies', requirePlatformAdmin, async (req: Request, res: Response) => {
  try {
    const { status, search, limit = '50', offset = '0' } = req.query;

    const whereClause: any = {};

    if (status && typeof status === 'string') {
      whereClause.status = status;
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { admin_email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const societies = await prisma.societies.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const totalCount = await prisma.societies.count({ where: whereClause });

    res.json({
      success: true,
      data: {
        societies,
        pagination: {
          total: totalCount,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
        },
      },
    });
  } catch (error: any) {
    console.error('Admin societies error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/admin/societies/pending
router.get('/societies/pending', requirePlatformAdmin, async (req: Request, res: Response) => {
  try {
    const societies = await prisma.societies.findMany({
      where: { status: 'pending' },
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      data: { societies },
    });
  } catch (error: any) {
    console.error('Admin pending societies error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// PATCH /api/admin/societies/:id/approve
router.patch('/societies/:id/approve', requirePlatformAdmin, async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];

    const society = await prisma.societies.update({
      where: { id },
      data: { status: 'approved' },
    });

    res.json({
      success: true,
      data: { society },
      message: 'Society approved successfully',
    });
  } catch (error: any) {
    console.error('Approve society error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// PATCH /api/admin/societies/:id/reject
router.patch('/societies/:id/reject', requirePlatformAdmin, async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const { reason } = req.body;

    const society = await prisma.societies.update({
      where: { id },
      data: { status: 'rejected' },
    });

    res.json({
      success: true,
      data: { society },
      message: 'Society rejected',
    });
  } catch (error: any) {
    console.error('Reject society error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/admin/vendors
router.get('/vendors', requirePlatformAdmin, async (req: Request, res: Response) => {
  try {
    const { status, search, limit = '50', offset = '0' } = req.query;

    const whereClause: any = {};

    if (status && typeof status === 'string') {
      whereClause.status = status;
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        { business_name: { contains: search, mode: 'insensitive' } },
        { business_type: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const vendors = await prisma.vendors.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const totalCount = await prisma.vendors.count({ where: whereClause });

    res.json({
      success: true,
      data: {
        vendors,
        pagination: {
          total: totalCount,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
        },
      },
    });
  } catch (error: any) {
    console.error('Admin vendors error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/admin/vendors/pending
router.get('/vendors/pending', requirePlatformAdmin, async (req: Request, res: Response) => {
  try {
    const vendors = await prisma.vendors.findMany({
      where: { status: 'pending' },
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      data: { vendors },
    });
  } catch (error: any) {
    console.error('Admin pending vendors error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// PATCH /api/admin/vendors/:id/approve
router.patch('/vendors/:id/approve', requirePlatformAdmin, async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];

    const vendor = await prisma.vendors.update({
      where: { id },
      data: { status: 'approved' },
    });

    res.json({
      success: true,
      data: { vendor },
      message: 'Vendor approved successfully',
    });
  } catch (error: any) {
    console.error('Approve vendor error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// PATCH /api/admin/vendors/:id/reject
router.patch('/vendors/:id/reject', requirePlatformAdmin, async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const { reason } = req.body;

    const vendor = await prisma.vendors.update({
      where: { id },
      data: { status: 'rejected' },
    });

    res.json({
      success: true,
      data: { vendor },
      message: 'Vendor rejected',
    });
  } catch (error: any) {
    console.error('Reject vendor error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/admin/analytics
router.get('/analytics', requirePlatformAdmin, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter: any = {};
    if (startDate && typeof startDate === 'string') {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate && typeof endDate === 'string') {
      dateFilter.lte = new Date(endDate);
    }

    // Revenue analytics
    const [revenueByMonth, ordersByStatus, topSocieties, topVendors] = await Promise.all([
      // Revenue by month (last 12 months)
      prisma.$queryRaw`
        SELECT
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as order_count,
          SUM(total_amount) as total_revenue
        FROM orders
        WHERE status = 'completed'
          AND created_at >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC
      `,

      // Orders by status
      prisma.orders.groupBy({
        by: ['status'],
        _count: true,
        _sum: { total_amount: true },
      }),

      // Top societies by revenue
      prisma.$queryRaw`
        SELECT
          s.id,
          s.name,
          s.city,
          s.state,
          COUNT(o.id) as order_count,
          SUM(o.total_amount) as total_revenue
        FROM societies s
        LEFT JOIN residents r ON r.society_id = s.id
        LEFT JOIN orders o ON o.resident_id = r.id AND o.status = 'completed'
        WHERE s.status = 'approved'
        GROUP BY s.id, s.name, s.city, s.state
        ORDER BY total_revenue DESC NULLS LAST
        LIMIT 10
      `,

      // Top vendors by revenue
      prisma.$queryRaw`
        SELECT
          v.id,
          v.business_name,
          v.business_type,
          v.city,
          COUNT(o.id) as order_count,
          SUM(o.total_amount) as total_revenue
        FROM vendors v
        LEFT JOIN orders o ON o.vendor_id = v.id AND o.status = 'completed'
        WHERE v.status = 'approved'
        GROUP BY v.id, v.business_name, v.business_type, v.city
        ORDER BY total_revenue DESC NULLS LAST
        LIMIT 10
      `,
    ]);

    res.json({
      success: true,
      data: {
        revenueByMonth,
        ordersByStatus,
        topSocieties,
        topVendors,
      },
    });
  } catch (error: any) {
    console.error('Admin analytics error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

export default router;