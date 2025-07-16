import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setWarehouseItems, clearItems, updateItemQuantity, transferStock } from "@/store/slices/warehousesSlice";
import { updateProductPriceAndCost } from "@/store/slices/productsSlice";
import { productService } from "@/services/productService";
import { z } from "zod";
import type { WarehouseItem, Warehouse, Product } from "@/types";
import { useAlert } from "@/context/AlertContext";
import { useAppDispatch } from "./useAppDispatch";
import { setProducts, transferProductStock } from "@/store/slices/productsSlice";
import { warehouseService } from "@/services/warehouseService";

/**
 * Esquema para un item de inventario
 */
export const InventoryItemSchema = z.object({
  quantity: z.number().min(0, "La cantidad debe ser mayor o igual a 0").optional(),
  location: z.string().optional(),
  price: z.number().optional(),
  cost: z.number().optional(),
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
  onSave: (data: { inventory: any }) => void;
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

  const [activeTab, setActiveTab] = useState<'inventory' | 'distribution'>('inventory');
  const [inventory, setInventory] = useState<{ quantity: number; location: string; price?: string; productionCost?: string }[]>([]);
  const warehouseItems = useAppSelector((state) => state.warehouses.warehousesItems);
  const { showAlert } = useAlert();
  const [transferStates, setTransferStates] = useState<{ [warehouseId: string]: { target: string; quantity: number } }>({});
  const [addQuantities, setAddQuantities] = useState<{ [index: number]: number }>({});
  
  // Estados para precio y costo
  const [productPrice, setProductPrice] = useState<number>(Number(product.price) || 0);
  const [productCost, setProductCost] = useState<number>(Number(product.cost) || 0);

  // --- Efectos ---
  useEffect(() => {
    const stocks = JSON.parse(JSON.stringify(warehouseItems.stock || []));
    setInventory(stocks);
    
    // Cargar precio y costo del primer stock disponible
    if (stocks.length > 0) {
      const firstStock = stocks[0];
      if (firstStock.price !== undefined) {
        setProductPrice(Number(firstStock.price) || 0);
      }
      if (firstStock.productionCost !== undefined) {
        setProductCost(Number(firstStock.productionCost) || 0);
      }
    }
  }, [warehouseItems]);

  // También cargar precio y costo desde el Redux store si está disponible
  const productInStore = useAppSelector(state => 
    state.products.items.find((p: any) => p.id === product.id)
  );
  
  useEffect(() => {
    if (productInStore?.WarehouseItem && productInStore.WarehouseItem.length > 0) {
      const firstWarehouseItem = productInStore.WarehouseItem[0];
      if (firstWarehouseItem.price !== undefined && firstWarehouseItem.price !== 0) {
        setProductPrice(Number(firstWarehouseItem.price) || 0);
      }
      if (firstWarehouseItem.cost !== undefined && firstWarehouseItem.cost !== null) {
        setProductCost(Number(firstWarehouseItem.cost) || 0);
      }
    }
  }, [productInStore]);

  // Cargar precio y costo del producto
  useEffect(() => {
    if (product.price !== undefined) {
      setProductPrice(Number(product.price) || 0);
    }
    if (product.cost !== undefined) {
      setProductCost(Number(product.cost) || 0);
    }
  }, [product]);

  useEffect(() => {
    return () => {
      dispatch(clearItems());
    };
  }, [dispatch]);

  // --- Handlers de precio y costo ---
  const handleUpdatePriceAndCost = async () => {
    try {
      if (!product.id) {
        showAlert('Error: ID del producto no encontrado.', 'error');
        return;
      }

      // Usar el nuevo endpoint para actualizar precio y costo
      await warehouseService.updatePriceAndCost(product.id, {
        price: productPrice,
        cost: productCost,
      });

      // Actualizar el estado local del reducer
      dispatch(updateProductPriceAndCost({
        productId: product.id,
        price: productPrice,
        cost: productCost
      }));
      
      showAlert('Precio y costo actualizados correctamente.', 'success');
    } catch (error) {
      console.error('Error al actualizar precio y costo:', error);
      showAlert('Error al actualizar precio y costo.', 'error');
    }
  };

  // --- Handlers de inventario ---

  /**
   * Guardar cambios de inventario.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar inventario
    const inventoryResult = InventorySchema.safeParse(inventory);
    if (!inventoryResult.success) {
      showAlert(inventoryResult.error.errors[0].message, "error");
      return;
    }

    dispatch(
      setWarehouseItems({
        stock: inventory as WarehouseItem[],
        discount: {},
      })
    );

    onSave({
      inventory,
    });

    onClose();
  };

  /**
   * Agregar un nuevo stock al inventario.
   */
  const handleAddStock = () => {

    console.log('handleAddStock', { inventory, warehouses });
    if (inventory.length >= warehouses.length) {
      showAlert('No puedes agregar más stocks que bodegas disponibles.', 'error');
      return;
    }
    if (inventory.some((item) => item.location === '')) {
      showAlert('Ya existe un stock sin asignar bodega. Por favor, completa ese registro antes de agregar otro.', 'error');
      return;
    }

    console.log('Adding new stock');
    const newStock = { quantity: 0, location: '', price: productPrice, cost: productCost };
    console.log('New stock before validation:', newStock);
    const result = InventoryItemSchema.safeParse(newStock);

    console.log('Validation result:', result);
    if (!result.success) {
      showAlert(result.error.errors[0].message, 'error');
      return;
    }
    const updatedInventory = [...inventory, newStock];
    setInventory(updatedInventory);
    dispatch(setWarehouseItems({ stock: updatedInventory as any, discount: {} }));
    showAlert('Nuevo stock agregado correctamente.', 'success');
  };

  /**
   * Eliminar un stock del inventario.
   */
  const handleRemoveStock = (index: number) => {
    const newInventory = [...inventory];
    newInventory.splice(index, 1);
    setInventory(newInventory);
    dispatch(setWarehouseItems({ stock: newInventory as WarehouseItem[], discount: {} }));
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
    dispatch(setWarehouseItems({ stock: newInventory as WarehouseItem[], discount: {} }));
  };

  /**
   * Actualizar la cantidad de un producto en una bodega específica.
   */
  const handleUpdateQuantity = async (warehouseId: string, itemId: number, quantity: number, total:number) => {
    debugger
    console.log('handleUpdateQuantity', { warehouseId, itemId, quantity, total });
    if (total < 0) {
      showAlert('Ingresa una cantidad válida.', 'error');
      return;
    }
    const item = inventory.find(inv => inv.location === warehouseId);
    if (!item) {
      showAlert('No se encontró el item de inventario para la bodega seleccionada.', 'error');
      return;
    }

    const updatedItem = { ...item, quantity:total };
    const result = InventoryItemSchema.safeParse(updatedItem);
    if (!result.success) {
      showAlert(result.error.errors[0].message, "error");
      return;
    }
    const newInventory = inventory.map(inv =>
      inv.location === warehouseId ? updatedItem : inv
    );
    setInventory(newInventory);
    
    await warehouseService.addStock(warehouseId, itemId, { 
      quantity, 
      location: warehouseId
    });
    
    dispatch(updateItemQuantity({ warehouseId, itemId: itemId.toString(), quantity:total }));
    dispatch(setWarehouseItems({ stock: newInventory as WarehouseItem[], discount: {} }));
    const response = await productService.getAll() as Product[];
    dispatch(setProducts(response));
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
    dispatch(setWarehouseItems({ stock: newInventory as WarehouseItem[], discount: {} }));
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
    productPrice,
    setProductPrice,
    productCost,
    setProductCost,
    handleUpdatePriceAndCost,
  };
}