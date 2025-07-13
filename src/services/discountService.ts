import { Discount } from '@/types';
import api from './api';

export const discountService = {
  getAll: async () => {
    const response = await api.get('/discounts');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/discounts/${id}`);
    return response.data;
  },

  create: async (discountData: Omit<Discount, 'id'>) => {
    const response = await api.post('/discounts', discountData);
    return response.data;
  },

  update: async (id: string, updateData: Partial<Discount>) => {
    const response = await api.put(`/discounts/${id}`, updateData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/discounts/${id}`);
    return response.data;
  },

  // Obtener descuentos activos
  getActiveDiscounts: async () => {
    const response = await api.get('/discounts/active');
    return response.data;
  },

  // Obtener descuentos por tipo
  getByType: async (type: 'PERCENTAGE' | 'FIXED' | 'BUY_X_GET_Y') => {
    const response = await api.get(`/discounts/type/${type}`);
    return response.data;
  },

  // Obtener descuentos aplicables a un producto
  getByProduct: async (productId: number) => {
    const response = await api.get(`/discounts/product/${productId}`);
    return response.data;
  },

  // Activar/desactivar descuento
  toggleStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/discounts/${id}/status`, { isActive });
    return response.data;
  },

  // Aplicar descuento a productos específicos
  applyToProducts: async (id: string, productIds: number[]) => {
    const response = await api.post(`/discounts/${id}/products`, { productIds });
    return response.data;
  },

  // Remover descuento de productos
  removeFromProducts: async (id: string, productIds: number[]) => {
    const response = await api.request({
      method: 'DELETE',
      url: `/discounts/${id}/products`,
      data: { productIds }
    });
    return response.data;
  },
};
