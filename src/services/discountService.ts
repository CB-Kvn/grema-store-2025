import { Discount } from '@/types';
import api from './api';

export const discountService = {
  getAll: async (): Promise<Discount[]> => {
    const response = await api.get('/discounts');
    return response.data as Discount[];
  },

  getById: async (id: string): Promise<Discount> => {
    const response = await api.get(`/discounts/${id}`);
    return response.data as Discount;
  },

  create: async (discountData: Omit<Discount, 'id'>): Promise<Discount> => {
    const response = await api.post('/discounts', discountData);
    return response.data as Discount;
  },

  update: async (id: string, updateData: Partial<Discount>): Promise<Discount> => {
    const response = await api.put(`/discounts/${id}`, updateData);
    return response.data as Discount;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/discounts/${id}`);
  },

  // Obtener descuentos activos
  getActiveDiscounts: async (): Promise<Discount[]> => {
    const response = await api.get('/discounts/active');
    return response.data as Discount[];
  },

  // Obtener descuentos por tipo
  getByType: async (type: 'PERCENTAGE' | 'FIXED' | 'BUY_X_GET_Y'): Promise<Discount[]> => {
    const response = await api.get(`/discounts/type/${type}`);
    return response.data as Discount[];
  },

  // Obtener descuentos aplicables a un producto
  getByProduct: async (productId: number): Promise<Discount[]> => {
    const response = await api.get(`/discounts/product/${productId}`);
    return response.data as Discount[];
  },

  // Activar/desactivar descuento
  toggleStatus: async (id: string, isActive: boolean): Promise<Discount> => {
    const response = await api.patch(`/discounts/${id}/status`, { isActive });
    return response.data as Discount;
  },

  // Aplicar descuento a productos específicos
  applyToProducts: async (id: string, productIds: number[]): Promise<Discount> => {
    const response = await api.post(`/discounts/${id}/products`, { productIds });
    return response.data as Discount;
  },

  // Remover descuento de productos
  removeFromProducts: async (id: string, productIds: number[]): Promise<void> => {
    await api.request({
      method: 'DELETE',
      url: `/discounts/${id}/products`,
      data: { productIds }
    });
  },

  // Obtener descuentos globales
  getGlobalDiscounts: async (): Promise<any> => {
    const response = await api.get('/discounts/global');
    return response.data;
  },
};
