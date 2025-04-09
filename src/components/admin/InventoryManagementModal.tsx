import React, { useState } from 'react';
import { X, Plus, Minus, Package, Warehouse, Tag, AlertTriangle } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { Product, Warehouse as WarehouseType, Discount } from '@/types';

interface InventoryManagementModalProps {
  product: Product;
  warehouses: WarehouseType[];
  onClose: () => void;
  onSave: (data: {
    inventory: { quantity: number; warehouseId: string }[];
    discount?: Discount;
  }) => void;
}

const InventoryManagementModal: React.FC<InventoryManagementModalProps> = ({
  product,
  warehouses,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'discount' | 'distribution'>('inventory');
  const [inventory, setInventory] = useState<{ quantity: number; warehouseId: string }[]>([]);
  const [discount, setDiscount] = useState<Partial<Discount>>({
    type: 'PERCENTAGE',
    value: 0,
    startDate: new Date().toISOString().split('T')[0],
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      inventory,
      discount: discount as Discount,
    });
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
            Gestión de Inventario - {product.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-50 rounded-full"
          >
            <X className="h-5 w-5 text-primary-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b border-primary-100">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeTab === 'inventory'
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-primary-600 hover:bg-primary-50'
              }`}
            >
              <Package className="h-5 w-5 mr-2" />
              Inventario
            </button>
            <button
              onClick={() => setActiveTab('discount')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeTab === 'discount'
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-primary-600 hover:bg-primary-50'
              }`}
            >
              <Tag className="h-5 w-5 mr-2" />
              Descuentos
            </button>
            <button
              onClick={() => setActiveTab('distribution')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeTab === 'distribution'
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-primary-600 hover:bg-primary-50'
              }`}
            >
              <Warehouse className="h-5 w-5 mr-2" />
              Distribución
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-primary-900">Gestión de Stock</h3>
                <button
                  type="button"
                  onClick={() => setInventory([...inventory, { quantity: 0, warehouseId: '' }])}
                  className="flex items-center text-primary-600 hover:text-primary-700"
                >
                  <Plus className="h-5 w-5 mr-1" />
                  Agregar Stock
                </button>
              </div>

              {inventory.map((item, index) => (
                <div key={index} className="bg-primary-50 p-4 rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-primary-900">Stock #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newInventory = [...inventory];
                        newInventory.splice(index, 1);
                        setInventory(newInventory);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Cantidad</Label>
                      <div className="flex items-center mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const newInventory = [...inventory];
                            newInventory[index].quantity = Math.max(0, newInventory[index].quantity - 1);
                            setInventory(newInventory);
                          }}
                          className="p-2 border border-primary-200 rounded-l-lg hover:bg-primary-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newInventory = [...inventory];
                            newInventory[index].quantity = Math.max(0, parseInt(e.target.value) || 0);
                            setInventory(newInventory);
                          }}
                          className="rounded-none border-x-0 text-center"
                          min="0"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newInventory = [...inventory];
                            newInventory[index].quantity += 1;
                            setInventory(newInventory);
                          }}
                          className="p-2 border border-primary-200 rounded-r-lg hover:bg-primary-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label>Bodega</Label>
                      <select
                        value={item.warehouseId}
                        onChange={(e) => {
                          const newInventory = [...inventory];
                          newInventory[index].warehouseId = e.target.value;
                          setInventory(newInventory);
                        }}
                        className="w-full mt-1 rounded-lg border border-primary-200 p-2"
                      >
                        <option value="">Seleccionar bodega</option>
                        {warehouses.map(warehouse => (
                          <option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Discount Tab */}
          {activeTab === 'discount' && (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={discount.isActive}
                  onChange={(e) => setDiscount({ ...discount, isActive: e.target.checked })}
                  className="rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                />
                <Label className="ml-2">Activar descuento</Label>
              </div>

              {discount.isActive && (
                <>
                  <div>
                    <Label>Tipo de Descuento</Label>
                    <select
                      value={discount.type}
                      onChange={(e) => setDiscount({ ...discount, type: e.target.value as Discount['type'] })}
                      className="w-full mt-1 rounded-lg border border-primary-200 p-2"
                    >
                      <option value="PERCENTAGE">Porcentaje</option>
                      <option value="FIXED_AMOUNT">Monto Fijo</option>
                      <option value="BUY_X_GET_Y">Compre X Lleve Y</option>
                    </select>
                  </div>

                  <div>
                    <Label>
                      {discount.type === 'PERCENTAGE' ? 'Porcentaje' :
                       discount.type === 'FIXED_AMOUNT' ? 'Monto' :
                       'Cantidad mínima'}
                    </Label>
                    <Input
                      type="number"
                      value={discount.value}
                      onChange={(e) => setDiscount({ ...discount, value: parseFloat(e.target.value) })}
                      min="0"
                      step={discount.type === 'PERCENTAGE' ? '0.01' : '1'}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Fecha de Inicio</Label>
                      <Input
                        type="date"
                        value={discount.startDate}
                        onChange={(e) => setDiscount({ ...discount, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Fecha de Fin (Opcional)</Label>
                      <Input
                        type="date"
                        value={discount.endDate}
                        onChange={(e) => setDiscount({ ...discount, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  {(discount.type === 'PERCENTAGE' || discount.type === 'FIXED_AMOUNT') && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Cantidad Mínima (Opcional)</Label>
                        <Input
                          type="number"
                          value={discount.minQuantity || ''}
                          onChange={(e) => setDiscount({ ...discount, minQuantity: parseInt(e.target.value) })}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label>Cantidad Máxima (Opcional)</Label>
                        <Input
                          type="number"
                          value={discount.maxQuantity || ''}
                          onChange={(e) => setDiscount({ ...discount, maxQuantity: parseInt(e.target.value) })}
                          min="0"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Distribution Tab */}
          {activeTab === 'distribution' && (
            <div className="space-y-4">
              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-primary-600 mr-2" />
                  <p className="text-primary-600">
                    La distribución de stock te permite mover inventario entre bodegas.
                  </p>
                </div>
              </div>

              {warehouses.map(warehouse => {
                const warehouseStock = warehouse.items.find(item => item.productId === product.id);
                return (
                  <div key={warehouse.id} className="bg-white border border-primary-100 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-primary-900">{warehouse.name}</h3>
                        <p className="text-sm text-primary-600">{warehouse.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-primary-600">Stock Actual</p>
                        <p className="font-medium text-primary-900">{warehouseStock?.quantity || 0}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <Label>Transferir a</Label>
                        <select
                          className="w-full mt-1 rounded-lg border border-primary-200 p-2"
                          defaultValue=""
                        >
                          <option value="" disabled>Seleccionar bodega</option>
                          {warehouses
                            .filter(w => w.id !== warehouse.id)
                            .map(w => (
                              <option key={w.id} value={w.id}>{w.name}</option>
                            ))
                          }
                        </select>
                      </div>
                      <div>
                        <Label>Cantidad</Label>
                        <Input
                          type="number"
                          min="0"
                          max={warehouseStock?.quantity || 0}
                          defaultValue="0"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-primary-100">
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

export default InventoryManagementModal;