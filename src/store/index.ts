import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '@/store/slices/productsSlice';
import cartReducer from '@/store/slices/cartSlice';
import favoritesReducer from '@/store/slices/favoriteslice';
import purchasesReducer from '@/store/slices/purchaseOrdersSlice';
import warehousesReducer from '@/store/slices/warehousesSlice';
import expensesReducer  from '@/store/slices/expensesSlice';
import loaderReducer from './slices/loaderSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    expenses: expensesReducer,
    purchases: purchasesReducer,  
    warehouses: warehousesReducer,
    loader: loaderReducer, // Agregar el loaderReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;