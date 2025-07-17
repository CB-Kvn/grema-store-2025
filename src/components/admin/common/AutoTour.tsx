import React, { useEffect, useRef } from 'react';
import { useAdminTour } from '@/hooks/useAdminTour';

interface AutoTourProps {
  enabled?: boolean;
  delay?: number;
  tourType?: string;
}

export const AutoTour: React.FC<AutoTourProps> = ({ 
  enabled = true, 
  delay = 2000,
  tourType = 'inventario' 
}) => {
  const { startTour, hasCompletedTour } = useAdminTour();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!enabled || hasRun.current || hasCompletedTour()) return;

    const timer = setTimeout(() => {
      startTour(tourType);
      hasRun.current = true;
    }, delay);

    return () => clearTimeout(timer);
  }, [enabled, delay, tourType]); // Removemos las funciones de las dependencias

  return null; // Este componente no renderiza nada
};
