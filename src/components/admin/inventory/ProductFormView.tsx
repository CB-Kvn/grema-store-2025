import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { 
  ArrowLeft, 
  Save, 
  Package, 
  Upload, 
  Plus,
  Tag,
  Star,
  Gift,
  Gem
} from 'lucide-react';
import type { Product } from '../../../types';

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

  useEffect(() => {
    if (product && isEdit) {
      setFormData({
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
      });
    }
  }, [product, isEdit]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    if (!formData.sku?.trim()) {
      newErrors.sku = 'El SKU es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData as Product);
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
    <motion.div
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
            <Card>
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
                    <Input
                      id="sku"
                      value={formData.sku || ''}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="Ej: AN-001"
                      className={errors.sku ? 'border-red-500' : ''}
                    />
                    {errors.sku && <p className="text-sm text-red-500 mt-1">{errors.sku}</p>}
                  </div>
                </div>

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
                      <SelectItem value="anillos">Anillos</SelectItem>
                      <SelectItem value="collares">Collares</SelectItem>
                      <SelectItem value="pulseras">Pulseras</SelectItem>
                      <SelectItem value="aretes">Aretes</SelectItem>
                      <SelectItem value="relojes">Relojes</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
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

                <div>
                  <Label htmlFor="image">URL de Imagen</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      value={formData.Images || ''}
                      onChange={(e) => handleInputChange('Images', e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalles técnicos */}
            <Card>
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
            <Card>
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
                className="flex-1 bg-primary-600 hover:bg-primary-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductFormView;
