import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { X, AlertTriangle } from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { selectAllWarehouses } from '@/store/slices/warehousesSlice';


interface StockDistributionModalProps {
  productId: number;
  quantity: number;
  onClose: () => void;
  onSave: (distribution: WarehouseDistribution[]) => void;
}

interface WarehouseDistribution {
  warehouseId: string;
  quantity: number;
}

const StockDistributionModal: React.FC<StockDistributionModalProps> = ({
  productId,
  quantity,
  onClose,
  onSave,
}) => {
  const warehouses = useSelector(selectAllWarehouses);
  const [distribution, setDistribution] = useState<WarehouseDistribution[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Initialize distribution with available warehouses
    const initialDistribution = warehouses.map(warehouse => {
      const item = warehouse.items.find(item => item.productId === productId);
      return {
        warehouseId: warehouse.id,
        quantity: 0,
        available: item?.quantity || 0,
      };
    });
    setDistribution(initialDistribution);
  }, [warehouses, productId]);

  const handleQuantityChange = (warehouseId: string, newQuantity: number) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    const item = warehouse?.items.find(item => item.productId === productId);
    const available = item?.quantity || 0;

    if (newQuantity > available) {
      setError(`No hay suficiente stock en ${warehouse?.name}`);
      return;
    }

    setDistribution(prev =>
      prev.map(d =>
        d.warehouseId === warehouseId ? { ...d, quantity: newQuantity } : d
      )
    );
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalDistributed = distribution.reduce((sum, d) => sum + d.quantity, 0);
    if (totalDistributed !== quantity) {
      setError(`La cantidad total debe ser igual a ${quantity}`);
      return;
    }

    onSave(distribution);
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
            Distribución de Stock
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-50 rounded-full"
          >
            <X className="h-5 w-5 text-primary-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-primary-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-primary-900">Cantidad Total Requerida:</span>
              <span className="font-medium text-primary-900">{quantity}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center text-red-700">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {error}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {warehouses.map(warehouse => {
              const item = warehouse.items.find(item => item.productId === productId);
              const available = item?.quantity || 0;
              const dist = distribution.find(d => d.warehouseId === warehouse.id);

              return (
                <div key={warehouse.id} className="bg-white border border-primary-100 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-primary-900">{warehouse.name}</h3>
                      <p className="text-sm text-primary-600">{warehouse.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-primary-600">Stock Disponible</p>
                      <p className="font-medium text-primary-900">{available}</p>
                    </div>
                  </div>

                  <div>
                    <Label>Cantidad a Tomar</Label>
                    <Input
                      type="number"
                      min="0"
                      max={available}
                      value={dist?.quantity || 0}
                      onChange={(e) => handleQuantityChange(warehouse.id, parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                </div>
              );
            })}
          </div>

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
              Guardar Distribución
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default StockDistributionModal;