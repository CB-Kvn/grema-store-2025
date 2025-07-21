/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

import type { Warehouse } from '@/types';
import { useEditWarehouseModal } from '@/hooks/useEditWarehouseModal';

interface EditWarehouseModalProps {
  warehouse: Warehouse;
  onClose: () => void;
}

const EditWarehouseModal: React.FC<EditWarehouseModalProps> = ({ warehouse, onClose }) => {
  // Referencia al contenedor del modal para controlar el scroll
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    formData,
    setFormData,
    handleSubmit,
    handleItemChange,
    addItem,
    removeItem,
  } = useEditWarehouseModal(warehouse, onClose);

  // Efecto para posicionar el scroll al inicio cuando se abre el modal
  useEffect(() => {
    // Bloquear scroll del body y guardar posición actual
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    // Posicionar el modal al inicio
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }

    // Cleanup: restaurar scroll del body al cerrar el modal
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <AnimatePresence>
      {/* Modal Backdrop con animación de fade */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal Content con animación deslizable */}
      <motion.div 
        ref={modalRef}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ 
          type: 'spring',
          damping: 25,
          stiffness: 200,
          duration: 0.4 
        }}
        className="fixed top-0 right-0 h-full w-full md:w-[700px] bg-white shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header con gradiente sutil */}
        <div className="sticky top-0 bg-gradient-to-r from-white to-primary-50 border-b border-primary-200 p-6 flex justify-between items-center backdrop-blur-sm">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-xl font-semibold text-primary-900"
          >
            Editar Almacén
          </motion.h2>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.2 }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-full transition-colors duration-200 shadow-sm"
          >
            <X className="h-5 w-5 text-primary-600" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Información Básica</h3>
            
            <div>
              <Label htmlFor="name">Nombre del Almacén</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manager">Encargado</Label>
                <Input
                  id="manager"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Warehouse['status'] })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">Capacidad Total</Label>
                <Input
                  type="number"
                  id="capacity"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastInventoryDate">Último Inventario</Label>
                <Input
                  type="date"
                  id="lastInventoryDate"
                  value={formData.lastInventoryDate?.split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, lastInventoryDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notas</Label>
            <textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditWarehouseModal;