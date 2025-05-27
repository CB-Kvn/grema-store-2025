import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { productService } from "@/services/productService";

import type { Warehouse, Product } from "@/types";
import { useAlert } from "@/context/AlertContext";
import { useAppSelector } from "./useAppSelector";
import { selectAllWarehouses } from "@/store/slices/warehousesSlice";

export function useStockDistributionModal({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: () => void;
}) {
  const dispatch = useAppDispatch();
  const { showAlert } = useAlert();
  const warehouses = useAppSelector(selectAllWarehouses);
  const [transferStates, setTransferStates] = useState<{ [warehouseId: string]: { target: string; quantity: number } }>({});
  const [distribution, setDistribution] = useState<{ warehouseId: string; quantity: number; available: number }[]>([]);

  useEffect(() => {
    // Initialize distribution with available warehouses
    const initialDistribution = warehouses.map(warehouse => {
      const item = warehouse.items.find((item: any) => item.productId === product.id);
      return {
        warehouseId: warehouse.id,
        quantity: 0,
        available: item?.quantity || 0,
      };
    });
    setDistribution(initialDistribution);
  }, [warehouses, product.id]);

  const handleTransfer = async (warehouse: Warehouse, transferState: { target: string; quantity: number }) => {
    try {
      await productService.transferStock(product.id, {
        sourceWarehouseId: warehouse.id,
        targetWarehouseId: transferState.target,
        quantity: transferState.quantity,
      });
      showAlert('Transferencia realizada correctamente.', 'success');
      setTransferStates(prev => ({
        ...prev,
        [warehouse.id]: { target: '', quantity: 0 }
      }));
      onSave();
    } catch (err) {
      showAlert('Error al transferir stock.', 'error');
    }
  };

  return {
    transferStates,
    setTransferStates,
    handleTransfer,
    distribution,
    setDistribution,
  };
}