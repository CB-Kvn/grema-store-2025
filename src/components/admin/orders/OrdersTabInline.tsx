import {
  Search,
  Plus,
  Filter,
  Package,
  TrendingUp,
  DollarSign,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Componentes inline
import OrderListView from './OrderListView';
import OrderDetailsView from './OrderDetailsView';
import OrderForm from './OrderForm';
import ProductSelectionModal from '../ProductSelectionModal';
import { useOrdersTab } from '@/hooks/useOrdersTab';

const OrdersTabInline = () => {
  const {
    orders,
    selectedOrder,
    viewMode,
    searchQuery,
    statusFilter,
    currentPage,
    totalPages,
    orderFormData,
    orderItems,
    showProductModal,
    handleViewDetails,
    handleEditOrder,
    handleCreateOrder,
    handleBackToList,
    handleDeleteOrder,
    handleSubmit,
    handlePageChange,
    handleViewDocument,
    handleDownloadDocument,
    handleOrderFormChange,
    handleAddProducts,
    handleRemoveOrderItem,
    handleItemChange,
    handleProductSelect,
    handleCloseProductModal,
    handleInventoryAssign,
    setSearchQuery,
    setStatusFilter,
  } = useOrdersTab();

  // Calcular estadísticas básicas
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  // Renderizar vista según el modo actual
  const renderCurrentView = () => {
    switch (viewMode) {
      case 'details':
        return selectedOrder ? (
          <OrderDetailsView
            order={selectedOrder}
            onBack={handleBackToList}
            onEdit={() => handleEditOrder(selectedOrder)}
          />
        ) : null;

      case 'edit':
        return selectedOrder ? (
          <OrderForm
            order={selectedOrder}
            orderItems={orderItems}
            formData={orderFormData}
            onBack={handleBackToList}
            onSave={handleSubmit}
            onFormChange={handleOrderFormChange}
            onAddProducts={handleAddProducts}
            onRemoveItem={handleRemoveOrderItem}
            onItemChange={handleItemChange}
            onInventoryAssign={handleInventoryAssign}
          />
        ) : null;

      case 'create':
        return (
          <OrderForm
            orderItems={orderItems}
            formData={orderFormData}
            onBack={handleBackToList}
            onSave={handleSubmit}
            onFormChange={handleOrderFormChange}
            onAddProducts={handleAddProducts}
            onRemoveItem={handleRemoveOrderItem}
            onItemChange={handleItemChange}
            onInventoryAssign={handleInventoryAssign}
          />
        );

      default:
        return (
          <div className="h-[calc(100vh-115px)] overflow-y-auto pr-2">
            <div className="space-y-6">
              {/* Header con estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                    <p className="text-xs text-muted-foreground">
                      +2 desde el mes pasado
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pendingOrders}</div>
                    <p className="text-xs text-muted-foreground">
                      Requieren atención
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completadas</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{completedOrders}</div>
                    <p className="text-xs text-muted-foreground">
                      +12% este mes
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +8% desde el mes pasado
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Controles y filtros */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar órdenes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="confirmed">Confirmadas</SelectItem>
                      <SelectItem value="shipped">Enviadas</SelectItem>
                      <SelectItem value="delivered">Entregadas</SelectItem>
                      <SelectItem value="cancelled">Canceladas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={handleCreateOrder}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Orden
                  </Button>
                </div>
              </div>


              {/* Lista de órdenes */}
              <OrderListView
                orders={orders}
                searchQuery={searchQuery}
                onViewDetails={handleViewDetails}
                onEdit={handleEditOrder}
                onDelete={handleDeleteOrder}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onViewDocument={handleViewDocument}
                onDownloadDocument={handleDownloadDocument}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 ">
      {renderCurrentView()}

      {/* Modal de selección de productos */}
      {/* <ProductSelectionModal
        isOpen={showProductModal}
        onClose={handleCloseProductModal}
        onSelectProducts={handleProductSelect}
      /> */}
    </div>
  );
};

export default OrdersTabInline;
