/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Plus, Trash2, Package, BoxIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import type { PurchaseOrder, PurchaseOrderItem } from '@/types';
import { updateOrder, updateItemQtyDone, updateItemStatus, updateOrderStatus } from '@/store/slices/purchaseOrdersSlice';
import StockDistributionModal from '../inventory/StockDistributionModal';
import { warehouseService } from '@/services/warehouseService';
import { purchaseOrderService } from '@/services/purchaseOrderService';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from '../../ui/dialog';
import { useAppSelector } from '@/hooks/useAppSelector';

interface EditOrderModalProps {
  order: PurchaseOrder;
  onClose: () => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, onClose }) => {
  const dispatch = useDispatch();
  // const ordersList = useAppSelector((state: any) => state.purchaseOrders.orders);
  const [formData, setFormData] = useState<PurchaseOrder>(order);
  const [selectedItem, setSelectedItem] = useState<PurchaseOrderItem | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [itemsWarehouse, setItemsWarehouse] = useState<[]>([]);
  const [warehouseQty, setWarehouseQty] = useState<{ [itemId: string]: { [warehouseId: number]: number } }>({});
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateOrder(formData));
    onClose();
  };

  // Nueva función unificada para cambios de item y confirmación de stock
  const handleItemUpdate = async (
    index: number,
    field: keyof PurchaseOrderItem,
    value: any,
    confirmStock?: boolean,
    assignedQty?: number
  ) => {
    let newItems = [...formData.items];

    // Si es confirmación de stock ("Listo")
    if (confirmStock && typeof assignedQty === 'number') {
      const prevItemStatus = newItems[index].status;
      const newItemStatus = assignedQty === newItems[index].quantity ? 'COMPLETED' : 'UNCOMPLETED';

      // Actualiza status y qtyDone del item
      newItems[index] = {
        ...newItems[index],
        status: newItemStatus,
        qtyDone: assignedQty,
      };

      // Redux: solo si cambia
      if (prevItemStatus !== newItemStatus) {
        dispatch(updateItemStatus({
          orderId: formData.id,
          itemId: newItems[index].id,
          status: newItemStatus
        }));
      }
      if (newItems[index].qtyDone !== assignedQty) {
        dispatch(updateItemQtyDone({
          orderId: formData.id,
          itemId: newItems[index].id,
          qtyDone: assignedQty
        }));
      }

      // Verifica si todos los productos están en COMPLETED
      const allCompleted = newItems.every(i => i.status === 'COMPLETED');
      const prevOrderStatus = formData.status;
      let newOrderStatus = prevOrderStatus;
      if (allCompleted && prevOrderStatus !== 'APPROVED') {
        dispatch(updateOrderStatus({ orderId: formData.id, status: 'APPROVED' }));
        newOrderStatus = 'APPROVED';
      }

      // Actualiza local y backend solo si hay cambios
      const itemChanged = prevItemStatus !== newItemStatus || formData.items[index].qtyDone !== assignedQty;
      const orderChanged = prevOrderStatus !== newOrderStatus;
      if (itemChanged || orderChanged) {
        let updatedOrder = { ...formData, items: newItems, status: newOrderStatus };
        if (Array.isArray(updatedOrder.documents) && updatedOrder.documents.length === 0) {
          const { documents, ...rest } = updatedOrder;
          updatedOrder = rest;
        }
        setFormData(updatedOrder);
        await purchaseOrderService.update(formData.id, updatedOrder);
      } else {
        setFormData({ ...formData, items: newItems });
      }
      setExpandedRow(null);
      setConfirmModal(null);
      return;
    }

    // Si es un cambio normal de campo
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? Number(value) : newItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? Number(value) : newItems[index].unitPrice;
      newItems[index] = {
        ...newItems[index],
        [field]: Number(value),
        totalPrice: quantity * unitPrice,
      };
    } else if (field === 'status') {
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };
      dispatch(updateItemStatus({ orderId: formData.id, itemId: newItems[index].id, status: value }));
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };
    }
    const totalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);

    // Elimina documents si es un array vacío antes de actualizar
    let orderToUpdate = { ...formData, items: newItems, totalAmount };
    if (Array.isArray(orderToUpdate.documents) && orderToUpdate.documents.length === 0) {
      const { documents, ...rest } = orderToUpdate;
      orderToUpdate = rest;
    }

    setFormData(orderToUpdate);
    await purchaseOrderService.update(formData.id, orderToUpdate);
  };

  const addItem = () => {
    const newItem: PurchaseOrderItem = {
      id: uuidv4(),
      productId: 0,
      product: undefined,
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      isGift: false,
      isBestSeller: false,
      isNew: false,
      status: 'PENDING',
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setFormData({ ...formData, items: newItems, totalAmount });
  };

  const handleStockDistribution = (distribution: any[]) => {
    setShowStockModal(false);
    setSelectedItem(null);
  };

  const handleExpandRow = async (itemId: string) => {
    const response = await warehouseService.getByIdProducts(Number(itemId));
    setItemsWarehouse(response)
    
  };

  const handleWarehouseQtyChange = (itemId: string, warehouseId: number, value: number) => {

    setWarehouseQty((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [warehouseId]: value,
      },
    }));
  };

  // Ejemplo de uso de updateOrderStatus:
  // dispatch(updateOrderStatus({ orderId: formData.id, status: 'DELIVERED' }));

  // Cuando confirmas el stock listo:
  // const handleStockReady = () => {
  //   setConfirmModal({
  //     open: true,
  //     message:
  //       assignedQty === item.quantity
  //         ? '¿Está seguro que desea asignar el stock y marcar este producto como COMPLETADO? Esta acción no se puede deshacer.'
  //         : 'No se ha asignado la cantidad completa. ¿Desea marcar este producto como INCOMPLETO?',
  //     onConfirm: async () => {
  //       // Estados actuales
  //       const prevItemStatus = formData.items[index].status;
  //       const newItemStatus = assignedQty === item.quantity ? 'COMPLETED' : 'UNCOMPLETED';

  //       // Actualiza status del item en el store solo si cambia
  //       if (prevItemStatus !== newItemStatus) {
  //         dispatch(updateItemStatus({
  //           orderId: formData.id,
  //           itemId: item.id,
  //           status: newItemStatus
  //         }));
  //       }

  //       // Actualiza qtyDone solo si cambia
  //       if (item.qtyDone !== assignedQty) {
  //         dispatch(updateItemQtyDone({
  //           orderId: formData.id,
  //           itemId: item.id,
  //           qtyDone: assignedQty
  //         }));
  //       }

  //       handleItemChange(index, 'status', newItemStatus);

  //       // Verifica si todos los productos están en COMPLETED
  //       const updatedItems = [...formData.items];
  //       updatedItems[index] = {
  //         ...updatedItems[index],
  //         status: newItemStatus,
  //         qtyDone: assignedQty // <-- actualiza qtyDone aquí
  //       };
  //       const allCompleted = updatedItems.every(i => i.status === 'COMPLETED');
  //       const prevOrderStatus = formData.status;
  //       let newOrderStatus = prevOrderStatus;

  //       if (allCompleted && prevOrderStatus !== 'APPROVED') {
  //         dispatch(updateOrderStatus({ orderId: formData.id, status: 'APPROVED' }));
  //         setFormData({ ...formData, status: 'APPROVED', items: updatedItems });
  //         newOrderStatus = 'APPROVED';
  //       } else {
  //         setFormData({ ...formData, items: updatedItems });
  //       }

  //       // Solo actualiza en backend si hubo algún cambio
  //       const itemChanged = prevItemStatus !== newItemStatus || item.qtyDone !== assignedQty;
  //       const orderChanged = prevOrderStatus !== newOrderStatus;

  //       if (itemChanged || orderChanged) {
  //         let updatedOrder = { ...formData, items: updatedItems, status: newOrderStatus };
  //         // Elimina documents si es array vacío
  //         if (Array.isArray(updatedOrder.documents) && updatedOrder.documents.length === 0) {
  //           const { documents, ...rest } = updatedOrder;
  //           updatedOrder = rest;
  //         }
  //         setFormData(updatedOrder);
  //         await purchaseOrderService.update(formData.id, updatedOrder);
  //       }

  //       setExpandedRow(null);
  //       setConfirmModal(null);
  //     },
  //   });
  // };

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[1100px] bg-white shadow-xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-primary-100 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary-900">
            Editar Orden
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-50 rounded-full"
          >
            <X className="h-5 w-5 text-primary-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información del Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Información del Cliente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  value={formData.email}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Información de la Orden */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Información de la Orden</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orderNumber">Número de Orden</Label>
                <Input
                  id="orderNumber"
                  value={formData.orderNumber}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="orderDate">Fecha de Orden</Label>
                <Input
                  type="date"
                  id="orderDate"
                  value={formData.orderDate?.slice(0, 10) || ''}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="expectedDeliveryDate">Fecha de Entrega Esperada</Label>
                <Input
                  type="date"
                  id="expectedDeliveryDate"
                  value={formData.expectedDeliveryDate?.slice(0, 10) || ''}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as PurchaseOrder['status'] })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="APPROVED">Aprobada</option>
                  <option value="SHIPPED">Enviada</option>
                  <option value="DELIVERED">Entregada</option>
                  <option value="CANCELLED">Cancelada</option>
                </select>
              </div>
              <div>
                <Label htmlFor="paymentStatus">Estado de Pago</Label>
                <select
                  id="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as PurchaseOrder['paymentStatus'] })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="COMPLETED">Parcial</option>
                  <option value="UNCOMPLETED">Pagado</option>
                </select>
              </div>
              <div>
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <Input
                  id="paymentMethod"
                  value={formData.paymentMethod || ''}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-primary-900">Productos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-50">
                  <tr>
                    <th className="px-4 py-3 text-left"></th>
                    <th className="px-4 py-3 text-left">Producto</th>
                    <th className="px-4 py-3 text-left">SKU</th>
                    <th className="px-4 py-3 text-left">Cantidad</th>
                    <th className="px-4 py-3 text-left">Precio Unitario</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                    <th className="px-4 py-3 text-left">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => {
                   
                    const warehousesForProduct = itemsWarehouse.filter(
                      (iw: any) => iw.productId === item.productId
                    );

                    console.log("Warehouses for product:", warehousesForProduct);
                    // Suma de cantidades asignadas por bodega para este item
                    const assignedQty = warehousesForProduct.reduce((sum, wh) => {
                      const used = Number(warehouseQty[item.id]?.[wh.warehouse.id] ?? 0);
                      const returned = Number(warehouseQty[item.id]?.[`returnQty_${wh.warehouse.id}`] ?? 0);
                      return sum + (used - returned);
                    }, 0);

                    // Handler para "Listo"
                    const handleStockReady = () => {
                      setConfirmModal({
                        open: true,
                        message:
                          assignedQty === item.quantity
                            ? '¿Está seguro que desea asignar el stock y marcar este producto como COMPLETADO? Esta acción no se puede deshacer.'
                            : 'No se ha asignado la cantidad completa. ¿Desea marcar este producto como INCOMPLETO?',
                        onConfirm: async () => {
                          // Trabaja sobre una copia local de los items
                          const updatedItems = formData.items.map((it, idx) =>
                            idx === index
                              ? {
                                  ...it,
                                  status: assignedQty === item.quantity ? 'COMPLETED' : 'UNCOMPLETED',
                                  qtyDone: assignedQty,
                                }
                              : it
                          );

                          // Calcula los estados previos y nuevos
                          const prevItemStatus = item.status;
                          const newItemStatus = assignedQty === item.quantity ? 'COMPLETED' : 'UNCOMPLETED';
                          const prevOrderStatus = formData.status;
                          const allCompleted = updatedItems.every(i => i.status === 'COMPLETED');
                          const newOrderStatus = allCompleted ? 'APPROVED' : prevOrderStatus;

                          // Solo despacha si hay cambios
                          if (prevItemStatus !== newItemStatus) {
                            dispatch(updateItemStatus({
                              orderId: formData.id,
                              itemId: item.id,
                              status: newItemStatus
                            }));
                          }
                          if (item.qtyDone !== assignedQty) {
                            dispatch(updateItemQtyDone({
                              orderId: formData.id,
                              itemId: item.id,
                              qtyDone: assignedQty
                            }));
                          }
                          if (allCompleted && prevOrderStatus !== 'APPROVED') {
                            dispatch(updateOrderStatus({ orderId: formData.id, status: 'APPROVED' }));
                          }

                          // Prepara el objeto para backend
                          let updatedOrder = { ...formData, items: updatedItems, status: newOrderStatus };
                          if (Array.isArray(updatedOrder.documents) && updatedOrder.documents.length === 0) {
                            const { documents, ...rest } = updatedOrder;
                            updatedOrder = rest;
                          }
                          setFormData(updatedOrder);
                          await purchaseOrderService.update(formData.id, updatedOrder);

                          setExpandedRow(null);
                          setConfirmModal(null);
                        },
                      });
                    };

                    return (
                      <React.Fragment key={item.id}>
                        <tr className="border-b border-primary-100">
                          <td className="px-2 py-3 align-top">
                            <button
                              type="button"
                              onClick={() => {
                                if (expandedRow === item.id) {
                                  setExpandedRow(null);
                                } else {
                                  handleExpandRow(item.productId.toString());
                                  setExpandedRow(item.id);
                                }
                              }}
                              className="p-1"
                              aria-label="Ver stock"
                            >
                              {expandedRow === item.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3">
                              <Package className="h-5 w-5 text-primary-400" />
                              <Input
                                value={item.product?.name || ''}
                                disabled
                                className="border-0 focus:ring-0"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              value={item.product?.sku || ''}
                              disabled
                              className="border-0 focus:ring-0"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemUpdate(index, 'quantity', e.target.value)}
                              min="1"
                              className="w-24"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              value={item.unitPrice}
                              disabled
                              className="w-32"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium">₡{item.totalPrice.toLocaleString()}</span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={item.status}
                              onChange={(e) => handleItemUpdate(index, 'status', e.target.value)}
                              className="w-full rounded-md border border-input bg-background px-3 py-2"
                            >
                              <option value="PENDING">Pendiente</option>
                              <option value="COMPLETED">Completado</option>
                              <option value="UNCOMPLETED">Incompleto</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              className="p-1 hover:bg-primary-50 rounded text-primary-600"
                              title="Gestionar Stock"
                              disabled
                            >
                              <BoxIcon className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                        {expandedRow === item.id && (
                          <tr>
                            <td colSpan={8} className="bg-primary-50 px-6 py-4">
                              <div>
                                <div className="font-semibold mb-2">Stock en Bodegas</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {warehousesForProduct.length === 0 && (
                                    <div className="text-primary-500">No hay stock en bodegas para este producto.</div>
                                  )}
                                  {warehousesForProduct.map((wh: any) => {
                                    // Cantidad devuelta para esta bodega
                                    const returnQty = Number(warehouseQty[item.id]?.[`returnQty_${wh.warehouse.id}`] ?? 0);
                                    // Cantidad asignada para esta bodega
                                    const usedQty = Number(warehouseQty[item.id]?.[wh.warehouse.id] ?? 0);
                                    // Stock disponible ajustado: stock original - asignado + devuelto
                                    const availableStock = wh.quantity - usedQty + returnQty;

                                    return (
                                      <div key={wh.warehouse.id} className="flex flex-col gap-1">
                                        <div className="flex items-center gap-4">
                                          <span className="min-w-[120px]">{wh.warehouse.name}:</span>
                                          <span className="text-primary-700">
                                            Disponible: {availableStock}
                                          </span>
                                          <Input
                                            type="number"
                                            min={0}
                                            max={wh.quantity}
                                            value={ ( usedQty >= 0 ? usedQty - returnQty : 0 )}
                                            onChange={e => {
                                              const val = Number(e.target.value);
                                              // Solo permite valores >= 0 y no menores que la devolución
                                              if (val < 0) return;
                                              // Si hay devolución, no permite asignar menos que la devolución
                                              if (returnQty > 0 && val < returnQty) return;
                                              handleWarehouseQtyChange(item.id, wh.warehouse.id, val);
                                            }}
                                            placeholder="Cantidad a usar"
                                            className="w-32"
                                          />
                                        </div>
                                        {/* NUEVO: Devolución de stock */}
                                        <div className="flex items-center gap-2 pl-[128px]">
                                          <input
                                            type="checkbox"
                                            id={`return-checkbox-${item.id}-${wh.warehouse.id}`}
                                            checked={!!warehouseQty[item.id]?.[`return_${wh.warehouse.id}`]}
                                            onChange={e => {
                                              setWarehouseQty(prev => ({
                                                ...prev,
                                                [item.id]: {
                                                  ...prev[item.id],
                                                  [`return_${wh.warehouse.id}`]: e.target.checked,
                                                  [`returnQty_${wh.warehouse.id}`]: e.target.checked
                                                    ? prev[item.id]?.[`returnQty_${wh.warehouse.id}`] ?? 0
                                                    : 0,
                                                },
                                              }));
                                            }}
                                          />
                                          <label htmlFor={`return-checkbox-${item.id}-${wh.warehouse.id}`} className="text-sm">
                                            Devolver stock
                                          </label>
                                          <Input
                                            type="number"
                                            min={0}
                                            max={wh.quantity}
                                            value={returnQty}
                                            onChange={e => {
                                              const val = Number(e.target.value);
                                              setWarehouseQty(prev => ({
                                                ...prev,
                                                [item.id]: {
                                                  ...prev[item.id],
                                                  [`returnQty_${wh.warehouse.id}`]: val,
                                                },
                                              }));
                                            }}
                                            placeholder="Cantidad a devolver"
                                            className="w-32"
                                            disabled={!warehouseQty[item.id]?.[`return_${wh.warehouse.id}`]}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="mt-2 text-xs text-primary-500">
                                  * Asigna la cantidad de cada bodega para cubrir la cantidad pedida.
                                </div>
                                <div className="mt-4 flex items-center gap-4">
                                  <span
                                    className={
                                      assignedQty === item.quantity
                                        ? 'text-green-600 font-semibold'
                                        : 'text-red-600 font-semibold'
                                    }
                                  >
                                    Total asignado: {assignedQty} / {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    className={`px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 transition ${
                                      assignedQty > 0 && assignedQty < item.quantity ? '' : 'opacity-50 cursor-not-allowed'
                                    }`}
                                    disabled={assignedQty === 0 || assignedQty === item.quantity}
                                    onClick={handleStockReady}
                                  >
                                    Listo
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Información de Envío y Facturación */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Envío y Facturación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-primary-50 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-primary-800 mb-2 flex items-center gap-2">
                  <span role="img" aria-label="Envío">🚚</span> Dirección de Envío
                </h4>
                <div className="text-primary-700 text-sm whitespace-pre-line min-h-[48px]">
                  {formData.dataShipping
                    ? formData.dataShipping
                    : <span className="text-primary-400">No hay dirección de envío registrada.</span>
                  }
                </div>
              </div>
              <div className="bg-primary-50 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-primary-800 mb-2 flex items-center gap-2">
                  <span role="img" aria-label="Factura">🧾</span> Dirección de Facturación
                </h4>
                <div className="text-primary-700 text-sm whitespace-pre-line min-h-[48px]">
                  {formData.dataBilling
                    ? formData.dataBilling
                    : <span className="text-primary-400">No hay dirección de facturación registrada.</span>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Información de Rastreo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Información de Rastreo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trackingNumber">Número de Rastreo</Label>
                <Input
                  id="trackingNumber"
                  value={formData.trackingNumber || ''}
                  onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="actualDeliveryDate">Fecha de Entrega Real</Label>
                <Input
                  type="date"
                  id="actualDeliveryDate"
                  value={formData.actualDeliveryDate?.slice(0, 10) || ''}
                  onChange={(e) => setFormData({ ...formData, actualDeliveryDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <Label htmlFor="notes">Notas</Label>
            <textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
            />
          </div>

          {/* Total */}
          <div className="border-t border-primary-100 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-primary-900">Total</span>
              <span className="text-2xl font-bold text-primary-900">
                ₡{formData.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      {/* Stock Distribution Modal */}
      {showStockModal && selectedItem && (
<></>
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <Dialog open={confirmModal.open} onOpenChange={open => !open && setConfirmModal(null)}>
          <DialogContent>
            <DialogHeader>
              Confirmación
            </DialogHeader>
            <div className="py-4">{confirmModal.message}</div>
            <DialogFooter>
              <button
                className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700"
                onClick={async () => {
                  if (confirmModal.onConfirm) {
                    await confirmModal.onConfirm();
                  }
                }}
              >
                Confirmar
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setConfirmModal(null)}
              >
                Cancelar
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default EditOrderModal;