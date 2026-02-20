/**
 * Auth API Service
 */

import { api } from './client';
import type { ApiResponse, User, UserRole } from '../types';

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: string;
}

// Response types
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  session: {
    token: string;
    expiresAt?: string;
  };
}

export interface SessionResponse {
  userId: string;
  email: string;
  role: string;
  expiresAt: Date;
}

// Auth API functions
export const authApi = {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);

      // Store token if login successful
      if (response.success && response.data?.session?.token) {
        api.setToken(response.data.session.token);
      }

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'LOGIN_FAILED',
          message: error.response?.data?.error?.message || 'Login failed. Please try again.',
        },
      };
    }
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);

      // Store token if registration successful
      if (response.success && response.data?.session?.token) {
        api.setToken(response.data.session.token);
      }

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'REGISTER_FAILED',
          message: error.response?.data?.error?.message || 'Registration failed. Please try again.',
        },
      };
    }
  },

  /**
   * Get current session
   */
  async getSession(): Promise<ApiResponse<SessionResponse>> {
    try {
      const response = await api.get<SessionResponse>('/auth/session');
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'SESSION_ERROR',
          message: error.response?.data?.error?.message || 'Failed to get session.',
        },
      };
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.post<{ message: string }>('/auth/logout');
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'LOGOUT_FAILED',
          message: error.response?.data?.error?.message || 'Logout failed.',
        },
      };
    }
  },
};