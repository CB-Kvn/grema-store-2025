import api from './api';
import { Banner } from '@/types';

export const bannerService = {
  // Obtener banner activo (público)
  getActive: async (): Promise<Banner | null> => {
    try {
      const response = await api.get('/banners/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active banner:', error);
      return null;
    }
  },

  // Obtener todos los banners (admin)
  getAll: async (): Promise<Banner[]> => {
    try {
      const response = await api.get('/banners');
      return response.data;
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  },

  // Obtener banner por ID (admin)
  getById: async (id: string): Promise<Banner | null> => {
    try {
      const response = await api.get(`/banners/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching banner by ID:', error);
      return null;
    }
  },

  // Obtener banners por status (admin)
  getByStatus: async (status: string): Promise<Banner[]> => {
    try {
      const response = await api.get(`/banners/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching banners by status:', error);
      return [];
    }
  },

  // Crear nuevo banner (admin)
  create: async (bannerData: Omit<Banner, 'id'>): Promise<Banner> => {
    try {
      const response = await api.post('/banners', bannerData);
      return response.data;
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  },

  // Actualizar banner completo (admin)
  update: async (id: string, bannerData: Omit<Banner, 'id'>): Promise<Banner> => {
    try {
      const response = await api.put(`/banners/${id}`, bannerData);
      return response.data;
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  },

  // Actualizar solo el status del banner (admin)
  updateStatus: async (id: string, status: string): Promise<Banner> => {
    try {
      const response = await api.patch(`/banners/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating banner status:', error);
      throw error;
    }
  },

  // Eliminar banner (admin)
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/banners/${id}`);
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  },

  // Subir imagen de banner (admin)
  uploadImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/banners/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading banner image:', error);
      throw error;
    }
  }
};