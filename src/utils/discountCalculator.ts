import { Discount, Product } from '@/types';
import { discountService } from '@/services/discountService';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartItemWithDiscount extends CartItem {
  appliedDiscount?: {
    discountId: string;
    type: string;
    value: number;
    discountApplied: number;
    originalPrice: number;
    finalPrice: number;
    message?: string; // Para mensajes de optimización en BUY_X_GET_Y
  };
}

interface BuyXGetYDiscountResult {
  quantity: number;
  totalWithoutDiscount: number;
  totalWithDiscount: number;
  savings: number;
  savingsPercentage: number;
  message?: string;
}

export interface DiscountCalculationResult {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  appliedDiscounts: Array<{
    discountId: string;
    type: string;
    value: number;
    discountApplied: number;
  }>;
  // Agregar información del descuento aplicado por jerarquía
  selectedDiscount: {
    discountId: string;
    type: string;
    value: number;
    discountApplied: number;
  } | null;
}

/**
 * Calcula el monto final aplicando los descuentos asignados al usuario
 * @param cartItems - Array de productos en el carrito con sus cantidades
 * @param userDiscountIds - Array de IDs de descuentos asignados al usuario
 * @returns Promise con el resultado del cálculo de descuentos
 */
export const calculateDiscountedAmount = async (
  cartItems: CartItem[],
  userDiscountIds: string[]
): Promise<DiscountCalculationResult> => {
  const result: DiscountCalculationResult = {
    originalAmount: 0,
    discountAmount: 0,
    finalAmount: 0,
    appliedDiscounts: [],
    selectedDiscount: null
  };

  // Calcular el monto original
  result.originalAmount = cartItems.reduce(
    (total, item) => total + (item.product.price || 0) * item.quantity,
    0
  );

  // Si no hay descuentos asignados, retornar el monto original
  if (!userDiscountIds || userDiscountIds.length === 0) {
    result.finalAmount = result.originalAmount;
    return result;
  }

  // Validar que los IDs sean válidos
  const validDiscountIds = userDiscountIds.filter(id => id && typeof id === 'string' && id.trim() !== '');
  if (validDiscountIds.length === 0) {
    result.finalAmount = result.originalAmount;
    return result;
  }

  try {
    // Obtener información de todos los descuentos asignados con timeout
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout al obtener descuentos')), 5000)
    );
    
    const discountPromises = validDiscountIds.map(id => 
      Promise.race([discountService.getById(id), timeout])
    );
    
    const discountsResponse = await Promise.all(discountPromises);

    // Filtrar solo los descuentos activos y dentro del rango de fechas
    const activeDiscounts = discountsResponse
      .filter((discount: any): discount is Discount => {
        return discount && typeof discount === 'object' && 'isActive' in discount;
      })
      .filter((discount: Discount) => {
        if (!discount.isActive) return false;
        
        const now = new Date();
        const startDate = new Date(discount.startDate);
        const endDate = discount.endDate ? new Date(discount.endDate) : null;
        
        return now >= startDate && (!endDate || now <= endDate);
      });

    // Jerarquía de descuentos: PERCENTAGE → FIXED → BUY_X_GET_Y
    // Solo aplicar UN descuento según la jerarquía
    const discountHierarchy = ['PERCENTAGE', 'FIXED', 'BUY_X_GET_Y'];
    
    let bestDiscount = null;
    let bestDiscountAmount = 0;

    // Evaluar cada tipo de descuento según la jerarquía
    for (const discountType of discountHierarchy) {
      const discountsOfType = activeDiscounts.filter(d => d.type === discountType);
      
      if (discountsOfType.length === 0) continue;

      // Si hay múltiples descuentos del mismo tipo, elegir el que da mayor descuento
      for (const discount of discountsOfType) {
        const discountApplied = await applyDiscount(discount, cartItems);
        
        if (discountApplied > bestDiscountAmount) {
          bestDiscountAmount = discountApplied;
          bestDiscount = {
            discountId: discount.id.toString(),
            type: discount.type,
            value: discount.value,
            discountApplied
          };
        }
      }

      // Si encontramos un descuento válido de este tipo, no evaluar tipos inferiores
      if (bestDiscount) {
        break;
      }
    }

    // Aplicar el mejor descuento encontrado
    if (bestDiscount) {
      result.discountAmount = bestDiscountAmount;
      result.appliedDiscounts.push(bestDiscount);
      result.selectedDiscount = bestDiscount;
    }

    result.finalAmount = Math.max(0, result.originalAmount - result.discountAmount);

  } catch (error) {
    console.error('Error al calcular descuentos:', error);
    // En caso de error, retornar el monto original
    result.finalAmount = result.originalAmount;
  }

  return result;
};

