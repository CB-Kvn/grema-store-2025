import { useEffect, useState, useRef } from 'react';
import {
  Package, Users, Box, DollarSign, Building2, ShoppingCart,
  Percent, BarChart3, X, Menu, Home, LogOut, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import OrdersTabInline from '@/components/admin/orders/OrdersTabInline';
import WarehousesTab from '@/components/admin/warehouses/WarehousesTab';
import ProductTab from '@/components/admin/inventory/ProductTab';
import ExpensesTabInline from '@/components/admin/expenses/ExpensesTabInline';
import InventoryDashboard from '@/components/admin/dashboard/InventoryDashboard';
import { authService } from '@/services/authService';
import { UsersTable } from '@/components/admin/users/listUsers';
import DiscountsTabInline from '@/components/admin/discount/DiscountsTabInline';
import { AdminTourButton } from '@/components/admin/common/AdminTourButton';
import { useAutoTourInit } from '@/hooks/useAutoTourInit';
import { useInventoryPage } from '@/hooks/useInventoryPage';
import { useNavigate } from 'react-router-dom';
import { useAuthGoogleContext } from '@/context/ContextAuth';
import '@/styles/tour.css';

// Simulación de fetch
async function getAllUsers() {
  // Reemplaza por tu fetch real
  const response = await authService.getAllUsers();
  return response as []
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition-all duration-200 relative group ${isActive
        ? 'bg-primary-600 text-white shadow-lg'
        : 'text-primary-700 hover:bg-primary-50 hover:text-primary-800'
      }`}
  >
    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-primary-600'} transition-colors`} />
    <span className="font-medium">{label}</span>
    {isActive && (
      <motion.div
        layoutId="activeTab"
        className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"
        initial={false}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${isActive ? 'rotate-90 text-white' : 'text-primary-400'}`} />
  </motion.button>
);

const InventoryPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('inventario');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Iniciar como oculto por defecto
  const contentRef = useRef<HTMLElement>(null);

  const navigate = useNavigate();
  const { user, logout } = useAuthGoogleContext();

  // Hook para inicializar tour automáticamente (sin ciclos infinitos)
  useAutoTourInit();

  // Hook para cargar información de bodegas automáticamente
  useInventoryPage();

  const tabs = [
    { value: 'inventario', label: 'Informes', icon: BarChart3 },
    { value: 'clientes', label: 'Clientes', icon: Users },
    { value: 'productos', label: 'Productos', icon: Box },
    { value: 'gastos', label: 'Control de gastos', icon: DollarSign },
    { value: 'bodegas', label: 'Bodegas', icon: Building2 },
    { value: 'ordenes', label: 'Órdenes', icon: ShoppingCart },
    { value: 'descuentos', label: 'Descuentos', icon: Percent }
  ];

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  // Manejar el estado inicial del sidebar según el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsSidebarCollapsed(false); // Mostrar sidebar en desktop
      } else {
        setIsSidebarCollapsed(true); // Ocultar sidebar en móvil/tablet
      }
    };

    // Ejecutar al montar el componente
    handleResize();

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'clientes':
        return (
          <div className="p-6 h-full overflow-auto">
            <UsersTable users={users} />
          </div>
        );
      case 'productos':
        return (
          <div className="p-6 h-full overflow-auto">
            <ProductTab />
          </div>
        );
      case 'inventario':
        return (
          <div className="p-6 h-full overflow-auto">
            <InventoryDashboard />
          </div>
        );
      case 'gastos':
        return (
          <div className="p-6 h-full overflow-auto">
            <ExpensesTabInline />
          </div>
        );
      case 'bodegas':
        return (
          <div className="p-6 h-full overflow-auto">
            <WarehousesTab />
          </div>
        );
      case 'ordenes':
        return (
          <div className="p-6 h-full overflow-auto">
            <OrdersTabInline />
          </div>
        );
      case 'descuentos':
        return (
          <div className="p-6 h-full overflow-auto">
            <DiscountsTabInline />
          </div>
        );
      default:
        return (
          <div className="p-6 h-full overflow-auto">
            <InventoryDashboard />
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-primary-10/30 flex overflow-hidden">
      {/* Overlay para cerrar sidebar en móvil - solo visible cuando sidebar está abierto */}
      <AnimatePresence>
        {!isSidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarCollapsed(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isSidebarCollapsed ? '-100%' : 0,
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed lg:relative z-50 h-full w-80 bg-white shadow-2xl lg:shadow-xl border-r border-primary-200 flex flex-col lg:translate-x-0"
      >
        {/* Header del Sidebar */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Admin Panel</h1>
              <p className="text-primary-100 text-sm">Gestión de Inventario</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(true)}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-6 py-4 border-b border-primary-100 bg-primary-50/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-primary-900 text-sm">{user.name}</p>
                <p className="text-primary-600 text-xs">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <SidebarItem
                key={tab.value}
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.value}
                onClick={() => setActiveTab(tab.value)}
              />
            ))}
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-primary-100 p-4 space-y-2">
          <Button
            variant="ghost"
            onClick={handleGoHome}
            className="w-full justify-start text-primary-700 hover:bg-primary-50"
          >
            <Home className="h-4 w-4 mr-3" />
            Ir al Inicio
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Cerrar Sesión
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-primary-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-primary-600 hover:bg-primary-50"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold text-primary-900">
                {tabs.find(tab => tab.value === activeTab)?.label || 'Panel de Control'}
              </h2>
              <p className="text-primary-600 text-sm">Gestiona tu inventario y ventas</p>
            </div>
          </div>

          {/* Tour Button */}
          <AdminTourButton currentTab={activeTab} onTabChange={setActiveTab} />
        </header>

        {/* Content Area */}
        <main ref={contentRef} className="flex-1 overflow-hidden bg-primary-10/20">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderTabContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default InventoryPage;