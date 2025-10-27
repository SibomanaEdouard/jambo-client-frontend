import { api } from './api';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  status: string;
  createdAt: string;
}

export interface TransactionHistory {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const transactionService = {
  async deposit(amount: number, description: string): Promise<{ message: string; transaction: Transaction }> {
    const response = await api.post('/transactions/deposit', { amount, description });
    return response.data;
  },

  async withdraw(amount: number, description: string): Promise<{ message: string; transaction: Transaction }> {
    const response = await api.post('/transactions/withdraw', { amount, description });
    return response.data;
  },

  async getHistory(page: number = 1, limit: number = 10): Promise<TransactionHistory> {
    const response = await api.get(`/transactions/history?page=${page}&limit=${limit}`);
    return response.data;
  },
};