/**
 * Calcula descuentos aplicados a cada item individual
 * @param cartItems - Array de productos en el carrito
 * @param userDiscountIds - Array de IDs de descuentos asignados al usuario
 * @returns Promise con array de items con información de descuentos aplicados
 */
export const calculateItemDiscounts = async (
  cartItems: CartItem[],
  userDiscountIds: string[]
): Promise<CartItemWithDiscount[]> => {
  console.log('DEBUG - calculateItemDiscounts START');
  console.log('DEBUG - cartItems:', cartItems);
  console.log('DEBUG - userDiscountIds:', userDiscountIds);
  
  // Si no hay descuentos asignados, retornar items sin descuentos
  if (!userDiscountIds || userDiscountIds.length === 0) {
    console.log('DEBUG - No hay descuentos asignados al usuario');
    return cartItems.map(item => ({
      ...item,
      appliedDiscount: undefined
    }));
  }

  // Validar que los IDs sean válidos
  const validDiscountIds = userDiscountIds.filter(id => id && typeof id === 'string' && id.trim() !== '');
  console.log('DEBUG - Valid discount IDs:', validDiscountIds);
  
  if (validDiscountIds.length === 0) {
    console.log('DEBUG - No hay IDs de descuentos válidos');
    return cartItems.map(item => ({
      ...item,
      appliedDiscount: undefined
    }));
  }

  try {
    // Obtener información de todos los descuentos asignados con timeout
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout al obtener descuentos')), 5000)
    );
    
    const discountPromises = validDiscountIds.map(id => 
      Promise.race([discountService.getById(id), timeout])
    );
    
    const discountsResponse = await Promise.all(discountPromises);
    console.log('DEBUG - Discounts response from API:', discountsResponse);

    // Filtrar solo los descuentos activos y dentro del rango de fechas
    const activeDiscounts = discountsResponse
      .filter((discount: any): discount is Discount => {
        const isValid = discount && typeof discount === 'object' && 'isActive' in discount;
        console.log('DEBUG - Discount valid check:', discount?.id, isValid);
        return isValid;
      })
      .filter((discount: Discount) => {
        if (!discount.isActive) {
          console.log('DEBUG - Discount inactive:', discount.id);
          return false;
        }
        
        const now = new Date();
        const startDate = new Date(discount.startDate);
        const endDate = discount.endDate ? new Date(discount.endDate) : null;
        
        const isInDateRange = now >= startDate && (!endDate || now <= endDate);
        console.log('DEBUG - Discount date range check:', discount.id, {
          now: now.toISOString(),
          startDate: startDate.toISOString(),
          endDate: endDate?.toISOString(),
          isInDateRange
        });
        
        return isInDateRange;
      });

    console.log('DEBUG - Active discounts after filtering:', activeDiscounts);

    // Jerarquía de descuentos: PERCENTAGE → FIXED → BUY_X_GET_Y
    const discountHierarchy = ['PERCENTAGE', 'FIXED', 'BUY_X_GET_Y'];
    
    // Calcular descuento para cada item individualmente
    const results = await Promise.all(cartItems.map(async (item) => {
      const itemOriginalPrice = (item.product.price || 0) * item.quantity;
      let bestDiscount: {
        discountId: string;
        type: string;
        value: number;
        discountApplied: number;
        originalPrice: number;
        finalPrice: number;
        message?: string;
      } | undefined = undefined;
      let bestDiscountAmount = 0;

      console.log(`DEBUG - Evaluando descuentos para item ${item.product.id} (${item.product.name})`);
      console.log(`DEBUG - Descuentos activos disponibles:`, activeDiscounts.map(d => ({ id: d.id, type: d.type, items: d.items })));

      // Filtrar descuentos que son aplicables a este item específico
      const applicableDiscounts = activeDiscounts.filter(discount => {
        // Si el descuento no tiene restricciones de productos, es aplicable a todos
        if (!discount.items || discount.items.length === 0) {
          return true;
        }
        // Si tiene restricciones, verificar que el producto esté incluido
        return discount.items.includes(item.product.id || 0);
      });

      console.log(`DEBUG - Descuentos aplicables al item ${item.product.id}:`, applicableDiscounts.map(d => ({ id: d.id, type: d.type })));

      // Evaluar cada tipo de descuento según la jerarquía para este item específico
      for (const discountType of discountHierarchy) {
        const discountsOfType = applicableDiscounts.filter(d => d.type === discountType);
        
        console.log(`DEBUG - Descuentos de tipo ${discountType} aplicables al item:`, discountsOfType.length);
        
        if (discountsOfType.length === 0) continue;

        // Evaluar cada descuento de este tipo para este item específico
        for (const discount of discountsOfType) {
          const discountApplied = await applyDiscountToItem(discount, item, cartItems);
          
          console.log(`DEBUG - Descuento ${discount.id} (${discount.type}) aplicado al item ${item.product.id}: ${discountApplied}`);
          
          // Para BUY_X_GET_Y, calcular el mensaje de optimización independientemente del descuento
          let message = '';
          if (discount.type === 'BUY_X_GET_Y') {
            const minQtyToPay = discount.value;
            const bonusQtyToGet = discount.value + 1;
            const discountResult = calculateBuyXGetYDiscount(
              minQtyToPay,
              bonusQtyToGet,
              item.product.price || 0,
              item.quantity
            );
            message = discountResult.message || '';
          }
          
          if (discountApplied > bestDiscountAmount) {
            bestDiscountAmount = discountApplied;
            
            bestDiscount = {
              discountId: discount.id.toString(),
              type: discount.type,
              value: discount.value,
              discountApplied,
              originalPrice: itemOriginalPrice,
              finalPrice: Math.max(0, itemOriginalPrice - discountApplied),
              message
            };
          } else if (discount.type === 'BUY_X_GET_Y' && message && !bestDiscount) {
            // Si no hay descuento aplicado pero hay mensaje de optimización, crear un entry sin descuento
            bestDiscount = {
              discountId: discount.id.toString(),
              type: discount.type,
              value: discount.value,
              discountApplied: 0,
              originalPrice: itemOriginalPrice,
              finalPrice: itemOriginalPrice,
              message
            };
          }
        }

        // Si encontramos un descuento válido de este tipo, no evaluar tipos inferiores
        if (bestDiscount) {
          console.log(`DEBUG - Mejor descuento seleccionado para item ${item.product.id}:`, bestDiscount);
          break;
        }
      }

      if (!bestDiscount) {
        console.log(`DEBUG - No se encontró ningún descuento aplicable para el item ${item.product.id}`);
      }

      return {
        ...item,
        appliedDiscount: bestDiscount
      };
    }));

    console.log('DEBUG - Resultados finales por item:', results);
    return results;

  } catch (error) {
    console.error('Error al calcular descuentos por item:', error);
    // En caso de error, retornar items sin descuentos
    return cartItems.map(item => ({
      ...item,
      appliedDiscount: undefined
    }));
  }
};

