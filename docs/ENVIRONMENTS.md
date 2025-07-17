# Configuración de Ambientes - Grema Store

Este proyecto está configurado para trabajar con múltiples ambientes: **development**, **staging** y **production**.

## 📋 Ambientes Disponibles

### 🛠️ Development (Desarrollo)
- **Ambiente**: Local de desarrollo
- **API**: `http://localhost:3000/api`
- **URL**: `http://localhost:5173`
- **Características**:
  - Redux DevTools habilitado
  - Logs detallados habilitados
  - Modo debug activado
  - Sin optimización de imágenes
  - Sin analytics

### 🧪 Staging (Pruebas)
- **Ambiente**: Servidor de pruebas
- **API**: `https://api-staging.gremastore.com/api`
- **URL**: `https://staging.gremastore.com`
- **Características**:
  - Redux DevTools habilitado
  - Logs habilitados
  - Optimización de imágenes activada
  - Analytics habilitado
  - Sentry habilitado

### 🚀 Production (Producción)
- **Ambiente**: Servidor de producción
- **API**: `https://api.gremastore.com/api`
- **URL**: `https://gremastore.com`
- **Características**:
  - Redux DevTools deshabilitado
  - Logs deshabilitados
  - Optimización de imágenes activada
  - Analytics habilitado
  - Sentry habilitado

## 🚀 Scripts Disponibles

### Desarrollo
```bash
# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en modo staging
npm run dev:staging
```

### Build
```bash
# Build para producción
npm run build

# Build para desarrollo
npm run build:dev

# Build para staging
npm run build:staging

# Build específico para producción
npm run build:production
```

### Preview
```bash
# Preview del build
npm run preview

# Preview del build de staging
npm run preview:staging

# Preview del build de producción
npm run preview:production
```

## 📁 Archivos de Configuración

### Variables de Ambiente
- `.env.development` - Variables para desarrollo
- `.env.staging` - Variables para staging
- `.env.production` - Variables para producción

### Configuración TypeScript
- `src/config/environment.ts` - Configuración tipada de ambientes

## 🔧 Variables de Ambiente Disponibles

| Variable | Desarrollo | Staging | Producción | Descripción |
|----------|------------|---------|------------|-------------|
| `VITE_APP_ENV` | development | staging | production | Ambiente actual |
| `VITE_API_URL` | http://localhost:3000/api | https://api-staging.gremastore.com/api | https://api.gremastore.com/api | URL de la API |
| `VITE_BASE_URL` | http://localhost:5173 | https://staging.gremastore.com | https://gremastore.com | URL base de la aplicación |
| `VITE_DEBUG_MODE` | true | true | false | Modo debug |
| `VITE_ENABLE_LOGS` | true | true | false | Habilitar logs |
| `VITE_ENABLE_REDUX_DEVTOOLS` | true | true | false | Redux DevTools |
| `VITE_ANALYTICS_ENABLED` | false | true | true | Google Analytics |
| `VITE_SENTRY_ENABLED` | false | true | true | Sentry para errores |
| `VITE_IMAGE_OPTIMIZATION` | false | true | true | Optimización de imágenes |

## 🛠️ Configuración de Desarrollo

### Logger Condicional
```typescript
import { logger } from '@/config/environment';

// Solo se ejecuta si VITE_ENABLE_LOGS=true
logger.log('Información general');
logger.error('Error importante');
logger.warn('Advertencia');
logger.debug('Información de debug'); // Solo si VITE_DEBUG_MODE=true
```

### Verificar Ambiente
```typescript
import { isDevelopment, isStaging, isProduction } from '@/config/environment';

if (isDevelopment()) {
  // Lógica específica para desarrollo
}

if (isProduction()) {
  // Lógica específica para producción
}
```

## 🔄 Flujo de Trabajo Recomendado

1. **Desarrollo Local**: Usar `npm run dev`
2. **Testing**: Deployar a staging con `npm run build:staging`
3. **Producción**: Deployar a producción con `npm run build:production`

## 📝 Notas Importantes

- Las variables de ambiente **DEBEN** comenzar con `VITE_` para ser accesibles en el frontend
- Los archivos `.env.*` están configurados para ser ignorados por Git (excepto `.env.example`)
- La configuración de Redux DevTools solo está habilitada en desarrollo y staging
- Los logs detallados solo están disponibles en desarrollo y staging

## 🔐 Configuración de Producción

Antes del deploy a producción, asegúrate de:

1. ✅ Configurar URLs correctas de API
2. ✅ Configurar Google Analytics ID
3. ✅ Configurar Sentry DSN
4. ✅ Configurar CDN URLs para imágenes
5. ✅ Deshabilitar logs y debug mode
6. ✅ Configurar certificados SSL

## 🐛 Debugging

Para debugear problemas relacionados con ambientes:

```typescript
import { config } from '@/config/environment';
console.log('Current environment config:', config);
```
