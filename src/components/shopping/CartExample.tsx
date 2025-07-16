import React from 'react';
import { DiscountSummary } from './DiscountSummary';
import { CartItem } from '@/utils/discountCalculator';

// Ejemplo de uso del componente DiscountSummary en el carrito
const CartExample: React.FC = () => {
  // Ejemplo de items del carrito
  const cartItems: CartItem[] = [
    {
      product: {
        id: 1,
        name: 'Collar de Oro',
        price: 299.99,
        category: 'Collares',
        description: 'Collar de oro 18k'
      },
      quantity: 2
    },
    {
      product: {
        id: 2,
        name: 'Anillo de Plata',
        price: 89.99,
        category: 'Anillos',
        description: 'Anillo de plata 925'
      },
      quantity: 1
    }
  ];

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
      
      {/* Lista de productos */}
      <div className="space-y-3">
        {cartItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
            <div>
              <h3 className="font-medium">{item.product.name}</h3>
              <p className="text-gray-600">${item.product.price} × {item.quantity}</p>
            </div>
            <div className="font-bold">
              ${((item.product.price || 0) * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de descuentos */}
      <DiscountSummary cartItems={cartItems} />
    </div>
  );
};

export default CartExample;
