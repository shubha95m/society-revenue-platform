/**
 * Vendor API Service
 */

import { api } from './client';
import type { ApiResponse, Service, Booking, Society } from '../types';

// Request types
export interface GetOrdersParams {
  status?: string;
  limit?: number;
  offset?: number;
}

export interface GetContractsParams {
  status?: string;
}

export interface DiscoverParams {
  city?: string;
  state?: string;
  search?: string;
}

export interface GetEarningsParams {
  startDate?: string;
  endDate?: string;
}

export interface ConnectSocietyRequest {
  societyId: string;
  serviceId: string;
  message: string;
}

// Response types
export interface VendorDashboard {
  stats: {
    totalOrders: number;
    activeContracts: number;
    totalRevenue: number;
    rating: number;
  };
  recentOrders: Booking[];
  pendingRequests: number;
}

export interface VendorOrder extends Booking {
  service?: Service;
  resident?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  society?: {
    id: string;
    name: string;
  };
}

export interface VendorContract {
  id: string;
  societyId: string;
  serviceId: string;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate?: string;
  society: Society;
  service: Service;
  totalBookings: number;
  totalRevenue: number;
}

export interface DiscoverSociety extends Society {
  distance?: number;
  totalResidents?: number;
  potentialRevenue?: number;
}

export interface EarningsData {
  summary: {
    totalEarnings: number;
    totalOrders: number;
    averageOrderValue: number;
  };
  breakdown: {
    date: string;
    earnings: number;
    orders: number;
  }[];
}

// Vendor API functions
export const vendorApi = {
  /**
   * Get vendor dashboard data
   */
  async getDashboard(): Promise<ApiResponse<VendorDashboard>> {
    try {
      const response = await api.get<VendorDashboard>('/vendor/dashboard');
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'DASHBOARD_ERROR',
          message: error.response?.data?.error?.message || 'Failed to fetch dashboard data.',
        },
      };
    }
  },

  /**
   * Get vendor orders with optional filters
   */
  async getOrders(params?: GetOrdersParams): Promise<ApiResponse<VendorOrder[]>> {
    try {
      const response = await api.get<VendorOrder[]>('/vendor/orders', { params });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'ORDERS_ERROR',
          message: error.response?.data?.error?.message || 'Failed to fetch orders.',
        },
      };
    }
  },

  /**
   * Get vendor contracts with optional status filter
   */
  async getContracts(params?: GetContractsParams): Promise<ApiResponse<VendorContract[]>> {
    try {
      const response = await api.get<VendorContract[]>('/vendor/contracts', { params });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'CONTRACTS_ERROR',
          message: error.response?.data?.error?.message || 'Failed to fetch contracts.',
        },
      };
    }
  },

  /**
   * Discover societies with optional filters
   */
  async discover(params?: DiscoverParams): Promise<ApiResponse<DiscoverSociety[]>> {
    try {
      const response = await api.get<DiscoverSociety[]>('/vendor/discover', { params });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'DISCOVER_ERROR',
          message: error.response?.data?.error?.message || 'Failed to discover societies.',
        },
      };
    }
  },

  /**
   * Get earnings data with optional date range
   */
  async getEarnings(params?: GetEarningsParams): Promise<ApiResponse<EarningsData>> {
    try {
      const response = await api.get<EarningsData>('/vendor/earnings', { params });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'EARNINGS_ERROR',
          message: error.response?.data?.error?.message || 'Failed to fetch earnings data.',
        },
      };
    }
  },

  /**
   * Connect with a society by sending a connection request
   */
  async connectSociety(data: ConnectSocietyRequest): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.post<{ message: string }>('/vendor/connect-society', data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'CONNECT_FAILED',
          message: error.response?.data?.error?.message || 'Failed to connect with society.',
        },
      };
    }
  },
};
