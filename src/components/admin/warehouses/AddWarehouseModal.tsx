/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { motion } from 'framer-motion';
import { Warehouse, MapPin, User, Phone, Mail, Package } from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetFooter 
} from '../../ui/sheet';
import { useAddWarehouseModal } from '@/hooks/useAddWarehouseModal';
import type { Warehouse as WarehouseType } from '@/types';


interface AddWarehouseModalProps {
  open: boolean;
  onClose: () => void;
}

const AddWarehouseModal: React.FC<AddWarehouseModalProps> = ({ open, onClose }) => {
  const {
    formData,
    setFormData,
    errors,
    handleSubmit,
  } = useAddWarehouseModal(onClose);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full md:w-[600px] overflow-y-auto bg-gradient-to-br from-white to-primary-50/30"
      >
        <SheetHeader className="bg-gradient-to-r from-primary-50 to-primary-100 -mx-6 -mt-6 px-6 py-6 mb-6 border-b border-primary-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary-500/10">
              <Warehouse className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <SheetTitle className="text-xl font-semibold text-primary-900">
                Nueva Bodega
              </SheetTitle>
              <SheetDescription className="text-primary-700">
                Completa la información para crear una nueva bodega
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <Card className="border-primary-200 bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-primary-900">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span>Información Básica</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Label htmlFor="name" className="flex items-center space-x-2 text-primary-700 mb-2">
                  <Warehouse className="h-4 w-4" />
                  <span>Nombre de la Bodega</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`transition-all duration-200 ${
                    errors.name 
                      ? 'border-red-500 focus-visible:ring-red-500' 
                      : 'border-primary-200 focus-visible:ring-primary-500'
                  }`}
                  placeholder="Ingresa el nombre de la bodega"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="location" className="flex items-center space-x-2 text-primary-700 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>Ubicación</span>
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`transition-all duration-200 ${
                    errors.location 
                      ? 'border-red-500 focus-visible:ring-red-500' 
                      : 'border-primary-200 focus-visible:ring-primary-500'
                  }`}
                  placeholder="Ciudad o región"
                />
                {errors.location && (
                  <p className="text-sm text-red-500 mt-1">{errors.location}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="address" className="text-primary-700 mb-2 block">
                  Dirección
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`transition-all duration-200 ${
                    errors.address 
                      ? 'border-red-500 focus-visible:ring-red-500' 
                      : 'border-primary-200 focus-visible:ring-primary-500'
                  }`}
                  placeholder="Dirección completa"
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                )}
              </motion.div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card className="border-primary-200 bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-primary-900">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span>Información de Contacto</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="manager" className="flex items-center space-x-2 text-primary-700 mb-2">
                  <User className="h-4 w-4" />
                  <span>Encargado</span>
                </Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  className={`transition-all duration-200 ${
                    errors.manager 
                      ? 'border-red-500 focus-visible:ring-red-500' 
                      : 'border-primary-200 focus-visible:ring-primary-500'
                  }`}
                  placeholder="Nombre del encargado"
                />
                {errors.manager && (
                  <p className="text-sm text-red-500 mt-1">{errors.manager}</p>
                )}
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="phone" className="flex items-center space-x-2 text-primary-700 mb-2">
                    <Phone className="h-4 w-4" />
                    <span>Teléfono</span>
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`transition-all duration-200 ${
                      errors.phone 
                        ? 'border-red-500 focus-visible:ring-red-500' 
                        : 'border-primary-200 focus-visible:ring-primary-500'
                    }`}
                    placeholder="+57 300 123 4567"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Label htmlFor="email" className="flex items-center space-x-2 text-primary-700 mb-2">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-500 focus-visible:ring-red-500' 
                        : 'border-primary-200 focus-visible:ring-primary-500'
                    }`}
                    placeholder="correo@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Bodega */}
          <Card className="border-primary-200 bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-primary-900">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span>Configuración</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Label htmlFor="capacity" className="flex items-center space-x-2 text-primary-700 mb-2">
                    <Package className="h-4 w-4" />
                    <span>Capacidad Total</span>
                  </Label>
                  <Input
                    type="number"
                    id="capacity"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    min="0"
                    className={`transition-all duration-200 ${
                      errors.capacity 
                        ? 'border-red-500 focus-visible:ring-red-500' 
                        : 'border-primary-200 focus-visible:ring-primary-500'
                    }`}
                    placeholder="1000"
                  />
                  {errors.capacity && (
                    <p className="text-sm text-red-500 mt-1">{errors.capacity}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Label htmlFor="status" className="text-primary-700 mb-2 block">
                    Estado
                  </Label>
                  <Select
                    value={formData.status?.toLowerCase()}
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      status: value.toUpperCase() as WarehouseType['status'] 
                    })}
                  >
                    <SelectTrigger className="border-primary-200 focus:ring-primary-500">
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                      <SelectItem value="maintenance">Mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Label htmlFor="notes" className="text-primary-700 mb-2 block">
                  Notas
                </Label>
                <textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-md border border-primary-200 bg-white/70 px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Notas adicionales sobre la bodega..."
                />
              </motion.div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <SheetFooter className="space-x-4 pt-6 border-t border-primary-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-primary-200 text-primary-600 hover:bg-primary-50 hover:text-primary-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md"
            >
              Crear Bodega
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddWarehouseModal;