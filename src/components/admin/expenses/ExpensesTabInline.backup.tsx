import { 
  Search, 
  Plus, 
  Filter,
  Receipt,
  TrendingUp,
  DollarSign,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Nuevos componentes inline
import ExpenseListView from './ExpenseListView';
import ExpenseDetailsView from './ExpenseDetailsView';
import ExpenseFormView from './ExpenseFormView';
import { useExpensesTab } from '@/hooks/useExpensesTab';

const ExpensesTabInline = () => {
  const {
    filteredExpenses,
    selectedPeriod,
    setSelectedPeriod,
    searchTerm,
    setSearchTerm,
    selectedExpense,
    viewMode,
    handleViewDetails,
    handleEditExpense,
    handleCreateExpense,
    handleBackToList,
    handleSubmit,
    handleDeleteExpense,
  } = useExpensesTab();

  // Calcular estadísticas
  const totalAmount = filteredExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
  const monthlyAverage = filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;
  const categoryCounts = filteredExpenses.reduce((acc: any, expense: any) => {
    acc[expense.category] = (acc[expense.category] || 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryCounts).sort(([,a]: any, [,b]: any) => b - a)[0]?.[0] || 'N/A';

  // Renderizar vista según el modo actual
  const renderCurrentView = () => {
    switch (viewMode) {
      case 'details':
        return selectedExpense ? (
          <ExpenseDetailsView
            expense={selectedExpense}
            onBack={handleBackToList}
            onEdit={() => handleEditExpense(selectedExpense)}
          />
        ) : null;

      case 'edit':
        return (
          <ExpenseFormView
            expense={selectedExpense}
            onBack={handleBackToList}
            onSave={handleSubmit}
          />
        );

      case 'create':
        return (
          <ExpenseFormView
            onBack={handleBackToList}
            onSave={handleSubmit}
          />
        );

      default:
        return (
          <>
            {/* Header con estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
                  <Receipt className="h-4 w-4 text-primary-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary-900">{filteredExpenses.length}</div>
                  <p className="text-xs text-primary-600">
                    En el periodo seleccionado
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary-900">
                    ${totalAmount.toFixed(2)}
                  </div>
                  <p className="text-xs text-primary-600">
                    Promedio: ${monthlyAverage.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categoría Principal</CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700">{topCategory}</div>
                  <p className="text-xs text-primary-600">
                    {categoryCounts[topCategory] || 0} gastos
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Periodo</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">
                    {selectedPeriod === 'thisMonth' ? 'Este mes' : 
                     selectedPeriod === 'last3Months' ? 'Últimos 3M' : 
                     selectedPeriod === 'thisYear' ? 'Este año' : 'Todos'}
                  </div>
                  <p className="text-xs text-primary-600">
                    Filtro actual
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Header con controles */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary-900">Gastos</h2>
                <p className="text-primary-600">Gestiona los gastos y egresos</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar gastos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80"
                  />
                </div>
                
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thisMonth">Este mes</SelectItem>
                    <SelectItem value="last3Months">Últimos 3 meses</SelectItem>
                    <SelectItem value="thisYear">Este año</SelectItem>
                    <SelectItem value="all">Todos</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  onClick={handleCreateExpense}
                  className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo Gasto
                </Button>
              </div>
            </div>

            {/* Lista de gastos */}
            <ExpenseListView
              expenses={filteredExpenses}
              searchQuery={searchTerm}
              onViewDetails={handleViewDetails}
              onEdit={handleEditExpense}
              onDelete={(expenseId) => {
                if (window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
                  handleDeleteExpense(expenseId);
                }
              }}
            />
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderCurrentView()}
    </div>
  );
};

export default ExpensesTabInline;
