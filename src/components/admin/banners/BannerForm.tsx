import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banner } from '@/types';
import { X, Save, Plus, Upload, Loader2 } from 'lucide-react';
import { bannerService } from '@/services/bannerService';

interface BannerFormProps {
  onAdd: (bannerData: Omit<Banner, 'id'>) => Promise<void>;
  editingBanner?: Banner | null;
  onCancelEdit: () => void;
}

export function BannerForm({ onAdd, editingBanner, onCancelEdit }: BannerFormProps) {
  const [formData, setFormData] = useState<Omit<Banner, 'id'>>({
    name: '',
    dateInit: '',
    dateEnd: '',
    imageUrl: '',
    status: 'inactive'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos del banner en edición
  useEffect(() => {
    if (editingBanner) {
      setFormData({
        name: editingBanner.name,
        dateInit: editingBanner.dateInit,
        dateEnd: editingBanner.dateEnd,
        imageUrl: editingBanner.imageUrl,
        status: editingBanner.status
      });
    } else {
      setFormData({
        name: '',
        dateInit: '',
        dateEnd: '',
        imageUrl: '',
        status: 'inactive'
      });
    }
    setErrors({});
  }, [editingBanner]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        image: 'Solo se permiten archivos JPG, PNG o WEBP'
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        image: 'El archivo no debe superar los 5MB'
      }));
      return;
    }

    setSelectedFile(file);
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.dateInit) {
      newErrors.dateInit = 'La fecha de inicio es requerida';
    }

    if (!formData.dateEnd) {
      newErrors.dateEnd = 'La fecha de fin es requerida';
    }

    if (formData.dateInit && formData.dateEnd && new Date(formData.dateInit) >= new Date(formData.dateEnd)) {
      newErrors.dateEnd = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    if (!formData.imageUrl.trim() && !selectedFile) {
      newErrors.image = 'La imagen es requerida';
    } else if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'La URL de la imagen no es válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = formData.imageUrl;
      if (selectedFile) {
        setIsUploading(true);
        const uploadResponse = await bannerService.uploadImage(selectedFile);
        imageUrl = uploadResponse.url || uploadResponse.filePath;
      }

      const bannerData = {
        ...formData,
        imageUrl,
      };

      await onAdd(bannerData);
      if (!editingBanner) {
        // Solo limpiar el formulario si es creación nueva
        setFormData({
          name: '',
          dateInit: '',
          dateEnd: '',
          imageUrl: '',
          status: 'inactive'
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error al guardar banner:', error);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (editingBanner) {
      onCancelEdit();
    } else {
      setFormData({
        name: '',
        dateInit: '',
        dateEnd: '',
        imageUrl: '',
        status: 'inactive'
      });
    }
    setErrors({});
  };

  return (
    <Card className="mb-6 bg-white shadow-sm border border-primary-100">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary-700 font-medium">Nombre del Banner</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Banner Promocional Navidad"
                className={errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-primary-200 focus:border-primary-500 focus:ring-primary-200'}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-primary-700 font-medium">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="border-primary-200 focus:border-primary-500 focus:ring-primary-200">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="scheduled">Programado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fecha de inicio */}
            <div className="space-y-2">
              <Label htmlFor="dateInit" className="text-primary-700 font-medium">Fecha de Inicio</Label>
              <Input
                id="dateInit"
                type="datetime-local"
                value={formData.dateInit}
                onChange={(e) => setFormData({ ...formData, dateInit: e.target.value })}
                className={errors.dateInit ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-primary-200 focus:border-primary-500 focus:ring-primary-200'}
              />
              {errors.dateInit && <p className="text-sm text-red-500">{errors.dateInit}</p>}
            </div>

            {/* Fecha de fin */}
            <div className="space-y-2">
              <Label htmlFor="dateEnd" className="text-primary-700 font-medium">Fecha de Fin</Label>
              <Input
                id="dateEnd"
                type="datetime-local"
                value={formData.dateEnd}
                onChange={(e) => setFormData({ ...formData, dateEnd: e.target.value })}
                className={errors.dateEnd ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-primary-200 focus:border-primary-500 focus:ring-primary-200'}
              />
              {errors.dateEnd && <p className="text-sm text-red-500">{errors.dateEnd}</p>}
            </div>
          </div>

          {/* Imagen del banner */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-primary-700 font-medium">Imagen del Banner</Label>
            <input
              type="file"
              id="image"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                errors.image ? 'border-red-300' : 'border-primary-300'
              } hover:border-primary-400`}
            >
              <div className="space-y-1 text-center">
                {isUploading ? (
                  <Loader2 className="mx-auto h-12 w-12 text-primary-400 animate-spin" />
                ) : (
                  <Upload className="mx-auto h-12 w-12 text-primary-400" />
                )}
                <div className="flex text-sm text-primary-600">
                  <span className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                    {selectedFile ? selectedFile.name : (formData.imageUrl ? 'Cambiar imagen' : 'Subir imagen')}
                  </span>
                </div>
                <p className="text-xs text-primary-500">
                  JPG, PNG o WEBP hasta 5MB
                </p>
              </div>
            </div>
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image}</p>
            )}
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl}</p>
            )}
            {(formData.imageUrl || selectedFile) && (
              <div className="mt-2">
                <p className="text-sm text-primary-600 mb-2">Vista previa:</p>
                <img
                  src={selectedFile ? URL.createObjectURL(selectedFile) : formData.imageUrl}
                  alt="Vista previa del banner"
                  className="max-w-full h-32 object-cover rounded-lg border border-primary-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white"
            >
              {isSubmitting || isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isUploading ? 'Subiendo imagen...' : 'Guardando...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {editingBanner ? 'Actualizar' : 'Crear'} Banner
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex items-center gap-2 border-primary-300 text-primary-700 hover:bg-primary-50"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}