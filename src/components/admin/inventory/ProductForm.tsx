/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Plus, Warehouse } from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

import { Product } from '@/types';
import { clearItemInventory, resetProductInventory, updateProductInventory } from '@/store/slices/productsSlice';
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import ProductImageUpload from '../helpers/ImageUpload';
import { productService } from '@/services/productService';
import { warehouseService } from '@/services/warehouseService';

interface ProductFormProps {
  onClose: () => void;
  onSubmit: (product: Product) => void;
}

const ProductTab: React.FC<ProductFormProps> = ({ onClose, onSubmit }) => {
  const dispatch = useDispatch();
  // Obtiene el producto current del store de Redux
  const formData = useSelector((state: RootState) => state.products.itemInventory) ?? {};
  // Estado para errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Estado para el modal de previsualización de imagen
  const [imageModal, setImageModal] = useState<{ open: boolean; url: string | null }>({ open: false, url: null });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingName, setPendingName] = useState<string>('');
  const [loadingCreate, setLoadingCreate] = useState(false);
  const warehouseInfo = useSelector((state: RootState) => state.warehouses.warehouses);

  // Simula tu servicio real
  const createProduct = async (name: string) => {
    // Aquí deberías llamar a tu backend real
    const response =  await productService.create({ name });
    const warehouse = buildWarehouseItems(response.id);

    console.log("Warehouse Items", warehouse);
    await productService.createImage(JSON.stringify([]), response.id);

    for (const item of warehouse) {
      await warehouseService.addStock(item.warehouseId, response.id, {
        quantity: 0,
        location: item.location,
        price: item.price,
      } as any);
    }

    const productNew = await productService.getById(response.id);
    console.log("Product New", productNew);
    const product = {
      description: "",
      category: "",
      sku: "",
      details: {},
      Images: [
        {
          state: true,
          url: "",
          productId: response.id,
        }
      ],
      WarehouseItem: warehouse,
      filepaths: [{
        state: true,
        url: "",
        productId: response.id,
      }],
    };

  };

  // Utilidad para construir WarehouseItem a partir de warehouseInfo y formData
