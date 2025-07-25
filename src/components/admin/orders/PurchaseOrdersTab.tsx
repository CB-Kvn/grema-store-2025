import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Package, Search, Filter, Plus, ArrowUpDown, Download,
  Truck, DollarSign, FileText,
  Edit, Trash2, Eye,
  CheckCircle2, XCircle, Clock, AlertCircle, MoreHorizontal,
  ChevronDown, ChevronUp, BarChart3
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import type { PurchaseOrder, Warehouse } from '@/types';
import { 
  selectAllOrders, 
  selectLoading, 
  selectError, 
  fetchOrders, 
  deleteOrderAsync 
} from '@/store/slices/purchaseOrdersSlice';
import OrderDetailsModal from './OrderDetailsModal';
import EditOrderModal from './EditOrderModal';
import NewOrderModal from './NewOrderModal';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { AnimatePresence } from 'framer-motion';
import AIInsights from '@/components/admin/common/AIInsights';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Helper functions for charts
const getMonthlyLabels = () => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const currentMonth = new Date().getMonth();
  const labels = [];
  
  // Show last 6 months including current month
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    labels.push(months[monthIndex]);
  }
  
  return labels;
};

const getMonthlyData = (orders: PurchaseOrder[]) => {
  const currentDate = new Date();
  const monthlyData = [];
  
  // Calculate for last 6 months
  for (let i = 5; i >= 0; i--) {
    const targetMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthOrders = orders.filter(order => {
      if (!order.orderDate) return false;
      const orderDate = new Date(order.orderDate);
      return orderDate.getMonth() === targetMonth.getMonth() && 
             orderDate.getFullYear() === targetMonth.getFullYear();
    });
    
    const monthTotal = monthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    monthlyData.push(monthTotal);
  }
  
  return monthlyData;
};

const getPaymentStatusData = (orders: PurchaseOrder[]) => {
  return [
    orders.filter(o => o.paymentStatus === 'PENDING').length,
    orders.filter(o => o.paymentStatus === 'PARTIAL').length,
    orders.filter(o => o.paymentStatus === 'PAID').length,
  ];
};

