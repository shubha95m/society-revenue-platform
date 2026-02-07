// =====================================================
// CORE TYPES FOR BACKEND API
// =====================================================

export type UserRole = 'platform_admin' | 'society_admin' | 'resident' | 'vendor';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

// Session & Auth
export interface AuthSession {
  userId: string;
  email: string;
  role: UserRole;
  societyId?: string; // For residents and society admins
  vendorId?: string; // For vendors
  residentId?: string; // For residents
  expiresAt: Date;
  lastActivityAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  // Role-specific data
  societyId?: string;
  flatNumber?: string;
  tower?: string;
  businessName?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    status: UserStatus;
  };
  session?: {
    token: string;
    expiresAt: string;
  };
  error?: string;
}

// API Response Standard
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Filters
export interface ServiceRequestFilters extends PaginationParams {
  status?: string;
  category?: string;
  searchTerm?: string;
}

export interface OrderFilters extends PaginationParams {
  status?: string;
  fromDate?: string;
  toDate?: string;
}

// Service Request
export interface CreateServiceRequestDto {
  serviceName: string;
  category: string;
  description: string;
  estimatedBudget?: string;
  expectedVolume?: string;
}

export interface UpdateServiceRequestDto {
  status?: string;
  rejectionReason?: string;
}

// Service Request Upvote
export interface UpvoteServiceRequestDto {
  serviceRequestId: string;
}

// Vote/Poll
export interface CreateVoteDto {
  title: string;
  description: string;
  category: string;
  serviceRequestId?: string;
  votingEndDate: string;
  quorumPercentage?: number;
  approvalThresholdPercentage?: number;
  financialImpact?: string;
  expectedBenefit?: string;
  details?: string;
}

export interface CastVoteDto {
  voteId: string;
  choice: 'yes' | 'no' | 'abstain';
  comment?: string;
}

export interface MarkPollDoneDto {
  voteId: string;
}

// Requirement
export interface CreateRequirementDto {
  serviceRequestId?: string;
  serviceName: string;
  category: string;
  description: string;
  budgetRangeMin?: number;
  budgetRangeMax?: number;
  budgetDisplay: string;
  expectedMonthlyVolume?: string;
  interestedResidents?: number;
  specificRequirements?: string;
  requiredCertifications?: string[];
  pollResult?: string;
}

// Proposal
export interface CreateProposalDto {
  requirementId: string;
  title: string;
  description: string;
  pricingModel: string;
  pricePerUnit?: number;
  priceDisplay: string;
  minimumOrderValue?: number;
  estimatedMonthlyCost?: number;
  serviceFrequency?: string;
  coverageDetails?: string;
  deliveryTimeline?: string;
  contractDurationMonths?: number;
  paymentTerms?: string;
  cancellationPolicy?: string;
  documents?: string[];
}

export interface UpdateProposalDto {
  status?: string;
  adminNotes?: string;
}

// Order
export interface CreateOrderDto {
  vendorId: string;
  serviceId: string;
  contractId?: string;
  serviceName: string;
  description?: string;
  quantity?: number;
  unit?: string;
  unitPrice: number;
  subtotal: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  scheduledDate?: string;
  scheduledTimeSlot?: string;
  deliveryAddress?: string;
  specialInstructions?: string;
}

export interface UpdateOrderDto {
  status?: string;
  cancellationReason?: string;
}

export interface RateOrderDto {
  orderId: string;
  rating: number; // 1-5
  feedback?: string;
}

// Complaint
export interface CreateComplaintDto {
  title: string;
  description: string;
  category: string;
  priority?: string;
  location?: string;
  vendorId?: string;
  orderId?: string;
  attachments?: string[];
  isPublic?: boolean;
}

export interface UpdateComplaintDto {
  status?: string;
  assignedToUserId?: string;
  resolutionNotes?: string;
}

// Notice
export interface CreateNoticeDto {
  title: string;
  content: string;
  category: string;
  priority?: string;
  expiresAt?: string;
  targetTowers?: string[];
  targetFloors?: number[];
  attachments?: string[];
}

// Amenity Booking
export interface CreateAmenityBookingDto {
  amenityId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  purpose?: string;
  guestCount?: number;
  specialRequests?: string;
}

export interface UpdateAmenityBookingDto {
  status?: string;
  cancellationReason?: string;
}

// Contract
export interface CreateContractDto {
  vendorId: string;
  serviceId?: string;
  proposalId?: string;
  title: string;
  description?: string;
  pricingModel: string;
  pricePerUnit?: number;
  estimatedMonthlyValue?: number;
  startDate: string;
  endDate?: string;
  durationMonths?: number;
  autoRenewal?: boolean;
  paymentTerms?: string;
  contractDocumentUrl?: string;
  attachments?: string[];
}

// Resident Management
export interface CreateResidentDto {
  userId?: string; // If user already exists
  email?: string; // If creating new user
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  flatNumber: string;
  tower?: string;
  floor?: number;
  ownershipType?: string;
  moveInDate?: string;
  familyMembers?: number;
}

export interface UpdateResidentDto {
  flatNumber?: string;
  tower?: string;
  floor?: number;
  ownershipType?: string;
  familyMembers?: number;
  isVerified?: boolean;
}

// Vendor Management
export interface UpdateVendorDto {
  businessName?: string;
  businessType?: string;
  description?: string;
  city?: string;
  state?: string;
  pincode?: string;
  serviceRadiusKm?: number;
  status?: string;
  verificationStatus?: string;
}

// Society Management
export interface UpdateSocietyDto {
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  totalFlats?: number;
  totalTowers?: number;
  occupiedFlats?: number;
  monthlyMaintenanceCharge?: number;
  status?: string;
}

// Analytics & Reports
export interface DashboardStats {
  totalOrders?: number;
  pendingOrders?: number;
  completedOrders?: number;
  totalRevenue?: number;
  monthlyRevenue?: number;
  activeServices?: number;
  activeVendors?: number;
  totalResidents?: number;
  activePolls?: number;
  pendingComplaints?: number;
  pendingServiceRequests?: number;
  [key: string]: any;
}

export interface ReportFilters {
  reportType: string;
  periodStart: string;
  periodEnd: string;
  societyId?: string;
  vendorId?: string;
}

// Error Codes
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
}
