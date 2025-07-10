import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { expenseService } from "@/services/expenseService";
import { useAppDispatch } from '@/hooks/useAppDispatch';

import type { Expense } from '@/types';
import { addExpense } from '@/store/slices/expensesSlice';

export const initialExpense: Expense = {
  id: uuidv4(),
  date: new Date().toISOString(),
  description: '',
  amount: 0,
  category: 'MATERIALS',
  paymentMethod: '',
  receipt: '',
  notes: '',
  subtotal: 0,
  taxes: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: '',
  approvedBy: null,
  approvedAt: null
};

export const expenseCategories = [
  { value: 'MATERIALS', label: 'Materiales' },
  { value: 'TOOLS', label: 'Herramientas' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'SALARIES', label: 'Salarios' },
  { value: 'RENT', label: 'Alquiler' },
  { value: 'SERVICES', label: 'Servicios' },
  { value: 'OTHER', label: 'Otros' }
];

export const paymentMethods = [
  { value: 'CASH', label: 'Efectivo' },
  { value: 'CREDIT_CARD', label: 'Tarjeta de Crédito' },
  { value: 'DEBIT_CARD', label: 'Tarjeta de Débito' },
  { value: 'BANK_TRANSFER', label: 'Transferencia Bancaria' },
  { value: 'CHECK', label: 'Cheque' },
  { value: 'OTHER', label: 'Otro' }
];

export function useNewExpenseModal(onExpenseCreated?: (newExpense: Expense) => void) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Expense>({ ...initialExpense, id: uuidv4() });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({ ...initialExpense, id: uuidv4() });
    setErrors({});
    setSelectedFile(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'El método de pago es requerido';
    }
    if (formData.subtotal && formData.subtotal < 0) {
      newErrors.subtotal = 'El subtotal no puede ser negativo';
    }
    if (formData.taxes && formData.taxes < 0) {
      newErrors.taxes = 'Los impuestos no pueden ser negativos';
    }
    return newErrors;
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        date: date.toISOString()
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        receipt: 'Solo se permiten archivos JPG, PNG o PDF'
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        receipt: 'El archivo no debe superar los 5MB'
      }));
      return;
    }

    setSelectedFile(file);
    setErrors(prev => ({ ...prev, receipt: '' }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setFormData({
      ...formData,
      amount: value,
    });
  };
  const handleSubtotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setFormData({
      ...formData,
      subtotal: value
    });
  };

  const handleTaxesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setFormData({
      ...formData,
      taxes: value
    });
  };

  const handleSubmit = async (
    e: React.FormEvent,
    onClose: () => void
  ) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsUploading(true);

      let receiptUrl = formData.receipt;
      if (selectedFile) {
        const uploadResponse = await expenseService.uploadReceipt(formData.id, selectedFile);
        receiptUrl = uploadResponse.url;
      }

      const expenseToCreate = {
      ...formData,
      amount: Number(formData.amount),
      subtotal: Number(formData.subtotal),
      taxes: Number(formData.taxes),
      receipt: receiptUrl,
      userId: "admin",
    };

      const createdExpense = await expenseService.create(expenseToCreate);

      if (onExpenseCreated) {
        onExpenseCreated(createdExpense);
      }
      dispatch(addExpense(createdExpense as Expense));
      resetForm();
      onClose();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: "Error al crear el gasto. Por favor, intente nuevamente.",
      }));
    } finally {
      setIsUploading(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isUploading,
    selectedFile,
    setSelectedFile,
    fileInputRef,
    resetForm,
    validateForm,
    handleDateChange,
    handleFileChange,
    handleAmountChange,
    handleSubtotalChange,
    handleTaxesChange,
    handleSubmit,
  };
}