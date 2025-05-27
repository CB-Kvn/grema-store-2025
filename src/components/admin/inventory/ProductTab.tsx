/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search, Plus, Edit, Trash2, Package, Percent, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductForm from './ProductForm';
import InventoryManagementModal from './InventoryManagementModal';
import { RootState } from '@/store';
import { addProduct, updateProduct, deleteProduct, setProducts, setProductInventory } from '@/store/slices/productsSlice';
import type { Product, WarehouseItem } from '@/types';
import { productService } from '@/services/productService';
import { warehouseService } from '@/services/warehouseService';
import { addWarehouseItems, setWarehouseItems } from '@/store/slices/warehousesSlice';
import { useProductService } from '@/hooks/useProductService';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { Tooltip } from '@/components/ui/tooltip';

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
  const {deleteProduct} = useProductService()
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
      dispatch(addWarehouseItems({ quantity: element.quantity, location: element.location, price: element.price }));
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
    data.inventory.forEach(element => {
      handleAddStock(element.location, selectedProduct!.id!, { quantity: element.quantity, location: element.location, price: element.price });
    });

    // Aquí puedes manejar la lógica de envío de datos de inventario
    console.log('Datos de inventario enviados:', data);
    setIsInventoryModalOpen(false);
    setSelectedProduct(null);
  };

  // Manejar eliminación de producto usando el hook useProductService
  const handleDelete = async (productId: number) => {
    try {
      await deleteProduct(productId); // Llama al método del hook
      dispatch(setProducts(products.filter((p) => p.id !== productId))); // Actualiza el estado local
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("No se pudo eliminar el producto.");
    }
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
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6 relative">
        {/* Barra de búsqueda */}
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
        {/* Botones flotantes a la derecha */}
        <div className="fixed right-8 bottom-8 z-50 flex flex-col gap-3 lg:static lg:flex-row lg:gap-2">
          {/* Botón "Nuevo" */}
          <Button
            data-intro="Haz clic aquí para agregar un nuevo producto."
            data-step="1"
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            variant="default"
            className="flex items-center justify-center bg-primary-500 hover:bg-primary-700 text-white rounded-lg shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo
          </Button>
          <Button
            type="button"
            onClick={() => setIsDiscountModalOpen(!isDiscountModalOpen)}
            variant="secondary"
            className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-lg"
          >
            <Percent className="h-5 w-5 mr-2" />
            Descuentos
          </Button>
        </div>
        {/* Barra de filtros */}
        <div
          className="flex-1 lg:max-w-xs"
          data-intro="Filtra los productos por stock, antigüedad y más."
          data-step="2"
        >
          <Select
            onValueChange={(filter) => {
              if (filter === 'with-stock') {
                setFilteredProducts(products.filter((product) =>
                  product.WarehouseItem.some((item) => item.quantity > 0)
                ));
              } else if (filter === 'without-stock') {
                setFilteredProducts(products.filter((product) =>
                  product.WarehouseItem.every((item) => item.quantity === 0)
                ));
              } else if (filter === 'new') {
                setFilteredProducts([...products].sort((a, b) => b.id - a.id));
              } else if (filter === 'old') {
                setFilteredProducts([...products].sort((a, b) => a.id - b.id));
              } else {
                setFilteredProducts(products);
              }
            }}
          >
            <SelectTrigger className="w-full px-4 py-2 bg-white border border-primary-300 rounded-lg text-primary-700 focus:ring-primary-500 focus:border-primary-500 relative">
              <SelectValue placeholder="Filtrar" />
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400 pointer-events-none" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="with-stock">Con Stock</SelectItem>
              <SelectItem value="without-stock">Sin Stock</SelectItem>
              <SelectItem value="new">Nuevos</SelectItem>
              <SelectItem value="old">Viejos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Barra de búsqueda móvil */}
        <div className="lg:hidden w-full">
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

      {/* Modal de descuentos */}
      {isDiscountModalOpen && (
        <div className="bg-primary-50 p-4 rounded-lg space-y-4">
          <div className="flex items-center mb-4">
            <Input
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
                <Select
                  value={discount.type}
                  onValueChange={(value) => setDiscount({ ...discount, type: value })}
                >
                  <SelectTrigger className="w-full mt-1 rounded-lg border border-primary-200 p-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Porcentaje</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">Monto Fijo</SelectItem>
                    <SelectItem value="BUY_X_GET_Y">Compre X Lleve Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>
                  {discount.type === "PERCENTAGE"
                    ? "Porcentaje"
                    : discount.type === "FIXED_AMOUNT"
                    ? "Monto"
                    : "Cantidad mínima"}
                </Label>
                <Input
                  type="number"
                  value={discount.value}
                  onChange={(e) => setDiscount({ ...discount, value: parseFloat(e.target.value) })}
                  min="0"
                  step={discount.type === "PERCENTAGE" ? "0.01" : "1"}
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
              {(discount.type === "PERCENTAGE" || discount.type === "FIXED_AMOUNT") && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cantidad Mínima (Opcional)</Label>
                    <Input
                      type="number"
                      value={discount.minQuantity || ""}
                      onChange={(e) => setDiscount({ ...discount, minQuantity: parseInt(e.target.value) })}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label>Cantidad Máxima (Opcional)</Label>
                    <Input
                      type="number"
                      value={discount.maxQuantity || ""}
                      onChange={(e) => setDiscount({ ...discount, maxQuantity: parseInt(e.target.value) })}
                      min="0"
                    />
                  </div>
                </div>
              )}
            </>
          )}
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setIsDiscountModalOpen(false)}
              className="bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Confirmar Descuento
            </Button>
          </div>
        </div>
      )}

      {/* Tabla de productos */}
      <div
        className="overflow-x-auto"
        data-intro="Aquí puedes ver, editar o eliminar productos."
        data-step="3"
      >
        <table className="w-full">
          <thead>
            <tr className="bg-primary-50">
              {discount.isActive && (
                <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">
                  Seleccionar
                </th>
              )}
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900 w-full">Producto</th>
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
            {currentProducts.map((product) => {
              const details = product.details || {};
              const colores = details.color || [];
              return (
                <tr key={product.id} className="border-b border-primary-100">
                  {discount.isActive && (
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center">
                        <Input
                          type="checkbox"
                          checked={selectedProduct?.id === product.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProduct(product);
                            } else {
                              setSelectedProduct(null);
                            }
                          }}
                          className="w-5 h-5 bg-primary-500 text-white border-primary-500 rounded focus:ring-primary-500 focus:ring-2 checked:bg-primary-600"
                        />
                      </div>
                    </td>
                  )}
                  <td className="py-3 px-4 w-full align-top">
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          product.Images &&
                          product.Images.length > 0 &&
                          Array.isArray(product.Images[0].url) &&
                          product.Images[0].url.length > 0
                            ? product.Images[0].url[0]
                            : "/placeholder.png"
                        }
                        alt={product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                        style={{ minWidth: "4rem", minHeight: "4rem", maxHeight: "5rem" }}
                      />
                      <div>
                        <p className="text-sm sm:text-base font-medium text-primary-900 break-words whitespace-pre-line">{product.name}</p>
                        <p className="text-xs sm:text-sm text-primary-500 break-words whitespace-pre-line">SKU: {product.sku}</p>
                        {product.description && (
                          <p className="text-xs text-primary-700 mt-1 break-words whitespace-pre-line">{product.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm sm:text-base font-medium text-primary-900">
                      ₡{product.WarehouseItem?.[0]?.price?.toLocaleString() || "N/A"}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs sm:text-sm ${product.WarehouseItem?.some((item) => item.quantity > 0)
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {product.WarehouseItem?.some((item) => item.quantity > 0) ? "En Stock" : "Agotado"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-primary-700">{product.category || "N/A"}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-primary-700">{details.peso || "N/A"}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-primary-700">{details.material || "N/A"}</p>
                  </td>
                  <td className="py-3 px-4">
                    {Array.isArray(colores) && colores.length > 0 ? (
                      colores.map((color, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span
                            className="inline-block w-4 h-4 rounded-full"
                            style={{ backgroundColor: color.hex }}
                          ></span>
                          <span className="text-sm text-primary-700">{color.name}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-primary-700">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-primary-700">
                      {product.WarehouseItem?.reduce((acc, item) => acc + (item.quantity || 0), 0) ?? 0}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Button
                        onClick={() => handleEdit(product)}
                        variant="ghost"
                        size="icon"
                        className="p-1 hover:bg-primary-50 rounded"
                        title="Editar Producto"
                        data-intro="Edita el producto seleccionado."
                        data-step="4"
                      >
                        <Edit className="h-4 w-4 text-primary-600" />
                      </Button>
                      <Button
                        onClick={() => handleInventoryManagement(product)}
                        variant="ghost"
                        size="icon"
                        className="p-1 hover:bg-primary-50 rounded"
                        title="Gestionar Inventario"
                        data-intro="Gestiona el inventario de este producto."
                        data-step="5"
                      >
                        <Package className="h-4 w-4 text-primary-600" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(product.id!)}
                        variant="ghost"
                        size="icon"
                        className="p-1 hover:bg-primary-50 rounded"
                        title="Eliminar Producto"
                        data-intro="Elimina el producto de la tienda."
                        data-step="6"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-primary-500 text-white hover:bg-primary-700"}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm text-primary-700">
          Página {currentPage} de {Math.ceil(filteredProducts.length / itemsPerPage)}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
          className={`px-4 py-2 rounded-lg ${currentPage === Math.ceil(filteredProducts.length / itemsPerPage)
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-primary-500 text-white hover:bg-primary-700"
            }`}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Modal de formulario de producto */}
      {isModalOpen && (
        <div
          id="product-form-modal-tour"
          className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-xl z-50 overflow-y-auto"
          data-intro="Aquí puedes crear o editar un producto. Completa los campos y guarda los cambios."
          data-step="1"
        >
          <ProductForm
            product={selectedProduct || undefined}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedProduct(null);
            }}
            onSubmit={handleSubmit}
          />
        </div>
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
      <div>
        {/* ...todo el contenido del componente... */}

        {/* Botón flotante para iniciar el tour */}
        <Tooltip content="Guía rápida" side="left" delayDuration={20000}>
          <button
            type="button"
            aria-label="Iniciar guía rápida"
            onClick={() => {
              if (isModalOpen) {
                // Tour SOLO para el formulario
                introJs().setOptions({
                  steps: [
                    {
                      element: '#product-form-modal-tour',
                      intro:
                        'Esta ventana es el formulario avanzado para crear o editar productos en tu inventario. Aquí puedes ingresar toda la información relevante del producto, incluyendo nombre, categoría, SKU, precio, costo, descripción, imágenes, detalles técnicos (como material, peso, largo, pureza y certificado), piedras y colores disponibles, así como detalles del cierre. Utiliza los botones para agregar imágenes, piedras o colores adicionales. Al finalizar, puedes guardar los cambios o cancelar la operación. Revisa cuidadosamente cada sección para asegurar que los datos sean correctos antes de guardar.',
                      position: 'left',
                    },
                  ],
                  scrollToElement: true,
                  nextLabel: 'Siguiente',
                  prevLabel: 'Anterior',
                  doneLabel: 'Listo',
                  skipLabel: 'Saltar',
                  showProgress: true,
                  showBullets: false,
                  tooltipClass: 'bg-white text-primary-900 shadow-xl border border-primary-200 rounded-xl p-6 text-base',
                  highlightClass: 'ring-4 ring-primary-400',
                }).start();
              } else if (isInventoryModalOpen) {
                // Tour SOLO para los tabs del modal de inventario
                introJs().setOptions({
                  steps: [
                    { element: '[data-step="20"]', intro: 'Tab Inventario: Gestiona el stock de este producto en las diferentes bodegas. Puedes agregar, quitar o mover stock.', position: 'bottom' },
                    { element: '[data-step="21"]', intro: 'Tab Descuentos: Configura y administra los descuentos especiales para este producto.', position: 'bottom' },
                    { element: '[data-step="22"]', intro: 'Tab Distribución: Mueve inventario entre bodegas de forma sencilla y rápida.', position: 'bottom' },
                  ],
                  scrollToElement: true,
                  nextLabel: 'Siguiente',
                  prevLabel: 'Anterior',
                  doneLabel: 'Listo',
                  skipLabel: 'Saltar',
                  showProgress: true,
                  showBullets: false,
                  tooltipClass: 'bg-white text-primary-900 shadow-xl border border-primary-200 rounded-xl p-6 text-base',
                  highlightClass: 'ring-4 ring-primary-400',
                }).start();
              } else {
                // Tour general de la página
                introJs().setOptions({
                  steps: [
                    { element: '[data-step="1"]', intro: 'Haz clic aquí para agregar un nuevo producto.', position: 'left' },
                    { element: '[data-step="2"]', intro: 'Filtra los productos por stock, antigüedad y más.', position: 'right' },
                    { element: '[data-step="3"]', intro: 'Aquí puedes ver, editar o eliminar productos.', position: 'top' },
                    { element: '[data-step="4"]', intro: 'Edita el producto seleccionado.', position: 'left' },
                    { element: '[data-step="5"]', intro: 'Gestiona el inventario de este producto.', position: 'left' },
                    { element: '[data-step="6"]', intro: 'Elimina el producto de la tienda.', position: 'left' },
                    { element: '[data-step="10"]', intro: 'Dashboard: Visualiza un resumen general del inventario, métricas clave y gráficos para tomar decisiones rápidas.', position: 'bottom' },
                    { element: '[data-step="11"]', intro: 'Inventario: Consulta, administra y edita todos los productos registrados en tu inventario.', position: 'bottom' },
                    { element: '[data-step="12"]', intro: 'Control de Gastos: Lleva el registro y control de los gastos relacionados con tu inventario.', position: 'bottom' },
                    { element: '[data-step="13"]', intro: 'Bodegas: Administra las bodegas y consulta la ubicación de tus productos.', position: 'bottom' },
                    { element: '[data-step="14"]', intro: 'Órdenes: Gestiona las órdenes de compra y el flujo de entrada de productos al inventario.', position: 'bottom' },
                  ],
                  scrollToElement: true,
                  nextLabel: 'Siguiente',
                  prevLabel: 'Anterior',
                  doneLabel: 'Listo',
                  skipLabel: 'Saltar',
                  showProgress: true,
                  showBullets: false,
                  tooltipClass: 'bg-white text-primary-900 shadow-xl border border-primary-200 rounded-xl p-6 text-base',
                  highlightClass: 'ring-4 ring-primary-400',
                }).start();
              }
            }}
            className="fixed right-8 bottom-24 z-50 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-xl p-4 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-300"
            style={{ boxShadow: '0 6px 24px rgba(80,80,160,0.18)' }}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ProductTab;