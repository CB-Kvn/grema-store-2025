import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Info, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AIInsightsProps {
  data: any;
  type: 'orders' | 'expenses' | 'warehouses' | 'dashboard';
  chartType?: 'expensesVsOrders' | 'expensesByCategory' | 'paymentMethods';
}

interface Insight {
  type: 'success' | 'warning' | 'info' | 'trend';
  title: string;
  description: string;
  icon: React.ReactNode;
  recommendation?: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ data, type, chartType }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsights = () => {
      setLoading(true);
      
      // Simulate AI processing delay
      setTimeout(() => {
        const generatedInsights = analyzeData(data, type, chartType);
        setInsights(generatedInsights);
        setLoading(false);
      }, 800);
    };

    generateInsights();
  }, [data, type, chartType]);

  const analyzeData = (data: any, type: string, chartType?: string): Insight[] => {
    const insights: Insight[] = [];

    // Validar que data es un array
    if (!Array.isArray(data)) {
      data = data ? [data] : [];
    }

    switch (type) {
      case 'orders':
        insights.push(...analyzeOrders(data));
        break;
      case 'expenses':
        insights.push(...analyzeExpenses(data));
        break;
      case 'warehouses':
        insights.push(...analyzeWarehouses(data));
        break;
      case 'dashboard':
        insights.push(...analyzeDashboard(data, chartType));
        break;
      default:
        // Fallback para tipos no reconocidos
        insights.push({
          type: 'info',
          title: 'Tipo de análisis no reconocido',
          description: `Tipo: ${type}. Datos disponibles: ${data?.length || 0} registros`,
          icon: <Info className="h-4 w-4" />,
          recommendation: 'Verifica la configuración del componente.'
        });
        break;
    }

    return insights;
  };

  const analyzeOrders = (orders: any[]): Insight[] => {
    const insights: Insight[] = [];
    
    if (!orders || orders.length === 0) return insights;

    // Análisis de estado de órdenes
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    const totalOrders = orders.length;
    const pendingPercentage = (pendingOrders / totalOrders) * 100;

    if (pendingPercentage > 40) {
      insights.push({
        type: 'warning',
        title: 'Alto número de órdenes pendientes',
        description: `${pendingPercentage.toFixed(1)}% de las órdenes están pendientes (${pendingOrders}/${totalOrders})`,
        icon: <AlertTriangle className="h-4 w-4" />,
        recommendation: 'Considera revisar el flujo de procesamiento de órdenes para mejorar la eficiencia.'
      });
    }

    // Análisis de pagos
    const paidOrders = orders.filter(o => o.paymentStatus === 'PAID').length;
    const paidPercentage = (paidOrders / totalOrders) * 100;

    if (paidPercentage > 80) {
      insights.push({
        type: 'success',
        title: 'Excelente tasa de pagos',
        description: `${paidPercentage.toFixed(1)}% de las órdenes están pagadas`,
        icon: <CheckCircle className="h-4 w-4" />,
        recommendation: 'Mantén las estrategias actuales de cobranza.'
      });
    }

    // Análisis de tendencias temporales
    const recentOrders = orders.filter(o => {
      const orderDate = new Date(o.orderDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return orderDate >= weekAgo;
    }).length;

    const previousWeekOrders = orders.filter(o => {
      const orderDate = new Date(o.orderDate);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return orderDate >= twoWeeksAgo && orderDate < weekAgo;
    }).length;

    const growth = ((recentOrders - previousWeekOrders) / previousWeekOrders) * 100;

    if (growth > 20) {
      insights.push({
        type: 'trend',
        title: 'Crecimiento significativo',
        description: `Las órdenes aumentaron ${growth.toFixed(1)}% esta semana`,
        icon: <TrendingUp className="h-4 w-4" />,
        recommendation: 'Prepara el inventario para mantener este crecimiento.'
      });
    }

    // Análisis de documentos
    const documentsUploaded = orders.reduce((sum, order) => sum + (order.documents?.length || 0), 0);
    const documentPercentage = (documentsUploaded / totalOrders) * 100;

    if (documentPercentage < 70) {
      insights.push({
        type: 'info',
        title: 'Oportunidad de mejora en documentación',
        description: `Solo ${documentPercentage.toFixed(1)}% de las órdenes tienen documentos`,
        icon: <Info className="h-4 w-4" />,
        recommendation: 'Implementa recordatorios automáticos para subir comprobantes.'
      });
    }

    return insights;
  };

  const analyzeExpenses = (expenses: any[]): Insight[] => {
    const insights: Insight[] = [];
    
    if (!expenses || expenses.length === 0) return insights;

    // Análisis de gastos por categoría
    const categories = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const topCategory = Object.entries(categories).reduce((a, b) => 
      categories[a[0]] > categories[b[0]] ? a : b
    );

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const topCategoryPercentage = (categories[topCategory[0]] / totalAmount) * 100;

    if (topCategoryPercentage > 50) {
      insights.push({
        type: 'warning',
        title: 'Concentración alta en una categoría',
        description: `${topCategory[0]} representa ${topCategoryPercentage.toFixed(1)}% del gasto total`,
        icon: <AlertTriangle className="h-4 w-4" />,
        recommendation: 'Considera diversificar los gastos para reducir riesgos.'
      });
    }

    // Análisis de tendencia mensual
    const currentMonth = new Date().getMonth();
    const thisMonthExpenses = expenses.filter(e => 
      new Date(e.date).getMonth() === currentMonth
    ).reduce((sum, e) => sum + e.amount, 0);

    const lastMonthExpenses = expenses.filter(e => 
      new Date(e.date).getMonth() === currentMonth - 1
    ).reduce((sum, e) => sum + e.amount, 0);

    const monthlyGrowth = ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

    if (monthlyGrowth > 30) {
      insights.push({
        type: 'warning',
        title: 'Aumento significativo en gastos',
        description: `Los gastos aumentaron ${monthlyGrowth.toFixed(1)}% este mes`,
        icon: <TrendingUp className="h-4 w-4" />,
        recommendation: 'Revisa los gastos recientes para identificar oportunidades de optimización.'
      });
    }

    // Análisis de métodos de pago
    const paymentMethods = expenses.reduce((acc, expense) => {
      acc[expense.paymentMethod] = (acc[expense.paymentMethod] || 0) + 1;
      return acc;
    }, {});

    const cashPayments = paymentMethods['Efectivo'] || 0;
    const cashPercentage = (cashPayments / expenses.length) * 100;

    if (cashPercentage > 60) {
      insights.push({
        type: 'info',
        title: 'Alto uso de efectivo',
        description: `${cashPercentage.toFixed(1)}% de los gastos son en efectivo`,
        icon: <Info className="h-4 w-4" />,
        recommendation: 'Considera digitalizar más pagos para mejor trazabilidad.'
      });
    }

    return insights;
  };

  const analyzeWarehouses = (warehouses: any[]): Insight[] => {
    const insights: Insight[] = [];
    
    if (!warehouses || warehouses.length === 0) return insights;

    // Análisis de ocupación
    const averageOccupancy = warehouses.reduce((sum, w) => 
      sum + (w.currentOccupancy / w.capacity), 0
    ) / warehouses.length * 100;

    if (averageOccupancy > 85) {
      insights.push({
        type: 'warning',
        title: 'Capacidad de almacenamiento crítica',
        description: `Ocupación promedio del ${averageOccupancy.toFixed(1)}%`,
        icon: <AlertTriangle className="h-4 w-4" />,
        recommendation: 'Considera ampliar capacidad o optimizar el inventario.'
      });
    } else if (averageOccupancy < 30) {
      insights.push({
        type: 'info',
        title: 'Subutilización de almacenes',
        description: `Ocupación promedio del ${averageOccupancy.toFixed(1)}%`,
        icon: <Info className="h-4 w-4" />,
        recommendation: 'Evalúa la posibilidad de consolidar inventario o reducir espacios.'
      });
    }

    // Análisis de estado de almacenes
    const maintenanceWarehouses = warehouses.filter(w => w.status === 'MAINTENANCE').length;
    const maintenancePercentage = (maintenanceWarehouses / warehouses.length) * 100;

    if (maintenancePercentage > 25) {
      insights.push({
        type: 'warning',
        title: 'Muchos almacenes en mantenimiento',
        description: `${maintenancePercentage.toFixed(1)}% de los almacenes necesitan mantenimiento`,
        icon: <AlertTriangle className="h-4 w-4" />,
        recommendation: 'Prioriza las reparaciones para optimizar la capacidad operativa.'
      });
    }

    // Análisis de distribución geográfica
    const locations = warehouses.reduce((acc, w) => {
      acc[w.location] = (acc[w.location] || 0) + 1;
      return acc;
    }, {});

    const locationCount = Object.keys(locations).length;
    if (locationCount < 3 && warehouses.length > 5) {
      insights.push({
        type: 'info',
        title: 'Oportunidad de diversificación geográfica',
        description: `${locationCount} ubicaciones para ${warehouses.length} almacenes`,
        icon: <Lightbulb className="h-4 w-4" />,
        recommendation: 'Considera diversificar ubicaciones para mejorar la cobertura.'
      });
    }

    return insights;
  };

  const analyzeDashboard = (data: any, chartType?: string): Insight[] => {
    const insights: Insight[] = [];
    
    // Debug temporal
    console.log('Analyzing dashboard data:', { data, chartType });
    
    // Verificar si los datos están en formato de gráfico
    if (data && data.datasets && data.labels) {
      // Datos en formato de gráfico Chart.js
      const chartData = data;
      
      switch (chartType) {
        case 'expensesVsOrders':
          // Analizar gráfico de gastos vs órdenes
          const expensesDataset = chartData.datasets.find((d: any) => d.label === 'Gastos');
          const ordersDataset = chartData.datasets.find((d: any) => d.label === 'Órdenes');
          
          if (expensesDataset && ordersDataset) {
            console.log('Expenses vs Orders analysis:', {
              expensesData: expensesDataset.data,
              ordersData: ordersDataset.data
            });
            
            const totalExpenses = expensesDataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const totalOrders = ordersDataset.data.reduce((sum: number, val: number) => sum + val, 0);
            
            insights.push({
              type: 'info',
              title: 'Análisis de gastos vs órdenes',
              description: `Total de gastos: ₡${totalExpenses.toLocaleString()}, Total de órdenes: ₡${totalOrders.toLocaleString()}`,
              icon: <Info className="h-4 w-4" />,
              recommendation: 'Compara las tendencias para identificar patrones de gasto y facturación.'
            });

            // Analizar la relación gastos vs órdenes
            const ratio = totalOrders > 0 ? (totalExpenses / totalOrders) * 100 : 0;
            
            if (ratio > 80) {
              insights.push({
                type: 'warning',
                title: 'Gastos altos en relación a órdenes',
                description: `Los gastos representan ${ratio.toFixed(1)}% del valor de las órdenes`,
                icon: <AlertTriangle className="h-4 w-4" />,
                recommendation: 'Revisa los gastos operativos para optimizar la rentabilidad.'
              });
            } else if (ratio > 0) {
              insights.push({
                type: 'success',
                title: 'Relación gastos-órdenes saludable',
                description: `Los gastos representan ${ratio.toFixed(1)}% del valor de las órdenes`,
                icon: <CheckCircle className="h-4 w-4" />,
                recommendation: 'Mantén este equilibrio para una operación eficiente.'
              });
            }

            // Analizar tendencia por período
            const lastPeriodExpenses = expensesDataset.data[expensesDataset.data.length - 1] || 0;
            const lastPeriodOrders = ordersDataset.data[ordersDataset.data.length - 1] || 0;
            
            if (lastPeriodExpenses > 0 || lastPeriodOrders > 0) {
              insights.push({
                type: 'trend',
                title: 'Actividad del último período',
                description: `Gastos: ₡${lastPeriodExpenses.toLocaleString()}, Órdenes: ₡${lastPeriodOrders.toLocaleString()}`,
                icon: <TrendingUp className="h-4 w-4" />,
                recommendation: 'Analiza la evolución temporal para identificar patrones estacionales.'
              });
            }
          }
          break;

        case 'expensesByCategory':
          // Analizar gráfico de gastos por categoría
          const categoryDataset = chartData.datasets[0];
          
          if (categoryDataset && categoryDataset.data && chartData.labels) {
            console.log('Category expenses analysis:', {
              categoryData: categoryDataset.data,
              labels: chartData.labels
            });
            
            const totalCategoryExpenses = categoryDataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const categoriesWithExpenses = categoryDataset.data.filter((val: number) => val > 0).length;
            
            insights.push({
              type: 'info',
              title: 'Distribución de gastos por categoría',
              description: `${categoriesWithExpenses} categorías activas con gastos totales de ₡${totalCategoryExpenses.toLocaleString()}`,
              icon: <Info className="h-4 w-4" />,
              recommendation: 'Revisa las categorías con mayor gasto para identificar oportunidades de optimización.'
            });

            if (totalCategoryExpenses === 0) {
              insights.push({
                type: 'info',
                title: 'Sin gastos categorizados',
                description: 'No se encontraron gastos en ninguna categoría',
                icon: <Info className="h-4 w-4" />,
                recommendation: 'Registra gastos con categorías específicas para obtener insights detallados.'
              });
            } else {
              // Encontrar la categoría con mayor gasto
              const maxValue = Math.max(...categoryDataset.data);
              const maxIndex = categoryDataset.data.indexOf(maxValue);
              const topCategory = chartData.labels[maxIndex];
              const topCategoryPercentage = (maxValue / totalCategoryExpenses) * 100;

              if (topCategoryPercentage > 50) {
                insights.push({
                  type: 'warning',
                  title: 'Concentración alta en una categoría',
                  description: `${topCategory} representa ${topCategoryPercentage.toFixed(1)}% del gasto total (₡${maxValue.toLocaleString()})`,
                  icon: <AlertTriangle className="h-4 w-4" />,
                  recommendation: 'Considera diversificar los gastos para reducir dependencia de una sola categoría.'
                });
              } else if (maxValue > 0) {
                insights.push({
                  type: 'success',
                  title: 'Distribución equilibrada de gastos',
                  description: `${topCategory} es la categoría principal con ${topCategoryPercentage.toFixed(1)}% (₡${maxValue.toLocaleString()})`,
                  icon: <CheckCircle className="h-4 w-4" />,
                  recommendation: 'Mantén esta distribución para un mejor control de gastos.'
                });
              }

              // Analizar categorías con gastos cero
              const zeroExpenseCategories = categoryDataset.data.filter((val: number) => val === 0).length;
              if (zeroExpenseCategories > 0) {
                insights.push({
                  type: 'info',
                  title: 'Categorías sin gastos',
                  description: `${zeroExpenseCategories} de ${chartData.labels.length} categorías no tienen gastos registrados`,
                  icon: <Info className="h-4 w-4" />,
                  recommendation: 'Esto puede indicar oportunidades de ahorro o falta de registro en esas categorías.'
                });
              }
            }
          }
          break;

        case 'paymentMethods':
          // Analizar gráfico de métodos de pago
          const paymentDataset = chartData.datasets[0];
          
          if (paymentDataset && paymentDataset.data && chartData.labels) {
            console.log('Payment methods analysis:', {
              paymentData: paymentDataset.data,
              labels: chartData.labels
            });
            
            const totalPayments = paymentDataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const activePaymentMethods = paymentDataset.data.filter((val: number) => val > 0).length;
            
            insights.push({
              type: 'info',
              title: 'Análisis de métodos de pago',
              description: `${activePaymentMethods} métodos activos con total procesado de ₡${totalPayments.toLocaleString()}`,
              icon: <Info className="h-4 w-4" />,
              recommendation: 'Optimiza los métodos de pago más utilizados para mejorar la eficiencia.'
            });

            // Analizar el método de pago más usado
            const maxPaymentValue = Math.max(...paymentDataset.data);
            const maxPaymentIndex = paymentDataset.data.indexOf(maxPaymentValue);
            const topPaymentMethod = chartData.labels[maxPaymentIndex];
            const topPaymentPercentage = totalPayments > 0 ? (maxPaymentValue / totalPayments) * 100 : 0;

            if (topPaymentMethod === 'Efectivo' && topPaymentPercentage > 60) {
              insights.push({
                type: 'warning',
                title: 'Alto uso de efectivo',
                description: `${topPaymentPercentage.toFixed(1)}% de los pagos son en efectivo (₡${maxPaymentValue.toLocaleString()})`,
                icon: <AlertTriangle className="h-4 w-4" />,
                recommendation: 'Considera promover métodos de pago digitales para mejor trazabilidad.'
              });
            } else if (topPaymentPercentage > 0) {
              insights.push({
                type: 'success',
                title: 'Método de pago principal',
                description: `${topPaymentMethod} es el método más usado con ${topPaymentPercentage.toFixed(1)}% (₡${maxPaymentValue.toLocaleString()})`,
                icon: <CheckCircle className="h-4 w-4" />,
                recommendation: 'Optimiza los procesos para este método de pago principal.'
              });
            }

            // Analizar diversificación de métodos
            insights.push({
              type: 'info',
              title: 'Diversificación de métodos',
              description: `Se utilizan ${activePaymentMethods} de ${chartData.labels.length} métodos de pago disponibles`,
              icon: <Lightbulb className="h-4 w-4" />,
              recommendation: activePaymentMethods > 2 ? 'Buena diversificación de métodos de pago.' : 'Considera agregar más opciones de pago.'
            });
          }
          break;

        default:
          insights.push({
            type: 'info',
            title: 'Análisis de datos de gráfico',
            description: 'Datos de gráfico detectados con estructura Chart.js',
            icon: <Info className="h-4 w-4" />,
            recommendation: 'Los datos están en formato de gráfico, listos para análisis.'
          });
          break;
      }
    } else {
      // Datos no están en formato de gráfico, usar análisis anterior
      return analyzeDashboardLegacy(data, chartType);
    }

    return insights;
  };

  // Función auxiliar para análisis de formato legacy
  const analyzeDashboardLegacy = (data: any, chartType?: string): Insight[] => {
    const insights: Insight[] = [];
    
    // Si no hay datos, generar insights informativos
    if (!data || data.length === 0) {
      switch (chartType) {
        case 'expensesVsOrders':
          insights.push({
            type: 'info',
            title: 'Datos de órdenes no disponibles',
            description: 'No se encontraron órdenes para analizar. Considera agregar algunas órdenes de compra.',
            icon: <Info className="h-4 w-4" />,
            recommendation: 'Agrega órdenes de compra para obtener insights sobre tendencias y patrones.'
          });
          break;

        case 'expensesByCategory':
          insights.push({
            type: 'info',
            title: 'Datos de gastos por categoría',
            description: 'No se encontraron gastos categorizados. Comienza registrando gastos para ver el análisis.',
            icon: <Info className="h-4 w-4" />,
            recommendation: 'Registra gastos con categorías específicas para obtener insights detallados.'
          });
          break;

        case 'paymentMethods':
          insights.push({
            type: 'info',
            title: 'Métodos de pago',
            description: 'No hay datos de métodos de pago disponibles para analizar.',
            icon: <Info className="h-4 w-4" />,
            recommendation: 'Registra gastos con diferentes métodos de pago para ver patrones de uso.'
          });
          break;

        default:
          insights.push({
            type: 'info',
            title: 'Datos del dashboard',
            description: 'Datos no disponibles para análisis. Asegúrate de tener información registrada.',
            icon: <Info className="h-4 w-4" />,
            recommendation: 'Registra más datos para obtener insights más detallados.'
          });
          break;
      }
      return insights;
    }

    switch (chartType) {
      case 'expensesVsOrders':
        // Análisis específico para el gráfico de gastos vs órdenes
        const totalOrders = data.length;
        const recentOrders = data.filter((order: any) => {
          const orderDate = new Date(order.orderDate || order.createdAt || order.date);
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        });

        insights.push({
          type: 'info',
          title: 'Análisis de órdenes recientes',
          description: `Se encontraron ${totalOrders} órdenes totales, ${recentOrders.length} en el último mes`,
          icon: <Info className="h-4 w-4" />,
          recommendation: 'Monitorea las tendencias mensuales para identificar patrones estacionales.'
        });

        if (recentOrders.length === 0) {
          insights.push({
            type: 'warning',
            title: 'Baja actividad reciente',
            description: 'No se registraron órdenes en el último mes',
            icon: <AlertTriangle className="h-4 w-4" />,
            recommendation: 'Revisa la estrategia de captación de órdenes y contacta a proveedores clave.'
          });
        } else {
          const avgOrderValue = recentOrders.reduce((sum: number, order: any) => 
            sum + (order.totalAmount || order.total || order.amount || 0), 0) / recentOrders.length;
          
          insights.push({
            type: 'success',
            title: 'Actividad positiva',
            description: `Valor promedio de órdenes recientes: ₡${avgOrderValue.toFixed(2)}`,
            icon: <CheckCircle className="h-4 w-4" />,
            recommendation: 'Mantén el seguimiento de estas órdenes para optimizar el flujo de caja.'
          });
        }
        break;

      case 'expensesByCategory':
        // Análisis para gastos por categoría
        const totalExpenses = data.length;
        const totalAmount = data.reduce((sum: number, expense: any) => 
          sum + (expense.amount || expense.total || expense.value || 0), 0);

        insights.push({
          type: 'info',
          title: 'Resumen de gastos por categoría',
          description: `${totalExpenses} gastos registrados por un total de ₡${totalAmount.toFixed(2)}`,
          icon: <Info className="h-4 w-4" />,
          recommendation: 'Revisa las categorías con mayor gasto para identificar oportunidades de optimización.'
        });

        // Análisis de categorías si existe la propiedad
        const categories = data.reduce((acc: any, expense: any) => {
          const category = expense.category || expense.type || 'Sin categoría';
          acc[category] = (acc[category] || 0) + (expense.amount || expense.total || expense.value || 0);
          return acc;
        }, {});

        const categoryKeys = Object.keys(categories);
        if (categoryKeys.length > 1) {
          const topCategory = categoryKeys.reduce((a, b) => categories[a] > categories[b] ? a : b);
          const topCategoryPercentage = (categories[topCategory] / totalAmount) * 100;

          if (topCategoryPercentage > 50) {
            insights.push({
              type: 'warning',
              title: 'Concentración alta en una categoría',
              description: `${topCategory} representa ${topCategoryPercentage.toFixed(1)}% del gasto total`,
              icon: <AlertTriangle className="h-4 w-4" />,
              recommendation: 'Considera diversificar los gastos para reducir riesgos.'
            });
          } else {
            insights.push({
              type: 'success',
              title: 'Distribución equilibrada',
              description: `Los gastos están bien distribuidos entre ${categoryKeys.length} categorías`,
              icon: <CheckCircle className="h-4 w-4" />,
              recommendation: 'Mantén esta distribución para un mejor control financiero.'
            });
          }
        }
        break;

      case 'paymentMethods':
        // Análisis para métodos de pago
        const paymentMethods = data.reduce((acc: any, expense: any) => {
          const method = expense.paymentMethod || expense.method || 'No especificado';
          acc[method] = (acc[method] || 0) + 1;
          return acc;
        }, {});

        const methodKeys = Object.keys(paymentMethods);
        insights.push({
          type: 'info',
          title: 'Métodos de pago utilizados',
          description: `Se utilizaron ${methodKeys.length} métodos de pago diferentes`,
          icon: <Info className="h-4 w-4" />,
          recommendation: 'Analiza qué métodos son más eficientes para tu negocio.'
        });

        const cashPayments = paymentMethods['Efectivo'] || paymentMethods['Cash'] || 0;
        if (cashPayments > 0) {
          const cashPercentage = (cashPayments / data.length) * 100;
          
          if (cashPercentage > 60) {
            insights.push({
              type: 'warning',
              title: 'Alto uso de efectivo',
              description: `${cashPercentage.toFixed(1)}% de los gastos son en efectivo`,
              icon: <AlertTriangle className="h-4 w-4" />,
              recommendation: 'Considera digitalizar más pagos para mejor trazabilidad.'
            });
          } else {
            insights.push({
              type: 'success',
              title: 'Uso equilibrado de métodos',
              description: `Buena diversificación en métodos de pago`,
              icon: <CheckCircle className="h-4 w-4" />,
              recommendation: 'Mantén este balance para optimizar el flujo de caja.'
            });
          }
        }
        break;

      default:
        // Análisis general para dashboard
        insights.push({
          type: 'info',
          title: 'Análisis general del dashboard',
          description: `Se encontraron ${data.length} registros para analizar`,
          icon: <Info className="h-4 w-4" />,
          recommendation: 'Utiliza los filtros de período para identificar tendencias temporales.'
        });
        break;
    }

    return insights;
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      case 'trend':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      case 'trend':
        return 'text-purple-800';
      default:
        return 'text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="border-primary-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary-900">
            <Brain className="h-5 w-5 text-primary-600" />
            Análisis con IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
              <span className="text-primary-600">Analizando datos...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary-900">
          <Brain className="h-5 w-5 text-primary-600" />
          Análisis con IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No se encontraron insights significativos en los datos actuales.
            </div>
          ) : (
            insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 ${getTextColor(insight.type)}`}>
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${getTextColor(insight.type)}`}>
                      {insight.title}
                    </h4>
                    <p className={`text-sm mt-1 ${getTextColor(insight.type)} opacity-90`}>
                      {insight.description}
                    </p>
                    {insight.recommendation && (
                      <p className={`text-xs mt-2 ${getTextColor(insight.type)} opacity-75 font-medium`}>
                        💡 {insight.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
