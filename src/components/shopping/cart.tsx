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
  
  const calculateDiscount = (price: number) => {
    return price * 0.15; // 15% discount
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      const discount = calculateDiscount(itemTotal);
      return sum + (itemTotal - discount);
    }, 0);
  };

  const calculateSavings = () => {
    return items.reduce((sum, item) => {
      return sum + (calculateDiscount(item.price * item.quantity));
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
                  const originalPrice = item.price * item.quantity;
                  const discount = calculateDiscount(originalPrice);
                  const finalPrice = originalPrice - discount;

                  return (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-primary-100">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-primary-900">{item.name}</h3>
                          
                          {/* Price Information */}
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center">
                              <span className="text-lg font-bold text-primary-900">
                                ${finalPrice.toLocaleString()}
                              </span>
                              <span className="ml-2 text-sm line-through text-primary-400">
                                ${originalPrice.toLocaleString()}
                              </span>
                            </div>
                            
                            {/* Discount Badge */}
                            <div className="flex items-center text-sm text-green-600">
                              <Tag className="h-4 w-4 mr-1" />
                              <span>15% de descuento aplicado</span>
                            </div>
                            
                            {/* Savings */}
                            <div className="text-xs text-primary-600">
                              Ahorras: ${discount.toLocaleString()}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-primary-50 rounded"
                            >
                              <Minus className="h-4 w-4 text-primary-600" />
                            </button>
                            <span className="mx-2 min-w-[2rem] text-center text-primary-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-primary-50 rounded"
                            >
                              <Plus className="h-4 w-4 text-primary-600" />
                            </button>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => onRemove(item.id)}
                          className="p-2 hover:bg-primary-50 rounded-full transition-colors self-start"
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
                  Ahorro total: ${calculateSavings().toLocaleString()}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-primary-900">Total</span>
              <span className="text-lg font-semibold text-primary-900">
                ${calculateTotal().toLocaleString()}
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