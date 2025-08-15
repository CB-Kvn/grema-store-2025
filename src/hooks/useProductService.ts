import { useState } from 'react';
import { productService } from '@/services/productService';
import { warehouseService } from '@/services/warehouseService'; // <-- Importa el servicio de warehouse
import { Product, Discount } from '@/types';
import { useAppDispatch } from './useAppDispatch';
import { setBestSellingProducts, setLatestProducts, setProducts } from '@/store/slices/productsSlice';
import useGlobalDiscounts from './useGlobalDiscounts';

export const useProductService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();
  const handleRequest = async (request: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await request();
      setData(response);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAllProducts = async () => {
    const response = await handleRequest(() => productService.getAll());
    const latestProducts = await handleRequest(() => productService.getLatestProducts());
    const bestSellers = await handleRequest(() => productService.getBestSellingProducts());

    dispatch(setProducts(response));
    dispatch(setLatestProducts(latestProducts));
    dispatch(setBestSellingProducts(bestSellers));
    return response;
  };

  const getProductById = async (id: number) => {
    return handleRequest(() => productService.getById(id));
  };

  const createProduct = async (product: Omit<Product, 'id'>) => {
    return handleRequest(() => productService.create(product));
  };

  const updateProduct = async (id: number, product: Partial<Product>) => {
    return handleRequest(() => productService.update(id, product));
  };

  const deleteProduct = async (id: number) => {
    return handleRequest(() => productService.delete(id));
  };

  const updateInventory = async (id: string, data: { quantity: number; warehouseId: string }) => {
    return handleRequest(() => productService.updateInventory(id, data));
  };

  const updateDiscount = async (id: number, discount: Discount) => {
    return handleRequest(() => productService.updateDiscount(id, discount));
  };

  const transferStock = async (id: number, data: { sourceWarehouseId: string; targetWarehouseId: string; quantity: number }) => {
    return handleRequest(() => productService.transferStock(id, data));
  };

  const getPendingQuantities = async (id: number) => {
    return handleRequest(() => productService.getPendingQuantities(id));
  };

  // --- NUEVO: Agregar stock a una bodega ---
  const addStock = async (
    warehouseId: string,
    productId: number,
    data: { quantity: number; location: string; price: number }
  ) => {
    return handleRequest(() => warehouseService.addStock(warehouseId, productId, data));
  };

  // --- NUEVO: Remover stock de una bodega ---
  const removeStock = async (
    warehouseId: string,
    productId: number,
    quantity: number
  ) => {
    return handleRequest(() => warehouseService.removeStock(warehouseId, productId, quantity));
  };

  return {
    loading,
    error,
    data,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateInventory,
    updateDiscount,
    transferStock,
    getPendingQuantities,
    addStock,      // <-- Exporta addStock
    removeStock    // <-- Exporta removeStock
  };
};