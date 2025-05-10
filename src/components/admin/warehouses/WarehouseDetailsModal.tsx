import React from 'react';
import { X, MapPin, Phone, Mail, User, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import type { Warehouse } from '@/types';

interface WarehouseDetailsModalProps {
  warehouse: Warehouse;
  onClose: () => void;
}

const WarehouseDetailsModal: React.FC<WarehouseDetailsModalProps> = ({ warehouse, onClose }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
  };

  const itemStatusColors = {
    in_stock: 'bg-green-100 text-green-800',
    low_stock: 'bg-yellow-100 text-yellow-800',
    out_of_stock: 'bg-red-100 text-red-800',
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
                    {((warehouse.currentOccupancy / warehouse.capacity) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 rounded-full h-2"
                    style={{
                      width: `${(warehouse.currentOccupancy / warehouse.capacity) * 100}%`
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
                  {warehouse.capacity - warehouse.currentOccupancy} unidades
                </span>
              </div>
            </div>
          </div>

          {/* Inventory Items */}
          <div>
            <h4 className="text-lg font-medium text-primary-900 mb-4">Inventario</h4>
            <div className="space-y-4">
              {warehouse.items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-primary-50 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-primary-900">{item.productName}</h5>
                      <p className="text-sm text-primary-500">SKU: {item.sku}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${itemStatusColors[item.status]}`}>
                      {item.status === 'in_stock' ? 'En Stock' :
                       item.status === 'low_stock' ? 'Stock Bajo' :
                       'Sin Stock'}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-primary-600">Cantidad</p>
                      <p className="font-medium">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-primary-600">Stock Mínimo</p>
                      <p className="font-medium">{item.minimumStock}</p>
                    </div>
                    <div>
                      <p className="text-sm text-primary-600">Ubicación</p>
                      <p className="font-medium">{item.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-primary-600">Última Actualización</p>
                      <p className="font-medium">
                        {format(new Date(item.lastUpdated), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                  {item.status === 'low_stock' && (
                    <div className="mt-2 flex items-center text-yellow-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Stock bajo el mínimo requerido</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h4 className="text-lg font-medium text-primary-900 mb-4">Información Adicional</h4>
            <div className="bg-primary-50 p-4 rounded-lg space-y-4">
              <div>
                <p className="text-sm text-primary-600">Último Inventario</p>
                <p className="font-medium">
                  {warehouse.lastInventoryDate
                    ? format(new Date(warehouse.lastInventoryDate), 'dd/MM/yyyy')
                    : 'No disponible'}
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