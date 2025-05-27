import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateExpense } from "@/store/slices/expensesSlice";
import { expenseService } from "@/services/expenseService";
import type { Expense } from "@/types";

export function useEditExpenseModal(expense: Expense, onExpenseUpdated: (updated: Expense) => void, onClose: () => void) {
  const [formData, setFormData] = useState<Expense>({ ...expense });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handleDateChange = (date: Date) => {
    setFormData({ ...formData, date: date.toISOString() });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData({ ...formData, receiptUrl: url });
      setSelectedFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.description) newErrors.description = 'Requerido';
    if (!formData.amount || isNaN(Number(formData.amount))) newErrors.amount = 'Requerido';
    if (!formData.category) newErrors.category = 'Requerido';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Requerido';
    if (!formData.date) newErrors.date = 'Requerido';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsUploading(true);

      let receipt = formData.receiptUrl;
      if (selectedFile) {
        const uploadResponse = await expenseService.uploadReceipt(formData.id, selectedFile);
        receipt = uploadResponse.filePath;
      }

      const { receiptUrl, ...restFormData } = formData;
      const expenseToUpdate = {
        ...restFormData,
        receipt,
        userId: "admin",
      };

      const updatedExpense = await expenseService.update(formData.id, expenseToUpdate);

      dispatch(updateExpense(updatedExpense as Expense));
      onExpenseUpdated(updatedExpense as Expense);
      onClose();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: "Error al actualizar el gasto. Por favor, intente nuevamente.",
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
    handleDateChange,
    handleFileChange,
    handleSubmit,
  };
}