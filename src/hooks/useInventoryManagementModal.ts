import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setWarehouseItems, clearItems, updateItemQuantity, transferStock } from "@/store/slices/warehousesSlice";
import { productService } from "@/services/productService";
import { z } from "zod";
import type { Discount, WarehouseItem, Warehouse, Product } from "@/types";
import { useAlert } from "@/context/AlertContext";
import { useAppDispatch } from "./useAppDispatch";
import { transferProductStock } from "@/store/slices/productsSlice";
import { warehouseService } from "@/services/warehouseService";

/**
 * Esquema para un item de inventario
 */
export const InventoryItemSchema = z.object({
  quantity: z.number().min(0, "La cantidad debe ser mayor o igual a 0"),
  location: z.string().min(1, "La bodega es obligatoria"),
  price: z.number().optional(),
  productionCost: z.string().optional(),
});

/**
 * Esquema para el inventario completo
 */
export const InventorySchema = z.array(InventoryItemSchema);

/**
 * Esquema para transferencia
 */
export const TransferSchema = z.object({
  target: z.string().min(1, "Debes seleccionar una bodega destino"),
  quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
});

/**
 * Esquema para descuento (opcional, puedes expandirlo según tus reglas)
 */
export const DiscountSchema = z.object({
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "BUY_X_GET_Y"]),
  value: z.number().min(0, "El valor debe ser mayor o igual a 0"),
  startDate: z.string().min(1, "La fecha de inicio es obligatoria"),
  endDate: z.string().optional(),
  isActive: z.boolean(),
  minQuantity: z.number().optional(),
  maxQuantity: z.number().optional(),
});

/**
 * Hook para gestionar el estado y lógica del modal de gestión de inventario.
 * 
 * @param product Producto actual a gestionar.
 * @param warehouses Lista de bodegas disponibles.
 * @param onClose Función para cerrar el modal.
 * @param onSave Función para guardar los cambios realizados.
 * @returns Estados y handlers para el modal de inventario.
 */
