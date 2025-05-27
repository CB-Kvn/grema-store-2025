import React from 'react';
import { 
  Search, Filter, X,
  ArrowUpDown, Package, Plus, Download, Menu
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PurchaseOrdersTab from '@/components/admin/orders/PurchaseOrdersTab';
import WarehousesTab from '@/components/admin/warehouses/WarehousesTab';
import ProductTab from '@/components/admin/inventory/ProductTab';
import ExpensesTab from '@/components/admin/expenses/ExpensesTab';
import InventoryDashboard from '@/components/admin/dashboard/InventoryDashboard';
import { useInventoryPage } from "@/hooks/useInventoryPage";

const InventoryPage = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useInventoryPage();

  return (
    <div className="min-h-screen bg-primary-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-[95%] lg:max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <Card>
          <CardHeader className="border-b border-primary-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                <CardTitle className="text-xl sm:text-2xl font-semibold text-primary-900">
                  Gestión de Inventario
                </CardTitle>
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
          </CardHeader>

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

          <CardContent className="p-0">
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
                <InventoryDashboard />
              </TabsContent>
              <TabsContent value="inventory" className="p-2 sm:p-4 lg:p-6">
                <ProductTab />
              </TabsContent>
              <TabsContent value="expenses" className="p-2 sm:p-4 lg:p-6">
                <ExpensesTab />
              </TabsContent>
              <TabsContent value="warehouses" className="p-2 sm:p-4 lg:p-6">
                <WarehousesTab />
              </TabsContent>
              <TabsContent value="orders" className="p-2 sm:p-4 lg:p-6">
                <PurchaseOrdersTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryPage;