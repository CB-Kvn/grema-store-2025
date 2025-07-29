import React, { useState } from 'react';
import {
  Warehouse as WarehouseIcon, Search, Filter, Plus, ArrowUpDown,
  Download, Upload, AlertTriangle, CheckCircle2,
  BarChart3, ChevronDown, ChevronUp
} from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import '@/lib/chartConfig'; // Usar configuración global de Chart.js
import { Input } from '../../ui/input';
// Nuevos componentes inline
import WarehouseListView from './WarehouseListView';
import WarehouseDetailsView from './WarehouseDetailsView';
import WarehouseFormView from './WarehouseFormView';
import { useWarehousesTab } from '@/hooks/useWarehousesTab';
import AIInsights from '@/components/admin/common/AIInsights';

const WarehousesTab = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  
  const {
    warehouses,
    searchQuery,
    setSearchQuery,
    selectedWarehouse,
    viewMode,
    setViewMode,
    averageOccupancy,
    lowStockItems,
    handleViewDetails,
    handleEdit,
    handleCreate,
    handleBackToList,
  } = useWarehousesTab();

  // Función para manejar la edición desde la vista de detalles
  const handleEditFromDetails = () => {
    setViewMode('edit');
  };

  // Renderizado condicional usando un solo return para evitar problemas de DOM
  const renderContent = () => {
    // Si estamos en vista de detalles, mostrar el componente de detalles
    if (viewMode === 'details' && selectedWarehouse) {
      return (
        <WarehouseDetailsView
          warehouse={selectedWarehouse}
          onBack={handleBackToList}
          onEdit={handleEditFromDetails}
        />
      );
    }

    // Si estamos en vista de edición o creación, mostrar el formulario
    if (viewMode === 'edit' || viewMode === 'create') {
      return (
        <WarehouseFormView
          warehouse={selectedWarehouse || undefined}
          onBack={handleBackToList}
          mode={viewMode}
        />
      );
    }

    // Vista principal de lista (por defecto)
    return (
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-900">
            Gestión de Almacenes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra inventarios y controla el estado de todos los almacenes
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="flex items-center px-3 py-2 bg-primary-50 text-primary-600 rounded-lg border border-primary-200 hover:bg-primary-100"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {showDashboard ? 'Ocultar Dashboard' : 'Información'}
            {showDashboard ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Almacén
          </button>
        </div>
      </div>

      {/* Dashboard Section - Collapsible */}
      {showDashboard && (
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
              value={warehouses.filter(w => w.status === 'ACTIVE').length.toString()}
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
                      backgroundColor: '#C7D2FE', // Pastel Blue
                      borderColor: '#6366F1', // Indigo border
                      borderWidth: 1,
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
                        warehouses.filter(w => w.status === 'ACTIVE').length,
                        warehouses.filter(w => w.status === 'INACTIVE').length,
                        warehouses.filter(w => w.status === 'MAINTENANCE').length,
                      ],
                      backgroundColor: [
                        '#D1FAE5', // Pastel Green for Active
                        '#F3F4F6', // Light Gray for Inactive
                        '#FEF3C7', // Pastel Yellow for Maintenance
                      ],
                      borderColor: [
                        '#10B981', // Green border
                        '#6B7280', // Gray border
                        '#F59E0B', // Yellow border
                      ],
                      borderWidth: 1,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20,
                          font: {
                            size: 12
                          }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Análisis con IA */}
          <AIInsights data={warehouses} type="warehouses" />
        </div>
      )}

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

      {/* Warehouses Grid - Nueva vista de cards clickeables */}
      <WarehouseListView
        warehouses={warehouses}
        searchQuery={searchQuery}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={(warehouse) => {
          // TODO: Implementar función de eliminación
          console.log('Eliminar warehouse:', warehouse.id);
        }}
      />

    </div>
    );
  };

  // Usar renderContent para evitar múltiples returns que causan problemas de DOM
  return renderContent();
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