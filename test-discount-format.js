// Test para verificar el formato de datos del carrito
console.log('=== TEST DE FORMATO DE DATOS ===');

// Simulación de datos del carrito real
const realCartData = {
  product: {
    id: 1,
    name: 'Set de collar invisible y aretes con piedra natural ágata',
    WarehouseItem: [{
      price: 5000
    }],
    Images: [{
      url: ['https://example.com/image.jpg']
    }]
  },
  quantity: 4
};

// Conversión a formato de descuento
const discountCartItem = {
  product: {
    id: realCartData.product.id,
    name: realCartData.product.name,
    price: realCartData.product.WarehouseItem?.[0]?.price || 0,
    Images: realCartData.product.Images?.[0]?.url?.[0] || ''
  },
  quantity: realCartData.quantity
};

console.log('Datos originales del carrito:', realCartData);
console.log('Datos convertidos para descuento:', discountCartItem);

// Verificar usuario con descuentos
const userData = {
  discounts: ['1', '3', '4']
};

console.log('Usuario con descuentos:', userData);
console.log('¿Tiene descuentos?', userData.discounts.length > 0);

// Verificar si el problema está en la conversión de datos
console.log('=== VERIFICACIONES ===');
console.log('ID del producto:', discountCartItem.product.id);
console.log('Precio del producto:', discountCartItem.product.price);
console.log('Cantidad:', discountCartItem.quantity);
console.log('Monto total del item:', discountCartItem.product.price * discountCartItem.quantity);

export {};
