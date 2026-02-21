/**
 * Votes API Service
 */

import { api } from './client';
import type { ApiResponse, Proposal, Vote } from '../types';

// Request types
export interface CreateProposalRequest {
  societyId: string;
  title: string;
  description: string;
  category: 'VENDOR' | 'EXPENSE' | 'POLICY' | 'ELECTION' | 'OTHER';
  impactStatement: string;
  votingStartDate: string;
  votingEndDate: string;
  quorumRequired?: number;
  approvalThreshold?: number;
}

export interface UpdateProposalRequest {
  title?: string;
  description?: string;
  category?: 'VENDOR' | 'EXPENSE' | 'POLICY' | 'ELECTION' | 'OTHER';
  impactStatement?: string;
  votingStartDate?: string;
  votingEndDate?: string;
  quorumRequired?: number;
  approvalThreshold?: number;
  status?: 'DRAFT' | 'ACTIVE' | 'PASSED' | 'REJECTED' | 'INVALID';
}

export interface ProposalsListParams {
  status?: 'DRAFT' | 'ACTIVE' | 'PASSED' | 'REJECTED' | 'INVALID';
  type?: 'VENDOR' | 'EXPENSE' | 'POLICY' | 'ELECTION' | 'OTHER';
}

export interface VoteResults {
  proposalId: string;
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  quorumMet: boolean;
  approved: boolean;
}

// Votes API functions
export const votesApi = {
  /**
   * Get list of proposals
   */
  async getProposals(params?: ProposalsListParams): Promise<ApiResponse<Proposal[]>> {
    try {
      const response = await api.get<Proposal[]>('/votes/proposals', { params });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch proposals.',
        },
      };
    }
  },

  /**
   * Get proposal by ID
   */
  async getProposal(id: string): Promise<ApiResponse<Proposal>> {
    try {
      const response = await api.get<Proposal>(`/votes/proposals/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch proposal.',
        },
      };
    }
  },

  /**
   * Create new proposal
   */
  async createProposal(data: CreateProposalRequest): Promise<ApiResponse<Proposal>> {
    try {
      const response = await api.post<Proposal>('/votes/proposals', data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'CREATE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to create proposal. Please try again.',
        },
      };
    }
  },

  /**
   * Update proposal
   */
  async updateProposal(id: string, data: UpdateProposalRequest): Promise<ApiResponse<Proposal>> {
    try {
      const response = await api.patch<Proposal>(`/votes/proposals/${id}`, data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'UPDATE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to update proposal.',
        },
      };
    }
  },

  /**
   * Cast vote on proposal
   */
  async castVote(id: string, voteValue: 'YES' | 'NO' | 'ABSTAIN'): Promise<ApiResponse<Vote>> {
    try {
      const response = await api.post<Vote>(`/votes/proposals/${id}/vote`, { choice: voteValue });
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'VOTE_FAILED',
          message: error.response?.data?.error?.message || 'Failed to cast vote. Please try again.',
        },
      };
    }
  },

  /**
   * Get voting results for proposal
   */
  async getResults(id: string): Promise<ApiResponse<VoteResults>> {
    try {
      const response = await api.get<VoteResults>(`/votes/proposals/${id}/results`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.data?.error?.code || 'FETCH_FAILED',
          message: error.response?.data?.error?.message || 'Failed to fetch results.',
        },
      };
    }
  },
};
