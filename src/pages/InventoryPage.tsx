import React, { useEffect, useState } from 'react';
import { 
  Search, Filter, X,
  ArrowUpDown, Calendar, FileText, Receipt, Wallet,
  Package, Plus, Download, Menu, BarChart2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import PurchaseOrdersTab from '@/components/admin/orders/PurchaseOrdersTab';
import WarehousesTab from '@/components/admin/warehouses/WarehousesTab';
import ProductTab from '@/components/admin/inventory/ProductTab';
import NewExpenseModal from '@/components/admin/expenses/NewExpenseModal';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ExpensesTab from '@/components/admin/expenses/ExpensesTab';
import { setWarehouse } from '@/store/slices/warehousesSlice';
import { warehouseService } from '@/services/warehouseService';
import { Warehouse } from '@/types/warehouse';
import { useAppDispatch } from '@/hooks/useAppDispatch';

// Registrar los elementos necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const InventoryPage = () => {
  const dispatch = useAppDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState('Mensual'); // Estado para el período de tiempo

  // Datos de ejemplo para las gráficas
  const expensesVsOrdersData = {
    labels: timePeriod === 'Mensual' ? ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'] : ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Gastos',
        data: timePeriod === 'Mensual' ? [5000, 4000, 3000, 7000, 2000, 6000] : [15000, 20000, 18000, 22000],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Órdenes de Entrada',
        data: timePeriod === 'Mensual' ? [3000, 5000, 4000, 6000, 7000, 8000] : [12000, 18000, 20000, 25000],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const ordersByCategoryData = {
    labels: ['Anillos', 'Collares', 'Aretes', 'Pulseras'],
    datasets: [
      {
        label: 'Órdenes por Categoría',
        data: [30, 50, 20, 40],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthlyExpensesTrendData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Gastos Mensuales',
        data: [5000, 4000, 3000, 7000, 2000, 6000],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const topSellingCategoriesData = {
    labels: ['Anillos', 'Collares', 'Aretes', 'Pulseras'],
    datasets: [
      {
        label: 'Ventas por Categoría',
        data: [120, 90, 70, 50],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

    // useEffect para obtener los datos de los almacenes
    useEffect(() => {
      const fetchWarehouses = async () => {
        try {
          const response = await warehouseService.getAll();
          dispatch(setWarehouse(response as Warehouse[]));
        } catch (error) {
          console.error('Error al obtener los almacenes:', error);
        }
      };
  
      fetchWarehouses();
    }, []);
  
  

  return (
    <div className="min-h-screen bg-primary-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-[95%] lg:max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-primary-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                <h1 className="text-xl sm:text-2xl font-semibold text-primary-900">
                  Gestión de Inventario
                </h1>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                className="sm:hidden p-2 hover:bg-primary-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-primary-600" />
                ) : (
                  <Menu className="h-6 w-6 text-primary-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden border-b border-primary-100">
              <div className="p-4 space-y-2">
                <button className="w-full flex items-center justify-between p-2 hover:bg-primary-50 rounded-lg">
                  <span className="text-primary-600">Filtros</span>
                  <Filter className="h-5 w-5 text-primary-600" />
                </button>
                <button className="w-full flex items-center justify-between p-2 hover:bg-primary-50 rounded-lg">
                  <span className="text-primary-600">Ordenar</span>
                  <ArrowUpDown className="h-5 w-5 text-primary-600" />
                </button>
                <button className="w-full flex items-center justify-between p-2 hover:bg-primary-50 rounded-lg">
                  <span className="text-primary-600">Exportar</span>
                  <Download className="h-5 w-5 text-primary-600" />
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="dashboard" className="w-full">
            {/* Tab List */}
            <div className="px-4 sm:px-6 pt-4">
              <TabsList className="w-full grid grid-cols-2 sm:grid-cols-5 gap-1 p-1 h-auto sm:h-10">
                <TabsTrigger 
                  value="dashboard" 
                  className="text-xs sm:text-sm md:text-base py-2 sm:py-1.5 px-2 sm:px-3 h-auto"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="inventory" 
                  className="text-xs sm:text-sm md:text-base py-2 sm:py-1.5 px-2 sm:px-3 h-auto"
                >
                  Inventario
                </TabsTrigger>
                <TabsTrigger 
                  value="expenses" 
                  className="text-xs sm:text-sm md:text-base py-2 sm:py-1.5 px-2 sm:px-3 h-auto"
                >
                  Control de Gastos
                </TabsTrigger>
                <TabsTrigger 
                  value="warehouses" 
                  className="text-xs sm:text-sm md:text-base py-2 sm:py-1.5 px-2 sm:px-3 h-auto"
                >
                  Bodegas
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="text-xs sm:text-sm md:text-base py-2 sm:py-1.5 px-2 sm:px-3 h-auto"
                >
                  Ordenes
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <TabsContent value="dashboard" className="p-2 sm:p-4 lg:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfica de Gastos vs Órdenes */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-primary-900 mb-4">
                    Gastos vs Órdenes de Entrada
                  </h2>
                  <Bar data={expensesVsOrdersData} options={chartOptions} />
                </div>

                {/* Gráfica de Órdenes por Categoría */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-primary-900 mb-4">
                    Órdenes por Categoría
                  </h2>
                  <Pie data={ordersByCategoryData} options={chartOptions} />
                </div>

                {/* Gráfica de Tendencia de Gastos Mensuales */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-primary-900 mb-4">
                    Tendencia de Gastos Mensuales
                  </h2>
                  <Line data={monthlyExpensesTrendData} options={chartOptions} />
                </div>

                {/* Gráfica de Categorías Más Vendidas */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-primary-900 mb-4">
                    Categorías Más Vendidas
                  </h2>
                  <Bar data={topSellingCategoriesData} options={{ ...chartOptions, indexAxis: 'y' }} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="p-2 sm:p-4 lg:p-6">
              <ProductTab />
            </TabsContent>

            <TabsContent value="expenses" className="p-2 sm:p-4 lg:p-6">
            <ExpensesTab></ExpensesTab>
            </TabsContent>

            <TabsContent value="warehouses" className="p-2 sm:p-4 lg:p-6">
              <WarehousesTab />
            </TabsContent>

            <TabsContent value="orders" className="p-2 sm:p-4 lg:p-6">
              <PurchaseOrdersTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};



export default InventoryPage;