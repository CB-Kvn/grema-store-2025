import type { PurchaseOrder, PurchaseOrderItem } from './purchaseOrder';
import type { Supplier } from './supplier';
import type { Warehouse, WarehouseItem, StockMovement } from './warehouse';
import type { Expense } from './expense';

export interface Discount {
  id: number;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y';
  value: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface Product {
  id?: number;
  name?: string;
  price?: number;
  Images?: string;
  description?: string;
  category?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  isGift?: boolean;
  discount?: Discount;
  sku?: string;
  details?: {
    material?: string;
    piedra?: string;
    peso?: string;
    pureza?: string;
    color?: {
      hex?: string;
      name?: string;
    }[];
    certificado?: string;
    garantia?: string;
    diámetro?: string;
    largo?: string;
    broche?: string;
    cierre?: {
      tipo?: string;
      colores?: {
        hex?: string;
        name?: string;
      }[];
    };
  };

}

export interface CartItem extends Pick<Product, 'id' | 'name' | 'price' | 'image'> {
  quantity: number;
  isGift: boolean;
  giftMessage?: string;
  discount?: Discount;
}

export type Category = 'all' | 'rings' | 'necklaces' | 'earrings' | 'bracelets';

export interface RootState {
  products: {
    items: Product[];
    loading: boolean;
    error: string | null;
  };
  cart: {
    items: CartItem[];
  };
  favorites: {
    items: number[];
  };
  purchaseOrders: {
    orders: PurchaseOrder[];
    loading: boolean;
    error: string | null;
  };
  warehouses: {
    warehouses: Warehouse[];
    loading: boolean;
    error: string | null;
  };
  expenses: {
    items: Expense[];
    loading: boolean;
    error: string | null;
  };
}

export interface AddressInfo {
  buyerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  provincia: string;
  canton: string;
}

export type { PurchaseOrder, PurchaseOrderItem, Supplier, Warehouse, WarehouseItem, StockMovement, Expense };

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
}
