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
import type { PurchaseOrder, Product } from "@/types";
import type { Item } from "@/types/purchaseOrder";
import { v4 as uuidv4 } from 'uuid';

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

  // Estados para conservar la posición del scroll
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);

  // Estados para gestión de productos
  const [showProductModal, setShowProductModal] = useState(false);
  const [orderItems, setOrderItems] = useState<Item[]>([]);
  const [orderFormData, setOrderFormData] = useState<Partial<PurchaseOrder>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    orderNumber: '',
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

  // Función para descargar documentos
  const handleDownloadDocument = (document: any) => {
    if (document.url) {
      // Si es una URL, intentar descargar
      const link = document.createElement('a');
      link.href = document.url;
      link.download = document.name || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (document.file) {
      // Si es un archivo local
      const blob = new Blob([document.file]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.name || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Funciones para gestión de productos
  const handleAddProducts = () => {
    setShowProductModal(true);
  };

  const handleProductSelect = (products: Product[]) => {
    const newItems: Item[] = products.map((product) => ({
      id: uuidv4(),
      orderId: (viewMode === 'edit' && selectedOrder) ? selectedOrder.id : (orderFormData.orderNumber || ''),
      productId: product.id || 0,
      productName: product.name || '',
      productImage: product.Images || '',
      description: product.description || '',
      category: product.category || '',
      brand: '',
      model: '',
      sku: product.sku || '',
      quantity: 1, // Cantidad por defecto
      unitPrice: product.price || 0,
      totalPrice: product.price || 0,
      status: 'pending',
      notes: '',
      warehouseId: undefined,
      warehouseName: '',
      stockAvailable: 0,
      specifications: {},
      dimensions: '',
      weight: 0,
      color: '',
      material: '',
      warranty: '',
      supplier: '',
      barcode: '',
      location: '',
      minStockLevel: 0,
      maxStockLevel: 0,
      reorderPoint: 0,
      leadTime: 0,
      tags: [],
      lastUpdated: new Date().toISOString(),
      isActive: true,
      qtyDone: 0,
      isGift: product.isGift || false,
      isBestSeller: product.isBestSeller || false,
      isNew: product.isNew || false,
    }));

    setOrderItems(prev => [...prev, ...newItems]);
    setShowProductModal(false);
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
  };

  const handleRemoveOrderItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof Item, value: any) => {
    setOrderItems(prev => {
      const newItems = [...prev];
      newItems[index] = {
        ...newItems[index],
        [field]: value,
        ...(field === 'quantity' || field === 'unitPrice' ? {
          totalPrice: (field === 'quantity' ? value : newItems[index].quantity) * 
                     (field === 'unitPrice' ? value : newItems[index].unitPrice)
        } : {})
      };
      return newItems;
    });
  };

  const handleOrderFormChange = (field: string, value: any) => {
    setOrderFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para guardar posición del scroll
  const saveScrollPosition = () => {
    const scrollContainer = document.querySelector('.orders-list-container');
    if (scrollContainer) {
      setSavedScrollPosition(scrollContainer.scrollTop);
    }
  };

  // Función para restaurar posición del scroll
  const restoreScrollPosition = () => {
    setTimeout(() => {
      const scrollContainer = document.querySelector('.orders-list-container');
      if (scrollContainer && savedScrollPosition > 0) {
        // Validar que la posición guardada no exceda el máximo scroll posible
        const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const targetScrollTop = Math.min(savedScrollPosition, maxScrollTop);
        
        scrollContainer.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Función mejorada para hacer scroll al inicio y prevenir espacios en blanco
  const scrollToTopOfEditContainer = () => {
    setTimeout(() => {
      // Buscar contenedores de edición/creación/detalles
      const editContainer = document.querySelector('.orders-edit-container, .orders-create-container, .orders-details-container');
      if (editContainer) {
        // Solo hacer un scroll suave al inicio, sin forzar múltiples veces
        editContainer.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Acciones principales
  const handleViewDetails = (order: PurchaseOrder) => {
    // Guardar posición del scroll antes de cambiar de vista
    saveScrollPosition();
    
    setSelectedOrder(order);
    setOrderItems(order.items || []);
    setOrderFormData({
      firstName: order.firstName || '',
      lastName: order.lastName || '',
      email: order.email || '',
      phone: order.phone || '',
      orderNumber: order.orderNumber || '',
      dataShipping: order.dataShipping || '',
      dataBilling: order.dataBilling || '',
      status: order.status || 'pending',
      orderDate: order.orderDate || new Date().toISOString(),
      expectedDeliveryDate: order.expectedDeliveryDate || null,
      subtotalAmount: order.subtotalAmount || 0,
      totalAmount: order.totalAmount || 0,
      shippingAmount: order.shippingAmount || 0,
      paymentMethod: order.paymentMethod || '',
      paymentStatus: order.paymentStatus || 'pending',
      trackingNumber: order.trackingNumber || null,
      notes: order.notes || null,
    });
    setViewMode('details');
    
    // Hacer scroll al inicio del contenedor de detalles
    scrollToTopOfEditContainer();
  };

  const handleEditOrder = (order: PurchaseOrder) => {
    // Guardar posición del scroll antes de cambiar de vista
    saveScrollPosition();
    
    setSelectedOrder(order);
    setOrderItems(order.items || []);
    setOrderFormData({
      firstName: order.firstName || '',
      lastName: order.lastName || '',
      email: order.email || '',
      phone: order.phone || '',
      orderNumber: order.orderNumber || '',
      dataShipping: order.dataShipping || '',
      dataBilling: order.dataBilling || '',
      status: order.status || 'pending',
      orderDate: order.orderDate || new Date().toISOString(),
      expectedDeliveryDate: order.expectedDeliveryDate || null,
      subtotalAmount: order.subtotalAmount || 0,
      totalAmount: order.totalAmount || 0,
      shippingAmount: order.shippingAmount || 0,
      paymentMethod: order.paymentMethod || '',
      paymentStatus: order.paymentStatus || 'pending',
      trackingNumber: order.trackingNumber || null,
      notes: order.notes || null,
    });
    setViewMode('edit');
    
    // Hacer scroll al inicio del contenedor de edición
    scrollToTopOfEditContainer();
  };

  const handleCreateOrder = () => {
    // Guardar posición del scroll antes de cambiar de vista
    saveScrollPosition();
    
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
    
    // Hacer scroll al inicio del contenedor de creación
    scrollToTopOfEditContainer();
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
    setOrderItems([]);
    setViewMode('list');
    
    // Restaurar posición del scroll cuando regrese a la lista
    restoreScrollPosition();
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await dispatch(deleteOrderAsync(orderId)).unwrap();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleSubmit = async (orderData: Partial<PurchaseOrder>) => {
    try {
      if (viewMode === 'edit' && selectedOrder) {
        await dispatch(updateOrderAsync({
          id: selectedOrder.id,
          data: orderData,
        })).unwrap();
      } else {
        await dispatch(createOrder({
          ...orderData,
          id: orderData.orderNumber || `PO-${new Date().getFullYear()}-${Date.now()}`,
        })).unwrap();
      }
      
      handleBackToList();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleInventoryAssign = (itemId: string, assignments: { warehouseId: string; quantity: number }[]) => {
    // Actualizar el item con las asignaciones de inventario
    setOrderItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          warehouseAssignments: assignments,
        };
      }
      return item;
    }));
    
    // Opcional: Mostrar mensaje de éxito
    console.log(`Inventario asignado para item ${itemId}:`, assignments);
  };

  return {
    // Data
    orders: paginatedOrders,
    filteredOrders,
    loading,
    error,
    selectedOrder,
    viewMode,
    searchQuery,
    statusFilter,
    currentPage,
    totalPages,
    itemsPerPage,
    orderFormData,
    orderItems,
    showProductModal,
    
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
    handleOrderFormChange,
    handleAddProducts,
    handleRemoveOrderItem,
    handleItemChange,
    handleProductSelect,
    handleCloseProductModal,
    handleInventoryAssign,
    
    // Setters
    setSearchQuery,
    setStatusFilter,
    setOrderFormData,
    setOrderItems,
    setShowProductModal,
    
    // Scroll management
    saveScrollPosition,
    restoreScrollPosition,
    scrollToTopOfEditContainer,
    savedScrollPosition,
  };
}
