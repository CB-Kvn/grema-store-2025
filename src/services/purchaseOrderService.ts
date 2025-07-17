import { PurchaseOrder } from '@/types/purchaseOrder';
import api from './api';

// Tipos para las operaciones del servicio
export interface CreateOrderData extends Omit<PurchaseOrder, 'createdAt' | 'updatedAt'> {}

export interface UpdateOrderData extends Partial<PurchaseOrder> {}

export interface DocumentData {
  type: 'INVOICE' | 'RECEIPT' | 'DELIVERY_NOTE' | 'OTHER';
  title: string;
  file?: File;
  url?: string;
  hash?: string;
  mimeType?: string;
  size?: number;
}

export interface DocumentUpdateData {
  title?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  url?: string;
  hash?: string;
  mimeType?: string;
  size?: number;
}

export interface UploadResponse {
  url: string;
  fileType: string;
  size: number;
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
    const {createdAt, updatedAt, ...orderData } = order as any;
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
    const response = await api.post(`/purchase-orders/${orderId}/documents`,data);
    return response.data;
  },

  updateDocument: async (orderId: string, data: DocumentUpdateData) => {
    const response = await api.put(`/purchase-orders/${orderId}/documents`, data);
    return response.data;
  },

  updateDocumentWithFile: async (documentId: string, file: File, data?: Partial<DocumentUpdateData>) => {
    try {
      // Primero subir el nuevo archivo
      const uploadResponse = await purchaseOrderService.uploadFileReceipt(file) as UploadResponse;
      
      // Luego actualizar el documento con la nueva información
      const updateData = {
        ...data,
        url: uploadResponse.url,
        mimeType: uploadResponse.fileType || file.type,
        size: uploadResponse.size || file.size,
      };
      
      const response = await api.put(`/purchase-orders/documents/${documentId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating document with file:', error);
      throw error;
    }
  },

  getDocuments: async (orderId: string) => {
    const response = await api.get(`/purchase-orders/${orderId}/documents`);
    return response.data;
  },

  getDocumentById: async (documentId: string) => {
    const response = await api.get(`/purchase-orders/documents/${documentId}`);
    return response.data;
  },

  deleteDocument: async (documentId: string): Promise<void> => {
    await api.delete(`/purchase-orders/documents/${documentId}`);
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

  uploadFileReceipt: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/purchase-orders/uploadReceipt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as UploadResponse;
  },
};