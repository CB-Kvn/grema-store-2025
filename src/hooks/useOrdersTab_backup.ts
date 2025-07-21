import { useState, useMemo, useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { 
  selectAllOrders, 
  selectLoading, 
  selectError, 
  fetchOrders, 
  deleteOrderAsync,
  createOrder,
  updateOrderAsync
} from "@/store/slices/purchaseOrdersSlice";
import type { PurchaseOrder } from "@/types";

export type ViewMode = 'list' | 'details' | 'edit' | 'create';

export function useOrdersTab() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAllOrders);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Cargar órdenes al inicializar
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Filtrar órdenes
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id?.toString().includes(searchQuery) ||
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // Función para ver documentos/comprobantes
  const handleViewDocument = (document: any) => {
    if (document.url) {
      window.open(document.url, '_blank');
    } else if (document.file) {
      // Si es un archivo local, crear URL temporal
      const blob = new Blob([document.file]);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Limpiar URL después de un tiempo
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  };

  // Función para descargar documento
  const handleDownloadDocument = (document: any) => {
    if (document.url) {
      const link = document.createElement('a');
      link.href = document.url;
      link.download = document.name || 'documento';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Estadísticas
  const stats = useMemo(() => {
    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'delivered').length;
    const inProgressOrders = orders.filter(order => order.status === 'in_transit').length;

    return {
      totalOrders: orders.length,
      totalAmount,
      pendingOrders,
      completedOrders,
      inProgressOrders,
      averageOrderValue: orders.length > 0 ? totalAmount / orders.length : 0
    };
  }, [orders]);

  // Navegación inline
  const handleViewDetails = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setViewMode('details');
  };

  const handleEditOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setOrderItems(order.items || []);
    setOrderFormData({
      firstName: order.firstName,
      lastName: order.lastName,
      email: order.email,
      phone: order.phone,
      orderNumber: order.orderNumber,
      dataShipping: order.dataShipping,
      dataBilling: order.dataBilling,
      status: order.status,
      orderDate: order.orderDate,
      expectedDeliveryDate: order.expectedDeliveryDate,
      subtotalAmount: order.subtotalAmount,
      totalAmount: order.totalAmount,
      shippingAmount: order.shippingAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber,
      notes: order.notes,
    });
    setViewMode('edit');
  };

  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setOrderItems([]);
    setOrderFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      orderNumber: `PO-${new Date().getFullYear()}-${uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase()}`,
      dataShipping: '',
      dataBilling: '',
      status: 'pending',
      orderDate: new Date().toISOString(),
      expectedDeliveryDate: null,
      subtotalAmount: 0,
      totalAmount: 0,
      shippingAmount: 0,
      paymentMethod: '',
      paymentStatus: 'pending',
      trackingNumber: null,
      notes: null,
    });
    setViewMode('create');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedOrder(null);
  };

  // Gestión de órdenes
  const handleDeleteOrder = async (orderId: string) => {
    try {
      await dispatch(deleteOrderAsync(orderId));
      if (selectedOrder && selectedOrder.id === orderId) {
        handleBackToList();
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleSubmit = async (orderData: Partial<PurchaseOrder>) => {
    try {
      if (viewMode === 'edit' && selectedOrder) {
        // Lógica de actualización
        const updatedData = {
          ...orderData,
          items: orderItems,
          totalAmount: orderItems.reduce((sum, item) => sum + item.totalPrice, 0),
        };
        await dispatch(updateOrderAsync({ id: selectedOrder.id, data: updatedData }));
      } else {
        // Lógica de creación
        const newOrder = {
          ...orderData,
          id: orderData.orderNumber || `PO-${new Date().getFullYear()}-${uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase()}`,
          items: orderItems,
          totalAmount: orderItems.reduce((sum, item) => sum + item.totalPrice, 0),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await dispatch(createOrder(newOrder as PurchaseOrder));
      }
      // Recargar órdenes después de la operación
      dispatch(fetchOrders());
      handleBackToList();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  // Gestión de productos para órdenes
  const handleAddProducts = () => {
    setShowProductModal(true);
  };

  const handleProductSelect = (selectedRows: Array<{ product: Product; warehouse: any; quantity: number }>) => {
    const newItems: Item[] = selectedRows.map(({ product, warehouse, quantity }) => ({
      id: uuidv4(),
      orderId: (viewMode === 'edit' && selectedOrder) ? selectedOrder.id : (orderFormData.orderNumber || ''),
      productId: product.id || 0,
      product: {
        id: product.id || 0,
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        sku: product.sku || '',
        details: {
          peso: '',
          color: [],
          largo: '',
          cierre: { tipo: '', colores: [] },
          piedra: [],
          pureza: '',
          garantia: '',
          material: '',
          certificado: ''
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        available: true,
      },
      quantity: quantity,
      unitPrice: warehouse.price || 0,
      totalPrice: (warehouse.price || 0) * quantity,
      qtyDone: null,
      isGift: false,
      isBestSeller: false,
      isNew: false,
      status: 'PENDING',
    }));
    
    setOrderItems(prev => [...prev, ...newItems]);
    setShowProductModal(false);
  };

  const handleRemoveOrderItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof Item, value: any) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'quantity' || field === 'unitPrice' ? Number(value) : value,
      totalPrice: field === 'quantity' 
        ? Number(value) * newItems[index].unitPrice
        : field === 'unitPrice'
          ? newItems[index].quantity * Number(value)
          : newItems[index].quantity * newItems[index].unitPrice,
    };
    setOrderItems(newItems);
  };

  const handleOrderFormChange = (field: string, value: any) => {
    setOrderFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Funciones para manejo de inventario por bodega
  const handleExpandRow = async (itemId: string, productId: number) => {
    if (expandedRow === itemId) {
      setExpandedRow(null);
      setItemsWarehouse([]);
      setLoadingWarehouse(null);
    } else {
      setExpandedRow(itemId);
      setLoadingWarehouse(itemId);
      
      // Cargar información de bodegas para el producto
      try {
        const response = await warehouseService.getByIdProducts(productId);
        // Asegurar que siempre sea un array
        setItemsWarehouse(Array.isArray(response) ? response : []);
        console.log('Loaded warehouse info for product:', productId, response);
      } catch (error) {
        console.error('Error loading warehouse info:', error);
        setItemsWarehouse([]);
      } finally {
        setLoadingWarehouse(null);
      }
    }
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

  const handleStockAssignment = async (itemId: string) => {
    // Calcular el total asignado para este item
    const itemAssignments = warehouseQty[itemId] || {};
    const totalAssigned = Object.values(itemAssignments).reduce((sum, qty) => sum + (qty || 0), 0);
    
    // Encontrar el item en orderItems
    const itemIndex = orderItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      const newItems = [...orderItems];
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        qtyDone: totalAssigned,
        status: totalAssigned === newItems[itemIndex].quantity ? 'COMPLETED' : 
                totalAssigned > 0 ? 'UNCOMPLETED' : 'PENDING'
      };
      setOrderItems(newItems);
    }
  };

  // Paginación
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    // Data
    orders: paginatedOrders,
    allOrders: orders,
    loading,
    error,
    stats,
    
    // UI State
    searchQuery,
    setSearchQuery,
    selectedOrder,
    viewMode,
    setViewMode,
    statusFilter,
    setStatusFilter,
    currentPage,
    totalPages,
    itemsPerPage,
    
    // Product Management State
    showProductModal,
    setShowProductModal,
    orderItems,
    orderFormData,
    
    // Warehouse Assignment State
    warehouseQty,
    expandedRow,
    itemsWarehouse,
    loadingWarehouse,
    
    // Actions
    handleViewDetails,
    handleEditOrder,
    handleCreateOrder,
    handleBackToList,
    handleDeleteOrder,
    handleSubmit,
    handlePageChange,
    handleViewDocument,
    handleDownloadDocument,
    
    // Product Management Actions
    handleAddProducts,
    handleProductSelect,
    handleRemoveOrderItem,
    handleItemChange,
    handleOrderFormChange,
    
    // Warehouse Assignment Actions
    handleExpandRow,
    handleWarehouseQtyChange,
    handleStockAssignment,
  };
}
