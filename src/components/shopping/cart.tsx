import React, { useMemo } from 'react';
import { X, Plus, Minus, Trash2, Tag, Percent, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IKImage, IKContext } from 'imagekitio-react';
import { CartItem } from '@/store/slices/cartSlice';
import { useDiscountCalculator } from '@/hooks/useDiscountCalculator';
import { CartItem as DiscountCartItem } from '@/utils/discountCalculator';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}


const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemove,
  onUpdateQuantity,
}) => {
  const navigate = useNavigate();

  // Convertir items del carrito al formato esperado por useDiscountCalculator
  const cartItemsForDiscount: DiscountCartItem[] = useMemo(() => {
    return items.map(item => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.WarehouseItem?.[0]?.price || item.product.price || 0,
        Images: item.product.image || '',
        description: item.product.description || '',
        category: item.product.category || '',
        sku: item.product.sku || '',
        details: item.product.details || {},
        createdAt: item.product.createdAt || '',
        updatedAt: item.product.updatedAt || '',
        available: item.product.available ?? true,
        WarehouseItem: item.product.WarehouseItem || [],
        filepaths: item.product.filepaths || []
      },
      quantity: item.quantity
    }));
  }, [items]);

  // Hook para calcular descuentos globales
  const {
    calculationResult,
    itemsWithDiscounts,
    hasDiscounts,
    isLoading: discountLoading,
    error: discountError
  } = useDiscountCalculator(cartItemsForDiscount);

  // Función para obtener información de descuento de un item específico
  const getItemDiscountInfo = (productId: number) => {
    if (!hasDiscounts || !itemsWithDiscounts.length) return null;
    
    const itemWithDiscount = itemsWithDiscounts.find(item => item.product.id === productId);
    if (!itemWithDiscount?.appliedDiscount) return null;

    const discount = itemWithDiscount.appliedDiscount;
    return {
      type: discount.type,
      value: discount.value,
      discountApplied: discount.discountApplied,
      originalPrice: discount.originalPrice,
      finalPrice: discount.finalPrice,
      message: discount.message,
      savings: discount.discountApplied,
      savingsPercentage: discount.originalPrice > 0 ? (discount.discountApplied / discount.originalPrice) * 100 : 0
    };
  };

  // Calcular totales usando los resultados del hook de descuentos
  const calculateTotal = () => {
    if (hasDiscounts && calculationResult && typeof calculationResult.finalAmount === 'number') {
      return calculationResult.finalAmount;
    }
    // Fallback al cálculo manual si no hay descuentos globales
    return items.reduce((sum, item) => {
      const warehouseItem = item.product.WarehouseItem?.[0];
      const basePrice = warehouseItem?.price || item.product.price || 0;
      return sum + (basePrice * item.quantity);
    }, 0);
  };

  const calculateSavings = () => {
    if (hasDiscounts && calculationResult && typeof calculationResult.discountAmount === 'number') {
      return calculationResult.discountAmount;
    }
    // Fallback al cálculo manual de descuentos de warehouse
    return items.reduce((sum, item) => {
      const warehouseItem = item.product.WarehouseItem?.[0];
      if (!warehouseItem?.discount) return sum;
      const basePrice = warehouseItem.price || item.product.price || 0;
      const discount = basePrice * item.quantity * (warehouseItem.discount / 100);
      return sum + discount;
    }, 0);
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-primary-100">
            <h2 className="text-xl font-semibold text-primary-900">Carrito de Compras</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-50 rounded-full transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="h-5 w-5 text-primary-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center text-primary-500 mt-8">
                Tu carrito está vacío
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const discountInfo = getItemDiscountInfo(item.product.id);
                  const warehouseItem = item.product.WarehouseItem?.[0];
                  const basePrice = warehouseItem?.price || item.product.price || 0;
                  
                  // Usar precios de descuentos globales si están disponibles, sino usar warehouse discount
                  const finalPrice = discountInfo ? discountInfo.finalPrice : basePrice * item.quantity;
                  const originalPrice = discountInfo ? discountInfo.originalPrice : basePrice * item.quantity;
                  const savings = discountInfo ? discountInfo.savings : (warehouseItem?.discount ? basePrice * item.quantity * (warehouseItem.discount / 100) : 0);

                  return (
                    <div
                      key={item.product.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-primary-100"
                    >
                      <div className="flex gap-4">
                        <IKContext urlEndpoint="https://ik.imagekit.io/wtelcc7rn">
                          <div className="w-20 h-20 rounded-md overflow-hidden">
                            <IKImage
                              path={
                                item.product.filepaths && item.product.filepaths[0] && item.product.filepaths[0].url
                                  ? JSON.parse(item.product.filepaths[0].url)[0]
                                  : "/placeholder.jpg"
                              }
                              transformation={[{ width: 80, height: 80, quality: 80 }]}
                              loading="lazy"
                              lqip={{ active: true }}
                              alt={item.product.name || 'Producto'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </IKContext>
                        <div className="flex-1">
                          <h3 className="font-medium text-primary-900">
                            {item.product.name || 'Producto sin nombre'}
                          </h3>

                          {/* Price Information */}
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center">
                              <span className="text-lg font-bold text-primary-900">
                                {finalPrice > 0 ? `₡${finalPrice.toLocaleString()}` : 'N/A'}
                              </span>
                              {savings > 0 && (
                                <span className="ml-2 text-sm line-through text-primary-400">
                                  ₡{originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>

                            {/* Discount Badge - Global or Warehouse */}
                            {discountInfo && (
                              <div className="flex items-center text-sm text-green-600">
                                {discountInfo.type === 'PERCENTAGE' && <Percent className="h-4 w-4 mr-1" />}
                                {discountInfo.type === 'FIXED' && <DollarSign className="h-4 w-4 mr-1" />}
                                {discountInfo.type === 'BUY_X_GET_Y' && <Tag className="h-4 w-4 mr-1" />}
                                <span>
                                  {discountInfo.type === 'PERCENTAGE' && `${discountInfo.value}% descuento global`}
                                  {discountInfo.type === 'FIXED' && `₡${discountInfo.value} descuento global`}
                                  {discountInfo.type === 'BUY_X_GET_Y' && 'Oferta especial aplicada'}
                                </span>
                              </div>
                            )}
                            {!discountInfo && warehouseItem?.discount && (
                              <div className="flex items-center text-sm text-green-600">
                                <Tag className="h-4 w-4 mr-1" />
                                <span>{warehouseItem.discount}% de descuento aplicado</span>
                              </div>
                            )}

                            {/* Savings */}
                            {savings > 0 && (
                              <div className="text-xs text-primary-600">
                                Ahorras: ₡{savings.toLocaleString()}
                                {discountInfo && discountInfo.savingsPercentage > 0 && (
                                  <span className="ml-1">({discountInfo.savingsPercentage.toFixed(0)}%)</span>
                                )}
                              </div>
                            )}

                            {/* Discount Message */}
                            {discountInfo?.message && (
                              <div className="text-xs text-blue-600 italic">
                                {discountInfo.message}
                              </div>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-primary-50 rounded"
                              disabled={item.quantity <= 1}
                              aria-label={`Disminuir cantidad de ${item.product.name}`}
                            >
                              <Minus className="h-4 w-4 text-primary-600" />
                            </button>
                            <span className="mx-2 min-w-[2rem] text-center text-primary-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-primary-50 rounded"
                              aria-label={`Aumentar cantidad de ${item.product.name}`}
                            >
                              <Plus className="h-4 w-4 text-primary-600" />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemove(item.product.id)}
                          className="p-2 hover:bg-primary-50 rounded-full transition-colors self-start"
                          aria-label={`Eliminar ${item.product.name} del carrito`}
                        >
                          <Trash2 className="h-5 w-5 text-primary-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with Total and Savings */}
          <div className="border-t border-primary-100 p-4">
            {items.length > 0 && calculateSavings() > 0 && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <div className="text-green-700 text-sm font-medium">
                  Ahorro total: ₡{calculateSavings().toLocaleString()}
                </div>
                {hasDiscounts && calculationResult && (
                  <div className="text-green-600 text-xs mt-1">
                    {calculationResult.appliedDiscounts.length > 0 && (
                      <span>Descuentos globales aplicados: {calculationResult.appliedDiscounts.length}</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Subtotal and Total */}
            {hasDiscounts && calculationResult && calculationResult.discountAmount > 0 && (
              <div className="flex justify-between items-center mb-2 text-sm text-primary-600">
                <span>Subtotal:</span>
                <span>₡{calculationResult.originalAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-primary-900">Total</span>
              <span className="text-lg font-semibold text-primary-900">
                ₡{calculateTotal().toLocaleString()}
              </span>
            </div>

            {/* Loading state for discount calculation */}
            {discountLoading && (
              <div className="text-center text-sm text-primary-500 mb-2">
                Calculando descuentos...
              </div>
            )}

            <button
              onClick={handleCheckout}
              className="w-full bg-primary-600 text-white py-3 rounded-full font-medium hover:bg-primary-700 transition-colors disabled:bg-primary-200 disabled:cursor-not-allowed"
              disabled={items.length === 0 || discountLoading}
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;