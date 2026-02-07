// =====================================================
// SOCIETY SERVICE - Business Logic
// =====================================================

import { prisma } from '../lib/prisma';

export class SocietyService {

  // =====================================================
  // DASHBOARD
  // =====================================================

  async getDashboard(societyId: string) {
    try {
      const [
        totalResidents,
        activeVendors,
        pendingServiceRequests,
        pendingOrders,
        activePolls,
        openComplaints,
        monthlyRevenue,
        pendingApprovals,
      ] = await Promise.all([
        // Total residents
        prisma.resident.count({
          where: { societyId, isVerified: true },
        }),

        // Active vendors
        prisma.vendorSociety.count({
          where: { societyId, status: 'active' },
        }),

        // Pending service requests
        prisma.serviceRequest.count({
          where: {
            societyId,
            status: 'pending',
          },
        }),

        // Pending orders
        prisma.order.count({
          where: {
            societyId,
            status: 'pending',
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

        // Open complaints
        prisma.complaint.count({
          where: {
            societyId,
            status: 'open',
          },
        }),

        // Monthly revenue (current month)
        prisma.transaction.aggregate({
          where: {
            societyId,
            status: 'completed',
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          _sum: { platformCommission: true },
        }),

        // Pending approvals (residents + vendors)
        Promise.all([
          prisma.resident.count({
            where: { societyId, isVerified: false },
          }),
          prisma.vendorSociety.count({
            where: { societyId, status: 'pending' },
          }),
        ]).then(([residents, vendors]) => residents + vendors),
      ]);

      return {
        totalResidents,
        activeVendors,
        pendingServiceRequests,
        pendingOrders,
        activePolls,
        openComplaints,
        monthlyRevenue: monthlyRevenue._sum.platformCommission || 0,
        pendingApprovals,
      };
    } catch (error) {
      console.error('Get society dashboard error:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }

  // =====================================================
  // RESIDENTS MANAGEMENT
  // =====================================================

  async getResidents(societyId: string, filters?: {
    verified?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { societyId };

      if (filters?.verified !== undefined) {
        where.isVerified = filters.verified;
      }

      if (filters?.search) {
        where.user = {
          OR: [
            { firstName: { contains: filters.search, mode: 'insensitive' } },
            { lastName: { contains: filters.search, mode: 'insensitive' } },
            { email: { contains: filters.search, mode: 'insensitive' } },
          ],
        };
      }

      const [residents, total] = await Promise.all([
        prisma.resident.findMany({
          where,
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                status: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.resident.count({ where }),
      ]);

      return {
        residents,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + residents.length < total,
        },
      };
    } catch (error) {
      console.error('Get residents error:', error);
      throw new Error('Failed to fetch residents');
    }
  }

  async getResidentDetails(residentId: string, societyId: string) {
    try {
      const resident = await prisma.resident.findFirst({
        where: {
          id: residentId,
          societyId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              status: true,
              createdAt: true,
              lastLoginAt: true,
            },
          },
          serviceRequests: {
            select: {
              id: true,
              status: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          orders: {
            select: {
              id: true,
              status: true,
              totalAmount: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });

      if (!resident) {
        throw new Error('Resident not found');
      }

      return resident;
    } catch (error) {
      console.error('Get resident details error:', error);
      throw new Error('Failed to fetch resident details');
    }
  }

  async approveResident(residentId: string, societyId: string) {
    try {
      const resident = await prisma.resident.findFirst({
        where: {
          id: residentId,
          societyId,
          isVerified: false,
        },
      });

      if (!resident) {
        throw new Error('Resident not found or already verified');
      }

      const updated = await prisma.$transaction(async (tx) => {
        // Update resident
        const updatedResident = await tx.resident.update({
          where: { id: residentId },
          data: { isVerified: true },
        });

        // Update user status
        await tx.user.update({
          where: { id: resident.userId },
          data: { status: 'active' },
        });

        return updatedResident;
      });

      return updated;
    } catch (error) {
      console.error('Approve resident error:', error);
      throw new Error('Failed to approve resident');
    }
  }

  async suspendResident(residentId: string, societyId: string, reason?: string) {
    try {
      const resident = await prisma.resident.findFirst({
        where: {
          id: residentId,
          societyId,
        },
      });

      if (!resident) {
        throw new Error('Resident not found');
      }

      await prisma.user.update({
        where: { id: resident.userId },
        data: { status: 'suspended' },
      });

      return { success: true };
    } catch (error) {
      console.error('Suspend resident error:', error);
      throw new Error('Failed to suspend resident');
    }
  }

  // =====================================================
  // VENDORS MANAGEMENT
  // =====================================================

  async getVendors(societyId: string, filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { societyId };

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.search) {
        where.vendor = {
          OR: [
            { businessName: { contains: filters.search, mode: 'insensitive' } },
            { user: {
              email: { contains: filters.search, mode: 'insensitive' },
            }},
          ],
        };
      }

      const [vendorSocieties, total] = await Promise.all([
        prisma.vendorSociety.findMany({
          where,
          skip,
          take: limit,
          include: {
            vendor: {
              include: {
                user: {
                  select: {
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.vendorSociety.count({ where }),
      ]);

      return {
        vendors: vendorSocieties,
        meta: {
          page,
          limit,
          total,
          hasMore: skip + vendorSocieties.length < total,
        },
      };
    } catch (error) {
      console.error('Get vendors error:', error);
      throw new Error('Failed to fetch vendors');
    }
  }

  async getVendorDetails(vendorId: string, societyId: string) {
    try {
      const vendorSociety = await prisma.vendorSociety.findFirst({
        where: {
          vendorId,
          societyId,
        },
        include: {
          vendor: {
            include: {
              user: {
                select: {
                  email: true,
                  firstName: true,
                  lastName: true,
                  phone: true,
                  createdAt: true,
                },
              },
              services: {
                where: { societyId },
                select: {
                  id: true,
                  name: true,
                  category: true,
                  isActive: true,
                },
              },
              products: {
                where: { societyId },
                select: {
                  id: true,
                  name: true,
                  category: true,
                  price: true,
                  isActive: true,
                },
              },
            },
          },
          contracts: {
            orderBy: { startDate: 'desc' },
            take: 5,
          },
        },
      });

      if (!vendorSociety) {
        throw new Error('Vendor not found in this society');
      }

      return vendorSociety;
    } catch (error) {
      console.error('Get vendor details error:', error);
      throw new Error('Failed to fetch vendor details');
    }
  }

  async approveVendor(vendorId: string, societyId: string) {
    try {
      const vendorSociety = await prisma.vendorSociety.findFirst({
        where: {
          vendorId,
          societyId,
          status: 'pending',
        },
      });

      if (!vendorSociety) {
        throw new Error('Vendor not found or already approved');
      }

      const updated = await prisma.vendorSociety.update({
        where: { id: vendorSociety.id },
        data: {
          status: 'active',
          approvedAt: new Date(),
        },
      });

      return updated;
    } catch (error) {
      console.error('Approve vendor error:', error);
      throw new Error('Failed to approve vendor');
    }
  }

  async suspendVendor(vendorId: string, societyId: string, reason?: string) {
    try {
      const vendorSociety = await prisma.vendorSociety.findFirst({
        where: {
          vendorId,
          societyId,
        },
      });

      if (!vendorSociety) {
        throw new Error('Vendor not found');
      }

      const updated = await prisma.vendorSociety.update({
        where: { id: vendorSociety.id },
        data: { status: 'suspended' },
      });

      return updated;
    } catch (error) {
      console.error('Suspend vendor error:', error);
      throw new Error('Failed to suspend vendor');
    }
  }

  // =====================================================
  // SERVICE REQUIREMENTS
  // =====================================================

  async createServiceRequirement(data: {
    societyId: string;
    createdBy: string;
    category: string;
    title: string;
    description: string;
    budget?: number;
    deadline?: Date;
  }) {
    try {
      const requirement = await prisma.serviceRequirement.create({
        data: {
          societyId: data.societyId,
          createdBy: data.createdBy,
          category: data.category,
          title: data.title,
          description: data.description,
          budget: data.budget,
          deadline: data.deadline,
          status: 'open',
        },
      });

      return requirement;
    } catch (error) {
      console.error('Create service requirement error:', error);
      throw new Error('Failed to create service requirement');
    }
  }

  async getServiceRequirements(societyId: string, filters?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { societyId };

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.category) {
        where.category = filters.category;
      }

      const [requirements, total] = await Promise.all([
        prisma.serviceRequirement.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            category: true,
            title: true,
            budget: true,
            deadline: true,
            status: true,
            createdAt: true,
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
      console.error('Get service requirements error:', error);
      throw new Error('Failed to fetch service requirements');
    }
  }

  async getServiceRequirementDetails(requirementId: string, societyId: string) {
    try {
      const requirement = await prisma.serviceRequirement.findFirst({
        where: {
          id: requirementId,
          societyId,
        },
        include: {
          proposals: {
            include: {
              vendor: {
                select: {
                  id: true,
                  businessName: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!requirement) {
        throw new Error('Service requirement not found');
      }

      return requirement;
    } catch (error) {
      console.error('Get service requirement details error:', error);
      throw new Error('Failed to fetch service requirement details');
    }
  }

  // =====================================================
  // VENDOR PROPOSALS
  // =====================================================

  async getProposals(societyId: string, requirementId?: string, filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = {
        requirement: { societyId },
      };

      if (requirementId) {
        where.requirementId = requirementId;
      }

      if (filters?.status) {
        where.status = filters.status;
      }

      const [proposals, total] = await Promise.all([
        prisma.vendorProposal.findMany({
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
            requirement: {
              select: {
                id: true,
                title: true,
                category: true,
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

  async approveProposal(proposalId: string, societyId: string) {
    try {
      const proposal = await prisma.vendorProposal.findFirst({
        where: {
          id: proposalId,
          requirement: { societyId },
          status: 'pending',
        },
        include: {
          requirement: true,
        },
      });

      if (!proposal) {
        throw new Error('Proposal not found or already processed');
      }

      const updated = await prisma.$transaction(async (tx) => {
        // Update proposal
        const updatedProposal = await tx.vendorProposal.update({
          where: { id: proposalId },
          data: {
            status: 'approved',
            reviewedAt: new Date(),
          },
        });

        // Update requirement
        await tx.serviceRequirement.update({
          where: { id: proposal.requirementId },
          data: { status: 'in_progress' },
        });

        return updatedProposal;
      });

      return updated;
    } catch (error) {
      console.error('Approve proposal error:', error);
      throw new Error('Failed to approve proposal');
    }
  }

  async rejectProposal(proposalId: string, societyId: string, reason?: string) {
    try {
      const proposal = await prisma.vendorProposal.findFirst({
        where: {
          id: proposalId,
          requirement: { societyId },
          status: 'pending',
        },
      });

      if (!proposal) {
        throw new Error('Proposal not found or already processed');
      }

      const updated = await prisma.vendorProposal.update({
        where: { id: proposalId },
        data: {
          status: 'rejected',
          reviewedAt: new Date(),
          rejectionReason: reason,
        },
      });

      return updated;
    } catch (error) {
      console.error('Reject proposal error:', error);
      throw new Error('Failed to reject proposal');
    }
  }

  // =====================================================
  // CONTRACTS
  // =====================================================

  async createContract(data: {
    societyId: string;
    vendorId: string;
    proposalId?: string;
    title: string;
    description: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    terms: string;
  }) {
    try {
      const contract = await prisma.contract.create({
        data: {
          societyId: data.societyId,
          vendorId: data.vendorId,
          proposalId: data.proposalId,
          title: data.title,
          description: data.description,
          amount: data.amount,
          startDate: data.startDate,
          endDate: data.endDate,
          terms: data.terms,
          status: 'active',
        },
        include: {
          vendor: {
            select: {
              businessName: true,
            },
          },
        },
      });

      return contract;
    } catch (error) {
      console.error('Create contract error:', error);
      throw new Error('Failed to create contract');
    }
  }

  async getContracts(societyId: string, filters?: {
    vendorId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { societyId };

      if (filters?.vendorId) {
        where.vendorId = filters.vendorId;
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
            vendor: {
              select: {
                businessName: true,
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
  // VOTES & POLLS
  // =====================================================

  async createPoll(data: {
    societyId: string;
    createdBy: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    options: string[];
  }) {
    try {
      const poll = await prisma.vote.create({
        data: {
          societyId: data.societyId,
          createdBy: data.createdBy,
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          status: 'active',
          options: {
            create: data.options.map((optionText, index) => ({
              optionText,
              displayOrder: index,
            })),
          },
        },
        include: {
          options: true,
        },
      });

      return poll;
    } catch (error) {
      console.error('Create poll error:', error);
      throw new Error('Failed to create poll');
    }
  }

  async closePoll(pollId: string, societyId: string) {
    try {
      const poll = await prisma.vote.findFirst({
        where: {
          id: pollId,
          societyId,
          status: 'active',
        },
      });

      if (!poll) {
        throw new Error('Poll not found or already closed');
      }

      const updated = await prisma.vote.update({
        where: { id: pollId },
        data: { status: 'completed' },
      });

      return updated;
    } catch (error) {
      console.error('Close poll error:', error);
      throw new Error('Failed to close poll');
    }
  }

  // =====================================================
  // SERVICE REQUESTS (VIEW ALL)
  // =====================================================

  async getAllServiceRequests(societyId: string, filters?: {
    status?: string;
    vendorId?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { societyId };

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.vendorId) {
        where.vendorId = filters.vendorId;
      }

      const [requests, total] = await Promise.all([
        prisma.serviceRequest.findMany({
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
                  },
                },
              },
            },
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
      console.error('Get all service requests error:', error);
      throw new Error('Failed to fetch service requests');
    }
  }

  // =====================================================
  // COMPLAINTS (VIEW ALL)
  // =====================================================

  async getAllComplaints(societyId: string, filters?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { societyId };

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
          include: {
            resident: {
              select: {
                flatNumber: true,
                tower: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
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
      console.error('Get all complaints error:', error);
      throw new Error('Failed to fetch complaints');
    }
  }

  async updateComplaintStatus(complaintId: string, societyId: string, status: string) {
    try {
      const complaint = await prisma.complaint.findFirst({
        where: {
          id: complaintId,
          societyId,
        },
      });

      if (!complaint) {
        throw new Error('Complaint not found');
      }

      const updated = await prisma.complaint.update({
        where: { id: complaintId },
        data: {
          status,
          resolvedAt: status === 'resolved' ? new Date() : undefined,
        },
      });

      return updated;
    } catch (error) {
      console.error('Update complaint status error:', error);
      throw new Error('Failed to update complaint status');
    }
  }

  // =====================================================
  // AMENITIES
  // =====================================================

  async createAmenity(data: {
    societyId: string;
    name: string;
    description?: string;
    location: string;
    capacity?: number;
    costPerHour: number;
    isActive: boolean;
  }) {
    try {
      const amenity = await prisma.amenity.create({
        data,
      });

      return amenity;
    } catch (error) {
      console.error('Create amenity error:', error);
      throw new Error('Failed to create amenity');
    }
  }

  async updateAmenity(amenityId: string, societyId: string, data: {
    name?: string;
    description?: string;
    location?: string;
    capacity?: number;
    costPerHour?: number;
    isActive?: boolean;
  }) {
    try {
      const amenity = await prisma.amenity.findFirst({
        where: {
          id: amenityId,
          societyId,
        },
      });

      if (!amenity) {
        throw new Error('Amenity not found');
      }

      const updated = await prisma.amenity.update({
        where: { id: amenityId },
        data,
      });

      return updated;
    } catch (error) {
      console.error('Update amenity error:', error);
      throw new Error('Failed to update amenity');
    }
  }

  // =====================================================
  // NOTICES
  // =====================================================

  async createNotice(data: {
    societyId: string;
    createdBy: string;
    title: string;
    content: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }) {
    try {
      const notice = await prisma.notice.create({
        data,
      });

      return notice;
    } catch (error) {
      console.error('Create notice error:', error);
      throw new Error('Failed to create notice');
    }
  }

  async deleteNotice(noticeId: string, societyId: string) {
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

      await prisma.notice.delete({
        where: { id: noticeId },
      });

      return { success: true };
    } catch (error) {
      console.error('Delete notice error:', error);
      throw new Error('Failed to delete notice');
    }
  }

  // =====================================================
  // DOCUMENTS
  // =====================================================

  async uploadDocument(data: {
    societyId: string;
    uploadedBy: string;
    name: string;
    category: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }) {
    try {
      const document = await prisma.document.create({
        data,
      });

      return document;
    } catch (error) {
      console.error('Upload document error:', error);
      throw new Error('Failed to upload document');
    }
  }

  async deleteDocument(documentId: string, societyId: string) {
    try {
      const document = await prisma.document.findFirst({
        where: {
          id: documentId,
          societyId,
        },
      });

      if (!document) {
        throw new Error('Document not found');
      }

      await prisma.document.delete({
        where: { id: documentId },
      });

      return { success: true };
    } catch (error) {
      console.error('Delete document error:', error);
      throw new Error('Failed to delete document');
    }
  }

  // =====================================================
  // FINANCIALS
  // =====================================================

  async getFinancialSummary(societyId: string, startDate?: Date, endDate?: Date) {
    try {
      const where: any = { societyId, status: 'completed' };

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      const [
        totalRevenue,
        totalCommission,
        transactionsByType,
        topVendors,
      ] = await Promise.all([
        // Total revenue
        prisma.transaction.aggregate({
          where,
          _sum: { amount: true },
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
          _sum: { amount: true },
          _count: true,
        }),

        // Top vendors by revenue
        prisma.transaction.groupBy({
          by: ['vendorId'],
          where: { ...where, vendorId: { not: null } },
          _sum: { amount: true },
          orderBy: { _sum: { amount: 'desc' } },
          take: 5,
        }),
      ]);

      return {
        totalRevenue: totalRevenue._sum.amount || 0,
        totalCommission: totalCommission._sum.platformCommission || 0,
        transactionsByType,
        topVendors,
      };
    } catch (error) {
      console.error('Get financial summary error:', error);
      throw new Error('Failed to fetch financial summary');
    }
  }
}

// Export singleton instance
export const societyService = new SocietyService();
