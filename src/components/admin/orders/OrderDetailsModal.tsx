import React from 'react';
import { X, Truck, Calendar, DollarSign, FileText, User, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import type { PurchaseOrder } from '@/types';

interface OrderDetailsModalProps {
  order: PurchaseOrder;
  onClose: () => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  partial: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
};

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: 'Pendiente',
    approved: 'Aprobada',
    shipped: 'Enviada',
    delivered: 'Entregada',
    cancelled: 'Cancelada'
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

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-primary-100 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary-900">
            Detalles de la Orden
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-50 rounded-full"
          >
            <X className="h-5 w-5 text-primary-600" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Order Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-primary-900">
                  Orden: {order.orderNumber}
                </h3>
                <p className="text-primary-600">
                  {order.firstName} {order.lastName}
                </p>
                <div className="flex items-center gap-2 text-primary-600 text-sm mt-1">
                  <Mail className="h-4 w-4" /> {order.email}
                  <Phone className="h-4 w-4 ml-4" /> {order.phone}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status?.toLowerCase() || 'pending']}`}>
                {getStatusText(order.status?.toLowerCase() || '')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-primary-600">Fecha de Orden</p>
                  <p className="font-medium">{order.orderDate ? format(new Date(order.orderDate), 'dd/MM/yyyy') : '-'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-primary-600">Entrega Estimada</p>
                  <p className="font-medium">{order.expectedDeliveryDate ? format(new Date(order.expectedDeliveryDate), 'dd/MM/yyyy') : '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping & Billing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-base font-semibold text-primary-900 mb-1">Envío</h4>
              <div className="bg-primary-50 p-3 rounded text-sm text-primary-700">
                {order.dataShipping}
              </div>
            </div>
            <div>
              <h4 className="text-base font-semibold text-primary-900 mb-1">Facturación</h4>
              <div className="bg-primary-50 p-3 rounded text-sm text-primary-700">
                {order.dataBilling}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="text-lg font-medium text-primary-900 mb-4">Productos</h4>
            <div className="space-y-4">
              {order.items && order.items.length > 0 ? order.items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-primary-50 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-primary-900">
                        {item.product?.name || 'Producto'}
                      </h5>
                      <p className="text-sm text-primary-600">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-primary-900">
                      ₡{(item.totalPrice || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-primary-500">No hay productos en esta orden.</div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h4 className="text-lg font-medium text-primary-900 mb-4">Información de Pago</h4>
            <div className="bg-primary-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary-600" />
                  <span className="text-primary-900">Total</span>
                </div>
                <span className="font-medium text-primary-900">
                  ₡{order.totalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary-900">Método de Pago</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary-900">Estado de Pago</span>
                <span className={`px-2 py-1 rounded-full text-sm ${paymentStatusColors[order.paymentStatus?.toLowerCase() || 'pending']}`}>
                  {getPaymentStatusText(order.paymentStatus?.toLowerCase() || '')}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {order.trackingNumber && (
            <div>
              <h4 className="text-lg font-medium text-primary-900 mb-4">Información de Envío</h4>
              <div className="bg-primary-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-primary-900">Número de Rastreo</span>
                  <span>{order.trackingNumber}</span>
                </div>
                {order.actualDeliveryDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-primary-900">Fecha de Entrega</span>
                    <span>{format(new Date(order.actualDeliveryDate), 'dd/MM/yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div>
              <h4 className="text-lg font-medium text-primary-900 mb-4">Notas</h4>
              <div className="bg-primary-50 p-4 rounded-lg">
                <p className="text-primary-600">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Documents */}
          {order.documents && order.documents.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-primary-900 mb-4">Documentos</h4>
              <div className="space-y-2">
                {order.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                  >
                    <FileText className="h-5 w-5" />
                    <span>{doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetailsModal;