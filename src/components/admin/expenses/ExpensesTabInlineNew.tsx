import React, { useState } from 'react';
import { useExpensesTab } from '@/hooks/useExpensesTab';
import ExpenseDetailsView from './ExpenseDetailsView';
import ExpenseFormView from './ExpenseFormView';
import { Plus, ChevronDown, ChevronUp, Wallet, Receipt, FileText, Download, Trash2, Edit } from 'lucide-react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { StatCard } from '@/components/ui/StatCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

export const ExpensesTabInline: React.FC = () => {
  const { 
    viewMode, 
    selectedExpense,
    filteredExpenses,
    selectedPeriod,
    setSelectedPeriod,
    searchTerm,
    setSearchTerm,
    chartData,
    chartOptions,
    categoryChartData,
    paymentChartData,
    handleViewReceipt,
    handleDeleteExpense,
    handleCreateExpense,
    handleViewDetails,
    handleEditExpense,
    handleBackToList,
    handleSubmit
  } = useExpensesTab();

  const [showDashboard, setShowDashboard] = useState(true);
  const [expenseToDelete, setExpenseToDelete] = useState<any>(null);

  // Funciones de traducción
  const translateCategory = (category: string) => {
    const translations = {
      'office-supplies': 'Suministros de Oficina',
      'transport': 'Transporte',
      'food': 'Alimentación',
      'utilities': 'Servicios Públicos',
      'rent': 'Alquiler',
      'maintenance': 'Mantenimiento',
      'other': 'Otros'
    };
    return translations[category as keyof typeof translations] || category;
  };

  const translatePaymentMethod = (method: string) => {
    const translations = {
      'cash': 'Efectivo',
      'card': 'Tarjeta',
      'transfer': 'Transferencia',
      'check': 'Cheque'
    };
    return translations[method as keyof typeof translations] || method;
  };

  const confirmDelete = (expense: any) => {
    setExpenseToDelete(expense);
  };

  const executeDelete = () => {
    if (expenseToDelete) {
      handleDeleteExpense(expenseToDelete.id);
      setExpenseToDelete(null);
    }
  };

  switch (viewMode) {
    case 'details':
      return (
        <ExpenseDetailsView 
          expense={selectedExpense!} 
          onBack={handleBackToList}
          onEdit={() => handleEditExpense(selectedExpense!)}
        />
      );
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
        <div className="space-y-6">
          {/* Header con controles */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-4 lg:space-y-0 lg:space-x-4 lg:flex lg:items-center">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                data-tour="expense-period-filter"
              >
                <option value="all">Todos</option>
                <option value="thisMonth">Este mes</option>
                <option value="last3Months">Últimos 3 meses</option>
                <option value="thisYear">Este año</option>
              </select>
              <input
                type="text"
                placeholder="Buscar gastos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                data-tour="expense-search"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowDashboard(!showDashboard)}
                className="flex items-center px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
                data-tour="dashboard-toggle"
              >
                {showDashboard ? 'Ocultar Panel' : 'Mostrar Panel'}
                {showDashboard ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </button>
              <button
                onClick={handleCreateExpense}
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
                  <h3 className="text-base font-semibold mb-2">Monto por Categoría</h3>
                  <div className="flex justify-center">
                    <div style={{ width: 220, height: 220 }}>
                      <Pie data={categoryChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-primary-100">
                  <h3 className="text-base font-semibold mb-2">Monto por Tipo de Pago</h3>
                  <Bar data={paymentChartData} options={{ plugins: { legend: { display: false } } }} />
                </div>
              </div>
            </div>
          )}

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
                  <tr key={expense.id} className="hover:bg-primary-50">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</td>
                    <td 
                      className="px-4 py-3 cursor-pointer hover:text-primary-600"
                      onClick={() => handleViewDetails(expense)}
                    >
                      {expense.description}
                    </td>
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
                        onClick={() => handleEditExpense(expense)}
                        className="text-primary-600 hover:text-primary-800 mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(expense)}
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
                    onClick={executeDelete}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      );
  }
};

export default ExpensesTabInline;
