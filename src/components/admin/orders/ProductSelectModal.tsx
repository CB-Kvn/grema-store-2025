import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface ProductSelectModalProps {
  onClose: () => void;
  onSelect: (selected: Array<{ product: Product; warehouse: any }>) => void;
}

const ProductSelectModal: React.FC<ProductSelectModalProps> = ({ onClose, onSelect }) => {
  const products = useSelector((state: any) => state.products.items);
  const warehouses = useSelector((state: any) => state.warehouses.warehouses);

  const getWarehouseName = (warehouseId: string) => {
    const wh = warehouses.find((w: any) => w.id === warehouseId);
    return wh ? wh.name : warehouseId;
  };

  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Estado para cantidades seleccionadas por producto-bodega
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const [filteredProducts, setFilteredProducts] = useState(() =>
    products
      .filter((p: Product) => Array.isArray(p.WarehouseItem) && p.WarehouseItem.length > 0)
      .map((product: Product) => ({
        ...product,
        WarehouseItem: product.WarehouseItem,
      }))
  );

  const getRowId = (productId: number, warehouseId: string) => `${productId}-${warehouseId}`;

  const handleCheckboxChange = (rowId: string) => {
    setSelected(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  const handleQuantityChange = (rowId: string, value: string) => {
    const qty = Math.max(1, Number(value));
    setQuantities(prev => ({
      ...prev,
      [rowId]: qty,
    }));
    setFilteredProducts(prev =>
      prev.map(product => ({
        ...product,
        WarehouseItem: product.WarehouseItem.map((wh: any) => {
          if (rowId === getRowId(product.id, wh.warehouseId)) {
            return {
              ...wh,
              quantity: Math.max(0, wh.quantity - (qty - (quantities[rowId] ?? 1))),
            };
          }
          return wh;
        }),
      }))
    );
  };

  const handleConfirm = async () => {
    setLoading(true);
    setTimeout(() => {
      const selectedRows: Array<{ product: Product; warehouse: any; quantity: number }> = [];
      products
        .filter((p: Product) => Array.isArray(p.WarehouseItem) && p.WarehouseItem.length > 0)
        .forEach((product: Product) => {
          product.WarehouseItem.forEach((wh: any) => {
            const rowId = getRowId(product.id, wh.warehouseId);
            if (selected[rowId]) {
              selectedRows.push({
                product,
                warehouse: wh,
                quantity: quantities[rowId] || 1,
              });
            }
          });
        });
      setLoading(false);
      onSelect(selectedRows);
      onClose();
    }, 2000);
  };

  // Actualiza el filtrado cuando cambia la búsqueda
  useEffect(() => {
    setFilteredProducts(
      products
        .filter((p: Product) => Array.isArray(p.WarehouseItem) && p.WarehouseItem.length > 0)
        .map((product: Product) => ({
          ...product,
          WarehouseItem: product.WarehouseItem.filter((wh: any) => {
            const warehouseName = getWarehouseName(wh.warehouseId).toLowerCase();
            return (
              product.name.toLowerCase().includes(search.toLowerCase()) ||
              product.sku.toLowerCase().includes(search.toLowerCase()) ||
              warehouseName.includes(search.toLowerCase())
            );
          }),
        }))
        .filter((p: Product) => p.WarehouseItem.length > 0)
    );
  }, [products, search]);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60">
          <Loader2 className="animate-spin h-16 w-16 text-white" />
        </div>
      )}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.4 }}
        className="fixed inset-y-0 right-0 w-full md:w-[700px] bg-white shadow-xl z-50 overflow-y-auto"
      >
        <Card className="h-full rounded-none border-none shadow-none">
          <CardHeader className="sticky top-0 bg-white border-b border-primary-100 flex flex-row items-center justify-between z-10">
            <h2 className="text-xl font-semibold text-primary-900">Seleccionar Productos</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5 text-primary-600" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-120px)] p-6">
              <div className="mb-4">
                <Input
                  placeholder="Buscar por nombre, SKU o bodega..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-primary-50">
                    <tr>
                      <th className="px-2 py-2 text-left"></th>
                      <th className="px-2 py-2 text-left">Imagen</th>
                      <th className="px-2 py-2 text-left">Nombre</th>
                      <th className="px-2 py-2 text-left">SKU</th>
                      <th className="px-2 py-2 text-left">Bodega</th>
                      <th className="px-2 py-2 text-left">Stock</th>
                      <th className="px-2 py-2 text-left">Precio</th> {/* <-- NUEVO */}
                      <th className="px-2 py-2 text-left">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product: Product) =>
                      product.WarehouseItem.map((wh: any) => {
                        const rowId = getRowId(product.id, wh.warehouseId);
                        return (
                          <tr key={rowId} className="border-b">
                            <td className="px-2 py-2">
                              <Checkbox
                                checked={!!selected[rowId]}
                                onCheckedChange={() => handleCheckboxChange(rowId)}
                                aria-label={`Seleccionar ${product.name} (${getWarehouseName(wh.warehouseId)})`}
                              />
                            </td>
                            <td className="px-2 py-2">
                              {product.Images?.[0]?.url?.[0] ? (
                                <img
                                  src={product.Images[0].url[0]}
                                  alt={product.name}
                                  className="w-20 h-20 object-cover rounded"
                                />
                              ) : (
                                <span className="text-xs text-muted-foreground">Sin imagen</span>
                              )}
                            </td>
                            <td className="px-2 py-2">{product.name}</td>
                            <td className="px-2 py-2">{product.sku}</td>
                            <td className="px-2 py-2">{getWarehouseName(wh.warehouseId)}</td>
                            <td className="px-2 py-2">{wh.quantity}</td>
                            <td className="px-2 py-2">{wh.price?.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' }) ?? '₡0'}</td> {/* <-- NUEVO */}
                            <td className="px-2 py-2">
                              <Input
                                type="number"
                                min={1}
                                max={wh.quantity}
                                value={quantities[rowId] ?? 0}
                                disabled={!selected[rowId]}
                                onChange={e => handleQuantityChange(rowId, e.target.value)}
                                className="w-20"
                              />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleConfirm}
                  disabled={Object.values(selected).every(v => !v) || loading}
                  className="px-4 flex items-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin h-4 w-4" />}
                  Agregar seleccionados
                </Button>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default ProductSelectModal;