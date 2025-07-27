import React from 'react';
import { motion } from 'framer-motion';
import { 
  Warehouse as WarehouseIcon, Eye, Edit, Trash2, 
  MapPin, User, Phone, Package 
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import type { Warehouse } from '@/types';
import { warehouseService } from '@/services';
import { deleteWarehouse } from '@/store/slices/warehousesSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';

interface WarehouseListViewProps {
  warehouses: Warehouse[];
  searchQuery: string;
  onViewDetails: (warehouse: Warehouse) => void;
  onEdit: (warehouse: Warehouse) => void;
  onDelete?: (warehouse: Warehouse) => void;
}

const WarehouseListView: React.FC<WarehouseListViewProps> = ({
  warehouses,
  searchQuery,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  const dispatch = useAppDispatch();
  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    warehouse.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Activo';
      case 'MAINTENANCE':
        return 'Mantenimiento';
      default:
        return 'Inactivo';
    }
  };

  if (filteredWarehouses.length === 0) {
    return (
      <div className="text-center py-12">
        <WarehouseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No se encontraron bodegas
        </h3>
        <p className="text-gray-500">
          {searchQuery 
            ? 'Prueba con otros términos de búsqueda'
            : 'Aún no hay bodegas registradas'
          }
        </p>
      </div>
    );
  }

  const deleteWarehouseList = async (warehouseId: string) => {
    try {

      await warehouseService.delete(warehouseId);
      dispatch(deleteWarehouse(warehouseId));

    } catch (err) {

      console.error('Error deleting warehouse:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredWarehouses.map((warehouse, index) => {
        const occupancyPercent = (warehouse.currentOccupancy / warehouse.capacity) * 100;
        
        return (
          <motion.div
            key={warehouse.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-primary-200 hover:border-primary-300">
              <CardContent className="p-6">
                {/* Header con nombre y estado */}
                <div 
                  className="flex items-start justify-between mb-4"
                  onClick={() => onViewDetails(warehouse)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <WarehouseIcon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-900 group-hover:text-primary-700">
                        {warehouse.name}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs border ${getStatusColor(warehouse.status)}`}>
                        {getStatusLabel(warehouse.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información clickeable */}
                <div 
                  className="space-y-3 mb-4"
                  onClick={() => onViewDetails(warehouse)}
                >
                  <div className="flex items-center space-x-2 text-sm text-primary-600">
                    <MapPin className="h-4 w-4" />
                    <span>{warehouse.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-primary-600">
                    <User className="h-4 w-4" />
                    <span>{warehouse.manager}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-primary-600">
                    <Phone className="h-4 w-4" />
                    <span>{warehouse.phone}</span>
                  </div>
                </div>

                {/* Barra de ocupación clickeable */}
                <div 
                  className="mb-4"
                  onClick={() => onViewDetails(warehouse)}
                >
                  <div className="flex justify-between text-sm text-primary-700 mb-2">
                    <span>Ocupación</span>
                    <span>{occupancyPercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-primary-500 mt-1">
                    <span>{warehouse.currentOccupancy} ocupado</span>
                    <span>{warehouse.capacity} total</span>
                  </div>
                </div>

                {/* Último inventario clickeable */}
                <div 
                  className="mb-4 p-3 bg-primary-50 rounded-lg"
                  onClick={() => onViewDetails(warehouse)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-primary-600" />
                      <span className="text-sm text-primary-700">Último Inventario</span>
                    </div>
                    <span className="text-sm font-medium text-primary-900">
                      {warehouse.lastInventoryDate 
                        ? format(new Date(warehouse.lastInventoryDate), 'dd/MM/yyyy')
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end space-x-2 pt-2 border-t border-primary-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(warehouse);
                    }}
                    className="text-primary-600 hover:bg-primary-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(warehouse);
                    }}
                    className="text-primary-600 hover:bg-primary-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteWarehouseList(warehouse.id);
                      }}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WarehouseListView;
