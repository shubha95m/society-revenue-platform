/**
 * Shared TypeScript types
 * Used by both web and mobile
 */

export enum UserRole {
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  SOCIETY_ADMIN = 'SOCIETY_ADMIN',
  RESIDENT = 'RESIDENT',
  VENDOR = 'VENDOR',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
}

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  societyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Society {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  totalFlats: number;
  totalBuildings: number;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface Flat {
  id: string;
  societyId: string;
  buildingId: string;
  flatNumber: string;
  residentId?: string;
  status: 'VACANT' | 'OCCUPIED';
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string[];
  rating: number;
  totalOrders: number;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface Service {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  category: string;
  marketPrice: number;
  societyPrice: number;
  savings: number;
  savingsPercent: number;
  rating: number;
  totalBookings: number;
  images: string[];
}

export interface Booking {
  id: string;
  serviceId: string;
  residentId: string;
  vendorId: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledDate: string;
  amount: number;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  societyId: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  source: string;
  createdAt: string;
  createdBy: string;
}

export interface Notice {
  id: string;
  societyId: string;
  title: string;
  content: string;
  category: 'ANNOUNCEMENT' | 'ALERT' | 'EVENT' | 'RULE_CHANGE' | 'EMERGENCY';
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  publishedAt: string;
  expiresAt?: string;
  pinned: boolean;
}

export interface Proposal {
  id: string;
  societyId: string;
  title: string;
  description: string;
  category: 'VENDOR' | 'EXPENSE' | 'POLICY' | 'ELECTION' | 'OTHER';
  impactStatement: string;
  votingStartDate: string;
  votingEndDate: string;
  quorumRequired: number;
  approvalThreshold: number;
  status: 'DRAFT' | 'ACTIVE' | 'PASSED' | 'REJECTED' | 'INVALID';
}

export interface Vote {
  id: string;
  proposalId: string;
  userId: string;
  choice: 'YES' | 'NO' | 'ABSTAIN';
  createdAt: string;
}

export interface Complaint {
  id: string;
  societyId: string;
  raisedBy: string;
  category: 'MAINTENANCE' | 'VENDOR_SERVICE' | 'AMENITY' | 'STAFF' | 'SECURITY' | 'OTHER';
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
}

// API Response types
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
    pageSize?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}
