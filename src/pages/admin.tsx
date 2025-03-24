import React, { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Package, Search, Plus, Edit, Trash2, 
  ArrowUpDown, Filter, Download, Upload, X 
} from 'lucide-react';
import { products } from './initial';
import { Product } from '@/interfaces/products';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


interface ProductFormData {
  id?: number;
  name: string;
  price: string;
  description: string;
  category: string;
  sku: string;
  images: string[];
  isBestSeller: boolean;
  isNew: boolean;
  details: {
    material: string;
    piedra?: string;
    peso: string;
    pureza?: string;
    color: {
      hex: string;
      name: string;
    }[];
    certificado?: string;
    garantia: string;
    diámetro?: string;
    largo?: string;
    broche?: string;
    cierre?: {
      tipo: string;
      colores: {
        hex: string;
        name: string;
      }[];
    };
  };
}

const initialFormData: ProductFormData = {
  name: '',
  price: '',
  description: '',
  category: '',
  sku: '',
  images: [''],
  isBestSeller: false,
  isNew: true,
  details: {
    material: '',
    peso: '',
    color: [],
    garantia: '2 años',
    cierre: {
      tipo: '',
      colores: []
    }
  }
};

const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [colorCount, setColorCount] = useState(1);
  const [imageCount, setImageCount] = useState(1);
  const [closureColorCount, setClosureColorCount] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'name':
          return order * a.name.localeCompare(b.name);
        case 'price':
          return order * (a.price - b.price);
        default:
          return 0;
      }
    });

  const validateForm = () => {
    const errors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!formData.name) errors.name = 'El nombre es requerido';
    if (!formData.price) errors.price = 'El precio es requerido';
    if (isNaN(Number(formData.price))) errors.price = 'El precio debe ser un número';
    if (!formData.sku) errors.sku = 'El SKU es requerido';
    if (!formData.category) errors.category = 'La categoría es requerida';
    if (!formData.images[0]) errors.images = 'Al menos una imagen es requerida';
    if (!formData.description) errors.description = 'La descripción es requerida';
    if (!formData.details.material) errors['details.material'] = 'El material es requerido';
    if (!formData.details.peso) errors['details.peso'] = 'El peso es requerido';
    if (formData.details.color.length === 0) errors['details.color'] = 'Al menos un color es requerido';
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Here you would typically make an API call to save/update the product
    const productData = {
      ...formData,
      price: Number(formData.price),
      images: formData.images.filter(img => img !== ''),
      details: {
        ...formData.details,
        color: formData.details.color.filter(c => c.hex && c.name),
        cierre: {
          ...formData.details.cierre,
          colores: formData.details.cierre?.colores.filter(c => c.hex && c.name) || []
        }
      }
    };

    console.log(`${isEditing ? 'Updated' : 'New'} Product Data:`, productData);

    // Reset form and close modal
    resetForm();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setColorCount(1);
    setImageCount(1);
    setClosureColorCount(1);
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      sku: product.sku,
      images: product.images,
      isBestSeller: product.isBestSeller,
      isNew: product.isNew,
      details: {
        ...product.details,
        color: product.details.color || [],
        cierre: {
          tipo: product.details.cierre?.tipo || '',
          colores: product.details.cierre?.colores || []
        }
      }
    });
    setColorCount(product.details.color?.length || 1);
    setImageCount(product.images.length);
    setClosureColorCount(product.details.cierre?.colores.length || 1);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field?: string,
    subfield?: string
  ) => {
    const { name, value } = e.target;
    
    if (field === 'details') {
      setFormData(prev => ({
        ...prev,
        details: {
          ...prev.details,
          [name]: value
        }
      }));
    } else if (field === 'color') {
      const index = Number(subfield);
      const type = name as 'hex' | 'name';
      setFormData(prev => ({
        ...prev,
        details: {
          ...prev.details,
          color: prev.details.color.map((c, i) => 
            i === index ? { ...c, [type]: value } : c
          )
        }
      }));
    } else if (field === 'closure') {
      if (subfield === 'tipo') {
        setFormData(prev => ({
          ...prev,
          details: {
            ...prev.details,
            cierre: {
              ...prev.details.cierre!,
              tipo: value
            }
          }
        }));
      } else {
        const index = Number(subfield);
        const type = name as 'hex' | 'name';
        setFormData(prev => ({
          ...prev,
          details: {
            ...prev.details,
            cierre: {
              ...prev.details.cierre!,
              colores: prev.details.cierre!.colores.map((c, i) => 
                i === index ? { ...c, [type]: value } : c
              )
            }
          }
        }));
      }
    } else if (field === 'images') {
      const index = Number(subfield);
      setFormData(prev => ({
        ...prev,
        images: prev.images.map((img, i) => i === index ? value : img)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (formErrors[name as keyof ProductFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        color: [...prev.details.color, { hex: '', name: '' }]
      }
    }));
    setColorCount(prev => prev + 1);
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        color: prev.details.color.filter((_, i) => i !== index)
      }
    }));
    setColorCount(prev => prev - 1);
  };

  const addClosureColor = () => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        cierre: {
          ...prev.details.cierre!,
          colores: [...prev.details.cierre!.colores, { hex: '', name: '' }]
        }
      }
    }));
    setClosureColorCount(prev => prev + 1);
  };

  const removeClosureColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        cierre: {
          ...prev.details.cierre!,
          colores: prev.details.cierre!.colores.filter((_, i) => i !== index)
        }
      }
    }));
    setClosureColorCount(prev => prev - 1);
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
    setImageCount(prev => prev + 1);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageCount(prev => prev - 1);
  };

  const ProductRow = ({ product }: { product: Product }) => (
    <tr className="border-b border-primary-100">
      <td className="py-4 px-6">
        <div className="flex items-center space-x-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <p className="font-medium text-primary-900">{product.name}</p>
            <p className="text-sm text-primary-500">SKU: {product.sku}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className="font-medium">${product.price.toLocaleString()}</span>
      </td>
      <td className="py-4 px-6">
        <span className={`px-2 py-1 rounded-full text-sm ${
          product.isBestSeller ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {product.isBestSeller ? 'En Stock' : 'Bajo Stock'}
        </span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center space-x-2">
          <button 
            className="p-1 hover:bg-primary-50 rounded"
            onClick={() => handleEdit(product)}
          >
            <Edit className="h-4 w-4 text-primary-600" />
          </button>
          <button className="p-1 hover:bg-primary-50 rounded">
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </td>
    </tr>
  );

  const ProductFormModal = () => (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={resetForm}
      />

      {/* Modal Content */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-primary-100 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary-900">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={resetForm}
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
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className={formErrors.sku ? 'border-red-500' : ''}
              />
              {formErrors.sku && (
                <p className="text-sm text-red-500 mt-1">{formErrors.sku}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Categoría</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full rounded-md border ${
                  formErrors.category ? 'border-red-500' : 'border-input'
                } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              >
                <option value="">Seleccionar categoría</option>
                <option value="rings">Anillos</option>
                <option value="necklaces">Collares</option>
                <option value="earrings">Aretes</option>
                <option value="bracelets">Pulseras</option>
              </select>
              {formErrors.category && (
                <p className="text-sm text-red-500 mt-1">{formErrors.category}</p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className={formErrors.price ? 'border-red-500' : ''}
              />
              {formErrors.price && (
                <p className="text-sm text-red-500 mt-1">{formErrors.price}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full rounded-md border ${
                  formErrors.description ? 'border-red-500' : 'border-input'
                } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              />
              {formErrors.description && (
                <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>
              )}
            </div>

            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={handleCheckboxChange}
                  className="rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Más Vendido</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleCheckboxChange}
                  className="rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Nuevo</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-primary-900">Imágenes</h3>
              <button
                type="button"
                onClick={addImage}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                + Agregar Imagen
              </button>
            </div>
            
            {Array.from({ length: imageCount }).map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="URL de la imagen"
                  value={formData.images[index] || ''}
                  onChange={(e) => handleInputChange(e, 'images', index.toString())}
                  className={formErrors.images ? 'border-red-500' : ''}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 hover:bg-primary-50 rounded-full"
                  >
                    <X className="h-4 w-4 text-primary-600" />
                  </button>
                )}
              </div>
            ))}
            {formErrors.images && (
              <p className="text-sm text-red-500">{formErrors.images}</p>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary-900">Detalles del Producto</h3>
            
            <div>
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                name="material"
                value={formData.details.material}
                onChange={(e) => handleInputChange(e, 'details')}
                className={formErrors['details.material'] ? 'border-red-500' : ''}
              />
              {formErrors['details.material'] && (
                <p className="text-sm text-red-500 mt-1">{formErrors['details.material']}</p>
              )}
            </div>

            {formData.category === 'rings' && (
              <>
                <div>
                  <Label htmlFor="piedra">Piedra</Label>
                  <Input
                    id="piedra"
                    name="piedra"
                    value={formData.details.piedra || ''}
                    onChange={(e) => handleInputChange(e, 'details')}
                  />
                </div>

                <div>
                  <Label htmlFor="pureza">Pureza</Label>
                  <Input
                    id="pureza"
                    name="pureza"
                    value={formData.details.pureza || ''}
                    onChange={(e) => handleInputChange(e, 'details')}
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="peso">Peso</Label>
              <Input
                id="peso"
                name="peso"
                value={formData.details.peso}
                onChange={(e) => handleInputChange(e, 'details')}
                className={formErrors['details.peso'] ? 'border-red-500' : ''}
              />
              {formErrors['details.peso'] && (
                <p className="text-sm text-red-500 mt-1">{formErrors['details.peso']}</p>
              )}
            </div>

            {(formData.category === 'necklaces' || formData.category === 'bracelets') && (
              <>
                <div>
                  <Label htmlFor="largo">Largo</Label>
                  <Input
                    id="largo"
                    name="largo"
                    value={formData.details.largo || ''}
                    onChange={(e) => handleInputChange(e, 'details')}
                  />
                </div>

                <div>
                  <Label htmlFor="broche">Tipo de Broche</Label>
                  <Input
                    id="broche"
                    name="broche"
                    value={formData.details.broche || ''}
                    onChange={(e) => handleInputChange(e, 'details')}
                  />
                </div>
              </>
            )}

            {formData.category === 'earrings' && (
              <div>
                <Label htmlFor="diámetro">Diámetro</Label>
                <Input
                  id="diámetro"
                  name="diámetro"
                  value={formData.details.diámetro || ''}
                  onChange={(e) => handleInputChange(e, 'details')}
                />
              </div>
            )}

            <div>
              <Label htmlFor="certificado">Certificado</Label>
              <Input
                id="certificado"
                name="certificado"
                value={formData.details.certificado || ''}
                onChange={(e) => handleInputChange(e, 'details')}
              />
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Colores Disponibles</Label>
                <button
                  type="button"
                  onClick={addColor}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Agregar Color
                </button>
              </div>
              
              {Array.from({ length: colorCount }).map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="color"
                    name="hex"
                    value={formData.details.color[index]?.hex || '#000000'}
                    onChange={(e) => handleInputChange(e, 'color', index.toString())}
                    className="w-20"
                  />
                  <Input
                    placeholder="Nombre del color"
                    name="name"
                    value={formData.details.color[index]?.name || ''}
                    onChange={(e) => handleInputChange(e, 'color', index.toString())}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="p-2 hover:bg-primary-50 rounded-full"
                    >
                      <X className="h-4 w-4 text-primary-600" />
                    </button>
                  )}
                </div>
              ))}
              {formErrors['details.color'] && (
                <p className="text-sm text-red-500">{formErrors['details.color']}</p>
              )}
            </div>

            {/* Closure Details */}
            <div className="space-y-4 border-t border-primary-100 pt-4">
              <h4 className="font-medium text-primary-900">Detalles del Cierre</h4>
              
              <div>
                <Label htmlFor="closureType">Tipo de Cierre</Label>
                <Input
                  id="closureType"
                  name="tipo"
                  value={formData.details.cierre?.tipo || ''}
                  onChange={(e) => handleInputChange(e, 'closure', 'tipo')}
                  placeholder="Ej: Presión, Gancho, etc."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Colores del Cierre</Label>
                  <button
                    type="button"
                    onClick={addClosureColor}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Agregar Color
                  </button>
                </div>
                
                {Array.from({ length: closureColorCount }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="color"
                      name="hex"
                      value={formData.details.cierre?.colores[index]?.hex || '#000000'}
                      onChange={(e) => handleInputChange(e, 'closure', index.toString())}
                      className="w-20"
                    />
                    <Input
                      placeholder="Nombre del color"
                      name="name"
                      value={formData.details.cierre?.colores[index]?.name || ''}
                      onChange={(e) => handleInputChange(e, 'closure', index.toString())}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeClosureColor(index)}
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

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-primary-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-6 w-6 text-primary-600" />
                <h1 className="text-2xl font-semibold text-primary-900">
                  Gestión de Inventario
                </h1>
              </div>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setIsModalOpen(true);
                }}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nuevo Producto
              </button>
            </div>
          </div>

          <Tabs defaultValue="inventory" className="w-full">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value="inventory">Inventario</TabsTrigger>
                <TabsTrigger value="orders">Órdenes de Compra</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="inventory" className="p-6">
              {/* Toolbar */}
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
                <div className="flex space-x-2">
                  <button className="flex items-center px-3 py-2 bg-white border border-primary-200 rounded-lg hover:bg-primary-50">
                    <Filter className="h-5 w-5 text-primary-600 mr-2" />
                    Filtrar
                  </button>
                  <button className="flex items-center px-3 py-2 bg-white border border-primary-200 rounded-lg hover:bg-primary-50">
                    <ArrowUpDown className="h-5 w-5 text-primary-600 mr-2" />
                    Ordenar
                  </button>
                  <button className="flex items-center px-3 py-2 bg-white border border-primary-200 rounded-lg hover:bg-primary-50">
                    <Download className="h-5 w-5 text-primary-600 mr-2" />
                    Exportar
                  </button>
                  <button className="flex items-center px-3  py-2 bg-white border border-primary-200 rounded-lg hover:bg-primary-50">
                    <Upload className="h-5 w-5 text-primary-600 mr-2" />
                    Importar
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary-50">
                      <th className="py-3 px-6 text-left">Producto</th>
                      <th className="py-3 px-6 text-left">Precio</th>
                      <th className="py-3 px-6 text-left">Estado</th>
                      <th className="py-3 px-6 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <ProductRow key={product.id} product={product} />
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="p-6">
              {/* Purchase Orders content will be implemented here */}
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-primary-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-primary-900 mb-2">
                  Próximamente
                </h3>
                <p className="text-primary-600">
                  La gestión de órdenes de compra estará disponible pronto.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && <ProductFormModal />}
    </div>
  );
};

export default InventoryPage;