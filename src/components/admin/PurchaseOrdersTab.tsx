import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Package, Search, Filter, Plus, ArrowUpDown, Download, 
  Truck, DollarSign, FileText, 
   Edit, Trash2, Eye,
  CheckCircle2, XCircle, Clock, AlertCircle
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
import type { PurchaseOrder } from '@/types';
import { selectAllOrders } from '@/store/slices/purchaseOrdersSlice';
import OrderDetailsModal from './OrderDetailsModal';
import EditOrderModal from './EditOrderModal';
import NewOrderModal from './NewOrderModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const PurchaseOrdersTab = () => {
  const orders = useSelector(selectAllOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  // const [showMobileActions, setShowMobileActions] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;

  const handleViewDetails = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Órdenes"
          value={totalOrders.toString()}
          icon={<Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
        />
        <StatCard
          title="Órdenes Pendientes"
          value={pendingOrders.toString()}
          icon={<Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
        />
        <StatCard
          title="Total Gastado"
          value={`$${totalAmount.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
        />
        <StatCard
          title="Promedio por Orden"
          value={`$${averageOrderValue.toLocaleString()}`}
          icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-primary-100">
          <h3 className="text-base sm:text-lg font-semibold text-primary-900 mb-4">
            Estado de Órdenes
          </h3>
          <div className="h-48 sm:h-64">
            <Doughnut
              data={{
                labels: ['Pendiente', 'Aprobado', 'Enviado', 'Entregado', 'Cancelado'],
                datasets: [{
                  data: [
                    orders.filter(o => o.status === 'pending').length,
                    orders.filter(o => o.status === 'approved').length,
                    orders.filter(o => o.status === 'shipped').length,
                    orders.filter(o => o.status === 'delivered').length,
                    orders.filter(o => o.status === 'cancelled').length,
                  ],
                  backgroundColor: ['#FCD34D', '#60A5FA', '#C084FC', '#34D399', '#F87171'],
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      font: {
                        size: window.innerWidth < 768 ? 10 : 12
                      }
                    }
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-primary-100">
          <h3 className="text-base sm:text-lg font-semibold text-primary-900 mb-4">
            Órdenes por Mes
          </h3>
          <div className="h-48 sm:h-64">
            <Bar
              data={{
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                  label: 'Monto de Órdenes',
                  data: [12000, 19000, 15000, 25000, 22000, 30000],
                  backgroundColor: '#60A5FA',
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    ticks: {
                      font: {
                        size: window.innerWidth < 768 ? 10 : 12
                      }
                    }
                  },
                  x: {
                    ticks: {
                      font: {
                        size: window.innerWidth < 768 ? 10 : 12
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
            <Input
              type="text"
              placeholder="Buscar por número de orden o proveedor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Primary Action - Always Visible */}
          <button 
            onClick={() => setIsNewOrderModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>Nueva Orden</span>
          </button>
          
          {/* Secondary Actions - Hidden on Mobile */}
          <div className="hidden sm:flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 bg-white border border-primary-200 rounded-lg hover:bg-primary-50">
              <Filter className="h-5 w-5 text-primary-600 mr-2" />
              <span>Filtrar</span>
            </button>
            <button className="flex items-center px-3 py-2 bg-white border border-primary-200 rounded-lg hover:bg-primary-50">
              <ArrowUpDown className="h-5 w-5 text-primary-600 mr-2" />
              <span>Ordenar</span>
            </button>
            <button className="flex items-center px-3 py-2 bg-white border border-primary-200 rounded-lg hover:bg-primary-50">
              <Download className="h-5 w-5 text-primary-600 mr-2" />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-50">
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Orden</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Proveedor</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Fecha</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Estado</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Pago</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Total</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-primary-100">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-primary-600" />
                    <span className="text-sm sm:text-base font-medium">{order.orderNumber}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm sm:text-base">{order.supplier}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm sm:text-base">
                    {format(new Date(order.orderDate), 'dd/MM/yyyy')}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <StatusIcon status={order.status} />
                    <span className={`px-2 py-1 rounded-full text-xs sm:text-sm ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs sm:text-sm ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {getPaymentStatusText(order.paymentStatus)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm sm:text-base font-medium">${order.totalAmount.toLocaleString()}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button 
                      onClick={() => handleViewDetails(order)}
                      className="p-1 hover:bg-primary-50 rounded"
                      title="Ver Detalles"
                    >
                      <Eye className="h-4 w-4 text-primary-600" />
                    </button>
                    <button 
                      onClick={() => handleEdit(order)}
                      className="p-1 hover:bg-primary-50 rounded"
                      title="Editar Orden"
                    >
                      <Edit className="h-4 w-4 text-primary-600" />
                    </button>
                    <button 
                      className="p-1 hover:bg-primary-50 rounded"
                      title="Eliminar Orden"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isDetailsModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {isEditModalOpen && selectedOrder && (
        <EditOrderModal
          order={selectedOrder}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {isNewOrderModalOpen && (
        <NewOrderModal
          onClose={() => setIsNewOrderModalOpen(false)}
        />
      )}
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-primary-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-primary-600">{title}</p>
        <p className="text-lg sm:text-2xl font-bold text-primary-900">{value}</p>
      </div>
      <div className="bg-primary-100 p-2 sm:p-3 rounded-full">
        {icon}
      </div>
    </div>
  </div>
);

const StatusIcon = ({ status }: { status: PurchaseOrder['status'] }) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'approved':
      return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
    case 'shipped':
      return <Truck className="h-4 w-4 text-purple-500" />;
    case 'delivered':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

// Helper Functions
const getStatusColor = (status: PurchaseOrder['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusColor = (status: PurchaseOrder['paymentStatus']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'partial':
      return 'bg-blue-100 text-blue-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    shipped: 'En Tránsito',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  };
  return statusMap[status] || status;
};

const getPaymentStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: 'Pendiente',
    partial: 'Parcial',
    paid: 'Pagado'
  };
  return statusMap[status] || status;
};

export default PurchaseOrdersTab;