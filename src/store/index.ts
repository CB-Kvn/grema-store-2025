import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '@/store/slices/productsSlice';
import cartReducer from '@/store/slices/cartSlice';
import favoritesReducer from '@/store/slices/favoriteslice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;