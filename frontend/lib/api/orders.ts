/**
 * Orders API Service
 */

import { api } from './client';
import type { ApiResponse } from '../types';

// Types
export interface Order {
  id: string;
  societyId: string;
  userId: string;
  serviceId: string;
  vendorId: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  amount: number;
  platformFee: number;
  vendorAmount: number;
  societyRevenue: number;
  scheduledDate?: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderInvoice {
  orderId: string;
  orderNumber: string;
  invoiceNumber: string;
  invoiceDate: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  vendor: {
    name: string;
    email: string;
    phone: string;
  };
  service: {
    name: string;
    description: string;
  };
  amount: number;
  platformFee: number;
  tax?: number;
  total: number;
  paymentStatus: string;
  paymentMethod?: string;
}

// Request types
export interface CreateOrderRequest {
  serviceId: string;
  scheduledDate?: string;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface RecordPaymentRequest {
  amount: number;
  method: 'CARD' | 'UPI' | 'NETBANKING' | 'CASH' | 'WALLET';
  transactionId?: string;
}

export interface OrdersListParams {
  status?: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  payment_status?: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';
  limit?: number;
  offset?: number;
}

// Orders API functions
export const ordersApi = {
  /**
   * Get list of orders
   */
  async getList(params?: OrdersListParams): Promise<ApiResponse<Order[]>> {
    try {
      const response = await api.get<Order[]>('/orders', { params });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch orders.',
        },
      };
    }
  },

  /**
   * Get order by ID
   */
  async getById(id: string): Promise<ApiResponse<Order>> {
    try {
      const response = await api.get<Order>(`/orders/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch order.',
        },
      };
    }
  },

  /**
   * Create new order
   */
  async create(data: CreateOrderRequest): Promise<ApiResponse<Order>> {
    try {
      const response = await api.post<Order>('/orders', data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'CREATE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to create order. Please try again.',
        },
      };
    }
  },

  /**
   * Update order status
   */
  async updateStatus(id: string, status: string, notes?: string): Promise<ApiResponse<Order>> {
    try {
      const response = await api.patch<Order>(`/orders/${id}/status`, { status, notes });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UPDATE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to update order status.',
        },
      };
    }
  },

  /**
   * Record payment for order
   */
  async recordPayment(id: string, amount: number, method: string): Promise<ApiResponse<Order>> {
    try {
      const response = await api.post<Order>(`/orders/${id}/payment`, { amount, method });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'PAYMENT_FAILED',
          message: error.response?.data?.error?.message || 'Failed to record payment. Please try again.',
        },
      };
    }
  },

  /**
   * Get order invoice
   */
  async getInvoice(id: string): Promise<ApiResponse<OrderInvoice>> {
    try {
      const response = await api.get<OrderInvoice>(`/orders/${id}/invoice`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch invoice.',
        },
      };
    }
  },
};
