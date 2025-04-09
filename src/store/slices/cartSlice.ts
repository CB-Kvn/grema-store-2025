import { Discount, RootState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  isGift: boolean;
  giftMessage?: string;
  discount?: Discount;
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
    addToCartShop: (state, action: PayloadAction<{
      id: number;
      name: string;
      price: number;
      image: string;
      isGift?: boolean;
      giftMessage?: string;
      discount?: Discount;
    }>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
        if (action.payload.isGift !== undefined) {
          existingItem.isGift = action.payload.isGift;
          existingItem.giftMessage = action.payload.giftMessage;
        }
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
          isGift: action.payload.isGift || false,
        });
      }
    },
    removeFromCartShop: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantityShop: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
    },
    updateGiftStatusShop: (state, action: PayloadAction<{
      id: number;
      isGift: boolean;
      giftMessage?: string;
    }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
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
    let itemPrice = item.price;
    
    // Apply discount if available
    if (item.discount) {
      switch (item.discount.type) {
        case 'PERCENTAGE':
          itemPrice = itemPrice * (1 - item.discount.value / 100);
          break;
        case 'FIXED_AMOUNT':
          itemPrice = Math.max(0, itemPrice - item.discount.value);
          break;
        case 'BUY_X_GET_Y':
          // Example: Buy 2 get 1 free (value would be 1)
          const freeItems = Math.floor(item.quantity / (item.discount.value + 1));
          return (item.quantity - freeItems) * itemPrice;
      }
    }
    
    return total + (itemPrice * item.quantity);
  }, 0);

export const selectCartItemsCount = (state: RootState) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export const selectCartSavings = (state: RootState) =>
  state.cart.items.reduce((savings, item) => {
    if (!item.discount) return savings;
    
    const originalPrice = item.price * item.quantity;
    const discountedTotal = item.price * item.quantity;
    
    switch (item.discount.type) {
      case 'PERCENTAGE':
        return savings + (originalPrice * (item.discount.value / 100));
      case 'FIXED_AMOUNT':
        return savings + (item.discount.value * item.quantity);
      case 'BUY_X_GET_Y':
        const freeItems = Math.floor(item.quantity / (item.discount.value + 1));
        return savings + (freeItems * item.price);
      default:
        return savings;
    }
  }, 0);

export default cartSlice.reducer;