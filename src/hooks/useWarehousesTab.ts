import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAllWarehouses } from "@/store/slices/warehousesSlice";
import type { Warehouse } from "@/types";

export function useWarehousesTab() {
  const warehouses = useSelector(selectAllWarehouses);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsEditModalOpen(true);
  };

  return {
    warehouses,
    searchQuery,
    setSearchQuery,
    selectedWarehouse,
    setSelectedWarehouse,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,
    filteredWarehouses,
    totalCapacity,
    totalOccupancy,
    averageOccupancy,
    lowStockItems,
    handleViewDetails,
    handleEdit,
  };
}