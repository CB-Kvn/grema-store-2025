import React, { useEffect, useState } from 'react';
import {
  Package
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PurchaseOrdersTab from '@/components/admin/orders/PurchaseOrdersTab';
import WarehousesTab from '@/components/admin/warehouses/WarehousesTab';
import ProductTab from '@/components/admin/inventory/ProductTab';
import ExpensesTab from '@/components/admin/expenses/ExpensesTab';
import InventoryDashboard from '@/components/admin/dashboard/InventoryDashboard';
import { authService } from '@/services/authService';
import { UsersTable } from '@/components/admin/users/listUsers';
import { DiscountTab } from '@/components/admin/discount/discountTab';


// Simulación de fetch
async function getAllUsers() {
  // Reemplaza por tu fetch real

  const response = await authService.getAllUsers();
  return response as []

}


const InventoryPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('clientes');
  
  const tabs = [
    { value: 'inventario', label: 'Informes' },
    { value: 'clientes', label: 'Clientes' },
    { value: 'productos', label: 'Productos' },
    { value: 'gastos', label: 'Control de gastos' },
    { value: 'bodegas', label: 'Bodegas' },
    { value: 'ordenes', label: 'Órdenes' },
    { value: 'descuentos', label: 'Descuentos' }
  ];
  

  useEffect(() => {
    getAllUsers().then(setUsers);

  }, []);

  
  return (
    <div className="min-h-screen bg-primary-10/50 backdrop-blur-sm py-4 sm:py-6 lg:py-8">
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
              {/* <button
                className="sm:hidden p-2 hover:bg-primary-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Cerrar menú móvil" : "Abrir menú móvil"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-primary-600" />
                ) : (
                  <Menu className="h-6 w-6 text-primary-600" />
                )}
              </button> */}
            </div>
          </CardHeader>

          {/* Mobile Menu */}
          {/* {isMobileMenuOpen && (
            <div className="sm:hidden border-b border-primary-100">
              <div className="p-4 space-y-2">
                <button 
                  className="w-full flex items-center justify-between p-2 hover:bg-primary-50 rounded-lg"
                  aria-label="Filtrar productos"
                >
                  <span className="text-primary-600">Filtros</span>
                  <Filter className="h-5 w-5 text-primary-600" />
                </button>
                <button 
                  className="w-full flex items-center justify-between p-2 hover:bg-primary-50 rounded-lg"
                  aria-label="Ordenar productos"
                >
                  <span className="text-primary-600">Ordenar</span>
                  <ArrowUpDown className="h-5 w-5 text-primary-600" />
                </button>
                <button 
                  className="w-full flex items-center justify-between p-2 hover:bg-primary-50 rounded-lg"
                  aria-label="Exportar datos"
                >
                  <span className="text-primary-600">Exportar</span>
                  <Download className="h-5 w-5 text-primary-600" />
                </button>
              </div>
            </div>
          )} */}

          <CardContent className="p-0">
            {/* Desktop Tabs */}
            <div className="hidden lg:block">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex w-full bg-primary-50 border-b border-primary-200 rounded-none">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-white data-[state=active]:text-primary-700 text-primary-500 font-semibold transition text-xs xl:text-sm"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {tabs.map((tab) => (
                  <TabsContent key={tab.value} className='p-6' value={tab.value}>
                    {tab.value === 'clientes' && <UsersTable users={users} />}
                    {tab.value === 'productos' && <ProductTab />}
                    {tab.value === 'inventario' && <InventoryDashboard />}
                    {tab.value === 'gastos' && <ExpensesTab />}
                    {tab.value === 'bodegas' && <WarehousesTab />}
                    {tab.value === 'ordenes' && <PurchaseOrdersTab />}
                    {tab.value === 'descuentos' && (
                      <div className="bg-white rounded shadow p-6">
                        <DiscountTab/>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Mobile/Tablet Select */}
            <div className="lg:hidden">
              <div className="bg-primary-50 border-b border-primary-200 p-4">
                <Select value={activeTab} onValueChange={setActiveTab}>
                  <SelectTrigger className="w-full bg-white border border-primary-300 text-primary-700 font-semibold">
                    <SelectValue placeholder="Selecciona una sección" />
                  </SelectTrigger>
                  <SelectContent>
                    {tabs.map((tab) => (
                      <SelectItem key={tab.value} value={tab.value} className="font-medium">
                        {tab.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 sm:p-6">
                {activeTab === 'clientes' && <UsersTable users={users} />}
                {activeTab === 'productos' && <ProductTab />}
                {activeTab === 'inventario' && <InventoryDashboard />}
                {activeTab === 'gastos' && <ExpensesTab />}
                {activeTab === 'bodegas' && <WarehousesTab />}
                {activeTab === 'ordenes' && <PurchaseOrdersTab />}
                {activeTab === 'descuentos' && (
                  <div className="bg-white rounded shadow p-4 sm:p-6">
                    <DiscountTab/>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryPage;