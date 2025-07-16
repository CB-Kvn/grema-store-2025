import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDiscountCalculator } from '@/hooks/useDiscountCalculator';
import { CartItem } from '@/utils/discountCalculator';

interface DiscountSummaryProps {
  cartItems: CartItem[];
  className?: string;
}

export const DiscountSummary: React.FC<DiscountSummaryProps> = ({ 
  cartItems, 
  className 
}) => {
  const { 
    formattedResult, 
    isLoading, 
    error, 
    hasDiscounts
  } = useDiscountCalculator(cartItems);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="text-center text-gray-500">
            Calculando descuentos...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="text-center text-red-500">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Resumen de Compra</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">{formattedResult.originalAmount}</span>
        </div>

        {/* Descuentos aplicados */}
        {hasDiscounts && (
          <div className="space-y-2">
            <div className="flex justify-between text-green-600">
              <span>Descuentos aplicados:</span>
              <span className="font-medium">-{formattedResult.discountAmount}</span>
            </div>
            
            {/* Detalle de cada descuento */}
            <div className="space-y-1">
              {formattedResult.appliedDiscounts.map((discount, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {discount.type === 'PERCENTAGE' ? 'Porcentaje' : 
                       discount.type === 'FIXED' ? 'Fijo' : 'Promoción'}
                    </Badge>
                    <span className="text-gray-500">
                      {discount.type === 'PERCENTAGE' ? `${discount.value}%` : ''}
                    </span>
                  </div>
                  <span className="text-green-600 font-medium">
                    -{discount.discountApplied}
                  </span>
                </div>
              ))}
            </div>

            {/* Resumen de ahorros */}
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-green-700 font-medium">
                  Total ahorrado:
                </span>
                <span className="text-green-700 font-bold">
                  {formattedResult.savings} ({formattedResult.savingsPercentage})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Separador */}
        <Separator />

        {/* Total final */}
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total a pagar:</span>
          <span className={hasDiscounts ? 'text-green-600' : 'text-black'}>
            {formattedResult.finalAmount}
          </span>
        </div>

        {/* Mensaje cuando no hay descuentos */}
        {!hasDiscounts && (
          <div className="text-center text-gray-500 text-sm">
            No tienes descuentos aplicables en esta compra
          </div>
        )}
      </CardContent>
    </Card>
  );
};
