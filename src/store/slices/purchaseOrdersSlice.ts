/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { PurchaseOrder } from '@/types/purchaseOrder';
import { purchaseOrderService, CreateOrderData, UpdateOrderData } from '@/services/purchaseOrderService';

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

// Acciones asíncronas
export const fetchOrders = createAsyncThunk(
  'purchaseOrders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await purchaseOrderService.getAll();
      return orders;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener las órdenes');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'purchaseOrders/fetchOrderById',
  async (id: string, { rejectWithValue }) => {
    try {
      const order = await purchaseOrderService.getById(id);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener la orden');
    }
  }
);

export const createOrder = createAsyncThunk(
  'purchaseOrders/createOrder',
  async (orderData: CreateOrderData, { rejectWithValue }) => {
    try {
      const order = await purchaseOrderService.create(orderData);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al crear la orden');
    }
  }
);

export const updateOrderAsync = createAsyncThunk(
  'purchaseOrders/updateOrder',
  async ({ id, data }: { id: string; data: UpdateOrderData }, { rejectWithValue }) => {
    try {
      const order = await purchaseOrderService.update(id, data);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar la orden');
    }
  }
);

export const deleteOrderAsync = createAsyncThunk(
  'purchaseOrders/deleteOrder',
  async (id: string, { rejectWithValue }) => {
    try {
      await purchaseOrderService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al eliminar la orden');
    }
  }
);

export const uploadReceiptAsync = createAsyncThunk(
  'purchaseOrders/uploadReceipt',
  async ({ orderId, file }: { orderId: string; file: File }, { rejectWithValue }) => {
    try {
      const result = await purchaseOrderService.uploadReceipt(orderId, file);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al subir el comprobante');
    }
  }
);

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
  extraReducers: (builder) => {
    // Fetch orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch order by ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.orders.findIndex(order => order.id === action.payload.id);
        if (existingIndex !== -1) {
          state.orders[existingIndex] = action.payload;
        } else {
          state.orders.push(action.payload);
        }
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update order
    builder
      .addCase(updateOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete order
    builder
      .addCase(deleteOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order.id !== action.payload);
      })
      .addCase(deleteOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Upload receipt
    builder
      .addCase(uploadReceiptAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadReceiptAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadReceiptAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
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