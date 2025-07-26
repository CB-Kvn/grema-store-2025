import { useState, useEffect } from "react";
import { z } from "zod";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { updateProduct, updateProductInventory } from "@/store/slices/productsSlice";
import { warehouseService } from "@/services/warehouseService";
import { productService } from "@/services/productService";
import { ProductFormType } from "@/components/admin/inventory/ProductForm";
// Ajusta el import según tu estructura

export const productSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  category: z.string().min(1, "Selecciona una categoría"),
  sku: z.string().min(1, "El SKU es obligatorio"),
  description: z.string().min(5, "La descripción es obligatoria"),
  details: z.object({
    material: z.string().optional(),
    peso: z.string().optional(),
    largo: z.string().optional(),
    pureza: z.string().optional(),
    certificado: z.string().optional(),
    piedra: z.array(z.string()).optional(),
    color: z.array(z.object({
      hex: z.string().optional(),
      name: z.string().optional(),
    })).optional(),
    cierre: z.object({
      tipo: z.string().optional(),
      colores: z.array(z.object({
        hex: z.string().optional(),
        name: z.string().optional(),
      })).optional(),
    }).optional(),
  }).optional(),
  Images: z.array(z.any()).optional(),
});
export const defaultForm: ProductFormType = {
  name: "",
  category: "",
  sku: "",
  description: "",
  details: {
    material: "",
    peso: "",
    largo: "",
    pureza: "",
    certificado: "",
    piedra: [],
    color: [],
    cierre: { tipo: "", colores: [] }
  },
  Images: []
};

