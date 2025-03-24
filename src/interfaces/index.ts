import { CartItem } from "./cart";
import { Product } from "./products";

export type Category = 'all' | 'rings' | 'necklaces' | 'earrings' | 'bracelets';

export interface RootState {
  products: {
    items: Product[];
  };
  cart: {
    items: CartItem[];
  };
  favorites: {
    items: number[];
  };
}

export interface HomePageProps {
  addToCart: (product:Product) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  cartItems: CartItem[];
}