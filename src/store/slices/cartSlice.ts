import { Discount, RootState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    details?: {
      color?: { hex: string; name: string }[];
    };
    WarehouseItem?: {
      price: number;
      discount?: number | null;
    }[];
  };
  quantity: number;
  isGift: boolean;
  giftMessage?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartShop: (
      state,
      action: PayloadAction<{
        product: CartItem['product'];
        quantity?: number;
        isGift?: boolean;
        giftMessage?: string;
      }>
    ) => {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.product.id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
        if (action.payload.isGift !== undefined) {
          existingItem.isGift = action.payload.isGift;
          existingItem.giftMessage = action.payload.giftMessage;
        }
      } else {
        state.items.push({
          product: action.payload.product,
          quantity: action.payload.quantity || 1,
          isGift: action.payload.isGift || false,
          giftMessage: action.payload.giftMessage,
        });
      }
    },
    removeFromCartShop: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
    },
    updateQuantityShop: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((item) => item.product.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
    },
    updateGiftStatusShop: (
      state,
      action: PayloadAction<{
        id: number;
        isGift: boolean;
        giftMessage?: string;
      }>
    ) => {
      const item = state.items.find((item) => item.product.id === action.payload.id);
      if (item) {
        item.isGift = action.payload.isGift;
        item.giftMessage = action.payload.giftMessage;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCartShop,
  removeFromCartShop,
  updateQuantityShop,
  updateGiftStatusShop,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => {
    const warehouseItem = item.product.WarehouseItem?.[0];
    if (!warehouseItem) return total; // Si no hay WarehouseItem, ignorar este producto

    const price = warehouseItem.price;
    const discount = warehouseItem.discount || 0;
    const discountedPrice = price * (1 - discount / 100);

    return total + discountedPrice * item.quantity;
  }, 0);

export const selectCartItemsCount = (state: RootState) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export const selectCartSavings = (state: RootState) =>
  state.cart.items.reduce((savings, item) => {
    const warehouseItem = item.product.WarehouseItem?.[0];
    if (!warehouseItem || !warehouseItem.discount) return savings;

    const price = warehouseItem.price;
    const discount = warehouseItem.discount || 0;
    const savingsPerItem = price * (discount / 100);

    return savings + savingsPerItem * item.quantity;
  }, 0);

export default cartSlice.reducer;