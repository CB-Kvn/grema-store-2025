/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product, RootState } from '@/types';

interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  itemInventory: any | Product ;
  loading: boolean;
  error: string | null;
}

export const initialProducts: Product[] = []

const initialState: ProductsState = {
  items: initialProducts,
  selectedProduct: null,
  itemInventory: {
    id: null,
    name: '',
    price: 0,
    description: '',
    category: '',
    sku: '',
    images: [],
    isBestSeller: false,
    isNew: true,
    details: {
      material: '',
      peso: '',
      color: [],
      garantia: '',
      cierre: {
        tipo: '',
        colores: [],
      },
      largo: '',
      pureza: '',
      certificado: '',
    },
  },
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    selectProductBySku(state, action: PayloadAction<string>) {
      const sku = action.payload;
      const product = state.items.find((item) => item.sku === sku);
      state.selectedProduct = product || null; // Si no se encuentra, establece null
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null; // Limpia el producto seleccionado
    },
    setProductInventory(state, action: PayloadAction<Product>) {
      state.itemInventory = action.payload;
    },
    updateProductInventory(state, action: PayloadAction<Partial<Product>>) {
      state.itemInventory = { ...state.itemInventory, ...action.payload! };
    },
    resetProductInventory(state) {
      state.itemInventory = null;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(product => product.id !== action.payload);
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
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
  addProduct,
  updateProduct,
  deleteProduct,
  setProducts,
  setLoading,
  setError,
  setProductInventory,
  updateProductInventory,
  resetProductInventory
} = productsSlice.actions;

export const selectAllProducts = (state: RootState) => state.products.items;
export const selectProductById = (state: RootState, productId: number) =>
  state.products.items.find(product => product.id === productId);
export const selectBestSellers = (state: RootState) =>
  state.products.items.filter(product => product.isBestSeller);
export const selectNewArrivals = (state: RootState) =>
  state.products.items.filter(product => product.isNew);
export const selectProductsByCategory = (state: RootState, category: string) =>
  category === 'all' ? state.products.items : state.products.items.filter(product => product.category === category);
export const selectLoading = (state: RootState) => state.products.loading;
export const selectError = (state: RootState) => state.products.error;

export default productsSlice.reducer;