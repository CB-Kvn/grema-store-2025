import { 
  Search, 
  Plus, 
  Filter,
  Percent,
  TrendingUp,
  DollarSign,
  Package,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Nuevos componentes inline
import DiscountListView from './DiscountListView';
import { useDiscountsTab } from '@/hooks/useDiscountsTab';

const DiscountsTabInline = () => {
  const {
    discounts: filteredDiscounts,
    loading,
    error,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    handleCreateDiscount,
    handleDeleteDiscount,
    handleToggleStatus,
  } = useDiscountsTab();

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Descuentos</CardTitle>
            <Percent className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-900">{stats.totalDiscounts}</div>
            <p className="text-xs text-primary-600">
              {stats.activeDiscounts} activos
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Descuentos Activos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.activeDiscounts}</div>
            <p className="text-xs text-primary-600">
              {((stats.activeDiscounts / stats.totalDiscounts) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirados</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.expiredDiscounts}</div>
            <p className="text-xs text-primary-600">
              Requieren atención
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {stats.averageDiscount.toFixed(1)}
            </div>
            <p className="text-xs text-primary-600">
              Descuento promedio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-900">Descuentos</h2>
          <p className="text-primary-600">Gestiona ofertas y promociones</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-4 w-4" />
            <Input
              placeholder="Buscar descuentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={handleCreateDiscount}
            variant="gradient"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Descuento
          </Button>
        </div>
      </div>

      {/* Lista de descuentos */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-primary-600 mt-4">Cargando descuentos...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <DiscountListView
          discounts={filteredDiscounts}
          searchQuery={searchQuery}
          onViewDetails={() => {/* TODO: Implementar */}}
          onEdit={() => {/* TODO: Implementar */}}
          onDelete={(discountId) => {
            if (window.confirm('¿Estás seguro de que quieres eliminar este descuento?')) {
              handleDeleteDiscount(discountId);
            }
          }}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
};

export default DiscountsTabInline;
