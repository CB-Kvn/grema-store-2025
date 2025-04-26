import React, { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  FileText,
  Receipt,
  Wallet,
  Plus,
  Download,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import NewExpenseModal from "@/components/admin/NewExpenseModal";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setExpenses } from "@/store/slices/expensesSlice";
import { expenseService } from "@/services/expenseService";
import { Expense } from "@/types/expense";
import { useAppSelector } from "@/hooks/useAppSelector";

const ExpensesTab: React.FC = () => {
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth"); // Período seleccionado
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses.items); // Accede al slice de expenses

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await expenseService.getAll(); // Llama al API para obtener los gastos
        if (Array.isArray(response)) {
          dispatch(setExpenses(response as Expense[])); // Actualiza el estado global
        } else {
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        console.error("Error al obtener los gastos:", error);
      }
    };

    fetchExpenses();
  }, [dispatch]);

  // Filtrar gastos según el período seleccionado
  const filteredExpenses = expenses.filter((expense) => {
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
      return true; // Mostrar todos los gastos
    }
  });

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
          value={`$${filteredExpenses
            .reduce((sum, expense) => sum + expense.amount, 0)
            .toFixed(2)}`}
          icon={<Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />}
        />
        <StatCard
          title="Promedio por Gasto"
          value={`$${(
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

      {/* Selector de Período */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
            <Input type="text" placeholder="Buscar gastos..." className="pl-10" />
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
          
          <button className="flex items-center px-3 py-2 bg-white border border-primary-200 rounded-lg hover:bg-primary-50">
            <Download className="h-5 w-5 text-primary-600 mr-2" />
            <span>Exportar</span>
          </button>
          <button
            onClick={() => setIsNewExpenseModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>Nuevo Gasto</span>
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
                  <td className="py-3 px-4">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">{expense.paymentMethod}</td>
                  <td className="py-3 px-4">
                    <button className="text-primary-600 hover:underline">
                      Editar
                    </button>
                    <button className="text-red-600 hover:underline ml-4">
                      Eliminar
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
    </>
  );
};

export default ExpensesTab;