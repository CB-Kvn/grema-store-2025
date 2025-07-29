import { lazy } from 'react';

// Lazy loading de componentes pesados para reducir el bundle inicial
export const LazyComponents = {
  // Componentes de administración (solo cargar cuando sea necesario)
  AdminDashboard: lazy(() => import('@/components/admin/AdminDashboard')),
  InventoryPage: lazy(() => import('@/pages/InventoryPage')),
  OrderDocumentsPage: lazy(() => import('@/pages/OrderDocumentsPage')),
  OrderTrackingPage: lazy(() => import('@/pages/OrderTrackingPage')),
  
  // Componentes de gráficos (cargar solo cuando se necesiten)
  ChartComponents: lazy(() => import('@/components/admin/charts/ChartComponents')),
  
  // Componentes de formularios pesados
  ProductForm: lazy(() => import('@/components/admin/ProductForm')),
  
  // Componentes de mapas (muy pesados)
  GoogleMaps: lazy(() => import('@/components/common/GoogleMaps')),
  
  // Componentes de terceros pesados
  DatePicker: lazy(() => import('react-datepicker')),
  Dropzone: lazy(() => import('react-dropzone')),
  
  // Componentes de tour/onboarding
  TourComponent: lazy(() => import('@/components/common/TourComponent')),
  
  // Componentes de autenticación OAuth
  GoogleOAuth: lazy(() => import('@react-oauth/google').then(module => ({ default: module.GoogleOAuthProvider }))),
};

// Preload functions para componentes críticos
export const preloadComponent = (componentName: keyof typeof LazyComponents) => {
  return LazyComponents[componentName];
};

// Función para precargar componentes en idle time
export const preloadOnIdle = (componentNames: (keyof typeof LazyComponents)[]) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      componentNames.forEach(name => {
        LazyComponents[name];
      });
    });
  } else {
    // Fallback para navegadores que no soportan requestIdleCallback
    setTimeout(() => {
      componentNames.forEach(name => {
        LazyComponents[name];
      });
    }, 2000);
  }
};