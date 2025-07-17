import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminTour } from '@/hooks/useAdminTour';
import { Play, TestTube, Eye } from 'lucide-react';

export const TourVisualTest: React.FC = () => {
  const { highlightElement } = useAdminTour();

  const testHighlight = () => {
    highlightElement('[data-test="highlight-demo"]', {
      title: '🎯 Elemento Destacado',
      description: 'Este es un ejemplo de cómo se ve el elemento destacado con los nuevos estilos mejorados.'
    });
  };

  const testBasicTour = () => {
    const { driver } = require('driver.js');
    
    const testDriver = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      popoverClass: 'driverjs-theme-grema',
      nextBtnText: 'Siguiente →',
      prevBtnText: '← Anterior',
      doneBtnText: '¡Perfecto! ✓',
      progressText: 'Paso {{current}} de {{total}}',
      smoothScroll: true,
      allowClose: true,
      steps: [
        {
          element: '[data-test="test-button-1"]',
          popover: {
            title: '🚀 ¡Bienvenido al Tour Mejorado!',
            description: 'Los estilos han sido completamente renovados para una mejor experiencia visual. Ahora puedes ver claramente el contenido destacado.',
          }
        },
        {
          element: '[data-test="test-button-2"]',
          popover: {
            title: '👁️ Visibilidad Mejorada',
            description: 'El overlay es menos opaco y el área destacada tiene mejor contraste. Los botones están mejor posicionados y son más legibles.',
          }
        },
        {
          element: '[data-test="test-card"]',
          popover: {
            title: '🎨 Diseño Renovado',
            description: 'Los popovers tienen un nuevo diseño con header azul, mejor tipografía y animaciones suaves. ¡Perfecto para guiar a los usuarios!',
          }
        }
      ]
    });

    testDriver.drive();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8" data-test="test-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-6 w-6 text-blue-600" />
          Prueba Visual del Tour Mejorado
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Prueba los nuevos estilos del tour interactivo
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Botones de prueba */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={testBasicTour}
            className="bg-blue-500 hover:bg-blue-600 text-white h-auto p-4 flex flex-col items-center gap-2"
            data-test="test-button-1"
          >
            <Play className="h-5 w-5" />
            <div className="text-center">
              <div className="font-medium">Tour de Prueba</div>
              <div className="text-xs opacity-90">Probar nuevos estilos</div>
            </div>
          </Button>

          <Button
            onClick={testHighlight}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
            data-test="test-button-2"
          >
            <Eye className="h-5 w-5" />
            <div className="text-center">
              <div className="font-medium">Destacar Elemento</div>
              <div className="text-xs opacity-70">Ver highlight mejorado</div>
            </div>
          </Button>
        </div>

        {/* Elemento para destacar */}
        <div 
          className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg"
          data-test="highlight-demo"
        >
          <h4 className="font-semibold text-blue-900 mb-2">Elemento de Demostración</h4>
          <p className="text-sm text-blue-700">
            Este elemento será destacado cuando hagas clic en "Destacar Elemento". 
            Notarás que ahora es mucho más visible y claro.
          </p>
        </div>

        {/* Información sobre las mejoras */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">🎉 Mejoras Implementadas:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Overlay menos opaco (40% vs 75%)</li>
            <li>• Elementos destacados más visibles</li>
            <li>• Header azul con texto blanco</li>
            <li>• Botones mejor posicionados y más grandes</li>
            <li>• Texto más legible y contrastado</li>
            <li>• Animaciones suaves y profesionales</li>
            <li>• Mejor experiencia en móviles</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
