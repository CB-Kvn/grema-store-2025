# Mejoras de Accesibilidad para Botones

## Problema Identificado

Los botones sin etiquetas de accesibilidad causan problemas a usuarios con lectores de pantalla, ya que solo escuchan "botón" sin contexto sobre su función.

## Elementos Corregidos

### 1. Navegación Principal (`nav-store.tsx`)

**Botón de menú hamburguesa:**
```tsx
<Button 
  variant="ghost" 
  size="icon" 
  className="p-2 hover:bg-primary-50 rounded-full"
  aria-label="Abrir menú de navegación"
>
  <Menu className="h-6 w-6 text-primary-600" />
</Button>
```

**Botón de carrito:**
```tsx
<Button 
  variant="ghost" 
  size="icon" 
  onClick={isOpen} 
  className="relative p-3 hover:bg-primary-50 rounded-full"
  aria-label="Abrir carrito de compras"
>
  <ShoppingCart className="h-12 w-12 text-primary-600" />
</Button>
```

**Botón de login:**
```tsx
<Button 
  variant="ghost" 
  size="icon" 
  onClick={() => setIsLoginOpen(true)} 
  className="p-3 hover:bg-primary-50 rounded-full"
  aria-label="Iniciar sesión"
>
  <User className="h-10 w-10 text-primary-600" />
</Button>
```

### 2. Barra de Búsqueda (`search-bar.tsx`)

**Botón de búsqueda:**
```tsx
<Button
  variant="ghost"
  size="icon"
  onClick={() => setIsOpen(true)}
  className="relative p-2 hover:bg-primary-50 rounded-full"
  aria-label="Abrir búsqueda de productos"
>
  <Search className="h-10 w-10 text-primary-600" />
</Button>
```

**Botón cerrar búsqueda:**
```tsx
<button
  onClick={() => setIsOpen(false)}
  className="p-2 hover:bg-gray-100 rounded-full"
  aria-label="Cerrar búsqueda"
>
  <X className="h-6 w-6 text-gray-600" />
</button>
```

### 3. Carrito de Compras (`cart.tsx`)

**Botón cerrar carrito:**
```tsx
<button
  onClick={onClose}
  className="p-2 hover:bg-primary-50 rounded-full transition-colors"
  aria-label="Cerrar carrito"
>
  <X className="h-5 w-5 text-primary-600" />
</button>
```

**Botones de cantidad:**
```tsx
<button
  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
  className="p-1 hover:bg-primary-50 rounded"
  disabled={item.quantity <= 1}
  aria-label={`Disminuir cantidad de ${item.product.name}`}
>
  <Minus className="h-4 w-4 text-primary-600" />
</button>

<button
  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
  className="p-1 hover:bg-primary-50 rounded"
  aria-label={`Aumentar cantidad de ${item.product.name}`}
>
  <Plus className="h-4 w-4 text-primary-600" />
</button>
```

**Botón eliminar producto:**
```tsx
<button
  onClick={() => onRemove(item.product.id)}
  className="p-2 hover:bg-primary-50 rounded-full transition-colors self-start"
  aria-label={`Eliminar ${item.product.name} del carrito`}
>
  <Trash2 className="h-5 w-5 text-primary-500" />
</button>
```

### 4. Redes Sociales (`networking.tsx`)

**Botón principal:**
```tsx
<button
  onClick={toggleMenu}
  className="w-12 h-12 bg-[#4A3A42] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#3a2f37] transition-colors duration-300 animate-slowPulse"
  aria-label="Abrir menú de redes sociales"
  aria-expanded={isOpen}
>
  <MoreHorizontal size={24} />
</button>
```

**Enlaces de redes sociales:**
```tsx
<a
  href="https://www.facebook.com/share/1EtrVJTK8q/?mibextid=wwXIfr"
  target="_blank"
  rel="noopener noreferrer"
  className="w-12 h-12 bg-[#3b5998] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#344e86] transition-colors duration-300"
  aria-label="Visitar nuestra página de Facebook"
>
  <FaFacebook size={24} />
</a>
```

### 5. Página de Inventario (`InventoryPage.tsx`)

**Botón menú móvil:**
```tsx
<button
  className="sm:hidden p-2 hover:bg-primary-50 rounded-lg"
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  aria-label={isMobileMenuOpen ? "Cerrar menú móvil" : "Abrir menú móvil"}
  aria-expanded={isMobileMenuOpen}
>
  {isMobileMenuOpen ? (
    <X className="h-6 w-6 text-primary-600" />
  ) : (
    <Menu className="h-6 w-6 text-primary-600" />
  )}
</button>
```

**Botones de filtros:**
```tsx
<button 
  className="w-full flex items-center justify-between p-2 hover:bg-primary-50 rounded-lg"
  aria-label="Filtrar productos"
>
  <span className="text-primary-600">Filtros</span>
  <Filter className="h-5 w-5 text-primary-600" />
</button>
```

### 6. Enlaces de Navegación

**Enlaces con mejor contexto:**
```tsx
<Link
  to="/about"
  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-full text-primary-900 bg-white hover:bg-primary-50"
  aria-label="Conocer más sobre nuestra historia y valores"
>
  Conoce Nuestra Historia
  <ArrowRight className="ml-2 h-5 w-5" />
</Link>
```

## Atributos de Accesibilidad Implementados

### `aria-label`
- Proporciona una etiqueta accesible cuando no hay texto visible
- Describe claramente la función del botón
- Especialmente importante para botones que solo tienen íconos

### `aria-expanded`
- Indica si un elemento desplegable está abierto o cerrado
- Útil para botones que controlan menús o paneles

### `aria-labelledby`
- Referencia a otro elemento que describe el botón
- Alternativa a aria-label cuando hay texto relacionado

## Beneficios de las Mejoras

1. **Lectores de pantalla**: Anuncian correctamente la función de cada botón
2. **Navegación por teclado**: Mejor experiencia para usuarios que usan solo teclado
3. **Usuarios con discapacidades**: Acceso completo a todas las funcionalidades
4. **SEO mejorado**: Los motores de búsqueda comprenden mejor el contenido
5. **Cumplimiento WCAG**: Cumple con las pautas de accesibilidad web

## Recomendaciones Adicionales

1. **Pruebas con lectores de pantalla**: Probar con NVDA, JAWS o VoiceOver
2. **Navegación por teclado**: Verificar que todos los botones sean accesibles con Tab
3. **Contraste de colores**: Asegurar que cumple con WCAG AA (4.5:1)
4. **Tamaño de elementos**: Mínimo 44px para interacción táctil
5. **Estados de focus**: Indicadores visuales claros para el foco del teclado

## Archivos Modificados

- `src/components/navigation/nav-store.tsx`
- `src/components/navigation/search-bar.tsx`
- `src/components/shopping/cart.tsx`
- `src/components/socials/networking.tsx`
- `src/pages/InventoryPage.tsx`
- `src/pages/values.tsx`
- `src/pages/history.tsx`
- `src/components/login/initial-page/ValuesPage.tsx`
