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

  create: async (product: Product) => {
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

  updateInventory: async (id: string, data: {
    quantity: number;
    warehouseId: string;
  }) => {
    const response = await api.post(`/products/${id}`);
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
    const response = await api.post(`/warehouses/transfer/${data.sourceWarehouseId}/${data.targetWarehouseId}/${id}`, data);
    return response.data;
  },

  uploadImages: async (files: File[]) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post(`/photo/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  createImage: async (url: string, productId: number) => {
    const response = await api.post('/products/image-create', { url, productId });
    return response.data;
  },
  updateImage: async (id: number, url: string[], state: boolean, productId: number) => {
    const response = await api.post('/products/image-update', { id, url, state, productId });
    return response.data;
  },
  deleteImage: async (id: string) => {
    const response = await api.delete(`/products/image-delete/${id}`);
    return response.data;
  },
  getLatestProducts: async () => {
    const response = await api.get(`/products/latest`);
    return response.data;
  },
  getBestSellingProducts: async () => {
    const response = await api.get(`/products/best-sellers`);
    return response.data;
  },
  getPendingQuantities: async (id: number) => {
    const response = await api.get(`/products/${id}/pending-quantity`);
    return response.data;
  },
};