const  buildWarehouseItems =(productId: number) =>{
  console.log("warehouseInf",warehouseInfo)
  return warehouseInfo.map((warehouse) =>{
   return {
        warehouseId: warehouse.id,
        minimumStock: warehouse.minimumStock,
        location: warehouse.id,
        price: formData.price,
        status: "IN_STOCK",
        discount: warehouse.discount ?? null,
      }
  }
 
  );
}

  // Dispara el modal al perder foco si es producto nuevo y hay nombre
  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!formData.id && value) {
      setPendingName(value);
      setShowCreateModal(true);
    }
  };

  // Confirmación del modal
  const handleConfirmCreate = async () => {
    setLoadingCreate(true);
    try {
      const newProduct = await createProduct(pendingName);
      // dispatch(updateProductInventory(newProduct));
      // setShowCreateModal(false);
      // setPendingName('');
    } finally {
      // setLoadingCreate(false);
    }
  };

  // Cancelación del modal
  const handleCancelCreate = () => {
    setShowCreateModal(false);
    setPendingName('');
    dispatch(updateProductInventory({ name: '' }));
  };

  // Maneja las imágenes subidas y actualiza el store
  const handleImagesUploaded = (uploadedImages: File[]) => {
    const urls = uploadedImages.map(file => URL.createObjectURL(file));
    let currentUrls = formData.Images?.flatMap((img: any) => img.url) || [];
    let allUrls = [...currentUrls, ...urls].slice(0, 5);

    const Images = allUrls.map((url, idx) => ({
      id: idx + 1,
      url: [url],
      productId: formData.id || null,
    }));

    dispatch(updateProductInventory({ Images }));
  };

  // Genera un SKU único basado en nombre y categoría
  const generateUniqueSku = () => {
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    const namePart = formData.name?.slice(0, 3).toUpperCase() || 'PRD';
    const categoryPart = formData.category?.slice(0, 3).toUpperCase() || 'GEN';
    return `${namePart}-${categoryPart}-${random}`;
  };

  // Valida los campos del formulario y retorna los errores
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'El nombre es requerido';
    if (!formData.price || formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (!formData.sku) newErrors.sku = 'El SKU es requerido';
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    if (!formData.description) newErrors.description = 'La descripción es requerida';
    if (!formData.details?.material) newErrors.material = 'El material es requerido';
    if (!formData.details?.peso) newErrors.peso = 'El peso es requerido';
    if (!formData.details?.largo || Number(formData.details?.largo) <= 0) {
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

  // Maneja el envío del formulario
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

  // Actualiza un campo del producto en el store
  const handleInputChange = (field: string, value: any) => {
    dispatch(updateProductInventory({ [field]: value }));
  };

  // Actualiza un campo dentro de details en el store
  const handleDetailsChange = (field: string, value: any) => {
    dispatch(updateProductInventory({ details: { ...(formData.details || {}), [field]: value } }));
  };

  // Elimina una imagen específica por índice
  const handleRemoveImage = (imgIdx: number, urlIdx: number) => {
    const newImages = (formData.Images || []).map((img: any, i: number) => {
      if (i === imgIdx) {
        return {
          ...img,
          url: img.url.filter((_: any, uIdx: number) => uIdx !== urlIdx)
        };
      }
      return img;
    }).filter((img: any) => img.url.length > 0); // Elimina objetos Images sin urls
    dispatch(updateProductInventory({ Images: newImages }));
  };

  // Valores por defecto para evitar errores de acceso
  const details = formData.details || {};
  const cierre = details.cierre || {};
  const coloresCierre = cierre.colores || [];
  const colores = details.color || [];
  const piedras = details.piedra || [];

  // Utilidad para saber si el formulario tiene información relevante
  const isFormFilled = () => {
    return (
      !!formData.name &&
      !!formData.category &&
      !!formData.sku &&
      !!formData.description 

    );
  };

  return (
    <>
      {/* Fondo oscuro detrás del modal lateral */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal para ver imagen en grande, siempre encima del sidebar */}
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
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-xl z-50 overflow-y-auto">
        {/* Header del modal lateral */}
        <div className="sticky top-0 bg-white border-b border-primary-100 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary-900">
            {formData.id ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={() => {
              onClose();
              dispatch(resetProductInventory()); // Limpia el formulario al cerrar
              dispatch(clearItemInventory());    // Limpia el itemInventory al cerrar
            }}
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
                  value={formData.name ?? ''}
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
                  value={formData.category ?? ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full rounded-md border ${errors.category ? 'border-red-500' : 'border-input'} bg-background px-3 py-2`}
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="rings">Anillos</option>
                  <option value="necklaces">Collares</option>
                  <option value="earrings">Aretes</option>
                  <option value="bracelets">Pulseras</option>
                </select>
                {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
              </div>
              {/* SKU */}
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku ?? ''}
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
              </div>
              {/* Precio */}
              <div>
                <Label htmlFor="price">Precio</Label>
                <Input
                  type="number"
                  id="price"
                  value={formData.price ?? 0}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
              </div>
              {/* Costo */}
              <div>
                <Label htmlFor="cost">Costo</Label>
                <Input
                  type="number"
                  id="cost"
                  value={formData.cost ?? 0}
                  onChange={(e) => handleInputChange('cost', Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className={errors.cost ? 'border-red-500' : ''}
                />
                {errors.cost && <p className="text-sm text-red-500 mt-1">{errors.cost}</p>}
              </div>
            </div>
            {/* Descripción */}
            <div>
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                value={formData.description ?? ''}
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
              images={
                formData.Images
                  ? formData.Images.filter((img: any) => img.state).flatMap((img: any) => img.url)
                  : []
              }
              onAddImages={handleImagesUploaded}
              onRemoveImage={(idx) => {
                let allUrls = formData.Images?.flatMap((img: any) => img.url) || [];
                allUrls = allUrls.filter((_: any, i: number) => i !== idx);
                const Images = allUrls.map((url: string, i: number) => ({
                  id: i + 1,
                  url: [url],
                  productId: formData.id || null,
                }));
                dispatch(updateProductInventory({ Images }));
              }}
              disabled={(formData.Images?.flatMap((img: any) => img.url).length || 0) >= 5}
              onImageClick={(url) => setImageModal({ open: true, url })}
            />
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
                onClick={() =>
                  handleDetailsChange('piedra', [
                    ...piedras,
                    { nombre: '', tipo: '' }
                  ])
                }
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus className="h-4 w-4 inline mr-1" />
                Agregar Piedra
              </button>
            </div>
            {piedras.map((piedra: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="Nombre de la piedra"
                  value={piedra.nombre}
                  onChange={e => {
                    const nuevasPiedras = [...piedras];
                    nuevasPiedras[index] = { ...nuevasPiedras[index], nombre: e.target.value };
                    handleDetailsChange('piedra', nuevasPiedras);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const nuevasPiedras = piedras.filter((_: any, i: number) => i !== index);
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

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                dispatch(resetProductInventory());
                dispatch(clearItemInventory()); // Limpia el itemInventory al cancelar
              }}
              className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
            >
              Cancelar
            </button>
            {isFormFilled() && (
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {formData.id ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Modal de confirmación para crear producto */}
      <Dialog open={showCreateModal} onClose={handleCancelCreate} className="z-[200]">
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[200]">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold mb-2">¿Crear nuevo producto?</Dialog.Title>
            <Dialog.Description className="mb-4">
              Se creará un producto nuevo con el nombre: <span className="font-bold">{pendingName}</span>
            </Dialog.Description>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancelCreate}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                disabled={loadingCreate}
              >
                No
              </button>
              <button
                type="button"
                onClick={handleConfirmCreate}
                className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700"
                disabled={loadingCreate}
              >
                Sí
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ProductTab;