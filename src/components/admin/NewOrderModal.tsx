/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Plus, Trash2, Package } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { PurchaseOrder, PurchaseOrderItem } from '@/types';
import { addOrder } from '@/store/slices/purchaseOrdersSlice';

interface NewOrderModalProps {
  onClose: () => void;
}

const initialOrder: PurchaseOrder = {
  id: uuidv4(),
  orderNumber: `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
  supplier: '',
  status: 'pending',
  orderDate: new Date().toISOString(),
  expectedDeliveryDate: '',
  items: [],
  totalAmount: 0,
  paymentStatus: 'pending',
  paymentTerms: 'Net 30',
};

const NewOrderModal: React.FC<NewOrderModalProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<PurchaseOrder>(initialOrder);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplier) newErrors.supplier = 'El proveedor es requerido';
    if (!formData.expectedDeliveryDate) newErrors.expectedDeliveryDate = 'La fecha de entrega es requerida';
    if (formData.items.length === 0) newErrors.items = 'Debe agregar al menos un producto';
    if (!formData.paymentTerms) newErrors.paymentTerms = 'Los términos de pago son requeridos';

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    dispatch(addOrder(formData));
    onClose();
  };

  const addItem = () => {
    const newItem: PurchaseOrderItem = {
      id: uuidv4(),
      productId: 0,
      productName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      status: 'pending',
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setFormData({ ...formData, items: newItems, totalAmount });
  };

  const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const newItems = [...formData.items];
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? Number(value) : newItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? Number(value) : newItems[index].unitPrice;
      newItems[index] = {
        ...newItems[index],
        [field]: Number(value),
        totalPrice: quantity * unitPrice,
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };
    }
    
    const totalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setFormData({ ...formData, items: newItems, totalAmount });
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
            Nueva Orden de Compra
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
            <h3 className="text-lg font-medium text-primary-900">Información Básica</h3>
            
            <div>
              <Label htmlFor="orderNumber">Número de Orden</Label>
              <Input
                id="orderNumber"
                value={formData.orderNumber}
                readOnly
                className="bg-primary-50"
              />
            </div>

            <div>
              <Label htmlFor="supplier">Proveedor</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className={errors.supplier ? 'border-red-500' : ''}
              />
              {errors.supplier && (
                <p className="text-sm text-red-500 mt-1">{errors.supplier}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orderDate">Fecha de Orden</Label>
                <Input
                  type="date"
                  id="orderDate"
                  value={formData.orderDate.split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="expectedDeliveryDate">Fecha de Entrega Esperada</Label>
                <Input
                  type="date"
                  id="expectedDeliveryDate"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                  className={errors.expectedDeliveryDate ? 'border-red-500' : ''}
                />
                {errors.expectedDeliveryDate && (
                  <p className="text-sm text-red-500 mt-1">{errors.expectedDeliveryDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-primary-900">Productos</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Producto
              </button>
            </div>

            {errors.items && (
              <p className="text-sm text-red-500">{errors.items}</p>
            )}

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={item.id} className="bg-primary-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-primary-600 mr-2" />
                      <h4 className="font-medium text-primary-900">Producto {index + 1}</h4>
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`productName-${index}`}>Nombre del Producto</Label>
                      <Input
                        id={`productName-${index}`}
                        value={item.productName}
                        onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`quantity-${index}`}>Cantidad</Label>
                      <Input
                        type="number"
                        id={`quantity-${index}`}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`unitPrice-${index}`}>Precio Unitario</Label>
                      <Input
                        type="number"
                        id={`unitPrice-${index}`}
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label>Total</Label>
                      <Input
                        value={`$${item.totalPrice.toLocaleString()}`}
                        readOnly
                        className="bg-primary-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Terms */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Términos de Pago</h3>
            
            <div>
              <Label htmlFor="paymentTerms">Términos de Pago</Label>
              <select
                id="paymentTerms"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className={`w-full rounded-md border ${
                  errors.paymentTerms ? 'border-red-500' : 'border-input'
                } bg-background px-3 py-2`}
              >
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="Immediate">Inmediato</option>
              </select>
              {errors.paymentTerms && (
                <p className="text-sm text-red-500 mt-1">{errors.paymentTerms}</p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Notas</Label>
              <textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
              />
            </div>
          </div>

          {/* Total Amount */}
          <div className="border-t border-primary-100 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-primary-900">Total</span>
              <span className="text-2xl font-bold text-primary-900">
                ${formData.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Crear Orden
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewOrderModal;