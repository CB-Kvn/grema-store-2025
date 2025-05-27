import React from 'react';
import {
  Warehouse as WarehouseIcon, Search, Filter, Plus, ArrowUpDown,
  Download, Upload, AlertTriangle, CheckCircle2,
  Settings, Eye, Edit, Trash2, BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Input } from '../../ui/input';
import WarehouseDetailsModal from './WarehouseDetailsModal';
import EditWarehouseModal from './EditWarehouseModal';
import AddWarehouseModal from './AddWarehouseModal';
import { useWarehousesTab } from '@/hooks/useWarehousesTab';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const WarehousesTab = () => {
  const {
    warehouses,
    searchQuery,
    setSearchQuery,
    selectedWarehouse,
    setSelectedWarehouse,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,
    filteredWarehouses,
    averageOccupancy,
    lowStockItems,
    handleViewDetails,
    handleEdit,
  } = useWarehousesTab();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Almacenes"
          value={warehouses.length.toString()}
          icon={<WarehouseIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
        />
        <StatCard
          title="Ocupación Promedio"
          value={`${averageOccupancy.toFixed(1)}%`}
          icon={<BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
        />
        <StatCard
          title="Productos Bajo Stock"
          value={lowStockItems.toString()}
          icon={<AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
        />
        <StatCard
          title="Almacenes Activos"
          value={warehouses.filter(w => w.status === 'active').length.toString()}
          icon={<CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-primary-100">
          <h3 className="text-base sm:text-lg font-semibold text-primary-900 mb-4">
            Ocupación por Almacén
          </h3>
          <div className="h-48 sm:h-64">
            <Bar
              data={{
                labels: warehouses.map(w => w.name),
                datasets: [{
                  label: 'Ocupación',
                  data: warehouses.map(w => (w.currentOccupancy / w.capacity) * 100),
                  backgroundColor: '#60A5FA',
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: value => `${value}%`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-primary-100">
          <h3 className="text-base sm:text-lg font-semibold text-primary-900 mb-4">
            Estado de Almacenes
          </h3>
          <div className="h-48 sm:h-64">
            <Doughnut
              data={{
                labels: ['Activo', 'Inactivo', 'Mantenimiento'],
                datasets: [{
                  data: [
                    warehouses.filter(w => w.status === 'active').length,
                    warehouses.filter(w => w.status === 'inactive').length,
                    warehouses.filter(w => w.status === 'maintenance').length,
                  ],
                  backgroundColor: ['#34D399', '#9CA3AF', '#FCD34D'],
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o ubicación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>Nuevo Almacén</span>
          </button>
          <div className="hidden sm:flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 bg-white border border-primary-200 rounded-lg hover:bg-primary-50">
              <Filter className="h-5 w-5 text-primary-600 mr-2" />
              <span>Filtrar</span>
            </button>
            <button className="flex items-center px-3 py-2 bg-white border border-primary-200 rounded-lg hover:bg-primary-50">
              <ArrowUpDown className="h-5 w-5 text-primary-600 mr-2" />
              <span>Ordenar</span>
            </button>
            <button className="flex items-center px-3 py-2 bg-white border border-primary-200 rounded-lg hover:bg-primary-50">
              <Download className="h-5 w-5 text-primary-600 mr-2" />
              <span>Exportar</span>
            </button>
            <button className="flex items-center px-3 py-2 bg-white border border-primary-200 rounded-lg hover:bg-primary-50">
              <Upload className="h-5 w-5 text-primary-600 mr-2" />
              <span>Importar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Warehouses Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-50">
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Almacén</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Ubicación</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Encargado</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Estado</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Ocupación</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Último Inventario</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredWarehouses.map((warehouse) => (
              <tr key={warehouse.id} className="border-b border-primary-100">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <WarehouseIcon className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm sm:text-base font-medium text-primary-900">{warehouse.name}</p>
                      <p className="text-xs sm:text-sm text-primary-500">{warehouse.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm sm:text-base text-primary-900">{warehouse.location}</p>
                  <p className="text-xs sm:text-sm text-primary-500">{warehouse.address}</p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm sm:text-base text-primary-900">{warehouse.manager}</p>
                  <p className="text-xs sm:text-sm text-primary-500">{warehouse.email}</p>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs sm:text-sm ${warehouse.status === 'active' ? 'bg-green-100 text-green-800' :
                      warehouse.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {warehouse.status === 'active' ? 'Activo' :
                      warehouse.status === 'maintenance' ? 'Mantenimiento' :
                        'Inactivo'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 rounded-full h-2"
                        style={{
                          width: `${(warehouse.currentOccupancy / warehouse.capacity) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm text-primary-600">
                      {((warehouse.currentOccupancy / warehouse.capacity) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-primary-500 mt-1">
                    {warehouse.currentOccupancy} / {warehouse.capacity} unidades
                  </p>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm sm:text-base text-primary-900">
                    {warehouse.lastInventoryDate ? format(new Date(warehouse.lastInventoryDate), 'dd/MM/yyyy') : 'No disponible'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleViewDetails(warehouse)}
                      className="p-1 hover:bg-primary-50 rounded"
                      title="Ver Detalles"
                    >
                      <Eye className="h-4 w-4 text-primary-600" />
                    </button>
                    <button
                      onClick={() => handleEdit(warehouse)}
                      className="p-1 hover:bg-primary-50 rounded"
                      title="Editar Almacén"
                    >
                      <Edit className="h-4 w-4 text-primary-600" />
                    </button>
                    <button
                      className="p-1 hover:bg-primary-50 rounded"
                      title="Configuración"
                    >
                      <Settings className="h-4 w-4 text-primary-600" />
                    </button>
                    <button
                      className="p-1 hover:bg-primary-50 rounded"
                      title="Eliminar Almacén"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isDetailsModalOpen && selectedWarehouse && (
        <WarehouseDetailsModal
          warehouse={selectedWarehouse}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedWarehouse(null);
          }}
        />
      )}

      {isEditModalOpen && selectedWarehouse && (
        <EditWarehouseModal
          warehouse={selectedWarehouse}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedWarehouse(null);
          }}
        />
      )}

      {isAddModalOpen && (
        <AddWarehouseModal
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-primary-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-primary-600">{title}</p>
        <p className="text-lg sm:text-2xl font-bold text-primary-900">{value}</p>
      </div>
      <div className="bg-primary-100 p-2 sm:p-3 rounded-full">
        {icon}
      </div>
    </div>
  </div>
);

export default WarehousesTab;