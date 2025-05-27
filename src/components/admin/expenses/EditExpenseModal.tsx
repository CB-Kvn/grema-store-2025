import React from 'react';
import { X, Receipt, Loader2, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import type { Expense } from '@/types';
import { expenseCategories, paymentMethods } from '@/hooks/useNewExpenseModal';
import { useEditExpenseModal } from "@/hooks/useEditExpenseModal";


interface EditExpenseModalProps {
  expense: Expense;
  onClose: () => void;
  onExpenseUpdated: (updated: Expense) => void;
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  expense,
  onClose,
  onExpenseUpdated,
}) => {
  const {
    formData,
    setFormData,
    errors,
    isUploading,
    selectedFile,
    fileInputRef,
    handleDateChange,
    handleFileChange,
    handleSubmit,
  } = useEditExpenseModal(expense, onExpenseUpdated, onClose);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-primary-100 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary-900">Editar Gasto</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-50 rounded-full"
            disabled={isUploading}
          >
            <X className="h-5 w-5 text-primary-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Fecha</Label>
              <div className="relative">
                <DatePicker
                  selected={formData.date ? new Date(formData.date) : new Date()}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm shadow-sm"
                  placeholderText="Selecciona una fecha"
                  id="date"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
              </div>
              {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
            </div>
            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={errors.description ? 'border-red-500' : ''}
                placeholder="Descripción del gasto"
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Monto Total *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 text-lg">
                    ₡
                  </span>
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
                {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Expense['category'] })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Seleccionar categoría</option>
                  {expenseCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
              </div>
              <div>
                <Label htmlFor="paymentMethod">Método de Pago *</Label>
                <select
                  id="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${errors.paymentMethod ? 'border-red-500' : ''
                    }`}
                >
                  <option value="">Seleccionar método</option>
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
                {errors.paymentMethod && (
                  <p className="text-sm text-red-500 mt-1">{errors.paymentMethod}</p>
                )}
              </div>
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
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg border-primary-300 hover:border-primary-400 cursor-pointer`}
              >
                <div className="space-y-1 text-center">
                  <Receipt className="mx-auto h-12 w-12 text-primary-400" />
                  <div className="flex text-sm text-primary-600">
                    <span className="relative cursor-pointer rounded-md font-medium hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      {(formData.receipt || formData.receipt)
                        ? (
                            <>
                              Archivo seleccionado
                              {formData.receipt && (
                                <a
                                  href={formData.receipt}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 underline text-primary-600"
                                >
                                  Ver archivo
                                </a>
                              )}
                            </>
                          )
                        : 'Subir un archivo'}
                    </span>
                  </div>
                  <p className="text-xs text-primary-500">
                    JPG, PNG o PDF hasta 5MB
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notas Adicionales</Label>
              <textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px] text-sm"
                placeholder="Notas o comentarios adicionales..."
              />
            </div>
          </div>
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
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditExpenseModal;
