/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Calendar, 
  Package, 
  CreditCard, 
  Truck, 
  MapPin, 
  Hash, 
  StickyNote, 
  Calculator,
  Plus,
  ShoppingCart,
  Image
} from 'lucide-react';
import type { PurchaseOrder, PurchaseOrderItem, Product } from '@/types';
import { useDispatch } from 'react-redux';
import { addOrder } from '@/store/slices/purchaseOrdersSlice';
import ProductSelectModal from './ProductSelectModal';
import OrderAddressForm from './OrderAddressForm'; // Asegúrate de tener este import
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface NewOrderModalProps {
  onClose: () => void;
}

const initialOrder: PurchaseOrder = {
  id: uuidv4(),
  orderNumber: `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  status: 'PENDING',
  orderDate: new Date().toISOString(),
  expectedDeliveryDate: '',
  actualDeliveryDate: '',
  items: [],
  totalAmount: 0,
  paymentStatus: 'PENDING',
  paymentMethod: '',
  dataShipping: '',
  dataBilling: '',
  trackingNumber: '',
  notes: '',
  documents: [],
};

const NewOrderModal: React.FC<NewOrderModalProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<PurchaseOrder>(initialOrder);
  const [showProductModal, setShowProductModal] = useState(false);

  // Estado para el modal de imagen
  const [imageModal, setImageModal] = useState<{ open: boolean; url: string }>({ open: false, url: '' });

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    provincia: '',
    canton: '',
    zipCode: '',
  });
  const [billingAddress, setBillingAddress] = useState({
    address: '',
    provincia: '',
    canton: '',
    zipCode: '',
  });
  const [showBilling, setShowBilling] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [askBillingModal, setAskBillingModal] = useState(false);

  const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'quantity' || field === 'unitPrice' ? Number(value) : value,
      totalPrice:
        field === 'quantity'
          ? Number(value) * newItems[index].unitPrice
          : field === 'unitPrice'
            ? newItems[index].quantity * Number(value)
            : newItems[index].quantity * newItems[index].unitPrice,
    };
    setFormData({ ...formData, items: newItems });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    dispatch(addOrder({ ...formData, totalAmount }));
    onClose();
  };

  const handleProductSelect = (selectedRows: Array<{ product: Product; warehouse: any; quantity: number }>) => {
    const newItems = selectedRows.map(({ product, warehouse, quantity }) => ({
      id: uuidv4(),
      productId: product.id,
      product,
      quantity: quantity,
      unitPrice: warehouse.price,
      totalPrice: warehouse.price * quantity,
      isGift: false,
      isBestSeller: false,
      isNew: false,
      status: 'PENDING',
    }));
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, ...newItems],
    }));
    setShowProductModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      {/* Modal para ver imagen grande */}
      {imageModal.open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setImageModal({ open: false, url: '' })}
        >
          <img
            src={imageModal.url}
            alt="Producto"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl border-4 border-white"
          />
        </div>
      )}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.4 }}
        className="fixed inset-y-0 right-0 w-full md:w-[1100px] bg-white shadow-xl z-50 overflow-y-auto"
      >
        <Card className="h-full rounded-none border-none shadow-none">
          <CardHeader className="sticky top-0 bg-white border-b border-primary-100 flex flex-row items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="p-2  rounded-lg">
                <ShoppingCart className="h-6 w-6 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-primary-900">Crear Nueva Orden</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5 text-primary-600" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-120px)] p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información del Cliente */}
                <Card className="mb-6 s">
                  <CardHeader className=' top-0  rounded-t-lg border-radius-4 bg-primary-100 border-b border-primary-200 flex flex-row items-center justify-between z-10 py-3'>
                    <div className="flex items-center gap-3">
                      <div className="p-2rounded-lg">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                      <h3 className="text-lg font-medium text-primary-900">Información del Cliente</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <User className="h-4 w-4 text-primary-600" />
                          Nombre
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <User className="h-4 w-4 text-primary-600" />
                          Apellido
                        </Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Mail className="h-4 w-4 text-primary-600" />
                          Correo
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Phone className="h-4 w-4 text-primary-600" />
                          Teléfono
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Información de la Orden */}
                <Card className="mb-6">
                  <CardHeader className=" top-0  rounded-t-lg border-radius-4 bg-primary-100 border-b border-primary-200 flex flex-row items-center justify-between z-10 py-3">
                    <h3 className="text-lg font-medium text-primary-900">Información de la Orden</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="orderNumber">Número de Orden</Label>
                        <Input id="orderNumber" value={formData.orderNumber} disabled />
                      </div>
                      <div>
                        <Label htmlFor="orderDate">Fecha de Orden</Label>
                        <Input
                          type="date"
                          id="orderDate"
                          value={formData.orderDate?.slice(0, 10) || ''}
                          onChange={e => setFormData({ ...formData, orderDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="expectedDeliveryDate">Fecha de Entrega Esperada</Label>
                        <Input
                          type="date"
                          id="expectedDeliveryDate"
                          value={formData.expectedDeliveryDate?.slice(0, 10) || ''}
                          onChange={e => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="status">Estado</Label>
                        <Input
                          id="status"
                          value={
                            formData.status === 'PENDING'
                              ? 'Pendiente'
                              : formData.status === 'APPROVED'
                                ? 'Completa'
                                : formData.status === 'SHIPPED'
                                  ? 'Enviada'
                                  : formData.status === 'DELIVERED'
                                    ? 'Entregada'
                                    : formData.status === 'CANCELLED'
                                      ? 'Cancelada'
                                      : formData.status
                          }
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="paymentStatus">Estado de Pago</Label>
                        <Input
                          id="paymentStatus"
                          value={formData.paymentStatus}
                          onChange={e => setFormData({ ...formData, paymentStatus: e.target.value as PurchaseOrder['paymentStatus'] })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="paymentMethod">Método de Pago</Label>
                        <Input
                          id="paymentMethod"
                          value={formData.paymentMethod || ''}
                          onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Productos */}
                <Card className="mb-6">
                  <CardHeader className=" top-0  rounded-t-lg border-radius-4 bg-primary-100 border-b border-primary-200 flex flex-row items-center justify-between z-10 py-2">
                    <h3 className="text-lg font-medium text-primary-900">Productos</h3>
                    <Button
                      type="button"
                      onClick={() => setShowProductModal(true)}
                      className="px-3 py-1"
                    >
                      Agregar Producto
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-primary-50">
                          <tr>
                            <th className="px-4 py-3 text-left">Imagen</th>
                            <th className="px-4 py-3 text-left">Producto</th>
                            <th className="px-4 py-3 text-left">SKU</th>
                            <th className="px-4 py-3 text-left">Cantidad</th>
                            <th className="px-4 py-3 text-left">Precio Unitario</th>
                            <th className="px-4 py-3 text-left">Total</th>
                            <th className="px-4 py-3 text-left"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.items.map((item, index) => (
                            <tr key={item.id} className="border-b border-primary-100">
                              <td className="px-4 py-3">
                                {item.product?.Images?.[0]?.url?.[0] ? (
                                  <img
                                    src={item.product.Images[0].url[0]}
                                    alt={item.product?.name}
                                    className="w-16 h-16 object-cover rounded cursor-pointer transition hover:scale-105"
                                    onClick={() =>
                                      setImageModal({
                                        open: true,
                                        url: item.product.Images[0].url[0],
                                      })
                                    }
                                  />
                                ) : (
                                  <span className="text-xs text-muted-foreground">Sin imagen</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span className="whitespace-normal break-words block max-w-xs">
                                  {item.product?.name}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <Input
                                  value={item.product?.sku || ''}
                                  onChange={e => handleItemChange(index, 'product', { ...item.product, sku: e.target.value })}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  min="1"
                                  onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                                  className="w-24"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <Input
                                  type="number"
                                  value={item.unitPrice}
                                  min="0"
                                  onChange={e => handleItemChange(index, 'unitPrice', e.target.value)}
                                  className="w-32"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-medium">₡{item.totalPrice.toLocaleString()}</span>
                              </td>
                              <td className="px-4 py-3">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleRemoveItem(index)}
                                  title="Eliminar producto"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Información de Envío y Facturación */}
                <Card className="mb-6">
                  <CardHeader className=" top-0  rounded-t-lg border-radius-4 bg-primary-100 border-b border-primary-200 flex flex-row items-center justify-between z-10 py-3">
                    <h2 className="text-xl font-semibold text-primary-900">Crear Nueva Orden</h2>

                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                      <OrderAddressForm
                        title="Dirección de Envío"
                        values={shippingAddress}
                        onChange={setShippingAddress}
                      />
                      <div>

                        {showBilling && (
                          <>
                            {!billingSameAsShipping ? (
                              <OrderAddressForm
                                title="Dirección de Facturación"
                                values={billingAddress}
                                onChange={setBillingAddress}
                              />
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {/* El checkbox va debajo del formulario de envío */}
                    <div className="mt-4 flex items-center gap-2 mb-2">
                      <Checkbox
                        checked={showBilling}
                        onCheckedChange={checked => {
                          if (checked) {
                            setAskBillingModal(true);
                          } else {
                            setShowBilling(false);
                          }
                        }}
                        id="showBilling"
                      />
                      <Label htmlFor="showBilling">Agregar dirección de facturación</Label>
                    </div>
                  </CardFooter>
                </Card>

                {/* Información de Rastreo */}
                <Card className="mb-6">
                  <CardHeader className=" top-0  rounded-t-lg border-radius-4 bg-primary-100 border-b border-primary-200 flex flex-row items-center justify-between z-10 py-3">
                    <h3 className="text-lg font-medium text-primary-900">Información de Rastreo</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="trackingNumber">Número de Rastreo</Label>
                        <Input
                          id="trackingNumber"
                          value={formData.trackingNumber || ''}
                          onChange={e => setFormData({ ...formData, trackingNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="actualDeliveryDate">Fecha de Entrega Real</Label>
                        <Input
                          type="date"
                          id="actualDeliveryDate"
                          value={formData.actualDeliveryDate?.slice(0, 10) || ''}
                          onChange={e => setFormData({ ...formData, actualDeliveryDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notas */}
                <Card className="mb-6">
                  <CardHeader className=" top-0  rounded-t-lg border-radius-4 bg-primary-100 border-b border-primary-200 flex flex-row items-center justify-between z-10 py-3">
                    <h3 className="text-lg font-medium text-primary-900">Notas</h3>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      id="notes"
                      value={formData.notes || ''}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                    />
                  </CardContent>
                </Card>

                {/* Total */}
                <Card className="mb-6 border-t-2 border-primary-100">
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-primary-900">Total</span>
                      <span className="text-2xl font-bold text-primary-900">
                        ₡{formData.items.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Botones de acción */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary-600 text-white hover:bg-primary-700"
                  >
                    Crear Orden
                  </Button>
                </div>
              </form>
              {showProductModal && (
                <ProductSelectModal
                  onClose={() => setShowProductModal(false)}
                  onSelect={handleProductSelect}
                />
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal centrado para preguntar si la dirección de facturación es igual a la de envío */}
      <Dialog open={askBillingModal} onOpenChange={setAskBillingModal}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>¿Dirección de facturación igual a la de envío?</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={() => {
                setBillingSameAsShipping(true);
                setBillingAddress({ ...shippingAddress });
                setShowBilling(true);
                setAskBillingModal(false);
              }}
              className="bg-primary-600 text-white"
            >
              Sí
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setBillingSameAsShipping(false);
                setShowBilling(true);
                setAskBillingModal(false);
              }}
            >
              No
            </Button>
          </div>
          <DialogFooter />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewOrderModal;