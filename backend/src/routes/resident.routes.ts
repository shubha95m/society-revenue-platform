import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { verifySession } from '../lib/auth';

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
    const session = await verifySession(token);

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

// GET /api/resident/dashboard
router.get('/dashboard', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;

    // Get resident info
    const resident = await prisma.residents.findFirst({
      where: { user_id: session.userId },
      include: {
        societies: true,
      },
    });

    if (!resident) {
      return res.status(404).json({
        success: false,
        error: { code: 'RESIDENT_NOT_FOUND', message: 'Resident profile not found' },
      });
    }

    // Get dashboard stats
    const [orders, services, complaints] = await Promise.all([
      prisma.orders.count({ where: { resident_id: resident.id } }),
      prisma.services.count({ where: { status: 'active' } }),
      prisma.complaints.count({ where: { resident_id: resident.id } }),
    ]);

    res.json({
      success: true,
      data: {
        resident: {
          id: resident.id,
          name: resident.name,
          flatNumber: resident.flat_number,
          society: resident.societies?.name,
        },
        stats: {
          totalOrders: orders,
          availableServices: services,
          complaints: complaints,
        },
      },
    });
  } catch (error: any) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/resident/orders
router.get('/orders', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;

    const resident = await prisma.residents.findFirst({
      where: { user_id: session.userId },
    });

    if (!resident) {
      return res.status(404).json({
        success: false,
        error: { code: 'RESIDENT_NOT_FOUND', message: 'Resident profile not found' },
      });
    }

    const orders = await prisma.orders.findMany({
      where: { resident_id: resident.id },
      include: {
        services: true,
        vendors: true,
      },
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      data: { orders },
    });
  } catch (error: any) {
    console.error('Orders error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/resident/services
router.get('/services', requireAuth, async (req: Request, res: Response) => {
  try {
    const services = await prisma.services.findMany({
      where: { status: 'active' },
      include: {
        vendors: true,
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
