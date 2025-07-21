import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { useAddWarehouseModal } from '@/hooks/useAddWarehouseModal';
import type { Warehouse } from '@/types';

interface WarehouseFormViewProps {
  warehouse?: Warehouse;
  onBack: () => void;
  mode: 'create' | 'edit';
}

const WarehouseFormView: React.FC<WarehouseFormViewProps> = ({ 
  warehouse, 
  onBack, 
  mode 
}) => {
  const {
    formData,
    setFormData,
    errors,
    handleSubmit,
  } = useAddWarehouseModal(() => {
    // Al completar el formulario, volver a la lista
    onBack();
  });

  // Si estamos en modo editar, inicializar con los datos del warehouse
  React.useEffect(() => {
    if (mode === 'edit' && warehouse) {
      setFormData(warehouse);
    }
  }, [mode, warehouse, setFormData]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-primary-50"
          >
            <ArrowLeft className="h-5 w-5 text-primary-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary-900">
              {mode === 'create' ? 'Nueva Bodega' : 'Editar Bodega'}
            </h1>
            <p className="text-primary-600">
              {mode === 'create' 
                ? 'Completa la información para crear una nueva bodega'
                : `Editando ${warehouse?.name || 'bodega'}`
              }
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
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
              <Label htmlFor="name" className="text-primary-700 mb-2 block">
                Nombre de la Bodega
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
              <Label htmlFor="location" className="text-primary-700 mb-2 block">
                Ubicación
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
        <Card>
          <CardHeader>
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
              <Label htmlFor="manager" className="text-primary-700 mb-2 block">
                Encargado
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
                <Label htmlFor="phone" className="text-primary-700 mb-2 block">
                  Teléfono
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
                <Label htmlFor="email" className="text-primary-700 mb-2 block">
                  Email
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
        <Card>
          <CardHeader>
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
                <Label htmlFor="capacity" className="text-primary-700 mb-2 block">
                  Capacidad Total
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
                    status: value.toUpperCase() as Warehouse['status'] 
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
                className="w-full rounded-md border border-primary-200 bg-white px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400"
                placeholder="Notas adicionales sobre la bodega..."
              />
            </motion.div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-primary-200">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-primary-200 text-primary-600 hover:bg-primary-50 hover:text-primary-700"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md"
          >
            <Save className="h-4 w-4 mr-2" />
            {mode === 'create' ? 'Crear Bodega' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default WarehouseFormView;
