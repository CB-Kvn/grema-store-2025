/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PurchaseOrder } from '@/types';
import { purchaseOrderService } from '@/services';

const OrderDocumentsPage = () => {
  const { orderId: orderIdFromUrl } = useParams<{ orderId: string }>();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    file: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Filter orders based on search query
  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load orders on component mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const allOrders = await purchaseOrderService.getAll();
        setOrders(allOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };
    loadOrders();
  }, []);

  // Load specific order if orderId is in URL
  useEffect(() => {
    if (orderIdFromUrl) {
      const loadOrder = async () => {
        setIsLoading(true);
        try {
          const order = await purchaseOrderService.getById(orderIdFromUrl);
          if (order) {
            setSelectedOrder(order);
            setFormData(prev => ({ ...prev, orderId: order.id }));
            setSearchQuery(order.orderNumber);
          }
        } catch (error) {
          console.error('Error loading order:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadOrder();
    }
  }, [orderIdFromUrl]);

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
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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

    if (!formData.orderId) newErrors.orderId = 'El número de orden es requerido';
    if (!formData.file) newErrors.file = 'El archivo es requerido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Aquí iría la lógica para subir el archivo
      console.log('Uploading document:', {
        orderId: formData.orderId,
        file: formData.file
      });

      const uploadResponse: any = await purchaseOrderService.uploadReceipt(formData.orderId, formData.file);
      const receipt = uploadResponse.filePath;
     

      // Reset form after successful upload

      setSearchQuery('');
      setSelectedOrder(null);

      // Mostrar mensaje de éxito
      alert('Comprobante subido exitosamente' + receipt);

    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error al subir el comprobante');
    }
  };

  // Close search results when clicking outside
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <p>Cargando orden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold text-primary-900 mb-6">
            Subir Comprobante
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="search-container relative">
              <Label htmlFor="orderSearch">Número de Orden</Label>
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
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
                        <span>Subir un archivo</span>
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
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-300"
                disabled={!formData.orderId || !formData.file}
              >
                Subir Comprobante
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderDocumentsPage;