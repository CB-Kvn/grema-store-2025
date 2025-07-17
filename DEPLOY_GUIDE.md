# 🚀 Guía de Deploy - Grema Store

## ✅ Cambios realizados:
- ✅ Dominio unificado a: https://www.grema-store.com
- ✅ Todas las referencias de "joyería" cambiadas a "bisutería"
- ✅ SEO actualizado en todos los archivos
- ✅ Redirecciones configuradas
- ✅ Sitemap y robots.txt actualizados

## 📋 Deploy Instructions:

### Si usas Vercel:
```bash
# 1. Hacer commit de los cambios
git add .
git commit -m "feat: unificar dominio a www.grema-store.com y cambiar joyería por bisutería"

# 2. Push a la rama principal
git push origin main

# 3. El deploy será automático en Vercel
```

### Si usas Netlify:
```bash
# 1. Hacer commit de los cambios
git add .
git commit -m "feat: unificar dominio a www.grema-store.com y cambiar joyería por bisutería"

# 2. Push a la rama principal
git push origin main

# 3. El deploy será automático en Netlify
```

### Si usas otro hosting:
1. Sube todos los archivos modificados
2. Asegúrate de que el archivo `_redirects` esté en el directorio público
3. Configura las redirecciones según tu proveedor

## 🔗 Archivos modificados importantes:
- `vercel.json` - Redirecciones para Vercel
- `public/_redirects` - Redirecciones para Netlify  
- `public/sitemap.xml` - URLs actualizadas
- `public/robots.txt` - Sitemap URL actualizada
- `index.html` - Meta tags principales
- `src/utils/seo.ts` - Configuración SEO principal
- `src/config/seo.ts` - Configuración de dominio

## ⚠️ IMPORTANTE:
Después del deploy, verifica que las redirecciones funcionen:
- https://gremastore.com → https://www.grema-store.com ✅
- https://grema-store.com → https://www.grema-store.com ✅
- https://www.grema-store.com/index.html → https://www.grema-store.com/ ✅
