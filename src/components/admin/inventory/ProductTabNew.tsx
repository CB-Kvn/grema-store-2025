import React from 'react';
import { 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Nuevos componentes inline
import ProductListView from './ProductListView';
import ProductDetailsView from './ProductDetailsView';
import ProductFormView from './ProductFormView';
import ProductInventoryView from './ProductInventoryView';
import { useProductTab } from '@/hooks/useProductTab';

const ProductTab = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedProduct,
    viewMode,
    setViewMode,
    currentProducts,
    currentPage,
    handlePageChange,
    itemsPerPage,
    handleSubmit,
    handleInventorySubmit,
    handleDelete,
    handleViewDetails,
    handleEditProduct,
    handleCreateProduct,
    handleInventoryView,
    handleBackToList,
    warehouses,
    products,
  } = useProductTab();

  // Renderizar vista según el modo actual
  const renderCurrentView = () => {
    switch (viewMode) {
      case 'details':
        return selectedProduct ? (
          <ProductDetailsView
            product={selectedProduct}
            onBack={handleBackToList}
            onEdit={() => setViewMode('edit')}
            onInventory={() => setViewMode('inventory')}
          />
        ) : null;

      case 'edit':
        return (
          <ProductFormView
            product={selectedProduct}
            isEdit={true}
            onBack={handleBackToList}
            onSave={handleSubmit}
          />
        );

      case 'create':
        return (
          <ProductFormView
            onBack={handleBackToList}
            onSave={handleSubmit}
          />
        );

      case 'inventory':
        return selectedProduct ? (
          <ProductInventoryView
            product={selectedProduct}
            warehouses={warehouses}
            onBack={handleBackToList}
            onSave={handleInventorySubmit}
          />
        ) : null;

      default:
        return (
          <>
            {/* Header con controles */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary-900">Productos</h2>
                <p className="text-primary-600">Gestiona tu inventario de productos</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-80"
                  />
                </div>
                
                <Button
                  onClick={handleCreateProduct}
                  className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo Producto
                </Button>
              </div>
            </div>

            {/* Lista de productos */}
            <ProductListView
              products={products}
              searchQuery={searchQuery}
              onViewDetails={handleViewDetails}
              onEdit={handleEditProduct}
              onInventory={handleInventoryView}
              onDelete={(product) => {
                if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                  handleDelete(product.id!);
                }
              }}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />

            {/* Paginación */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-primary-600">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, products.length)} de {products.length} productos
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                
                <span className="px-3 py-1 text-sm">
                  Página {currentPage} de {Math.ceil(products.length / itemsPerPage)}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="space-y-6 p-6">
      {renderCurrentView()}
    </div>
  );
};

export default ProductTab;
