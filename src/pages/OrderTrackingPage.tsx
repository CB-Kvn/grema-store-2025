/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Package, Search, Truck, 
  CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp 
} from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { selectAllOrders } from '@/store/slices/purchaseOrdersSlice';
import { purchaseOrderService } from '@/services';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

const OrderTrackingPage = () => {
  const orders = useSelector(selectAllOrders);
  const [orderNumber, setOrderNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  // Breadcrumbs para tracking
  const breadcrumbItems = [
    { name: 'Inicio', url: '/' },
    { name: 'Seguimiento', url: '/seguimiento', isActive: true }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const order = await purchaseOrderService.getById(orderNumber)
    if (order) {
      setSearchedOrder(order);
      setError('');
      setShowDetails(true);
    } else {
      setSearchedOrder(null);
      setError('No se encontró la orden. Por favor, verifica el número.');
    }
  };

  // const getStatusIcon = (status: string) => {
  //   switch (status) {
  //     case 'pending':
  //       return <Clock className="h-6 w-6 text-yellow-500" />;
  //     case 'approved':
  //       return <CheckCircle2 className="h-6 w-6 text-blue-500" />;
  //     case 'shipped':
  //       return <Truck className="h-6 w-6 text-purple-500" />;
  //     case 'delivered':
  //       return <CheckCircle2 className="h-6 w-6 text-green-500" />;
  //     case 'cancelled':
  //       return <XCircle className="h-6 w-6 text-red-500" />;
  //     default:
  //       return <AlertTriangle className="h-6 w-6 text-gray-500" />;
  //   }
  // };

  const getStatusColor = (status: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-25 via-white to-primary-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-100/30 to-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary-100/30 to-primary-200/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 py-12">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        </div>
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
              <Package className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary-900 mb-3">
              Seguimiento de Orden
            </h1>
            <p className="text-primary-600 text-lg">
              Ingresa tu número de orden para ver el estado de tu pedido
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/50 p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                <Input
                  type="text"
                  placeholder="Ingresa el número de orden (ej: PO-2024-001)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg border-primary-200 focus:border-primary-400 focus:ring-primary-400/20 rounded-xl bg-white/70 backdrop-blur-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar Orden
                </span>
              </button>
            </form>
        </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 mb-8 shadow-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Order Details */}
          {searchedOrder && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/50 overflow-hidden">
              {/* Order Summary */}
              <div className="p-8 border-b border-primary-100/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-medium text-primary-900">
                    Orden #{searchedOrder.orderNumber}
                  </h2>
                  <p className="text-primary-600">
                    Fecha: {format(new Date(searchedOrder.orderDate), 'dd/MM/yyyy')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(searchedOrder.status)}`}>
                  {getStatusText(searchedOrder.status)}
                </span>
              </div>

              {/* Progress Timeline */}
              <div className="relative">
                <div className="absolute left-0 top-0 h-full w-px bg-primary-200" />
                <div className="space-y-8 relative">
                  {/* Order Placed */}
                  <div className="flex items-center">
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center">
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="ml-12">
                      <h3 className="text-primary-900 font-medium">Orden Recibida</h3>
                      <p className="text-sm text-primary-600">
                        {format(new Date(searchedOrder.orderDate), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                  </div>

                  {/* Order Approved */}
                  {searchedOrder.status !== 'pending' && searchedOrder.status !== 'cancelled' && (
                    <div className="flex items-center">
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="ml-12">
                        <h3 className="text-primary-900 font-medium">Orden Aprobada</h3>
                        <p className="text-sm text-primary-600">
                          Procesando para envío
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Shipping */}
                  {(searchedOrder.status === 'shipped' || searchedOrder.status === 'delivered') && (
                    <div className="flex items-center">
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                        <Truck className="h-4 w-4" />
                      </div>
                      <div className="ml-12">
                        <h3 className="text-primary-900 font-medium">En Tránsito</h3>
                        {searchedOrder.trackingNumber && (
                          <p className="text-sm text-primary-600">
                            Número de Rastreo: {searchedOrder.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Delivered */}
                  {searchedOrder.status === 'delivered' && (
                    <div className="flex items-center">
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="ml-12">
                        <h3 className="text-primary-900 font-medium">Entregado</h3>
                        <p className="text-sm text-primary-600">
                          {format(new Date(searchedOrder.actualDeliveryDate), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Cancelled */}
                  {searchedOrder.status === 'cancelled' && (
                    <div className="flex items-center">
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center">
                        <XCircle className="h-4 w-4" />
                      </div>
                      <div className="ml-12">
                        <h3 className="text-primary-900 font-medium">Orden Cancelada</h3>
                        {searchedOrder.notes && (
                          <p className="text-sm text-primary-600">{searchedOrder.notes}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

              {/* Order Details Toggle */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full p-6 flex items-center justify-between text-primary-600 hover:bg-primary-50/50 transition-all duration-300 border-t border-primary-100/50"
              >
                <span className="font-semibold text-lg">Detalles de la Orden</span>
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center transition-transform duration-300">
                  {showDetails ? (
                    <ChevronUp className="h-5 w-5 transform rotate-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 transform rotate-0" />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              {showDetails && (
                <div className="p-8 border-t border-primary-100/50 bg-gradient-to-br from-primary-25/50 to-white">
                {/* Items */}
                <div className="space-y-4">
                  <h3 className="font-medium text-primary-900">Productos</h3>
                  {searchedOrder.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b border-primary-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-primary-600">{item.product.name}</p>
                        <p className="text-sm text-primary-600">
                          Cantidad: {item.quantity} × ${item.unitPrice.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-medium text-primary-900">
                        ${item.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-6 pt-6 border-t border-primary-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-primary-600">Subtotal</span>
                    <span className="font-medium">${searchedOrder.subtotalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-primary-600">Envío</span>
                    <span className="font-medium">${searchedOrder.shippingAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium">
                    <span className="text-primary-900">Total</span>
                    <span className="text-primary-900">${searchedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Shipping Information */}
                {searchedOrder.trackingNumber && (
                  <div className="mt-6 pt-6 border-t border-primary-100">
                    <h3 className="font-medium text-primary-900 mb-4">Información de Envío</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-primary-600">Método de Envío</p>
                      </div>
                      {searchedOrder.trackingNumber && (
                        <div>
                          <p className="text-sm text-primary-600">Número de Rastreo</p>
                          <p className="font-medium">{searchedOrder.trackingNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;