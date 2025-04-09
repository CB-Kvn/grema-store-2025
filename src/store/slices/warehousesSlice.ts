import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Warehouse, WarehouseItem } from '@/types/warehouse';
import { RootState } from '@/types';

interface WarehousesState {
  warehouses: Warehouse[];
  loading: boolean;
  error: string | null;
}

const initialWarehouses: Warehouse[] = [];

const initialState: WarehousesState = {
  warehouses: initialWarehouses,
  loading: false,
  error: null,
};

const warehousesSlice = createSlice({
  name: 'warehouses',
  initialState,
  reducers: {
    addWarehouse: (state, action: PayloadAction<Warehouse>) => {
      state.warehouses.push(action.payload);
    },
    updateWarehouse: (state, action: PayloadAction<Warehouse>) => {
      const index = state.warehouses.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.warehouses[index] = action.payload;
      }
    },
    deleteWarehouse: (state, action: PayloadAction<string>) => {
      state.warehouses = state.warehouses.filter(w => w.id !== action.payload);
    },
    addItem: (state, action: PayloadAction<{ warehouseId: string; item: WarehouseItem }>) => {
      const warehouse = state.warehouses.find(w => w.id === action.payload.warehouseId);
      if (warehouse) {
        warehouse.items.push(action.payload.item);
      }
    },
    updateItem: (state, action: PayloadAction<{ warehouseId: string; item: WarehouseItem }>) => {
      const warehouse = state.warehouses.find(w => w.id === action.payload.warehouseId);
      if (warehouse) {
        const index = warehouse.items.findIndex(i => i.id === action.payload.item.id);
        if (index !== -1) {
          warehouse.items[index] = action.payload.item;
        }
      }
    },
    deleteItem: (state, action: PayloadAction<{ warehouseId: string; itemId: string }>) => {
      const warehouse = state.warehouses.find(w => w.id === action.payload.warehouseId);
      if (warehouse) {
        warehouse.items = warehouse.items.filter(i => i.id !== action.payload.itemId);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addWarehouse,
  updateWarehouse,
  deleteWarehouse,
  addItem,
  updateItem,
  deleteItem,
  setLoading,
  setError,
} = warehousesSlice.actions;

export const selectAllWarehouses = (state: RootState) => state.warehouses.warehouses;
export const selectWarehouseById = (state: RootState, id: string) =>
  state.warehouses.warehouses.find(w => w.id === id);
export const selectWarehouseItems = (state: RootState, warehouseId: string) =>
  state.warehouses.warehouses.find(w => w.id === warehouseId)?.items || [];
export const selectLoading = (state: RootState) => state.warehouses.loading;
export const selectError = (state: RootState) => state.warehouses.error;

export default warehousesSlice.reducer;