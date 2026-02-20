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

    if (session.role !== 'society_admin') {
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

// GET /api/society/dashboard
router.get('/dashboard', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;

    // Get society info using admin email
    const society = await prisma.societies.findFirst({
      where: { admin_email: session.email },
    });

    if (!society) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found. Please complete your society setup.' },
      });
    }

    // Get dashboard stats
    const [residents, services, orders, revenue] = await Promise.all([
      prisma.residents.count({ where: { society_id: society.id } }),
      prisma.service_societies.count({ where: { society_id: society.id } }),
      prisma.orders.count({
        where: {
          residents: { society_id: society.id },
        },
      }),
      prisma.orders.aggregate({
        where: {
          residents: { society_id: society.id },
          status: 'completed',
        },
        _sum: { total_amount: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        society: {
          id: society.id,
          name: society.name,
          address: `${society.address_line1}, ${society.city}, ${society.state} ${society.pincode}`,
          totalUnits: society.total_flats,
        },
        stats: {
          totalResidents: residents,
          activeServices: services,
          totalOrders: orders,
          totalRevenue: revenue._sum.total_amount || 0,
        },
      },
    });
  } catch (error: any) {
    console.error('Society dashboard error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/society/residents
router.get('/residents', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;

    const society = await prisma.societies.findFirst({
      where: { admin_email: session.email },
    });

    if (!society) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found. Please complete your society setup.' },
      });
    }

    const residents = await prisma.residents.findMany({
      where: { society_id: society.id },
      include: {
        users: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            status: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      data: { residents },
    });
  } catch (error: any) {
    console.error('Residents error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/society/services
router.get('/services', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;

    const society = await prisma.societies.findFirst({
      where: { admin_email: session.email },
    });

    if (!society) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found. Please complete your society setup.' },
      });
    }

    const services = await prisma.service_societies.findMany({
      where: { society_id: society.id },
      include: {
        services: {
          include: {
            vendors: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: { services },
    });
  } catch (error: any) {
    console.error('Services error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

export default router;
