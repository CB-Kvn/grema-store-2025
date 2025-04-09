import React, { useState, useRef } from 'react';

import { X, Receipt, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { Expense } from '@/types';

interface NewExpenseModalProps {
  onClose: () => void;
}

const initialExpense: Expense = {
  id: uuidv4(),
  date: new Date().toISOString(),
  description: '',
  amount: 0,
  category: 'MATERIALS',
  paymentMethod: '',
  receipt: '',
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const NewExpenseModal: React.FC<NewExpenseModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<Expense>(initialExpense);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description) newErrors.description = 'La descripción es requerida';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'El monto debe ser mayor a 0';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'El método de pago es requerido';

    return newErrors;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        receipt: 'Solo se permiten archivos JPG, PNG o PDF'
      }));
      return;
    }

    // Validate file size (5MB max)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    try {
      setIsUploading(true);

      if (selectedFile) {
        // Here you would typically:
        // 1. Upload the file to your storage service
        // 2. Get the URL of the uploaded file
        // 3. Update formData.receipt with the URL
        console.log('File to upload:', selectedFile);
      }

      // Here you would dispatch the action to add the expense
      console.log('New expense:', formData);
      onClose();
    } catch (error) {
      console.error('Error creating expense:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Error al crear el gasto. Por favor, intente nuevamente.'
      }));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-primary-100 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary-900">
            Nuevo Gasto
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-50 rounded-full"
          >
            <X className="h-5 w-5 text-primary-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Información del Gasto</h3>
            
            <div>
              <Label htmlFor="date">Fecha</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                <Input
                  type="date"
                  id="date"
                  value={formData.date.split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={errors.description ? 'border-red-500' : ''}
                placeholder="Descripción del gasto"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <Label htmlFor="amount">Monto</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                <Input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className={`pl-10 ${errors.amount ? 'border-red-500' : ''}`}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Categoría</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Expense['category'] })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="MATERIALS">Materiales</option>
                <option value="TOOLS">Herramientas</option>
                <option value="MARKETING">Marketing</option>
                <option value="SALARIES">Salarios</option>
                <option value="RENT">Alquiler</option>
                <option value="SERVICES">Servicios</option>
                <option value="OTHER">Otros</option>
              </select>
            </div>

            <div>
              <Label htmlFor="paymentMethod">Método de Pago</Label>
              <Input
                id="paymentMethod"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className={errors.paymentMethod ? 'border-red-500' : ''}
                placeholder="Efectivo, Tarjeta, Transferencia, etc."
              />
              {errors.paymentMethod && (
                <p className="text-sm text-red-500 mt-1">{errors.paymentMethod}</p>
              )}
            </div>

            <div>
              <Label htmlFor="receipt">Comprobante</Label>
              <input
                type="file"
                id="receipt"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
                  errors.receipt ? 'border-red-300' : 'border-primary-300'
                } hover:border-primary-400 cursor-pointer`}
              >
                <div className="space-y-1 text-center">
                  <Receipt className="mx-auto h-12 w-12 text-primary-400" />
                  <div className="flex text-sm text-primary-600">
                    <span className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      {selectedFile ? selectedFile.name : 'Subir un archivo'}
                    </span>
                  </div>
                  <p className="text-xs text-primary-500">
                    JPG, PNG o PDF hasta 5MB
                  </p>
                </div>
              </div>
              {errors.receipt && (
                <p className="text-sm text-red-500 mt-1">{errors.receipt}</p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Notas Adicionales</Label>
              <textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                placeholder="Notas o comentarios adicionales..."
              />
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
              disabled={isUploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-300 flex items-center"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                'Guardar Gasto'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewExpenseModal;