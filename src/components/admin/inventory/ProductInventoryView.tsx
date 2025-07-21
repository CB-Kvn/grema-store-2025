import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { 
  ArrowLeft, 
  Save, 
  Package, 
  BarChart3,
  AlertTriangle,
  Warehouse as WarehouseIcon
} from 'lucide-react';
import type { Product, Warehouse } from '../../../types';

interface ProductInventoryViewProps {
  product: Product;
  warehouses: Warehouse[];
  onBack: () => void;
  onSave: (inventoryData: any) => void;
}

interface InventoryItem {
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  location: string;
  price: number;
  minStock: number;
  maxStock: number;
}

const ProductInventoryView: React.FC<ProductInventoryViewProps> = ({
  product,
  warehouses,
  onBack,
  onSave
}) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    // Inicializar con datos existentes o crear uno vacío
    return warehouses.map(warehouse => ({
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      quantity: 0,
      location: '',
      price: product.price || 0,
      minStock: 5,
      maxStock: 100
    }));
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    inventoryItems.forEach((item, index) => {
      if (item.quantity < 0) {
        newErrors[`quantity-${index}`] = 'La cantidad no puede ser negativa';
      }
      if (item.price <= 0) {
        newErrors[`price-${index}`] = 'El precio debe ser mayor a 0';
      }
      if (item.minStock < 0) {
        newErrors[`minStock-${index}`] = 'El stock mínimo no puede ser negativo';
      }
      if (item.maxStock <= item.minStock) {
        newErrors[`maxStock-${index}`] = 'El stock máximo debe ser mayor al mínimo';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        productId: product.id,
        inventory: inventoryItems.filter(item => item.quantity > 0)
      });
    }
  };

  const updateInventoryItem = (index: number, field: keyof InventoryItem, value: any) => {
    setInventoryItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
    
    // Limpiar errores del campo
    const errorKey = `${field}-${index}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const getTotalQuantity = () => {
    return inventoryItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getAveragePrice = () => {
    const validItems = inventoryItems.filter(item => item.quantity > 0);
    if (validItems.length === 0) return 0;
    
    const totalValue = validItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalQuantity = validItems.reduce((total, item) => total + item.quantity, 0);
    
    return totalQuantity > 0 ? totalValue / totalQuantity : 0;
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return 'out-of-stock';
    if (item.quantity <= item.minStock) return 'low-stock';
    if (item.quantity >= item.maxStock) return 'overstock';
    return 'normal';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'out-of-stock':
        return <Badge className="bg-red-100 text-red-800">Sin Stock</Badge>;
      case 'low-stock':
        return <Badge className="bg-yellow-100 text-yellow-800">Stock Bajo</Badge>;
      case 'overstock':
        return <Badge className="bg-blue-100 text-blue-800">Sobre Stock</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">Normal</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary-900">
              Gestionar Inventario
            </h1>
            <p className="text-primary-500">
              {product.name} - SKU: {product.sku}
            </p>
          </div>
        </div>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Package className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-primary-600">Total en Stock</p>
                <p className="text-xl font-bold text-primary-900">{getTotalQuantity()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-primary-600">Precio Promedio</p>
                <p className="text-xl font-bold text-primary-900">${getAveragePrice().toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <WarehouseIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-primary-600">Almacenes</p>
                <p className="text-xl font-bold text-primary-900">
                  {inventoryItems.filter(item => item.quantity > 0).length} / {warehouses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-primary-600">Alertas</p>
                <p className="text-xl font-bold text-primary-900">
                  {inventoryItems.filter(item => 
                    getStockStatus(item) === 'low-stock' || getStockStatus(item) === 'out-of-stock'
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulario de inventario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventario por Almacén
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryItems.map((item, index) => (
                <div key={item.warehouseId} className="border border-primary-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <WarehouseIcon className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary-900">{item.warehouseName}</h3>
                        <p className="text-sm text-primary-500">ID: {item.warehouseId}</p>
                      </div>
                    </div>
                    {getStatusBadge(getStockStatus(item))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor={`quantity-${index}`}>Cantidad</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => updateInventoryItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className={errors[`quantity-${index}`] ? 'border-red-500' : ''}
                      />
                      {errors[`quantity-${index}`] && (
                        <p className="text-sm text-red-500 mt-1">{errors[`quantity-${index}`]}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`location-${index}`}>Ubicación</Label>
                      <Input
                        id={`location-${index}`}
                        value={item.location}
                        onChange={(e) => updateInventoryItem(index, 'location', e.target.value)}
                        placeholder="Ej: Estante A-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`price-${index}`}>Precio</Label>
                      <Input
                        id={`price-${index}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.price}
                        onChange={(e) => updateInventoryItem(index, 'price', parseFloat(e.target.value) || 0)}
                        className={errors[`price-${index}`] ? 'border-red-500' : ''}
                      />
                      {errors[`price-${index}`] && (
                        <p className="text-sm text-red-500 mt-1">{errors[`price-${index}`]}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`minStock-${index}`}>Stock Mín.</Label>
                      <Input
                        id={`minStock-${index}`}
                        type="number"
                        min="0"
                        value={item.minStock}
                        onChange={(e) => updateInventoryItem(index, 'minStock', parseInt(e.target.value) || 0)}
                        className={errors[`minStock-${index}`] ? 'border-red-500' : ''}
                      />
                      {errors[`minStock-${index}`] && (
                        <p className="text-sm text-red-500 mt-1">{errors[`minStock-${index}`]}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`maxStock-${index}`}>Stock Máx.</Label>
                      <Input
                        id={`maxStock-${index}`}
                        type="number"
                        min="1"
                        value={item.maxStock}
                        onChange={(e) => updateInventoryItem(index, 'maxStock', parseInt(e.target.value) || 1)}
                        className={errors[`maxStock-${index}`] ? 'border-red-500' : ''}
                      />
                      {errors[`maxStock-${index}`] && (
                        <p className="text-sm text-red-500 mt-1">{errors[`maxStock-${index}`]}</p>
                      )}
                    </div>
                  </div>

                  {/* Indicador de nivel de stock */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-primary-600 mb-1">
                      <span>Nivel de stock</span>
                      <span>{item.quantity} / {item.maxStock}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          getStockStatus(item) === 'out-of-stock' ? 'bg-red-500' :
                          getStockStatus(item) === 'low-stock' ? 'bg-yellow-500' :
                          getStockStatus(item) === 'overstock' ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min((item.quantity / item.maxStock) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Inventario
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductInventoryView;
