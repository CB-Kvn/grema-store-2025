export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: 'MATERIALS' | 'TOOLS' | 'MARKETING' | 'SALARIES' | 'RENT' | 'SERVICES' | 'OTHER';
  paymentMethod: string;
  receipt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}