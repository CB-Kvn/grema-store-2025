/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
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
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const itemsPerPage = 10; // Número de productos por página
  const [currentPage, setCurrentPage] = useState<number>(() => {
    // Recuperar la página actual de localStorage
    const savedPage = localStorage.getItem('currentPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const { deleteProduct } = useProductService()
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

  // Filtrar productos y reiniciar la página actual SOLO al cambiar el filtro de búsqueda
  useEffect(() => {
    const filtered = products.filter((product) => {
      const name = product.name ? product.name.toLowerCase() : '';
      const sku = product.sku ? product.sku.toLowerCase() : '';
      const matchesSearch =
        name.includes(searchQuery.toLowerCase()) ||
        sku.includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    setFilteredProducts(filtered);
    // Solo reiniciar la página si cambia el searchQuery
    setCurrentPage((prevPage) => searchQuery ? 1 : prevPage);
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

  // Manejar apertura del modal de imagen
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  // Prevenir scroll del body cuando el modal esté abierto
  useEffect(() => {
    if (imageModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup al desmontar el componente
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [imageModalOpen]);

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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-primary-400" />
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
            data-tour="add-product-btn"
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            variant="default"
            className="flex items-center justify-center bg-primary-500 hover:bg-primary-700 text-white rounded-lg shadow-lg"
          >
            <Plus className="h-6 w-6 mr-2" />
            Nuevo
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
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-primary-400 pointer-events-none" />
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-primary-400" />
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
      {/* Tabla de productos */}
      <div
        className="overflow-x-auto"
        data-intro="Aquí puedes ver, editar o eliminar productos."
        data-step="3"
        data-tour="products-table"
      >
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-primary-50">
              {discount.isActive && (
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-primary-900">
                  Seleccionar
                </th>
              )}
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-primary-900 min-w-[200px]">Producto</th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-primary-900 min-w-[100px]">Precio</th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-primary-900 min-w-[100px]">Estado</th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-primary-900 min-w-[100px] hidden lg:table-cell">Categoría</th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-primary-900 min-w-[80px] hidden xl:table-cell">Peso</th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-primary-900 min-w-[100px] hidden xl:table-cell">Material</th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-primary-900 min-w-[120px] hidden 2xl:table-cell">Colores</th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-primary-900 min-w-[80px]">Cantidad</th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-primary-900 min-w-[120px]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => {
              const details = product.details || {};
              const colores = details.color || [];
              return (
                <tr key={product.id} className="border-b border-primary-100 hover:bg-primary-25">
                  {discount.isActive && (
                    <td className="py-3 px-2 sm:px-4">
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
                          className="w-4 h-4 sm:w-5 sm:h-5 bg-primary-500 text-white border-primary-500 rounded focus:ring-primary-500 focus:ring-2 checked:bg-primary-600"
                        />
                      </div>
                    </td>
                  )}
                  <td className="py-3 px-2 sm:px-4 align-top min-w-[200px]">
                    <div className="flex items-start space-x-2 sm:space-x-3">
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
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                        onClick={() => handleImageClick(
                          product.Images &&
                            product.Images.length > 0 &&
                            Array.isArray(product.Images[0].url) &&
                            product.Images[0].url.length > 0
                            ? product.Images[0].url[0]
                            : "/placeholder.png"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm md:text-base font-medium text-primary-900 break-words leading-tight">{product.name}</p>
                        <p className="text-xs text-primary-500 break-words mt-1">SKU: {product.sku}</p>
                        {/* Mostrar categoría en móvil cuando esté oculta */}
                        <div className="lg:hidden mt-1">
                          <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">
                            {product.category || "Sin categoría"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <p className="text-xs sm:text-sm md:text-base font-medium text-primary-900">
                      ₡{product.WarehouseItem?.[0]?.price?.toLocaleString() || "N/A"}
                    </p>
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${product.WarehouseItem?.some((item) => item.quantity > 0)
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {product.WarehouseItem?.some((item) => item.quantity > 0) ? "En Stock" : "Agotado"}
                    </span>
                  </td>
                  <td className="py-3 px-2 sm:px-4 hidden lg:table-cell">
                    <p className="text-xs sm:text-sm text-primary-700">{product.category || "N/A"}</p>
                  </td>
                  <td className="py-3 px-2 sm:px-4 hidden xl:table-cell">
                    <p className="text-xs sm:text-sm text-primary-700">{details.peso || "N/A"}</p>
                  </td>
                  <td className="py-3 px-2 sm:px-4 hidden xl:table-cell">
                    <p className="text-xs sm:text-sm text-primary-700">{details.material || "N/A"}</p>
                  </td>
                  <td className="py-3 px-2 sm:px-4 hidden 2xl:table-cell">
                    {Array.isArray(colores) && colores.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {colores.slice(0, 2).map((color, index) => (
                          <div key={index} className="flex items-center space-x-1">
                            <span
                              className="inline-block w-3 h-3 rounded-full"
                              style={{ backgroundColor: color.hex }}
                            ></span>
                            <span className="text-xs text-primary-700">{color.name}</span>
                          </div>
                        ))}
                        {colores.length > 2 && (
                          <span className="text-xs text-primary-500">+{colores.length - 2}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs sm:text-sm text-primary-700">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <p className="text-xs sm:text-sm font-medium text-primary-700">
                      {product.WarehouseItem?.reduce((acc, item) => acc + (item.quantity || 0), 0) ?? 0}
                    </p>
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <div className="flex items-center space-x-1" data-tour="product-actions">
                      <Button
                        onClick={() => handleEdit(product)}
                        variant="ghost"
                        size="icon"
                        className="p-1.5 sm:p-2 hover:bg-primary-50 rounded"
                        title="Editar Producto"
                        data-intro="Edita el producto seleccionado."
                        data-step="4"
                      >
                        <Edit className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary-600" />
                      </Button>
                      <Button
                        onClick={() => handleInventoryManagement(product)}
                        variant="ghost"
                        size="icon"
                        className="p-1.5 sm:p-2 hover:bg-primary-50 rounded"
                        title="Gestionar Inventario"
                        data-intro="Gestiona el inventario de este producto."
                        data-step="5"
                      >
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary-600" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(product.id!)}
                        variant="ghost"
                        size="icon"
                        className="p-1.5 sm:p-2 hover:bg-primary-50 rounded"
                        title="Eliminar Producto"
                        data-intro="Elimina el producto de la tienda."
                        data-step="6"
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-600" />
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
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3 sm:gap-0">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm ${currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-primary-500 text-white hover:bg-primary-700"}`}
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="ml-1 sm:ml-2 hidden sm:inline">Anterior</span>
        </Button>
        <span className="text-xs sm:text-sm text-primary-700 px-2 py-1 bg-primary-50 rounded">
          Página {currentPage} de {Math.ceil(filteredProducts.length / itemsPerPage)}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm ${currentPage === Math.ceil(filteredProducts.length / itemsPerPage)
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-primary-500 text-white hover:bg-primary-700"
            }`}
        >
          <span className="mr-1 sm:mr-2 hidden sm:inline">Siguiente</span>
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
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
        {/* <Tooltip content="Guía rápida" side="left" delayDuration={20000}>
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
              className="w-8 h-8"
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
        </Tooltip> */}
      </div>

      {/* Modal de imagen */}
      {imageModalOpen && createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            margin: 0,
            padding: '1rem'
          }}
          onClick={() => setImageModalOpen(false)}
        >
          <div className="relative flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Imagen ampliada"
              className="max-w-[60vw] max-h-[60vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-all duration-200"
              style={{ zIndex: 1000000 }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProductTab;