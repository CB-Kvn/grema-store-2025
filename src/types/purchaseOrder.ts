

export interface PurchaseOrderItem {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'received' | 'rejected';
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  paymentTerms: string;
  trackingNumber?: string;
  shippingMethod?: string;
  notes?: string;
  documents?: {
    type: 'invoice' | 'receipt' | 'delivery_note' | 'other';
    title: string;
    url: string;
    uploadedAt: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
}