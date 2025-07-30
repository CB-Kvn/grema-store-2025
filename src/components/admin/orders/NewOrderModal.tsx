/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Image,
  Upload,
  Eye,
  Trash2,
  Receipt,
  File
} from 'lucide-react';
import type { PurchaseOrder, Product } from '@/types';
import type { Item } from '@/types/purchaseOrder';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createOrder, updateOrder } from '@/store/slices/purchaseOrdersSlice';
import { purchaseOrderService } from '@/services/purchaseOrderService';
import ProductSelectModal from './ProductSelectModal';
import OrderAddressForm from './OrderAddressForm'; // Asegúrate de tener este import
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface NewOrderModalProps {
  onClose: () => void;
}

const createInitialOrder = (): PurchaseOrder => ({
  id:  `PO-${new Date().getFullYear()}-${uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase()}`,
  orderNumber: `PO-${new Date().getFullYear()}-${uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase()}`,
  buyerId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  status: 'PENDING',
  orderDate: new Date().toISOString(),
  expectedDeliveryDate: null,
  actualDeliveryDate: null,
  items: [],
  subtotalAmount: 0,
  totalAmount: 0,
  shippingAmount: 0,
  paymentStatus: 'PENDING',
  paymentMethod: '',
  dataShipping: '',
  dataBilling: '',
  trackingNumber: null,
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const NewOrderModal: React.FC<NewOrderModalProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<PurchaseOrder>(createInitialOrder());
  const [showProductModal, setShowProductModal] = useState(false);

  // Regenerar ID y orderNumber cada vez que se abre el modal
  useEffect(() => {
    setFormData(createInitialOrder());
  }, []);

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
  
  // Estado para el comprobante de pago
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);

  // Helper function to generate file hash
  const generateFileHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleItemChange = (index: number, field: keyof Item, value: any) => {
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

  const handlePaymentProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar que sea una imagen o PDF
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF) o PDF');
        return;
      }
      
      // Verificar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB permitido');
        return;
      }
      
      setPaymentProof(file);
      
      // Crear preview solo para imágenes
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPaymentProofPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // Para PDFs, no hay preview visual
        setPaymentProofPreview(null);
      }
    }
  };

  const handleRemovePaymentProof = () => {
    setPaymentProof(null);
    setPaymentProofPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const totalAmount = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
      
      // Format address strings
      const formatAddress = (address: typeof shippingAddress) => {
        const parts = [
          address.address,
          address.provincia,
          address.canton,
          address.zipCode
        ].filter(part => part.trim() !== '');
        return parts.join(', ');
      };

      const dataShipping = formatAddress(shippingAddress);
      const dataBilling = showBilling && !billingSameAsShipping 
        ? formatAddress(billingAddress)
        : dataShipping; // Always default to shipping address unless explicitly different
      
      // Generar un nuevo ID único para la orden
      const orderToCreate = {
        ...formData,
        id: formData.orderNumber,
        totalAmount,
        dataShipping,
        dataBilling,
        // Ensure date fields are properly formatted or null
        orderDate: formData.orderDate || new Date().toISOString(),
        expectedDeliveryDate: formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate).toISOString() : null,
        actualDeliveryDate: formData.actualDeliveryDate ? new Date(formData.actualDeliveryDate).toISOString() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Only include documents if they exist and are not empty
      if (formData.documents && formData.documents.length > 0) {
        orderToCreate.documents = formData.documents;
      }
      
      // Crear la orden primero
      await dispatch(createOrder(orderToCreate));
      
      // Si hay comprobante de pago, subir el archivo primero y luego crear el documento
      if (paymentProof) {
        try {
          // Primero subir el archivo usando la ruta /uploadReceipt
          const uploadResponse = await purchaseOrderService.uploadFileReceipt(paymentProof);

          // Luego crear el documento con la URL devuelta

          
          const documentData = {
            type: 'RECEIPT' as const,
            title: `Comprobante de pago - ${orderToCreate.orderNumber}`,
            url: uploadResponse.url ,// El servicio addDocument maneja el archivo
            hash: await generateFileHash(paymentProof), // Generar hash del archivo
            mimeType: uploadResponse.fileType,
            size: uploadResponse.size 
          };
          
          const addedDocument = await purchaseOrderService.addDocument(orderToCreate.id, documentData);
          
          // Actualizar el estado de Redux con el documento agregado
          const updatedOrder = {
            ...orderToCreate,
            documents: [...(orderToCreate.documents || []), addedDocument]
          };
          dispatch(updateOrder(updatedOrder));
        } catch (docError) {
          console.error('Error uploading payment proof:', docError);
          // No bloquear el cierre del modal si falla el upload del documento
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleProductSelect = (selectedRows: Array<{ product: Product; warehouse: any; quantity: number }>) => {
    const newItems: Item[] = selectedRows.map(({ product, warehouse, quantity }) => ({
      id: uuidv4(),
      orderId: formData.id, // Usar el ID actual del formData
      productId: product.id || 0,
      product: product,
      quantity: quantity,
      unitPrice: warehouse.price,
      totalPrice: warehouse.price * quantity,
      qtyDone: null,
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
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full sm:w-full md:w-[900px] lg:w-[1100px] bg-white shadow-xl z-50 overflow-y-auto"
      >
        <Card className="h-full rounded-none border-none shadow-none">
          <CardHeader className="sticky top-0 bg-white border-b border-primary-100 flex flex-row items-center justify-between z-10 px-4 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-primary-900">Crear Nueva Orden</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 sm:h-10 sm:w-10">
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-120px)] p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Información del Cliente */}
                <Card className="mb-4 sm:mb-6 border-l-4 border-l-primary-500">
                  <CardHeader className=' top-0  rounded-t-lg border-radius-4 bg-primary-100 border-b border-primary-200 flex flex-row items-center justify-between z-10 py-3 px-4 sm:px-6'>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-primary-900">Información del Cliente</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="buyerId" className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                          <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                          ID del Comprador
                        </Label>
                        <Input
                          id="buyerId"
                          value={formData.buyerId}
                          onChange={e => setFormData({ ...formData, buyerId: e.target.value })}
                          className="border-primary-300 focus:border-primary-500 focus:ring-primary-500 text-sm sm:text-base"
                          placeholder="Ingresa el ID del comprador"
                        />
                      </div>
                      <div>
                        <Label htmlFor="firstName" className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                          Nombre
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                          className="border-primary-300 focus:border-primary-500 focus:ring-primary-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                          Apellido
                        </Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                          className="border-primary-300 focus:border-primary-500 focus:ring-primary-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                          Correo
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="border-primary-300 focus:border-primary-500 focus:ring-primary-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                          Teléfono
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="border-primary-300 focus:border-primary-500 focus:ring-primary-500 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Información de la Orden */}
                <Card className="mb-4 sm:mb-6 border-l-4 border-l-primary-500">
                  <CardHeader className=" top-0  rounded-t-lg border-radius-4 bg-primary-100 border-b border-primary-200 flex flex-row items-center justify-between z-10 py-3 px-4 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-primary-900">Información de la Orden</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="orderNumber" className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                          <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                          Número de Orden
                        </Label>
                        <Input 
                          id="orderNumber" 
                          value={formData.orderNumber} 
                          disabled 
                          className="bg-primary-50 border-primary-300 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="orderDate" className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                          Fecha de Orden
                        </Label>
                        <Input
                          type="date"
                          id="orderDate"
                          value={formData.orderDate ? (typeof formData.orderDate === 'string' ? formData.orderDate.slice(0, 10) : formData.orderDate.toISOString().slice(0, 10)) : ''}
                          onChange={e => setFormData({ ...formData, orderDate: e.target.value || new Date().toISOString() })}
                          className="border-primary-300 focus:border-primary-500 focus:ring-primary-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="expectedDeliveryDate" className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                          Fecha de Entrega Esperada
                        </Label>
                        <Input
                          type="date"
                          id="expectedDeliveryDate"
                          value={formData.expectedDeliveryDate ? (typeof formData.expectedDeliveryDate === 'string' ? formData.expectedDeliveryDate.slice(0, 10) : formData.expectedDeliveryDate.toISOString().slice(0, 10)) : ''}
                          onChange={e => setFormData({ ...formData, expectedDeliveryDate: e.target.value || null })}
                          className="border-primary-300 focus:border-primary-500 focus:ring-primary-500 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="status" className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                          <Package className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                          Estado
                        </Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData({ ...formData, status: value as PurchaseOrder['status'] })}
                        >
                          <SelectTrigger className="border-primary-300 focus:border-primary-500 focus:ring-primary-500 text-sm sm:text-base">
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pendiente</SelectItem>
                            <SelectItem value="APPROVED">Completada</SelectItem>
                            <SelectItem value="SHIPPED">Enviada</SelectItem>
                            <SelectItem value="DELIVERED">Entregada</SelectItem>
                            <SelectItem value="CANCELLED">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="paymentStatus" className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                          <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                          Estado de Pago
                        </Label>
                        <Select
                          value={formData.paymentStatus}
                          onValueChange={(value) => setFormData({ ...formData, paymentStatus: value as PurchaseOrder['paymentStatus'] })}
                        >
                          <SelectTrigger className="border-primary-300 focus:border-primary-500 focus:ring-primary-500 text-sm sm:text-base">
                            <SelectValue placeholder="Seleccionar estado de pago" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pendiente</SelectItem>
                            <SelectItem value="PARTIAL">Parcial</SelectItem>
                            <SelectItem value="PAID">Pagado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="paymentMethod" className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                          <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                          Método de Pago
                        </Label>
                        <Select
                          value={formData.paymentMethod || ''}
                          onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                        >
                          <SelectTrigger className="border-primary-300 focus:border-primary-500 focus:ring-primary-500 text-sm sm:text-base">
                            <SelectValue placeholder="Seleccionar método de pago" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CASH">Efectivo</SelectItem>
                            <SelectItem value="DEBIT">Débito</SelectItem>
                            <SelectItem value="CREDIT">Crédito</SelectItem>
                            <SelectItem value="SINPE MOVIL">SINPE Móvil</SelectItem>
                            <SelectItem value="TRANSFER">Transferencia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comprobante de Pago */}
                <Card className="mb-4 sm:mb-6 border-l-4 border-l-primary-500">
                  <CardHeader className=" top-0  rounded-t-lg border-radius-4 bg-primary-100 border-b border-primary-200 flex flex-row items-center justify-between z-10 py-3 px-4 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg">
                        <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-primary-900">Comprobante de Pago</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="paymentProof" className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                          <Upload className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                          Subir Comprobante
                        </Label>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <input
                            id="paymentProof"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handlePaymentProofUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('paymentProof')?.click()}
                            className="flex items-center gap-2 border-primary-300 hover:border-primary-500 text-primary-700 text-sm w-full sm:w-auto"
                          >
                            <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                            Seleccionar Archivo
                          </Button>
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            Formatos: JPG, PNG, GIF, PDF (máx. 5MB)
                          </span>
                        </div>
                      </div>
                      
                      {/* Vista previa del comprobante */}
                      {paymentProof && (
                        <div className="border-2 border-dashed border-primary-300 rounded-lg p-3 sm:p-4 bg-primary-50">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs sm:text-sm font-medium text-primary-900">Vista Previa del Comprobante</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleRemovePaymentProof}
                              className="text-destructive hover:text-destructive h-6 w-6 sm:h-8 sm:w-8"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                          <div className="relative">
                            {paymentProof.type === 'application/pdf' ? (
                              // Vista previa para PDF
                              <div className="flex items-center justify-center p-8 bg-white rounded-lg border border-primary-200">
                                <div className="text-center">
                                  <File className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto mb-2" />
                                  <p className="text-sm font-medium text-primary-900">Archivo PDF</p>
                                  <p className="text-xs text-muted-foreground">{paymentProof.name}</p>
                                </div>
                              </div>
                            ) : (
                              // Vista previa para imágenes
                              paymentProofPreview && (
                                <>
                                  <img
                                    src={paymentProofPreview}
                                    alt="Comprobante de pago"
                                    className="max-w-full h-auto max-h-48 sm:max-h-64 rounded-lg shadow-sm border border-primary-200"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setImageModal({ open: true, url: paymentProofPreview })}
                                    className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white h-6 w-6 sm:h-8 sm:w-8"
                                  >
                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                </>
                              )
                            )}
                          </div>
                          <div className="mt-3 text-xs text-muted-foreground">
                            <p>Archivo: {paymentProof.name}</p>
                            <p>Tamaño: {(paymentProof.size / 1024 / 1024).toFixed(2)} MB</p>
                            <p>Tipo: {paymentProof.type}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Productos */}
                <Card className="mb-4 sm:mb-6 border-l-4 border-l-primary-500">
                  <CardHeader className=" top-0  rounded-t-lg border-radius-4 bg-primary-100 border-b border-primary-200 flex flex-col sm:flex-row sm:items-center sm:justify-between z-10 py-3 px-4 sm:px-6 gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg">
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-primary-900">Productos</h3>
                    </div>
                    <Button
                      type="button"
                      onClick={() => setShowProductModal(true)}
                      className="flex items-center gap-2 px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white text-sm w-full sm:w-auto"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      Agregar Producto
                    </Button>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead className="bg-primary-50">
                          <tr>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm">Imagen</th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm">Producto</th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm hidden sm:table-cell">SKU</th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm">Cantidad</th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm">Precio Unit.</th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm">Total</th>
                            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.items.map((item, index) => (
                            <tr key={item.id} className="border-b border-primary-100">
                              <td className="px-2 sm:px-4 py-3">
                                {item.product?.Images?.[0]?.url?.[0] ? (
                                  <img
                                    src={item.product.Images[0].url[0]}
                                    alt={item.product?.name}
                                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded cursor-pointer transition hover:scale-105"
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
                              <td className="px-2 sm:px-4 py-3">
                                <span className="whitespace-normal break-words block max-w-[150px] sm:max-w-xs text-xs sm:text-sm">
                                  {item.product?.name}
                                </span>
                              </td>
                              <td className="px-2 sm:px-4 py-3 hidden sm:table-cell">
                                <Input
                                  value={item.product?.sku || ''}
                                  onChange={e => handleItemChange(index, 'product', { ...item.product, sku: e.target.value })}
                                  className="text-xs sm:text-sm"
                                />
                              </td>
                              <td className="px-2 sm:px-4 py-3">
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  min="1"
                                  onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                                  className="w-16 sm:w-24 text-xs sm:text-sm"
                                />
                              </td>
                              <td className="px-2 sm:px-4 py-3">
                                <Input
                                  type="number"
                                  value={item.unitPrice}
                                  min="0"
                                  onChange={e => handleItemChange(index, 'unitPrice', e.target.value)}
                                  className="w-20 sm:w-32 text-xs sm:text-sm"
                                />
                              </td>
                              <td className="px-2 sm:px-4 py-3">
                                <span className="font-medium text-xs sm:text-sm">₡{item.totalPrice.toLocaleString()}</span>
                              </td>
                              <td className="px-2 sm:px-4 py-3">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleRemoveItem(index)}
                                  title="Eliminar producto"
                                  className="h-6 w-6 sm:h-8 sm:w-8"
                                >
                                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
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
                <Card className="mb-4 sm:mb-6 border-l-4 border-l-primary-500">
                  <CardHeader className=" top-0  rounded-t-lg border-radius-4 bg-primary-100 border-b border-primary-200 flex flex-row items-center justify-between z-10 py-3 px-4 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-primary-900">Información de Envío y Facturación</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <div className="grid grid-cols-1 gap-6 my-4">
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
                  <CardFooter className="px-4 sm:px-6">
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
                      <Label htmlFor="showBilling" className="text-sm">Agregar dirección de facturación</Label>
                    </div>
                  </CardFooter>
                </Card>

                {/* Información de Rastreo */}
                <Card className="mb-4 sm:mb-6 border-l-4 border-l-primary-500">
                  <CardHeader className=" top-0  rounded-t-lg border-radius-4 bg-primary-100 border-b border-primary-200 flex flex-row items-center justify-between z-10 py-3 px-4 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg">
                        <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-primary-900">Información de Rastreo</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="trackingNumber" className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                          <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                          Número de Rastreo
                        </Label>
                        <Input
                          id="trackingNumber"
                          value={formData.trackingNumber || ''}
                          onChange={e => setFormData({ ...formData, trackingNumber: e.target.value })}
                          className="border-primary-300 focus:border-primary-500 focus:ring-primary-500 text-sm sm:text-base"
                          placeholder="Ingresa el número de rastreo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="actualDeliveryDate" className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                          Fecha de Entrega Real
                        </Label>
                        <Input
                          type="date"
                          id="actualDeliveryDate"
                          value={formData.actualDeliveryDate ? (typeof formData.actualDeliveryDate === 'string' ? formData.actualDeliveryDate.slice(0, 10) : formData.actualDeliveryDate.toISOString().slice(0, 10)) : ''}
                          onChange={e => setFormData({ ...formData, actualDeliveryDate: e.target.value || null })}
                          className="border-primary-300 focus:border-primary-500 focus:ring-primary-500 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notas */}
                <Card className="mb-4 sm:mb-6 border-l-4 border-l-primary-500">
                  <CardHeader className=" top-0  rounded-t-lg border-radius-4 bg-primary-100 border-b border-primary-200 flex flex-row items-center justify-between z-10 py-3 px-4 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg">
                        <StickyNote className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-primary-900">Notas</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                    <div>
                      <Label htmlFor="notes" className="flex items-center gap-2 text-sm font-medium text-primary-700 mb-2">
                        <StickyNote className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                        Notas adicionales
                      </Label>
                      <textarea
                        id="notes"
                        value={formData.notes || ''}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full rounded-md border border-primary-300 focus:border-primary-500 focus:ring-primary-500 bg-background px-3 py-2 min-h-[80px] sm:min-h-[100px] resize-none text-sm sm:text-base"
                        placeholder="Escribe notas adicionales sobre la orden..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Total */}
                <Card className="mb-4 sm:mb-6 border-t-4 border-t-primary-500 bg-primary-50">
                  <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg">
                          <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                        </div>
                        <span className="text-base sm:text-lg font-medium text-primary-900">Total de la Orden</span>
                      </div>
                      <span className="text-xl sm:text-2xl font-bold text-primary-900">
                        ₡{formData.items.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t border-primary-200 px-4 sm:px-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 px-6 py-2 border-primary-300 hover:border-primary-400 text-sm w-full sm:w-auto"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 text-white hover:bg-primary-700 text-sm w-full sm:w-auto"
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
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
        <DialogContent className="max-w-sm sm:max-w-md mx-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">¿Dirección de facturación igual a la de envío?</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
            <Button
              onClick={() => {
                setBillingSameAsShipping(true);
                setBillingAddress({ ...shippingAddress });
                setShowBilling(true);
                setAskBillingModal(false);
              }}
              className="bg-primary-600 text-white text-sm w-full sm:w-auto"
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
              className="text-sm w-full sm:w-auto"
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