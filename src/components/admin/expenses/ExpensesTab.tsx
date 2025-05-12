import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { Line } from "react-chartjs-2";
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
import NewExpenseModal from "@/components/admin/expenses/NewExpenseModal";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setExpenses } from "@/store/slices/expensesSlice";
import { expenseService } from "@/services/expenseService";
import { Expense } from "@/types/expense";
import { useAppSelector } from "@/hooks/useAppSelector";

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
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses.items);

  const handleViewReceipt = async (receiptUrl: string) => {
  try {
    await expenseService.downloadFile(receiptUrl);
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
};

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await expenseService.getAll();
        if (Array.isArray(response)) {
          dispatch(setExpenses(response as Expense[]));
        } else {
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        console.error("Error al obtener los gastos:", error);
      }
    };

    fetchExpenses();
  }, [dispatch]);

  const filteredExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      const now = new Date();

      if (selectedPeriod === "thisMonth") {
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      } else if (selectedPeriod === "last3Months") {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return expenseDate >= threeMonthsAgo && expenseDate <= now;
      } else if (selectedPeriod === "thisYear") {
        return expenseDate.getFullYear() === now.getFullYear();
      } else {
        return true;
      }
    })
    .filter((expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    ); // Filtrar por término de búsqueda

  // Preparar datos para el gráfico
  const chartData = {
    labels: filteredExpenses.map((expense) =>
      new Date(expense.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Gastos",
        data: filteredExpenses.map((expense) => expense.amount),
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Gastos por Fecha",
      },
    },
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
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Gastos"
          value={`₡${filteredExpenses
            .reduce((sum, expense) => sum + expense.amount, 0)
            .toFixed(2)}`}
          icon={<Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
        />
        <StatCard
          title="Promedio por Gasto"
          value={`₡${(
            filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0) /
            filteredExpenses.length || 0
          ).toFixed(2)}`}
          icon={<Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
        />
        <StatCard
          title="Total Registros"
          value={filteredExpenses.length.toString()}
          icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
        />
      </div>

      {/* Selector de Período y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
            <Input
              type="text"
              placeholder="Buscar gastos..."
              value={searchTerm} // Enlazar el estado del término de búsqueda
              onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
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

          <button
            onClick={() => setIsNewExpenseModalOpen(true)}
            className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 text-white mr-2" />
            <span>Agregar Gasto</span>
          </button>

          <button
            onClick={() => setIsChartModalOpen(true)}
            className="flex items-center px-3 py-2 bg-white border border-primary-200 rounded-lg hover:bg-primary-50"
          >
            <BarChart2 className="h-5 w-5 text-primary-600 mr-2" />
            <span>Ver Gráfico</span>
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50">
              <tr>
                <th className="py-3 px-4 text-left">Fecha</th>
                <th className="py-3 px-4 text-left">Descripción</th>
                <th className="py-3 px-4 text-left">Monto</th>
                <th className="py-3 px-4 text-left">Método de Pago</th>
                <th className="py-3 px-4 text-left">Categoría</th>
                <th className="py-3 px-4 text-left">Notas</th>
                <th className="py-3 px-4 text-left">Recibo</th>
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-primary-50">
                  <td className="py-3 px-4">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">{expense.description}</td>
                  <td className="py-3 px-4">${expense.amount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    {expense.paymentMethod === "CASH"
                      ? "Efectivo"
                      : expense.paymentMethod === "CREDIT_CARD"
                        ? "Tarjeta de Crédito"
                        : expense.paymentMethod === "DEBIT_CARD"
                          ? "Tarjeta de Débito"
                          : expense.paymentMethod === "BANK_TRANSFER"
                            ? "Transferencia Bancaria"
                            : expense.paymentMethod === "CHECK"
                              ? "Cheque"
                              : "Otro"}
                  </td>
                  <td className="py-3 px-4">
                    {expense.category === "MATERIALS"
                      ? "Materiales"
                      : expense.category === "TOOLS"
                        ? "Herramientas"
                        : expense.category === "MARKETING"
                          ? "Marketing"
                          : expense.category === "SALARIES"
                            ? "Salarios"
                            : expense.category === "RENT"
                              ? "Alquiler"
                              : expense.category === "SERVICES"
                                ? "Servicios"
                                : "Otros"}
                  </td>
                  <td className="py-3 px-4">{expense.notes || "N/A"}</td>
                  <td className="py-3 px-4">
                    {expense.receipt ? (
                      <button
                        onClick={() => handleViewReceipt(expense.receipt)}
                        className="text-primary-600 hover:underline"
                      >
                        Ver Recibo
                      </button>
                    ) : (
                      "No disponible"
                    )}
                  </td>
                  <td className="py-3 px-4 flex space-x-2">
                    {/* Botón Editar */}
                    <button
                      className="text-primary-600 hover:bg-primary-50 p-2 rounded-full"
                      onClick={() => console.log("Editar", expense.id)}
                      title="Editar"
                    >
                      <Edit className="h-5 w-5" />
                    </button>

                    {/* Botón Eliminar */}
                    <button
                      className="text-red-600 hover:bg-red-50 p-2 rounded-full"
                      onClick={async () => {
                        try {
                          await expenseService.delete(expense.id); // Llama al servicio para eliminar el gasto
                          dispatch(setExpenses(expenses.filter((e) => e.id !== expense.id))); // Actualiza el estado eliminando el gasto
                          console.log("Gasto eliminado:", expense.id);
                        } catch (error) {
                          console.error("Error al eliminar el gasto:", error);
                          alert("No se pudo eliminar el gasto. Inténtalo de nuevo.");
                        }
                      }}
                      title="Eliminar"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Expense Modal */}
      {isNewExpenseModalOpen && (
        <NewExpenseModal onClose={() => setIsNewExpenseModalOpen(false)} />
      )}

      {/* Chart Modal */}
      {isChartModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
            <button
              onClick={() => setIsChartModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-primary-50 rounded-full"
            >
              <X className="h-5 w-5 text-primary-600" />
            </button>
            <h2 className="text-xl font-semibold text-primary-900 mb-4">
              Gráfico de Gastos
            </h2>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </>
  );
};

export default ExpensesTab;