/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Plus, Trash2, Package, BoxIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import type { PurchaseOrder, PurchaseOrderItem } from '@/types';
import { updateOrder } from '@/store/slices/purchaseOrdersSlice';
import StockDistributionModal from '../inventory/StockDistributionModal';

interface EditOrderModalProps {
  order: PurchaseOrder;
  onClose: () => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<PurchaseOrder>(order);
  const [selectedItem, setSelectedItem] = useState<PurchaseOrderItem | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateOrder(formData));
    onClose();
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

  const handleStockDistribution = (distribution: any[]) => {
    console.log('Stock Distribution:', distribution);
    setShowStockModal(false);
    setSelectedItem(null);
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[800px] bg-white shadow-xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-primary-100 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary-900">
            Editar Orden
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
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orderNumber">Número de Orden</Label>
                <Input
                  id="orderNumber"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="supplier">Proveedor</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orderDate">Fecha de Orden</Label>
                <Input
                  type="date"
                  id="orderDate"
                  value={formData.orderDate}
                  onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="expectedDeliveryDate">Fecha de Entrega Esperada</Label>
                <Input
                  type="date"
                  id="expectedDeliveryDate"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as PurchaseOrder['status'] })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="pending">Pendiente</option>
                  <option value="approved">Aprobado</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div>
                <Label htmlFor="paymentStatus">Estado de Pago</Label>
                <select
                  id="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as PurchaseOrder['paymentStatus'] })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="pending">Pendiente</option>
                  <option value="partial">Parcial</option>
                  <option value="paid">Pagado</option>
                </select>
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

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Producto</th>
                    <th className="px-4 py-3 text-left">Cantidad</th>
                    <th className="px-4 py-3 text-left">Precio Unitario</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                    <th className="px-4 py-3 text-left">Stock</th>
                    <th className="px-4 py-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-primary-100">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <Package className="h-5 w-5 text-primary-400" />
                          <Input
                            value={item.productName}
                            onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                            placeholder="Nombre del producto"
                            className="border-0 focus:ring-0"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          min="1"
                          className="w-24"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          min="0"
                          step="0.01"
                          className="w-32"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">${item.totalPrice.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={item.status}
                          onChange={(e) => handleItemChange(index, 'status', e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="received">Recibido</option>
                          <option value="rejected">Rechazado</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedItem(item);
                            setShowStockModal(true);
                          }}
                          className="p-1 hover:bg-primary-50 rounded text-primary-600"
                          title="Gestionar Stock"
                        >
                          <BoxIcon className="h-4 w-4" />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Información Adicional</h3>

            <div>
              <Label htmlFor="paymentTerms">Términos de Pago</Label>
              <Input
                id="paymentTerms"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              />
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

          {/* Shipping Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Información de Envío</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trackingNumber">Número de Rastreo</Label>
                <Input
                  id="trackingNumber"
                  value={formData.trackingNumber || ''}
                  onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="shippingMethod">Método de Envío</Label>
                <Input
                  id="shippingMethod"
                  value={formData.shippingMethod || ''}
                  onChange={(e) => setFormData({ ...formData, shippingMethod: e.target.value })}
                />
              </div>
            </div>

            {formData.status === 'delivered' && (
              <div>
                <Label htmlFor="actualDeliveryDate">Fecha de Entrega Real</Label>
                <Input
                  type="date"
                  id="actualDeliveryDate"
                  value={formData.actualDeliveryDate || ''}
                  onChange={(e) => setFormData({ ...formData, actualDeliveryDate: e.target.value })}
                />
              </div>
            )}
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
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      {/* Stock Distribution Modal */}
      {showStockModal && selectedItem && (
        <StockDistributionModal
          productId={selectedItem.productId}
          quantity={selectedItem.quantity}
          onClose={() => {
            setShowStockModal(false);
            setSelectedItem(null);
          }}
          onSave={handleStockDistribution}
        />
      )}
    </>
  );
};

export default EditOrderModal;