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

// =====================================================
// AMENITIES ENDPOINTS
// =====================================================

// GET /api/amenities - List amenities (society-specific)
router.get('/amenities', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { status, amenity_type, booking_type } = req.query;

    let societyId: string | undefined;

    // Get society ID based on role
    if (session.role === 'resident') {
      const resident = await prisma.residents.findFirst({
        where: { user_id: session.userId },
      });

      if (!resident) {
        return res.status(404).json({
          success: false,
          error: { code: 'RESIDENT_NOT_FOUND', message: 'Resident profile not found' },
        });
      }

      societyId = resident.society_id;
    } else if (session.role === 'society_admin') {
      const society = await prisma.societies.findFirst({
        where: { admin_email: session.email },
      });

      if (!society) {
        return res.status(404).json({
          success: false,
          error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found' },
        });
      }

      societyId = society.id;
    } else {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    // Build where clause
    const whereClause: any = { society_id: societyId };
    if (status) whereClause.status = status;
    if (amenity_type) whereClause.amenity_type = amenity_type;
    if (booking_type) whereClause.booking_type = booking_type;

    // Fetch amenities
    const amenities = await prisma.amenities.findMany({
      where: whereClause,
      include: {
        societies: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json({
      success: true,
      data: { amenities },
    });
  } catch (error: any) {
    console.error('List amenities error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/amenities/:id - Get amenity details
router.get('/amenities/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];

    const amenity = await prisma.amenities.findUnique({
      where: { id },
      include: {
        societies: {
          select: {
            id: true,
            name: true,
            admin_email: true,
          },
        },
      },
    });

    if (!amenity) {
      return res.status(404).json({
        success: false,
        error: { code: 'AMENITY_NOT_FOUND', message: 'Amenity not found' },
      });
    }

    // Authorization check - users can only view amenities from their society
    if (session.role === 'resident') {
      const resident = await prisma.residents.findFirst({
        where: { user_id: session.userId },
      });

      if (!resident || resident.society_id !== amenity.society_id) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only view amenities from your society' },
        });
      }
    } else if (session.role === 'society_admin') {
      const society = await prisma.societies.findFirst({
        where: { admin_email: session.email },
      });
      if (!society || amenity.society_id !== society.id) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only view amenities from your society' },
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
      data: { amenity },
    });
  } catch (error: any) {
    console.error('Get amenity error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// POST /api/amenities - Create amenity (society admin only)
router.post('/amenities', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const {
      name,
      description,
      amenity_type,
      booking_type,
      price_per_hour,
      price_per_day,
      available_slots,
      rules,
    } = req.body;

    // Only society admins can create amenities
    if (session.role !== 'society_admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only society admins can create amenities' },
      });
    }

    // Get society info
    const society = await prisma.societies.findFirst({
      where: { admin_email: session.email },
    });

    if (!society) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found' },
      });
    }

    // Validation
    if (!name || !amenity_type || !booking_type) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name, amenity type, and booking type are required',
        },
      });
    }

    // Validate pricing based on booking type
    if (booking_type === 'hourly' && !price_per_hour) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Price per hour is required for hourly booking type',
        },
      });
    }

    if (booking_type === 'daily' && !price_per_day) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Price per day is required for daily booking type',
        },
      });
    }

    // Create amenity
    const { randomUUID } = require('crypto');
    const amenity = await prisma.amenities.create({
      data: {
        id: randomUUID(),
        society_id: society.id,
        name,
        description,
        amenity_type,
        booking_type,
        price_per_hour: price_per_hour ? parseFloat(price_per_hour) : null,
        price_per_day: price_per_day ? parseFloat(price_per_day) : null,
        available_slots: available_slots || null,
        rules,
        status: 'active',
      },
      include: {
        societies: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: { amenity },
    });
  } catch (error: any) {
    console.error('Create amenity error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// PATCH /api/amenities/:id - Update amenity (society admin only)
router.patch('/amenities/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const {
      name,
      description,
      amenity_type,
      booking_type,
      price_per_hour,
      price_per_day,
      available_slots,
      rules,
      status,
    } = req.body;

    // Only society admins can update amenities
    if (session.role !== 'society_admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only society admins can update amenities' },
      });
    }

    // Get society info
    const society = await prisma.societies.findFirst({
      where: { admin_email: session.email },
    });

    if (!society) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found' },
      });
    }

    // Check if amenity exists and belongs to this society
    const existingAmenity = await prisma.amenities.findUnique({
      where: { id },
    });

    if (!existingAmenity) {
      return res.status(404).json({
        success: false,
        error: { code: 'AMENITY_NOT_FOUND', message: 'Amenity not found' },
      });
    }

    if (existingAmenity.society_id !== society.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only update amenities from your society' },
      });
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (amenity_type !== undefined) updateData.amenity_type = amenity_type;
    if (booking_type !== undefined) updateData.booking_type = booking_type;
    if (price_per_hour !== undefined) updateData.price_per_hour = parseFloat(price_per_hour);
    if (price_per_day !== undefined) updateData.price_per_day = parseFloat(price_per_day);
    if (available_slots !== undefined) updateData.available_slots = available_slots;
    if (rules !== undefined) updateData.rules = rules;
    if (status !== undefined) updateData.status = status;

    // Update amenity
    const amenity = await prisma.amenities.update({
      where: { id },
      data: updateData,
      include: {
        societies: true,
      },
    });

    res.json({
      success: true,
      data: { amenity },
    });
  } catch (error: any) {
    console.error('Update amenity error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// =====================================================
// BOOKINGS ENDPOINTS
// =====================================================

// GET /api/bookings - List bookings (filtered by role)
router.get('/bookings', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { status, payment_status, amenity_id } = req.query;

    let bookings;

    if (session.role === 'resident') {
      // Residents see only their own bookings
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
      if (status) whereClause.status = status;
      if (payment_status) whereClause.payment_status = payment_status;
      if (amenity_id) whereClause.amenity_id = amenity_id;

      bookings = await prisma.amenity_bookings.findMany({
        where: whereClause,
        include: {
          amenities: {
            select: {
              id: true,
              name: true,
              amenity_type: true,
              booking_type: true,
            },
          },
          residents: {
            select: {
              id: true,
              name: true,
              flat_number: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });
    } else if (session.role === 'society_admin') {
      // Society admins see all bookings for their society
      const society = await prisma.societies.findFirst({
        where: { admin_email: session.email },
      });

      if (!society) {
        return res.status(404).json({
          success: false,
          error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found' },
        });
      }

      const whereClause: any = {
        amenities: {
          society_id: society.id,
        },
      };
      if (status) whereClause.status = status;
      if (payment_status) whereClause.payment_status = payment_status;
      if (amenity_id) whereClause.amenity_id = amenity_id;

      bookings = await prisma.amenity_bookings.findMany({
        where: whereClause,
        include: {
          amenities: {
            select: {
              id: true,
              name: true,
              amenity_type: true,
              booking_type: true,
              society_id: true,
            },
          },
          residents: {
            select: {
              id: true,
              name: true,
              flat_number: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });
    } else {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      });
    }

    res.json({
      success: true,
      data: { bookings },
    });
  } catch (error: any) {
    console.error('List bookings error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/bookings/:id - Get booking details
router.get('/bookings/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];

    const booking = await prisma.amenity_bookings.findUnique({
      where: { id },
      include: {
        amenities: {
          include: {
            societies: {
              select: {
                id: true,
                name: true,
                admin_email: true,
              },
            },
          },
        },
        residents: {
          select: {
            id: true,
            name: true,
            flat_number: true,
            user_id: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: { code: 'BOOKING_NOT_FOUND', message: 'Booking not found' },
      });
    }

    // Authorization check
    if (session.role === 'resident') {
      // Residents can only view their own bookings
      const resident = await prisma.residents.findFirst({
        where: { user_id: session.userId },
      });
      if (!resident || booking.resident_id !== resident.id) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only view your own bookings' },
        });
      }
    } else if (session.role === 'society_admin') {
      // Society admins can only view bookings from their society
      const society = await prisma.societies.findFirst({
        where: { admin_email: session.email },
      });
      if (!society || booking.amenities?.society_id !== society.id) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only view bookings from your society' },
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
      data: { booking },
    });
  } catch (error: any) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// POST /api/bookings - Create booking (resident)
router.post('/bookings', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { amenity_id, booking_date, start_time, end_time, duration_hours } = req.body;

    // Only residents can create bookings
    if (session.role !== 'resident') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only residents can create bookings' },
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

    // Validation
    if (!amenity_id || !booking_date) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Amenity ID and booking date are required',
        },
      });
    }

    // Get amenity details
    const amenity = await prisma.amenities.findUnique({
      where: { id: amenity_id },
    });

    if (!amenity) {
      return res.status(404).json({
        success: false,
        error: { code: 'AMENITY_NOT_FOUND', message: 'Amenity not found' },
      });
    }

    // Check if amenity belongs to resident's society
    if (amenity.society_id !== resident.society_id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only book amenities from your society' },
      });
    }

    // Check if amenity is active
    if (amenity.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: { code: 'AMENITY_INACTIVE', message: 'This amenity is not available for booking' },
      });
    }

    // Validate booking type specific fields
    if (amenity.booking_type === 'hourly') {
      if (!start_time || !end_time || !duration_hours) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Start time, end time, and duration are required for hourly bookings',
          },
        });
      }
    }

    // Calculate total amount
    let total_amount = 0;
    if (amenity.booking_type === 'hourly' && amenity.price_per_hour) {
      total_amount = parseFloat(amenity.price_per_hour.toString()) * parseFloat(duration_hours);
    } else if (amenity.booking_type === 'daily' && amenity.price_per_day) {
      total_amount = parseFloat(amenity.price_per_day.toString());
    }

    // Check for conflicting bookings (for the same amenity on the same date/time)
    if (amenity.booking_type === 'hourly' && start_time && end_time) {
      const conflictingBookings = await prisma.amenity_bookings.findFirst({
        where: {
          amenity_id,
          booking_date: new Date(booking_date),
          status: { in: ['confirmed', 'pending'] },
          OR: [
            {
              AND: [
                { start_time: { lte: start_time } },
                { end_time: { gt: start_time } },
              ],
            },
            {
              AND: [
                { start_time: { lt: end_time } },
                { end_time: { gte: end_time } },
              ],
            },
            {
              AND: [
                { start_time: { gte: start_time } },
                { end_time: { lte: end_time } },
              ],
            },
          ],
        },
      });

      if (conflictingBookings) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'BOOKING_CONFLICT',
            message: 'This time slot is already booked',
          },
        });
      }
    }

    // Create booking
    const { randomUUID } = require('crypto');
    const booking = await prisma.amenity_bookings.create({
      data: {
        id: randomUUID(),
        amenity_id,
        resident_id: resident.id,
        booking_date: new Date(booking_date),
        start_time: start_time || null,
        end_time: end_time || null,
        duration_hours: duration_hours ? parseFloat(duration_hours) : null,
        total_amount,
        status: 'pending',
        payment_status: 'pending',
      },
      include: {
        amenities: {
          select: {
            id: true,
            name: true,
            amenity_type: true,
            booking_type: true,
          },
        },
        residents: {
          select: {
            id: true,
            name: true,
            flat_number: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: { booking },
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// PATCH /api/bookings/:id - Update/cancel booking
router.patch('/bookings/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const { status, payment_status } = req.body;

    // Check if booking exists
    const existingBooking = await prisma.amenity_bookings.findUnique({
      where: { id },
      include: {
        residents: {
          select: {
            user_id: true,
          },
        },
        amenities: {
          include: {
            societies: {
              select: {
                admin_email: true,
              },
            },
          },
        },
      },
    });

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        error: { code: 'BOOKING_NOT_FOUND', message: 'Booking not found' },
      });
    }

    // Authorization check
    let canUpdate = false;
    if (session.role === 'resident') {
      // Residents can only update their own bookings
      if (existingBooking.residents?.user_id === session.userId) {
        canUpdate = true;
        // Residents can only cancel bookings or update payment status
        if (status && status !== 'cancelled') {
          return res.status(403).json({
            success: false,
            error: { code: 'FORBIDDEN', message: 'Residents can only cancel bookings' },
          });
        }
      }
    } else if (session.role === 'society_admin') {
      // Society admins can update bookings from their society
      if (existingBooking.amenities?.societies?.admin_email === session.email) {
        canUpdate = true;
      }
    }

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You cannot update this booking' },
      });
    }

    // Validation
    if (!status && !payment_status) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'At least one field (status or payment_status) is required',
        },
      });
    }

    // Prepare update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (payment_status) updateData.payment_status = payment_status;

    // Update booking
    const booking = await prisma.amenity_bookings.update({
      where: { id },
      data: updateData,
      include: {
        amenities: {
          select: {
            id: true,
            name: true,
            amenity_type: true,
            booking_type: true,
          },
        },
        residents: {
          select: {
            id: true,
            name: true,
            flat_number: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: { booking },
    });
  } catch (error: any) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// DELETE /api/bookings/:id - Delete booking (admin only)
router.delete('/bookings/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];

    // Only society admins and platform admins can delete bookings
    if (session.role !== 'society_admin' && session.role !== 'platform_admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only admins can delete bookings' },
      });
    }

    // Check if booking exists
    const existingBooking = await prisma.amenity_bookings.findUnique({
      where: { id },
      include: {
        amenities: {
          include: {
            societies: {
              select: {
                admin_email: true,
              },
            },
          },
        },
      },
    });

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        error: { code: 'BOOKING_NOT_FOUND', message: 'Booking not found' },
      });
    }

    // For society admins, verify they own the society
    if (session.role === 'society_admin') {
      if (existingBooking.amenities?.societies?.admin_email !== session.email) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You can only delete bookings from your society' },
        });
      }
    }

    // Delete booking
    await prisma.amenity_bookings.delete({
      where: { id },
    });

    res.json({
      success: true,
      data: { message: 'Booking deleted successfully' },
    });
  } catch (error: any) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

export default router;
