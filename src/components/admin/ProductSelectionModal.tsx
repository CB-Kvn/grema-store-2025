import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Package, ShoppingCart } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { Product } from '@/types';

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProducts: (products: Product[]) => void;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectProducts,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Obtener productos del estado global de forma estable
  const products = useAppSelector(state => state.products?.products || []);

  // Efecto para manejar la inicialización del modal
  useEffect(() => {
    if (isOpen) {
      // Inicializar productos filtrados al abrir el modal
      setFilteredProducts(products);
    } else {
      // Limpiar estado al cerrar el modal
      setSelectedProducts([]);
      setSearchTerm('');
      setFilteredProducts([]);
    }
  }, [isOpen]); // Solo depende de isOpen

  // Efecto separado para el filtrado de productos
  useEffect(() => {
    if (!isOpen) return; // No filtrar si el modal está cerrado
    
    if (searchTerm) {
      const filtered = products.filter((product: Product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products, isOpen]); // Dependencias necesarias

  const handleProductToggle = (product: Product) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts);
    }
  };

  const handleConfirmSelection = () => {
    onSelectProducts(selectedProducts);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const isProductSelected = (product: Product) => {
    return selectedProducts.some(p => p.id === product.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Seleccionar Productos
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden">
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos por nombre, SKU o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Header con información */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedProducts.length === filteredProducts.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
              </Button>
              <span className="text-sm text-gray-600">
                {filteredProducts.length} productos disponibles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <Badge variant="secondary">
                {selectedProducts.length} seleccionados
              </Badge>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No se encontraron productos</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="border-0 border-b last:border-b-0 rounded-none">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={isProductSelected(product)}
                            onCheckedChange={() => handleProductToggle(product)}
                          />
                          
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-sm truncate">
                                {product.name || 'Producto sin nombre'}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                SKU: {product.sku || 'N/A'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {product.description || 'Sin descripción'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {product.category || 'Sin categoría'}
                              </Badge>
                              <span className="text-sm font-medium text-green-600">
                                ${product.price?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmSelection}
            disabled={selectedProducts.length === 0}
          >
            Agregar {selectedProducts.length} producto{selectedProducts.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductSelectionModal;