export function useInventoryManagementModal({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (data: { inventory: any; discount: Discount }) => void;
}) {
  const dispatch = useAppDispatch();

  // --- Selectores y estados principales ---
  const warehouses = useAppSelector(state => {
    const productInStore = state.products.items.find(p => p.id === product.id);
    return state.warehouses.warehouses.map(warehouse => ({
      ...warehouse,
      items: productInStore?.WarehouseItem
        ? productInStore.WarehouseItem.filter(item => item.warehouseId === warehouse.id)
        : [],
    }));
  });

  const [activeTab, setActiveTab] = useState<'inventory' | 'discount' | 'distribution'>('inventory');
  const [inventory, setInventory] = useState<{ quantity: number; location: string; price?: string; productionCost?: string }[]>([]);
  const warehouseItems = useAppSelector((state) => state.warehouses.warehousesItems);
  const [discount, setDiscount] = useState<Partial<Discount>>({
    type: 'PERCENTAGE',
    value: 0,
    startDate: new Date().toISOString().split('T')[0],
    isActive: true,
  });
  const { showAlert } = useAlert();
  const [transferStates, setTransferStates] = useState<{ [warehouseId: string]: { target: string; quantity: number } }>({});
  const [addQuantities, setAddQuantities] = useState<{ [index: number]: number }>({});

  // --- Efectos ---
  useEffect(() => {
    setInventory(JSON.parse(JSON.stringify(warehouseItems.stock || [])));
    setDiscount(JSON.parse(JSON.stringify(warehouseItems.discount || {})));
  }, [warehouseItems]);

  useEffect(() => {
    return () => {
      dispatch(clearItems());
    };
  }, [dispatch]);

  // --- Handlers de inventario ---

  /**
   * Guardar cambios de inventario y descuento.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar inventario
    const inventoryResult = InventorySchema.safeParse(inventory);
    if (!inventoryResult.success) {
      showAlert(inventoryResult.error.errors[0].message, "error");
      return;
    }

    // Validar descuento
    const discountResult = DiscountSchema.safeParse(discount);
    if (!discountResult.success) {
      showAlert(discountResult.error.errors[0].message, "error");
      return;
    }

    dispatch(
      setWarehouseItems({
        stock: inventory as WarehouseItem[],
        discount: discount as Discount,
      })
    );

    onSave({
      inventory,
      discount: discount as Discount,
    });

    onClose();
  };

  /**
   * Agregar un nuevo stock al inventario.
   */
  const handleAddStock = () => {
    if (inventory.length >= warehouses.length) {
      showAlert('No puedes agregar más stocks que bodegas disponibles.', 'error');
      return;
    }
    if (inventory.some((item) => item.location === '')) {
      showAlert('Ya existe un stock sin asignar bodega. Por favor, completa ese registro antes de agregar otro.', 'error');
      return;
    }
    const newStock = { quantity: 0, location: '', price: '', productionCost: '' };
    const result = InventoryItemSchema.safeParse(newStock);
    if (!result.success) {
      showAlert(result.error.errors[0].message, 'error');
      return;
    }
    const updatedInventory = [...inventory, newStock];
    setInventory(updatedInventory);
    dispatch(setWarehouseItems({ stock: updatedInventory as any, discount: discount as Discount }));
    showAlert('Nuevo stock agregado correctamente.', 'success');
  };

  /**
   * Eliminar un stock del inventario.
   */
  const handleRemoveStock = (index: number) => {
    const newInventory = [...inventory];
    newInventory.splice(index, 1);
    setInventory(newInventory);
    dispatch(setWarehouseItems({ stock: newInventory as WarehouseItem[], discount: discount as Discount }));
  };

  /**
   * Cambiar la bodega de un item de inventario.
   */
  const handleChangeWarehouse = (newWarehouseId: string, index: number) => {
    if (inventory.some((inv, i) => inv.location === newWarehouseId && i !== index)) {
      showAlert('Ya existe un stock asignado a esta bodega. Por favor, selecciona otra.', 'error');
      return;
    }
    const itemToValidate = { ...inventory[index], location: newWarehouseId };
    const result = InventoryItemSchema.safeParse(itemToValidate);
    if (!result.success) {
      showAlert(result.error.errors[0].message, 'error');
      return;
    }
    const newInventory = [...inventory];
    newInventory[index].location = newWarehouseId;
    setInventory(newInventory);
    dispatch(setWarehouseItems({ stock: newInventory as WarehouseItem[], discount: discount as Discount }));
  };

  /**
   * Actualizar la cantidad de un producto en una bodega específica.
   */
  const handleUpdateQuantity = async (warehouseId: string, itemId: string, quantity: number) => {
    debugger
    if (quantity < 0) {
      showAlert('Ingresa una cantidad válida.', 'error');
      return;
    }
    const item = inventory.find(inv => inv.location === warehouseId);
    if (!item) {
      showAlert('No se encontró el item de inventario para la bodega seleccionada.', 'error');
      return;
    }

    const updatedItem = { ...item, quantity };
    const result = InventoryItemSchema.safeParse(updatedItem);
    if (!result.success) {
      showAlert(result.error.errors[0].message, "error");
      return;
    }
    const newInventory = inventory.map(inv =>
      inv.location === warehouseId ? updatedItem : inv
    );
    setInventory(newInventory);
    await warehouseService.addStock(warehouseId, Number(itemId), { quantity, location: warehouseId, price: Number(updatedItem.price) || 0 });
    dispatch(updateItemQuantity({ warehouseId, itemId, quantity }));
    dispatch(setWarehouseItems({ stock: newInventory as WarehouseItem[], discount: discount as Discount }));
    showAlert('Cantidad actualizada correctamente.', 'success');
  };

  // --- Handlers de cantidades (inputs de cantidad a agregar) ---

  /**
   * Cambiar la cantidad a agregar para un item.
   */
  const handleChangeAddQty = (index: number, value: number) => {
    setAddQuantities(prev => ({ ...prev, [index]: value }));
  };

  /**
   * Limpiar la cantidad a agregar después de agregar.
   */
  const clearAddQty = (index: number) => {
    setAddQuantities(prev => ({ ...prev, [index]: 0 }));
  };

  /**
   * Agregar una cantidad a un item de inventario.
   */
  const handleAddQuantity = (index: number, addQty: number) => {
    if (addQty <= 0) {
      showAlert('Ingresa una cantidad válida.', 'error');
      return;
    }
    const item = inventory[index];
    const updatedItem = { ...item, quantity: item.quantity + addQty };
    const result = InventoryItemSchema.safeParse(updatedItem);
    if (!result.success) {
      showAlert(result.error.errors[0].message, 'error');
      return;
    }
    const newInventory = [...inventory];
    newInventory[index] = updatedItem;
    setInventory(newInventory);
    dispatch(setWarehouseItems({ stock: newInventory as WarehouseItem[], discount: discount as Discount }));
    showAlert('Cantidad agregada correctamente.', 'success');
  };

  // --- Handlers de transferencia ---

  /**
   * Transferir stock entre bodegas usando el servicio de productos.
   */
  const handleTransfer = async (warehouse: Warehouse, transferState: { target: string; quantity: number }) => {
    const result = TransferSchema.safeParse(transferState);
    if (!result.success) {
      showAlert(result.error.errors[0].message, "error");
      return;
    }
    try {
      await productService.transferStock(product.id!, {
        sourceWarehouseId: warehouse.id,
        targetWarehouseId: transferState.target,
        quantity: transferState.quantity,
      });
      showAlert('Transferencia realizada correctamente.', 'success');
      dispatch(transferProductStock({
        productId: product.id!,
        sourceWarehouseId: warehouse.id,
        targetWarehouseId: transferState.target,
        quantity: transferState.quantity
      }));
      dispatch(transferStock({
        productId: product.id!,
        sourceWarehouseId: warehouse.id,
        targetWarehouseId: transferState.target,
        quantity: transferState.quantity
      }));
    } catch (err) {
      showAlert('Error al transferir stock.', 'error');
    }
  };

  // --- Exponer estados y handlers al componente ---

  return {
    activeTab,
    setActiveTab,
    inventory,
    setInventory,
    discount,
    setDiscount,
    transferStates,
    setTransferStates,
    handleSubmit,
    handleAddStock,
    handleRemoveStock,
    handleChangeWarehouse,
    handleUpdateQuantity,
    handleChangeAddQty,
    clearAddQty,
    handleAddQuantity,
    handleTransfer,
    warehouseItems,
    showAlert,
    warehouses,
    addQuantities,
  };
}