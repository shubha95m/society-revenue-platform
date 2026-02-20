/**
 * Society API Service
 */

import { api } from './client';
import type { ApiResponse } from '../types';

// Response types
export interface SocietyDashboardData {
  society: {
    id: string;
    name: string;
    address: string | null;
    totalUnits: number | null;
  };
  stats: {
    totalResidents: number;
    activeServices: number;
    totalOrders: number;
    totalRevenue: number;
  };
}

export interface SocietyResident {
  id: string;
  flat_number: string;
  name: string;
  phone: string | null;
  status: string;
  created_at: string;
  users: {
    email: string;
    name: string;
    status: string;
  };
}

export interface SocietyService {
  id: string;
  service_id: string;
  status: string;
  created_at: string;
  services: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    pricing_type: string;
    base_price: number | null;
    vendors: {
      id: string;
      business_name: string;
      business_type: string | null;
    };
  };
}

// Society API functions
export const societyApi = {
  /**
   * Get society admin dashboard data
   */
  async getDashboard(): Promise<ApiResponse<SocietyDashboardData>> {
    try {
      const response = await api.get<SocietyDashboardData>('/society/dashboard');
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
   * Get society residents
   */
  async getResidents(): Promise<ApiResponse<{ residents: SocietyResident[] }>> {
    try {
      const response = await api.get<{ residents: SocietyResident[] }>('/society/residents');
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'RESIDENTS_ERROR',
          message: error.response?.data?.error?.message || 'Failed to load residents.',
        },
      };
    }
  },

  /**
   * Get society services
   */
  async getServices(): Promise<ApiResponse<{ services: SocietyService[] }>> {
    try {
      const response = await api.get<{ services: SocietyService[] }>('/society/services');
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