/**
 * Resident API Service
 */

import { api } from './client';
import type { ApiResponse } from '../types';

// Response types
export interface ResidentDashboardData {
  resident: {
    id: string;
    name: string;
    flatNumber: string;
    society: string;
  };
  stats: {
    totalOrders: number;
    availableServices: number;
    complaints: number;
  };
}

export interface ResidentOrder {
  id: string;
  order_number: string;
  description: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  services: {
    id: string;
    name: string;
    category: string;
  };
  vendors: {
    id: string;
    business_name: string;
  };
}

export interface ResidentService {
  id: string;
  name: string;
  description: string | null;
  category: string;
  pricing_type: string;
  base_price: number | null;
  status: string;
  vendors: {
    id: string;
    business_name: string;
    business_type: string | null;
  };
}

// Resident API functions
export const residentApi = {
  /**
   * Get resident dashboard data
   */
  async getDashboard(): Promise<ApiResponse<ResidentDashboardData>> {
    try {
      const response = await api.get<ResidentDashboardData>('/resident/dashboard');
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'DASHBOARD_ERROR',
          message: error.response?.data?.error?.message || 'Failed to load dashboard data.',
        },
      };
    }
  },

  /**
   * Get resident orders
   */
  async getOrders(): Promise<ApiResponse<{ orders: ResidentOrder[] }>> {
    try {
      const response = await api.get<{ orders: ResidentOrder[] }>('/resident/orders');
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'ORDERS_ERROR',
          message: error.response?.data?.error?.message || 'Failed to load orders.',
        },
      };
    }
  },

  /**
   * Get available services
   */
  async getServices(): Promise<ApiResponse<{ services: ResidentService[] }>> {
    try {
      const response = await api.get<{ services: ResidentService[] }>('/resident/services');
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'SERVICES_ERROR',
          message: error.response?.data?.error?.message || 'Failed to load services.',
        },
      };
    }
  },
};