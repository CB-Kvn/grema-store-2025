import React, { useEffect } from 'react';
import { useGlobalDiscounts } from '@/hooks/useGlobalDiscounts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Componente de ejemplo que muestra cómo usar los descuentos globales
 * Este componente puede ser usado en cualquier parte de la aplicación
 */
export const GlobalDiscountsExample: React.FC = () => {
  const {
    data: globalDiscounts,
    loading,
    error,
    refetch,
    refetchIfStale,
    clearError,
  } = useGlobalDiscounts();

  // Auto-refetch si los datos son antiguos (cada 5 minutos)
  useEffect(() => {
    refetchIfStale();
  }, [refetchIfStale]);

  const handleRefresh = () => {
    clearError();
    refetch();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Descuentos Globales
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error al cargar descuentos: {error}
            </AlertDescription>
          </Alert>
        )}

        {loading && !globalDiscounts && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Cargando descuentos...</span>
          </div>
        )}

        {globalDiscounts && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">
              Datos de descuentos globales:
            </h4>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(globalDiscounts, null, 2)}
            </pre>
          </div>
        )}

        {!loading && !globalDiscounts && !error && (
          <p className="text-gray-500 text-sm">
            No hay descuentos globales disponibles.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default GlobalDiscountsExample;