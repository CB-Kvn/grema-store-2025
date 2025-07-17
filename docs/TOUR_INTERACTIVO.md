# Tour Interactivo para Administración - Grema Store

Este sistema de tour interactivo está diseñado para guiar a los usuarios a través de las funcionalidades del panel de administración utilizando Driver.js.

## 🚀 Características

- **Tour automático** para nuevos usuarios
- **Tours específicos** para cada sección del panel
- **Interfaz personalizada** con tema Grema
- **Persistencia** - recuerda si el usuario ya completó el tour
- **Responsive** - funciona en dispositivos móviles y desktop
- **Accesible** - con navegación por teclado y lectores de pantalla

## 📱 Componentes Principales

### `useAdminTour` Hook
Hook principal que gestiona toda la funcionalidad del tour:

```typescript
const { 
  startTour,           // Inicia un tour específico
  startFullTour,       // Inicia el tour completo
  hasCompletedTour,    // Verifica si el usuario completó el tour
  resetTour,           // Reinicia el estado del tour
  highlightElement     // Destaca un elemento específico
} = useAdminTour();
```

### `AdminTourButton` Componente
Botón dropdown que permite acceder a diferentes tours:

```tsx
<AdminTourButton 
  currentTab="inventario"  // Pestaña actual para tour específico
  variant="outline"        // Variante del botón
  size="default"          // Tamaño del botón
/>
```

### `AutoTour` Componente
Componente para inicializar tours automáticamente:

```tsx
<AutoTour 
  enabled={true}          // Habilitar tour automático
  delay={2000}           // Retraso antes de iniciar (ms)
  tourType="inventario"  // Tipo de tour a iniciar
/>
```

## 🎯 Tours Disponibles

### Tour Completo
Guía por todas las funcionalidades principales del panel administrativo.

### Tours Específicos por Sección:
1. **Inventario/Dashboard** (`inventario`)
   - Selector de período
   - Tarjetas informativas
   - Gráficos analíticos

2. **Productos** (`productos`)
   - Botón agregar producto
   - Lista de productos
   - Acciones de producto

3. **Gastos** (`gastos`)
   - Registrar gastos
   - Filtros de gastos

4. **Bodegas** (`bodegas`)
   - Gestión de bodegas
   - Agregar bodega

5. **Órdenes** (`ordenes`)
   - Gestión de órdenes
   - Filtros por estado

6. **Descuentos** (`descuentos`)
   - Crear descuentos
   - Gestión de códigos

## 🏷️ Atributos de Tour

Para que los elementos sean incluidos en el tour, deben tener el atributo `data-tour`:

```tsx
// Ejemplos de uso
<div data-tour="dashboard-tabs">...</div>
<button data-tour="add-product-btn">...</button>
<table data-tour="products-table">...</table>
<div data-tour="product-actions">...</div>
```

### Atributos Disponibles:
- `data-tour="dashboard-tabs"` - Pestañas de navegación
- `data-tour="tour-btn"` - Botón de ayuda/tour
- `data-tour="period-selector"` - Selector de período
- `data-tour="info-cards"` - Tarjetas informativas
- `data-tour="charts-section"` - Sección de gráficos
- `data-tour="add-product-btn"` - Botón agregar producto
- `data-tour="products-table"` - Tabla de productos
- `data-tour="product-actions"` - Acciones de producto
- `data-tour="expenses-header"` - Header de gastos
- `data-tour="add-expense-btn"` - Botón agregar gasto
- `data-tour="expenses-filters"` - Filtros de gastos

## 🎨 Personalización

### Estilos CSS
Los estilos están en `src/styles/tour.css` con la clase principal `.driverjs-theme-grema`.

### Configuración del Tour
En `useAdminTour.ts` puedes modificar:
- Textos de los botones
- Posición de los popovers
- Pasos del tour
- Configuración de animaciones

### Ejemplo de personalización:

```typescript
const tourSteps: Record<string, TourStep[]> = {
  miSeccion: [
    {
      element: '[data-tour="mi-elemento"]',
      popover: {
        title: 'Mi Título 🎉',
        description: 'Mi descripción personalizada...',
        position: 'bottom'
      }
    }
  ]
};
```

## 📋 Uso en Componentes

### 1. Integración Básica
```tsx
import { AdminTourButton } from '@/components/admin/common/AdminTourButton';

function MiComponente() {
  return (
    <div>
      <AdminTourButton currentTab="productos" />
      {/* Tu contenido */}
    </div>
  );
}
```

### 2. Tour Automático
```tsx
import { AutoTour } from '@/components/admin/common/AutoTour';

function MiPagina() {
  return (
    <div>
      <AutoTour enabled={true} tourType="productos" />
      {/* Tu contenido */}
    </div>
  );
}
```

### 3. Control Manual
```tsx
import { useAdminTour } from '@/hooks/useAdminTour';

function MiComponente() {
  const { startTour, highlightElement } = useAdminTour();

  const handleHelp = () => {
    startTour('productos');
  };

  const highlightButton = () => {
    highlightElement('[data-tour="add-product-btn"]', {
      title: 'Importante',
      description: 'Haz clic aquí para continuar'
    });
  };

  return (
    <div>
      <button onClick={handleHelp}>Ayuda</button>
      <button onClick={highlightButton}>Destacar</button>
    </div>
  );
}
```

## 🔧 Configuración Avanzada

### LocalStorage
El tour guarda el estado en `localStorage` con la clave `grema-admin-tour-completed`.

### Reiniciar Tour
```typescript
const { resetTour } = useAdminTour();
resetTour(); // Permite volver a ver todos los tours
```

### Tour Condicional
```tsx
const { hasCompletedTour, startTour } = useAdminTour();

useEffect(() => {
  // Solo mostrar tour a usuarios nuevos
  if (!hasCompletedTour() && esUsuarioNuevo) {
    startTour('inventario');
  }
}, []);
```

## 🐛 Resolución de Problemas

### El tour no inicia
- Verifica que los elementos tengan los atributos `data-tour` correctos
- Asegúrate de que los elementos estén renderizados en el DOM
- Revisa la consola por errores

### Elementos no destacados
- Confirma que el selector CSS es correcto
- Verifica que el elemento sea visible en pantalla
- Asegúrate de que no haya z-index conflictivos

### Estilos incorrectos
- Importa `@/styles/tour.css` en tu componente o página principal
- Verifica que los estilos no sean sobrescritos por otros CSS

## 📚 Dependencias

- `driver.js`: ^1.3.6
- `React`: ^18.3.1
- `lucide-react`: Para iconos
- Componentes UI personalizados de Grema

## 🤝 Contribuir

Para agregar nuevos tours o mejorar los existentes:

1. Agrega los pasos en `useAdminTour.ts`
2. Incluye los atributos `data-tour` en los componentes
3. Actualiza la documentación
4. Prueba en diferentes dispositivos

## 📖 Ejemplos Completos

Ver implementación en:
- `src/pages/InventoryPage.tsx` - Integración principal
- `src/components/admin/dashboard/InventoryDashboard.tsx` - Tour de dashboard
- `src/components/admin/inventory/ProductTab.tsx` - Tour de productos
