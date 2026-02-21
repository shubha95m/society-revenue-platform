/**
 * Amenities API Service
 */

import { api } from './client';
import type { ApiResponse } from '../types';

// Types
export interface Amenity {
  id: string;
  societyId: string;
  name: string;
  description: string;
  amenityType: 'CLUBHOUSE' | 'GYM' | 'POOL' | 'HALL' | 'SPORTS' | 'OTHER';
  bookingType: 'HOURLY' | 'DAILY' | 'FREE';
  pricePerHour?: number;
  pricePerDay?: number;
  capacity?: number;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'UNAVAILABLE';
  availableFrom?: string;
  availableTo?: string;
  advanceBookingDays?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AmenityBooking {
  id: string;
  amenityId: string;
  userId: string;
  societyId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  hours?: number;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface CreateAmenityRequest {
  societyId: string;
  name: string;
  description: string;
  amenityType: 'CLUBHOUSE' | 'GYM' | 'POOL' | 'HALL' | 'SPORTS' | 'OTHER';
  bookingType: 'HOURLY' | 'DAILY' | 'FREE';
  pricePerHour?: number;
  pricePerDay?: number;
  capacity?: number;
  availableFrom?: string;
  availableTo?: string;
  advanceBookingDays?: number;
}

export interface UpdateAmenityRequest {
  name?: string;
  description?: string;
  amenityType?: 'CLUBHOUSE' | 'GYM' | 'POOL' | 'HALL' | 'SPORTS' | 'OTHER';
  bookingType?: 'HOURLY' | 'DAILY' | 'FREE';
  pricePerHour?: number;
  pricePerDay?: number;
  capacity?: number;
  status?: 'AVAILABLE' | 'MAINTENANCE' | 'UNAVAILABLE';
  availableFrom?: string;
  availableTo?: string;
  advanceBookingDays?: number;
}

export interface CreateBookingRequest {
  amenityId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface UpdateBookingRequest {
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus?: 'PENDING' | 'PAID' | 'REFUNDED';
  notes?: string;
}

export interface AmenitiesListParams {
  status?: 'AVAILABLE' | 'MAINTENANCE' | 'UNAVAILABLE';
  amenity_type?: 'CLUBHOUSE' | 'GYM' | 'POOL' | 'HALL' | 'SPORTS' | 'OTHER';
  booking_type?: 'HOURLY' | 'DAILY' | 'FREE';
}

export interface BookingsListParams {
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  payment_status?: 'PENDING' | 'PAID' | 'REFUNDED';
  amenity_id?: string;
}

// Amenities API functions
export const amenitiesApi = {
  /**
   * Get list of amenities
   */
  async getAmenities(params?: AmenitiesListParams): Promise<ApiResponse<Amenity[]>> {
    try {
      const response = await api.get<Amenity[]>('/amenities/amenities', { params });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch amenities.',
        },
      };
    }
  },

  /**
   * Get amenity by ID
   */
  async getAmenity(id: string): Promise<ApiResponse<Amenity>> {
    try {
      const response = await api.get<Amenity>(`/amenities/amenities/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch amenity.',
        },
      };
    }
  },

  /**
   * Create new amenity
   */
  async createAmenity(data: CreateAmenityRequest): Promise<ApiResponse<Amenity>> {
    try {
      const response = await api.post<Amenity>('/amenities/amenities', data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'CREATE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to create amenity. Please try again.',
        },
      };
    }
  },

  /**
   * Update amenity
   */
  async updateAmenity(id: string, data: UpdateAmenityRequest): Promise<ApiResponse<Amenity>> {
    try {
      const response = await api.patch<Amenity>(`/amenities/amenities/${id}`, data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UPDATE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to update amenity.',
        },
      };
    }
  },

  /**
   * Get list of bookings
   */
  async getBookings(params?: BookingsListParams): Promise<ApiResponse<AmenityBooking[]>> {
    try {
      const response = await api.get<AmenityBooking[]>('/amenities/bookings', { params });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch bookings.',
        },
      };
    }
  },

  /**
   * Get booking by ID
   */
  async getBooking(id: string): Promise<ApiResponse<AmenityBooking>> {
    try {
      const response = await api.get<AmenityBooking>(`/amenities/bookings/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch booking.',
        },
      };
    }
  },

  /**
   * Create new booking
   */
  async createBooking(data: CreateBookingRequest): Promise<ApiResponse<AmenityBooking>> {
    try {
      const response = await api.post<AmenityBooking>('/amenities/bookings', data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'CREATE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to create booking. Please try again.',
        },
      };
    }
  },

  /**
   * Update booking
   */
  async updateBooking(id: string, data: UpdateBookingRequest): Promise<ApiResponse<AmenityBooking>> {
    try {
      const response = await api.patch<AmenityBooking>(`/amenities/bookings/${id}`, data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UPDATE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to update booking.',
        },
      };
    }
  },

  /**
   * Delete booking
   */
  async deleteBooking(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.delete<{ message: string }>(`/amenities/bookings/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'DELETE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to delete booking.',
        },
      };
    }
  },
};
