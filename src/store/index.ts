import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import productsReducer from '@/store/slices/productsSlice';
import cartReducer from '@/store/slices/cartSlice';
import favoritesReducer from '@/store/slices/favoriteslice';
import purchasesReducer from '@/store/slices/purchaseOrdersSlice';
import warehousesReducer from '@/store/slices/warehousesSlice';
import expensesReducer  from '@/store/slices/expensesSlice';
import loaderReducer from './slices/loaderSlice';
import userReducer from './slices/userSlice';

// Configuración de persistencia solo para el usuario
const userPersistConfig = {
  key: 'user',
  storage,
};

// Crear reducer combinado
const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  favorites: favoritesReducer,
  expenses: expensesReducer,
  purchases: purchasesReducer,  
  warehouses: warehousesReducer,
  loader: loaderReducer,
  user: persistReducer(userPersistConfig, userReducer), // Solo persistir user
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;