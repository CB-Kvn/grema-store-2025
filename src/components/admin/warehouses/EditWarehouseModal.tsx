/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

import type { Warehouse } from '@/types';
import { useEditWarehouseModal } from '@/hooks/useEditWarehouseModal';

interface EditWarehouseModalProps {
  warehouse: Warehouse;
  onClose: () => void;
}

const EditWarehouseModal: React.FC<EditWarehouseModalProps> = ({ warehouse, onClose }) => {
  const {
    formData,
    setFormData,
    handleSubmit,
    handleItemChange,
    addItem,
    removeItem,
  } = useEditWarehouseModal(warehouse, onClose);

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
            Editar Almacén
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
              <Label htmlFor="name">Nombre del Almacén</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manager">Encargado</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Warehouse['status'] })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">Capacidad Total</Label>
                <Input
                  type="number"
                  id="capacity"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastInventoryDate">Último Inventario</Label>
                <Input
                  type="date"
                  id="lastInventoryDate"
                  value={formData.lastInventoryDate?.split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, lastInventoryDate: e.target.value })}
                />
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
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus className="h-4 w-4 inline mr-1" />
                Agregar Producto
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={item.id} className="bg-primary-50 p-4 rounded-lg space-y-4">
                <div className="flex justify-between">
                  <h4 className="font-medium text-primary-900">Producto {index + 1}</h4>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`productName-${index}`}>Nombre del Producto</Label>
                    <Input
                      id={`productName-${index}`}
                      value={item.productName}
                      onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`sku-${index}`}>SKU</Label>
                    <Input
                      id={`sku-${index}`}
                      value={item.sku}
                      onChange={(e) => handleItemChange(index, 'sku', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`quantity-${index}`}>Cantidad</Label>
                    <Input
                      type="number"
                      id={`quantity-${index}`}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`minimumStock-${index}`}>Stock Mínimo</Label>
                    <Input
                      type="number"
                      id={`minimumStock-${index}`}
                      value={item.minimumStock}
                      onChange={(e) => handleItemChange(index, 'minimumStock', e.target.value)}
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`location-${index}`}>Ubicación</Label>
                    <Input
                      id={`location-${index}`}
                      value={item.location}
                      onChange={(e) => handleItemChange(index, 'location', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notas</Label>
            <textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
            />
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
    </>
  );
};

export default EditWarehouseModal;