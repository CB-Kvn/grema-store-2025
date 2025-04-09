export interface Warehouse {
  id: string;
  name: string;
  location: string;
  address: string;
  manager: string;
  phone: string;
  email: string;
  capacity: number;
  currentOccupancy: number;
  status: 'active' | 'inactive' | 'maintenance';
  items: WarehouseItem[];
  lastInventoryDate?: string;
  notes?: string;
}

export interface WarehouseItem {
  id: string;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  minimumStock: number;
  location: string;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface StockMovement {
  id: string;
  warehouseId: string;
  itemId: string;
  type: 'in' | 'out' | 'transfer';
  quantity: number;
  date: string;
  reference?: string;
  notes?: string;
  userId: string;
}