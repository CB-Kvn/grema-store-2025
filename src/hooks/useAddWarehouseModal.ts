import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addWarehouse, updateWarehouse } from '@/store/slices/warehousesSlice';
import type { Warehouse, WarehouseItem } from '@/types';
import { warehouseService } from '@/services/warehouseService';

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
  status: 'ACTIVE',
  items: [],
  lastInventoryDate: new Date().toISOString(),
};

export function useAddWarehouseModal(onClose: () => void) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Warehouse>(initialWarehouse);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editOrNew, setEditOrNew] = useState<'edit' | 'new'>('new');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    if (editOrNew === 'edit') {
      await warehouseService.update(formData.id, formData);
      dispatch(updateWarehouse(formData));
      onClose();
    } else {
      await warehouseService.create(formData);
      dispatch(addWarehouse(formData));
      onClose();
    }
  
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

return {
  formData,
  setFormData,
  errors,
  setErrors,
  handleSubmit,
  addItem,
  removeItem,
  handleItemChange,
  editOrNew,
  setEditOrNew,
};
}