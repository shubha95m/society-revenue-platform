/**
 * Complaints API Service
 */

import { api } from './client';
import type { ApiResponse, Complaint } from '../types';

// Request types
export interface CreateComplaintRequest {
  societyId: string;
  category: 'MAINTENANCE' | 'VENDOR_SERVICE' | 'AMENITY' | 'STAFF' | 'SECURITY' | 'OTHER';
  title: string;
  description: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface UpdateComplaintRequest {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
  assignedTo?: string;
}

export interface ComplaintsListParams {
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
  category?: 'MAINTENANCE' | 'VENDOR_SERVICE' | 'AMENITY' | 'STAFF' | 'SECURITY' | 'OTHER';
  limit?: number;
  offset?: number;
}

// Complaints API functions
export const complaintsApi = {
  /**
   * Create new complaint
   */
  async create(data: CreateComplaintRequest): Promise<ApiResponse<Complaint>> {
    try {
      const response = await api.post<Complaint>('/complaints', data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'CREATE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to create complaint. Please try again.',
        },
      };
    }
  },

  /**
   * Get list of complaints
   */
  async getList(params?: ComplaintsListParams): Promise<ApiResponse<Complaint[]>> {
    try {
      const response = await api.get<Complaint[]>('/complaints', { params });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch complaints.',
        },
      };
    }
  },

  /**
   * Get complaint by ID
   */
  async getById(id: string): Promise<ApiResponse<Complaint>> {
    try {
      const response = await api.get<Complaint>(`/complaints/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch complaint.',
        },
      };
    }
  },

  /**
   * Update complaint
   */
  async update(id: string, data: UpdateComplaintRequest): Promise<ApiResponse<Complaint>> {
    try {
      const response = await api.patch<Complaint>(`/complaints/${id}`, data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UPDATE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to update complaint.',
        },
      };
    }
  },

  /**
   * Delete complaint
   */
  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.delete<{ message: string }>(`/complaints/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'DELETE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to delete complaint.',
        },
      };
    }
  },
};
