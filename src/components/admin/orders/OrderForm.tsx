import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    ArrowLeft,
    Save,
    User,
    MapPin,
    DollarSign,
    Package,
    Plus,
    Trash2,
    ShoppingCart,
    Warehouse
} from 'lucide-react';
import type { PurchaseOrder } from '@/types';
import type { Item } from '@/types/purchaseOrder';
import { motion } from 'framer-motion';

interface OrderFormProps {
    order?: PurchaseOrder | null;
    orderItems: Item[];
    formData: Partial<PurchaseOrder>;
    onBack: () => void;
    onSave: (orderData: Partial<PurchaseOrder>) => void;
    onFormChange: (field: string, value: any) => void;
    onAddProducts: () => void;
    onRemoveItem: (index: number) => void;
    onItemChange: (index: number, field: keyof Item, value: any) => void;
    onInventoryAssign?: (itemId: string, assignments: { warehouseId: string; quantity: number }[]) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
    order,
    orderItems,
    formData,
    onBack,
    onSave,
    onFormChange,
    onAddProducts,
    onRemoveItem,
    onItemChange,
    onInventoryAssign,
}) => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: any) => {
        onFormChange(field, value);

        // Limpiar error del campo
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName?.trim()) {
            newErrors.firstName = 'El nombre es requerido';
        }

        if (!formData.lastName?.trim()) {
            newErrors.lastName = 'El apellido es requerido';
        }

        if (!formData.email?.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (!formData.phone?.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        }

        if (!formData.orderNumber?.trim()) {
            newErrors.orderNumber = 'El número de orden es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            const orderData = {
                ...formData,
                items: orderItems,
            };
            onSave(orderData);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {/* Header fijo */}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="text-primary-600 hover:bg-primary-50"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-primary-900">
                            {order ? 'Editar Orden' : 'Nueva Orden'}
                        </h1>
                        <p className="text-primary-600">
                            {order ? `Orden #${order.orderNumber}` : 'Crear una nueva orden de compra'}
                        </p>
                    </div>
                </div>

                <Button onClick={handleSubmit} className="bg-primary-600 hover:bg-primary-700">
                    <Save className="h-4 w-4 mr-2" />
                    {order ? 'Actualizar' : 'Crear'} Orden
                </Button>
            </div>

            <form className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Información del Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">Nombre *</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName || ''}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className={errors.firstName ? 'border-red-500' : ''}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Apellido *</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName || ''}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className={errors.lastName ? 'border-red-500' : ''}
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="phone">Teléfono *</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone || ''}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className={errors.phone ? 'border-red-500' : ''}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>

                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Información de Pagos
                            </CardTitle>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="subtotalAmount">Subtotal</Label>
                                        <Input
                                            id="subtotalAmount"
                                            type="number"
                                            step="0.01"
                                            value={formData.subtotalAmount || 0}
                                            onChange={(e) => handleInputChange('subtotalAmount', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="shippingAmount">Costo de Envío</Label>
                                        <Input
                                            id="shippingAmount"
                                            type="number"
                                            step="0.01"
                                            value={formData.shippingAmount || 0}
                                            onChange={(e) => handleInputChange('shippingAmount', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="totalAmount">Total</Label>
                                    <Input
                                        id="totalAmount"
                                        type="number"
                                        step="0.01"
                                        value={formData.totalAmount || 0}
                                        onChange={(e) => handleInputChange('totalAmount', parseFloat(e.target.value) || 0)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="paymentStatus">Estado del Pago</Label>
                                        <Select
                                            value={formData.paymentStatus || 'pending'}
                                            onValueChange={(value) => handleInputChange('paymentStatus', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60 overflow-y-auto">
                                                <SelectItem value="pending">Pendiente</SelectItem>
                                                <SelectItem value="paid">Pagado</SelectItem>
                                                <SelectItem value="failed">Fallido</SelectItem>
                                                <SelectItem value="refunded">Reembolsado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="trackingNumber">Número de Seguimiento</Label>
                                    <Input
                                        id="trackingNumber"
                                        value={formData.trackingNumber || ''}
                                        onChange={(e) => handleInputChange('trackingNumber', e.target.value)}
                                        placeholder="Número de seguimiento del envío"
                                    />
                                </div>

                            </CardContent>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Información de la Orden
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="orderNumber">Número de Orden *</Label>
                                <Input
                                    id="orderNumber"
                                    value={formData.orderNumber || ''}
                                    onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                                    className={errors.orderNumber ? 'border-red-500' : ''}
                                />
                                {errors.orderNumber && (
                                    <p className="text-red-500 text-sm mt-1">{errors.orderNumber}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="status">Estado</Label>
                                <Select
                                    value={formData.status || 'pending'}
                                    onValueChange={(value) => handleInputChange('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-y-auto">
                                        <SelectItem value="pending">Pendiente</SelectItem>
                                        <SelectItem value="confirmed">Confirmada</SelectItem>
                                        <SelectItem value="shipped">Enviada</SelectItem>
                                        <SelectItem value="delivered">Entregada</SelectItem>
                                        <SelectItem value="cancelled">Cancelada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="expectedDeliveryDate">Fecha de Entrega Esperada</Label>
                                <Input
                                    id="expectedDeliveryDate"
                                    type="date"
                                    value={formData.expectedDeliveryDate ?
                                        (typeof formData.expectedDeliveryDate === 'string' ?
                                            formData.expectedDeliveryDate.split('T')[0] :
                                            new Date(formData.expectedDeliveryDate).toISOString().split('T')[0]) : ''}
                                    onChange={(e) => handleInputChange('expectedDeliveryDate', e.target.value ? new Date(e.target.value).toISOString() : null)}
                                />
                            </div>            <div>
                                <Label htmlFor="paymentMethod">Método de Pago</Label>
                                <Select
                                    value={formData.paymentMethod || ''}
                                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar método" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-y-auto">
                                        <SelectItem value="credit_card">Tarjeta de Crédito</SelectItem>
                                        <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
                                        <SelectItem value="cash">Efectivo</SelectItem>
                                        <SelectItem value="check">Cheque</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Direcciones
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="dataShipping">Dirección de Envío</Label>
                                <Textarea
                                    id="dataShipping"
                                    value={formData.dataShipping || ''}
                                    onChange={(e) => handleInputChange('dataShipping', e.target.value)}
                                    placeholder="Dirección completa de envío"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="dataBilling">Dirección de Facturación</Label>
                                <Textarea
                                    id="dataBilling"
                                    value={formData.dataBilling || ''}
                                    onChange={(e) => handleInputChange('dataBilling', e.target.value)}
                                    placeholder="Dirección completa de facturación"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Productos de la Orden
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={onAddProducts}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Agregar Productos
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {orderItems.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No hay productos agregados a esta orden</p>
                                    <p className="text-sm">Haz clic en "Agregar Productos" para comenzar</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orderItems.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50"
                                        >
                                            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                                                <Package className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <div className="flex-1 space-y-4">

                                                <div className="grid grid-cols-4 gap-4">
                                                    <div>
                                                        <Label className="text-sm font-medium">Producto</Label>
                                                        <p className="text-sm">{item.product?.name || `Producto ID: ${item.productId}`}</p>
                                                        <p className="text-xs text-gray-500">SKU: {item.product?.sku || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`quantity-${index}`}>Cantidad</Label>
                                                        <Input
                                                            id={`quantity-${index}`}
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => onItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`unitPrice-${index}`}>Precio Unitario</Label>
                                                        <Input
                                                            id={`unitPrice-${index}`}
                                                            type="number"
                                                            step="0.01"
                                                            value={item.unitPrice}
                                                            onChange={(e) => onItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    <div className="flex items-end justify-between">
                                                        <div>
                                                            <Label>Total</Label>
                                                            <p className="text-sm font-medium mt-1">${(item.quantity * item.unitPrice).toFixed(2)}</p>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => onRemoveItem(index)}
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>


                                                {order && (
                                                    <div className="flex justify-start">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (onInventoryAssign) {
                                                                    onInventoryAssign(item.id, []);
                                                                }
                                                            }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Warehouse className="h-4 w-4" />
                                                            Asignar Inventario
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-end pt-4 border-t">
                                        <div className="text-right">
                                            <p className="text-lg font-semibold">
                                                Total de Productos: ${orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Notas Adicionales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                id="notes"
                                value={formData.notes || ''}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                placeholder="Notas adicionales sobre la orden..."
                                rows={4}
                            />
                        </CardContent>
                    </Card>




                </div>
            </form>
            {/* {isInventoryDialogOpen && selectedItemForInventory && (
                <Dialog open={isInventoryDialogOpen} onOpenChange={handleInventoryDialogClose}>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                        <InventoryAssignment
                            item={selectedItemForInventory}
                            onAssignmentChange={handleInventoryAssignmentChange}
                            onClose={handleInventoryDialogClose}
                        />
                    </DialogContent>
                </Dialog>
            )} */}
        </motion.div>
    );
};

export default OrderForm;
