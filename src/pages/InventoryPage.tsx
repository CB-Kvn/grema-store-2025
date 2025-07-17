import React, { useEffect, useState } from 'react';
import {
  Search, Filter, X,
  ArrowUpDown, Package, Plus, Download, Menu
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PurchaseOrdersTab from '@/components/admin/orders/PurchaseOrdersTab';
import WarehousesTab from '@/components/admin/warehouses/WarehousesTab';
import ProductTab from '@/components/admin/inventory/ProductTab';
import ExpensesTab from '@/components/admin/expenses/ExpensesTab';
import InventoryDashboard from '@/components/admin/dashboard/InventoryDashboard';
import { useInventoryPage } from "@/hooks/useInventoryPage";
import { authService } from '@/services/authService';
import { UsersTable } from '@/components/admin/users/listUsers';
import { DiscountsTable } from '@/components/admin/discount/discountTable';
import { DiscountTab } from '@/components/admin/discount/discountTab';


// Simulación de fetch
async function getAllUsers() {
  // Reemplaza por tu fetch real

  const response = await authService.getAllUsers();
  return response as []

}


const InventoryPage = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useInventoryPage();
  const [users, setUsers] = useState<any[]>([]);
  

  useEffect(() => {
    getAllUsers().then(setUsers);

  }, []);

  
  return (
    <div className="min-h-screen bg-primary-10/50 backdrop-blur-sm py-2 sm:py-4 md:py-6 lg:py-8">
      <div className="w-full max-w-[98%] sm:max-w-[95%] lg:max-w-7xl xl:max-w-[90%] 2xl:max-w-[85%] mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-primary-100 p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 flex-shrink-0" />
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-primary-900 truncate">
                  Gestión de Inventario
                </CardTitle>
              </div>
              {/* Mobile Menu Button */}
              <button
                className="sm:hidden p-2 hover:bg-primary-50 rounded-lg flex-shrink-0"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Cerrar menú móvil" : "Abrir menú móvil"}
                aria-expanded={isMobileMenuOpen}
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
            <div className="sm:hidden border-b border-primary-100 bg-white">
              <div className="p-3 sm:p-4 space-y-2">
                <button 
                  className="w-full flex items-center justify-between p-3 hover:bg-primary-50 rounded-lg transition-colors"
                  aria-label="Filtrar productos"
                >
                  <span className="text-primary-600 font-medium">Filtros</span>
                  <Filter className="h-5 w-5 text-primary-600" />
                </button>
                <button 
                  className="w-full flex items-center justify-between p-3 hover:bg-primary-50 rounded-lg transition-colors"
                  aria-label="Ordenar productos"
                >
                  <span className="text-primary-600 font-medium">Ordenar</span>
                  <ArrowUpDown className="h-5 w-5 text-primary-600" />
                </button>
                <button 
                  className="w-full flex items-center justify-between p-3 hover:bg-primary-50 rounded-lg transition-colors"
                  aria-label="Exportar datos"
                >
                  <span className="text-primary-600 font-medium">Exportar</span>
                  <Download className="h-5 w-5 text-primary-600" />
                </button>
              </div>
            </div>
          )}

          <CardContent className="p-0">
            <Tabs defaultValue="clientes" className="w-full">
              <TabsList className="flex w-full bg-primary-50 border-b border-primary-200 rounded-none overflow-x-auto">
                <TabsTrigger
                  value="inventario"
                  className="flex-1 min-w-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-white data-[state=active]:text-primary-700 text-primary-500 font-semibold transition text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                >
                  Informes
                </TabsTrigger>
                <TabsTrigger
                  value="clientes"
                  className="flex-1 min-w-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-white data-[state=active]:text-primary-700 text-primary-500 font-semibold transition text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                >
                  Clientes
                </TabsTrigger>
                <TabsTrigger
                  value="productos"
                  className="flex-1 min-w-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-white data-[state=active]:text-primary-700 text-primary-500 font-semibold transition text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                >
                  Productos
                </TabsTrigger>

                <TabsTrigger
                  value="gastos"
                  className="flex-1 min-w-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-white data-[state=active]:text-primary-700 text-primary-500 font-semibold transition text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                >
                  <span className="hidden sm:inline">Control de gastos</span>
                  <span className="sm:hidden">Gastos</span>
                </TabsTrigger>
                <TabsTrigger
                  value="bodegas"
                  className="flex-1 min-w-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-white data-[state=active]:text-primary-700 text-primary-500 font-semibold transition text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                >
                  Bodegas
                </TabsTrigger>
                <TabsTrigger
                  value="ordenes"
                  className="flex-1 min-w-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-white data-[state=active]:text-primary-700 text-primary-500 font-semibold transition text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                >
                  Órdenes
                </TabsTrigger>
                <TabsTrigger
                  value="descuentos"
                  className="flex-1 min-w-0 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-white data-[state=active]:text-primary-700 text-primary-500 font-semibold transition text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                >
                  Descuentos
                </TabsTrigger>
              </TabsList>
              <TabsContent className='p-3 sm:p-4 lg:p-6' value="clientes">
                <div className="overflow-x-auto">
                  <UsersTable users={users} />
                </div>
              </TabsContent>
              <TabsContent className='p-3 sm:p-4 lg:p-6' value="productos">
                <div className="overflow-x-auto">
                  <ProductTab />
                </div>
              </TabsContent>
              <TabsContent className='p-3 sm:p-4 lg:p-6' value="inventario">
                <div className="overflow-x-auto">
                  <InventoryDashboard />
                </div>
              </TabsContent>
              <TabsContent className='p-3 sm:p-4 lg:p-6' value="gastos">
                <div className="overflow-x-auto">
                  <ExpensesTab></ExpensesTab>
                </div>
              </TabsContent>
              <TabsContent className='p-3 sm:p-4 lg:p-6' value="bodegas">
                <div className="overflow-x-auto">
                  <WarehousesTab />
                </div>
              </TabsContent>
              <TabsContent className='p-3 sm:p-4 lg:p-6' value="ordenes">
                <div className="overflow-x-auto">
                  <PurchaseOrdersTab />
                </div>
              </TabsContent>
              <TabsContent className='p-3 sm:p-4 lg:p-6' value="descuentos">
                <div className="bg-white rounded shadow overflow-x-auto">
                  <div className="p-3 sm:p-4 lg:p-6">
                    <DiscountTab/>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryPage;