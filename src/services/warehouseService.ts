import { Warehouse } from '@/types/warehouse';
import api from './api';


export const warehouseService = {
  getAll: async () => {
    const response = await api.get('/warehouses');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/warehouses/${id}`);
    return response.data;
  },

  create: async (warehouse: Omit<Warehouse, 'id'>) => {
    const response = await api.post('/warehouses', warehouse);
    return response.data;
  },

  update: async (id: string, warehouse: Partial<Warehouse>) => {
    const response = await api.put(`/warehouses/${id}`, warehouse);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/warehouses/${id}`);
    return response.data;
  },

  addStock: async (warehouseId: string, productId: number, data: {
    quantity: number;
    location: string;
  }) => {
    const response = await api.post(`/warehouses/${warehouseId}/stock/${productId}`, data);
    return response.data;
  },

  removeStock: async (warehouseId: string, productId: number, quantity: number) => {
    const response = await api.post(`/warehouses/${warehouseId}/stock/${productId}/remove`, { quantity });
    return response.data;
  },

  transferStock: async (data: {
    sourceWarehouseId: string;
    targetWarehouseId: string;
    productId: number;
    quantity: number;
  }) => {
    const response = await api.post('/warehouses/transfer', data);
    return response.data;
  },

  getStockMovements: async (warehouseId: string, itemId: string) => {
    const response = await api.get(`/warehouses/${warehouseId}/items/${itemId}/movements`);
    return response.data;
  },
};