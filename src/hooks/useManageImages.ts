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

    // Extrae la ruta a partir de "/photos_products/"
    const path = url.substring(url.indexOf("/photos_products/"));

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

      const response = await productService.updateImage(itemInventory.Images[0].id, updatedImagesInventoryFilepaths, true, itemInventory.filepaths[0].productId) as any[];

      debugger

      dispatch(updateImagesToProduct({ productId: itemInventory.id, images: updatedImages }));

      dispatch(updateImagesToItemInventory(response));//no
      
      dispatch(updateImagesToProductFilePath({ productId, filepaths: updatedImagesInventoryFilepaths }))//no
      dispatch(updateImagesToItemInventoryFilePath(response));//no
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