import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Mail, User, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import type { Warehouse } from '@/types';
import { useWarehouseDetailsModal } from '@/hooks/useWarehouseDetailsModal';


interface WarehouseDetailsModalProps {
  warehouse: Warehouse;
  onClose: () => void;
}

const WarehouseDetailsModal: React.FC<WarehouseDetailsModalProps> = ({ warehouse, onClose }) => {
  const {
    statusColors,
    itemStatusColors,
    occupancyPercent,
    availableSpace,
    formattedLastInventoryDate,
  } = useWarehouseDetailsModal(warehouse);

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
            Detalles del Almacén
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-50 rounded-full"
          >
            <X className="h-5 w-5 text-primary-600" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-primary-900">
                  {warehouse.name}
                </h3>
                <p className="text-primary-600">{warehouse.location}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${statusColors[warehouse.status]}`}>
                {warehouse.status.charAt(0).toUpperCase() + warehouse.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-primary-600">Dirección</p>
                  <p className="font-medium">{warehouse.address}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-primary-600">Encargado</p>
                  <p className="font-medium">{warehouse.manager}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-primary-600">Teléfono</p>
                  <p className="font-medium">{warehouse.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-primary-600">Email</p>
                  <p className="font-medium">{warehouse.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Capacity Information */}
          <div>
            <h4 className="text-lg font-medium text-primary-900 mb-4">Capacidad y Ocupación</h4>
            <div className="bg-primary-50 p-4 rounded-lg space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-primary-900">Ocupación Actual</span>
                  <span className="font-medium text-primary-900">
                    {occupancyPercent}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 rounded-full h-2"
                    style={{
                      width: `${occupancyPercent}%`
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary-900">Capacidad Total</span>
                <span className="font-medium">{warehouse.capacity} unidades</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary-900">Espacio Utilizado</span>
                <span className="font-medium">{warehouse.currentOccupancy} unidades</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary-900">Espacio Disponible</span>
                <span className="font-medium">
                  {availableSpace} unidades
                </span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h4 className="text-lg font-medium text-primary-900 mb-4">Información Adicional</h4>
            <div className="bg-primary-50 p-4 rounded-lg space-y-4">
              <div>
                <p className="text-sm text-primary-600">Último Inventario</p>
                <p className="font-medium">
                  {formattedLastInventoryDate}
                </p>
              </div>
              {warehouse.notes && (
                <div>
                  <p className="text-sm text-primary-600">Notas</p>
                  <p className="font-medium">{warehouse.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WarehouseDetailsModal;