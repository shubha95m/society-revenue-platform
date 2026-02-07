// =====================================================
// VENDOR SERVICE - Business Logic
// =====================================================

import { prisma } from '../lib/prisma';

export class VendorService {

  // =====================================================
  // DASHBOARD
  // =====================================================

  async getDashboard(vendorId: string) {
    try {
      const [
        activeSocieties,
        activeServices,
        activeProducts,
        pendingOrders,
        pendingProposals,
        monthlyEarnings,
        totalOrders,
      ] = await Promise.all([
        // Active societies
        prisma.vendorSociety.count({
          where: { vendorId, status: 'active' },
        }),

        // Active services
        prisma.societyService.count({
          where: { vendorId, isActive: true },
        }),

        // Active products
        prisma.marketplaceProduct.count({
          where: { vendorId, isActive: true },
        }),

        // Pending orders
        prisma.order.count({
          where: {
            vendorId,
            status: { in: ['pending', 'confirmed'] },
          },
        }),

        // Pending proposals
        prisma.vendorProposal.count({
          where: { vendorId, status: 'pending' },
        }),

        // Monthly earnings (current month)
        prisma.transaction.aggregate({
          where: {
            vendorId,
            status: 'completed',
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          _sum: { vendorAmount: true },
        }),

        // Total orders
        prisma.order.count({
          where: { vendorId },
        }),
      ]);

      return {
        activeSocieties,
        activeServices,
        activeProducts,
        pendingOrders,
        pendingProposals,
        monthlyEarnings: monthlyEarnings._sum.vendorAmount || 0,
        totalOrders,
      };
    } catch (error) {
      console.error('Get vendor dashboard error:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }

  // =====================================================
  // MARKETPLACE - SERVICES
  // =====================================================

  async getServices(vendorId: string, filters?: {
    societyId?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { vendorId };

      if (filters?.societyId) {
        where.societyId = filters.societyId;
      }

      if (filters?.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      const [services, total] = await Promise.all([
        prisma.societyService.findMany({
          where,
          skip,
          take: limit,
          include: {
            society: {
              select: {
                name: true,
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
      console.error('Get services error:', error);
      throw new Error('Failed to fetch services');
    }
  }

  async createService(data: {
    vendorId: string;
    societyId: string;
    name: string;
    description: string;
    category: string;
    basePrice?: number;
    isActive: boolean;
  }) {
    try {
      // Verify vendor is approved for this society
      const vendorSociety = await prisma.vendorSociety.findFirst({
        where: {
          vendorId: data.vendorId,
          societyId: data.societyId,
          status: 'active',
        },
      });

      if (!vendorSociety) {
        throw new Error('Vendor not approved for this society');
      }

      const service = await prisma.societyService.create({
        data,
      });

      return service;
    } catch (error) {
      console.error('Create service error:', error);
      throw new Error('Failed to create service');
    }
  }

  async updateService(serviceId: string, vendorId: string, data: {
    name?: string;
    description?: string;
    basePrice?: number;
    isActive?: boolean;
  }) {
    try {
      const service = await prisma.societyService.findFirst({
        where: {
          id: serviceId,
          vendorId,
        },
      });

      if (!service) {
        throw new Error('Service not found');
      }

      const updated = await prisma.societyService.update({
        where: { id: serviceId },
        data,
      });

      return updated;
    } catch (error) {
      console.error('Update service error:', error);
      throw new Error('Failed to update service');
    }
  }

  // =====================================================
  // MARKETPLACE - PRODUCTS
  // =====================================================

  async getProducts(vendorId: string, filters?: {
    societyId?: string;
    category?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { vendorId };

      if (filters?.societyId) {
        where.societyId = filters.societyId;
      }

      if (filters?.category) {
        where.category = filters.category;
      }

      if (filters?.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      const [products, total] = await Promise.all([
        prisma.marketplaceProduct.findMany({
          where,
          skip,
          take: limit,
          include: {
            society: {
              select: {
                name: true,
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
      console.error('Get products error:', error);
      throw new Error('Failed to fetch products');
    }
  }

  async createProduct(data: {
    vendorId: string;
    societyId: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    unit: string;
    stockQuantity?: number;
    imageUrl?: string;
    isActive: boolean;
  }) {
    try {
      // Verify vendor is approved for this society
      const vendorSociety = await prisma.vendorSociety.findFirst({
        where: {
          vendorId: data.vendorId,
          societyId: data.societyId,
          status: 'active',
        },
      });

      if (!vendorSociety) {
        throw new Error('Vendor not approved for this society');
      }

      const product = await prisma.marketplaceProduct.create({
        data,
      });

      return product;
    } catch (error) {
      console.error('Create product error:', error);
      throw new Error('Failed to create product');
    }
  }

  async updateProduct(productId: string, vendorId: string, data: {
    name?: string;
    description?: string;
    price?: number;
    stockQuantity?: number;
    imageUrl?: string;
    isActive?: boolean;
  }) {
    try {
      const product = await prisma.marketplaceProduct.findFirst({
        where: {
          id: productId,
          vendorId,
        },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      const updated = await prisma.marketplaceProduct.update({
        where: { id: productId },
        data,
      });

      return updated;
    } catch (error) {
      console.error('Update product error:', error);
      throw new Error('Failed to update product');
    }
  }

  // =====================================================
  // SERVICE REQUIREMENTS & PROPOSALS
  // =====================================================

  async browseRequirements(vendorId: string, filters?: {
    category?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      // Get societies where vendor is active
      const vendorSocieties = await prisma.vendorSociety.findMany({
        where: {
          vendorId,
          status: 'active',
        },
        select: {
          societyId: true,
        },
      });

      const societyIds = vendorSocieties.map(vs => vs.societyId);

      const where: any = {
        societyId: { in: societyIds },
      };

      if (filters?.category) {
        where.category = filters.category;
      }

      if (filters?.status) {
        where.status = filters.status;
      } else {
        where.status = 'open'; // Default to open requirements
      }

      const [requirements, total] = await Promise.all([
        prisma.serviceRequirement.findMany({
          where,
          skip,
          take: limit,
          include: {
            society: {
              select: {
                name: true,
              },
            },
            _count: {
              select: {
                proposals: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.serviceRequirement.count({ where }),
      ]);

      return {
        requirements,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + requirements.length < total,
        },
      };
    } catch (error) {
      console.error('Browse requirements error:', error);
      throw new Error('Failed to fetch requirements');
    }
  }

  async submitProposal(data: {
    vendorId: string;
    requirementId: string;
    proposedPrice: number;
    estimatedDuration: string;
    description: string;
  }) {
    try {
      // Verify requirement exists and is open
      const requirement = await prisma.serviceRequirement.findUnique({
        where: { id: data.requirementId },
      });

      if (!requirement || requirement.status !== 'open') {
        throw new Error('Requirement not found or no longer accepting proposals');
      }

      // Verify vendor is approved for this society
      const vendorSociety = await prisma.vendorSociety.findFirst({
        where: {
          vendorId: data.vendorId,
          societyId: requirement.societyId,
          status: 'active',
        },
      });

      if (!vendorSociety) {
        throw new Error('Vendor not approved for this society');
      }

      // Check if already submitted
      const existingProposal = await prisma.vendorProposal.findFirst({
        where: {
          vendorId: data.vendorId,
          requirementId: data.requirementId,
        },
      });

      if (existingProposal) {
        throw new Error('Proposal already submitted for this requirement');
      }

      const proposal = await prisma.vendorProposal.create({
        data: {
          vendorId: data.vendorId,
          requirementId: data.requirementId,
          proposedPrice: data.proposedPrice,
          estimatedDuration: data.estimatedDuration,
          description: data.description,
          status: 'pending',
        },
        include: {
          requirement: {
            select: {
              title: true,
              category: true,
            },
          },
        },
      });

      return proposal;
    } catch (error) {
      console.error('Submit proposal error:', error);
      throw new Error('Failed to submit proposal');
    }
  }

  async getProposals(vendorId: string, filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { vendorId };

      if (filters?.status) {
        where.status = filters.status;
      }

      const [proposals, total] = await Promise.all([
        prisma.vendorProposal.findMany({
          where,
          skip,
          take: limit,
          include: {
            requirement: {
              select: {
                id: true,
                title: true,
                category: true,
                budget: true,
                society: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.vendorProposal.count({ where }),
      ]);

      return {
        proposals,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + proposals.length < total,
        },
      };
    } catch (error) {
      console.error('Get proposals error:', error);
      throw new Error('Failed to fetch proposals');
    }
  }

  // =====================================================
  // ORDERS
  // =====================================================

  async getOrders(vendorId: string, filters?: {
    status?: string;
    societyId?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { vendorId };

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.societyId) {
        where.societyId = filters.societyId;
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          skip,
          take: limit,
          include: {
            resident: {
              select: {
                flatNumber: true,
                tower: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    phone: true,
                  },
                },
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

  async updateOrderStatus(orderId: string, vendorId: string, status: string) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          vendorId,
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      const updated = await prisma.order.update({
        where: { id: orderId },
        data: {
          status,
          confirmedAt: status === 'confirmed' ? new Date() : order.confirmedAt,
          deliveredAt: status === 'delivered' ? new Date() : order.deliveredAt,
        },
      });

      return updated;
    } catch (error) {
      console.error('Update order status error:', error);
      throw new Error('Failed to update order status');
    }
  }

  // =====================================================
  // CONTRACTS
  // =====================================================

  async getContracts(vendorId: string, filters?: {
    societyId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { vendorId };

      if (filters?.societyId) {
        where.societyId = filters.societyId;
      }

      if (filters?.status) {
        where.status = filters.status;
      }

      const [contracts, total] = await Promise.all([
        prisma.contract.findMany({
          where,
          skip,
          take: limit,
          include: {
            society: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { startDate: 'desc' },
        }),
        prisma.contract.count({ where }),
      ]);

      return {
        contracts,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + contracts.length < total,
        },
      };
    } catch (error) {
      console.error('Get contracts error:', error);
      throw new Error('Failed to fetch contracts');
    }
  }

  // =====================================================
  // EARNINGS & TRANSACTIONS
  // =====================================================

  async getEarnings(vendorId: string, startDate?: Date, endDate?: Date) {
    try {
      const where: any = {
        vendorId,
        status: 'completed',
      };

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      const [
        totalEarnings,
        totalCommission,
        transactionsByType,
      ] = await Promise.all([
        // Total earnings
        prisma.transaction.aggregate({
          where,
          _sum: { vendorAmount: true },
        }),

        // Total platform commission
        prisma.transaction.aggregate({
          where,
          _sum: { platformCommission: true },
        }),

        // Transactions by type
        prisma.transaction.groupBy({
          by: ['type'],
          where,
          _sum: { vendorAmount: true },
          _count: true,
        }),
      ]);

      return {
        totalEarnings: totalEarnings._sum.vendorAmount || 0,
        totalCommission: totalCommission._sum.platformCommission || 0,
        netEarnings: (totalEarnings._sum.vendorAmount || 0) - (totalCommission._sum.platformCommission || 0),
        transactionsByType,
      };
    } catch (error) {
      console.error('Get earnings error:', error);
      throw new Error('Failed to fetch earnings');
    }
  }

  async getTransactions(vendorId: string, filters?: {
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { vendorId };

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

  // =====================================================
  // ANALYTICS
  // =====================================================

  async getAnalytics(vendorId: string, startDate?: Date, endDate?: Date) {
    try {
      const where: any = { vendorId };

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      const [
        totalOrders,
        completedOrders,
        totalServiceRequests,
        completedServiceRequests,
        averageRating,
        topProducts,
      ] = await Promise.all([
        // Total orders
        prisma.order.count({
          where,
        }),

        // Completed orders
        prisma.order.count({
          where: { ...where, status: 'completed' },
        }),

        // Total service requests
        prisma.serviceRequest.count({
          where,
        }),

        // Completed service requests
        prisma.serviceRequest.count({
          where: { ...where, status: 'completed' },
        }),

        // Average rating
        prisma.order.aggregate({
          where: {
            ...where,
            rating: { not: null },
          },
          _avg: { rating: true },
        }),

        // Top products by orders
        prisma.orderItem.groupBy({
          by: ['productId'],
          where: {
            order: {
              vendorId,
              status: 'completed',
              ...(startDate || endDate ? { createdAt: where.createdAt } : {}),
            },
          },
          _sum: {
            quantity: true,
            totalPrice: true,
          },
          orderBy: {
            _sum: {
              totalPrice: 'desc',
            },
          },
          take: 5,
        }),
      ]);

      return {
        orders: {
          total: totalOrders,
          completed: completedOrders,
          completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
        },
        serviceRequests: {
          total: totalServiceRequests,
          completed: completedServiceRequests,
          completionRate: totalServiceRequests > 0 ? (completedServiceRequests / totalServiceRequests) * 100 : 0,
        },
        rating: {
          average: averageRating._avg.rating || 0,
        },
        topProducts,
      };
    } catch (error) {
      console.error('Get analytics error:', error);
      throw new Error('Failed to fetch analytics');
    }
  }
}

// Export singleton instance
export const vendorService = new VendorService();
