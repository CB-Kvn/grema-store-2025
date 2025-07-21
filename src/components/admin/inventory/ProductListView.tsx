import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  Eye, 
  Edit, 
  Package, 
  Trash2, 
  Star,
  Tag,
  Percent,
  MoreVertical
} from 'lucide-react';
import type { Product } from '../../../types';

interface ProductListViewProps {
  products: Product[];
  searchQuery: string;
  onViewDetails: (product: Product) => void;
  onEdit: (product: Product) => void;
  onInventory: (product: Product) => void;
  onDelete: (product: Product) => void;
  currentPage: number;
  itemsPerPage: number;
}

const ProductListView: React.FC<ProductListViewProps> = ({
  products,
  searchQuery,
  onViewDetails,
  onEdit,
  onInventory,
  onDelete,
  currentPage,
  itemsPerPage
}) => {
  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  if (currentProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-primary-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-primary-900 mb-2">
          {searchQuery ? 'No se encontraron productos' : 'No hay productos'}
        </h3>
        <p className="text-primary-500">
          {searchQuery 
            ? 'Intenta con un término de búsqueda diferente'
            : 'Comienza creando tu primer producto'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {currentProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="group hover:shadow-lg transition-all duration-200 border-primary-100 hover:border-primary-200">
            <CardContent className="p-4">
              {/* Imagen del producto */}
              <div 
                className="relative aspect-square mb-3 bg-primary-50 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => onViewDetails(product)}
              >
                {(() => {
                  const images = product.Images as any;
                  return images && Array.isArray(images) && images.length > 0 && images[0].url && images[0].url.length > 0 ? (
                    <img
                      src={images[0].url[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-primary-300" />
                    </div>
                  );
                })()}
                
                {/* Badges en la esquina */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isBestSeller && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Best Seller
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Nuevo
                    </Badge>
                  )}
                  {product.discount?.isActive && (
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      <Percent className="h-3 w-3 mr-1" />
                      -{product.discount.value}%
                    </Badge>
                  )}
                </div>

                {/* Botón de más opciones */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Información del producto */}
              <div className="space-y-2">
                <div>
                  <h3 
                    className="font-semibold text-primary-900 text-sm line-clamp-2 cursor-pointer hover:text-primary-700"
                    onClick={() => onViewDetails(product)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-primary-500">SKU: {product.sku}</p>
                </div>

                {/* Categoría */}
                {product.category && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-primary-400" />
                    <span className="text-xs text-primary-500">{product.category}</span>
                  </div>
                )}

                {/* Precio */}
                <div className="flex items-center justify-between">
                  <div>
                    {product.discount?.isActive ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary-900">
                          ${((product.price || 0) * (1 - (product.discount.value || 0) / 100)).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ${product.price?.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-primary-900">
                        {(() => {
                          // Buscar precio en WarehouseItem
                          const warehouseItems = (product as any).WarehouseItem || [];
                          const priceFromWarehouse = warehouseItems.length > 0 ? warehouseItems[0].price : null;
                          const displayPrice = product.price || priceFromWarehouse || 0;
                          return `$${displayPrice.toFixed(2)}`;
                        })()}
                      </span>
                    )}
                    {(() => {
                      const warehouseItems = (product as any).WarehouseItem || [];
                      const cost = warehouseItems.length > 0 ? warehouseItems[0].cost : product.cost;
                      return cost && (
                        <p className="text-xs text-primary-500">
                          Costo: ${cost.toFixed(2)}
                        </p>
                      );
                    })()}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-1 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails(product)}
                    className="flex-1 h-8 text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(product)}
                    className="flex-1 h-8 text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onInventory(product)}
                    className="h-8 px-2 text-xs"
                  >
                    <Package className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(product)}
                    className="h-8 px-2 text-xs hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductListView;
