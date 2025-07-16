import React, { useState, useMemo, useEffect } from "react";
import { Layers, Warehouse, ClipboardList, Percent, AlertTriangle, PackageCheck, DollarSign } from "lucide-react";
import { reportsService } from "@/services/reportsService";

export function useInventoryDashboard() {
  // Configuración de periodos
  const periodOptions = ['month', 'quarter', 'semester', 'year'];
  const periodLabels = ['Mensual', 'Trimestral', 'Semestral', 'Anual'];
  const [timePeriod, setTimePeriod] = useState(periodOptions[0]);
  const [overview, setOverview] = useState<any>({});
  const [summary, setSummary] = useState<any>({
    expenses: [],
    entries: [],
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date()
  });

  // Función para agrupar datos por periodo
  const groupDataByPeriod = (data: any[], dateKey: string, valueKey: string, period: string) => {
    const result: { [key: string]: number } = {};
    
    data.forEach(item => {
      const date = new Date(item[dateKey]);
      let periodKey: string;
      
      switch (period) {
        case 'month':
          periodKey = date.toLocaleString('es-ES', { month: 'long' });
          break;
        case 'quarter':
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          periodKey = `Q${quarter}`;
          break;
        case 'semester':
          const semester = Math.floor(date.getMonth() / 6) + 1;
          periodKey = `S${semester}`;
          break;
        case 'year':
          periodKey = date.getFullYear().toString();
          break;
        default:
          periodKey = 'Otro';
      }
      
      result[periodKey] = (result[periodKey] || 0) + item[valueKey];
    });
    
    return result;
  };

  // Función para ordenar periodos
  const getSortedPeriods = (periods: string[], periodType: string) => {
    if (periodType === 'month') {
      const monthOrder = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      return [...periods].sort((a, b) => 
        monthOrder.indexOf(a.toLowerCase()) - monthOrder.indexOf(b.toLowerCase())
      );
    }
    
    if (periodType === 'quarter' || periodType === 'semester') {
      return [...periods].sort((a, b) => 
        parseInt(a.substring(1)) - parseInt(b.substring(1))
      );
    }
    
    if (periodType === 'year') {
      return [...periods].sort((a, b) => parseInt(a) - parseInt(b));
    }
    
    return periods;
  };

  // Tarjetas informativas
  const infoCards = [
    {
      title: "Inventario Total",
      value: overview.totalUnits || "0",
      icon: React.createElement(Layers, { className: "h-6 w-6 text-primary-600" }),
      description: "Unidades en stock",
    },
    {
      title: "Bodegas",
      value: overview.warehousesInUse || "6",
      icon: React.createElement(Warehouse, { className: "h-6 w-6 text-primary-600" }),
      description: "Bodegas activas",
    },
    {
      title: "Órdenes Pendientes",
      value: overview.pendingOrders || "0",
      icon: React.createElement(ClipboardList, { className: "h-6 w-6 text-primary-600" }),
      description: "Por despachar",
    },
    {
      title: "Descuentos Activos",
      value: overview.discounts || "0",
      icon: React.createElement(Percent, { className: "h-6 w-6 text-primary-600" }),
      description: "Promociones vigentes",
    },
    {
      title: "Productos Bajo Stock",
      value: overview.lowStock || "0",
      icon: React.createElement(AlertTriangle, { className: "h-6 w-6 text-yellow-600" }),
      description: "Requieren reposición",
    },
    {
      title: "Órdenes Completadas",
      value: overview.finishedOrders || "0",
      icon: React.createElement(PackageCheck, { className: "h-6 w-6 text-green-600" }),
      description: "Este periodo",
    },
    {
      title: "Ventas Totales",
      value: `$${overview.totalSales?.toLocaleString() || "0"}`,
      icon: React.createElement(DollarSign, { className: "h-6 w-6 text-primary-600" }),
      description: "Ingresos este periodo",
    },
    
  ];

  // Slider logic
  const CARDS_PER_VIEW = 4;
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(0, infoCards.length - CARDS_PER_VIEW);
  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  const sliderTranslateX = useMemo(() => -(currentIndex * (100 / CARDS_PER_VIEW)), [currentIndex]);
  const sliderCards = infoCards.slice(currentIndex, currentIndex + CARDS_PER_VIEW);
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < maxIndex;

  // Gráficos dinámicos
  const charts = useMemo(() => {
    // Datos para gráficos de periodos
    const getPeriodData = () => {
      if (timePeriod === 'month') return ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
      if (timePeriod === 'quarter') return ['Q1', 'Q2', 'Q3', 'Q4'];
      if (timePeriod === 'semester') return ['S1', 'S2'];
      return ['2022', '2023', '2024', '2025'];
    };

    // Gastos vs Órdenes
    const expensesByPeriod = groupDataByPeriod(summary.expenses, 'date', 'amount', timePeriod);
    const ordersByPeriod = groupDataByPeriod(summary.entries, 'orderDate', 'totalAmount', timePeriod);
    const periods = getSortedPeriods(Object.keys(expensesByPeriod), timePeriod);

    return {
      expensesVsOrders: {
        labels: getPeriodData(),
        datasets: [
          {
            label: 'Gastos',
            data: periods.map(p => expensesByPeriod[p] || 0),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Órdenes',
            data: periods.map(p => ordersByPeriod[p] || 0),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      expensesByCategory: {
        labels: ['Materiales', 'Herramientas', 'Marketing', 'Salarios', 'Alquiler', 'Servicios', 'Otros'],
        datasets: [
          {
            label: 'Gastos por Categoría',
            data: [
              (summary.expenses as any[]).filter((e: any) => e.category === 'MATERIALS').reduce((sum: number, e: any) => sum + e.amount, 0),
              (summary.expenses as any[]).filter((e: any) => e.category === 'TOOLS').reduce((sum: number, e: any) => sum + e.amount, 0),
              (summary.expenses as any[]).filter((e: any) => e.category === 'MARKETING').reduce((sum: number, e: any) => sum + e.amount, 0),
              (summary.expenses as any[]).filter((e: any) => e.category === 'SALARIES').reduce((sum: number, e: any) => sum + e.amount, 0),
              (summary.expenses as any[]).filter((e: any) => e.category === 'RENT').reduce((sum: number, e: any) => sum + e.amount, 0),
              (summary.expenses as any[]).filter((e: any) => e.category === 'SERVICES').reduce((sum: number, e: any) => sum + e.amount, 0),
              (summary.expenses as any[]).filter((e: any) => e.category === 'OTHER').reduce((sum: number, e: any) => sum + e.amount, 0)
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)',
              'rgba(199, 199, 199, 0.5)'
            ],
            borderWidth: 1,
          },
        ],
      },
      paymentMethods: {
        labels: ['Transferencia', 'Efectivo', 'Tarjeta', 'Otros'],
        datasets: [
          {
            label: 'Métodos de Pago',
            data: [
              (summary.expenses as any[]).filter((e: any) => e.paymentMethod === 'BANK_TRANSFER').reduce((sum: number, e: any) => sum + e.amount, 0),
              (summary.expenses as any[]).filter((e: any) => e.paymentMethod === 'CASH').reduce((sum: number, e: any) => sum + e.amount, 0),
              (summary.expenses as any[]).filter((e: any) => e.paymentMethod === 'CREDIT_CARD').reduce((sum: number, e: any) => sum + e.amount, 0),
              (summary.expenses as any[]).filter((e: any) => !['BANK_TRANSFER', 'CASH', 'CREDIT_CARD'].includes(e.paymentMethod))
                .reduce((sum: number, e: any) => sum + e.amount, 0)
            ],
            backgroundColor: [
              'rgba(54, 162, 235, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(153, 102, 255, 0.5)'
            ],
            borderWidth: 1,
          },
        ],
      },
      ordersByStatus: {
        labels: ['Pendiente', 'Aprobado', 'Enviado', 'Entregado', 'Cancelado'],
        datasets: [
          {
            label: 'Órdenes por Estado',
            data: [
              (summary.entries as any[]).filter((o: any) => o.status === 'PENDING').length,
              (summary.entries as any[]).filter((o: any) => o.status === 'APPROVED').length,
              (summary.entries as any[]).filter((o: any) => o.status === 'SHIPPED').length,
              (summary.entries as any[]).filter((o: any) => o.status === 'DELIVERED').length,
              (summary.entries as any[]).filter((o: any) => o.status === 'CANCELLED').length
            ],
            backgroundColor: [
              'rgba(255, 206, 86, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 159, 64, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(255, 99, 132, 0.7)'
            ],
            borderWidth: 1,
          },
        ],
      },
      orderPaymentMethods: {
        labels: ['SINPE Móvil', 'Transferencia', 'Crédito', 'Efectivo'],
        datasets: [
          {
            label: 'Métodos de Pago en Órdenes',
            data: [
              (summary.entries as any[]).filter((o: any) => o.paymentMethod === 'SINPE MOVIL').length,
              (summary.entries as any[]).filter((o: any) => o.paymentMethod === 'TRANSFER').length,
              (summary.entries as any[]).filter((o: any) => o.paymentMethod === 'CREDIT').length,
              (summary.entries as any[]).filter((o: any) => o.paymentMethod === 'CASH').length
            ],
            backgroundColor: [
              'rgba(255, 206, 86, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(75, 192, 192, 0.6)'
            ],
            borderWidth: 1,
          },
        ],
      },
      inventoryByWarehouse: {
        labels: ['Cobanó', 'San José'],
        datasets: [
          {
            label: 'Productos en Stock',
            data: [94, 95], // Datos calculados desde la estructura del reducer
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Capacidad',
            data: [500, 500], // Capacidad de cada almacén
            backgroundColor: 'rgba(255, 99, 132, 0.3)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      productsByCategory: {
        labels: ['Collares Invisibles', 'Otros'],
        datasets: [
          {
            label: 'Productos por Categoría',
            data: [10, 0], // Basado en los datos del reducer
            backgroundColor: [
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)'
            ],
            borderWidth: 1,
          },
        ],
      },
      stockStatus: {
        labels: ['Con Stock', 'Sin Stock', 'Stock Bajo'],
        datasets: [
          {
            label: 'Estado del Inventario',
            data: [2, 8, 0], // Basado en los datos del reducer
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(255, 206, 86, 0.6)'
            ],
            borderWidth: 1,
          },
        ],
      },
      
    };
  }, [summary, timePeriod]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const fetchData = async () => {
    try {
      const overviewData = await reportsService.getOverview(timePeriod);
      const summaryData = await reportsService.getSummary();
      setOverview(overviewData as any);
      setSummary({
        ...(summaryData as any),
        from: new Date((summaryData as any).from),
        to: new Date((summaryData as any).to)
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timePeriod]);

  return {
    timePeriod,
    setTimePeriod,
    periodOptions,
    periodLabels,
    currentPeriodLabel: periodLabels[periodOptions.indexOf(timePeriod)],
    overview,
    summary,
    charts,
    chartOptions,
    infoCards,
    sliderCards,
    handlePrev,
    handleNext,
    canPrev,
    canNext,
    currentIndex,
    sliderTranslateX,
  };
}