/**
 * Aplica un descuento específico según su tipo
 * @param discount - Información del descuento
 * @param cartItems - Items del carrito
 * @param originalAmount - Monto original del carrito
 * @returns Monto del descuento aplicado
 */
const applyDiscount = async (
  discount: Discount,
  cartItems: CartItem[]
): Promise<number> => {
  // Verificar si el descuento tiene restricciones de cantidad
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  if (discount.minQuantity && totalQuantity < discount.minQuantity) {
    return 0;
  }
  
  // Para maxQuantity, en lugar de bloquear completamente, limitamos la cantidad aplicable
  let effectiveQuantity = totalQuantity;
  if (discount.maxQuantity && totalQuantity > discount.maxQuantity) {
    effectiveQuantity = discount.maxQuantity;
  }

  // Filtrar productos aplicables si el descuento tiene restricciones de productos
  let applicableItems = cartItems;
  if (discount.items && discount.items.length > 0) {
    applicableItems = cartItems.filter(item => 
      discount.items?.includes(item.product.id || 0)
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
      // Para BUY_X_GET_Y, calcular el descuento total y aplicarlo usando la cantidad efectiva
      const minQuantityForDiscount = discount.value;
      
      if (effectiveQuantity < minQuantityForDiscount) {
        return 0;
      }

      const freeItems = Math.floor(effectiveQuantity / minQuantityForDiscount);
      const cheapestPrice = Math.min(...applicableItems.map(item => item.product.price || 0));
      
      return freeItems * cheapestPrice;
    
    default:
      return 0;
  }
};

/**
 * Aplica un descuento específico a un item individual
 * @param discount - Información del descuento
 * @param item - Item individual del carrito
 * @param allCartItems - Todos los items del carrito (para BUY_X_GET_Y)
 * @returns Monto del descuento aplicado a este item
 */
const applyDiscountToItem = async (
  discount: Discount,
  item: CartItem,
  allCartItems: CartItem[]
): Promise<number> => {
  console.log(`DEBUG - Aplicando descuento ${discount.id} (${discount.type}) a item ${item.product.id}:`, {
    discountItems: discount.items,
    productId: item.product.id,
    minQuantity: discount.minQuantity,
    maxQuantity: discount.maxQuantity,
    discountValue: discount.value
  });

  // Verificar si el descuento tiene restricciones de productos
  if (discount.items && discount.items.length > 0) {
    const isApplicable = discount.items.includes(item.product.id || 0);
    console.log(`DEBUG - Producto ${item.product.id} aplicable para descuento ${discount.id}:`, isApplicable);
    if (!isApplicable) {
      return 0;
    }
  }

  // Verificar restricciones de cantidad total si aplica
  const totalQuantity = allCartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
  
  if (discount.minQuantity && totalQuantity < discount.minQuantity) {
    console.log(`DEBUG - Cantidad total ${totalQuantity} menor que mínimo ${discount.minQuantity}`);
    return 0;
  }
  
  // Para maxQuantity, en lugar de bloquear completamente, limitamos la cantidad aplicable
  let effectiveQuantity = totalQuantity;
  if (discount.maxQuantity && totalQuantity > discount.maxQuantity) {
    effectiveQuantity = discount.maxQuantity;
    console.log(`DEBUG - Cantidad total ${totalQuantity} mayor que máximo ${discount.maxQuantity}, usando cantidad efectiva: ${effectiveQuantity}`);
  }

  const itemAmount = (item.product.price || 0) * item.quantity;
  console.log(`DEBUG - Monto del item: ${itemAmount}`);

  switch (discount.type) {
    case 'PERCENTAGE':
      const percentageDiscount = (itemAmount * discount.value) / 100;
      console.log(`DEBUG - Descuento porcentual calculado: ${percentageDiscount} (${discount.value}%)`);
      return percentageDiscount;
    
    case 'FIXED':
      // Para descuento fijo, distribuir proporcionalmente entre todos los items aplicables
      const applicableItems = allCartItems.filter(cartItem => {
        if (discount.items && discount.items.length > 0) {
          return discount.items.includes(cartItem.product.id || 0);
        }
        return true;
      });
      
      console.log(`DEBUG - Items aplicables para descuento fijo:`, applicableItems.length);
      
      const totalApplicableAmount = applicableItems.reduce(
        (total, cartItem) => total + (cartItem.product.price || 0) * cartItem.quantity,
        0
      );
      
      console.log(`DEBUG - Monto total aplicable: ${totalApplicableAmount}`);
      
      if (totalApplicableAmount === 0) return 0;
      
      const itemProportion = itemAmount / totalApplicableAmount;
      const maxDiscountForItem = Math.min(discount.value, totalApplicableAmount);
      const fixedDiscount = maxDiscountForItem * itemProportion;
      
      console.log(`DEBUG - Descuento fijo calculado: ${fixedDiscount} (proporción: ${itemProportion})`);
      return fixedDiscount;
    
    case 'BUY_X_GET_Y':
      // Para BUY_X_GET_Y, usar la función calculateBuyXGetYDiscount para calcular directamente

      const minQtyToPay = discount.minQuantity || 1;
      const bonusQtyToGet = discount.maxQuantity  || (minQtyToPay + 1); // Cantidad total que llevas
      const discountResult = calculateBuyXGetYDiscount(
        minQtyToPay,
        bonusQtyToGet,
        item.product.price || 0,
        item.quantity
      );
      console.log(`DEBUG - Descuento BUY_X_GET_Y calculado: ${discountResult.savings}`);
      return discountResult.savings;
    
    default:
      console.log(`DEBUG - Tipo de descuento no reconocido: ${discount.type}`);
      return 0;
  }
};

/**
 * Aplica descuento del tipo "Compra X y obtén Y" a un item específico
 * @param discount - Información del descuento
 * @param item - Item individual
 * @param allCartItems - Todos los items del carrito
 * @param effectiveQuantity - Cantidad efectiva a usar (opcional, por defecto usa la cantidad total)
 * @returns Monto del descuento aplicado a este item
 */
const applyBuyXGetYDiscountToItem = (
  discount: Discount,
  item: CartItem,
  allCartItems: CartItem[],
  effectiveQuantity?: number
): number => {
  // Filtrar items aplicables
  const applicableItems = allCartItems.filter(cartItem => {
    if (discount.items && discount.items.length > 0) {
      return discount.items.includes(cartItem.product.id || 0);
    }
    return true;
  });

  // Verificar si este item específico es aplicable
  const isThisItemApplicable = !discount.items || discount.items.length === 0 || 
    discount.items.includes(item.product.id || 0);
  
  if (!isThisItemApplicable) {
    console.log(`DEBUG - Item ${item.product.id} no es aplicable para BUY_X_GET_Y`);
    return 0;
  }

  const totalApplicableQuantity = effectiveQuantity || applicableItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
  
  console.log(`DEBUG - BUY_X_GET_Y - Total quantity: ${totalApplicableQuantity}, Discount value: ${discount.value}`);

  // Para BUY_X_GET_Y, interpretamos el valor como "compra X, lleva X+1"
  // Por ejemplo, si discount.value = 2, significa "compra 2, lleva 3"
  const bonusQtyToGet = discount.value + 1; // Cantidad total que llevas
  
  // Verificar si la cantidad total cumple con el mínimo para aplicar el descuento
  if (totalApplicableQuantity < bonusQtyToGet) {
    console.log(`DEBUG - BUY_X_GET_Y - Cantidad total ${totalApplicableQuantity} menor que mínimo ${bonusQtyToGet}`);
    return 0;
  }
  
  // Calcular cuántas veces aplica la oferta
  const offerApplications = Math.floor(totalApplicableQuantity / bonusQtyToGet);
  
  if (offerApplications === 0) {
    console.log(`DEBUG - BUY_X_GET_Y - No hay aplicaciones de oferta`);
    return 0;
  }
  
  // Calcular el descuento total
  const totalUnitsToDiscount = offerApplications; // Una unidad gratis por cada aplicación
  const unitPrice = item.product.price || 0;
  
  // Distribuir proporcionalmente el descuento entre los items aplicables
  const totalApplicableValue = applicableItems.reduce((total, cartItem) => total + (cartItem.product.price || 0) * cartItem.quantity, 0);
  const itemValue = unitPrice * item.quantity;
  
  if (totalApplicableValue === 0) {
    return 0;
  }
  
  const itemProportion = itemValue / totalApplicableValue;
  const totalDiscount = totalUnitsToDiscount * Math.min(...applicableItems.map(cartItem => cartItem.product.price || 0));
  const itemDiscount = totalDiscount * itemProportion;
  
  console.log(`DEBUG - BUY_X_GET_Y - Descuento total: ${totalDiscount}, Descuento para item: ${itemDiscount}`);
  
  return itemDiscount;
};

/**
 * Calcula descuento BUY_X_GET_Y para una cantidad específica
 * @param minQty - Mínimo para aplicar oferta (ej: 2 en "Compro 2 y llevo 3")
 * @param bonusQty - Cantidad total que llevas (ej: 3 en "Compro 2 y llevo 3")
 * @param unitPrice - Precio por unidad
 * @param quantity - Cantidad a evaluar
 * @returns Resultado del cálculo de descuento
 */
function calculateBuyXGetYDiscount(
  minQty: number,
  bonusQty: number,
  unitPrice: number,
  quantity: number
): BuyXGetYDiscountResult {
  // 1. Calcular precio sin descuento
  const totalWithoutDiscount = quantity * unitPrice;

  // 2. Calcular cuántas veces aplica la oferta y cuántas unidades adicionales
  const offerApplications = Math.floor(quantity / bonusQty);
  const remainingUnits = quantity % bonusQty;

  // 3. Calcular precio con descuento
  const discountedUnits = offerApplications * minQty;
  const totalWithDiscount = (discountedUnits + remainingUnits) * unitPrice;

  // 4. Calcular ahorro
  const savings = totalWithoutDiscount - totalWithDiscount;
  const savingsPercentage = savings > 0 ? (savings / totalWithoutDiscount) * 100 : 0;

  // 5. Mensaje opcional para cantidades no óptimas
  let message = '';
  if (remainingUnits > 0 && remainingUnits < minQty) {
    const suggestedQty = quantity + (minQty - remainingUnits);
    const maxSavingsPercentage = (1 - (minQty / bonusQty)) * 100;
    message = `⚠️ Para maximizar el ahorro, considera llevar ${suggestedQty} unidades (ahorro: ${Math.round(maxSavingsPercentage)}%)`;
  }

  return {
    quantity,
    totalWithoutDiscount,
    totalWithDiscount,
    savings,
    savingsPercentage,
    message,
  };
}

/**
 * Formatea el resultado del cálculo de descuentos para mostrar al usuario
 * @param result - Resultado del cálculo
 * @returns Objeto con información formateada
 */
export const formatDiscountResult = (result: DiscountCalculationResult) => {
  return {
    originalAmount: `$${result.originalAmount.toFixed(2)}`,
    discountAmount: `$${result.discountAmount.toFixed(2)}`,
    finalAmount: `$${result.finalAmount.toFixed(2)}`,
    savings: `$${result.discountAmount.toFixed(2)}`,
    savingsPercentage: result.originalAmount > 0 
      ? `${((result.discountAmount / result.originalAmount) * 100).toFixed(1)}%` 
      : '0%',
    appliedDiscounts: result.appliedDiscounts.map(discount => ({
      ...discount,
      discountApplied: `$${discount.discountApplied.toFixed(2)}`
    }))
  };
};
