import React from "react";
import {
  Search,
  Calendar,
  FileText,
  Receipt,
  Wallet,
  Plus,
  Download,
  BarChart2,
  X,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Eye,
  EyeOff,
} from "lucide-react";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Input } from "@/components/ui/input";
import AIInsights from "@/components/admin/common/AIInsights";
import NewExpenseModal from "@/components/admin/expenses/NewExpenseModal";
import EditExpenseModal from "@/components/admin/expenses/EditExpenseModal";
import { useExpensesTab } from "@/hooks/useExpensesTab";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ExpensesTab: React.FC = () => {
  const {
    isNewExpenseModalOpen,
    setIsNewExpenseModalOpen,
    isChartModalOpen,
    setIsChartModalOpen,
    selectedPeriod,
    setSelectedPeriod,
    searchTerm,
    setSearchTerm,
    filteredExpenses,
    chartData,
    chartOptions,
    categoryChartData,
    paymentChartData,
    handleViewReceipt,
    handleDeleteExpense,
  } = useExpensesTab();

  const [editingExpense, setEditingExpense] = React.useState<any>(null);
  const [expenseToDelete, setExpenseToDelete] = React.useState<any>(null);
  const [showDashboard, setShowDashboard] = React.useState(false);

  // Funciones de traducción
  const translateCategory = (category: string) => {
    switch (category) {
      case "MATERIALS":
        return "Materiales";
      case "TOOLS":
        return "Herramientas";
      case "MARKETING":
        return "Marketing";
      case "SALARIES":
        return "Salarios";
      case "RENT":
        return "Alquiler";
      case "SERVICES":
        return "Servicios";
      default:
        return "Otros";
    }
  };

  const translatePaymentMethod = (paymentMethod: string) => {
    switch (paymentMethod) {
      case "CASH":
        return "Efectivo";
      case "CREDIT_CARD":
        return "Tarjeta de Crédito";
      case "DEBIT_CARD":
        return "Tarjeta de Débito";
      case "BANK_TRANSFER":
        return "Transferencia Bancaria";
      case "CHECK":
        return "Cheque";
      default:
        return "Otro";
    }
  };

  // Stat Card Component
  const StatCard = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: string;
    icon: React.ReactNode;
  }) => (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-primary-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-primary-600">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-primary-900">
            {value}
          </p>
        </div>
        <div className="bg-primary-100 p-2 sm:p-3 rounded-full">{icon}</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6" data-tour="expenses-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-900">
            Gastos y Compras
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona y supervisa todos los gastos y compras
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="flex items-center px-3 py-2 bg-primary-50 text-primary-600 rounded-lg border border-primary-200 hover:bg-primary-100"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {showDashboard ? 'Ocultar Panel' : 'Mostrar Panel'}
            {showDashboard ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </button>
          <button
            onClick={() => setIsNewExpenseModalOpen(true)}
            className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            data-tour="add-expense-btn"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Gasto
          </button>
        </div>
      </div>

      {/* Dashboard Section - Collapsible */}
      {showDashboard && (
        <div className="space-y-6 mb-6">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total de Gastos"
              value={`₡${filteredExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0).toFixed(2)}`}
              icon={<Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
            />
            <StatCard
              title="Promedio por Gasto"
              value={`₡${(
                filteredExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0) /
                  filteredExpenses.length || 0
              ).toFixed(2)}`}
              icon={<Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
            />
            <StatCard
              title="Total de Registros"
              value={filteredExpenses.length.toString()}
              icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
            />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-primary-100">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Gastos por Fecha</h3>
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-primary-100">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Monto por Categoría</h3>
              <div className="h-64 flex justify-center items-center">
                <div style={{ width: 220, height: 220 }}>
                  <Pie data={categoryChartData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-primary-100">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Monto por Tipo de Pago</h3>
              <div className="h-64">
                <Bar data={paymentChartData} options={{ 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } } 
                }} />
              </div>
            </div>
          </div>

          {/* Análisis con IA */}
          <AIInsights data={filteredExpenses} type="expenses" />
        </div>
      )}

      {/* Selector de Período y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6" data-tour="expenses-filters">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
            <Input
              type="text"
              placeholder="Buscar gastos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-primary-200 rounded-lg px-4 py-2 text-sm bg-white"
          >
            <option value="thisMonth">Este Mes</option>
            <option value="last3Months">Últimos 3 Meses</option>
            <option value="thisYear">Este Año</option>
            <option value="all">Todos</option>
          </select>
        </div>
      </div>

      {/* Tabla de gastos */}
      <div className="overflow-x-auto rounded-lg shadow border border-primary-100">
        <table className="min-w-full divide-y divide-primary-100">
          <thead className="bg-primary-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-900">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-900">Descripción</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-900">Categoría</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-900">Monto</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-900">Método de Pago</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-900">Recibo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-primary-900">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-primary-100">
            {filteredExpenses.map((expense: any) => (
              <tr key={expense.id}>
                <td className="px-4 py-3 whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="px-4 py-3">{expense.description}</td>
                <td className="px-4 py-3">{translateCategory(expense.category)}</td>
                <td className="px-4 py-3">₡{expense.amount.toFixed(2)}</td>
                <td className="px-4 py-3">{translatePaymentMethod(expense.paymentMethod)}</td>
                <td className="px-4 py-3">
                  {expense.receipt && (
                    <button
                      onClick={() => handleViewReceipt(expense.receipt)}
                      className="flex items-center text-primary-600 hover:underline"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Ver Recibo
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setEditingExpense(expense)}
                    className="text-primary-600 hover:text-primary-800 mr-2"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setExpenseToDelete(expense)}
                    className="text-red-600 hover:text-red-800 ml-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para nuevo gasto */}
      {isNewExpenseModalOpen && (
        <NewExpenseModal onClose={() => setIsNewExpenseModalOpen(false)} />
      )}

      {/* Modal de gráficos */}
      {isChartModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl relative">
            <button
              onClick={() => setIsChartModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-primary-50 rounded-full"
            >
              <X className="h-5 w-5 text-primary-600" />
            </button>
            <h2 className="text-xl font-semibold text-primary-900 mb-4">
              Gráficos de Gastos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-base font-semibold mb-2">Gastos por Fecha</h3>
                <Line data={chartData} options={chartOptions} />
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2">Monto por Categoría</h3>
                <div className="flex justify-center">
                  <div style={{ width: 220, height: 220 }}>
                    <Pie data={categoryChartData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2">Monto por Tipo de Pago</h3>
                <Bar data={paymentChartData} options={{ plugins: { legend: { display: false } } }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {expenseToDelete && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setExpenseToDelete(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl z-50 flex flex-col justify-center items-center p-6 rounded-lg m-auto">
            <h2 className="text-lg font-semibold mb-4">¿Eliminar gasto?</h2>
            <p className="mb-6 text-center">¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3 w-full">
              <button
                onClick={() => setExpenseToDelete(null)}
                className="px-4 py-2 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleDeleteExpense(expenseToDelete.id);
                  setExpenseToDelete(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal de edición de gasto */}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onExpenseUpdated={(updated: any) => {
            // Aquí se actualiza el gasto en el store o backend
            setEditingExpense(null);
          }}
        />
      )}
    </>
  );
};

export default ExpensesTab;