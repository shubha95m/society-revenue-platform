// =====================================================
// RESIDENT SERVICE - Business Logic
// =====================================================

import { prisma } from '../lib/prisma';
import {
  ServiceRequestCreateData,
  OrderStatus,
  VoteChoice,
  ComplaintCreateData,
  AmenityBookingCreateData,
} from '../types';

export class ResidentService {

  // =====================================================
  // DASHBOARD
  // =====================================================

  async getDashboard(residentId: string, societyId: string) {
    try {
      const [
        activeServiceRequests,
        activeOrders,
        activePolls,
        recentNotices,
        upcomingBookings,
        pendingPayments,
      ] = await Promise.all([
        // Active service requests
        prisma.serviceRequest.count({
          where: {
            residentId,
            status: { in: ['pending', 'approved', 'in_progress'] },
          },
        }),

        // Active orders
        prisma.order.count({
          where: {
            residentId,
            status: { in: ['pending', 'confirmed', 'in_progress', 'delivered'] },
          },
        }),

        // Active polls
        prisma.vote.count({
          where: {
            societyId,
            status: 'active',
            endDate: { gte: new Date() },
          },
        }),

        // Recent notices (last 7 days)
        prisma.notice.findMany({
          where: {
            societyId,
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            title: true,
            priority: true,
            createdAt: true,
          },
        }),

        // Upcoming amenity bookings
        prisma.amenityBooking.count({
          where: {
            residentId,
            status: 'confirmed',
            startTime: { gte: new Date() },
          },
        }),

        // Pending payments
        prisma.transaction.aggregate({
          where: {
            residentId,
            status: 'pending',
            type: { in: ['maintenance', 'service_request', 'amenity_booking'] },
          },
          _sum: { amount: true },
        }),
      ]);

      return {
        activeServiceRequests,
        activeOrders,
        activePolls,
        recentNotices,
        upcomingBookings,
        pendingPayments: pendingPayments._sum.amount || 0,
      };
    } catch (error) {
      console.error('Get dashboard error:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }

  // =====================================================
  // SERVICE REQUESTS
  // =====================================================

  async browseServices(societyId: string, filters?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { societyId };

      if (filters?.category) {
        where.category = filters.category;
      }

      if (filters?.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const [services, total] = await Promise.all([
        prisma.societyService.findMany({
          where,
          skip,
          take: limit,
          include: {
            vendor: {
              select: {
                id: true,
                businessName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.societyService.count({ where }),
      ]);

      return {
        services,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + services.length < total,
        },
      };
    } catch (error) {
      console.error('Browse services error:', error);
      throw new Error('Failed to fetch services');
    }
  }

  async createServiceRequest(data: ServiceRequestCreateData) {
    try {
      // Verify service exists and is active
      const service = await prisma.societyService.findUnique({
        where: { id: data.serviceId },
        include: { vendor: true },
      });

      if (!service) {
        throw new Error('Service not found');
      }

      // Create service request
      const serviceRequest = await prisma.serviceRequest.create({
        data: {
          residentId: data.residentId,
          societyId: data.societyId,
          serviceId: data.serviceId,
          vendorId: service.vendorId,
          description: data.description,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          urgency: data.urgency || 'normal',
          status: 'pending',
        },
        include: {
          service: {
            select: {
              name: true,
              category: true,
            },
          },
          vendor: {
            select: {
              businessName: true,
            },
          },
        },
      });

      return serviceRequest;
    } catch (error) {
      console.error('Create service request error:', error);
      throw new Error('Failed to create service request');
    }
  }

  async getServiceRequests(residentId: string, filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { residentId };

      if (filters?.status) {
        where.status = filters.status;
      }

      const [requests, total] = await Promise.all([
        prisma.serviceRequest.findMany({
          where,
          skip,
          take: limit,
          include: {
            service: {
              select: {
                name: true,
                category: true,
              },
            },
            vendor: {
              select: {
                businessName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.serviceRequest.count({ where }),
      ]);

      return {
        requests,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + requests.length < total,
        },
      };
    } catch (error) {
      console.error('Get service requests error:', error);
      throw new Error('Failed to fetch service requests');
    }
  }

  async getServiceRequestDetails(requestId: string, residentId: string) {
    try {
      const request = await prisma.serviceRequest.findFirst({
        where: {
          id: requestId,
          residentId,
        },
        include: {
          service: true,
          vendor: {
            select: {
              id: true,
              businessName: true,
              phone: true,
            },
          },
          resident: {
            select: {
              flatNumber: true,
              tower: true,
            },
          },
        },
      });

      if (!request) {
        throw new Error('Service request not found');
      }

      return request;
    } catch (error) {
      console.error('Get service request details error:', error);
      throw new Error('Failed to fetch service request details');
    }
  }

  async cancelServiceRequest(requestId: string, residentId: string, reason?: string) {
    try {
      const request = await prisma.serviceRequest.findFirst({
        where: {
          id: requestId,
          residentId,
          status: { in: ['pending', 'approved'] },
        },
      });

      if (!request) {
        throw new Error('Service request not found or cannot be cancelled');
      }

      const updated = await prisma.serviceRequest.update({
        where: { id: requestId },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancellationReason: reason,
        },
      });

      return updated;
    } catch (error) {
      console.error('Cancel service request error:', error);
      throw new Error('Failed to cancel service request');
    }
  }

  async rateService(requestId: string, residentId: string, rating: number, review?: string) {
    try {
      const request = await prisma.serviceRequest.findFirst({
        where: {
          id: requestId,
          residentId,
          status: 'completed',
        },
      });

      if (!request) {
        throw new Error('Service request not found or not completed');
      }

      const updated = await prisma.serviceRequest.update({
        where: { id: requestId },
        data: {
          rating,
          review,
          reviewedAt: new Date(),
        },
      });

      return updated;
    } catch (error) {
      console.error('Rate service error:', error);
      throw new Error('Failed to rate service');
    }
  }

  // =====================================================
  // ORDERS (MARKETPLACE)
  // =====================================================

  async browseMarketplace(societyId: string, filters?: {
    category?: string;
    vendorId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = {
        societyId,
        isActive: true,
      };

      if (filters?.category) {
        where.category = filters.category;
      }

      if (filters?.vendorId) {
        where.vendorId = filters.vendorId;
      }

      if (filters?.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const [products, total] = await Promise.all([
        prisma.marketplaceProduct.findMany({
          where,
          skip,
          take: limit,
          include: {
            vendor: {
              select: {
                id: true,
                businessName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.marketplaceProduct.count({ where }),
      ]);

      return {
        products,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + products.length < total,
        },
      };
    } catch (error) {
      console.error('Browse marketplace error:', error);
      throw new Error('Failed to fetch marketplace products');
    }
  }

  async createOrder(data: {
    residentId: string;
    societyId: string;
    vendorId: string;
    items: Array<{ productId: string; quantity: number }>;
    deliveryAddress?: string;
    notes?: string;
  }) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Get products with prices
        const productIds = data.items.map(item => item.productId);
        const products = await tx.marketplaceProduct.findMany({
          where: {
            id: { in: productIds },
            vendorId: data.vendorId,
            isActive: true,
          },
        });

        if (products.length !== productIds.length) {
          throw new Error('Some products not found or inactive');
        }

        // Calculate total
        let totalAmount = 0;
        const orderItems = data.items.map(item => {
          const product = products.find(p => p.id === item.productId)!;
          const itemTotal = product.price * item.quantity;
          totalAmount += itemTotal;

          return {
            productId: item.productId,
            quantity: item.quantity,
            pricePerUnit: product.price,
            totalPrice: itemTotal,
          };
        });

        // Create order
        const order = await tx.order.create({
          data: {
            residentId: data.residentId,
            societyId: data.societyId,
            vendorId: data.vendorId,
            totalAmount,
            deliveryAddress: data.deliveryAddress,
            notes: data.notes,
            status: 'pending',
            items: {
              create: orderItems,
            },
          },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    unit: true,
                  },
                },
              },
            },
            vendor: {
              select: {
                businessName: true,
              },
            },
          },
        });

        return order;
      });
    } catch (error) {
      console.error('Create order error:', error);
      throw new Error('Failed to create order');
    }
  }

  async getOrders(residentId: string, filters?: {
    status?: OrderStatus;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { residentId };

      if (filters?.status) {
        where.status = filters.status;
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          skip,
          take: limit,
          include: {
            vendor: {
              select: {
                businessName: true,
              },
            },
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.order.count({ where }),
      ]);

      return {
        orders,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + orders.length < total,
        },
      };
    } catch (error) {
      console.error('Get orders error:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  async getOrderDetails(orderId: string, residentId: string) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          residentId,
        },
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      console.error('Get order details error:', error);
      throw new Error('Failed to fetch order details');
    }
  }

  async markOrderReceived(orderId: string, residentId: string) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          residentId,
          status: 'delivered',
        },
      });

      if (!order) {
        throw new Error('Order not found or not in delivered status');
      }

      const updated = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'completed',
          completedAt: new Date(),
        },
      });

      return updated;
    } catch (error) {
      console.error('Mark order received error:', error);
      throw new Error('Failed to mark order as received');
    }
  }

  async rateOrder(orderId: string, residentId: string, rating: number, review?: string) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          residentId,
          status: 'completed',
        },
      });

      if (!order) {
        throw new Error('Order not found or not completed');
      }

      const updated = await prisma.order.update({
        where: { id: orderId },
        data: {
          rating,
          review,
          reviewedAt: new Date(),
        },
      });

      return updated;
    } catch (error) {
      console.error('Rate order error:', error);
      throw new Error('Failed to rate order');
    }
  }

  async disputeOrder(orderId: string, residentId: string, reason: string) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          residentId,
          status: { in: ['delivered', 'completed'] },
        },
      });

      if (!order) {
        throw new Error('Order not found or cannot be disputed');
      }

      const updated = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'disputed',
          disputeReason: reason,
          disputedAt: new Date(),
        },
      });

      return updated;
    } catch (error) {
      console.error('Dispute order error:', error);
      throw new Error('Failed to dispute order');
    }
  }

  // =====================================================
  // VOTES & POLLS
  // =====================================================

  async getPolls(societyId: string, filters?: {
    status?: 'active' | 'completed';
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { societyId };

      if (filters?.status === 'active') {
        where.status = 'active';
        where.endDate = { gte: new Date() };
      } else if (filters?.status === 'completed') {
        where.OR = [
          { status: 'completed' },
          { endDate: { lt: new Date() } },
        ];
      }

      const [polls, total] = await Promise.all([
        prisma.vote.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            title: true,
            description: true,
            startDate: true,
            endDate: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.vote.count({ where }),
      ]);

      return {
        polls,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + polls.length < total,
        },
      };
    } catch (error) {
      console.error('Get polls error:', error);
      throw new Error('Failed to fetch polls');
    }
  }

  async getPollDetails(pollId: string, residentId: string, societyId: string) {
    try {
      const poll = await prisma.vote.findFirst({
        where: {
          id: pollId,
          societyId,
        },
        include: {
          options: {
            select: {
              id: true,
              optionText: true,
            },
          },
        },
      });

      if (!poll) {
        throw new Error('Poll not found');
      }

      // Check if resident has voted
      const userVote = await prisma.voteResponse.findFirst({
        where: {
          voteId: pollId,
          residentId,
        },
        select: {
          optionId: true,
        },
      });

      return {
        ...poll,
        userVote: userVote?.optionId,
      };
    } catch (error) {
      console.error('Get poll details error:', error);
      throw new Error('Failed to fetch poll details');
    }
  }

  async submitVote(pollId: string, residentId: string, optionId: string) {
    try {
      // Verify poll is active
      const poll = await prisma.vote.findUnique({
        where: { id: pollId },
      });

      if (!poll || poll.status !== 'active' || poll.endDate < new Date()) {
        throw new Error('Poll is not active');
      }

      // Check if already voted
      const existingVote = await prisma.voteResponse.findFirst({
        where: {
          voteId: pollId,
          residentId,
        },
      });

      if (existingVote) {
        throw new Error('You have already voted in this poll');
      }

      // Verify option belongs to poll
      const option = await prisma.voteOption.findFirst({
        where: {
          id: optionId,
          voteId: pollId,
        },
      });

      if (!option) {
        throw new Error('Invalid option');
      }

      // Submit vote
      const voteResponse = await prisma.voteResponse.create({
        data: {
          voteId: pollId,
          residentId,
          optionId,
        },
      });

      return voteResponse;
    } catch (error) {
      console.error('Submit vote error:', error);
      throw new Error('Failed to submit vote');
    }
  }

  async getPollResults(pollId: string, societyId: string) {
    try {
      const poll = await prisma.vote.findFirst({
        where: {
          id: pollId,
          societyId,
        },
      });

      if (!poll) {
        throw new Error('Poll not found');
      }

      // Get results
      const results = await prisma.voteOption.findMany({
        where: { voteId: pollId },
        select: {
          id: true,
          optionText: true,
          _count: {
            select: {
              responses: true,
            },
          },
        },
      });

      const totalVotes = results.reduce((sum, option) => sum + option._count.responses, 0);

      return {
        poll: {
          id: poll.id,
          title: poll.title,
          description: poll.description,
          status: poll.status,
          endDate: poll.endDate,
        },
        totalVotes,
        results: results.map(option => ({
          optionId: option.id,
          optionText: option.optionText,
          votes: option._count.responses,
          percentage: totalVotes > 0 ? (option._count.responses / totalVotes) * 100 : 0,
        })),
      };
    } catch (error) {
      console.error('Get poll results error:', error);
      throw new Error('Failed to fetch poll results');
    }
  }

  // =====================================================
  // COMPLAINTS
  // =====================================================

  async createComplaint(data: ComplaintCreateData) {
    try {
      const complaint = await prisma.complaint.create({
        data: {
          residentId: data.residentId,
          societyId: data.societyId,
          category: data.category,
          subject: data.subject,
          description: data.description,
          priority: data.priority || 'medium',
          status: 'open',
        },
      });

      return complaint;
    } catch (error) {
      console.error('Create complaint error:', error);
      throw new Error('Failed to create complaint');
    }
  }

  async getComplaints(residentId: string, filters?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { residentId };

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.category) {
        where.category = filters.category;
      }

      const [complaints, total] = await Promise.all([
        prisma.complaint.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            category: true,
            subject: true,
            priority: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.complaint.count({ where }),
      ]);

      return {
        complaints,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + complaints.length < total,
        },
      };
    } catch (error) {
      console.error('Get complaints error:', error);
      throw new Error('Failed to fetch complaints');
    }
  }

  async getComplaintDetails(complaintId: string, residentId: string) {
    try {
      const complaint = await prisma.complaint.findFirst({
        where: {
          id: complaintId,
          residentId,
        },
        include: {
          comments: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  role: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!complaint) {
        throw new Error('Complaint not found');
      }

      return complaint;
    } catch (error) {
      console.error('Get complaint details error:', error);
      throw new Error('Failed to fetch complaint details');
    }
  }

  async addComplaintComment(complaintId: string, residentId: string, userId: string, comment: string) {
    try {
      // Verify complaint belongs to resident
      const complaint = await prisma.complaint.findFirst({
        where: {
          id: complaintId,
          residentId,
        },
      });

      if (!complaint) {
        throw new Error('Complaint not found');
      }

      const newComment = await prisma.complaintComment.create({
        data: {
          complaintId,
          userId,
          comment,
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      });

      return newComment;
    } catch (error) {
      console.error('Add complaint comment error:', error);
      throw new Error('Failed to add comment');
    }
  }

  // =====================================================
  // AMENITIES
  // =====================================================

  async getAmenities(societyId: string) {
    try {
      const amenities = await prisma.amenity.findMany({
        where: {
          societyId,
          isActive: true,
        },
        orderBy: { name: 'asc' },
      });

      return amenities;
    } catch (error) {
      console.error('Get amenities error:', error);
      throw new Error('Failed to fetch amenities');
    }
  }

  async getAmenityBookings(residentId: string, filters?: {
    status?: string;
    upcoming?: boolean;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { residentId };

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.upcoming) {
        where.startTime = { gte: new Date() };
      }

      const [bookings, total] = await Promise.all([
        prisma.amenityBooking.findMany({
          where,
          skip,
          take: limit,
          include: {
            amenity: {
              select: {
                name: true,
                location: true,
              },
            },
          },
          orderBy: { startTime: 'desc' },
        }),
        prisma.amenityBooking.count({ where }),
      ]);

      return {
        bookings,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + bookings.length < total,
        },
      };
    } catch (error) {
      console.error('Get amenity bookings error:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  async createAmenityBooking(data: AmenityBookingCreateData) {
    try {
      // Verify amenity exists and is active
      const amenity = await prisma.amenity.findUnique({
        where: { id: data.amenityId },
      });

      if (!amenity || !amenity.isActive) {
        throw new Error('Amenity not found or inactive');
      }

      // Check for conflicts
      const conflicts = await prisma.amenityBooking.findMany({
        where: {
          amenityId: data.amenityId,
          status: { in: ['confirmed', 'pending'] },
          OR: [
            {
              AND: [
                { startTime: { lte: data.startTime } },
                { endTime: { gt: data.startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: data.endTime } },
                { endTime: { gte: data.endTime } },
              ],
            },
          ],
        },
      });

      if (conflicts.length > 0) {
        throw new Error('Time slot is not available');
      }

      // Calculate hours and cost
      const hours = (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60 * 60);
      const totalCost = amenity.costPerHour * hours;

      const booking = await prisma.amenityBooking.create({
        data: {
          residentId: data.residentId,
          societyId: data.societyId,
          amenityId: data.amenityId,
          startTime: data.startTime,
          endTime: data.endTime,
          purpose: data.purpose,
          guestCount: data.guestCount,
          totalCost,
          status: 'pending',
        },
        include: {
          amenity: {
            select: {
              name: true,
              location: true,
            },
          },
        },
      });

      return booking;
    } catch (error) {
      console.error('Create amenity booking error:', error);
      throw new Error('Failed to create booking');
    }
  }

  async cancelAmenityBooking(bookingId: string, residentId: string) {
    try {
      const booking = await prisma.amenityBooking.findFirst({
        where: {
          id: bookingId,
          residentId,
          status: { in: ['pending', 'confirmed'] },
          startTime: { gte: new Date() },
        },
      });

      if (!booking) {
        throw new Error('Booking not found or cannot be cancelled');
      }

      const updated = await prisma.amenityBooking.update({
        where: { id: bookingId },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
        },
      });

      return updated;
    } catch (error) {
      console.error('Cancel amenity booking error:', error);
      throw new Error('Failed to cancel booking');
    }
  }

  // =====================================================
  // NOTICES
  // =====================================================

  async getNotices(societyId: string, filters?: {
    priority?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { societyId };

      if (filters?.priority) {
        where.priority = filters.priority;
      }

      const [notices, total] = await Promise.all([
        prisma.notice.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            title: true,
            priority: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.notice.count({ where }),
      ]);

      return {
        notices,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + notices.length < total,
        },
      };
    } catch (error) {
      console.error('Get notices error:', error);
      throw new Error('Failed to fetch notices');
    }
  }

  async getNoticeDetails(noticeId: string, societyId: string) {
    try {
      const notice = await prisma.notice.findFirst({
        where: {
          id: noticeId,
          societyId,
        },
      });

      if (!notice) {
        throw new Error('Notice not found');
      }

      return notice;
    } catch (error) {
      console.error('Get notice details error:', error);
      throw new Error('Failed to fetch notice details');
    }
  }

  // =====================================================
  // DOCUMENTS
  // =====================================================

  async getDocuments(societyId: string, filters?: {
    category?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { societyId };

      if (filters?.category) {
        where.category = filters.category;
      }

      const [documents, total] = await Promise.all([
        prisma.document.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            category: true,
            fileUrl: true,
            uploadedAt: true,
          },
          orderBy: { uploadedAt: 'desc' },
        }),
        prisma.document.count({ where }),
      ]);

      return {
        documents,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + documents.length < total,
        },
      };
    } catch (error) {
      console.error('Get documents error:', error);
      throw new Error('Failed to fetch documents');
    }
  }

  // =====================================================
  // PAYMENTS & TRANSACTIONS
  // =====================================================

  async getTransactions(residentId: string, filters?: {
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { residentId };

      if (filters?.type) {
        where.type = filters.type;
      }

      if (filters?.status) {
        where.status = filters.status;
      }

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.transaction.count({ where }),
      ]);

      return {
        transactions,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + transactions.length < total,
        },
      };
    } catch (error) {
      console.error('Get transactions error:', error);
      throw new Error('Failed to fetch transactions');
    }
  }

  async getInvoices(residentId: string, filters?: {
    paid?: boolean;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { residentId };

      if (filters?.paid !== undefined) {
        where.paid = filters.paid;
      }

      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          skip,
          take: limit,
          orderBy: { issueDate: 'desc' },
        }),
        prisma.invoice.count({ where }),
      ]);

      return {
        invoices,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + invoices.length < total,
        },
      };
    } catch (error) {
      console.error('Get invoices error:', error);
      throw new Error('Failed to fetch invoices');
    }
  }
}

// Export singleton instance
export const residentService = new ResidentService();
