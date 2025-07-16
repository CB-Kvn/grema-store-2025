import React, { useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { DiscountSummary } from './DiscountSummary';
import { useDiscountCalculator } from '@/hooks/useDiscountCalculator';
import { CartItem } from '@/utils/discountCalculator';
import { productToCartItem } from '@/utils/cartHelpers';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Ejemplo completo de integración del sistema de descuentos
const CompleteCartExample: React.FC = () => {
  const user = useAppSelector(state => state.user.currentUser);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Productos de ejemplo
  const availableProducts: Product[] = [
    {
      id: 1,
      name: 'Collar de Oro 18k',
      price: 299.99,
      category: 'Collares',
      description: 'Elegante collar de oro 18k con diseño moderno',
      Images: '/images/collar-oro.jpg'
    },
    {
      id: 2,
      name: 'Anillo de Plata 925',
      price: 89.99,
      category: 'Anillos',
      description: 'Anillo de plata 925 con piedras preciosas',
      Images: '/images/anillo-plata.jpg'
    },
    {
      id: 3,
      name: 'Aretes de Diamante',
      price: 450.00,
      category: 'Aretes',
      description: 'Aretes con diamantes naturales certificados',
      Images: '/images/aretes-diamante.jpg'
    },
    {
      id: 4,
      name: 'Pulsera de Oro Rosa',
      price: 180.50,
      category: 'Pulseras',
      description: 'Pulsera delicada de oro rosa 14k',
      Images: '/images/pulsera-oro-rosa.jpg'
    }
  ];

  // Hook para calcular descuentos
  const { 
    formattedResult, 
    calculationResult,
    isLoading, 
    error, 
    hasDiscounts,
    recalculate
  } = useDiscountCalculator(cartItems);

  // Agregar producto al carrito
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingIndex = cartItems.findIndex(item => item.product.id === product.id);
    
    if (existingIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingIndex].quantity += quantity;
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, productToCartItem(product, quantity)]);
    }
  };

  // Actualizar cantidad
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remover del carrito
  const removeFromCart = (productId: number) => {
    setCartItems(items => items.filter(item => item.product.id !== productId));
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Simular proceso de pago
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    const checkoutData = {
      items: cartItems,
      user: user,
      pricing: {
        subtotal: calculationResult.originalAmount,
        discount: calculationResult.discountAmount,
        total: calculationResult.finalAmount
      },
      appliedDiscounts: calculationResult.appliedDiscounts
    };

    console.log('Datos de checkout:', checkoutData);
    alert(`Pago procesado por ${formattedResult.finalAmount}`);
    clearCart();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Sistema de Descuentos - Demo</h1>
        <p className="text-gray-600">
          Usuario: {user?.name || 'No autenticado'} | 
          Descuentos asignados: {user?.discounts?.length || 0}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Productos disponibles */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Disponibles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableProducts.map(product => (
              <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-lg font-bold text-green-600">${product.price}</p>
                </div>
                <Button 
                  onClick={() => addToCart(product)}
                  size="sm"
                >
                  Agregar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Carrito */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Carrito ({cartItems.length} items)</span>
              {cartItems.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearCart}
                >
                  Limpiar
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500">Tu carrito está vacío</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">
                        ${item.product.price} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id!, parseInt(e.target.value) || 0)}
                        className="w-16"
                        min="0"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromCart(item.product.id!)}
                      >
                        ×
                      </Button>
                    </div>
                    <div className="font-bold min-w-[80px] text-right">
                      ${((item.product.price || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumen de descuentos */}
      {cartItems.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <DiscountSummary cartItems={cartItems} />
          
          {/* Información adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Descuentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p><strong>Estado:</strong> {isLoading ? 'Calculando...' : 'Calculado'}</p>
                {error && (
                  <p className="text-red-600"><strong>Error:</strong> {error}</p>
                )}
                <p><strong>¿Tiene descuentos?:</strong> {hasDiscounts ? 'Sí' : 'No'}</p>
                <p><strong>Descuentos aplicados:</strong> {calculationResult.appliedDiscounts.length}</p>
              </div>
              
              {hasDiscounts && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Descuentos Aplicados:</h4>
                  <div className="space-y-1 text-sm">
                    {calculationResult.appliedDiscounts.map((discount, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{discount.type}</span>
                        <span className="font-bold">-${discount.discountApplied.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Botones de acción */}
      {cartItems.length > 0 && (
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={recalculate}
            disabled={isLoading}
          >
            Recalcular
          </Button>
          <Button 
            onClick={handleCheckout}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Calculando...' : `Pagar ${formattedResult.finalAmount}`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompleteCartExample;
