import { useAppSelector } from '@/hooks/useAppSelector';
import { discountService } from '@/services/discountService';
import { CartItem, DiscountCalculationResult } from '@/utils/discountCalculator';
import { Product } from '@/types';

/**
 * Función para integrar fácilmente el cálculo de descuentos en componentes existentes
 */
export const useCheckoutCalculation = () => {
  const user = useAppSelector(state => state.user.currentUser);

  /**
   * Calcula el total final de una compra aplicando descuentos
   * @param products - Array de productos con sus cantidades
   * @returns Promise con el resultado del cálculo
   */
  const calculateCheckoutTotal = async (
    products: Array<{ product: Product; quantity: number }>
  ): Promise<DiscountCalculationResult> => {
    
    // Convertir productos a CartItems
    const cartItems: CartItem[] = products.map(({ product, quantity }) => ({
      product,
      quantity
    }));

    // Calcular monto original
    const originalAmount = cartItems.reduce(
      (total, item) => total + (item.product.price || 0) * item.quantity,
      0
    );

    const result: DiscountCalculationResult = {
      originalAmount,
      discountAmount: 0,
      finalAmount: originalAmount,
      appliedDiscounts: []
    };

    // Si el usuario no tiene descuentos, retornar el total original
    if (!user?.discounts || user.discounts.length === 0) {
      return result;
    }

    try {
      // Obtener información de descuentos
      const discountPromises = user.discounts.map((id: string) => discountService.getById(id));
      const discounts = await Promise.all(discountPromises);

      // Filtrar descuentos activos
      const activeDiscounts = discounts.filter((discount: any) => {
        if (!discount?.isActive) return false;
        
        const now = new Date();
        const startDate = new Date(discount.startDate);
        const endDate = discount.endDate ? new Date(discount.endDate) : null;
        
        return now >= startDate && (!endDate || now <= endDate);
      });

      let totalDiscount = 0;

      // Aplicar cada descuento
      for (const discount of activeDiscounts) {
        const discountAmount = await calculateIndividualDiscount(discount, cartItems);
        
        if (discountAmount > 0) {
          totalDiscount += discountAmount;
          result.appliedDiscounts.push({
            discountId: discount.id.toString(),
            type: discount.type,
            value: discount.value,
            discountApplied: discountAmount
          });
        }
      }

      result.discountAmount = totalDiscount;
      result.finalAmount = Math.max(0, originalAmount - totalDiscount);

    } catch (error) {
      console.error('Error al calcular descuentos:', error);
      // En caso de error, retornar el monto original
    }

    return result;
  };

  /**
   * Calcula un descuento individual
   */
  const calculateIndividualDiscount = async (discount: any, cartItems: CartItem[]): Promise<number> => {
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    // Verificar restricciones de cantidad
    if (discount.minQuantity && totalQuantity < discount.minQuantity) {
      return 0;
    }
    
    if (discount.maxQuantity && totalQuantity > discount.maxQuantity) {
      return 0;
    }

    // Filtrar productos aplicables
    let applicableItems = cartItems;
    if (discount.items && discount.items.length > 0) {
      applicableItems = cartItems.filter(item => 
        discount.items.includes(item.product.id)
      );
    }

    if (applicableItems.length === 0) {
      return 0;
    }

    const applicableAmount = applicableItems.reduce(
      (total, item) => total + (item.product.price || 0) * item.quantity,
      0
    );

    switch (discount.type) {
      case 'PERCENTAGE':
        return (applicableAmount * discount.value) / 100;
      
      case 'FIXED':
        return Math.min(discount.value, applicableAmount);
      
      case 'BUY_X_GET_Y':
        const totalQty = applicableItems.reduce((total, item) => total + item.quantity, 0);
        const freeItems = Math.floor(totalQty / discount.value);
        const cheapestPrice = Math.min(...applicableItems.map(item => item.product.price || 0));
        return freeItems * cheapestPrice;
      
      default:
        return 0;
    }
  };

  /**
   * Obtiene información resumida de los descuentos del usuario
   */
  const getUserDiscountInfo = async () => {
    if (!user?.discounts || user.discounts.length === 0) {
      return {
        hasDiscounts: false,
        totalDiscounts: 0,
        activeDiscounts: []
      };
    }

    try {
      const discountPromises = user.discounts.map((id: string) => discountService.getById(id));
      const discounts = await Promise.all(discountPromises);

      const activeDiscounts = discounts.filter((discount: any) => {
        if (!discount?.isActive) return false;
        
        const now = new Date();
        const startDate = new Date(discount.startDate);
        const endDate = discount.endDate ? new Date(discount.endDate) : null;
        
        return now >= startDate && (!endDate || now <= endDate);
      });

      return {
        hasDiscounts: activeDiscounts.length > 0,
        totalDiscounts: discounts.length,
        activeDiscounts: activeDiscounts.map((discount: any) => ({
          id: discount.id,
          type: discount.type,
          value: discount.value,
          description: getDiscountDescription(discount)
        }))
      };

    } catch (error) {
      console.error('Error al obtener información de descuentos:', error);
      return {
        hasDiscounts: false,
        totalDiscounts: 0,
        activeDiscounts: []
      };
    }
  };

  const getDiscountDescription = (discount: any): string => {
    switch (discount.type) {
      case 'PERCENTAGE':
        return `${discount.value}% de descuento`;
      case 'FIXED':
        return `$${discount.value} de descuento`;
      case 'BUY_X_GET_Y':
        return `Compra ${discount.value} y llévate uno gratis`;
      default:
        return 'Descuento especial';
    }
  };

  return {
    calculateCheckoutTotal,
    getUserDiscountInfo,
    hasUserDiscounts: (user?.discounts?.length || 0) > 0,
    userDiscountCount: user?.discounts?.length || 0
  };
};

// Función helper para uso directo sin hook
export const calculateOrderTotal = async (
  products: Array<{ product: Product; quantity: number }>,
  userDiscounts: string[]
): Promise<DiscountCalculationResult> => {
  const cartItems: CartItem[] = products.map(({ product, quantity }) => ({
    product,
    quantity
  }));

  const originalAmount = cartItems.reduce(
    (total, item) => total + (item.product.price || 0) * item.quantity,
    0
  );

  const result: DiscountCalculationResult = {
    originalAmount,
    discountAmount: 0,
    finalAmount: originalAmount,
    appliedDiscounts: []
  };

  if (!userDiscounts || userDiscounts.length === 0) {
    return result;
  }

  try {
    const discountPromises = userDiscounts.map((id: string) => discountService.getById(id));
    await Promise.all(discountPromises);

    // Aplicar lógica de descuentos similar a la función anterior
    // ... (código similar al de calculateCheckoutTotal)

    return result;
  } catch (error) {
    console.error('Error al calcular total:', error);
    return result;
  }
};
