import { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from './useAppSelector';
import { 
  calculateItemDiscounts,
  calculateItemDiscountsWithGlobal,
  formatDiscountResult, 
  CartItem, 
  CartItemWithDiscount,
  DiscountCalculationResult 
} from '@/utils/discountCalculator';

interface UseDiscountCalculatorReturn {
  calculationResult: DiscountCalculationResult;
  itemsWithDiscounts: CartItemWithDiscount[];
  formattedResult: any;
  isLoading: boolean;
  error: string | null;
  recalculate: () => Promise<void>;
  hasDiscounts: boolean;
  totalSavings: number;
}

export const useDiscountCalculator = (cartItems: CartItem[]): UseDiscountCalculatorReturn => {
  const [calculationResult, setCalculationResult] = useState<DiscountCalculationResult>({
    originalAmount: 0,
    discountAmount: 0,
    finalAmount: 0,
    appliedDiscounts: [],
    selectedDiscount: null
  });
  
  const [itemsWithDiscounts, setItemsWithDiscounts] = useState<CartItemWithDiscount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const user = useAppSelector(state => state.user.currentUser);
  const globalDiscounts = useAppSelector(state => state.globalDiscounts.data?.data || []);

  const calculateDiscounts = useCallback(async () => {
    if (!cartItems || cartItems.length === 0) {
      setCalculationResult({
        originalAmount: 0,
        discountAmount: 0,
        finalAmount: 0,
        appliedDiscounts: [],
        selectedDiscount: null
      });
      setItemsWithDiscounts([]);
      return;
    }

    console.log('DEBUG - useDiscountCalculator - Starting calculation');
    console.log('DEBUG - useDiscountCalculator - CartItems:', cartItems);
    console.log('DEBUG - useDiscountCalculator - User:', user);
    console.log('DEBUG - useDiscountCalculator - User discounts:', user?.discounts);

    // Obtener descuentos del usuario
    const userDiscountIds = user?.discounts || [];
    
    // Si no hay descuentos de usuario, intentar aplicar descuentos globales
    if (userDiscountIds.length === 0) {
      console.log('DEBUG - useDiscountCalculator - No user discounts found, checking global discounts');
      
      // Filtrar descuentos globales activos
      const activeGlobalDiscounts = globalDiscounts.filter(discount => {
        if (!discount.isActive) return false;
        const now = new Date();
        const startDate = new Date(discount.startDate);
        const endDate = discount.endDate ? new Date(discount.endDate) : null;
        return now >= startDate && (!endDate || now <= endDate);
      });
      
      if (activeGlobalDiscounts.length === 0) {
        console.log('DEBUG - useDiscountCalculator - No active global discounts found');
        const originalAmount = cartItems.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0);
        const baseResult = {
          originalAmount,
          discountAmount: 0,
          finalAmount: originalAmount,
          appliedDiscounts: [],
          selectedDiscount: null
        };
        setCalculationResult(baseResult);
        setItemsWithDiscounts(cartItems.map(item => ({ ...item, appliedDiscount: undefined })));
        return;
      }
      
      // Aplicar descuentos globales
      try {
        const itemsWithDiscountInfo = await calculateItemDiscountsWithGlobal(cartItems, activeGlobalDiscounts);
        
        // Calcular totales basados en descuentos globales
        const originalAmount = itemsWithDiscountInfo.reduce(
          (total, item) => total + (item.product.price || 0) * item.quantity,
          0
        );
        
        const totalDiscountAmount = itemsWithDiscountInfo.reduce(
          (total, item) => total + (item.appliedDiscount?.discountApplied || 0),
          0
        );
        
        const finalAmount = originalAmount - totalDiscountAmount;
        
        const appliedDiscounts = itemsWithDiscountInfo
          .filter(item => item.appliedDiscount)
          .map(item => ({
            discountId: item.appliedDiscount!.discountId,
            type: item.appliedDiscount!.type,
            value: item.appliedDiscount!.value,
            discountApplied: item.appliedDiscount!.discountApplied
          }));
        
        const selectedDiscount = appliedDiscounts.length > 0 
          ? appliedDiscounts.reduce((best, current) => 
              current.discountApplied > best.discountApplied ? current : best
            )
          : null;
        
        const result = {
          originalAmount,
          discountAmount: totalDiscountAmount,
          finalAmount,
          appliedDiscounts,
          selectedDiscount
        };
        
        setCalculationResult(result);
        setItemsWithDiscounts(itemsWithDiscountInfo);
        return;
      } catch (err) {
        console.error('Error applying global discounts:', err);
        // En caso de error, mostrar solo el total original
        const originalAmount = cartItems.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0);
        const baseResult = {
          originalAmount,
          discountAmount: 0,
          finalAmount: originalAmount,
          appliedDiscounts: [],
          selectedDiscount: null
        };
        setCalculationResult(baseResult);
        setItemsWithDiscounts(cartItems.map(item => ({ ...item, appliedDiscount: undefined })));
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      // Calcular descuentos por item individualmente
      const itemsWithDiscountInfo = await calculateItemDiscounts(cartItems, userDiscountIds);
      
      console.log('DEBUG - Items con información de descuento:', itemsWithDiscountInfo);
      
      // Calcular totales globales basados en los descuentos individuales
      const originalAmount = itemsWithDiscountInfo.reduce(
        (total, item) => total + (item.product.price || 0) * item.quantity,
        0
      );
      
      const totalDiscountAmount = itemsWithDiscountInfo.reduce(
        (total, item) => total + (item.appliedDiscount?.discountApplied || 0),
        0
      );
      
      const finalAmount = originalAmount - totalDiscountAmount;
      
      // Crear resumen de descuentos aplicados
      const appliedDiscounts = itemsWithDiscountInfo
        .filter(item => item.appliedDiscount)
        .map(item => ({
          discountId: item.appliedDiscount!.discountId,
          type: item.appliedDiscount!.type,
          value: item.appliedDiscount!.value,
          discountApplied: item.appliedDiscount!.discountApplied
        }));
      
      // Determinar el descuento principal (el que más ahorro genera)
      const selectedDiscount = appliedDiscounts.length > 0 
        ? appliedDiscounts.reduce((best, current) => 
            current.discountApplied > best.discountApplied ? current : best
          )
        : null;
      
      const result = {
        originalAmount,
        discountAmount: totalDiscountAmount,
        finalAmount,
        appliedDiscounts,
        selectedDiscount
      };
      
      setCalculationResult(result);
      setItemsWithDiscounts(itemsWithDiscountInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al calcular descuentos');
      console.error('Error calculating discounts:', err);
      
      // En caso de error, mostrar solo el total original
      const originalAmount = cartItems.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0);
      setCalculationResult({
        originalAmount,
        discountAmount: 0,
        finalAmount: originalAmount,
        appliedDiscounts: [],
        selectedDiscount: null
      });
      setItemsWithDiscounts(cartItems.map(item => ({ ...item, appliedDiscount: undefined })));
    } finally {
      setIsLoading(false);
    }
  }, [cartItems, user?.discounts, globalDiscounts]);

  // Recalcular cuando cambien los items del carrito o el usuario
  useEffect(() => {
    calculateDiscounts();
  }, [calculateDiscounts]);

  const formattedResult = formatDiscountResult(calculationResult);

  return {
    calculationResult,
    itemsWithDiscounts,
    formattedResult,
    isLoading,
    error,
    recalculate: calculateDiscounts,
    hasDiscounts: calculationResult.selectedDiscount !== null,
    totalSavings: calculationResult.discountAmount
  };
};
