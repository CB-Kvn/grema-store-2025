import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  ArrowLeft,
  Save,
  Package,
  Upload,
  Plus,
  Tag,
  Star,
  Gift,
  Gem,
  X,
  Image as ImageIcon,
  Maximize2
} from 'lucide-react';
import type { Product } from '../../../types';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useManageImages } from '@/hooks/useManageImages';

interface ProductFormViewProps {
  product?: Product | null;
  isEdit?: boolean;
  onBack: () => void;
  onSave: (product: Product) => void;
}

const ProductFormView: React.FC<ProductFormViewProps> = ({
  product,
  isEdit = false,
  onBack,
  onSave
}) => {
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    category: '',
    sku: '',
    Images: [],
    isBestSeller: false,
    isNew: false,
    isGift: false,
    available: true,
    details: {
      material: '',
      piedra: [],
      peso: '',
      pureza: '',
      color: [],
      largo: '',
      garantia: '',
      certificado: '',
      cierre: {
        tipo: '',
        colores: []
      }
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const products = useAppSelector(state => state.products.products);
  
  // Usar el hook personalizado para manejar imágenes
  const { createImageState, deleteImageState } = useManageImages(product, setPreviewUrls, selectedFiles, setSelectedFiles);

  useEffect(() => {
    if (product && isEdit) {
      // Preparar los datos del producto para edición
      const productData = {
        ...product,
        discount: product.discount || {
          isActive: false,
          type: 'PERCENTAGE',
          value: 0,
          startDate: '',
          endDate: '',
          minQuantity: 0,
          maxQuantity: 0,
        }
      };

      setFormData(productData);

      // Si el producto tiene imágenes, mostrarlas en la vista previa
      if (product.Images && Array.isArray(product.Images) && product.Images.length > 0) {
        // Verificar si product.Images[0].url es un array o un string
        if (Array.isArray(product.Images[0].url) && product.Images[0].url.length > 0) {
          setPreviewUrls(product.Images[0].url);
        } else if (typeof product.Images[0].url === 'string' && product.Images[0].url.trim() !== '') {
          // Si es un string, convertirlo a array
          setPreviewUrls([product.Images[0].url]);
        }
      }
    }
  }, [product, isEdit]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.sku?.trim()) {
      newErrors.sku = 'El SKU es requerido';
    }

    // Verificar si el SKU ya existe (solo para nuevos productos)
    if (!isEdit && formData.sku?.trim()) {
      const skuExists = products.some(p => p.sku === formData.sku && p.id !== formData.id);
      if (skuExists) {
        newErrors.sku = 'Este SKU ya existe. Por favor, utilice otro.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSKU = () => {
    if (!formData.details?.material || !formData.details?.color || formData.details.color.length === 0) {
      setErrors(prev => ({
        ...prev,
        sku: 'Se requiere material y color para generar el SKU'
      }));
      return;
    }

    // Obtener las primeras 3 letras del material
    const materialPrefix = formData.details.material.slice(0, 3).toUpperCase();

    // Obtener las primeras 3 letras de cada palabra del color
    let colorPart = '';
    if (Array.isArray(formData.details.color)) {
      // Si es un array, tomar el primer elemento
      const colorStr = formData.details.color[0];
      const colorWords = colorStr.split(' ');
      colorPart = colorWords.map(word => word.slice(0, 3).toUpperCase()).join('');
    } else if (typeof formData.details.color === 'string') {
      // Si es un string
      const colorWords = formData.details.color.split(' ');
      colorPart = colorWords.map(word => word.slice(0, 3).toUpperCase()).join('');
    }

    // Crear el SKU con el formato requerido
    const newSku = `GRE-INV-${materialPrefix}-${colorPart}`;

    // Verificar si el SKU ya existe
    const skuExists = products.some(p => p.sku === newSku);
    if (skuExists) {
      // Si existe, añadir un número aleatorio al final
      const randomNum = Math.floor(Math.random() * 100);
      const uniqueSku = `${newSku}-${randomNum}`;
      handleInputChange('sku', uniqueSku);
    } else {
      handleInputChange('sku', newSku);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    // Validar tipos de archivo
    const invalidFiles = newFiles.filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: 'Solo se permiten archivos JPG, PNG, WEBP o GIF'
      }));
      return;
    }

    // Validar tamaño de archivos (10MB máximo por archivo)
    const oversizedFiles = newFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: 'Algunos archivos superan el límite de 10MB'
      }));
      return;
    }

    // Limitar a 5 archivos en total
    const totalFiles = selectedFiles.length + newFiles.length;
    if (totalFiles > 5) {
      setErrors(prev => ({
        ...prev,
        images: 'Solo se permiten un máximo de 5 imágenes'
      }));
      return;
    }

    // Agregar los archivos al estado local
    setSelectedFiles(prev => [...prev, ...newFiles]);

    // Usar el hook para subir las imágenes y actualizar las vistas previas
    // Esto subirá las imágenes inmediatamente y actualizará las URLs de vista previa
    const result = await createImageState(newFiles);
    
    if (!result.success) {
      setErrors(prev => ({
        ...prev,
        images: 'Error al subir las imágenes. Por favor, intente nuevamente.'
      }));
    } else {
      // Limpiar errores
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const removeFile = async (index: number) => {
    // Obtener la URL de la imagen a eliminar
    const imageUrl = previewUrls[index];
    
    // Usar el hook para eliminar la imagen
    // Esto eliminará la imagen del estado y actualizará las vistas previas
    await deleteImageState(imageUrl);
    
    // No es necesario actualizar selectedFiles ni previewUrls aquí
    // ya que deleteImageState ya se encarga de eso
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsUploading(true);

      // Preparar datos para enviar
      const productToSave = {
        ...formData
      };

      // Como las imágenes ya se han subido con createImageState,
      // simplemente usamos las URLs de vista previa como las imágenes del producto
      // Las URLs de vista previa ya contienen las URLs de las imágenes subidas
      if (isEdit) {
        // Si estamos editando, usar las imágenes actuales (que ya incluyen las nuevas subidas)
        // Las imágenes ya se han actualizado en el estado de Redux a través de createImageState
        productToSave.Images = previewUrls.length > 0 ? previewUrls : formData.Images;
      } else {
        // Si es un nuevo producto, usar las imágenes que ya se han subido
        productToSave.Images = previewUrls.length > 0 ? previewUrls : [];
      }
      onSave(productToSave as Product);
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Error al guardar el producto. Por favor, intente nuevamente.'
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error del campo al editarlo
    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDetailsChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      details: {
        ...prev.details!,
        [field]: value
      }
    }));
  };

  return (

    <><motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary-900">
              {isEdit ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </h1>
            <p className="text-primary-500">
              {isEdit ? 'Modifica la información del producto' : 'Completa los datos del nuevo producto'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal - Información básica */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información básica */}
            <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre del Producto *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ej: Anillo de oro 18k"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="sku">SKU *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="sku"
                        value={formData.sku || ''}
                        onChange={(e) => handleInputChange('sku', e.target.value)}
                        placeholder="Ej: GRE-INV-ORO-BLA"
                        className={errors.sku ? 'border-red-500' : ''}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateSKU}
                        title="Generar SKU automáticamente"
                      >
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                    {errors.sku && <p className="text-sm text-red-500 mt-1">{errors.sku}</p>}
                    <p className="text-xs text-primary-500 mt-1">Formato: GRE-INV-[Material]-[Color]</p>
                  </div>
                </div>

                {/* Los campos de precio y costo han sido eliminados ya que se manejan en el inventario */}

                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={formData.category || ''}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Anillos">Anillos</SelectItem>
                      <SelectItem value="Collares">Collares</SelectItem>
                      <SelectItem value="Pulseras">Pulseras</SelectItem>
                      <SelectItem value="Aretes">Aretes</SelectItem>
                      <SelectItem value="Relojes">Relojes</SelectItem>
                      <SelectItem value="Sets">Sets</SelectItem>
                      <SelectItem value="Otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                    placeholder="Describe las características del producto..."
                    rows={4}
                  />
                </div>

                {/* Sección de carga de imágenes */}
                <div>
                  <Label htmlFor="images">Imágenes del Producto</Label>
                  <input
                    type="file"
                    id="images"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.webp,.gif"
                    className="hidden"
                    multiple
                  />

                  {/* Vista previa de imágenes seleccionadas */}
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 px-5 mt-2">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative border border-primary-200 rounded-lg overflow-hidden group h-40">
                          <img
                            src={url}
                            alt={`Vista previa ${index + 1}`}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => {
                              setSelectedImage(url);
                              setModalOpen(true);
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(url);
                                setModalOpen(true);
                              }}
                              className="bg-white text-primary-600 rounded-full p-1.5 mr-2"
                            >
                              <Maximize2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                              }}
                              className="bg-red-500 text-white rounded-full p-1.5"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Área para subir imágenes */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${errors.images ? 'border-red-300 bg-red-50' : 'border-primary-200 hover:border-primary-300 hover:bg-primary-50'}`}
                  >
                    <ImageIcon className="h-8 w-8 text-primary-400 mx-auto mb-2" />
                    <p className="text-sm text-primary-600 mb-2">
                      Subir imágenes del producto
                    </p>
                    <Button type="button" variant="outline" size="sm">
                      Seleccionar archivos
                    </Button>
                    <p className="text-xs text-primary-500 mt-2">
                      JPG, PNG, WEBP, GIF hasta 10MB (máximo 5 imágenes)
                    </p>
                  </div>
                  {errors.images && <p className="text-sm text-red-500 mt-1">{errors.images}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Detalles técnicos */}
            <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gem className="h-5 w-5" />
                  Detalles Técnicos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      value={formData.details?.material || ''}
                      onChange={(e) => handleDetailsChange('material', e.target.value)}
                      placeholder="Ej: Nylon transparente"
                    />
                  </div>

                  <div>
                    <Label htmlFor="peso">Peso</Label>
                    <Input
                      id="peso"
                      value={formData.details?.peso || ''}
                      onChange={(e) => handleDetailsChange('peso', e.target.value)}
                      placeholder="Ej: 4g"
                    />
                  </div>

                  <div>
                    <Label htmlFor="largo">Largo</Label>
                    <Input
                      id="largo"
                      value={formData.details?.largo || ''}
                      onChange={(e) => handleDetailsChange('largo', e.target.value)}
                      placeholder="Ej: 40cm + 3cm de extensión"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pureza">Pureza</Label>
                    <Input
                      id="pureza"
                      value={formData.details?.pureza || ''}
                      onChange={(e) => handleDetailsChange('pureza', e.target.value)}
                      placeholder="Ej: N/A"
                    />
                  </div>

                  <div>
                    <Label htmlFor="garantia">Garantía</Label>
                    <Input
                      id="garantia"
                      value={formData.details?.garantia || ''}
                      onChange={(e) => handleDetailsChange('garantia', e.target.value)}
                      placeholder="Ej: 1 mes por defectos de fábrica"
                    />
                  </div>

                  <div>
                    <Label htmlFor="certificado">Certificado</Label>
                    <Input
                      id="certificado"
                      value={formData.details?.certificado || ''}
                      onChange={(e) => handleDetailsChange('certificado', e.target.value)}
                      placeholder="Ej: Hecho a mano en Costa Rica"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna lateral - Configuración */}
          <div className="space-y-6">
            {/* Configuración */}
            <Card className="border-primary-100 hover:border-primary-200 bg-gradient-to-r from-white to-primary-25 hover:from-primary-25 hover:to-primary-50 transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Configuración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="available" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Disponible
                  </Label>
                  <Switch
                    id="available"
                    checked={formData.available || false}
                    onCheckedChange={(checked) => handleInputChange('available', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="best-seller" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Best Seller
                  </Label>
                  <Switch
                    id="best-seller"
                    checked={formData.isBestSeller || false}
                    onCheckedChange={(checked) => handleInputChange('isBestSeller', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is-new" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Producto nuevo
                  </Label>
                  <Switch
                    id="is-new"
                    checked={formData.isNew || false}
                    onCheckedChange={(checked) => handleInputChange('isNew', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is-gift" className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Para regalo
                  </Label>
                  <Switch
                    id="is-gift"
                    checked={formData.isGift || false}
                    onCheckedChange={(checked) => handleInputChange('isGift', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="gradient"
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
      {/* Modal para mostrar imagen ampliada */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center bg-black/5">
            <img
              src={selectedImage}
              alt="Imagen ampliada"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

    </>

  );

};

export default ProductFormView;
