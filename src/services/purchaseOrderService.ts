import { PurchaseOrder } from '@/types/purchaseOrder';
import api from './api';

// Tipos para las operaciones del servicio
export interface CreateOrderData extends Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateOrderData extends Partial<PurchaseOrder> {}

export interface DocumentData {
  type: 'INVOICE' | 'RECEIPT' | 'DELIVERY_NOTE' | 'OTHER';
  title: string;
  file: File;
}

export interface DocumentUpdateData {
  title?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const purchaseOrderService = {
  getAll: async (): Promise<PurchaseOrder[]> => {
    const response = await api.get('/purchase-orders');
    return response.data as PurchaseOrder[];
  },

  getById: async (id: string): Promise<PurchaseOrder> => {
    const response = await api.get(`/purchase-orders/${id}`);
    return response.data as PurchaseOrder;
  },

  create: async (order: CreateOrderData): Promise<PurchaseOrder> => {
    // Excluir id, createdAt y updatedAt ya que el backend los maneja
    const { id, createdAt, updatedAt, ...orderData } = order as any;
    const response = await api.post('/purchase-orders', orderData);
    return response.data as PurchaseOrder;
  },

  update: async (id: string, order: UpdateOrderData): Promise<PurchaseOrder> => {
    const response = await api.put(`/purchase-orders/${id}`, order);
    return response.data as PurchaseOrder;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/purchase-orders/${id}`);
  },

  addDocument: async (orderId: string, data: DocumentData) => {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('title', data.title);
    formData.append('file', data.file);

    const response = await api.post(`/purchase-orders/${orderId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateDocument: async (documentId: string, data: DocumentUpdateData) => {
    const response = await api.put(`/purchase-orders/documents/${documentId}`, data);
    return response.data;
  },

  getDocuments: async (orderId: string) => {
    const response = await api.get(`/purchase-orders/${orderId}/documents`);
    return response.data;
  },

  uploadReceipt: async (orderId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('orderId', orderId);

    const response = await api.post(`/purchase-orders/${orderId}/upload-receipt`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};