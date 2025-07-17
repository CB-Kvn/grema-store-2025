import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminTour } from '@/hooks/useAdminTour';
import { Play, RotateCcw, Lightbulb, Star } from 'lucide-react';

export const TourDemo: React.FC = () => {
  const { startTour, startFullTour, resetTour, hasCompletedTour, highlightElement } = useAdminTour();

  const demoActions = [
    {
      title: 'Tour Completo',
      description: 'Experimenta el tour completo del panel de administración',
      icon: <Play className="h-5 w-5" />,
      action: startFullTour,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Tour del Dashboard',
      description: 'Aprende sobre los gráficos y métricas',
      icon: <Star className="h-5 w-5" />,
      action: () => startTour('inventario'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Tour de Productos',
      description: 'Descubre cómo gestionar tu inventario',
      icon: <Lightbulb className="h-5 w-5" />,
      action: () => startTour('productos'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Reiniciar Tours',
      description: 'Vuelve a ver todos los tours desde el inicio',
      icon: <RotateCcw className="h-5 w-5" />,
      action: resetTour,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const handleHighlight = () => {
    highlightElement('[data-tour="dashboard-tabs"]', {
      title: '✨ Elemento Destacado',
      description: 'Esta es una demostración de cómo destacar elementos específicos.'
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-6 w-6 text-primary-600" />
          Demo del Tour Interactivo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Prueba las diferentes funcionalidades del sistema de tour
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado del tour */}
        <div className={`p-3 rounded-lg border ${hasCompletedTour() ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
          <p className="text-sm font-medium">
            Estado: {hasCompletedTour() ? '✅ Tour completado' : '🚀 Nuevo usuario'}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {demoActions.map((action, index) => (
            <Button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white h-auto p-4 flex flex-col items-start gap-2`}
            >
              <div className="flex items-center gap-2 w-full">
                {action.icon}
                <span className="font-medium">{action.title}</span>
              </div>
              <span className="text-xs opacity-90 text-left">
                {action.description}
              </span>
            </Button>
          ))}
        </div>

        {/* Botón de highlight */}
        <Button
          onClick={handleHighlight}
          variant="outline"
          className="w-full"
        >
          Destacar Elemento de Ejemplo
        </Button>

        {/* Información adicional */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-sm mb-2">💡 Consejos:</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• Los tours se adaptan automáticamente al dispositivo</li>
            <li>• Puedes navegar con teclado (Enter, Escape, flechas)</li>
            <li>• El progreso se guarda automáticamente</li>
            <li>• Cada sección tiene su propio tour específico</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
