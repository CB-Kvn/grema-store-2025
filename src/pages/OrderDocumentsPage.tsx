/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PurchaseOrder } from '@/types';
import { purchaseOrderService } from '@/services';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearCart } from '@/store/slices/cartSlice';

const OrderDocumentsPage = () => {
  const { orderIdFromUrl } = useParams<{ orderIdFromUrl: string }>();
  const dispatch = useAppDispatch();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState(orderIdFromUrl);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState({ orderId: '', file: null as File | null,});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  // Filtrar órdenes según búsqueda
  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchQuery?.toLowerCase() || "")
  );

  // Cargar órdenes al montar el componente
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const allOrders = await purchaseOrderService.getAll();
        setOrders(allOrders);
      } catch (error) {
        console.error('Error al cargar las órdenes:', error);
      }
    };
    loadOrders();
  }, []);

  // Si hay orderIdFromUrl, busca la orden y la selecciona automáticamente
  useEffect(() => {
    if (orderIdFromUrl && orders.length > 0) {
      const found = orders.find(order => order.orderNumber === orderIdFromUrl || order.id === orderIdFromUrl);
      if (found) {
        setSelectedOrder(found);
        setFormData(prev => ({ ...prev, orderId: found.id }));
        setSearchQuery(found.orderNumber);
      }
    }
  }, [orderIdFromUrl, orders]);

  const handleOrderSelect = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setFormData(prev => ({ ...prev, orderId: order.id }));
    setSearchQuery(order.orderNumber);
    setShowResults(false);
    setErrors(prev => ({ ...prev, orderId: '' }));
  };

  const handleSearchFocus = () => {
    if (searchQuery) {
      setShowResults(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowResults(true);
    if (!value) {
      setSelectedOrder(null);
      setFormData(prev => ({ ...prev, orderId: '' }));
    }
    // No actualizar formData.orderId aquí, porque el usuario no debe escribirlo manualmente
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB límite
        setErrors({ ...errors, file: 'El archivo no debe superar los 5MB' });
        return;
      }
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        setErrors({ ...errors, file: 'Solo se permiten archivos PDF, JPG o PNG' });
        return;
      }
      setFormData({ ...formData, file });
      setErrors({ ...errors, file: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.orderId) newErrors.orderId = 'El número de orden es obligatorio';
    if (!formData.file) newErrors.file = 'El archivo es obligatorio';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);

      // Espera al menos 2 segundos, aunque la petición sea más rápida
      const uploadPromise = purchaseOrderService.uploadFileReceipt(
        formData.file as File
      );
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 2000));
      const [uploadResponse] = await Promise.all([uploadPromise, delayPromise]);

      // Luego actualizar el documento con la nueva información
      const docIndex = 0; // Asumiendo que trabajamos con el primer documento
      const updateData = {
        title: selectedOrder?.documents?.[docIndex]?.title || `Comprobante actualizado - ${selectedOrder?.orderNumber}`,
        status: selectedOrder?.documents?.[docIndex]?.status || 'PENDING' as const,
        url: uploadResponse.url,
        mimeType: uploadResponse.fileType,
        size: uploadResponse.size
      };
      debugger;
      await purchaseOrderService.updateDocument(selectedOrder?.id || '', updateData);

      // Limpiar el carrito después de completar el proceso exitosamente
      dispatch(clearCart());

      setUploadSuccess(true);
      setShowDialog(true);
      // NO limpies aquí el formulario
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Error al subir el documento:', error);
      setErrors({
        ...errors,
        submit: 'Error al subir el documento. Inténtalo de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar resultados de búsqueda al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // console.log('Form data updated:', formData);
  }, [formData]);

  return (
    <>
      {/* Modal de éxito, siempre presente pero controlado por showDialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="p-6 bg-white rounded-lg shadow-lg text-center max-w-sm w-full">
            <div className="mb-2 text-green-600 text-3xl">✔️</div>
            <div className="font-semibold text-lg mb-2">
              ¡Tu comprobante fue enviado correctamente!
            </div>
            <div className="text-primary-700 mb-4">
              Pronto validaremos tu pago y te notificaremos por correo electrónico.
            </div>
            <button
              className="mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              onClick={() => {
                setShowDialog(false);
                setFormData({ orderId: '', file: null });
                setSearchQuery('');
                setSelectedOrder(null);
                navigate('/tienda'); // Redirigir a la página principal o donde desees
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Formulario siempre visible */}
      <div className="min-h-screen bg-primary-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold text-primary-900 mb-6">
              Subir comprobante
            </h1>

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="search-container relative">
                <Label htmlFor="orderSearch">Número de orden</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                  <Input
                    id="orderSearch"
                    type="text"
                    placeholder="Buscar por número de orden..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    className={`pl-10 ${errors.orderId ? 'border-red-500' : ''}`}
                    disabled={!!orderIdFromUrl}
                  />
                </div>
                {showResults && filteredOrders.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-primary-100 max-h-60 overflow-y-auto">
                    {filteredOrders.map(order => (
                      <button
                        key={order.id}
                        type="button"
                        onClick={() => handleOrderSelect(order)}
                        className="w-full text-left px-4 py-2 hover:bg-primary-50 focus:bg-primary-50 focus:outline-none"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{order.orderNumber}</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                            {order.status === 'delivered'
                              ? 'Entregada'
                              : order.status === 'cancelled'
                              ? 'Cancelada'
                              : 'Pendiente'}
                          </span>
                        </div>
                        <p className="text-sm text-primary-500">
                          Fecha: {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
                {errors.orderId && (
                  <p className="text-sm text-red-500 mt-1">{errors.orderId}</p>
                )}
              </div>

              <div>
                <Label htmlFor="file">Archivo</Label>
                <div className="mt-1">
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-primary-300 hover:border-primary-400">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-primary-400" />
                      <div className="flex text-sm text-primary-600">
                        <label
                          htmlFor="file"
                          className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span>Subir archivo</span>
                          <input
                            id="file"
                            name="file"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                      </div>
                      <p className="text-xs text-primary-500">
                        PDF, JPG o PNG hasta 5MB
                      </p>
                    </div>
                  </div>
                  {formData.file && (
                    <p className="mt-2 text-sm text-primary-600">
                      Archivo seleccionado: {formData.file.name}
                    </p>
                  )}
                  {errors.file && (
                    <p className="text-sm text-red-500 mt-1">{errors.file}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-300 flex items-center justify-center"
                  disabled={!formData.file || isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      Subiendo...
                    </>
                  ) : (
                    'Subir comprobante'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDocumentsPage;