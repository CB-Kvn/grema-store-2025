import { Product } from '@/types';
import { CartItem } from '@/utils/discountCalculator';

/**
 * Convierte un producto regular a un CartItem
 * @param product - Producto del sistema
 * @param quantity - Cantidad del producto
 * @returns CartItem compatible con el calculador de descuentos
 */
export const productToCartItem = (product: Product, quantity: number = 1): CartItem => {
  return {
    product,
    quantity
  };
};

/**
 * Convierte un array de productos con cantidades a CartItems
 * @param items - Array de objetos con producto y cantidad
 * @returns Array de CartItems
 */
export const productsToCartItems = (items: Array<{ product: Product; quantity: number }>): CartItem[] => {
  return items.map(item => productToCartItem(item.product, item.quantity));
};

/**
 * Calcula el total de items en el carrito
 * @param cartItems - Items del carrito
 * @returns Número total de items
 */
export const getTotalItems = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Calcula el subtotal sin descuentos
 * @param cartItems - Items del carrito
 * @returns Subtotal sin descuentos
 */
export const getSubtotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0);
};

/**
 * Encuentra el producto más caro en el carrito
 * @param cartItems - Items del carrito
 * @returns Producto más caro
 */
export const getMostExpensiveProduct = (cartItems: CartItem[]): CartItem | null => {
  if (cartItems.length === 0) return null;
  
  return cartItems.reduce((most, current) => 
    (current.product.price || 0) > (most.product.price || 0) ? current : most
  );
};

/**
 * Encuentra el producto más barato en el carrito
 * @param cartItems - Items del carrito
 * @returns Producto más barato
 */
export const getCheapestProduct = (cartItems: CartItem[]): CartItem | null => {
  if (cartItems.length === 0) return null;
  
  return cartItems.reduce((cheapest, current) => 
    (current.product.price || 0) < (cheapest.product.price || 0) ? current : cheapest
  );
};

/**
 * Filtra productos por categoría
 * @param cartItems - Items del carrito
 * @param category - Categoría a filtrar
 * @returns Items de la categoría especificada
 */
export const getItemsByCategory = (cartItems: CartItem[], category: string): CartItem[] => {
  return cartItems.filter(item => item.product.category === category);
};

/**
 * Agrupa productos por categoría
 * @param cartItems - Items del carrito
 * @returns Objeto con productos agrupados por categoría
 */
export const groupByCategory = (cartItems: CartItem[]): Record<string, CartItem[]> => {
  return cartItems.reduce((groups, item) => {
    const category = item.product.category || 'Sin categoría';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, CartItem[]>);
};
