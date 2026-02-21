/**
 * Ledger API Service
 */

import { api } from './client';
import type { ApiResponse, LedgerEntry } from '../types';

// Request types
export interface CreateLedgerEntryRequest {
  societyId: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  source: string;
  transactionDate?: string;
  referenceNumber?: string;
}

export interface UpdateLedgerEntryRequest {
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  amount?: number;
  description?: string;
  source?: string;
  transactionDate?: string;
  referenceNumber?: string;
}

export interface LedgerEntriesListParams {
  entry_type?: 'INCOME' | 'EXPENSE';
  category?: string;
  start_date?: string;
  end_date?: string;
}

export interface LedgerReportsParams {
  report_type: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CUSTOM';
  month?: number;
  year: number;
  start_date?: string;
  end_date?: string;
}

export interface LedgerSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  currentMonthIncome: number;
  currentMonthExpense: number;
  lastUpdated: string;
}

export interface LedgerReport {
  reportType: string;
  period: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  incomeByCategory: Record<string, number>;
  expenseByCategory: Record<string, number>;
  entries: LedgerEntry[];
}

// Ledger API functions
export const ledgerApi = {
  /**
   * Get list of ledger entries
   */
  async getEntries(params?: LedgerEntriesListParams): Promise<ApiResponse<LedgerEntry[]>> {
    try {
      const response = await api.get<LedgerEntry[]>('/ledger/entries', { params });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch ledger entries.',
        },
      };
    }
  },

  /**
   * Get ledger entry by ID
   */
  async getEntry(id: string): Promise<ApiResponse<LedgerEntry>> {
    try {
      const response = await api.get<LedgerEntry>(`/ledger/entries/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch ledger entry.',
        },
      };
    }
  },

  /**
   * Create new ledger entry
   */
  async createEntry(data: CreateLedgerEntryRequest): Promise<ApiResponse<LedgerEntry>> {
    try {
      const response = await api.post<LedgerEntry>('/ledger/entries', data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'CREATE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to create ledger entry. Please try again.',
        },
      };
    }
  },

  /**
   * Update ledger entry
   */
  async updateEntry(id: string, data: UpdateLedgerEntryRequest): Promise<ApiResponse<LedgerEntry>> {
    try {
      const response = await api.patch<LedgerEntry>(`/ledger/entries/${id}`, data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UPDATE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to update ledger entry.',
        },
      };
    }
  },

  /**
   * Delete ledger entry
   */
  async deleteEntry(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.delete<{ message: string }>(`/ledger/entries/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'DELETE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to delete ledger entry.',
        },
      };
    }
  },

  /**
   * Get ledger summary
   */
  async getSummary(): Promise<ApiResponse<LedgerSummary>> {
    try {
      const response = await api.get<LedgerSummary>('/ledger/summary');
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch ledger summary.',
        },
      };
    }
  },

  /**
   * Get ledger reports
   */
  async getReports(params: LedgerReportsParams): Promise<ApiResponse<LedgerReport>> {
    try {
      const response = await api.get<LedgerReport>('/ledger/reports', { params });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch ledger reports.',
        },
      };
    }
  },
};
