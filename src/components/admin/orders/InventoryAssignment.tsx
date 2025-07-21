import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangle,
  Package,
  Warehouse,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import type { Item } from '@/types/purchaseOrder';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useProductService } from '@/hooks/useProductService';

interface WarehouseStock {
  id: string;
  name: string;
  location: string;
  availableStock: number;
  assignedQuantity: number;
  maxAssignable: number;
}

interface InventoryAssignmentProps {
  item: Item;
  onAssignmentChange: (itemId: string, assignments: { warehouseId: string; quantity: number }[]) => void;
  onClose: () => void;
}

const InventoryAssignment: React.FC<InventoryAssignmentProps> = ({
  item,
  onAssignmentChange,
  onClose
}) => {
  const [warehouseStocks, setWarehouseStocks] = useState<WarehouseStock[]>([]);
  const [assignments, setAssignments] = useState<{ [warehouseId: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener productos del estado global para información de inventario
  const products = useAppSelector(state => state.products.items);
  const warehouses = useAppSelector(state => state.warehouses.warehouses);
  const { getProductById } = useProductService();

  // Encontrar el producto actual
  const product = products.find((p: any) => p.id === item.productId);

  useEffect(() => {
    loadWarehouseStock();
  }, [item.productId]);

  const loadWarehouseStock = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!product) {
        setError('Producto no encontrado');
        return;
      }

      // Obtener información actualizada del producto
      const productData = await getProductById(item.productId);
      
      // Crear array de stocks disponibles por bodega
      const stocks: WarehouseStock[] = [];

      if (productData?.WarehouseItem) {
        productData.WarehouseItem.forEach((warehouseItem: any) => {
          const warehouse = warehouses.find((w: any) => w.id === warehouseItem.warehouseId);
          if (warehouse && warehouseItem.quantity > 0) {
            stocks.push({
              id: warehouse.id,
              name: warehouse.name,
              location: warehouse.location,
              availableStock: warehouseItem.quantity,
              assignedQuantity: 0,
              maxAssignable: Math.min(warehouseItem.quantity, item.quantity)
            });
          }
        });
      }

      // Si no hay stock disponible, mostrar todas las bodegas pero con stock 0
      if (stocks.length === 0) {
        warehouses.forEach((warehouse: any) => {
          stocks.push({
            id: warehouse.id,
            name: warehouse.name,
            location: warehouse.location,
            availableStock: 0,
            assignedQuantity: 0,
            maxAssignable: 0
          });
        });
      }

      setWarehouseStocks(stocks);
    } catch (err) {
      console.error('Error loading warehouse stock:', err);
      setError('Error al cargar el inventario de bodegas');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentChange = (warehouseId: string, quantity: number) => {
    const warehouse = warehouseStocks.find(w => w.id === warehouseId);
    if (!warehouse) return;

    // Validar que no exceda el stock disponible
    const maxAllowed = Math.min(warehouse.availableStock, item.quantity - getTotalAssigned() + (assignments[warehouseId] || 0));
    const validQuantity = Math.max(0, Math.min(quantity, maxAllowed));

    setAssignments(prev => ({
      ...prev,
      [warehouseId]: validQuantity
    }));
  };

  const getTotalAssigned = () => {
    return Object.values(assignments).reduce((sum, qty) => sum + qty, 0);
  };

  const getRemainingToAssign = () => {
    return item.quantity - getTotalAssigned();
  };

  const isFullyAssigned = () => {
    return getTotalAssigned() === item.quantity;
  };

  const canAutoAssign = () => {
    const totalAvailableStock = warehouseStocks.reduce((sum, w) => sum + w.availableStock, 0);
    return totalAvailableStock >= item.quantity;
  };

  const handleAutoAssign = () => {
    const newAssignments: { [warehouseId: string]: number } = {};
    let remainingToAssign = item.quantity;

    // Ordenar bodegas por stock disponible (mayor a menor)
    const sortedWarehouses = [...warehouseStocks]
      .filter(w => w.availableStock > 0)
      .sort((a, b) => b.availableStock - a.availableStock);

    for (const warehouse of sortedWarehouses) {
      if (remainingToAssign <= 0) break;

      const toAssign = Math.min(warehouse.availableStock, remainingToAssign);
      newAssignments[warehouse.id] = toAssign;
      remainingToAssign -= toAssign;
    }

    setAssignments(newAssignments);
  };

  const handleSaveAssignments = () => {
    // Convertir assignments a array para el callback
    const assignmentArray = Object.entries(assignments)
      .filter(([_, qty]) => qty > 0)
      .map(([warehouseId, quantity]) => ({ warehouseId, quantity }));

    onAssignmentChange(item.id, assignmentArray);
    onClose();
  };

  const handleClearAssignments = () => {
    setAssignments({});
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Package className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-600" />
            <p>Cargando inventario...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center text-red-600">
            <XCircle className="h-8 w-8 mx-auto mb-4" />
            <p>{error}</p>
            <Button
              variant="outline"
              onClick={loadWarehouseStock}
              className="mt-4"
            >
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Asignación de Inventario
          </div>
          <Badge variant={isFullyAssigned() ? "default" : "secondary"}>
            {getTotalAssigned()} / {item.quantity} asignado
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información del producto */}
        <div className="bg-primary-50 p-4 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-primary-900">
                {item.product?.name || `Producto ID: ${item.productId}`}
              </h4>
              <p className="text-sm text-primary-600">
                SKU: {item.product?.sku || 'N/A'}
              </p>
              <p className="text-sm text-primary-600">
                Cantidad requerida: {item.quantity} unidades
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-600">Stock total disponible</p>
              <p className="text-xl font-bold text-primary-900">
                {warehouseStocks.reduce((sum, w) => sum + w.availableStock, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Resumen de asignación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {getTotalAssigned()}
              </div>
              <p className="text-sm text-gray-600">Asignado</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {getRemainingToAssign()}
              </div>
              <p className="text-sm text-gray-600">Pendiente</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {item.quantity}
              </div>
              <p className="text-sm text-gray-600">Total requerido</p>
            </CardContent>
          </Card>
        </div>

        {/* Botones de acción rápida */}
        <div className="flex gap-2 flex-wrap">
          {canAutoAssign() && (
            <Button
              variant="outline"
              onClick={handleAutoAssign}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Asignación Automática
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleClearAssignments}
            disabled={getTotalAssigned() === 0}
          >
            Limpiar Asignaciones
          </Button>
        </div>

        {/* Lista de bodegas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Warehouse className="h-5 w-5" />
            <h4 className="font-medium">Inventario por Bodega</h4>
          </div>

          {warehouseStocks.map((warehouse) => {
            const assigned = assignments[warehouse.id] || 0;
            const canAssign = warehouse.availableStock > 0;

            return (
              <Card key={warehouse.id} className={`${!canAssign ? 'opacity-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Warehouse className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-medium">{warehouse.name}</h5>
                        <p className="text-sm text-gray-500">{warehouse.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={warehouse.availableStock > 0 ? "default" : "destructive"}>
                        Stock: {warehouse.availableStock}
                      </Badge>
                    </div>
                  </div>

                  {canAssign && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <Label htmlFor={`assignment-${warehouse.id}`}>
                          Cantidad a asignar
                        </Label>
                        <Input
                          id={`assignment-${warehouse.id}`}
                          type="number"
                          min="0"
                          max={Math.min(warehouse.availableStock, item.quantity)}
                          value={assigned}
                          onChange={(e) => handleAssignmentChange(
                            warehouse.id, 
                            parseInt(e.target.value) || 0
                          )}
                          disabled={!canAssign}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Máximo disponible</p>
                        <p className="font-medium">
                          {Math.min(warehouse.availableStock, getRemainingToAssign() + assigned)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssignmentChange(
                            warehouse.id, 
                            Math.min(warehouse.availableStock, getRemainingToAssign() + assigned)
                          )}
                          disabled={!canAssign || assigned === Math.min(warehouse.availableStock, getRemainingToAssign() + assigned)}
                        >
                          Máximo
                        </Button>
                      </div>
                    </div>
                  )}

                  {!canAssign && (
                    <div className="flex items-center gap-2 text-red-600 mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <p className="text-sm">Sin stock disponible en esta bodega</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alertas y validaciones */}
        {!canAutoAssign() && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium">Stock insuficiente</p>
              </div>
              <p className="text-sm text-orange-600 mt-1">
                El stock total disponible ({warehouseStocks.reduce((sum, w) => sum + w.availableStock, 0)} unidades) 
                es menor a la cantidad requerida ({item.quantity} unidades). 
                Solo podrás hacer una asignación parcial.
              </p>
            </CardContent>
          </Card>
        )}

        {getRemainingToAssign() > 0 && getTotalAssigned() > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Info className="h-5 w-5" />
                <p className="font-medium">Asignación parcial</p>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                Faltan {getRemainingToAssign()} unidades por asignar para completar la orden.
              </p>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Botones de acción */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveAssignments}
            disabled={getTotalAssigned() === 0}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Guardar Asignación
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryAssignment;
