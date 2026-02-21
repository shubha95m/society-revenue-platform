/**
 * Admin API Service
 */

import { api } from './client';
import type { ApiResponse } from '../types';

// Request types
export interface GetSocietiesParams {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface GetVendorsParams {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface GetAnalyticsParams {
  startDate?: string;
  endDate?: string;
}

export interface RejectSocietyRequest {
  reason: string;
}

export interface RejectVendorRequest {
  reason: string;
}

// Response types
export interface DashboardResponse {
  totalSocieties: number;
  totalVendors: number;
  pendingSocieties: number;
  pendingVendors: number;
  totalRevenue: number;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export interface Society {
  id: string;
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocietiesResponse {
  societies: Society[];
  total: number;
  limit: number;
  offset: number;
}

export interface VendorsResponse {
  vendors: Vendor[];
  total: number;
  limit: number;
  offset: number;
}

export interface PendingSocietiesResponse {
  societies: Society[];
  total: number;
}

export interface PendingVendorsResponse {
  vendors: Vendor[];
  total: number;
}

export interface ApproveSocietyResponse {
  message: string;
  society: Society;
}

export interface ApproveVendorResponse {
  message: string;
  vendor: Vendor;
}

export interface RejectSocietyResponse {
  message: string;
  society: Society;
}

export interface RejectVendorResponse {
  message: string;
  vendor: Vendor;
}

export interface AnalyticsResponse {
  period: {
    startDate: string;
    endDate: string;
  };
  metrics: {
    totalRevenue: number;
    totalTransactions: number;
    activeSocieties: number;
    activeVendors: number;
  };
  trends: Array<{
    date: string;
    revenue: number;
    transactions: number;
  }>;
}

// Admin API functions
export const adminApi = {
  /**
   * Get dashboard overview data
   */
  async getDashboard(): Promise<ApiResponse<DashboardResponse>> {
    try {
      const response = await api.get<DashboardResponse>('/admin/dashboard');
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'DASHBOARD_FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch dashboard data.',
        },
      };
    }
  },

  /**
   * Get societies with optional filters
   */
  async getSocieties(params?: GetSocietiesParams): Promise<ApiResponse<SocietiesResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const url = `/admin/societies${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<SocietiesResponse>(url);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'SOCIETIES_FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch societies.',
        },
      };
    }
  },

  /**
   * Get pending societies
   */
  async getPendingSocieties(): Promise<ApiResponse<PendingSocietiesResponse>> {
    try {
      const response = await api.get<PendingSocietiesResponse>('/admin/societies/pending');
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'PENDING_SOCIETIES_FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch pending societies.',
        },
      };
    }
  },

  /**
   * Approve a society
   */
  async approveSociety(id: string): Promise<ApiResponse<ApproveSocietyResponse>> {
    try {
      const response = await api.patch<ApproveSocietyResponse>(`/admin/societies/${id}/approve`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'SOCIETY_APPROVE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to approve society.',
        },
      };
    }
  },

  /**
   * Reject a society
   */
  async rejectSociety(id: string, reason: string): Promise<ApiResponse<RejectSocietyResponse>> {
    try {
      const response = await api.patch<RejectSocietyResponse>(
        `/admin/societies/${id}/reject`,
        { reason }
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'SOCIETY_REJECT_FAILED',
          message: error.response?.data?.error?.message || 'Failed to reject society.',
        },
      };
    }
  },

  /**
   * Get vendors with optional filters
   */
  async getVendors(params?: GetVendorsParams): Promise<ApiResponse<VendorsResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());

      const url = `/admin/vendors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<VendorsResponse>(url);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'VENDORS_FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch vendors.',
        },
      };
    }
  },

  /**
   * Get pending vendors
   */
  async getPendingVendors(): Promise<ApiResponse<PendingVendorsResponse>> {
    try {
      const response = await api.get<PendingVendorsResponse>('/admin/vendors/pending');
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'PENDING_VENDORS_FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch pending vendors.',
        },
      };
    }
  },

  /**
   * Approve a vendor
   */
  async approveVendor(id: string): Promise<ApiResponse<ApproveVendorResponse>> {
    try {
      const response = await api.patch<ApproveVendorResponse>(`/admin/vendors/${id}/approve`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'VENDOR_APPROVE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to approve vendor.',
        },
      };
    }
  },

  /**
   * Reject a vendor
   */
  async rejectVendor(id: string, reason: string): Promise<ApiResponse<RejectVendorResponse>> {
    try {
      const response = await api.patch<RejectVendorResponse>(
        `/admin/vendors/${id}/reject`,
        { reason }
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'VENDOR_REJECT_FAILED',
          message: error.response?.data?.error?.message || 'Failed to reject vendor.',
        },
      };
    }
  },

  /**
   * Get analytics data with optional date range
   */
  async getAnalytics(params?: GetAnalyticsParams): Promise<ApiResponse<AnalyticsResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);

      const url = `/admin/analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<AnalyticsResponse>(url);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'ANALYTICS_FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch analytics data.',
        },
      };
    }
  },
};
