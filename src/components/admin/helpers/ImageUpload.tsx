import React from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { useProductImageState } from "@/hooks/useManageImages";

interface ProductImageUploadProps {
  disabled?: boolean;
  onImageClick?: (url: string) => void;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  disabled = false,
  onImageClick
}) => {
  const {
    fileInputRef,
    itemInventory,
    deleteImageState,
    handleFileChange,
    images
  } = useProductImageState();

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (!disabled && acceptedFiles.length > 0) {
        handleFileChange({
          target: { files: acceptedFiles }
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    },
    [disabled, handleFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    disabled,
    maxFiles: 5 - images.length,
    noClick: true // Usamos nuestro propio botón para abrir el file dialog
  });

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
                  await deleteImageState(url, idx);
                  // Forzar re-render para permitir seguir eliminando
                  setTimeout(() => {}, 0);
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

      {/* Área Drag & Drop */}
      {images.length < 5 && (
        <div
          {...getRootProps()}
          className={`w-full border-2 border-dashed rounded-md p-4 mb-2 flex flex-col items-center justify-center transition-colors
            ${isDragActive ? 'border-primary-600 bg-primary-50' : 'border-primary-300 bg-white'}
            ${disabled ? 'opacity-50 pointer-events-none' : ''}
          `}
          style={{ minHeight: 80, cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 text-primary-600 mb-2" />
          <span className="text-sm text-primary-700">
            Arrastra y suelta imágenes aquí o&nbsp;
            <span
              tabIndex={0}
              role="button"
              className="underline text-primary-700 hover:text-primary-900 cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                // Dispara el click en el input de dropzone
                const input = (e.currentTarget.parentElement?.parentElement as HTMLElement).querySelector('input[type="file"]');
                if (input && !disabled) (input as HTMLInputElement).click();
              }}
              onKeyDown={e => {
                if ((e.key === "Enter" || e.key === " ") && !disabled) {
                  e.preventDefault();
                  const input = (e.currentTarget.parentElement?.parentElement as HTMLElement).querySelector('input[type="file"]');
                  if (input) (input as HTMLInputElement).click();
                }
              }}
              aria-disabled={disabled}
            >
              selecciona desde tu dispositivo
            </span>
          </span>
          <span className="text-xs text-gray-400 mt-1">Máximo 5 imágenes</span>
        </div>
      )}

    </div>
  );
};

export default ProductImageUpload;