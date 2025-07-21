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

  // Acciones principales
  const handleViewDetails = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setViewMode('details');
  };

  const handleEditOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setViewMode('edit');
  };

  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setViewMode('create');
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
    setViewMode('list');
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
          ...orderData,
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
    
    // Setters
    setSearchQuery,
    setStatusFilter,
  };
}
