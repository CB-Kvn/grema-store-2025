import { RootState } from '@/interfaces';
import { Product } from '@/interfaces/products';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
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
        addToCartShop: (state, action: PayloadAction<{ product: Product}>) => {
            const existingItem = state.items.find(item => item.id === action.payload.product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload.product, quantity: 1 });
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
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCartShop, removeFromCartShop, updateQuantityShop, clearCart } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartItemsCount = (state: RootState) => state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;