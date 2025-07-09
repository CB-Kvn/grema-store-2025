/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/types';

// Interfaces
export interface ProductColor {
  hex: string;
  name: string;
}

export interface ProductCierre {
  tipo: string;
  colores: ProductColor[];
}

export interface ProductDetails {
  peso: string;
  color: ProductColor[];
  largo: string;
  cierre: ProductCierre;
  piedra: string[];
  pureza: string;
  garantia: string;
  material: string[];
  certificado: string;
}

export interface WarehouseItem {
  id: string;
  productId: number;
  warehouseId: string;
  quantity: number;
  minimumStock: number;
  location: string;
  price: number;
  status: string;
  lastUpdated: string;
  discount: any;
}

export interface ProductImage {
  id: number;
  url: string[];
  state: boolean;
  productId: number;
}

export interface ProductFilepath {
  id: number;
  url: string;
  state: boolean;
  productId: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  sku: string;
  details: ProductDetails;
  createdAt: string;
  updatedAt: string;
  available: boolean;
  WarehouseItem: WarehouseItem[];
  Images: ProductImage[];
  filepaths: ProductFilepath[];
  isBestSeller?: boolean;
  isNew?: boolean;
  price?: number;
  images?: string[];
}

// Estado del slice
export interface ProductsState {
  items: Product[];
  isBestSeller?: Product[];
  isNew?: Product[];
  selectedProduct: Product | null;
  itemInventory: Product | null;
  loading: boolean;
  error: string | null;
}

export const initialProducts: Product[] = [];

const initialState: ProductsState = {
  items: initialProducts,
  selectedProduct: null,
  itemInventory: null,
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
      state.selectedProduct = product || null;
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
    setProductInventory(state, action: PayloadAction<Product>) {
      state.itemInventory = action.payload;
    },
    updateProductInventory(state, action: PayloadAction<Partial<Product>>) {
      if (state.itemInventory) {
        state.itemInventory = { ...state.itemInventory, ...action.payload };
      }
    },
    resetProductInventory(state) {
      state.itemInventory = null;
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.items.push(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.items.findIndex((product) => product.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteProduct(state, action: PayloadAction<number>) {
      state.items = state.items.filter((product) => product.id !== action.payload);
    },
    setProducts(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
    },
    setLatestProducts(state, action: PayloadAction<Product[]>) {
      state.isNew = action.payload;
    },
    setBestSellingProducts(state, action: PayloadAction<Product[]>) {
      state.isBestSeller = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    updateImagesToProduct(state, action: PayloadAction<{ productId: number; images: string[]; id?: number }>) {
      const { productId, images, id } = action.payload;
      const product = state.items.find((item) => item.id === productId);
      if (product) {
        if (!product.Images) product.Images = [];
        if (!product.Images[0]) {
          product.Images[0] = {
            id: images.id ?? productId, // Usa el id recibido o el productId como fallback
            url: images.urls,
            state: true,
            productId: productId,
          };
        } else {
          product.Images[0].url = images;
        }
      }
    },
    updateImagesToItemInventory(state, action: PayloadAction<string[] & { id?: number}>) {
      const id = (action.payload as any).id;
      if (state.itemInventory) {
        if (!state.itemInventory.Images) state.itemInventory.Images = [];
        if (!state.itemInventory.Images[0]) {
          state.itemInventory.Images[0] = {
            id: id ?? state.itemInventory.id,
            url: action.payload.urls,
            state: true,
            productId: state.itemInventory.id,
          };
        } else {
          state.itemInventory.Images[0].url = action.payload.images;
        }
      }
    },
    updateImagesToProductFilePath(state, action: PayloadAction<{ productId: number; filepaths: string[]; id?: number }>) {
      const { productId, filepaths, id } = action.payload;
      const product = state.items.find((item) => item.id === productId);
      if (product) {
        if (!product.filepaths) product.filepaths = [];
        if (!product.filepaths[0]) {
          product.filepaths[0] = {
            id: id ?? productId,
            url: JSON.stringify(filepaths),
            state: true,
            productId: productId,
          };
        } else {
          product.filepaths[0].url = JSON.stringify(filepaths);
        }
      }
    },
    updateImagesToItemInventoryFilePath(state, action: PayloadAction<string[] & { id?: number }>) {
      const id = (action.payload as any).id;
      if (state.itemInventory) {
        if (!state.itemInventory.filepaths) state.itemInventory.filepaths = [];
        if (!state.itemInventory.filepaths[0]) {
          state.itemInventory.filepaths[0] = {
            id: id ?? state.itemInventory.id,
            url: JSON.stringify(action.payload),
            state: true,
            productId: state.itemInventory.id,
          };
        } else {
          state.itemInventory.filepaths[0].url = JSON.stringify(action.payload);
        }
      }
    },
    clearItemInventory(state) {
      state.itemInventory = null;
    },
    transferProductStock(
      state,
      action: PayloadAction<{
        productId: number;
        sourceWarehouseId: string;
        targetWarehouseId: string;
        quantity: number;
      }>
    ) {
      const { productId, sourceWarehouseId, targetWarehouseId, quantity } = action.payload;

      // Buscar el producto en el inventario
      const product = state.items.find((p) => p.id === productId);
      if (!product) return;

      // Buscar el item de bodega origen y destino
      const sourceItem = product.WarehouseItem.find(
        (item) => item.warehouseId === sourceWarehouseId
      );
      const targetItem = product.WarehouseItem.find(
        (item) => item.warehouseId === targetWarehouseId
      );
      debugger

      // Restar del origen
      if (sourceItem && sourceItem.quantity >= quantity) {
        sourceItem.quantity -= quantity;
      }

      // Sumar al destino
      if (targetItem) {
        targetItem.quantity += quantity;
      } else {
        // Si no existe en el destino, crear el registro
        product.WarehouseItem.push({
          id: `${productId}-${targetWarehouseId}`,
          productId,
          warehouseId: targetWarehouseId,
          quantity: quantity,
          minimumStock: 0,
          location: '', // Puedes ajustar según tu modelo
          price: 0,
          status: 'active',
          lastUpdated: new Date().toISOString(),
          discount: null,
        });
      }
    }
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
  resetProductInventory,
  updateImagesToProduct,
  updateImagesToItemInventory,
  updateImagesToProductFilePath,
  updateImagesToItemInventoryFilePath,
  clearItemInventory,
  selectProductBySku,
  clearSelectedProduct,
  transferProductStock,
  setLatestProducts,
  setBestSellingProducts,
} = productsSlice.actions;

// Selectors
export const selectAllProducts = (state: RootState) => state.products.items;
export const selectProductById = (state: RootState, productId: number) =>
  state.products.items.find((product) => product.id === productId);
export const selectBestSellers = (state: RootState) =>
  state.products.items.filter((product) => product.isBestSeller);
export const selectNewArrivals = (state: RootState) =>
  state.products.items.filter((product) => product.isNew);
export const selectProductsByCategory = (state: RootState, category: string) =>
  category === 'all' ? state.products.items : state.products.items.filter((product) => product.category === category);
export const selectLoading = (state: RootState) => state.products.loading;
export const selectError = (state: RootState) => state.products.error;

export default productsSlice.reducer;