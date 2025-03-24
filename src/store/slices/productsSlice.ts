/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import { products as initialProducts } from '@/pages/initial';
import { Product } from '@/interfaces/products';
import { RootState } from '@/interfaces';


interface ProductsState {
  items: Product[];
}

const initialState: ProductsState = {
  items: initialProducts,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
});

export const selectAllProducts = (state: RootState) => state.products.items;
export const selectProductById = (state: RootState, productId: number) => state.products.items.find(product => product.id === productId);
export const selectBestSellers = (state: RootState) => state.products.items.filter(product => product.isBestSeller);
export const selectNewArrivals = (state: RootState) => state.products.items.filter(product => product.isNew);
export const selectProductsByCategory = (state: RootState, category: string) => category === 'all' ? state.products.items : state.products.items.filter(product => product.category === category);

export default productsSlice.reducer;