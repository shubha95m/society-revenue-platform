/**
 * Notices API Service
 */

import { api } from './client';
import type { ApiResponse, Notice } from '../types';

// Request types
export interface CreateNoticeRequest {
  societyId: string;
  title: string;
  content: string;
  category: 'ANNOUNCEMENT' | 'ALERT' | 'EVENT' | 'RULE_CHANGE' | 'EMERGENCY';
  priority?: 'LOW' | 'NORMAL' | 'HIGH';
  expiresAt?: string;
  pinned?: boolean;
}

export interface UpdateNoticeRequest {
  title?: string;
  content?: string;
  category?: 'ANNOUNCEMENT' | 'ALERT' | 'EVENT' | 'RULE_CHANGE' | 'EMERGENCY';
  priority?: 'LOW' | 'NORMAL' | 'HIGH';
  expiresAt?: string;
  pinned?: boolean;
}

export interface NoticesListParams {
  category?: 'ANNOUNCEMENT' | 'ALERT' | 'EVENT' | 'RULE_CHANGE' | 'EMERGENCY';
  priority?: 'LOW' | 'NORMAL' | 'HIGH';
  limit?: number;
  offset?: number;
}

// Notices API functions
export const noticesApi = {
  /**
   * Get list of notices
   */
  async getList(params?: NoticesListParams): Promise<ApiResponse<Notice[]>> {
    try {
      const response = await api.get<Notice[]>('/notices', { params });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch notices.',
        },
      };
    }
  },

  /**
   * Get notice by ID
   */
  async getById(id: string): Promise<ApiResponse<Notice>> {
    try {
      const response = await api.get<Notice>(`/notices/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch notice.',
        },
      };
    }
  },

  /**
   * Create new notice
   */
  async create(data: CreateNoticeRequest): Promise<ApiResponse<Notice>> {
    try {
      const response = await api.post<Notice>('/notices', data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'CREATE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to create notice. Please try again.',
        },
      };
    }
  },

  /**
   * Update notice
   */
  async update(id: string, data: UpdateNoticeRequest): Promise<ApiResponse<Notice>> {
    try {
      const response = await api.patch<Notice>(`/notices/${id}`, data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UPDATE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to update notice.',
        },
      };
    }
  },

  /**
   * Delete notice
   */
  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.delete<{ message: string }>(`/notices/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'DELETE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to delete notice.',
        },
      };
    }
  },
};
