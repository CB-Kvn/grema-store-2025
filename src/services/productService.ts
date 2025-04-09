import { Discount, Product } from '@/types';
import api from './api';


export const productService = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (product: Omit<Product, 'id'>) => {
    const response = await api.post('/products', product);
    return response.data;
  },

  update: async (id: number, product: Partial<Product>) => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  updateInventory: async (id: number, data: {
    quantity: number;
    warehouseId: string;
  }) => {
    const response = await api.post(`/products/${id}/inventory`, data);
    return response.data;
  },

  updateDiscount: async (id: number, discount: Discount) => {
    const response = await api.post(`/products/${id}/discount`, discount);
    return response.data;
  },

  transferStock: async (id: number, data: {
    sourceWarehouseId: string;
    targetWarehouseId: string;
    quantity: number;
  }) => {
    const response = await api.post(`/products/${id}/transfer`, data);
    return response.data;
  },
};