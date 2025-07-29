import { productService } from "@/services/productService";
import { RootState } from "@/types";
import {
  updateImagesToProductFilePath,
  updateImagesToItemInventoryFilePath,
  updateImagesToItemInventory,
  updateImagesToProduct,
} from "@/store/slices/productsSlice";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import React from "react";

/**
 * Hook para actualizar el estado de una imagen (por ejemplo, eliminar o activar/desactivar)
 * en el backend y sincronizar el estado en Redux.
 */
export function useProductImageState() {
  const dispatch = useAppDispatch();
  const itemInventory = useAppSelector((state: RootState) => state.products.itemInventory);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const images =
    itemInventory &&
      Array.isArray(itemInventory.Images) &&
      itemInventory.Images[0] &&
      Array.isArray(itemInventory.Images[0].url)
      ? itemInventory.Images[0].url
      : [];

  // Maneja la selección de archivos y sube cada uno
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5 - images.length);
      createImageState(files);
    }
  };


  /**
   * Cambia el estado de la imagen en backend y actualiza el store.
   * @param productId ID del producto
   * @param url URL de la imagen
   * @returns {Promise<void>}
   */
  const createImageState = async (files: any) => {

    const filepaths = await productService.uploadImages(files) as any[];

    let imagePaths: any[] = [];
    if (
      itemInventory &&
      itemInventory.filepaths &&
      itemInventory.filepaths[0] &&
      itemInventory.filepaths[0].url
    ) {
      if (typeof itemInventory.filepaths[0].url === "string") {
        try {
          imagePaths = JSON.parse(itemInventory.filepaths[0].url);
        } catch {
          imagePaths = [];
        }
      } else if (Array.isArray(itemInventory.filepaths[0].url)) {
        imagePaths = [...itemInventory.filepaths[0].url];
      }
    }
    filepaths.forEach((file: any) => {
      imagePaths.push(file.filePath)
    })

    console.log(itemInventory)

    dispatch(updateImagesToProductFilePath({ productId: itemInventory.id, filepaths: imagePaths }));
    dispatch(updateImagesToItemInventoryFilePath(imagePaths));
    console.log("filepaths", imagePaths);
    const urls = await productService.updateImage(itemInventory.filepaths && itemInventory.filepaths[0] && itemInventory.filepaths[0].id ? itemInventory.filepaths[0].id : null, imagePaths, true, itemInventory.id || "") as any[];
    console.log("urls", urls);
    dispatch(updateImagesToProduct({ productId: itemInventory.id, images: urls }));
    dispatch(updateImagesToItemInventory(urls));
  };

  const deleteImageState = async (url: string, productId: number) => {

    debugger
    // Extrae la ruta a partir de "/photos_products/"
    const path = url.substring(url.indexOf("/photos_products/"));


    // Llama al backend para eliminar la imagen por url
    // await productService.createImage(productId, url);

    // Actualiza itemInventory eliminando la imagen por url
    if (itemInventory && itemInventory.Images && itemInventory.filepaths) {

      let filepaths

      if (typeof itemInventory.filepaths[0].url === "string") {
        filepaths = JSON.parse(itemInventory.filepaths[0].url);
      } else {
        filepaths = itemInventory.filepaths[0].url;
      }
      console.log("filepaths", filepaths);
      const updatedImagesInventoryFilepaths = filepaths.filter((img: any) => !img.includes(path));

      const updatedImages = itemInventory.Images[0].url.filter((img: any) => !img.includes(url));
      console.log("updatedImagesInventoryFilepaths", updatedImagesInventoryFilepaths);

      await productService.updateImage(itemInventory.filepaths[0].id, updatedImagesInventoryFilepaths, true, itemInventory.filepaths[0].productId) as any[];

      dispatch(updateImagesToProduct({ productId: itemInventory.id, images: updatedImages }));
      dispatch(updateImagesToItemInventory(updatedImages));
      dispatch(updateImagesToProductFilePath({ productId, filepaths: updatedImagesInventoryFilepaths }));
      dispatch(updateImagesToItemInventoryFilePath(updatedImagesInventoryFilepaths));
    }

  };

  return {
    fileInputRef,
    itemInventory,
    createImageState,
    deleteImageState,
    handleFileChange,
    images
  };
}

/**
 * Hook para manejar imágenes de productos, adaptado para trabajar con la lista de productos
 * en lugar de itemInventory. Permite subir imágenes no guardadas aún y eliminarlas.
 */
