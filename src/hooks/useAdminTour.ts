import { useEffect, useRef, useCallback, useMemo } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

interface TourStep {
  element: string;
  popover: {
    title: string;
    description: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    showButtons?: string[];
    onNextClick?: () => void;
    onPrevClick?: () => void;
  };
}

export const useAdminTour = (onTabChange?: (tab: string) => void) => {
  const driverRef = useRef<any>(null);

  // Configuración del tour para diferentes pestañas
  const tourSteps: Record<string, TourStep[]> = useMemo(() => ({
    inventario: [
      {
        element: '[data-tour="dashboard-tabs"]',
        popover: {
          title: '¡Bienvenido al Panel de Administración! 🎉',
          description: 'Aquí puedes navegar entre las diferentes secciones de gestión de tu tienda. Comenzaremos con el panel de informes.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="period-selector"]',
        popover: {
          title: 'Selector de Período ⏰',
          description: 'Cambia el período de tiempo para ver estadísticas específicas. Puedes ver datos de la última semana, mes o año.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="info-cards"]',
        popover: {
          title: 'Tarjetas de Información 📊',
          description: 'Aquí ves un resumen rápido de métricas importantes como total de productos, órdenes, gastos e ingresos.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="charts-section"]',
        popover: {
          title: 'Gráficos Analíticos 📈',
          description: 'Visualiza tendencias de ventas, productos más vendidos y otros datos importantes de tu negocio.',
          position: 'top'
        }
      }
    ],
    clientes: [
      {
        element: '[data-tour="users-header"]',
        popover: {
          title: 'Gestión de Clientes 👥',
          description: 'Administra todos los usuarios y clientes de tu tienda.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="users-table"]',
        popover: {
          title: 'Lista de Clientes 📋',
          description: 'Aquí puedes ver todos los clientes registrados, sus datos y historial.',
          position: 'top'
        }
      },
      {
        element: '[data-tour="user-actions"]',
        popover: {
          title: 'Acciones de Cliente ⚙️',
          description: 'Para cada cliente puedes ver detalles, editar información o gestionar permisos.',
          position: 'left'
        }
      }
    ],
    productos: [
      {
        element: '[data-tour="products-header"]',
        popover: {
          title: 'Gestión de Productos 🏷️',
          description: 'En esta sección puedes administrar todo tu inventario de productos.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="add-product-btn"]',
        popover: {
          title: 'Agregar Producto ➕',
          description: 'Haz clic aquí para agregar nuevos productos a tu inventario.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="products-table"]',
        popover: {
          title: 'Lista de Productos 📋',
          description: 'Aquí puedes ver, editar y gestionar todos tus productos. Usa los filtros para encontrar productos específicos.',
          position: 'top'
        }
      },
      {
        element: '[data-tour="product-actions"]',
        popover: {
          title: 'Acciones de Producto ⚙️',
          description: 'Para cada producto puedes editar detalles, gestionar stock o eliminarlo.',
          position: 'left'
        }
      }
    ],
    gastos: [
      {
        element: '[data-tour="expenses-header"]',
        popover: {
          title: 'Control de Gastos 💰',
          description: 'Mantén un registro detallado de todos los gastos de tu negocio.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="add-expense-btn"]',
        popover: {
          title: 'Registrar Gasto ➕',
          description: 'Agrega nuevos gastos para mantener tu contabilidad al día.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="expenses-filters"]',
        popover: {
          title: 'Filtros de Gastos 🔍',
          description: 'Filtra gastos por categoría, fecha o método de pago para encontrar información específica.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="expenses-table"]',
        popover: {
          title: 'Lista de Gastos 📋',
          description: 'Visualiza todos tus gastos organizados. Puedes editarlos o eliminarlos desde aquí.',
          position: 'top'
        }
      }
    ],
    bodegas: [
      {
        element: '[data-tour="warehouses-header"]',
        popover: {
          title: 'Gestión de Bodegas 🏭',
          description: 'Administra las ubicaciones donde almacenas tu inventario.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="add-warehouse-btn"]',
        popover: {
          title: 'Agregar Bodega ➕',
          description: 'Crea nuevas bodegas para organizar mejor tu inventario.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="warehouses-table"]',
        popover: {
          title: 'Lista de Bodegas 📋',
          description: 'Ve todas tus bodegas con información de ubicación y capacidad.',
          position: 'top'
        }
      }
    ],
    ordenes: [
      {
        element: '[data-tour="orders-header"]',
        popover: {
          title: 'Gestión de Órdenes 📦',
          description: 'Administra todas las órdenes de compra y ventas de tu tienda.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="order-status-filter"]',
        popover: {
          title: 'Filtro por Estado 🔄',
          description: 'Filtra órdenes por su estado: pendientes, completadas, canceladas, etc.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="orders-table"]',
        popover: {
          title: 'Lista de Órdenes 📋',
          description: 'Ve todas las órdenes con detalles de cliente, productos y estado.',
          position: 'top'
        }
      }
    ],
    descuentos: [
      {
        element: '[data-tour="discounts-header"]',
        popover: {
          title: 'Gestión de Descuentos 🏷️',
          description: 'Crea y administra códigos de descuento para tus clientes.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="create-discount-btn"]',
        popover: {
          title: 'Crear Descuento ➕',
          description: 'Crea nuevos códigos de descuento con diferentes reglas y porcentajes.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="discounts-table"]',
        popover: {
          title: 'Lista de Descuentos 📋',
          description: 'Administra todos tus códigos de descuento activos e inactivos.',
          position: 'top'
        }
      }
    ],
    banners: [
      {
        element: '[data-tour="banners-header"]',
        popover: {
          title: 'Gestión de Banners 🖼️',
          description: 'Crea y administra banners promocionales que se muestran en tu tienda.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="banner-form"]',
        popover: {
          title: 'Formulario de Banner ➕',
          description: 'Crea nuevos banners con imágenes, fechas de vigencia y estados personalizados.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="banners-table"]',
        popover: {
          title: 'Lista de Banners 📋',
          description: 'Administra todos tus banners: activa, desactiva, edita o elimina según necesites.',
          position: 'top'
        }
      },
      {
        element: '[data-tour="banner-status"]',
        popover: {
          title: 'Control de Estado 🔄',
          description: 'Cambia rápidamente el estado de tus banners entre activo, inactivo y programado.',
          position: 'left'
        }
      }
    ]
  }), []);

  useEffect(() => {
    driverRef.current = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: [],
      popoverClass: 'driverjs-theme-grema',
      nextBtnText: 'Siguiente →',
      prevBtnText: '← Anterior',
      doneBtnText: '¡Finalizar! ✨',
      allowClose: true,
      smoothScroll: true,
      stagePadding: 4,
      stageRadius: 5,
      onDestroyed: () => {
        localStorage.setItem('grema-admin-tour-completed', 'true');
      }
    });
  }, []);

  const startTour = useCallback((tabName: string = 'inventario') => {
    // Cambiar al tab correspondiente antes de iniciar el tour
    if (onTabChange) {
      onTabChange(tabName);
      // Dar tiempo para que el tab se renderice
      setTimeout(() => {
        if (driverRef.current && tourSteps[tabName]) {
          driverRef.current.setSteps(tourSteps[tabName]);
          driverRef.current.drive();
        }
      }, 300);
    } else {
      if (driverRef.current && tourSteps[tabName]) {
        driverRef.current.setSteps(tourSteps[tabName]);
        driverRef.current.drive();
      }
    }
  }, [onTabChange, tourSteps]);

  const startFullTour = useCallback(() => {
    // Tour completo que abarca todas las pestañas
    const fullTourSteps: TourStep[] = [
      {
        element: '[data-tour="dashboard-tabs"]',
        popover: {
          title: '¡Bienvenido al Panel de Administración! 🎉',
          description: 'Te voy a guiar por todas las funcionalidades principales de tu panel administrativo. ¡Comencemos!',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="tour-btn"]',
        popover: {
          title: 'Botón de Ayuda 🆘',
          description: 'Siempre puedes hacer clic aquí para volver a ver este tour o obtener ayuda específica de cada sección.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="info-cards"]',
        popover: {
          title: 'Métricas Principales 📊',
          description: 'Estos son los indicadores clave de tu negocio. Se actualizan en tiempo real con las últimas transacciones.',
          position: 'bottom'
        }
      },
      {
        element: '[data-tour="charts-section"]',
        popover: {
          title: 'Análisis Visual 📈',
          description: 'Los gráficos te muestran tendencias importantes como ventas por período, productos más populares y rendimiento general.',
          position: 'top'
        }
      }
    ];

    if (driverRef.current) {
      driverRef.current.setSteps(fullTourSteps);
      driverRef.current.drive();
    }
  }, []);

  const hasCompletedTour = useCallback(() => {
    return localStorage.getItem('grema-admin-tour-completed') === 'true';
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem('grema-admin-tour-completed');
  }, []);

  const closeTour = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }
  }, []);

  const highlightElement = useCallback((selector: string, options?: any) => {
    if (driverRef.current) {
      driverRef.current.highlight({
        element: selector,
        popover: {
          title: 'Elemento Destacado',
          description: 'Esta es una funcionalidad importante.',
          ...options
        }
      });
    }
  }, []);

  return {
    startTour,
    startFullTour,
    hasCompletedTour,
    resetTour,
    closeTour,
    highlightElement
  };
};
