import api from './api';

// Interfaz para la respuesta del usuario de Google
export interface GoogleUserResponse {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  typeUser: 'BUYER' | 'ADMIN';
  discounts?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Interfaz para crear/actualizar usuario de Google
export interface GoogleUserData {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  typeUser?: 'BUYER' | 'ADMIN';
  discounts?: string[];
}

// Interfaz para actualizar usuario de Google
export interface GoogleUserUpdateData {
  googleId?: string;
  email?: string;
  name?: string;
  avatar?: string;
  typeUser?: 'BUYER' | 'ADMIN';
  discounts?: string[];
}

export const userService = {
  // Obtener todos los usuarios
  getUsers: async (): Promise<any[]> => {
    const response = await api.get('/users');
    return response.data as any[];
  },

  // Obtener un usuario por ID
  getUserById: async (id: string): Promise<any> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Buscar o crear usuario de Google
  findOrCreateGoogleUser: async (userData: GoogleUserData): Promise<GoogleUserResponse> => {
    const response = await api.post('/google/users/find-or-create', userData);
    return response.data as GoogleUserResponse;
  },

  // Actualizar usuario de Google
  updateGoogleUser: async (id: string, updateData: GoogleUserUpdateData): Promise<GoogleUserResponse> => {
    const response = await api.put(`/google/users/${id}`, updateData);
    return response.data as GoogleUserResponse;
  },

  // Actualizar descuento de usuario (deprecado - usar updateGoogleUser)
  updateUserDiscount: async (id: string, discount: number) => {
    const response = await api.put(`/users/${id}/discount`, { discount });
    return response.data;
  },

  // Actualizar tipo de usuario (deprecado - usar updateGoogleUser)
  updateUserType: async (id: string, userType: 'BUYER' | 'ADMIN') => {
    const response = await api.put(`/users/${id}/type`, { userType });
    return response.data;
  },

  // Actualizar códigos de descuento de usuario (deprecado - usar updateGoogleUser)
  updateUserDiscountCodes: async (id: string, discountCodes: string[]) => {
    const response = await api.put(`/users/${id}/discount-codes`, { discountCodes });
    return response.data;
  },

  // Crear usuario
  createUser: async (userData: any) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Eliminar usuario
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Obtener perfil del usuario actual
  getCurrentUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Actualizar perfil del usuario actual
  updateProfile: async (profileData: any) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
};
