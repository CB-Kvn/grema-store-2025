/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { X, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import ImageUpload from './ImageUpload';
import { Product } from '@/types';
import { resetProductInventory, updateProductInventory } from '@/store/slices/productsSlice';

interface ProductFormProps {
  onClose: () => void;
  onSubmit: (product: Product) => void;
}

const ProductTab: React.FC<ProductFormProps> = ({ onClose, onSubmit }) => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.products.itemInventory) ?? {}; // Asegurar que no sea null
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]); // Estado para almacenar las imágenes seleccionadas

  // Función para manejar las imágenes subidas
  const handleImagesUploaded = (uploadedImages: File[]) => {
    setImages(uploadedImages); // Actualiza el estado con las imágenes subidas
  };

  // Función para generar un SKU único más corto con referencia a la categoría
  const generateUniqueSku = () => {
    const random = Math.floor(1000 + Math.random() * 9000).toString(); // Número aleatorio de 4 dígitos
    const namePart = formData.name?.slice(0, 3).toUpperCase() || 'PRD'; // Primeras 3 letras del nombre del producto
    const categoryPart = formData.category?.slice(0, 3).toUpperCase() || 'GEN'; // Primeras 3 letras de la categoría
    return `${namePart}-${categoryPart}-${random}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'El nombre es requerido';
    if (!formData.price || formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (!formData.sku) newErrors.sku = 'El SKU es requerido';
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    if (!formData.description) newErrors.description = 'La descripción es requerida';
    if (!formData.details?.material) newErrors.material = 'El material es requerido';
    if (!formData.details?.peso) newErrors.peso = 'El peso es requerido';
    if (!formData.details?.largo || Number(formData.details.largo) <= 0) {
      newErrors.largo = 'El largo debe ser mayor a 0';
    }
    if (!formData.details?.pureza) {
      newErrors.pureza = 'La pureza es requerida';
    }
    if (!formData.details?.certificado) {
      newErrors.certificado = 'El certificado es requerido';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    onSubmit(formData);
    dispatch(resetProductInventory()); // Limpia el formulario después de enviarlo
  };

  const handleInputChange = (field: string, value: any) => {
    dispatch(updateProductInventory({ [field]: value }));
  };

  const handleDetailsChange = (field: string, value: any) => {
    dispatch(updateProductInventory({ details: { ...formData.details, [field]: value } }));
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-primary-100 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary-900">
            {formData.id ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={() => {
              onClose();
              dispatch(resetProductInventory()); // Limpia el formulario al cerrar
            }}
            className="p-2 hover:bg-primary-50 rounded-full"
          >
            <X className="h-5 w-5 text-primary-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Información Básica</h3>

            <div>
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input
                id="name"
                value={formData.name ?? ''} // Manejo de null
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Categoría</Label>
              <select
                id="category"
                value={formData.category ?? ''} // Manejo de null
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full rounded-md border ${
                  errors.category ? 'border-red-500' : 'border-input'
                } bg-background px-3 py-2`}
              >
                <option value="">Seleccionar categoría</option>
                <option value="rings">Anillos</option>
                <option value="necklaces">Collares</option>
                <option value="earrings">Aretes</option>
                <option value="bracelets">Pulseras</option>
              </select>
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku ?? ''} // Manejo de null
                onFocus={() => {
                  if (!formData.sku) {
                    const newSku = generateUniqueSku();
                    handleInputChange('sku', newSku); // Generar y establecer el SKU
                  }
                }}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                className={errors.sku ? 'border-red-500' : ''}
              />
              {errors.sku && (
                <p className="text-sm text-red-500 mt-1">{errors.sku}</p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Precio</Label>
              <Input
                type="number"
                id="price"
                value={formData.price ?? 0} // Manejo de null
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                min="0"
                step="0.01"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full rounded-md border ${
                  errors.description ? 'border-red-500' : 'border-input'
                } bg-background px-3 py-2`}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) => handleInputChange('isBestSeller', e.target.checked)}
                  className="rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Más Vendido</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => handleInputChange('isNew', e.target.checked)}
                  className="rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Nuevo</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">        
            <ImageUpload onImagesUploaded={handleImagesUploaded} />
            {errors.images && (
              <p className="text-sm text-red-500">{errors.images}</p>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Detalles del Producto</h3>

            <div>
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                value={formData.details.material}
                onChange={(e) => handleDetailsChange('material', e.target.value)}
                className={errors.material ? 'border-red-500' : ''}
              />
              {errors.material && (
                <p className="text-sm text-red-500 mt-1">{errors.material}</p>
              )}
            </div>

            <div>
              <Label htmlFor="peso">Peso</Label>
              <Input
                id="peso"
                value={formData.details.peso}
                onChange={(e) => handleDetailsChange('peso', e.target.value)}
                className={errors.peso ? 'border-red-500' : ''}
              />
              {errors.peso && (
                <p className="text-sm text-red-500 mt-1">{errors.peso}</p>
              )}
            </div>

            {/* Largo en centímetros */}
            <div>
              <Label htmlFor="largo">Largo (cm)</Label>
              <Input
                id="largo"
                type="number"
                value={formData.details.largo || ''}
                onChange={(e) => handleDetailsChange('largo', e.target.value)}
                className={errors.largo ? 'border-red-500' : ''}
              />
              {errors.largo && (
                <p className="text-sm text-red-500 mt-1">{errors.largo}</p>
              )}
            </div>

            {/* Pureza */}
            <div>
              <Label htmlFor="pureza">Pureza</Label>
              <Input
                id="pureza"
                value={formData.details.pureza || ''}
                onChange={(e) => handleDetailsChange('pureza', e.target.value)}
                className={errors.pureza ? 'border-red-500' : ''}
              />
              {errors.pureza && (
                <p className="text-sm text-red-500 mt-1">{errors.pureza}</p>
              )}
            </div>

            {/* Certificado */}
            <div>
              <Label htmlFor="certificado">Certificado</Label>
              <Input
                id="certificado"
                value={formData.details.certificado || ''}
                onChange={(e) => handleDetailsChange('certificado', e.target.value)}
                className={errors.certificado ? 'border-red-500' : ''}
              />
              {errors.certificado && (
                <p className="text-sm text-red-500 mt-1">{errors.certificado}</p>
              )}
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Colores Disponibles</Label>
                <button
                  type="button"
                  onClick={() => handleDetailsChange('color', [...formData.details.color, { hex: '', name: '' }])}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  Agregar Color
                </button>
              </div>
              
              {formData.details.color.map((color, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={color.hex}
                    onChange={(e) => {
                      const newColors = [...formData.details.color];
                      newColors[index] = { ...newColors[index], hex: e.target.value };
                      handleDetailsChange('color', newColors);
                    }}
                    className="w-20"
                  />
                  <Input
                    placeholder="Nombre del color"
                    value={color.name}
                    onChange={(e) => {
                      const newColors = [...formData.details.color];
                      newColors[index] = { ...newColors[index], name: e.target.value };
                      handleDetailsChange('color', newColors);
                    }}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newColors = formData.details.color.filter((_, i) => i !== index);
                        handleDetailsChange('color', newColors);
                      }}
                      className="p-2 hover:bg-primary-50 rounded-full"
                    >
                      <X className="h-4 w-4 text-primary-600" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Closure Details */}
            <div className="space-y-4 border-t border-primary-100 pt-4">
              <h4 className="font-medium text-primary-900">Detalles del Cierre</h4>
              
              <div>
                <Label htmlFor="closureType">Tipo de Cierre</Label>
                <Input
                  id="closureType"
                  value={formData.details.cierre?.tipo || ''}
                  onChange={(e) => handleDetailsChange('cierre', { ...formData.details.cierre, tipo: e.target.value })}
                  placeholder="Ej: Presión, Gancho, etc."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Colores del Cierre</Label>
                  <button
                    type="button"
                    onClick={() => handleDetailsChange('cierre', { ...formData.details.cierre, colores: [...formData.details.cierre.colores, { hex: '', name: '' }] })}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="h-4 w-4 inline mr-1" />
                    Agregar Color
                  </button>
                </div>
                
                {formData.details.cierre.colores.map((color, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={color.hex}
                      onChange={(e) => {
                        const newColors = [...formData.details.cierre.colores];
                        newColors[index] = { ...newColors[index], hex: e.target.value };
                        handleDetailsChange('cierre', { ...formData.details.cierre, colores: newColors });
                      }}
                      className="w-20"
                    />
                    <Input
                      placeholder="Nombre del color"
                      value={color.name}
                      onChange={(e) => {
                        const newColors = [...formData.details.cierre.colores];
                        newColors[index] = { ...newColors[index], name: e.target.value };
                        handleDetailsChange('cierre', { ...formData.details.cierre, colores: newColors });
                      }}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newColors = formData.details.cierre.colores.filter((_, i) => i !== index);
                          handleDetailsChange('cierre', { ...formData.details.cierre, colores: newColors });
                        }}
                        className="p-2 hover:bg-primary-50 rounded-full"
                      >
                        <X className="h-4 w-4 text-primary-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                dispatch(resetProductInventory());
              }}
              className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {formData.id ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductTab;