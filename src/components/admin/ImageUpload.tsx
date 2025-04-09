import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImagesUploaded: (files: File[]) => void; // Callback para enviar los archivos al componente padre
  onError?: (error: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesUploaded, onError }) => {
  const [images, setImages] = useState<File[]>([]); // Estado para almacenar los archivos de las imágenes
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // URLs para la vista previa
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: File[] = [];

    Array.from(files).forEach((file) => {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        onError?.('Solo se permiten archivos de imagen');
        return;
      }

      // Validar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        onError?.('El archivo es demasiado grande. Máximo 5MB');
        return;
      }

      // Validar límite de 5 imágenes
      if (images.length + newImages.length >= 5) {
        onError?.('Solo puedes subir un máximo de 5 imágenes');
        return;
      }

      // Generar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrls((prevUrls) => [...prevUrls, reader.result as string]); // Actualizar directamente
      };
      reader.readAsDataURL(file);

      newImages.push(file);
    });

    // Actualizar el estado con las nuevas imágenes
    setImages((prevImages) => {
      const updatedImages = [...prevImages, ...newImages];
      onImagesUploaded(updatedImages); // Enviar los archivos al componente padre
      return updatedImages;
    });
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      onImagesUploaded(updatedImages); // Enviar los archivos actualizados al componente padre
      return updatedImages;
    });

    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative">
            <img
              src={url}
              alt={`Imagen ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        {images.length < 5 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-primary-50 border-primary-300"
          >
            <Upload className="h-6 w-6 text-primary-600" />
            <span className="text-sm text-primary-600">Subir Imagen</span>
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple // Permitir múltiples archivos
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;