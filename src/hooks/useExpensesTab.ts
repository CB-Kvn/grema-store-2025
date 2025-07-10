import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setExpenses } from "@/store/slices/expensesSlice";
import { expenseService } from "@/services/expenseService";
import { Expense } from "@/types/expense";

export function useExpensesTab() {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses.items);
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await expenseService.getAll();
        if (Array.isArray(response)) {
          dispatch(setExpenses(response as Expense[]));
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
    );

  // Chart data
  const pastelBackgroundColors = [
    "rgba(255, 99, 132, 0.5)", // rosa pastel
    "rgba(54, 162, 235, 0.5)", // azul pastel
    "rgba(255, 206, 86, 0.5)", // amarillo pastel
    "rgba(75, 192, 192, 0.5)", // verde pastel
  ];
  const pastelBorderColors = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
  ];

  const chartData = {
    labels: filteredExpenses.map((expense) =>
      new Date(expense.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Gastos",
        data: filteredExpenses.map((expense) => expense.amount),
        borderColor: pastelBorderColors[1],
        backgroundColor: pastelBackgroundColors[0],
        pointBackgroundColor: pastelBackgroundColors[2],
        pointBorderColor: pastelBorderColors[3],
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

  // Monto de gastos por categoría
  const categoryTotals: Record<string, number> = {};
  filteredExpenses.forEach((expense) => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });
  const categoryLabels = Object.keys(categoryTotals);
  const categoryData = Object.values(categoryTotals);

  // Monto de gastos por tipo de pago
  const paymentTotals: Record<string, number> = {};
  filteredExpenses.forEach((expense) => {
    paymentTotals[expense.paymentMethod] = (paymentTotals[expense.paymentMethod] || 0) + expense.amount;
  });
  const paymentLabels = Object.keys(paymentTotals);
  const paymentData = Object.values(paymentTotals);

  const categoryChartData = {
    labels: categoryLabels.map((cat) =>
      cat === "MATERIALS"
        ? "Materiales"
        : cat === "TOOLS"
        ? "Herramientas"
        : cat === "MARKETING"
        ? "Marketing"
        : cat === "SALARIES"
        ? "Salarios"
        : cat === "RENT"
        ? "Alquiler"
        : cat === "SERVICES"
        ? "Servicios"
        : "Otros"
    ),
    datasets: [
      {
        label: "Monto por Categoría",
        data: categoryData,
        backgroundColor: pastelBackgroundColors,
        borderColor: pastelBorderColors,
        borderWidth: 2,
      },
    ],
  };

  const paymentChartData = {
    labels: paymentLabels.map((pm) =>
      pm === "CASH"
        ? "Efectivo"
        : pm === "CREDIT_CARD"
        ? "Tarjeta de Crédito"
        : pm === "DEBIT_CARD"
        ? "Tarjeta de Débito"
        : pm === "BANK_TRANSFER"
        ? "Transferencia Bancaria"
        : pm === "CHECK"
        ? "Cheque"
        : "Otro"
    ),
    datasets: [
      {
        label: "Monto por Tipo de Pago",
        data: paymentData,
        backgroundColor: pastelBackgroundColors,
        borderColor: pastelBorderColors,
        borderWidth: 2,
      },
    ],
  };

  // Función para ver recibo
  const handleViewReceipt = (receiptUrl: string) => {
    if (receiptUrl) {
      window.open(receiptUrl, '_blank');
    }
  };

  // Función para eliminar gasto
  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await expenseService.delete(expenseId);
      dispatch(setExpenses(expenses.filter((e) => e.id !== expenseId)));
    } catch (error) {
      console.error("Error al eliminar el gasto:", error);
      alert("No se pudo eliminar el gasto. Inténtalo de nuevo.");
    }
  };

  return {
    isNewExpenseModalOpen,
    setIsNewExpenseModalOpen,
    isChartModalOpen,
    setIsChartModalOpen,
    selectedPeriod,
    setSelectedPeriod,
    searchTerm,
    setSearchTerm,
    expenses,
    filteredExpenses,
    chartData,
    chartOptions,
    categoryChartData,
    paymentChartData,
    handleViewReceipt,
    handleDeleteExpense,
  };
}