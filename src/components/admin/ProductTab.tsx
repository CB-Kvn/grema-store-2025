/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Search, Plus, Edit, Trash2, Package
} from 'lucide-react';
import { Input } from '../ui/input';
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Acción primaria - Siempre visible */}
          <button 
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-50">
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Producto</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Precio</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Estado</th>
              <th className="py-3 px-4 text-left text-xs sm:text-sm font-medium text-primary-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-primary-100">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm sm:text-base font-medium text-primary-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs sm:text-sm text-primary-500">SKU: {product.sku}</p>
                    </div>
                  </div>
                </td>
                {/* <td className="py-3 px-4">
                  <span className="text-sm sm:text-base font-medium text-primary-900">${product.price.toLocaleString()}</span>
                  {product.discount && product.discount.isActive && (
                    <div className="text-xs text-green-600">
                      {product.discount.type === 'PERCENTAGE' && `${product.discount.value}% descuento`}
                      {product.discount.type === 'FIXED_AMOUNT' && `$${product.discount.value} descuento`}
                      {product.discount.type === 'BUY_X_GET_Y' && `${product.discount.value}+1 gratis`}
                    </div>
                  )}
                </td> */}
                {/* <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                    product.isBestSeller ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.isBestSeller ? 'En Stock' : 'Bajo Stock'}
                  </span>
                </td> */}
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