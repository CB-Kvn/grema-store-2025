import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { deleteWarehouse, selectAllWarehouses } from "@/store/slices/warehousesSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import type { Warehouse } from "@/types";
import { warehouseService } from "@/services/warehouseService";

export type ViewMode = 'list' | 'details' | 'edit' | 'create';

export function useWarehousesTab() {
  const dispatch = useAppDispatch();
  const warehouses = useSelector(selectAllWarehouses);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredWarehouses = useMemo(() =>
    warehouses.filter(warehouse =>
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.location.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [warehouses, searchQuery]
  );

  const totalCapacity = useMemo(
    () => warehouses.reduce((sum, w) => sum + w.capacity, 0),
    [warehouses]
  );
  const totalOccupancy = useMemo(
    () => warehouses.reduce((sum, w) => sum + w.currentOccupancy, 0),
    [warehouses]
  );
  const averageOccupancy = totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0;
  const lowStockItems = useMemo(
    () => warehouses.reduce((count, w) =>
      count + w.items.filter(i => i.status === 'low_stock').length, 0
    ),
    [warehouses]
  );

  const handleViewDetails = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setViewMode('details');
  };

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setViewMode('edit');
  };

  const handleCreate = () => {
    setSelectedWarehouse(null);
    setViewMode('create');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedWarehouse(null);
  };

  const handleDeleteWarehouse = async (warehouseId: string) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implementar eliminación en el servicio
      console.log('Deleting warehouse:', warehouseId);
      if (selectedWarehouse && selectedWarehouse.id === warehouseId) {
        handleBackToList();
      }
    } catch (err) {
      setError('Error al eliminar la bodega');
      console.error('Error deleting warehouse:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (warehouseData: Partial<Warehouse>) => {
    try {
      setLoading(true);
      setError(null);
      if (viewMode === 'edit' && selectedWarehouse) {
        // TODO: Implementar actualización en el servicio
        console.log('Updating warehouse:', warehouseData);
      } else {
        // TODO: Implementar creación en el servicio
        console.log('Creating warehouse:', warehouseData);
      }
      handleBackToList();
    } catch (err) {
      setError('Error al guardar la bodega');
      console.error('Error saving warehouse:', err);
    } finally {
      setLoading(false);
    }
  };

  

  return {
    warehouses,
    searchQuery,
    setSearchQuery,
    selectedWarehouse,
    viewMode,
    setViewMode,
    filteredWarehouses,
    totalCapacity,
    totalOccupancy,
    averageOccupancy,
    lowStockItems,
    loading,
    error,
    handleViewDetails,
    handleEdit,
    handleCreate,
    handleBackToList,
    handleDeleteWarehouse,
    handleSubmit,
  };
}