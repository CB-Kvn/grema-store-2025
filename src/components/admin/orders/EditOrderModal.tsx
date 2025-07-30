/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { X, Plus, Trash2, Package, BoxIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import type { PurchaseOrder } from '@/types';
import type { Item } from '@/types/purchaseOrder';
import { updateOrder, updateItemQtyDone, updateItemStatus, updateOrderStatus, updateOrderAsync } from '@/store/slices/purchaseOrdersSlice';
import StockDistributionModal from '../inventory/StockDistributionModal';
import { warehouseService } from '@/services/warehouseService';
import { purchaseOrderService } from '@/services/purchaseOrderService';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from '../../ui/dialog';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useProductService } from '@/hooks/useProductService'; // Agrega este import
import { motion } from 'framer-motion';

interface EditOrderModalProps {
  order: PurchaseOrder;
  onClose: () => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, onClose }) => {
  const dispatch = useAppDispatch();
  // const ordersList = useAppSelector((state: any) => state.purchaseOrders.orders);
  const [formData, setFormData] = useState<PurchaseOrder>({
    ...order,
    items: order.items || [],
    documents: order.documents || []
  });
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [itemsWarehouse, setItemsWarehouse] = useState<[]>([]);
  const [warehouseQty, setWarehouseQty] = useState<{ [itemId: string]: { [warehouseId: number]: number } }>({});
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [uploadingFile, setUploadingFile] = useState<{ [docId: string]: boolean }>({});
  const [selectedFiles, setSelectedFiles] = useState<{ [docId: string]: File | null }>({});
  const { addStock, removeStock } = useProductService(); // Usa el hook

  // Función para manejar la actualización de documentos
  const handleDocumentUpdate = async (updatedDocuments: any[]) => {
    try {
      const orderToUpdate = { ...formData, documents: updatedDocuments };

      // Elimina documents si es un array vacío antes de actualizar
      if (Array.isArray(orderToUpdate.documents) && orderToUpdate.documents.length === 0) {
        const { documents, ...rest } = orderToUpdate;
        await purchaseOrderService.update(formData.id, rest);
      } else {
        await purchaseOrderService.update(formData.id, orderToUpdate);
      }

      // No actualizar formData aquí ya que se hace en el onChange
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  // Función para manejar la actualización de documentos y estado de pago
  const handleDocumentAndPaymentUpdate = async (updatedDocuments: any[], newPaymentStatus: string) => {
    try {
      const orderToUpdate = { ...formData, documents: updatedDocuments, paymentStatus: newPaymentStatus };

      // Elimina documents si es un array vacío antes de actualizar
      if (Array.isArray(orderToUpdate.documents) && orderToUpdate.documents.length === 0) {
        const { documents, ...rest } = orderToUpdate;
        await purchaseOrderService.update(formData.id, rest);
      } else {
        await purchaseOrderService.update(formData.id, orderToUpdate);
      }
    } catch (error) {
      console.error('Error updating document and payment status:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateOrderAsync({ id: formData.id, data: formData }));
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  // Nueva función unificada para cambios de item y confirmación de stock
  const handleItemUpdate = async (
    index: number,
    field: keyof Item,
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

  // Función para manejar la subida de archivo y actualización del documento
  const handleFileUploadAndUpdate = async (docId: string, file: File, docIndex: number) => {
    try {
      setUploadingFile(prev => ({ ...prev, [docId]: true }));

      // Primero subir el archivo usando uploadFileReceipt
      const uploadResponse = await purchaseOrderService.uploadFileReceipt(file);

      // Luego actualizar el documento con la nueva información
      const updateData = {
        title: formData.documents?.[docIndex]?.title || `Comprobante actualizado - ${formData.orderNumber}`,
        status: formData.documents?.[docIndex]?.status || 'PENDING', url: uploadResponse.url,
        mimeType: uploadResponse.fileType,
        size: uploadResponse.size
      };

      await purchaseOrderService.updateDocument(formData.id, updateData);

      // Actualizar el documento en el estado local con la nueva URL
      const updatedDocuments = [...(formData.documents || [])];
      updatedDocuments[docIndex] = {
        ...updatedDocuments[docIndex],
        url: uploadResponse.url,
        mimeType: uploadResponse.fileType,
        size: uploadResponse.size
      };

      setFormData({ ...formData, documents: updatedDocuments });
      setSelectedFiles(prev => ({ ...prev, [docId]: null }));

      // Limpiar el input de archivo
      const fileInput = document.getElementById(`fileInput-${docId}`) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

      // Actualizar en el store de Redux
      dispatch(updateOrder({ ...formData, documents: updatedDocuments }));

    } catch (error) {
      console.error('Error uploading file:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setUploadingFile(prev => ({ ...prev, [docId]: false }));
    }
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal Content con animación */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.4 }}
        className="fixed inset-y-0 right-0 w-full md:w-[1100px] bg-white shadow-xl z-50 overflow-y-auto"
      >
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
                  value={formData.orderDate ? (typeof formData.orderDate === 'string' ? formData.orderDate.slice(0, 10) : formData.orderDate.toISOString().slice(0, 10)) : ''}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="expectedDeliveryDate">Fecha de Entrega Esperada</Label>
                <Input
                  type="date"
                  id="expectedDeliveryDate"
                  value={formData.expectedDeliveryDate ? (typeof formData.expectedDeliveryDate === 'string' ? formData.expectedDeliveryDate.slice(0, 10) : formData.expectedDeliveryDate.toISOString().slice(0, 10)) : ''}
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
                  </tr>
                </thead>
                <tbody>
                  {formData.items && formData.items.map((item, index) => {

                    const warehousesForProduct = itemsWarehouse.filter(
                      (iw: any) => iw.productId === item.productId
                    );

                    console.log("Warehouses for product:", warehousesForProduct);
                    // Suma de cantidades asignadas por bodega para este item
                    const assignedQty = warehousesForProduct.reduce((sum, wh) => {
                      const used = Number(warehouseQty[item.id]?.[wh.warehouse.id] ?? 0);
                      const returned = Number(warehouseQty[item.id]?.[`returnQty_${wh.warehouse.id}`] ?? 0);
                      return sum + (used - returned);
                    }, item.qtyDone || 0);

                    // Handler para "Listo" 
                    const handleStockReady = () => {
                      setConfirmModal({
                        open: true,
                        message:
                          assignedQty === item.quantity
                            ? '¿Está seguro que desea asignar el stock y marcar este producto como COMPLETADO? Esta acción no se puede deshacer.'
                            : 'No se ha asignado la cantidad completa. ¿Desea marcar este producto como INCOMPLETO?',
                        onConfirm: async () => {
                          // Por cada bodega, remueve el stock asignado
                          for (const wh of warehousesForProduct) {
                            const usedQty = Number(warehouseQty[item.id]?.[wh.warehouse.id] ?? 0);
                            if (usedQty > 0) {
                              await removeStock(
                                wh.warehouse.id,
                                item.productId,
                                usedQty
                              );
                            }
                          }

                          // Determina el nuevo estado según assignedQty
                          let newItemStatus = '';
                          if (assignedQty === 0) {
                            newItemStatus = 'PENDING';
                          } else if (assignedQty === item.quantity) {
                            newItemStatus = 'COMPLETED';
                          } else {
                            newItemStatus = 'UNCOMPLETED';
                          }

                          // Trabaja sobre una copia local de los items
                          const updatedItems = formData.items.map((it, idx) =>
                            idx === index
                              ? {
                                ...it,
                                status: newItemStatus,
                                qtyDone: assignedQty,
                              }
                              : it
                          );

                          // Calcula los estados previos y nuevos
                          const prevItemStatus = item.status;
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

                          // --- LIMPIA ASIGNADOS Y DEVOLUCIONES ---
                          setWarehouseQty(prev => {
                            const newState = { ...prev };
                            if (newState[item.id]) {
                              Object.keys(newState[item.id]).forEach(key => {
                                newState[item.id][key] = 0;
                              });
                            }
                            return newState;
                          });

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
                            <span
                              className={`px-2 py-1 rounded-full text-xs sm:text-sm ${item.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-700'
                                : item.status === 'UNCOMPLETED'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-primary-100 text-primary-700'
                                }`}
                            >
                              {item.status === 'COMPLETED'
                                ? 'Completado'
                                : item.status === 'UNCOMPLETED'
                                  ? 'Incompleto'
                                  : 'Pendiente'}
                            </span>
                          </td>
                        </tr>
                        {expandedRow === item.id && (
                          <tr>
                            <td colSpan={7} className="bg-primary-50 px-6 py-4">
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
                                            value={(usedQty >= 0 ? usedQty - returnQty : 0)}
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
                                            disabled={item.status === "PENDING" || assignedQty === 0}
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
                                            disabled={
                                              !warehouseQty[item.id]?.[`return_${wh.warehouse.id}`] ||
                                              item.status === "PENDING" ||
                                              assignedQty === 0 // <-- No permite devolver si el total asignado ya es 0
                                            }
                                          />
                                          {/* Botones de acción para devolución */}
                                          {returnQty > 0 && (
                                            <>
                                              <button
                                                type="button"
                                                className="ml-2 p-1 rounded bg-primary-100 hover:bg-primary-200 text-primary-700 border border-primary-300"
                                                title="Confirmar devolución"
                                                onClick={async () => {
                                                  // ADD STOCK: Devolver a la bodega
                                                  await addStock(
                                                    wh.warehouse.id,
                                                    item.productId,
                                                    {
                                                      quantity: returnQty,
                                                      location: wh.location,
                                                      price: item.unitPrice
                                                    }
                                                  );
                                                  setWarehouseQty(prev => ({
                                                    ...prev,
                                                    [item.id]: {
                                                      ...prev[item.id],
                                                      [`returnQty_${wh.warehouse.id}`]: 0,
                                                      [`return_${wh.warehouse.id}`]: false,
                                                    },
                                                  }));
                                                  // Ejecuta la lógica del botón "Listo"
                                                  handleStockReady();
                                                }}
                                              >
                                                <span role="img" aria-label="check">✔️</span>
                                              </button>
                                              <button
                                                type="button"
                                                className="ml-1 p-1 rounded bg-red-100 hover:bg-red-200 text-red-700 border border-red-300"
                                                title="Cancelar devolución"
                                                onClick={() => {
                                                  setWarehouseQty(prev => ({
                                                    ...prev,
                                                    [item.id]: {
                                                      ...prev[item.id],
                                                      [`returnQty_${wh.warehouse.id}`]: 0,
                                                      [`return_${wh.warehouse.id}`]: false,
                                                    },
                                                  }));
                                                }}
                                              >
                                                <span role="img" aria-label="cancel">✖️</span>
                                              </button>
                                            </>
                                          )}
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
                                    className={`px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 transition ${assignedQty > item.quantity ? 'opacity-50 cursor-not-allowed' : ''
                                      }`}
                                    disabled={assignedQty > item.quantity}
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

          {/* Documentos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Comprobantes</h3>
            <div className="bg-primary-50 rounded-lg p-4">
              {formData.documents && formData.documents.length > 0 ? (
                <div className="space-y-4">
                  {formData.documents.map((doc, index) => (
                    <div key={doc.id} className="bg-white rounded-lg p-4 border border-primary-200 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Label htmlFor={`docTitle-${index}`}>Título del Comprobante</Label>
                          <Input
                            id={`docTitle-${index}`}
                            value={doc.title}
                            onChange={async (e) => {
                              const updatedDocuments = [...(formData.documents || [])];
                              updatedDocuments[index] = { ...doc, title: e.target.value };
                              await handleDocumentUpdate(updatedDocuments);
                            }}
                            className="mt-1"
                          />
                        </div>
                        <div className="ml-4">
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
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label htmlFor={`docType-${index}`}>Tipo</Label>
                          <select
                            id={`docType-${index}`}
                            value={doc.type}
                            onChange={async (e) => {
                              const updatedDocuments = [...(formData.documents || [])];
                              updatedDocuments[index] = { ...doc, type: e.target.value };
                              await handleDocumentUpdate(updatedDocuments);
                            }}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                          >
                            <option value="RECEIPT">Comprobante</option>
                            <option value="INVOICE">Factura</option>
                            <option value="CONTRACT">Contrato</option>
                            <option value="OTHER">Otro</option>
                          </select>
                        </div>
                        <div>
                          <Label>Fecha de Subida</Label>
                          <div className="mt-1 text-sm text-primary-600 py-2">
                            {new Date(doc.uploadedAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div>
                          <Label>Tamaño</Label>
                          <div className="mt-1 text-sm text-primary-600 py-2">
                            {(doc.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => window.open(doc.url, '_blank')}
                          className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm flex items-center justify-center gap-2"
                        >
                          <span role="img" aria-label="view">👁️</span>
                          Ver Comprobante
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            setConfirmModal({
                              open: true,
                              message: `¿Está seguro que desea eliminar el comprobante "${doc.title}"? Esta acción no se puede deshacer.`,
                              onConfirm: async () => {
                                const updatedDocuments = (formData.documents || []).filter((_, i) => i !== index);
                                await handleDocumentUpdate(updatedDocuments);
                                setConfirmModal(null);
                              }
                            });
                          }}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm flex items-center justify-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>

                      {/* Sección de actualización de archivo */}
                      <div className="mt-4 border-t pt-4">
                        <Label htmlFor={`fileInput-${doc.id}`}>Actualizar Comprobante</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            id={`fileInput-${doc.id}`}
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                await handleFileUploadAndUpdate(doc.id, file, index);
                              }
                            }}
                            className="hidden"
                            disabled={uploadingFile[doc.id]}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const fileInput = document.getElementById(`fileInput-${doc.id}`) as HTMLInputElement;
                              if (fileInput) {
                                fileInput.click();
                              }
                            }}
                            disabled={uploadingFile[doc.id]}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {uploadingFile[doc.id] ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Subiendo...
                              </>
                            ) : (
                              <>
                                <Package className="h-4 w-4" />
                                Subir Nuevo Archivo
                              </>
                            )}
                          </button>
                          {selectedFiles[doc.id] && (
                            <span className="text-sm text-green-700">
                              {selectedFiles[doc.id]?.name}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Formatos permitidos: PDF, DOC, DOCX, JPG, JPEG, PNG
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-primary-600">No hay comprobantes subidos para esta orden</p>
                </div>
              )}
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
                  onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value || null })}
                />
              </div>
              <div>
                <Label htmlFor="actualDeliveryDate">Fecha de Entrega Real</Label>
                <Input
                  type="date"
                  id="actualDeliveryDate"
                  value={formData.actualDeliveryDate ? (typeof formData.actualDeliveryDate === 'string' ? formData.actualDeliveryDate.slice(0, 10) : formData.actualDeliveryDate.toISOString().slice(0, 10)) : ''}
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
      </motion.div>

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