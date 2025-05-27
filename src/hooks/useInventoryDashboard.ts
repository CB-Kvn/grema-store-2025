import React, { useState, useMemo } from "react";
import { Layers, Warehouse, ClipboardList, Percent, AlertTriangle, PackageCheck, TrendingUp, Users, DollarSign } from "lucide-react";

// Puedes cambiar la extensión a .tsx si quieres usar JSX directamente

export function useInventoryDashboard() {
  const periodOptions = ['Mensual', 'Trimestral', 'Semestral', 'Anual'];
  const [timePeriod, setTimePeriod] = useState(periodOptions[0]);

  // Tarjetas informativas (puedes conectar estos valores a tu store o API)
  const infoCards = [
    {
      title: "Inventario Total",
      value: "2,350",
      icon: React.createElement(Layers, { className: "h-6 w-6 text-primary-600" }),
      description: "Unidades en stock",
    },
    {
      title: "Bodegas",
      value: "6",
      icon: React.createElement(Warehouse, { className: "h-6 w-6 text-primary-600" }),
      description: "Bodegas activas",
    },
    {
      title: "Órdenes Pendientes",
      value: "17",
      icon: React.createElement(ClipboardList, { className: "h-6 w-6 text-primary-600" }),
      description: "Por despachar",
    },
    {
      title: "Descuentos Activos",
      value: "4",
      icon: React.createElement(Percent, { className: "h-6 w-6 text-primary-600" }),
      description: "Promociones vigentes",
    },
    {
      title: "Productos Bajo Stock",
      value: "8",
      icon: React.createElement(AlertTriangle, { className: "h-6 w-6 text-yellow-600" }),
      description: "Requieren reposición",
    },
    {
      title: "Órdenes Completadas",
      value: "124",
      icon: React.createElement(PackageCheck, { className: "h-6 w-6 text-green-600" }),
      description: "Este mes",
    },
    {
      title: "Ventas Totales",
      value: "$32,500",
      icon: React.createElement(DollarSign, { className: "h-6 w-6 text-primary-600" }),
      description: "Ingresos este periodo",
    },
    {
      title: "Clientes Activos",
      value: "312",
      icon: React.createElement(Users, { className: "h-6 w-6 text-primary-600" }),
      description: "Clientes con compras recientes",
    },
    {
      title: "Crecimiento Inventario",
      value: "+5%",
      icon: React.createElement(TrendingUp, { className: "h-6 w-6 text-primary-600" }),
      description: "Respecto al periodo anterior",
    },
  ];

  // Slider logic
  const CARDS_PER_VIEW = 4;
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = Math.max(0, infoCards.length - CARDS_PER_VIEW);

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  // Animación: calcula el desplazamiento en porcentaje
  const sliderTranslateX = useMemo(
    () => -(currentIndex * (100 / CARDS_PER_VIEW)),
    [currentIndex]
  );

  const sliderCards = infoCards.slice(currentIndex, currentIndex + CARDS_PER_VIEW);

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < maxIndex;

  // Puedes adaptar los datos según el periodo seleccionado
  const expensesVsOrdersData = {
    labels:
      timePeriod === 'Mensual'
        ? ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']
        : timePeriod === 'Trimestral'
        ? ['Q1', 'Q2', 'Q3', 'Q4']
        : timePeriod === 'Semestral'
        ? ['S1', 'S2']
        : ['2022', '2023', '2024', '2025'],
    datasets: [
      {
        label: 'Gastos',
        data:
          timePeriod === 'Mensual'
            ? [5000, 4000, 3000, 7000, 2000, 6000]
            : timePeriod === 'Trimestral'
            ? [15000, 20000, 18000, 22000]
            : timePeriod === 'Semestral'
            ? [30000, 40000]
            : [60000, 80000, 75000, 90000],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Órdenes de Entrada',
        data:
          timePeriod === 'Mensual'
            ? [3000, 5000, 4000, 6000, 7000, 8000]
            : timePeriod === 'Trimestral'
            ? [12000, 18000, 20000, 25000]
            : timePeriod === 'Semestral'
            ? [25000, 35000]
            : [50000, 70000, 85000, 95000],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const ordersByCategoryData = {
    labels: ['Anillos', 'Collares', 'Aretes', 'Pulseras'],
    datasets: [
      {
        label: 'Órdenes por Categoría',
        data: [30, 50, 20, 40],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthlyExpensesTrendData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Gastos Mensuales',
        data: [5000, 4000, 3000, 7000, 2000, 6000],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const topSellingCategoriesData = {
    labels: ['Anillos', 'Collares', 'Aretes', 'Pulseras'],
    datasets: [
      {
        label: 'Ventas por Categoría',
        data: [120, 90, 70, 50],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const stockDistributionData = {
    labels: ['Bodega 1', 'Bodega 2', 'Bodega 3', 'Bodega 4'],
    datasets: [
      {
        label: 'Stock',
        data: [500, 800, 300, 750],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const salesByRegionData = {
    labels: ['Norte', 'Sur', 'Este', 'Oeste'],
    datasets: [
      {
        label: 'Ventas',
        data: [12000, 9500, 7800, 11000],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const suppliersPerformanceData = {
    labels: ['Proveedor A', 'Proveedor B', 'Proveedor C', 'Proveedor D'],
    datasets: [
      {
        label: 'Órdenes Entregadas',
        data: [45, 38, 50, 42],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const returnsTrendData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Devoluciones',
        data: [5, 8, 4, 6, 3, 7],
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
    ],
  };

  const ordersByStatusData = {
    labels: ['Pendiente', 'Completada', 'Cancelada'],
    datasets: [
      {
        label: 'Órdenes',
        data: [25, 120, 10],
        backgroundColor: [
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const incomeByMonthData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Ingresos',
        data: [8000, 9500, 11000, 10500, 12000, 13000],
        fill: false,
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1,
      },
    ],
  };

  const discountsUsageData = {
    labels: ['Usados', 'No Usados'],
    datasets: [
      {
        label: 'Descuentos',
        data: [320, 180],
        backgroundColor: [
          'rgba(255, 206, 86, 0.5)',
          'rgba(201, 203, 207, 0.5)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const warehouseCapacityData = {
    labels: ['Ocupado', 'Disponible'],
    datasets: [
      {
        label: 'Capacidad',
        data: [75, 25],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(201, 203, 207, 0.5)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return {
    timePeriod,
    setTimePeriod,
    periodOptions,
    expensesVsOrdersData,
    ordersByCategoryData,
    monthlyExpensesTrendData,
    topSellingCategoriesData,
    stockDistributionData,
    salesByRegionData,
    discountsUsageData,
    suppliersPerformanceData,
    returnsTrendData,
    warehouseCapacityData,
    chartOptions,
    infoCards,
    sliderCards,
    handlePrev,
    handleNext,
    canPrev,
    canNext,
    currentIndex,
    sliderTranslateX,
    ordersByStatusData,
    incomeByMonthData,
  };
}