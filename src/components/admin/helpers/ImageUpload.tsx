import React from "react";
import { Upload, X } from "lucide-react";
import { productService } from "@/services";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useProductImageState } from "@/hooks/useManageImages";

interface ProductImageUploadProps {
  images: string[];
  onAddImages: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  disabled?: boolean;
  onImageClick?: (url: string) => void;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  images,
  onAddImages,
  onRemoveImage,
  disabled = false,
  onImageClick
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const itemInventory = useAppSelector((state) => state.products.itemInventory);
  const { createImageState, deleteImageState } = useProductImageState()
  // Maneja la selección de archivos y sube cada uno
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5 - images.length);
      console.log("FILES", files);
      createImageState(files);
    }
  };

  return (
    <div>
      {/* Galería de imágenes */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2">
          {images.map((url, idx) => (
            <div key={url} className="relative group border rounded-lg overflow-hidden">
              <img
                src={url}
                alt={`Imagen ${idx + 1}`}
                className="w-full h-32 object-cover cursor-pointer"
                onClick={() => onImageClick && onImageClick(url)}
              />
              <button
                type="button"
                onClick={async () => {
                  // Envía la url a deleteImageState
                  await deleteImageState(url, itemInventory.id);
                }}
                className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-100"
                title="Eliminar imagen"
              >
                <X className="h-4 w-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-2">No hay imágenes cargadas.</p>
      )}

      {/* Botón para subir imágenes */}
      {images.length < 5 && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="block w-full border border-primary-300 text-primary-700 bg-white hover:bg-primary-50 hover:text-primary-900 rounded-md py-1.5 text-center text-sm font-medium transition-colors duration-200 cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center gap-2"
        >
          <Upload className="h-5 w-5 text-primary-600" />
          <span>Subir Imagen</span>
        </button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default ProductImageUpload;