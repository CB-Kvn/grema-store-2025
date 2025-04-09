import React from 'react';
import { X, Truck, Calendar, DollarSign, FileText } from 'lucide-react';
import { format } from 'date-fns';
import type { PurchaseOrder } from '@/types';

interface OrderDetailsModalProps {
  order: PurchaseOrder;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
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
                  {order.orderNumber}
                </h3>
                <p className="text-primary-600">{order.supplier}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-primary-600">Fecha de Orden</p>
                  <p className="font-medium">{format(new Date(order.orderDate), 'dd/MM/yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-primary-600">Entrega Esperada</p>
                  <p className="font-medium">{format(new Date(order.expectedDeliveryDate), 'dd/MM/yyyy')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="text-lg font-medium text-primary-900 mb-4">Productos</h4>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-primary-50 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-primary-900">{item.productName}</h5>
                      <p className="text-sm text-primary-600">
                        Cantidad: {item.quantity} × ${item.unitPrice.toLocaleString()}
                      </p>
                    </div>
                    <p className="font-medium text-primary-900">
                      ${item.totalPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-2">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      item.status === 'received' ? 'bg-green-100 text-green-800' :
                      item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
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
                  ${order.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary-600" />
                  <span className="text-primary-900">Términos de Pago</span>
                </div>
                <span>{order.paymentTerms}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary-900">Estado de Pago</span>
                <span className={`px-2 py-1 rounded-full text-sm ${paymentStatusColors[order.paymentStatus]}`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {(order.trackingNumber || order.shippingMethod) && (
            <div>
              <h4 className="text-lg font-medium text-primary-900 mb-4">Información de Envío</h4>
              <div className="bg-primary-50 p-4 rounded-lg space-y-3">
                {order.trackingNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-primary-900">Número de Rastreo</span>
                    <span>{order.trackingNumber}</span>
                  </div>
                )}
                {order.shippingMethod && (
                  <div className="flex justify-between items-center">
                    <span className="text-primary-900">Método de Envío</span>
                    <span>{order.shippingMethod}</span>
                  </div>
                )}
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