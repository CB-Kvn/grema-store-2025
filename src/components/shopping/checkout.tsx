import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Gift, Shield, ArrowLeft, Copy, Phone, Wallet, AlertCircle } from 'lucide-react';


import { cantones } from '@/utils/location';
import { AddressInfo, CartItem } from '@/types';
import { Label } from '../ui/label';
import AddressForm from './addressForm';

interface CheckoutPageProps {
  cartItems: CartItem[];
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'billing' | 'payment' | 'confirmation'>('shipping');
  const [shippingInfo, setShippingInfo] = useState<AddressInfo>({
    buyerId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    provincia: '',
    canton: '',
  });
  const [billingInfo, setBillingInfo] = useState<AddressInfo>({
    buyerId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    provincia: '',
    canton: '',
  });
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [needInvoice, setNeedInvoice] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'sinpe' | 'transfer'>('sinpe');

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      const discount = itemTotal * 0.15; // 15% discount
      return sum + (itemTotal - discount);
    }, 0);
  };

  const calculateShipping = () => {
    if (!shippingInfo.provincia || !shippingInfo.canton) return 0;
    
    const provinciaId = shippingInfo.provincia as keyof typeof cantones;
    const canton = cantones[provinciaId].find(c => c.nombre === shippingInfo.canton);
    
    return canton ? canton.costoEnvio : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (needInvoice) {
      if (useSameAddress) {
        setBillingInfo(shippingInfo);
      }
      setStep('billing');
    } else {
      setStep('payment');
    }
  };

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = {
      shippingInfo,
      billingInfo: needInvoice ? billingInfo : shippingInfo,
      paymentMethod,
      cartItems,
      total: calculateTotal()
    };
    console.log('Order Data:', orderData);
    setStep('confirmation');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Volver</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === 'shipping' ? 'bg-primary-600 text-white' : 
                      step === 'billing' || step === 'payment' || step === 'confirmation' ? 'bg-green-500 text-white' : 'bg-primary-100 text-primary-600'
                    }`}>
                      1
                    </div>
                    <div className="ml-2">Envío</div>
                  </div>
                  <div className="h-px w-12 bg-primary-200" />
                  {needInvoice && (
                    <>
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step === 'billing' ? 'bg-primary-600 text-white' :
                          step === 'payment' || step === 'confirmation' ? 'bg-green-500 text-white' : 'bg-primary-100 text-primary-600'
                        }`}>
                          2
                        </div>
                        <div className="ml-2">Facturación</div>
                      </div>
                      <div className="h-px w-12 bg-primary-200" />
                    </>
                  )}
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === 'payment' ? 'bg-primary-600 text-white' :
                      step === 'confirmation' ? 'bg-green-500 text-white' : 'bg-primary-100 text-primary-600'
                    }`}>
                      {needInvoice ? '3' : '2'}
                    </div>
                    <div className="ml-2">Pago</div>
                  </div>
                  <div className="h-px w-12 bg-primary-200" />
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === 'confirmation' ? 'bg-green-500 text-white' : 'bg-primary-100 text-primary-600'
                    }`}>
                      {needInvoice ? '4' : '3'}
                    </div>
                    <div className="ml-2">Confirmación</div>
                  </div>
                </div>
              </div>

              {/* Forms */}
              {step === 'shipping' && (
                <div className="space-y-6">
                  <AddressForm
                    type="shipping"
                    values={shippingInfo}
                    onChange={setShippingInfo}
                    onSubmit={handleShippingSubmit}
                  />
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="needInvoice"
                        checked={needInvoice}
                        onChange={(e) => setNeedInvoice(e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-300 rounded"
                      />
                      <label htmlFor="needInvoice" className="ml-2 block text-sm text-primary-700">
                        Necesito factura
                      </label>
                    </div>

                    {needInvoice && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="sameAddress"
                          checked={useSameAddress}
                          onChange={(e) => setUseSameAddress(e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-primary-300 rounded"
                        />
                        <label htmlFor="sameAddress" className="ml-2 block text-sm text-primary-700">
                          Usar la misma dirección para facturación
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 'billing' && (
                <div className="space-y-6">
                  <AddressForm
                    type="billing"
                    values={billingInfo}
                    onChange={setBillingInfo}
                    onSubmit={handleBillingSubmit}
                    onBack={() => setStep('shipping')}
                  />
                  {!useSameAddress && (
                    <button
                      type="button"
                      onClick={() => setBillingInfo(shippingInfo)}
                      className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      <span>Copiar datos de envío</span>
                    </button>
                  )}
                </div>
              )}

              {step === 'payment' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-primary-900">Método de Pago</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('sinpe')}
                        className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center space-y-2 ${
                          paymentMethod === 'sinpe' 
                            ? 'border-primary-600 bg-primary-50' 
                            : 'border-primary-200 hover:border-primary-300'
                        }`}
                      >
                        <Phone className="h-6 w-6 text-primary-600" />
                        <span className="font-medium">SINPE Móvil</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('transfer')}
                        className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center space-y-2 ${
                          paymentMethod === 'transfer' 
                            ? 'border-primary-600 bg-primary-50' 
                            : 'border-primary-200 hover:border-primary-300'
                        }`}
                      >
                        <Wallet className="h-6 w-6 text-primary-600" />
                        <span className="font-medium">Transferencia Bancaria</span>
                      </button>
                    </div>

                    {/* Payment Instructions */}
                    <div className="mt-6 p-4 bg-primary-50 rounded-lg space-y-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-primary-600 mt-0.5 mr-2" />
                        <p className="text-primary-600">
                          Por favor, realiza el pago utilizando los siguientes datos. Una vez realizado,
                          haz clic en "Confirmar Pedido" y te enviaremos los detalles por correo.
                        </p>
                      </div>

                      {paymentMethod === 'sinpe' ? (
                        <div className="space-y-3">
                          <div>
                            <Label>Número SINPE Móvil</Label>
                            <div className="flex items-center mt-1">
                              <div className="flex-1 bg-white p-3 rounded-lg font-medium">
                                6194-1946
                              </div>
                              <button
                                type="button"
                                onClick={() => copyToClipboard('61941946')}
                                className="ml-2 p-2 hover:bg-primary-100 rounded-lg"
                              >
                                <Copy className="h-5 w-5 text-primary-600" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <Label>A nombre de</Label>
                            <div className="bg-white p-3 rounded-lg font-medium mt-1">
                              Grettel María Barrantes Pérez
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <Label>Banco</Label>
                            <div className="bg-white p-3 rounded-lg font-medium mt-1">
                              Banco Nacional de Costa Rica
                            </div>
                          </div>
                          <div>
                            <Label>Cuenta IBAN</Label>
                            <div className="flex items-center mt-1">
                              <div className="flex-1 bg-white p-3 rounded-lg font-medium">
                                CR20015109020010099567
                              </div>
                              <button
                                type="button"
                                onClick={() => copyToClipboard('CR88015100010023004932')}
                                className="ml-2 p-2 hover:bg-primary-100 rounded-lg"
                              >
                                <Copy className="h-5 w-5 text-primary-600" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <Label>Cuenta Cliente</Label>
                            <div className="flex items-center mt-1">
                              <div className="flex-1 bg-white p-3 rounded-lg font-medium">
                              15109020010099567
                              </div>
                              <button
                                type="button"
                                onClick={() => copyToClipboard('15100010023004932')}
                                className="ml-2 p-2 hover:bg-primary-100 rounded-lg"
                              >
                                <Copy className="h-5 w-5 text-primary-600" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <Label>Cuenta</Label>
                            <div className="flex items-center mt-1">
                              <div className="flex-1 bg-white p-3 rounded-lg font-medium">
                              200-01-090-009956-8
                              </div>
                              <button
                                type="button"
                                onClick={() => copyToClipboard('15100010023004932')}
                                className="ml-2 p-2 hover:bg-primary-100 rounded-lg"
                              >
                                <Copy className="h-5 w-5 text-primary-600" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <Label>A nombre de</Label>
                            <div className="bg-white p-3 rounded-lg font-medium mt-1">
                              Grettel María Barrantes Pérez
                            </div>
                          </div>
                          <div>
                            <Label>Cédula Física</Label>
                            <div className="flex items-center mt-1">
                              <div className="flex-1 bg-white p-3 rounded-lg font-medium">
                                1-149-30574
                              </div>
                              <button
                                type="button"
                                onClick={() => copyToClipboard('3101123456')}
                                className="ml-2 p-2 hover:bg-primary-100 rounded-lg"
                              >
                                <Copy className="h-5 w-5 text-primary-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(needInvoice ? 'billing' : 'shipping')}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition-colors"
                    >
                      Confirmar Pedido
                    </button>
                  </div>
                </form>
              )}

              {step === 'confirmation' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-900 mb-2">¡Pedido Confirmado!</h2>
                  <p className="text-primary-600 mb-2">
                    Gracias por tu compra. Recibirás un email con los detalles de tu pedido.
                  </p>
                  {shippingInfo.buyerId && (
                    <p className="text-primary-600 mb-2">
                      ID de Envío: <span className="font-medium">{shippingInfo.buyerId}</span>
                    </p>
                  )}
                  {needInvoice && billingInfo.buyerId && (
                    <p className="text-primary-600 mb-6">
                      ID de Facturación: <span className="font-medium">{billingInfo.buyerId}</span>
                    </p>
                  )}
                  <button
                    onClick={() => navigate('/')}
                    className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition-colors"
                  >
                    Volver a la Tienda
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <h2 className="text-lg font-semibold text-primary-900">Resumen del Pedido</h2>
              
              {/* Items */}
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  const discount = itemTotal * 0.15;
                  const finalPrice = itemTotal - discount;

                  return (
                    <div key={item.id} className="flex items-start space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-primary-900">{item.name}</h3>
                        <p className="text-sm text-primary-500">Cantidad: {item.quantity}</p>
                        <div className="flex items-baseline mt-1">
                          <span className="text-sm font-medium text-primary-900">
                            ${finalPrice.toLocaleString()}
                          </span>
                          <span className="ml-2 text-xs line-through text-primary-400">
                            ${itemTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="border-t border-primary-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-600">Subtotal</span>
                  <span className="text-primary-900">${calculateSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-600">Envío</span>
                  <span className={calculateShipping() > 0 ? "text-primary-900" : "text-green-600"}>
                    {calculateShipping() > 0 ? `₡${calculateShipping().toLocaleString()}` : 'Por calcular'}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-primary-900">Total</span>
                  <span className="text-primary-900">
                    ${calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Benefits */}
              <div className="border-t border-primary-100 pt-4 space-y-3">
                <div className="flex items-center text-sm text-primary-600">
                  <Truck className="h-4 w-4 mr-2" />
                  <span>Envío a todo el país</span>
                </div>
                <div className="flex items-center text-sm text-primary-600">
                  <Gift className="h-4 w-4 mr-2" />
                  <span>Empaque de regalo disponible</span>
                </div>
                <div className="flex items-center text-sm text-primary-600">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Compra segura garantizada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;