import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Actualizar estado para mostrar la UI de error
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log del error para debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Errores específicos de DOM que podemos intentar recuperar
    if (error.message.includes('removeChild') || 
        error.message.includes('insertBefore') ||
        error.message.includes('Node')) {
      console.warn('DOM manipulation error detected, attempting recovery...');
      
      // Intentar recuperación automática después de un breve delay
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined });
      }, 1000);
    }
  }

  render() {
    if (this.state.hasError) {
      // Renderizar UI de error personalizada
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
            <div className="mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Algo salió mal
            </h2>
            <p className="text-gray-600 mb-4">
              Hemos detectado un error temporal. La aplicación se está recuperando automáticamente.
            </p>
            {this.state.error?.message.includes('removeChild') && (
              <p className="text-sm text-gray-500 mb-4">
                Error de renderizado detectado. Reintentando...
              </p>
            )}
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
              }}
              className="w-full"
            >
              Intentar nuevamente
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full mt-2"
            >
              Recargar página
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