export function useManageImages(product: any, setPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>, selectedFiles: File[], setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state: RootState) => state.products.items);
  const itemInventory = useAppSelector((state: RootState) => state.products.itemInventory);
  // No necesitamos obtener previewUrls del estado porque lo recibimos como parámetro
  
  /**
   * Sube las imágenes seleccionadas y actualiza el estado
   */
  const createImageState = async (files: File[]) => {
    try {
      // Subir las imágenes al servidor
      const filepaths = await productService.uploadImages(files) as any[];
      
      // Obtener las rutas de imágenes existentes
      let imagePaths: any[] = [];
      
      // Si estamos editando un producto existente
      if (product && product.id) {
        const productItem = items.find(item => item.id === product.id);
        
        if (productItem && productItem.filepaths && productItem.filepaths[0] && productItem.filepaths[0].url) {
          if (typeof productItem.filepaths[0].url === "string") {
            try {
              imagePaths = JSON.parse(productItem.filepaths[0].url);
            } catch {
              imagePaths = [];
            }
          } else if (Array.isArray(productItem.filepaths[0].url)) {
            imagePaths = [...productItem.filepaths[0].url];
          }
        }
      }
      
      // Agregar las nuevas rutas de imágenes
      filepaths.forEach((file: any) => {
        imagePaths.push(file.filePath);
      });
      
      // Actualizar las URLs de vista previa
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
      // Si estamos editando un producto existente, actualizar el estado en Redux
      if (product && product.id) {
        dispatch(updateImagesToProductFilePath({ productId: product.id, filepaths: imagePaths }));
        
        // Si el producto actual es el mismo que itemInventory, actualizar también itemInventory
        // Usamos el itemInventory que ya obtuvimos en el nivel superior del hook
        if (itemInventory && itemInventory.id === product.id) {
          dispatch(updateImagesToItemInventoryFilePath(imagePaths));
        }
        
        // Guardar las imágenes en el backend
        const productItem = items.find(item => item.id === product.id);
        if (productItem && productItem.filepaths && productItem.filepaths[0]) {
          // Actualizar en el backend
          const urls = await productService.updateImage(
            productItem.filepaths[0].id, 
            imagePaths, 
            true, 
            productItem.filepaths[0].productId
          ) as any[];
          
          // Actualizar las URLs en Redux
          dispatch(updateImagesToProduct({ productId: product.id, images: urls }));
          
          // Si el producto actual es el mismo que itemInventory, actualizar también itemInventory
          if (itemInventory && itemInventory.id === product.id) {
            dispatch(updateImagesToItemInventory(urls));
          }
        }
      }
      
      return { success: true, filepaths };
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      return { success: false, error };
    }
  };
  
  /**
   * Elimina una imagen del estado y actualiza la vista previa
   */
  const deleteImageState = async (url: string) => {
    try {

      console.log(url)
      debugger
      // Si es una URL de vista previa temporal (blob:), solo eliminarla del estado local
      if (url.startsWith('blob:')) {
        // Revocar la URL para liberar memoria
        URL.revokeObjectURL(url);
        
        // No podemos acceder directamente a previewUrls, así que usamos setPreviewUrls
        // para encontrar el índice y actualizar el estado
        setPreviewUrls(prev => {
          const previewIndex = prev.findIndex(previewUrl => previewUrl === url);
          if (previewIndex !== -1) {
            // Eliminar el archivo seleccionado
            setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== previewIndex));
            
            // Eliminar la URL de vista previa
            const newUrls = [...prev];
            newUrls.splice(previewIndex, 1);
            return newUrls;
          }
          return prev;
        });
        
        return { success: true };
      }
      
      // Si es una URL de imagen guardada y estamos editando un producto existente
      if (product && product.id) {
        // Extrae la ruta a partir de "/photos_products/"
        const path = url.substring(url.indexOf("/photos_products/"));
        debugger
        const productItem = items.find(item => item.id === product.id);
        
        if (productItem && productItem.Images && productItem.filepaths) {
          let filepaths;
          
          if (typeof productItem.filepaths[0].url === "string") {
            filepaths = JSON.parse(productItem.filepaths[0].url);
          } else {
            filepaths = productItem.filepaths[0].url;
          }
          
          const updatedFilepaths = filepaths.filter((img: any) => !img.includes(path));
          
          // Asegurarse de que productItem.Images[0].url sea un array antes de usar filter
          let updatedImages;
          if (productItem.Images && productItem.Images[0]) {
            if (Array.isArray(productItem.Images[0].url)) {
              updatedImages = productItem.Images[0].url.filter((img: any) => !img.includes(url));
            } else if (typeof productItem.Images[0].url === 'string') {
              // Si es un string, convertirlo a array
              const imagesArray = [productItem.Images[0].url];
              updatedImages = imagesArray.filter((img: any) => !img.includes(url));
            } else {
              // Si no es ni array ni string, usar un array vacío
              updatedImages = [];
            }
          } else {
            updatedImages = [];
          }
          
          // Actualizar en el backend
          await productService.updateImage(
            productItem.filepaths[0].id, 
            updatedFilepaths, 
            true, 
            productItem.filepaths[0].productId
          ) as any[];
          debugger
          // Actualizar en Redux
          dispatch(updateImagesToProduct({ productId: product.id, images: updatedImages }));
          dispatch(updateImagesToProductFilePath({ productId: product.id, filepaths: updatedFilepaths }));
          
          // Si el producto actual es el mismo que itemInventory, actualizar también itemInventory
          // Usamos el itemInventory que ya obtuvimos en el nivel superior del hook
          if (itemInventory && itemInventory.id === product.id) {
            dispatch(updateImagesToItemInventory(updatedImages));
            dispatch(updateImagesToItemInventoryFilePath(updatedFilepaths));
          }
          
          // Actualizar las URLs de vista previa
          // No podemos acceder directamente a previewUrls, así que usamos setPreviewUrls
          // para filtrar la URL que queremos eliminar
          setPreviewUrls(prev => {
            const previewIndex = prev.findIndex(previewUrl => previewUrl === url);
            if (previewIndex !== -1) {
              const newUrls = [...prev];
              newUrls.splice(previewIndex, 1);
              return newUrls;
            }
            return prev;
          });
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      return { success: false, error };
    }
  };
  
  return {
    createImageState,
    deleteImageState
  };
}