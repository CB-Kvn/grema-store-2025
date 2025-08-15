import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { discountService } from '@/services/discountService';
import type { RootState } from '../index';

// Async thunk para obtener descuentos globales
export const fetchGlobalDiscounts = createAsyncThunk(
  'globalDiscounts/fetchGlobalDiscounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await discountService.getGlobalDiscounts();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener descuentos globales');
    }
  }
);

interface GlobalDiscountsState {
  data: any | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: GlobalDiscountsState = {
  data: null,
  loading: false,
  error: null,
  lastFetched: null,
};

const globalDiscountsSlice = createSlice({
  name: 'globalDiscounts',
  initialState,
  reducers: {
    clearGlobalDiscounts: (state) => {
      state.data = null;
      state.error = null;
      state.lastFetched = null;
    },
    setGlobalDiscounts: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
      state.lastFetched = Date.now();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalDiscounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGlobalDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchGlobalDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearGlobalDiscounts,
  setGlobalDiscounts,
  clearError,
} = globalDiscountsSlice.actions;

// Selectores
export const selectGlobalDiscounts = (state: RootState) => state.globalDiscounts.data;
export const selectGlobalDiscountsLoading = (state: RootState) => state.globalDiscounts.loading;
export const selectGlobalDiscountsError = (state: RootState) => state.globalDiscounts.error;
export const selectGlobalDiscountsLastFetched = (state: RootState) => state.globalDiscounts.lastFetched;

export default globalDiscountsSlice.reducer;