import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Phone, Mail, User, Package, 
  Calendar, BarChart3 
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import type { Warehouse } from '@/types';

interface WarehouseDetailsViewProps {
  warehouse: Warehouse;
  onBack: () => void;
  onEdit: () => void;
}

const WarehouseDetailsView: React.FC<WarehouseDetailsViewProps> = ({ 
  warehouse, 
  onBack, 
  onEdit 
}) => {
  const occupancyPercent = (warehouse.currentOccupancy / warehouse.capacity) * 100;
  const availableSpace = warehouse.capacity - warehouse.currentOccupancy;
  
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    INACTIVE: 'bg-gray-100 text-gray-800 border-gray-200',
    MAINTENANCE: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  const statusLabels = {
    ACTIVE: 'Activo',
    INACTIVE: 'Inactivo', 
    MAINTENANCE: 'Mantenimiento'
  };

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
              Detalles del Almacén
            </h1>
            <p className="text-primary-600">
              Información completa de {warehouse.name}
            </p>
          </div>
        </div>
        <Button
          onClick={onEdit}
          className="bg-primary-600 hover:bg-primary-700 text-white"
        >
          Editar Almacén
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-primary-600" />
              <span>Información Básica</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-primary-900">
                {warehouse.name}
              </h3>
              <span className={`inline-block px-3 py-1 rounded-full text-sm border ${statusColors[warehouse.status]}`}>
                {statusLabels[warehouse.status]}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary-600" />
                <div>
                  <p className="font-medium text-primary-900">{warehouse.location}</p>
                  <p className="text-sm text-primary-600">{warehouse.address}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-primary-600" />
                <div>
                  <p className="font-medium text-primary-900">{warehouse.manager}</p>
                  <p className="text-sm text-primary-600">Encargado</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-600" />
                <p className="text-primary-900">{warehouse.phone}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-600" />
                <p className="text-primary-900">{warehouse.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas de Capacidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              <span>Capacidad y Ocupación</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-900">
                {occupancyPercent.toFixed(1)}%
              </div>
              <p className="text-primary-600">Ocupación actual</p>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-primary-600 rounded-full h-4 transition-all duration-300"
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-primary-50 rounded-lg p-3">
                <div className="text-xl font-semibold text-primary-900">
                  {warehouse.currentOccupancy}
                </div>
                <p className="text-sm text-primary-600">Ocupado</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xl font-semibold text-gray-900">
                  {availableSpace}
                </div>
                <p className="text-sm text-gray-600">Disponible</p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-primary-100">
              <div className="flex justify-between">
                <span className="text-primary-600">Capacidad Total:</span>
                <span className="font-semibold text-primary-900">
                  {warehouse.capacity} unidades
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Último Inventario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary-600" />
              <span>Último Inventario</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-lg font-semibold text-primary-900">
                {warehouse.lastInventoryDate 
                  ? format(new Date(warehouse.lastInventoryDate), 'dd/MM/yyyy')
                  : 'No disponible'
                }
              </div>
              <p className="text-primary-600">
                {warehouse.lastInventoryDate 
                  ? `Hace ${Math.floor((Date.now() - new Date(warehouse.lastInventoryDate).getTime()) / (1000 * 60 * 60 * 24))} días`
                  : 'Sin fecha de inventario'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notas */}
        {warehouse.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-900 whitespace-pre-wrap">
                {warehouse.notes}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Items del Almacén */}
      {warehouse.items && warehouse.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Items en el Almacén</span>
              <span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded">
                {warehouse.items.length} items
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {warehouse.items.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-primary-900">{item.productName}</p>
                    <p className="text-sm text-primary-600">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-900">{item.quantity}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'in_stock' ? 'bg-green-100 text-green-700' :
                      item.status === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status === 'in_stock' ? 'En Stock' :
                       item.status === 'low_stock' ? 'Stock Bajo' : 'Sin Stock'}
                    </span>
                  </div>
                </div>
              ))}
              {warehouse.items.length > 5 && (
                <p className="text-center text-primary-600 text-sm">
                  y {warehouse.items.length - 5} items más...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default WarehouseDetailsView;
