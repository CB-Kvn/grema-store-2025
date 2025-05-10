import { Expense } from '@/types';
import api from './api';


export const expenseService = {
  getAll: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  create: async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/expenses', expense);
    return response.data;
  },

  update: async (id: string, expense: Partial<Expense>) => {
    const response = await api.put(`/expenses/${id}`, expense);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  getByCategory: async (category: Expense['category']) => {
    const response = await api.get(`/expenses/category/${category}`);
    return response.data;
  },

  getByDateRange: async (startDate: string, endDate: string) => {
    const response = await api.get('/expenses/date-range', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  uploadReceipt: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/expenses/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/expenses/summary');
    return response.data;
  },
};