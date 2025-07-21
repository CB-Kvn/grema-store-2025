import React, { useEffect, useRef } from 'react';

/**
 * Hook para manejo seguro de componentes con Chart.js
 * Previene errores de removeChild al desmontar componentes
 */
export const useChartDestroy = () => {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // Cleanup function para destruir el chart de manera segura
    return () => {
      if (chartRef.current?.chartInstance) {
        try {
          chartRef.current.chartInstance.destroy();
        } catch (error) {
          console.warn('Error destroying chart:', error);
        }
      }
    };
  }, []);

  return chartRef;
};

/**
 * Wrapper para componentes que renderizan condicionalmente Charts
 * Asegura la limpieza adecuada del DOM
 */
export const withChartCleanup = <T extends object>(
  Component: React.ComponentType<T>
) => {
  return (props: T) => {
    const chartRef = useChartDestroy();
    
    return React.createElement(
      'div',
      { ref: chartRef },
      React.createElement(Component, props)
    );
  };
};

/**
 * Opciones base para Charts que previenen problemas de renderizado
 */
export const getBaseChartOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
  },
  animation: {
    duration: 300, // Animación más rápida para evitar conflictos
  },
});
