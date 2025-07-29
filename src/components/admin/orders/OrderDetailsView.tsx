import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Package,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Truck,
  CreditCard,
  FileText,
  Clock,
  ShoppingCart,
  Warehouse
} from 'lucide-react';
import { format } from 'date-fns';
import type { PurchaseOrder } from '@/types';
import { useAppSelector } from '@/hooks/useAppSelector';

interface OrderDetailsViewProps {
  order: PurchaseOrder;
  onBack: () => void;
  onEdit: () => void;
}

const OrderDetailsView: React.FC<OrderDetailsViewProps> = ({
  order,
  onBack,
  onEdit,
}) => {
  // Get warehouses from Redux store
  const { warehouses } = useAppSelector((state) => state.warehouses);
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Helper function to get warehouse name by ID
  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse ? warehouse.name : warehouseId;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-primary-900">
              Orden #{order.orderNumber}
            </h2>
            <p className="text-primary-600">
              Creada el {format(new Date(order.orderDate), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColor(order.status)} border text-sm px-3 py-1`}>
            {order.status}
          </Badge>
          <Button onClick={onEdit} variant="gradient">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del cliente */}
        <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-primary-600">Nombre</label>
              <p className="text-primary-900 font-medium">
                {order.firstName} {order.lastName}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-primary-600">Email</label>
              <p className="text-primary-900">{order.email}</p>
            </div>
            
            {order.phone && (
              <div>
                <label className="text-sm font-medium text-primary-600">Teléfono</label>
                <p className="text-primary-900">{order.phone}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-primary-600">ID del Comprador</label>
              <p className="text-primary-900 font-mono text-sm">{order.buyerId}</p>
            </div>
          </CardContent>
        </Card>

        {/* Información de envío y facturación */}
        <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Envío y Facturación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-primary-600">Dirección de Envío</label>
              <p className="text-primary-900 text-sm">{order.dataShipping}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-primary-600">Dirección de Facturación</label>
              <p className="text-primary-900 text-sm">{order.dataBilling}</p>
            </div>
            
            {order.trackingNumber && (
              <div>
                <label className="text-sm font-medium text-primary-600">Número de Seguimiento</label>
                <p className="text-primary-900 font-mono text-sm">{order.trackingNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información financiera */}
        <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Información Financiera
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-primary-600">Subtotal:</span>
                <span className="text-primary-900">${order.subtotalAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-600">Envío:</span>
                <span className="text-primary-900">${order.shippingAmount?.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span className="text-primary-900">Total:</span>
                <span className="text-primary-900">${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="pt-2">
              <label className="text-sm font-medium text-primary-600">Método de Pago</label>
              <p className="text-primary-900 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {order.paymentMethod}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-primary-600">Estado del Pago</label>
              <Badge className={`${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} mt-1`}>
                {order.paymentStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fechas importantes */}
      <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Cronología de la Orden
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-primary-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha de Orden
              </label>
              <p className="text-primary-900 font-medium">
                {format(new Date(order.orderDate), 'dd/MM/yyyy HH:mm')}
              </p>
            </div>
            
            {order.expectedDeliveryDate && (
              <div>
                <label className="text-sm font-medium text-primary-600 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Entrega Esperada
                </label>
                <p className="text-primary-900 font-medium">
                  {format(new Date(order.expectedDeliveryDate), 'dd/MM/yyyy')}
                </p>
              </div>
            )}
            
            {order.actualDeliveryDate && (
              <div>
                <label className="text-sm font-medium text-primary-600 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Entrega Real
                </label>
                <p className="text-primary-900 font-medium">
                  {format(new Date(order.actualDeliveryDate), 'dd/MM/yyyy')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notas */}
      {order.notes && (
        <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-primary-700 bg-primary-50 p-4 rounded-lg">
              {order.notes}
            </p>
          </CardContent>
        </Card>
      )}
      {/* Productos de la Orden */}
      <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Productos de la Orden
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.items && order.items.length > 0 ? (
            <div className="space-y-6">
              {order.items.map((item, index) => (
                <div key={item.id} className="border-b border-primary-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                    <div>
                      <h4 className="font-medium text-primary-900">
                        {item.product?.name || `Producto ID: ${item.productId}`}
                      </h4>
                      <p className="text-sm text-primary-600">
                        SKU: {item.product?.sku || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-primary-600">Cantidad</p>
                        <p className="font-medium text-primary-900">{item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-primary-600">Precio Unitario</p>
                        <p className="font-medium text-primary-900">${item.unitPrice.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-primary-600">Total</p>
                        <p className="font-semibold text-primary-900">${item.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Asignaciones de Almacén */}
                  {item.warehouseAssignments && item.warehouseAssignments.length > 0 && (
                    <div className="mt-3 bg-primary-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Warehouse className="h-4 w-4 text-primary-600" />
                        <h5 className="text-sm font-medium text-primary-700">Asignaciones de Inventario</h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {item.warehouseAssignments.map((assignment, idx) => (
                          <div key={idx} className="bg-white p-2 rounded border border-primary-100 flex justify-between items-center">
                            <span className="text-sm text-primary-700">
                              {getWarehouseName(assignment.warehouseId)}
                            </span>
                            <Badge variant="outline" className="bg-primary-50">
                              {assignment.quantity} unidades
                            </Badge>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-right text-sm text-primary-600">
                        Total asignado: {item.warehouseAssignments.reduce((sum, a) => sum + a.quantity, 0)} de {item.quantity}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="flex justify-end pt-4 border-t border-primary-100">
                <div className="text-right">
                  <p className="text-lg font-semibold text-primary-900">
                    Total de Productos: ${order.items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-primary-500">
              No hay productos en esta orden
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Notas */}
      {order.notes && (
        <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-primary-700 bg-primary-50 p-4 rounded-lg">
              {order.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default OrderDetailsView;
