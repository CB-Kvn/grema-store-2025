import { PurchaseOrder } from '@/types/purchaseOrder';
import api from './api';


export const purchaseOrderService = {
  getAll: async () => {
    const response = await api.get('/purchase-orders');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/purchase-orders/${id}`);
    return response.data;
  },

  create: async (order: Omit<PurchaseOrder, 'id'>) => {
    const response = await api.post('/purchase-orders', order);
    return response.data;
  },

  update: async (id: string, order: Partial<PurchaseOrder>) => {
    const response = await api.put(`/purchase-orders/${id}`, order);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/purchase-orders/${id}`);
    return response.data;
  },

  addDocument: async (orderId: string, data: {
    type: 'INVOICE' | 'RECEIPT' | 'DELIVERY_NOTE' | 'OTHER';
    title: string;
    file: File;
  }) => {
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

  updateDocument: async (documentId: string, data: {
    title?: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  }) => {
    const response = await api.put(`/purchase-orders/documents/${documentId}`, data);
    return response.data;
  },

  getDocuments: async (orderId: string) => {
    const response = await api.get(`/purchase-orders/${orderId}/documents`);
    return response.data;
  },

  uploadReceipt: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/purchase-orders/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};