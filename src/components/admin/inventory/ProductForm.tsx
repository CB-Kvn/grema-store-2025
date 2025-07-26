/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { Dialog } from "@headlessui/react";
import { X, Plus } from "lucide-react";
import ProductImageUpload from '../helpers/ImageUpload';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { z } from "zod";
import { productSchema, useProductForm } from "@/hooks/useProductForm";
import { clearItemInventory } from '@/store/slices/productsSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';

// Esquema de validación con Zod

export type ProductFormType = z.infer<typeof productSchema>;

export interface ProductFormProps {
  product: ProductFormType;
  onClose: () => void;
  onSubmit: (product: ProductFormType) => void;
}



const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSubmit }) => {
  const {
    formData,
    errors,
    setErrors,
    imageModal,
    setImageModal,
    showCreateModal,
    pendingName,
    loadingCreate,
    details,
    cierre,
    coloresCierre,
    colores,
    piedra,
    handleInputChange,
    handleDetailsChange,
    handleSubmit,
    handleNameBlur,
    handleConfirmCreate,
    handleCancelCreate,
    isFormFilled,
    normalizeFormData,
    validate,
    handleUpdateProduct,
    generateUniqueSku,
  } = useProductForm(product, onSubmit, onClose);

  const [showSuccess, setShowSuccess] = React.useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      console.log('Cleaning up ProductForm');
      dispatch(clearItemInventory())
    }
  }, []);


  return (
    <>
      {/* Fondo oscuro detrás del modal lateral */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal para ver imagen en grande */}
      <Dialog open={imageModal.open} onClose={() => setImageModal({ open: false, url: null })} className="z-[100]">
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[100]">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full relative z-[101]">
            <button
              onClick={() => setImageModal({ open: false, url: null })}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
              aria-label="Cerrar"
              type="button"
            >
              <X className="h-5 w-5 text-primary-600" />
            </button>
            {imageModal.url && (
              <img src={imageModal.url} alt="Vista previa" className="max-w-full max-h-[70vh] mx-auto" />
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal lateral para el formulario */}
      <div
        id="product-form-modal-tour"
        className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-xl z-50 overflow-y-auto"
        data-intro="Esta ventana es el formulario avanzado para crear o editar productos en tu inventario. Aquí puedes ingresar toda la información relevante del producto, incluyendo nombre, categoría, SKU, precio, costo, descripción, imágenes, detalles técnicos (como material, peso, largo, pureza y certificado), piedras y colores disponibles, así como detalles del cierre. Utiliza los botones para agregar imágenes, piedras o colores adicionales. Al finalizar, puedes guardar los cambios o cancelar la operación. Revisa cuidadosamente cada sección para asegurar que los datos sean correctos antes de guardar."
        data-step="1"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-primary-100 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary-900">
            {formData.sku ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-50 rounded-full"
          >
            <X className="h-5 w-5 text-primary-600" />
          </button>
        </div>

        {/* Formulario principal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="md:col-span-2">
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={handleNameBlur}
                  className={errors.name ? 'border-red-500 w-full' : 'w-full'}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>
              {/* Categoría */}
              <div>
                <Label htmlFor="category">Categoría</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full rounded-md border ${errors.category ? 'border-red-500' : 'border-input'} bg-background px-3 py-2`}
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Anillos">Anillos</option>
                  <option value="Collares">Collares</option>
                  <option value="Aretes">Aretes</option>
                  <option value="Pulseras">Pulseras</option>
                  <option value="Sets">Sets</option>
                </select>
                {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
              </div>
              {/* SKU */}
              {/* <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onFocus={() => {
                    if (!formData.sku) {
                      const newSku = generateUniqueSku();
                      handleInputChange('sku', newSku);
                    }
                  }}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className={errors.sku ? 'border-red-500' : ''}
                />
                {errors.sku && <p className="text-sm text-red-500 mt-1">{errors.sku}</p>}
              </div> */}
            </div>
            {/* Descripción */}
            <div>
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-input'} bg-background px-3 py-2`}
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Imágenes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Imágenes</h3>
            <ProductImageUpload
              disabled={!formData.id || (formData.Images?.flatMap((img: any) => img.url).length || 0) >= 5}
              onImageClick={(url) => setImageModal({ open: true, url })}
            />
            {!formData.id && (
              <p className="text-sm text-yellow-600">Primero debes crear el producto para poder subir imágenes.</p>
            )}
            {(formData.Images?.flatMap((img: any) => img.url).length || 0) >= 5 && (
              <p className="text-sm text-red-500">Solo puedes subir hasta 5 imágenes.</p>
            )}
          </div>

          {/* Detalles del Producto */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Detalles del Producto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Material */}
              <div>
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  value={details.material || ''}
                  onChange={(e) => handleDetailsChange('material', e.target.value)}
                  className={errors.material ? 'border-red-500' : ''}
                />
                {errors.material && <p className="text-sm text-red-500 mt-1">{errors.material}</p>}
              </div>
              {/* Peso */}
              <div>
                <Label htmlFor="peso">Peso</Label>
                <Input
                  id="peso"
                  value={details.peso || ''}
                  onChange={(e) => handleDetailsChange('peso', e.target.value)}
                  className={errors.peso ? 'border-red-500' : ''}
                />
                {errors.peso && <p className="text-sm text-red-500 mt-1">{errors.peso}</p>}
              </div>
              {/* Largo */}
              <div>
                <Label htmlFor="largo">Largo (cm)</Label>
                <Input
                  id="largo"
                  type="text"
                  value={details.largo || ''}
                  onChange={(e) => handleDetailsChange('largo', e.target.value)}
                  className={errors.largo ? 'border-red-500' : ''}
                />
                {errors.largo && <p className="text-sm text-red-500 mt-1">{errors.largo}</p>}
              </div>
              {/* Pureza */}
              <div>
                <Label htmlFor="pureza">Pureza</Label>
                <Input
                  id="pureza"
                  value={details.pureza || ''}
                  onChange={(e) => handleDetailsChange('pureza', e.target.value)}
                  className={errors.pureza ? 'border-red-500' : ''}
                />
                {errors.pureza && <p className="text-sm text-red-500 mt-1">{errors.pureza}</p>}
              </div>
              {/* Certificado */}
              <div>
                <Label htmlFor="certificado">Certificado</Label>
                <Input
                  id="certificado"
                  value={details.certificado || ''}
                  onChange={(e) => handleDetailsChange('certificado', e.target.value)}
                  className={errors.certificado ? 'border-red-500' : ''}
                />
                {errors.certificado && <p className="text-sm text-red-500 mt-1">{errors.certificado}</p>}
              </div>
            </div>
          </div>

          {/* Piedras */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Piedras</Label>
              <button
                type="button"
                onClick={() => handleDetailsChange('piedra', [...piedra, ''])}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus className="h-4 w-4 inline mr-1" />
                Agregar Piedra
              </button>
            </div>
            {piedra.map((nombre: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="Nombre de la piedra"
                  value={nombre}
                  onChange={e => {
                    const nuevasPiedras = [...piedra];
                    nuevasPiedras[index] = e.target.value;
                    handleDetailsChange('piedra', nuevasPiedras);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const nuevasPiedras = piedra.filter((_, i) => i !== index);
                    handleDetailsChange('piedra', nuevasPiedras);
                  }}
                  className="p-2 hover:bg-primary-50 rounded-full"
                >
                  <X className="h-4 w-4 text-primary-600" />
                </button>
              </div>
            ))}
          </div>

          {/* Colores Disponibles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Colores Disponibles</Label>
              <button
                type="button"
                onClick={() => handleDetailsChange('color', [...colores, { hex: '', name: '' }])}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus className="h-4 w-4 inline mr-1" />
                Agregar Color
              </button>
            </div>
            {colores.map((color: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="color"
                  value={color.hex}
                  onChange={(e) => {
                    const newColors = [...colores];
                    newColors[index] = { ...newColors[index], hex: e.target.value };
                    handleDetailsChange('color', newColors);
                  }}
                  className="w-20"
                />
                <Input
                  placeholder="Nombre del color"
                  value={color.name}
                  onChange={(e) => {
                    const newColors = [...colores];
                    newColors[index] = { ...newColors[index], name: e.target.value };
                    handleDetailsChange('color', newColors);
                  }}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newColors = colores.filter((_: any, i: number) => i !== index);
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

          {/* Detalles del Cierre */}
          <div className="space-y-4 border-t border-primary-100 pt-4">
            <h4 className="font-medium text-primary-900">Detalles del Cierre</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="closureType">Tipo de Cierre</Label>
                <Input
                  id="closureType"
                  value={cierre.tipo || ''}
                  onChange={(e) => handleDetailsChange('cierre', { ...cierre, tipo: e.target.value })}
                />
              </div>
              <div>
                <Label>Colores del Cierre</Label>
                <button
                  type="button"
                  onClick={() => handleDetailsChange('cierre', {
                    ...cierre,
                    colores: [...coloresCierre, { hex: '', name: '' }]
                  })}
                  className="text-sm text-primary-600 hover:text-primary-700 ml-2"
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  Agregar Color
                </button>
                {coloresCierre.map((color: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <Input
                      type="color"
                      value={color.hex}
                      onChange={(e) => {
                        const newColors = [...coloresCierre];
                        newColors[index] = { ...newColors[index], hex: e.target.value };
                        handleDetailsChange('cierre', { ...cierre, colores: newColors });
                      }}
                      className="w-20"
                    />
                    <Input
                      placeholder="Nombre del color"
                      value={color.name}
                      onChange={(e) => {
                        const newColors = [...coloresCierre];
                        newColors[index] = { ...newColors[index], name: e.target.value };
                        handleDetailsChange('cierre', { ...cierre, colores: newColors });
                      }}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newColors = coloresCierre.filter((_: any, i: number) => i !== index);
                          handleDetailsChange('cierre', { ...cierre, colores: newColors });
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

          {/* Campo SKU y botón para generar SKU alineados */}
          <div className="flex flex-row items-end gap-2 mb-4">
            <div className="flex-1">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                className={errors.sku ? 'border-red-500' : ''}
              />
              {errors.sku && <p className="text-sm text-red-500 mt-1">{errors.sku}</p>}
            </div>
            <button
              type="button"
              className="h-[40px] px-3 py-2 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 flex items-center"
              onClick={() => {
                const newSku = generateUniqueSku();
                handleInputChange('sku', newSku);
              }}
            >
              Generar SKU
            </button>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
            >
              Cancelar
            </button>
            {formData.id ? (
              <>
                <button
                  type="button"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  onClick={async () => {
                    const normalized = normalizeFormData(formData);
                    const errs = validate(normalized);
                    setErrors(errs);
                    if (Object.keys(errs).length === 0) {
                      await handleUpdateProduct(normalized);
                      setShowSuccess(true);
                      setTimeout(() => {
                        setShowSuccess(false);
                        onClose();
                      }, 1800);
                    }
                  }}
                >
                  Actualizar producto
                </button>
                {showSuccess && (
                  <div className="fixed right-6 bottom-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-[9999] animate-fade-in">
                    Producto actualizado correctamente
                  </div>
                )}
              </>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                disabled={!isFormFilled()}
              >
                Crear Producto
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Modal para creación rápida */}
      {showCreateModal && (
        <Dialog open={showCreateModal} onClose={handleCancelCreate}>
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <p>¿Crear el producto "{pendingName}"?</p>
              <div className="flex gap-4 mt-4">
                <button onClick={handleConfirmCreate} disabled={loadingCreate} className="bg-primary-600 text-white px-4 py-2 rounded">
                  Confirmar
                </button>
                <button onClick={handleCancelCreate} className="bg-gray-200 px-4 py-2 rounded">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default ProductForm;