export function useProductForm(product: ProductFormType, onSubmit: (product: ProductFormType) => void, onClose: () => void) {
  const warehouseInfo = useAppSelector((state) => state.warehouses.warehouses);
  const [formData, setFormData] = useState<ProductFormType>(
    product && product.name && product.name.trim() !== "" ? product : defaultForm
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageModal, setImageModal] = useState<{ open: boolean; url: string | null }>({ open: false, url: null });
  const dispatch = useAppDispatch();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingName, setPendingName] = useState('');
  const [loadingCreate, setLoadingCreate] = useState(false);

  useEffect(() => {
    if (product && product.name && product.name.trim() !== "") {
      setFormData({
        ...product,
        details: {
          ...(
            typeof product.details === 'object' && product.details !== null
              ? product.details
              : defaultForm.details
          ),
          material: Array.isArray(product.details?.material)
            ? product.details.material.join(', ')
            : product.details?.material || '',
        }
      });
    } else {
      setFormData(defaultForm);
    }
  }, [product]);

  // Helpers para detalles
  const details = typeof formData.details === 'object' && formData.details !== null
    ? formData.details
    : defaultForm.details;
  const cierre = details.cierre || { tipo: '', colores: [] };
  const coloresCierre = cierre.colores || [];
  const colores = details.color || [];
  const piedra: string[] = details.piedra || [];

  // Handlers
  const handleInputChange = (field: keyof ProductFormType, value: any) => {
    setFormData(prev => {
      if (field === 'details') {
        return { ...prev, details: typeof value === 'object' && value !== null ? value : defaultForm.details };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleDetailsChange = (field: keyof NonNullable<ProductFormType['details']>, value: any) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: field === 'material'
          ? (Array.isArray(value) ? value.join(', ') : value)
          : value,
      },
    }));
  };

  const handleImagesUploaded = (uploadedImages: File[]) => {
    const urls = uploadedImages.map(file => URL.createObjectURL(file));
    let currentUrls = formData.Images?.flatMap((img: any) => img.url) || [];
    let allUrls = [...currentUrls, ...urls].slice(0, 5);
    const Images = allUrls.map((url, idx) => ({
      id: idx + 1,
      url: [url],
      productId: formData.id || null,
    }));
    setFormData(prev => ({ ...prev, Images }));
    dispatch(updateProductInventory({ ...formData, Images }));
  };

  const handleRemoveImage = (imgIdx: number, urlIdx: number) => {
    const newImages = (formData.Images || []).map((img: any, i: number) => {
      if (i === imgIdx) {
        return {
          ...img,
          url: img.url.filter((_: any, uIdx: number) => uIdx !== urlIdx)
        };
      }
      return img;
    }).filter((img: any) => img.url.length > 0);
    setFormData(prev => ({ ...prev, Images: newImages }));
    dispatch(updateProductInventory({ ...formData, Images: newImages }));
  };

  const validate = (data: ProductFormType) => {
    const result = productSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      return fieldErrors;
    }
    return {};
  };

  const isFormFilled = () => {
    const errs = validate(formData);
    return Object.keys(errs).length === 0;
  };

  const handleUpdateProduct = async (data: ProductFormType) => {
    const { Images, ...rest } = data;
    try {
      const updated = await productService.update(rest.id, rest);
      console.log('Producto actualizado:', updated);
      dispatch(updateProductInventory(updated));
      dispatch(updateProduct(updated))
    } catch (error) {
      console.error('Error actualizando producto:', error);
    }
  };

  function normalizeFormData(data: ProductFormType): ProductFormType {
    return {
      ...data,
      details:
        typeof data.details === 'object' && data.details !== null
          ? data.details
          : defaultForm.details,
    };
  }

  // Modal y creación rápida
  const validateName = (name: string) => {
    const result = productSchema.shape.name.safeParse(name);
    return result.success ? null : result.error.issues[0].message;
  };

  const buildWarehouseItems = (productId: number) => {
    return warehouseInfo.map((warehouse: any) => ({
      warehouseId: warehouse.id,
      minimumStock: warehouse.minimumStock,
      location: warehouse.id,
      price: 0,
      status: "IN_STOCK",
      discount: warehouse.discount ?? null,
    }));
  };

  const createProduct = async (name: string) => {
    const response = await productService.create({ name });
    const warehouse = buildWarehouseItems(response.id);
    await productService.createImage(JSON.stringify([]), response.id);
    for (const item of warehouse) {
      await warehouseService.addStock(item.warehouseId, response.id, {
        quantity: 0,
        location: item.location,
        price: item.price,
      });
    }
    const productNew = await productService.getById(response.id);
    return productNew;
  };

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const nameError = validateName(value);
    if (!formData.id && value && !nameError) {
      setPendingName(value);
      setShowCreateModal(true);
    } else if (nameError) {
      setErrors(prev => ({ ...prev, name: nameError }));
    }
  };

  const handleConfirmCreate = async () => {
    setLoadingCreate(true);
    try {
      const nameError = validateName(pendingName);
      if (nameError) {
        setErrors(prev => ({ ...prev, name: nameError }));
        setLoadingCreate(false);
        return;
      }
      const product = await createProduct(pendingName);
      dispatch(updateProductInventory(product));
      setFormData(product);
      setShowCreateModal(false);
      setPendingName('');
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
    setPendingName('');
    dispatch(updateProductInventory({ name: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeFormData(formData);
    const errs = validate(normalized);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      if (formData.id) {
        await handleUpdateProduct(normalized);
        onClose();
      } else {
        onSubmit(normalized);
        setFormData(defaultForm);
        onClose();
      }
    }
  };

  const generateUniqueSku = () => {
    // Prefijo fijo
    const prefix = "GRE-INV-";

    // Primeras 3 letras de la primera piedra (si hay)
    let piedraPart = "";
    if (Array.isArray(piedra) && piedra.length > 0) {
      piedraPart = (piedra[0] || "").substring(0, 3).toUpperCase();
    }

    // Primeras 3 letras del primer color (si hay)
    let colorPart = "";
    if (Array.isArray(colores) && colores.length > 0) {
      colorPart = (colores[0]?.name || "").substring(0, 3).toUpperCase();
    }

    return `${prefix}${piedraPart}-${colorPart}`;
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    imageModal,
    setImageModal,
    showCreateModal,
    setShowCreateModal,
    pendingName,
    setPendingName,
    loadingCreate,
    details,
    cierre,
    coloresCierre,
    colores,
    piedra,
    handleInputChange,
    handleDetailsChange,
    handleImagesUploaded,
    handleRemoveImage,
    handleSubmit,
    handleNameBlur,
    handleConfirmCreate,
    handleCancelCreate,
    isFormFilled,
    normalizeFormData,
    validate,
    generateUniqueSku,
    handleUpdateProduct
  };
}