import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { verifyToken } from '../lib/auth';

const router = Router();

// Authentication middleware
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

    if (session.role !== 'vendor') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Vendor access required' },
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

// GET /api/vendor/dashboard
router.get('/dashboard', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;

    // Get vendor info
    const vendor = await prisma.vendors.findFirst({
      where: { user_id: session.userId },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: { code: 'VENDOR_NOT_FOUND', message: 'Vendor profile not found' },
      });
    }

    // Get dashboard stats
    const [totalOrders, activeContracts, contractsForSocieties, totalEarnings] = await Promise.all([
      prisma.orders.count({ where: { vendor_id: vendor.id } }),
      prisma.contracts.count({
        where: {
          vendor_id: vendor.id,
          status: 'active',
        }
      }),
      prisma.contracts.findMany({
        where: {
          vendor_id: vendor.id,
          status: { in: ['active', 'pending'] },
        },
        select: {
          society_id: true,
        },
      }),
      prisma.orders.aggregate({
        where: {
          vendor_id: vendor.id,
          status: 'completed',
        },
        _sum: { total_amount: true },
      }),
    ]);

    // Count unique societies
    const totalSocieties = new Set(contractsForSocieties.map(c => c.society_id)).size;

    res.json({
      success: true,
      data: {
        vendor: {
          id: vendor.id,
          businessName: vendor.business_name,
          businessType: vendor.business_type,
          status: vendor.status,
        },
        stats: {
          totalOrders,
          activeContracts,
          totalSocieties,
          totalEarnings: totalEarnings._sum.total_amount || 0,
        },
      },
    });
  } catch (error: any) {
    console.error('Vendor dashboard error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/vendor/orders
router.get('/orders', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { status, limit = '50', offset = '0' } = req.query;

    const vendor = await prisma.vendors.findFirst({
      where: { user_id: session.userId },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: { code: 'VENDOR_NOT_FOUND', message: 'Vendor profile not found' },
      });
    }

    const whereClause: any = { vendor_id: vendor.id };
    if (status && typeof status === 'string') {
      whereClause.status = status;
    }

    const orders = await prisma.orders.findMany({
      where: whereClause,
      include: {
        services: true,
        residents: {
          include: {
            societies: {
              select: {
                name: true,
                city: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const totalCount = await prisma.orders.count({ where: whereClause });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total: totalCount,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
        },
      },
    });
  } catch (error: any) {
    console.error('Vendor orders error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/vendor/contracts
router.get('/contracts', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { status } = req.query;

    const vendor = await prisma.vendors.findFirst({
      where: { user_id: session.userId },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: { code: 'VENDOR_NOT_FOUND', message: 'Vendor profile not found' },
      });
    }

    const whereClause: any = { vendor_id: vendor.id };
    if (status && typeof status === 'string') {
      whereClause.status = status;
    }

    const contracts = await prisma.contracts.findMany({
      where: whereClause,
      include: {
        societies: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            total_flats: true,
          },
        },
        services: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      data: { contracts },
    });
  } catch (error: any) {
    console.error('Vendor contracts error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/vendor/discover
router.get('/discover', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { city, state, search } = req.query;

    const vendor = await prisma.vendors.findFirst({
      where: { user_id: session.userId },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: { code: 'VENDOR_NOT_FOUND', message: 'Vendor profile not found' },
      });
    }

    // Get societies that vendor is not already contracted with
    const existingContracts = await prisma.contracts.findMany({
      where: { vendor_id: vendor.id },
      select: { society_id: true },
    });

    const excludedSocietyIds = existingContracts.map(c => c.society_id);

    const whereClause: any = {
      status: 'approved',
      id: { notIn: excludedSocietyIds },
    };

    if (city && typeof city === 'string') {
      whereClause.city = { contains: city, mode: 'insensitive' };
    }

    if (state && typeof state === 'string') {
      whereClause.state = { contains: state, mode: 'insensitive' };
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const societies = await prisma.societies.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        pincode: true,
        total_flats: true,
        address_line1: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
      take: 50,
    });

    res.json({
      success: true,
      data: { societies },
    });
  } catch (error: any) {
    console.error('Vendor discover error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/vendor/earnings
router.get('/earnings', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { startDate, endDate } = req.query;

    const vendor = await prisma.vendors.findFirst({
      where: { user_id: session.userId },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: { code: 'VENDOR_NOT_FOUND', message: 'Vendor profile not found' },
      });
    }

    const whereClause: any = {
      vendor_id: vendor.id,
      status: 'completed',
    };

    if (startDate && typeof startDate === 'string') {
      whereClause.created_at = { gte: new Date(startDate) };
    }

    if (endDate && typeof endDate === 'string') {
      whereClause.created_at = {
        ...whereClause.created_at,
        lte: new Date(endDate),
      };
    }

    const [earnings, ordersByMonth, topServices] = await Promise.all([
      // Total earnings
      prisma.orders.aggregate({
        where: whereClause,
        _sum: { total_amount: true },
        _count: true,
        _avg: { total_amount: true },
      }),

      // Earnings by month (last 6 months)
      prisma.$queryRaw`
        SELECT
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as order_count,
          SUM(total_amount) as total_earnings
        FROM orders
        WHERE vendor_id = ${vendor.id}
          AND status = 'completed'
          AND created_at >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC
      `,

      // Top performing services
      prisma.orders.groupBy({
        by: ['service_id'],
        where: whereClause,
        _sum: { total_amount: true },
        _count: true,
        orderBy: { _sum: { total_amount: 'desc' } },
        take: 5,
      }),
    ]);

    // Get service details for top services
    const serviceIds = topServices.map(s => s.service_id);
    const services = await prisma.services.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, name: true, category: true },
    });

    const topServicesWithDetails = topServices.map(ts => ({
      ...ts,
      service: services.find(s => s.id === ts.service_id),
    }));

    res.json({
      success: true,
      data: {
        summary: {
          totalEarnings: earnings._sum.total_amount || 0,
          totalOrders: earnings._count,
          averageOrderValue: earnings._avg.total_amount || 0,
        },
        ordersByMonth,
        topServices: topServicesWithDetails,
      },
    });
  } catch (error: any) {
    console.error('Vendor earnings error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// POST /api/vendor/connect-society
router.post('/connect-society', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { societyId, serviceId, message } = req.body;

    if (!societyId || !serviceId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Society ID and Service ID are required' },
      });
    }

    const vendor = await prisma.vendors.findFirst({
      where: { user_id: session.userId },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: { code: 'VENDOR_NOT_FOUND', message: 'Vendor profile not found' },
      });
    }

    // Check if contract already exists
    const existingContract = await prisma.contracts.findFirst({
      where: {
        vendor_id: vendor.id,
        society_id: societyId,
        service_id: serviceId,
      },
    });

    if (existingContract) {
      return res.status(400).json({
        success: false,
        error: { code: 'CONTRACT_EXISTS', message: 'Connection request already exists' },
      });
    }

    // Create contract request
    const contract = await prisma.contracts.create({
      data: {
        id: crypto.randomUUID(),
        vendor_id: vendor.id,
        society_id: societyId,
        service_id: serviceId,
        status: 'pending',
        terms: message || 'Connection request from vendor',
      },
    });

    res.status(201).json({
      success: true,
      data: { contract },
      message: 'Connection request sent successfully',
    });
  } catch (error: any) {
    console.error('Connect society error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

export default router;