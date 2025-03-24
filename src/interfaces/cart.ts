import { Product } from "./products";

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
}

export interface CartItem extends Pick<Product, 'id' | 'name' | 'price' | 'image'> {
  quantity: number;
}
