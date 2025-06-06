import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateWarehouse } from '@/store/slices/warehousesSlice';
import { v4 as uuidv4 } from 'uuid';
import type { Warehouse, WarehouseItem } from '@/types';
import { warehouseService } from '@/services/warehouseService';

export function useEditWarehouseModal(warehouse: Warehouse, onClose: () => void) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Warehouse>(warehouse);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await warehouseService.update(warehouse.id, formData);
    dispatch(updateWarehouse(formData));
    onClose();
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
      status: 'out_of_stock',
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

  return {
    formData,
    setFormData,
    handleSubmit,
    handleItemChange,
    addItem,
    removeItem,
  };
}