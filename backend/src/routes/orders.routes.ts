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

    (req as any).session = session;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'AUTH_ERROR', message: 'Authentication failed' },
    });
  }
}

// Helper function to generate order number
async function generateOrderNumber(): Promise<string> {
  const count = await prisma.orders.count();
  const year = new Date().getFullYear();
  return `ORD-${year}-${String(count + 1).padStart(6, '0')}`;
}

// GET /api/orders - List orders (filtered by role)
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { status, payment_status, limit = '50', offset = '0' } = req.query;

    let orders;
    let totalCount;

    if (session.role === 'resident') {
      // Residents see only their own orders
      const resident = await prisma.residents.findFirst({
        where: { user_id: session.userId },
      });

      if (!resident) {
        return res.status(404).json({
          success: false,
          error: { code: 'RESIDENT_NOT_FOUND', message: 'Resident profile not found' },
        });
      }

      const whereClause: any = { resident_id: resident.id };
      if (status && typeof status === 'string') whereClause.status = status;
      if (payment_status && typeof payment_status === 'string') {
        whereClause.payment_status = payment_status;
      }

      orders = await prisma.orders.findMany({
        where: whereClause,
        include: {
          services: {
            select: {
              id: true,
              name: true,
              category: true,
              base_price: true,
            },
          },
          vendors: {
            select: {
              id: true,
              business_name: true,
              business_type: true,
              phone: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      });

      totalCount = await prisma.orders.count({ where: whereClause });
    } else if (session.role === 'vendor') {
      // Vendors see orders assigned to them
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
      if (status && typeof status === 'string') whereClause.status = status;
      if (payment_status && typeof payment_status === 'string') {
        whereClause.payment_status = payment_status;
      }

      orders = await prisma.orders.findMany({
        where: whereClause,
        include: {
          services: {
            select: {
              id: true,
              name: true,
              category: true,
              base_price: true,
            },
          },
          residents: {
            select: {
              id: true,
              name: true,
              flat_number: true,
              phone: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      });

      totalCount = await prisma.orders.count({ where: whereClause });
    } else if (session.role === 'society_admin') {
      // Society admins see all orders for their society
      const society = await prisma.societies.findFirst({
        where: { admin_email: session.email },
      });

      if (!society) {
        return res.status(404).json({
          success: false,
          error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found' },
        });
      }

      const whereClause: any = { society_id: society.id };
      if (status && typeof status === 'string') whereClause.status = status;
      if (payment_status && typeof payment_status === 'string') {
        whereClause.payment_status = payment_status;
      }

      orders = await prisma.orders.findMany({
        where: whereClause,
        include: {
          services: {
            select: {
              id: true,
              name: true,
              category: true,
              base_price: true,
            },
          },
          residents: {
            select: {
              id: true,
              name: true,
              flat_number: true,
              phone: true,
            },
          },
          vendors: {
            select: {
              id: true,
              business_name: true,
              business_type: true,
              phone: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      });

      totalCount = await prisma.orders.count({ where: whereClause });
    } else {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

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
    console.error('List orders error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/orders/:id - Get order details
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const order = await prisma.orders.findUnique({
      where: { id },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            category: true,
            base_price: true,
            description: true,
          },
        },
        residents: {
          select: {
            id: true,
            name: true,
            flat_number: true,
            phone: true,
            user_id: true,
            society_id: true,
          },
        },
        vendors: {
          select: {
            id: true,
            business_name: true,
            business_type: true,
            phone: true,
            user_id: true,
          },
        },
      },
    });

    // Get society info separately if needed
    let society = null;
    if (order && order.residents) {
      society = await prisma.societies.findUnique({
        where: { id: order.residents.society_id },
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
          admin_email: true,
        },
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' },
      });
    }

    // Authorization check
    if (session.role === 'resident') {
      if (order.residents?.user_id !== session.userId) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only view your own orders' },
        });
      }
    } else if (session.role === 'vendor') {
      if (order.vendors?.user_id !== session.userId) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only view your own orders' },
        });
      }
    } else if (session.role === 'society_admin') {
      if (society?.admin_email !== session.email) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only view orders from your society' },
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    res.json({
      success: true,
      data: { order: { ...order, society } },
    });
  } catch (error: any) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// POST /api/orders - Create order (resident)
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { service_id, vendor_id, description, scheduled_date } = req.body;

    // Only residents can create orders
    if (session.role !== 'resident') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only residents can create orders' },
      });
    }

    // Validation
    if (!service_id || !vendor_id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Service ID and Vendor ID are required',
        },
      });
    }

    // Get resident info
    const resident = await prisma.residents.findFirst({
      where: { user_id: session.userId },
    });

    if (!resident) {
      return res.status(404).json({
        success: false,
        error: { code: 'RESIDENT_NOT_FOUND', message: 'Resident profile not found' },
      });
    }

    // Verify vendor exists
    const vendor = await prisma.vendors.findUnique({
      where: { id: vendor_id },
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: { code: 'VENDOR_NOT_FOUND', message: 'Vendor not found' },
      });
    }

    // Verify service exists
    const service = await prisma.services.findUnique({
      where: { id: service_id },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' },
      });
    }

    // Check if vendor has an active contract with the society for this service
    const contract = await prisma.contracts.findFirst({
      where: {
        vendor_id: vendor_id,
        society_id: resident.society_id,
        service_id: service_id,
        status: 'active',
      },
    });

    if (!contract) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_CONTRACT',
          message: 'Vendor does not have an active contract for this service',
        },
      });
    }

    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Calculate total amount (using service base price)
    const totalAmount = Number(service.base_price);

    // Create order
    const order = await prisma.orders.create({
      data: {
        id: crypto.randomUUID(),
        order_number: orderNumber,
        resident_id: resident.id,
        vendor_id: vendor_id,
        service_id: service_id,
        description: description || `Service request for ${service.name}`,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: 'pending',
        scheduled_date: scheduled_date ? new Date(scheduled_date) : null,
      },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            category: true,
            base_price: true,
          },
        },
        vendors: {
          select: {
            id: true,
            business_name: true,
            business_type: true,
            phone: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: { order },
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body;

    // Validation
    if (!status) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Status is required' },
      });
    }

    // Verify order exists
    const existingOrder = await prisma.orders.findUnique({
      where: { id },
      include: {
        residents: {
          select: { user_id: true },
        },
        vendors: {
          select: { user_id: true },
        },
      },
    });

    // Get society info separately if needed
    let society = null;
    if (existingOrder) {
      // Get resident to find society_id
      const resident = await prisma.residents.findUnique({
        where: { id: existingOrder.resident_id },
        select: { society_id: true },
      });
      if (resident) {
        society = await prisma.societies.findUnique({
          where: { id: resident.society_id },
          select: { admin_email: true },
        });
      }
    }

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' },
      });
    }

    // Authorization and allowed status transitions
    let updateData: any = { status };

    if (session.role === 'vendor') {
      // Vendors can accept, reject, in_progress, or complete orders
      if (existingOrder.vendors?.user_id !== session.userId) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only update your own orders' },
        });
      }

      const allowedStatuses = ['accepted', 'rejected', 'in_progress', 'completed'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Vendors can only set status to: accepted, rejected, in_progress, or completed',
          },
        });
      }

      if (status === 'completed') {
        updateData.completed_at = new Date();
      }
    } else if (session.role === 'resident') {
      // Residents can cancel orders
      if (existingOrder.residents?.user_id !== session.userId) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only update your own orders' },
        });
      }

      if (status !== 'cancelled') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Residents can only cancel orders',
          },
        });
      }

      // Only allow cancellation if order is pending or accepted
      if (!['pending', 'accepted'].includes(existingOrder.status)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_CANCELLATION',
            message: 'Can only cancel pending or accepted orders',
          },
        });
      }
    } else if (session.role === 'society_admin') {
      // Society admins can update any status for their society orders
      if (society?.admin_email !== session.email) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only update orders from your society' },
        });
      }

      if (status === 'completed') {
        updateData.completed_at = new Date();
      }
    } else {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    // Update order
    const order = await prisma.orders.update({
      where: { id },
      data: updateData,
      include: {
        services: {
          select: {
            id: true,
            name: true,
            category: true,
            base_price: true,
          },
        },
        residents: {
          select: {
            id: true,
            name: true,
            flat_number: true,
          },
        },
        vendors: {
          select: {
            id: true,
            business_name: true,
            business_type: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: { order },
    });
  } catch (error: any) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// POST /api/orders/:id/payment - Record payment for order
router.post('/:id/payment', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { payment_method, transaction_id, amount } = req.body;

    // Validation
    if (!payment_method || !amount) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Payment method and amount are required',
        },
      });
    }

    // Verify order exists
    const existingOrder = await prisma.orders.findUnique({
      where: { id },
      include: {
        residents: {
          select: { user_id: true },
        },
      },
    });

    // Get society info separately if needed
    let society = null;
    if (existingOrder) {
      // Get resident to find society_id
      const resident = await prisma.residents.findUnique({
        where: { id: existingOrder.resident_id },
        select: { society_id: true },
      });
      if (resident) {
        society = await prisma.societies.findUnique({
          where: { id: resident.society_id },
          select: { admin_email: true },
        });
      }
    }

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' },
      });
    }

    // Authorization - residents and society admins can record payments
    if (session.role === 'resident') {
      if (existingOrder.residents?.user_id !== session.userId) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only pay for your own orders' },
        });
      }
    } else if (session.role === 'society_admin') {
      if (society?.admin_email !== session.email) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only manage payments for your society orders' },
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    // Verify order is completed
    if (existingOrder.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ORDER_NOT_COMPLETED',
          message: 'Payment can only be recorded for completed orders',
        },
      });
    }

    // Verify payment amount matches order total
    if (parseFloat(amount) !== parseFloat(existingOrder.total_amount.toString())) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'AMOUNT_MISMATCH',
          message: 'Payment amount does not match order total',
        },
      });
    }

    // Update order payment status
    const order = await prisma.orders.update({
      where: { id },
      data: {
        payment_status: 'paid',
      },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            category: true,
            base_price: true,
          },
        },
        residents: {
          select: {
            id: true,
            name: true,
            flat_number: true,
          },
        },
        vendors: {
          select: {
            id: true,
            business_name: true,
            business_type: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        order,
        payment: {
          method: payment_method,
          transaction_id: transaction_id || null,
          amount: amount,
          paid_at: new Date(),
        },
      },
    });
  } catch (error: any) {
    console.error('Record payment error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/orders/:id/invoice - Get order invoice details
router.get('/:id/invoice', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const order = await prisma.orders.findUnique({
      where: { id },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            category: true,
            base_price: true,
            description: true,
          },
        },
        residents: {
          select: {
            id: true,
            name: true,
            flat_number: true,
            phone: true,
            user_id: true,
            society_id: true,
          },
        },
        vendors: {
          select: {
            id: true,
            business_name: true,
            business_type: true,
            phone: true,
            city: true,
            state: true,
            user_id: true,
          },
        },
      },
    });

    // Get society info separately
    let society = null;
    if (order) {
      const residents = await prisma.residents.findUnique({
        where: { id: order.resident_id },
        select: { society_id: true },
      });
      if (residents) {
        society = await prisma.societies.findUnique({
          where: { id: residents.society_id },
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
          pincode: true,
          address_line1: true,
          address_line2: true,
          admin_email: true,
        },
        });
      }
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' },
      });
    }

    // Fetch residents and vendors separately
    const residents = await prisma.residents.findUnique({
      where: { id: order.resident_id },
      select: {
        id: true,
        name: true,
        flat_number: true,
        phone: true,
        user_id: true,
      },
    });

    const vendors = await prisma.vendors.findUnique({
      where: { id: order.vendor_id },
      select: {
        id: true,
        business_name: true,
        business_type: true,
        phone: true,
        city: true,
        state: true,
        user_id: true,
      },
    });

    const services = await prisma.services.findUnique({
      where: { id: order.service_id },
      select: {
        id: true,
        name: true,
        category: true,
        base_price: true,
        description: true,
      },
    });

    // Authorization check
    if (session.role === 'resident') {
      if (residents?.user_id !== session.userId) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only view invoices for your own orders' },
        });
      }
    } else if (session.role === 'vendor') {
      if (vendors?.user_id !== session.userId) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only view invoices for your own orders' },
        });
      }
    } else if (session.role === 'society_admin') {
      if (society?.admin_email !== session.email) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only view invoices for orders from your society' },
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    // Only show invoice for completed orders
    if (order.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ORDER_NOT_COMPLETED',
          message: 'Invoice is only available for completed orders',
        },
      });
    }

    // Calculate tax (assuming 18% GST)
    const taxRate = 0.18;
    const subtotal = parseFloat(order.total_amount.toString());
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    const invoice = {
      invoice_number: `INV-${order.order_number}`,
      order_number: order.order_number,
      invoice_date: order.completed_at,
      due_date: order.completed_at,
      status: order.payment_status,

      // Billing details
      bill_to: {
        name: residents?.name,
        address: `Flat ${residents?.flat_number}`,
        society: society?.name,
        city: society?.city,
        state: society?.state,
        pincode: society?.pincode,
        contact: residents?.phone,
      },

      // Vendor details
      bill_from: {
        business_name: vendors?.business_name,
        business_type: vendors?.business_type,
        city: vendors?.city,
        state: vendors?.state,
        contact: vendors?.phone,
      },

      // Service details
      items: [
        {
          description: services?.name,
          category: services?.category,
          details: order.description,
          quantity: 1,
          unit_price: subtotal,
          amount: subtotal,
        },
      ],

      // Financial summary
      subtotal: subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total: total,

      // Additional info
      scheduled_date: order.scheduled_date,
      completed_date: order.completed_at,
      created_date: order.created_at,
    };

    res.json({
      success: true,
      data: { invoice },
    });
  } catch (error: any) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

export default router;
