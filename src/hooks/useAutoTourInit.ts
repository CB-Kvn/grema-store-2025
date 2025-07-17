import { useEffect } from 'react';

// Hook simplificado para inicializar tour automáticamente sin ciclos infinitos
export const useAutoTourInit = () => {
  useEffect(() => {
    // Solo ejecutar una vez al montar el componente
    const hasCompletedTour = localStorage.getItem('grema-admin-tour-completed') === 'true';
    
    if (!hasCompletedTour) {
      // Importar dinámicamente para evitar dependencias circulares
      const initTour = async () => {
        try {
          const { driver } = await import('driver.js');
          
          const tourDriver = driver({
            showProgress: true,
            showButtons: ['next', 'previous', 'close'],
            popoverClass: 'driverjs-theme-grema',
            nextBtnText: 'Siguiente →',
            prevBtnText: '← Anterior',
            doneBtnText: '¡Entendido! ✓',
            progressText: 'Paso {{current}} de {{total}}',
            onDestroyed: () => {
              localStorage.setItem('grema-admin-tour-completed', 'true');
            },
            steps: [
              {
                element: '[data-tour="dashboard-tabs"]',
                popover: {
                  title: '¡Bienvenido al Panel de Administración! 🎉',
                  description: 'Te voy a guiar por las funcionalidades principales. ¡Comencemos!'
                }
              },
              {
                element: '[data-tour="tour-btn"]',
                popover: {
                  title: 'Botón de Ayuda 🆘',
                  description: 'Siempre puedes hacer clic aquí para obtener ayuda.'
                }
              }
            ]
          });

          // Esperar un poco para que los elementos se rendericen
          setTimeout(() => {
            tourDriver.drive();
          }, 2000);
          
        } catch (error) {
          console.warn('No se pudo inicializar el tour automático:', error);
        }
      };

      initTour();
    }
  }, []); // Solo ejecutar al montar, sin dependencias
};
