export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  paymentTerms: string;
  rating: number;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}