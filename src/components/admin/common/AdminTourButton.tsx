import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { HelpCircle, Play, RotateCcw, BookOpen, X } from 'lucide-react';
import { useAdminTour } from '@/hooks/useAdminTour';

interface AdminTourButtonProps {
  currentTab?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  onTabChange?: (tab: string) => void;
}

export const AdminTourButton: React.FC<AdminTourButtonProps> = ({
  currentTab = 'inventario',
  variant = 'outline',
  size = 'default',
  onTabChange
}) => {
  const { startTour, startFullTour, hasCompletedTour, resetTour, closeTour } = useAdminTour(onTabChange);

  const tourSections = [
    { key: 'inventario', label: 'Informes y Dashboard', icon: '📊' },
    { key: 'productos', label: 'Gestión de Productos', icon: '🏷️' },
    { key: 'gastos', label: 'Control de Gastos', icon: '💰' },
    { key: 'bodegas', label: 'Gestión de Bodegas', icon: '🏭' },
    { key: 'ordenes', label: 'Órdenes', icon: '📦' },
    { key: 'descuentos', label: 'Descuentos', icon: '🏷️' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className="gap-2"
          data-tour="tour-btn"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Ayuda</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Tour Interactivo</p>
          <p className="text-xs text-muted-foreground">
            Aprende a usar el panel de administración
          </p>
        </div>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={startFullTour} className="gap-2">
          <Play className="h-4 w-4" />
          Tour Completo
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => startTour(currentTab)} className="gap-2">
          <BookOpen className="h-4 w-4" />
          Tour de esta sección
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <div className="px-2 py-1">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Tours por sección:
          </p>
        </div>
        
        {tourSections.map((section) => (
          <DropdownMenuItem
            key={section.key}
            onClick={() => startTour(section.key)}
            className="gap-2 text-sm"
          >
            <span>{section.icon}</span>
            {section.label}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={closeTour} className="gap-2 text-red-600">
          <X className="h-4 w-4" />
          Cerrar tour activo
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={resetTour} className="gap-2 text-muted-foreground">
          <RotateCcw className="h-4 w-4" />
          Reiniciar tours
        </DropdownMenuItem>
        
        {!hasCompletedTour() && (
          <div className="px-2 py-1.5 bg-primary/5 rounded-md mx-1 my-1">
            <p className="text-xs text-primary font-medium">
              💡 ¡Primera vez aquí? Te recomendamos el tour completo!
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
