import { useMemo } from 'react';
import { format } from 'date-fns';
import type { Warehouse } from '@/types';

export function useWarehouseDetailsModal(warehouse: Warehouse) {
  const statusColors = useMemo(() => ({
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
  }), []);

  const itemStatusColors = useMemo(() => ({
    in_stock: 'bg-green-100 text-green-800',
    low_stock: 'bg-yellow-100 text-yellow-800',
    out_of_stock: 'bg-red-100 text-red-800',
  }), []);

  const occupancyPercent = useMemo(
    () => warehouse.capacity > 0
      ? ((warehouse.currentOccupancy / warehouse.capacity) * 100).toFixed(1)
      : '0',
    [warehouse.currentOccupancy, warehouse.capacity]
  );

  const availableSpace = useMemo(
    () => warehouse.capacity - warehouse.currentOccupancy,
    [warehouse.capacity, warehouse.currentOccupancy]
  );

  const formattedLastInventoryDate = useMemo(
    () =>
      warehouse.lastInventoryDate
        ? format(new Date(warehouse.lastInventoryDate), 'dd/MM/yyyy')
        : 'No disponible',
    [warehouse.lastInventoryDate]
  );

  return {
    statusColors,
    itemStatusColors,
    occupancyPercent,
    availableSpace,
    formattedLastInventoryDate,
  };
}