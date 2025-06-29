/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

import { PurchaseOrder } from '@/types/purchaseOrder';

interface PurchaseOrdersState {
  orders: PurchaseOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: PurchaseOrdersState = {
  orders: [],
  loading: false,
  error: null,
};

const purchaseOrdersSlice = createSlice({
  name: 'purchaseOrders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<PurchaseOrder>) => {
      state.orders.push(action.payload);
    },
    updateOrder: (state, action: PayloadAction<PurchaseOrder>) => {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(order => order.id !== action.payload);
    },
    setOrders: (state, action: PayloadAction<PurchaseOrder[]>) => {
      state.orders = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // NUEVOS REDUCERS
    updateItemQtyDone: (
      state,
      action: PayloadAction<{ orderId: string; itemId: string; qtyDone: number | null }>
    ) => {
      const order = state.orders.find(order => order.id === action.payload.orderId);
      if (order) {
        const item = order.items.find(i => i.id === action.payload.itemId);
        if (item) {
          item.qtyDone = action.payload.qtyDone;
        }
      }
    },
    updateItemStatus: (
      state,
      action: PayloadAction<{ orderId: string; itemId: string; status: string }>
    ) => {
      const order = state.orders.find(order => order.id === action.payload.orderId);
      if (order) {
        const item = order.items.find(i => i.id === action.payload.itemId);
        if (item) {
          item.status = action.payload.status;
        }
      }
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: string }>
    ) => {
      const order = state.orders.find(order => order.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },
});

export const {
  addOrder,
  updateOrder,
  deleteOrder,
  setOrders,
  setLoading,
  setError,
  updateItemQtyDone,
  updateItemStatus,
  updateOrderStatus,
} = purchaseOrdersSlice.actions;

export const selectAllOrders = (state: RootState) => state.purchases.orders;
export const selectOrderById = (state: RootState, orderId: string) => state.purchases.orders.find(order => order.id === orderId);
export const selectOrdersByStatus = (state: RootState, status: PurchaseOrder['status']) => state.purchases.orders.filter(order => order.status === status);
export const selectLoading = (state: RootState) => state.purchases.loading;
export const selectError = (state: RootState) => state.purchases.error;

export default purchaseOrdersSlice.reducer;