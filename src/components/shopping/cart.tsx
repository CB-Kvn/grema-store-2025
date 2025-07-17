import React from 'react';
import { X, Plus, Minus, Trash2, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartDrawerProps } from '@/interfaces/cart';


const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemove,
  onUpdateQuantity,
}) => {
  const navigate = useNavigate();

  const calculateDiscount = (price: number, discount: number | null): number => {
    if (!discount || discount === 0) return 0;
    return price * (discount / 100);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const warehouseItem = item.product.WarehouseItem?.[0];
      if (!warehouseItem) return sum; // Si no hay WarehouseItem, ignorar este producto
      const itemTotal = warehouseItem.price * item.quantity;
      const discount = calculateDiscount(itemTotal, warehouseItem.discount);
      return sum + (itemTotal - discount);
    }, 0);
  };

  const calculateSavings = () => {
    return items.reduce((sum, item) => {
      const warehouseItem = item.product.WarehouseItem?.[0];
      if (!warehouseItem) return sum; // Si no hay WarehouseItem, ignorar este producto
      return sum + calculateDiscount(warehouseItem.price * item.quantity, warehouseItem.discount);
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
                  const warehouseItem = item.product.WarehouseItem?.[0];
                  const imageUrl = item.product.Images?.[0]?.url?.[0] || 'https://via.placeholder.com/150';
                  const originalPrice = warehouseItem ? warehouseItem.price * item.quantity : 0;
                  const discount = warehouseItem ? calculateDiscount(originalPrice, warehouseItem.discount) : 0;
                  const finalPrice = originalPrice - discount;

                  return (
                    <div
                      key={item.product.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-primary-100"
                    >
                      <div className="flex gap-4">
                        <img
                          src={imageUrl}
                          alt={item.product.name || 'Producto'}
                          className="w-20 h-20 object-cover rounded-md"
                        />
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
                              {discount > 0 && (
                                <span className="ml-2 text-sm line-through text-primary-400">
                                  ₡{originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>

                            {/* Discount Badge */}
                            {discount > 0 && (
                              <div className="flex items-center text-sm text-green-600">
                                <Tag className="h-4 w-4 mr-1" />
                                <span>{warehouseItem?.discount}% de descuento aplicado</span>
                              </div>
                            )}

                            {/* Savings */}
                            {discount > 0 && (
                              <div className="text-xs text-primary-600">
                                Ahorras: ₡{discount.toLocaleString()}
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
            {items.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <div className="text-green-700 text-sm font-medium">
                  Ahorro total: ₡{calculateSavings().toLocaleString()}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-primary-900">Total</span>
              <span className="text-lg font-semibold text-primary-900">
                ₡{calculateTotal().toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary-600 text-white py-3 rounded-full font-medium hover:bg-primary-700 transition-colors disabled:bg-primary-200 disabled:cursor-not-allowed"
              disabled={items.length === 0}
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