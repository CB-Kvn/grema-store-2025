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

  // Aquí puedes hacer el update real a la base de datos
  const handleDescuentoChange = (id: string, value: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, descuento: value } : u))
    );
    // Llama a tu API para guardar el descuento aquí si lo necesitas
  };

  
  return (
    <div className="min-h-screen bg-primary-50/70 backdrop-blur-sm py-4 sm:py-6 lg:py-8">
      <div className="max-w-[95%] lg:max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <Card >
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
            <Tabs defaultValue="clientes" className="w-full">
              <TabsList className="flex w-full bg-primary-50 border-b border-primary-200 rounded-none">
                <TabsTrigger
                  value="inventario"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-white data-[state=active]:text-primary-700 text-primary-500 font-semibold transition"
                >
                  Informes
                </TabsTrigger>
                <TabsTrigger
                  value="clientes"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-white data-[state=active]:text-primary-700 text-primary-500 font-semibold transition"
                >
                  Clientes
                </TabsTrigger>
                <TabsTrigger
                  value="productos"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-white data-[state=active]:text-primary-700 text-primary-500 font-semibold transition"
                >
                  Productos
                </TabsTrigger>

                <TabsTrigger
                  value="gastos"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-white data-[state=active]:text-primary-700 text-primary-500 font-semibold transition"
                >
                  Control de gastos
                </TabsTrigger>
                <TabsTrigger
                  value="bodegas"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-white data-[state=active]:text-primary-700 text-primary-500 font-semibold transition"
                >
                  Bodegas
                </TabsTrigger>
                <TabsTrigger
                  value="ordenes"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-white data-[state=active]:text-primary-700 text-primary-500 font-semibold transition"
                >
                  Órdenes
                </TabsTrigger>
                <TabsTrigger
                  value="descuentos"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-white data-[state=active]:text-primary-700 text-primary-500 font-semibold transition"
                >
                  Descuentos
                </TabsTrigger>
              </TabsList>
              <TabsContent className='p-6' value="clientes">
                <UsersTable users={users} onDescuentoChange={handleDescuentoChange} />
              </TabsContent>
              <TabsContent className='p-6' value="productos">
                <ProductTab />
              </TabsContent>
              <TabsContent className='p-6' value="inventario">
                <InventoryDashboard />
              </TabsContent>
              <TabsContent className='p-6' value="gastos">
                <ExpensesTab></ExpensesTab>
              </TabsContent>
              <TabsContent className='p-6' value="bodegas">
                <WarehousesTab />
              </TabsContent>
              <TabsContent className='p-6' value="ordenes">
                <PurchaseOrdersTab />
              </TabsContent>
              <TabsContent value="descuentos">
                <div className="bg-white rounded shadow p-6">
                  <DiscountTab/>
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