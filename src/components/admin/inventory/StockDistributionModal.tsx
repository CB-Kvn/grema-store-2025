import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { X, AlertTriangle } from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { selectAllWarehouses } from '@/store/slices/warehousesSlice';
import { useStockDistributionModal } from '@/hooks/useStockDistributionModal';



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

  const {
    transferStates,
    setTransferStates,
    handleTransfer,
    distribution, 
    setDistribution
  } = useStockDistributionModal({ productId, warehouses, onClose, onSave });

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

        <div className="p-6 space-y-6">
          {warehouses.map(warehouse => {
            const warehouseStock = warehouse.items.find(item => item.productId === productId);
            const transferState = transferStates[warehouse.id] || { target: '', quantity: 0 };

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
                      value={transferState.target}
                      onChange={e => {
                        setTransferStates(prev => ({
                          ...prev,
                          [warehouse.id]: { ...transferState, target: e.target.value }
                        }));
                      }}
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
                      value={transferState.quantity}
                      onChange={e => {
                        setTransferStates(prev => ({
                          ...prev,
                          [warehouse.id]: { ...transferState, quantity: parseInt(e.target.value) || 0 }
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm"
                    disabled={
                      !transferState.target ||
                      !transferState.quantity ||
                      transferState.quantity > (warehouseStock?.quantity || 0)
                    }
                    onClick={async (e) => {
                      e.preventDefault();
                      await handleTransfer(warehouse, transferState);
                    }}
                  >
                    Transferir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default StockDistributionModal;