/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import type { Warehouse, WarehouseItem } from '@/types';
import { addWarehouse } from '@/store/slices/warehousesSlice';

interface AddWarehouseModalProps {
  onClose: () => void;
}

const initialWarehouse: Warehouse = {
  id: uuidv4(),
  name: '',
  location: '',
  address: '',
  manager: '',
  phone: '',
  email: '',
  capacity: 0,
  currentOccupancy: 0,
  status: 'active',
  items: [],
  lastInventoryDate: new Date().toISOString(),
};

const AddWarehouseModal: React.FC<AddWarehouseModalProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Warehouse>(initialWarehouse);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'El nombre es requerido';
    if (!formData.location) newErrors.location = 'La ubicación es requerida';
    if (!formData.address) newErrors.address = 'La dirección es requerida';
    if (!formData.manager) newErrors.manager = 'El encargado es requerido';
    if (!formData.phone) newErrors.phone = 'El teléfono es requerido';
    if (!formData.email) newErrors.email = 'El email es requerido';
    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = 'La capacidad debe ser mayor a 0';

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    dispatch(addWarehouse(formData));
    onClose();
  };

  const addItem = () => {
    const newItem: WarehouseItem = {
      id: uuidv4(),
      productId: 0,
      productName: '',
      sku: '',
      quantity: 0,
      minimumStock: 0,
      location: '',
      lastUpdated: new Date().toISOString(),
      status: 'in_stock',
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const currentOccupancy = newItems.reduce((sum, item) => sum + item.quantity, 0);
    setFormData({ ...formData, items: newItems, currentOccupancy });
  };

  const handleItemChange = (index: number, field: keyof WarehouseItem, value: any) => {
    const newItems = [...formData.items];
    if (field === 'quantity' || field === 'minimumStock') {
      const quantity = Number(value);
      newItems[index] = {
        ...newItems[index],
        [field]: quantity,
        status: quantity === 0 ? 'out_of_stock' :
                quantity <= newItems[index].minimumStock ? 'low_stock' : 'in_stock'
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };
    }
    
    const currentOccupancy = newItems.reduce((sum, item) => sum + item.quantity, 0);
    setFormData({ ...formData, items: newItems, currentOccupancy });
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
            Nueva Bodega
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
              <Label htmlFor="name">Nombre de la Bodega</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && (
                <p className="text-sm text-red-500 mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-500 mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <Label htmlFor="manager">Encargado</Label>
              <Input
                id="manager"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                className={errors.manager ? 'border-red-500' : ''}
              />
              {errors.manager && (
                <p className="text-sm text-red-500 mt-1">{errors.manager}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
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
                  className={errors.capacity ? 'border-red-500' : ''}
                />
                {errors.capacity && (
                  <p className="text-sm text-red-500 mt-1">{errors.capacity}</p>
                )}
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Warehouse['status'] })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
              </div>
            </div>
          </div>

          {/* Initial Inventory */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-primary-900">Inventario Inicial</h3>
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
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`productName-${index}`}>Nombre del Producto</Label>
                    <Input
                      id={`productName-${index}`}
                      value={item.productName}
                      onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`sku-${index}`}>SKU</Label>
                    <Input
                      id={`sku-${index}`}
                      value={item.sku}
                      onChange={(e) => handleItemChange(index, 'sku', e.target.value)}
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
                    />
                  </div>
                  <div>
                    <Label htmlFor={`location-${index}`}>Ubicación</Label>
                    <Input
                      id={`location-${index}`}
                      value={item.location}
                      onChange={(e) => handleItemChange(index, 'location', e.target.value)}
                      placeholder="Ej: A-101"
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
              placeholder="Notas adicionales sobre la bodega..."
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
              Crear Bodega
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddWarehouseModal;