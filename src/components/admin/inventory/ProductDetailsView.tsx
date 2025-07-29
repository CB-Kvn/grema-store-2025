import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Package, 
  Tag, 
  DollarSign, 
  Star,
  Gift,
  Percent,
  Palette,
  Weight,
  Gem,
  MoreVertical,
  Eye,
  TrendingUp
} from 'lucide-react';
import type { Product } from '../../../types';

interface ProductDetailsViewProps {
  product: Product;
  onBack: () => void;
  onEdit: () => void;
  onInventory: () => void;
}

const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  product,
  onBack,
  onEdit,
  onInventory
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la lista
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary-900">{product.name}</h1>
            <p className="text-primary-500">SKU: {product.sku}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onInventory}
            className="flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            Gestionar Inventario
          </Button>
          <Button
            size="sm"
            onClick={onEdit}
            variant="gradient"
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar Producto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Columna principal - Imagen y descripción */}
        <div className="lg:col-span-2 space-y-6">
          {/* Imagen principal con detalles técnicos y descripción */}
          <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Columna de la imagen */}
                <div className="lg:w-1/2">
                  <div className="aspect-[3/4] max-h-[600px] bg-primary-50 rounded-lg overflow-hidden mb-4">
                    {(() => {
                      const images = product.Images as any;
                      return images && Array.isArray(images) && images.length > 0 && images[0].url && images[0].url.length > 0 ? (
                        <img
                          src={images[0].url[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-16 w-16 text-primary-300" />
                        </div>
                      );
                    })()}
                  </div>

                  {/* Badges del producto */}
                  <div className="flex flex-wrap gap-2">
                    {product.isBestSeller && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Best Seller
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge className="bg-green-100 text-green-800">
                        Nuevo
                      </Badge>
                    )}
                    {product.isGift && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Gift className="h-3 w-3 mr-1" />
                        Regalo
                      </Badge>
                    )}
                    {product.discount?.isActive && (
                      <Badge className="bg-red-100 text-red-800">
                        <Percent className="h-3 w-3 mr-1" />
                        Descuento {product.discount.value}%
                      </Badge>
                    )}
                  </div>

                  {/* Descripción del producto */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary-900">
                      <Eye className="h-5 w-5" />
                      Descripción
                    </h3>
                    <div className="p-3 bg-primary-50 rounded-lg">
                      <p className="text-sm text-primary-700 leading-relaxed">
                        {product.description || 'No hay descripción disponible.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Columna de detalles técnicos */}
                {product.details && (
                  <div className="lg:w-1/2">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary-900">
                      <MoreVertical className="h-5 w-5" />
                      Detalles Técnicos
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {product.details.material && (
                        <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                          <Gem className="h-5 w-5 text-primary-600" />
                          <div>
                            <p className="text-sm font-medium text-primary-900">Material</p>
                            <p className="text-sm text-primary-600">{product.details.material}</p>
                          </div>
                        </div>
                      )}
                      {product.details.piedra && Array.isArray(product.details.piedra) && product.details.piedra.length > 0 && (
                        <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                          <Gem className="h-5 w-5 text-primary-600" />
                          <div>
                            <p className="text-sm font-medium text-primary-900">Piedra</p>
                            <p className="text-sm text-primary-600">{product.details.piedra.join(', ')}</p>
                          </div>
                        </div>
                      )}
                      {product.details.peso && (
                        <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                          <Weight className="h-5 w-5 text-primary-600" />
                          <div>
                            <p className="text-sm font-medium text-primary-900">Peso</p>
                            <p className="text-sm text-primary-600">{product.details.peso}</p>
                          </div>
                        </div>
                      )}
                      {product.details.pureza && (
                        <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                          <Star className="h-5 w-5 text-primary-600" />
                          <div>
                            <p className="text-sm font-medium text-primary-900">Pureza</p>
                            <p className="text-sm text-primary-600">{product.details.pureza}</p>
                          </div>
                        </div>
                      )}
                      {(product.details as any).largo && (
                        <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                          <Gem className="h-5 w-5 text-primary-600" />
                          <div>
                            <p className="text-sm font-medium text-primary-900">Largo</p>
                            <p className="text-sm text-primary-600">{(product.details as any).largo}</p>
                          </div>
                        </div>
                      )}
                      {(product.details as any).garantia && (
                        <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                          <Star className="h-5 w-5 text-primary-600" />
                          <div>
                            <p className="text-sm font-medium text-primary-900">Garantía</p>
                            <p className="text-sm text-primary-600">{(product.details as any).garantia}</p>
                          </div>
                        </div>
                      )}
                      {(product.details as any).certificado && (
                        <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                          <Star className="h-5 w-5 text-primary-600" />
                          <div>
                            <p className="text-sm font-medium text-primary-900">Certificado</p>
                            <p className="text-sm text-primary-600">{(product.details as any).certificado}</p>
                          </div>
                        </div>
                      )}
                      {product.details.color && Array.isArray(product.details.color) && product.details.color.length > 0 && (
                        <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-primary-600" />
                            {product.details.color[0]?.hex && (
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: product.details.color[0].hex }}
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-primary-900">Color</p>
                            <p className="text-sm text-primary-600">{product.details.color[0]?.name || 'Sin nombre'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Espacio para otros componentes si se necesitan en el futuro */}
        </div>

        {/* Columna lateral - Información comercial y detalles técnicos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información de precios */}
          <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Información Comercial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {(() => {
                  const warehouseItems = (product as any).WarehouseItem || [];
                  const priceFromWarehouse = warehouseItems.length > 0 ? warehouseItems[0].price : null;
                  const costFromWarehouse = warehouseItems.length > 0 ? warehouseItems[0].cost : null;
                  const displayPrice = product.price || priceFromWarehouse || 0;
                  const displayCost = product.cost || costFromWarehouse;

                  return (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-primary-600">Precio de Venta</span>
                        <span className="font-semibold text-lg text-primary-900">
                          ${displayPrice.toFixed(2)}
                        </span>
                      </div>
                      
                      {displayCost && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-primary-600">Costo</span>
                          <span className="font-medium text-primary-700">
                            ${displayCost.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {displayPrice && displayCost && (
                        <div className="flex justify-between items-center pt-2 border-t border-primary-100">
                          <span className="text-sm text-primary-600">Margen</span>
                          <span className="font-medium text-green-600">
                            {(((displayPrice - displayCost) / displayPrice) * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}

                      {/* Información de stock */}
                      {warehouseItems.length > 0 && (
                        <div className="pt-2 border-t border-primary-100">
                          <span className="text-sm text-primary-600">Stock Total</span>
                          <p className="font-medium text-primary-900">
                            {warehouseItems.reduce((total: number, item: any) => total + item.quantity, 0)} unidades
                          </p>
                          <p className="text-xs text-primary-500">
                            En {warehouseItems.length} almacén{warehouseItems.length > 1 ? 'es' : ''}
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {product.discount?.isActive && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-900">Descuento Activo</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-red-700">Tipo:</span>
                      <span className="text-red-900">{product.discount.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Valor:</span>
                      <span className="text-red-900">{product.discount.value}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Precio Final:</span>
                      <span className="font-semibold text-red-900">
                        ${((product.price || 0) * (1 - (product.discount.value || 0) / 100)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información de categoría */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Categorización
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-primary-600">Categoría</span>
                  <p className="font-medium text-primary-900">{product.category || 'Sin categoría'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Espacio para otros detalles si se necesitan en el futuro */}

          {/* Estadísticas rápidas */}
          <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Estadísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-primary-600">Estado</span>
                  <Badge className={`${(product as any).available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {(product as any).available ? 'Disponible' : 'No Disponible'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-primary-600">Creado</span>
                  <span className="text-sm text-primary-900">
                    {(product as any).createdAt ? new Date((product as any).createdAt).toLocaleDateString() : 'No disponible'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-primary-600">Actualizado</span>
                  <span className="text-sm text-primary-900">
                    {(product as any).updatedAt ? new Date((product as any).updatedAt).toLocaleDateString() : 'No disponible'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailsView;
