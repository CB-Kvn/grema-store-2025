/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Search, Plus, Edit, Trash2, Package, Percent, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label'; // Importación añadida
import ProductForm from './ProductForm';
import InventoryManagementModal from './InventoryManagementModal';
import { RootState } from '@/store';
import { addProduct, updateProduct, deleteProduct, setProducts, setProductInventory } from '@/store/slices/productsSlice';
import type { Product, WarehouseItem } from '@/types';
import { productService } from '@/services/productService';
import { warehouseService } from '@/services/warehouseService';
import { addWarehouseItems, setWarehouseItems } from '@/store/slices/warehousesSlice';

const ProductTab = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const warehouses = useSelector((state: RootState) => state.warehouses.warehouses);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [discount, setDiscount] = useState({
    isActive: false,
    type: 'PERCENTAGE',
    value: 0,
    startDate: '',
    endDate: '',
    minQuantity: 0,
    maxQuantity: 0,
  });
  const itemsPerPage = 10; // Número de productos por página
  const [currentPage, setCurrentPage] = useState<number>(() => {
    // Recuperar la página actual de localStorage
    const savedPage = localStorage.getItem('currentPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Guardar la página actual en localStorage
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage.toString());
  }, [currentPage]);

  // Sincronizar la página actual entre pestañas
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentPage') {
        const newPage = parseInt(event.newValue || '1', 10);
        setCurrentPage(newPage);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Calcular los productos visibles en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(filteredProducts.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  // Filtrar productos y reiniciar la página actual
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reiniciar a la primera página al cambiar los filtros
  }, [searchQuery, products]);

  const getByIdProducts = async (id: number) => {
    const response = await warehouseService.getByIdProducts(id) as WarehouseItem[];

    response.forEach(element => {
      dispatch(addWarehouseItems({quantity: element.quantity, location: element.location, price: element.price}));
    });
    // dispatch(setWarehouseItems(response[0].discount));
  }
  // Manejar edición de producto
  const handleEdit = (product: Product) => {

   
    dispatch(setProductInventory(product))
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Manejar gestión de inventario
  const handleInventoryManagement = (product: Product) => {
    getByIdProducts(product.id!)
    setSelectedProduct(product);
    setIsInventoryModalOpen(true);
  };

  // Manejar envío del formulario
  const handleSubmit = (product: Product) => {
    if (product.id) {
      dispatch(updateProduct(product)); // Actualizar producto existente
    } else {
      dispatch(addProduct({ ...product, id: Date.now() })); // Agregar nuevo producto
    }
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddStock = async (warehouseId: string, productId: number, data: { quantity: number; location: string; price: number }) => {
    await warehouseService.addStock(warehouseId, productId, data)
  }

  // Manejar envío de inventario
  const handleInventorySubmit = (data: any) => {
    // Aquí se despacharía la acción correspondiente
    console.log('Datos de inventario:', data);
    console.log('Producto seleccionado:', selectedProduct);
    data.inventory.forEach( element => {
      handleAddStock(element.location, selectedProduct!.id!, {quantity: element.quantity, location: element.location, price: element.price});
    });
    
    // Aquí puedes manejar la lógica de envío de datos de inventario
    console.log('Datos de inventario enviados:', data);
    setIsInventoryModalOpen(false);
    setSelectedProduct(null);
  };

  // Manejar eliminación de producto
  const handleDelete = (productId: number) => {
    dispatch(deleteProduct(productId));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await productService.getAll() as Product[];
      dispatch(setProducts(response));
    }
    fetchProducts()
  }, []);

  return (
    <div className="space-y-6">
      {/* Barra de herramientas */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        {/* Barra de búsqueda (visible al lado izquierdo de los botones en pantallas grandes) */}
        <div className="hidden lg:block flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Contenedor de botones */}
        <div className="flex flex-wrap gap-2">
          {/* Botón Nuevo Producto */}
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="flex-1 lg:flex-none flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>Nuevo Producto</span>
          </button>

          {/* Botón Gestionar Descuentos */}
          <button
            type="button"
            onClick={() => setIsDiscountModalOpen(!isDiscountModalOpen)}
            className="flex-1 lg:flex-none flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Percent className="h-5 w-5 mr-2" />
            <span>Gestionar Descuentos</span>
          </button>

          {/* Select para filtrar productos */}
          <div className="relative flex-1 lg:flex-none">
            <select
              onChange={(e) => {
                const filter = e.target.value;
                if (filter === 'with-stock') {
                  setFilteredProducts(products.filter((product) =>
                    product.WarehouseItem.some((item) => item.quantity > 0)
                  ));
                } else if (filter === 'without-stock') {
                  setFilteredProducts(products.filter((product) =>
                    product.WarehouseItem.every((item) => item.quantity === 0)
                  ));
                } else if (filter === 'new') {
                  setFilteredProducts([...products].sort((a, b) => b.id - a.id)); // Ordenar por ID descendente
                } else if (filter === 'old') {
                  setFilteredProducts([...products].sort((a, b) => a.id - b.id)); // Ordenar por ID ascendente
                } else {
                  setFilteredProducts(products); // Mostrar todos los productos
                }
              }}
              className="w-full px-4 py-2 bg-white border border-primary-300 rounded-lg text-primary-700 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Todos</option>
              <option value="with-stock">Con Stock</option>
              <option value="without-stock">Sin Stock</option>
              <option value="new">Nuevos</option>
              <option value="old">Viejos</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400 pointer-events-none" />
          </div>
        </div>

        {/* Barra de búsqueda (visible debajo de los botones en pantallas menores a 1000px) */}
        <div className="lg:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>
      </div>

      {/* Desplegable para gestionar descuentos */}
      {isDiscountModalOpen && (
        <div className="bg-primary-50 p-4 rounded-lg space-y-4">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={discount.isActive}
              onChange={(e) => setDiscount({ ...discount, isActive: e.target.checked })}
              className="rounded border-primary-300 text-primary-600 focus:ring-primary-500"
            />
            <Label className="ml-2">Activar descuento</Label>
          </div>

          {discount.isActive && (
            <>
              <div>
                <Label>Tipo de Descuento</Label>
                <select
                  value={discount.type}
                  onChange={(e) => setDiscount({ ...discount, type: e.target.value })}
                  className="w-full mt-1 rounded-lg border border-primary-200 p-2"
                >
                  <option value="PERCENTAGE">Porcentaje</option>
                  <option value="FIXED_AMOUNT">Monto Fijo</option>
                  <option value="BUY_X_GET_Y">Compre X Lleve Y</option>
                </select>
              </div>

              <div>
                <Label>
                  {discount.type === 'PERCENTAGE'
                    ? 'Porcentaje'
                    : discount.type === 'FIXED_AMOUNT'
                    ? 'Monto'
                    : 'Cantidad mínima'}
                </Label>
                <Input
                  type="number"
                  value={discount.value}
                  onChange={(e) => setDiscount({ ...discount, value: parseFloat(e.target.value) })}
                  min="0"
                  step={discount.type === 'PERCENTAGE' ? '0.01' : '1'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha de Inicio</Label>
                  <Input
                    type="date"
                    value={discount.startDate}
                    onChange={(e) => setDiscount({ ...discount, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Fecha de Fin (Opcional)</Label>
                  <Input
                    type="date"
                    value={discount.endDate}
                    onChange={(e) => setDiscount({ ...discount, endDate: e.target.value })}
                  />
                </div>
              </div>

              {(discount.type === 'PERCENTAGE' || discount.type === 'FIXED_AMOUNT') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cantidad Mínima (Opcional)</Label>
                    <Input
                      type="number"
                      value={discount.minQuantity || ''}
                      onChange={(e) => setDiscount({ ...discount, minQuantity: parseInt(e.target.value) })}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label>Cantidad Máxima (Opcional)</Label>
                    <Input
                      type="number"
                      value={discount.maxQuantity || ''}
                      onChange={(e) => setDiscount({ ...discount, maxQuantity: parseInt(e.target.value) })}
                      min="0"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Botón para confirmar */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                console.log('Descuento aplicado:', discount);
                setIsDiscountModalOpen(false);
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Confirmar Descuento
            </button>
          </div>
        </div>
      )}

      {/* Tabla de productos */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-50">
              {discount.isActive && (
                <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">
                  Seleccionar
                </th>
              )}
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Producto</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Precio</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Estado</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Categoría</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Peso</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Material</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Colores</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Cantidad</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id} className="border-b border-primary-100">
                {discount.isActive && (
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5 bg-primary-500 text-white border-primary-500 rounded focus:ring-primary-500 focus:ring-2 checked:bg-primary-600"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProduct(product);
                          } else {
                            setSelectedProduct(null);
                          }
                        }}
                      />
                    </div>
                  </td>
                )}
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.Images[0]?.url[0]}
                      alt={product.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm sm:text-base font-medium text-primary-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs sm:text-sm text-primary-500">SKU: {product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm sm:text-base font-medium text-primary-900">
                    ₡{product.WarehouseItem[0]?.price.toLocaleString() || 'N/A'}
                  </p>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                      product.WarehouseItem.some((item) => item.quantity > 0)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.WarehouseItem.some((item) => item.quantity > 0) ? 'En Stock' : 'Agotado'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-primary-700">{product.category || 'N/A'}</p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-primary-700">{product.details?.peso || 'N/A'}</p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-primary-700">{product.details?.material?.join(', ') || 'N/A'}</p>
                </td>
                <td className="py-3 px-4">
                  {product.details?.color?.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span
                        className="inline-block w-4 h-4 rounded-full"
                        style={{ backgroundColor: color.hex }}
                      ></span>
                      <span className="text-sm text-primary-700">{color.name}</span>
                    </div>
                  )) || 'N/A'}
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-primary-700">
                    {product.WarehouseItem.reduce((total, item) => total + item.quantity, 0)}
                  </p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-1 hover:bg-primary-50 rounded"
                      title="Editar Producto"
                    >
                      <Edit className="h-4 w-4 text-primary-600" />
                    </button>
                    <button
                      onClick={() => handleInventoryManagement(product)}
                      className="p-1 hover:bg-primary-50 rounded"
                      title="Gestionar Inventario"
                    >
                      <Package className="h-4 w-4 text-primary-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id!)}
                      className="p-1 hover:bg-primary-50 rounded"
                      title="Eliminar Producto"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary-500 text-white hover:bg-primary-700'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm text-primary-700">
          Página {currentPage} de {Math.ceil(filteredProducts.length / itemsPerPage)}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === Math.ceil(filteredProducts.length / itemsPerPage)
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-primary-500 text-white hover:bg-primary-700'
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Modal de formulario de producto */}
      {isModalOpen && (
        <ProductForm
          product={selectedProduct || undefined}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {/* Modal de gestión de inventario */}
      {isInventoryModalOpen && selectedProduct && (
        <InventoryManagementModal
          product={selectedProduct}
          warehouses={warehouses}
          onClose={() => {
            setIsInventoryModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={handleInventorySubmit}
        />
      )}
    </div>
  );
};

export default ProductTab;