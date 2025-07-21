import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Eye,
  Edit,
  Trash2,
  Package,
  Calendar,
  User,
  Phone,
  Mail,
  DollarSign,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import type { PurchaseOrder } from '@/types';

interface OrderListViewProps {
  orders: PurchaseOrder[];
  searchQuery: string;
  onViewDetails: (order: PurchaseOrder) => void;
  onEdit: (order: PurchaseOrder) => void;
  onDelete: (orderId: string) => void;
  onViewDocument?: (document: any) => void;
  onDownloadDocument?: (document: any) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const OrderListView: React.FC<OrderListViewProps> = ({
  orders,
  searchQuery,
  onViewDetails,
  onEdit,
  onDelete,
  onViewDocument,
  onDownloadDocument,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  // Configuración de estados con escala de colores consistente con bodegas
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <Clock className="h-3 w-3" />,
          label: 'Pendiente',
          priority: 'medium'
        };
      case 'confirmed':
        return {
          color: 'bg-primary-100 text-primary-800 border-primary-200',
          icon: <CheckCircle className="h-3 w-3" />,
          label: 'Confirmada',
          priority: 'high'
        };
      case 'processing':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Package className="h-3 w-3" />,
          label: 'Procesando',
          priority: 'high'
        };
      case 'shipped':
      case 'in_transit':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: <Truck className="h-3 w-3" />,
          label: 'En Tránsito',
          priority: 'high'
        };
      case 'delivered':
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <CheckCircle className="h-3 w-3" />,
          label: 'Entregada',
          priority: 'low'
        };
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="h-3 w-3" />,
          label: 'Completada',
          priority: 'low'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="h-3 w-3" />,
          label: 'Cancelada',
          priority: 'low'
        };
      case 'failed':
        return {
          color: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: <XCircle className="h-3 w-3" />,
          label: 'Fallida',
          priority: 'high'
        };
      case 'returned':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: <Package className="h-3 w-3" />,
          label: 'Devuelta',
          priority: 'medium'
        };
      case 'refunded':
        return {
          color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
          icon: <DollarSign className="h-3 w-3" />,
          label: 'Reembolsada',
          priority: 'medium'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="h-3 w-3" />,
          label: status,
          priority: 'medium'
        };
    }
  };

  // Función para obtener colores según la prioridad del monto
  const getAmountColor = (amount: number) => {
    if (amount >= 1000) {
      return 'text-primary-900 font-bold'; // Alto valor - primary oscuro
    } else if (amount >= 500) {
      return 'text-primary-700 font-semibold'; // Valor medio - primary
    } else if (amount >= 100) {
      return 'text-primary-600 font-medium'; // Valor normal - primary claro
    } else {
      return 'text-gray-600'; // Valor bajo - gris
    }
  };

  // Función para obtener colores según la antigüedad de la orden
  const getDateColor = (orderDate: string | Date) => {
    const now = new Date();
    const orderDateTime = typeof orderDate === 'string' ? new Date(orderDate) : orderDate;
    const diffInDays = Math.floor((now.getTime() - orderDateTime.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'text-green-600 font-medium'; // Hoy - verde
    } else if (diffInDays <= 3) {
      return 'text-primary-600'; // Reciente - primary
    } else if (diffInDays <= 7) {
      return 'text-primary-500'; // Esta semana - primary claro
    } else if (diffInDays <= 30) {
      return 'text-gray-600'; // Este mes - gris
    } else {
      return 'text-gray-400'; // Más antiguo - gris claro
    }
  };

  // Filtrar órdenes
  const filteredOrders = orders.filter(order =>
    order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Componente para información del cliente con colores consistentes
  const CustomerInfo = ({ order }: { order: PurchaseOrder }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-primary-600 flex-shrink-0" />
        <span className="font-medium text-primary-900 truncate">
          {order.firstName} {order.lastName}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-primary-600 flex-shrink-0" />
        <span className="text-sm text-primary-700 truncate">{order.email}</span>
      </div>
      {order.phone && (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary-600 flex-shrink-0" />
          <span className="text-sm text-primary-700">{order.phone}</span>
        </div>
      )}
    </div>
  );

  // Componente para información del pedido con colores dinámicos consistentes
  const OrderInfo = ({ order }: { order: PurchaseOrder }) => {
    const amount = order.totalAmount || 0;
    const amountColorClass = getAmountColor(amount);

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className={`h-4 w-4 ${amount >= 1000 ? 'text-primary-600' : amount >= 500 ? 'text-primary-500' : 'text-gray-500'}`} />
          <span className={`${amountColorClass} transition-colors`}>
            ${amount.toFixed(2)}
          </span>
        </div>
        <div className="text-xs text-primary-600 capitalize bg-primary-50 px-2 py-1 rounded-md border border-primary-200">
          {order.paymentMethod || 'No especificado'}
        </div>
      </div>
    );
  };

  // Componente para documentos con colores consistentes
  const DocumentsSection = ({ order }: { order: PurchaseOrder }) => {
    if (!order.documents || order.documents.length === 0) return null;

    return (
      <div className="border-t border-primary-100 pt-3">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-3 w-3 text-primary-600" />
          <span className="text-xs font-medium text-primary-700">
            {order.documents.length} documento{order.documents.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {order.documents.slice(0, 2).map((doc: any, index: number) => (
            <div key={index} className="flex items-center gap-1 bg-primary-50 rounded-md px-2 py-1 border border-primary-200">
              <span className="text-xs text-primary-700 truncate max-w-[60px]">
                {doc.name || `Doc ${index + 1}`}
              </span>
              <div className="flex gap-1">
                {onViewDocument && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDocument(doc);
                    }}
                    className="text-primary-500 hover:text-primary-700 transition-colors"
                    title="Ver documento"
                  >
                    <Eye className="h-3 w-3" />
                  </button>
                )}
                {onDownloadDocument && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadDocument(doc);
                    }}
                    className="text-primary-500 hover:text-green-600 transition-colors"
                    title="Descargar documento"
                  >
                    <Download className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {order.documents.length > 2 && (
            <span className="text-xs text-primary-600 px-2 py-1 bg-primary-50 rounded-md border border-primary-200">
              +{order.documents.length - 2}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Componente para acciones con colores consistentes
  const OrderActions = ({ order }: { order: PurchaseOrder }) => (
    <div className="flex gap-2 pt-3 border-t border-primary-100">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails(order);
        }}
        className="flex-1 h-8 text-primary-600 hover:bg-primary-50"
      >
        <Eye className="h-3 w-3 mr-1" />
        Ver
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(order);
        }}
        className="flex-1 h-8 text-primary-600 hover:bg-primary-50"
      >
        <Edit className="h-3 w-3 mr-1" />
        Editar
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(order.id);
        }}
        className="h-8 px-3 text-red-600 hover:bg-red-50"
        title="Eliminar orden"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );

  // Estado vacío con colores consistentes
  if (filteredOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <Package className="h-10 w-10 text-primary-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-primary-900 mb-2">
          {searchQuery ? 'No se encontraron órdenes' : 'No hay órdenes registradas'}
        </h3>
        <p className="text-primary-700 text-center max-w-md">
          {searchQuery
            ? 'Intenta con otros términos de búsqueda o verifica los filtros aplicados'
            : 'Cuando tengas órdenes, aparecerán aquí organizadas y fáciles de gestionar'
          }
        </p>
      </div>
    );
  }

  return (
    
      <div className="space-y-6">
        {/* Grid de órdenes */}
        {/* Ajusta la altura según necesites */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <Card className={`h-full hover:shadow-lg transition-all duration-200 cursor-pointer group border-primary-200 hover:border-primary-300 ${statusConfig.priority === 'high' ? 'ring-1 ring-primary-100' : ''}`}>
                  <CardHeader className="pb-3 space-y-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base font-semibold text-primary-900 group-hover:text-primary-700 truncate">
                          #{order.orderNumber}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-primary-500" />
                          <span className={`text-xs transition-colors ${getDateColor(order.orderDate)}`}>
                            {format(new Date(order.orderDate), 'dd/MM/yyyy')}
                          </span>
                        </div>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs border ${statusConfig.color} shrink-0 ml-2`}>
                        <span className="flex items-center gap-1">
                          {statusConfig.icon}
                          <span className="font-medium">{statusConfig.label}</span>
                        </span>
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Información del cliente */}
                    <CustomerInfo order={order} />

                    {/* Información del pedido con barra de valor */}
                    <div className="border-t border-primary-100 pt-3">
                      <OrderInfo order={order} />

                      {/* Barra de progreso del valor de la orden */}
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-primary-600 mb-1">
                          <span>Valor de la orden</span>
                          <span>{order.totalAmount >= 1000 ? 'Alto' : order.totalAmount >= 500 ? 'Medio' : 'Básico'}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`rounded-full h-1.5 transition-all duration-300 ${order.totalAmount >= 1000 ? 'bg-primary-600' :
                              order.totalAmount >= 500 ? 'bg-primary-500' :
                                'bg-gray-400'
                              }`}
                            style={{
                              width: `${Math.min(100, Math.max(10, (order.totalAmount / 1000) * 100))}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Documentos */}
                    <DocumentsSection order={order} />

                    {/* Acciones */}
                    <OrderActions order={order} />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        {/* Paginación con colores consistentes */}
        {totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-center gap-3 pt-6 border-t border-primary-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 px-3 text-primary-600 hover:text-primary-900 disabled:opacity-50 border-primary-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className={`h-8 w-8 p-0 ${currentPage === pageNum
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'text-primary-600 hover:text-primary-900 border-primary-200'
                      }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 px-3 text-primary-600 hover:text-primary-900 disabled:opacity-50 border-primary-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="ml-4 text-sm text-primary-700 font-medium">
              Página {currentPage} de {totalPages}
            </div>
          </div>
        )}
      </div>
  );
};

export default OrderListView;