const PurchaseOrdersTab = () => {
  const dispatch = useAppDispatch();
  const orders = useSelector(selectAllOrders);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<PurchaseOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 10;

  // Estados para filtros y ordenamiento
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  // const [showMobileActions, setShowMobileActions] = useState(false);

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${order.firstName} ${order.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      const matchesPaymentStatus = filterPaymentStatus === 'all' || order.paymentStatus === filterPaymentStatus;

      return matchesSearch && matchesStatus && matchesPaymentStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.orderDate || '').getTime() - new Date(b.orderDate || '').getTime();
          break;
        case 'orderNumber':
          comparison = a.orderNumber.localeCompare(b.orderNumber);
          break;
        case 'customer':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'total':
          comparison = (a.totalAmount || 0) - (b.totalAmount || 0);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
  const totalAmount = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const averageOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;
  const documentsUploaded = orders.reduce((sum, order) => sum + (order.documents?.length || 0), 0);
  const paidOrders = orders.filter(order => order.paymentStatus === 'PAID').length;
  const totalItems = orders.reduce((sum, order) => sum + (order.items?.length || 0), 0);

  const handleViewDetails = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  // Función para eliminar orden
  const handleDelete = (order: PurchaseOrder) => {
    setOrderToDelete(order);
    setIsDeleteDialogOpen(true);
  };

  // Función para confirmar eliminación
  const handleConfirmDelete = async () => {
    if (orderToDelete) {
      try {
        await dispatch(deleteOrderAsync(orderToDelete.id));
        console.log('Orden eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar la orden:', error);
      } finally {
        setIsDeleteDialogOpen(false);
        setOrderToDelete(null);
      }
    }
  };

  // Función para cancelar eliminación
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  // Función para exportar datos
  const handleExport = () => {
    const csvData = filteredOrders.map(order => ({
      'Número de Orden': order.orderNumber,
      'Cliente': `${order.firstName} ${order.lastName}`,
      'Email': order.email,
      'Teléfono': order.phone,
      'Fecha': order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '',
      'Estado': getStatusText(order.status),
      'Estado de Pago': getPaymentStatusText(order.paymentStatus),
      'Total': `₡${order.totalAmount?.toLocaleString() || '0'}`,
      'Fecha de Entrega': order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : '',
      'Notas': order.notes || ''
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ordenes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para alternar orden
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilterStatus('all');
    setFilterPaymentStatus('all');
    setSearchQuery('');
    setSortBy('date');
    setSortOrder('desc');
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <>
      <div className="flex flex-col space-y-6 p-2 sm:p-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-900">
              Órdenes de Compra
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona y supervisa todas las órdenes de compra
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDashboard(!showDashboard)}
              className="border-primary-200 hover:bg-primary-50"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {showDashboard ? 'Ocultar Dashboard' : 'Información'}
              {showDashboard ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>
            <Button
              onClick={() => setIsNewOrderModalOpen(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Orden
            </Button>
          </div>
        </div>

        {/* Dashboard Section - Collapsible */}
        {showDashboard && (
          <div className="space-y-6">
            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
              <Card className="border-primary-200 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-primary-700">
                    Total de Órdenes
                  </CardTitle>
                  <div className="bg-primary-100 p-2 rounded-full">
                    <Package className="h-4 w-4 text-primary-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary-900">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalOrders > 0 ? 'Órdenes registradas' : 'No hay órdenes'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary-200 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-primary-700">
                    Órdenes Pendientes
                  </CardTitle>
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary-900">{pendingOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalOrders > 0 ? `${((pendingOrders / totalOrders) * 100).toFixed(1)}% del total` : 'No hay órdenes pendientes'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary-200 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-primary-700">
                    Órdenes Pagadas
                  </CardTitle>
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary-900">{paidOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalOrders > 0 ? `${((paidOrders / totalOrders) * 100).toFixed(1)}% del total` : 'No hay órdenes pagadas'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary-200 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-primary-700">
                    Total Gastado
                  </CardTitle>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary-900">
                    ₡{totalAmount.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Suma total de órdenes
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary-200 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-primary-700">
                    Promedio por Orden
                  </CardTitle>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <FileText className="h-4 w-4 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary-900">
                    ₡{Math.round(averageOrderValue).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valor promedio por orden
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary-200 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-primary-700">
                    Comprobantes
                  </CardTitle>
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <FileText className="h-4 w-4 text-indigo-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary-900">{documentsUploaded}</div>
                  <p className="text-xs text-muted-foreground">
                    Documentos subidos
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <Card className="border-primary-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary-900">
                    Estado de Órdenes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Doughnut
                      data={{
                        labels: ['Pendiente', 'Completada', 'Enviada', 'Entregada', 'Cancelada'],
                        datasets: [{
                          data: [
                            orders.filter(o => o.status === 'PENDING').length,
                            orders.filter(o => o.status === 'APPROVED').length,
                            orders.filter(o => o.status === 'SHIPPED').length,
                            orders.filter(o => o.status === 'DELIVERED').length,
                            orders.filter(o => o.status === 'CANCELLED').length,
                          ],
                          backgroundColor: [
                            '#FEF3C7', // Pastel Yellow for Pending
                            '#DBEAFE', // Pastel Blue for Approved
                            '#E0E7FF', // Pastel Purple for Shipped
                            '#D1FAE5', // Pastel Green for Delivered
                            '#FEE2E2', // Pastel Red for Cancelled
                          ],
                          borderColor: [
                            '#F59E0B', // Yellow border
                            '#3B82F6', // Blue border
                            '#8B5CF6', // Purple border
                            '#10B981', // Green border
                            '#EF4444', // Red border
                          ],
                          borderWidth: 1,
                        }],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              padding: 20,
                              font: {
                                size: 12
                              }
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                              }
                            }
                          }
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary-900">
                    Estado de Pagos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Doughnut
                      data={{
                        labels: ['Pendiente', 'Parcial', 'Pagado'],
                        datasets: [{
                          data: getPaymentStatusData(orders),
                          backgroundColor: [
                            '#FEF3C7', // Pastel Yellow for Pending
                            '#FBBF24', // Pastel Orange for Partial
                            '#D1FAE5', // Pastel Green for Paid
                          ],
                          borderColor: [
                            '#F59E0B', // Yellow border
                            '#F97316', // Orange border
                            '#10B981', // Green border
                          ],
                          borderWidth: 1,
                        }],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              padding: 20,
                              font: {
                                size: 12
                              }
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                              }
                            }
                          }
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary-900">
                    Órdenes por Mes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Bar
                      data={{
                        labels: getMonthlyLabels(),
                        datasets: [{
                          label: 'Monto de Órdenes',
                          data: getMonthlyData(orders),
                          backgroundColor: '#C7D2FE', // Pastel Blue
                          borderColor: '#6366F1', // Indigo border
                          borderWidth: 1,
                          borderRadius: 4,
                        }],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return `Total: ₡${context.parsed.y.toLocaleString()}`;
                              }
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: 'hsl(var(--border))',
                            },
                            ticks: {
                              color: 'hsl(var(--muted-foreground))',
                              callback: function(value) {
                                return `₡${Number(value).toLocaleString()}`;
                              }
                            }
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                            ticks: {
                              color: 'hsl(var(--muted-foreground))',
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Análisis con IA */}
            <AIInsights data={orders} type="orders" />
          </div>
        )}

        {/* Barra de búsqueda y filtros */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número de orden, cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-primary-200 focus:border-primary-500"
              />
            </div>
            <div className="flex gap-2">
              {/* Filtro por Estado */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-primary-200 hover:bg-primary-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                    {(filterStatus !== 'all' || filterPaymentStatus !== 'all') && (
                      <div className="ml-2 bg-primary-600 text-white rounded-full w-2 h-2" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Estado de Orden</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    Todos los estados
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('PENDING')}>
                    Pendientes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('APPROVED')}>
                    Aprobadas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('SHIPPED')}>
                    Enviadas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('DELIVERED')}>
                    Entregadas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('CANCELLED')}>
                    Canceladas
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Estado de Pago</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setFilterPaymentStatus('all')}>
                    Todos los pagos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterPaymentStatus('PENDING')}>
                    Pendientes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterPaymentStatus('PARTIAL')}>
                    Parciales
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterPaymentStatus('PAID')}>
                    Pagados
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters}>
                    Limpiar filtros
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Ordenamiento */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-primary-200 hover:bg-primary-50">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Ordenar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => toggleSort('date')}>
                    Fecha {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSort('orderNumber')}>
                    Número de Orden {sortBy === 'orderNumber' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSort('customer')}>
                    Cliente {sortBy === 'customer' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSort('total')}>
                    Total {sortBy === 'total' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSort('status')}>
                    Estado {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Exportar */}
              <Button
                variant="outline"
                className="border-primary-200 hover:bg-primary-50"
                onClick={handleExport}
                disabled={filteredOrders.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Indicadores de filtros activos */}
          {(filterStatus !== 'all' || filterPaymentStatus !== 'all' || searchQuery) && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Filtros activos:</span>
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Búsqueda: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterStatus !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Estado: {getStatusText(filterStatus)}
                  <button
                    onClick={() => setFilterStatus('all')}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterPaymentStatus !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Pago: {getPaymentStatusText(filterPaymentStatus)}
                  <button
                    onClick={() => setFilterPaymentStatus('all')}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs h-6 px-2"
              >
                Limpiar todo
              </Button>
            </div>
          )}
        </div>

        {/* Tabla de órdenes con shadcn/ui */}
        <Card className="border-primary-200">
          <CardHeader className="flex flex-row items-center justify-between">

          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-primary-100 hover:bg-primary-50/50">
                  <TableHead className="text-primary-700 font-medium">Orden</TableHead>
                  <TableHead className="text-primary-700 font-medium">Cliente</TableHead>
                  <TableHead className="text-primary-700 font-medium">Fecha</TableHead>
                  <TableHead className="text-primary-700 font-medium">Estado</TableHead>
                  <TableHead className="text-primary-700 font-medium">Pago</TableHead>
                  <TableHead className="text-primary-700 font-medium">Total</TableHead>
                  <TableHead className="text-primary-700 font-medium">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order.id} className="border-primary-100 hover:bg-primary-50/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary-100 p-2 rounded-lg">
                          <Package className="h-4 w-4 text-primary-600" />
                        </div>
                        <span className="font-medium text-primary-900">{order.orderNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-primary-800">
                      {order.firstName} {order.lastName}
                    </TableCell>
                    <TableCell className="text-primary-700">
                      {order.orderDate ? format(new Date(order.orderDate), 'dd/MM/yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`font-medium border ${getStatusColor(order.status)}`}
                      >
                        <StatusIcon status={order.status} />
                        <span className="ml-1">{getStatusText(order.status)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}
                      >
                        {getPaymentStatusText(order.paymentStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-primary-900">
                      ₡{order.totalAmount?.toLocaleString() || '0'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(order)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <Separator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(order)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-10">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-primary-900">No hay órdenes</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Comienza creando una nueva orden de compra.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setIsNewOrderModalOpen(true)} className="bg-primary-600 hover:bg-primary-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Orden
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between items-center p-4 border-t">
            <span className="text-sm text-muted-foreground">
              Mostrando {filteredOrders.length} de {orders.length} órdenes
            </span>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
          </CardFooter>
        </Card>

        {/* Controles de paginación con estilo moderno */}
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded-full border border-primary-200 bg-white text-primary-600 hover:bg-primary-50 transition ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Primera página"
          >
            «
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded-full border border-primary-200 bg-white text-primary-600 hover:bg-primary-50 transition ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Anterior"
          >
            ‹
          </button>
          {/* Números de página */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-full border transition font-semibold text-sm ${
                page === currentPage
                  ? 'bg-primary-600 text-white border-primary-600 shadow'
                  : 'bg-white text-primary-700 border-primary-200 hover:bg-primary-50'
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded-full border border-primary-200 bg-white text-primary-600 hover:bg-primary-50 transition ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Siguiente"
          >
            ›
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded-full border border-primary-200 bg-white text-primary-600 hover:bg-primary-50 transition ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Última página"
          >
            »
          </button>
        </div>
      </div>
      {/* Modales */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedOrder(null);
            }}
          />
        )}

      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && selectedOrder && (
          <EditOrderModal
            order={selectedOrder}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNewOrderModalOpen && (
          <NewOrderModal
            onClose={() => setIsNewOrderModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Modal de confirmación para eliminar */}
      <AnimatePresence>
        {isDeleteDialogOpen && orderToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={handleCancelDelete}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Confirmar Eliminación
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Esta acción no se puede deshacer
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  ¿Estás seguro de que deseas eliminar la orden{' '}
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    {orderToDelete.orderNumber}
                  </span>
                  ?
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Cliente: {orderToDelete.firstName} {orderToDelete.lastName}
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleCancelDelete}
                  className="border-gray-300 dark:border-gray-600"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>

  );
};

// Helper Components
const StatusIcon = ({ status }: { status: PurchaseOrder['status'] }) => {
  switch (status) {
    case 'PENDING':
      return <Clock className="h-3 w-3 text-yellow-500" />;
    case 'APPROVED':
      return <CheckCircle2 className="h-3 w-3 text-blue-500" />;
    case 'SHIPPED':
      return <Truck className="h-3 w-3 text-purple-500" />;
    case 'DELIVERED':
      return <CheckCircle2 className="h-3 w-3 text-green-500" />;
    case 'CANCELLED':
      return <XCircle className="h-3 w-3 text-red-500" />;
    default:
      return <AlertCircle className="h-3 w-3 text-gray-500" />;
  }
};

// Helper Functions
const getStatusColor = (status: PurchaseOrder['status']) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'APPROVED':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'SHIPPED':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPaymentStatusColor = (status: PurchaseOrder['paymentStatus']) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'PARTIAL':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'PAID':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    PENDING: 'Pendiente',
    APPROVED: 'Completa',
    SHIPPED: 'Enviada',
    DELIVERED: 'Entregada',
    CANCELLED: 'Cancelada'
  };
  return statusMap[status] || status;
};

const getPaymentStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    PENDING: 'Pendiente',
    PARTIAL: 'Parcial',
    PAID: 'Pagado'
  };
  return statusMap[status] || status;
};

export default PurchaseOrdersTab;