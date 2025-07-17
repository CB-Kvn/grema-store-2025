# 🎯 PLAN DE ACCIÓN COMPLETO - Grema Store

## ✅ CAMBIOS YA REALIZADOS:

### 1. Actualización de contenido (COMPLETADO ✅)
- ✅ Cambiado "joyería" → "bisutería" en todo el sitio
- ✅ Actualizado SEO en 13+ archivos
- ✅ Meta tags, títulos y descripciones actualizados
- ✅ Keywords optimizadas para bisutería

### 2. Unificación de dominio (COMPLETADO ✅)
- ✅ Dominio estándar: `https://www.grema-store.com`
- ✅ Configuradas redirecciones 301 automáticas
- ✅ Sitemap y robots.txt actualizados
- ✅ Schema.org y Open Graph corregidos

## 🚀 PRÓXIMOS PASOS - ACCIÓN REQUERIDA:

### PASO 1: DEPLOY INMEDIATO (15 minutos)
```bash
# Ejecutar en terminal/Git Bash:
git add .
git commit -m "feat: unificar dominio a www.grema-store.com y cambiar joyería por bisutería"
git push origin main
```

**¿Dónde está hosteado tu sitio?**
- [ ] Vercel (deploy automático)
- [ ] Netlify (deploy automático)  
- [ ] Otro: _____________

### PASO 2: VERIFICAR REDIRECCIONES (5 minutos)
Después del deploy, ejecutar:
```bash
npm run post-deploy
```

O verificar manualmente en:
- https://www.redirect-checker.org/
- Ingresar: `https://gremastore.com`
- Debe redirigir a: `https://www.grema-store.com`

### PASO 3: GOOGLE SEARCH CONSOLE (20 minutos)

#### 3A. Agregar nueva propiedad:
1. Ir a: https://search.google.com/search-console/
2. "Agregar propiedad" → "Prefijo de URL" 
3. Ingresar: `https://www.grema-store.com`
4. Verificar con archivo HTML o meta tag

#### 3B. Enviar sitemap:
1. En Search Console → "Sitemaps"
2. Agregar: `https://www.grema-store.com/sitemap.xml`
3. Hacer clic en "Enviar"

#### 3C. Solicitar re-indexación:
Páginas prioritarias (una por una):
```
https://www.grema-store.com/
https://www.grema-store.com/tienda
https://www.grema-store.com/nosotros
https://www.grema-store.com/contacto
```

### PASO 4: MIGRACIÓN DE DATOS (10 minutos)
Si tenías el dominio anterior en Search Console:
1. Propiedad antigua → "Configuración" → "Cambio de dirección"
2. Seleccionar nueva propiedad como destino
3. Confirmar migración

## 📋 CHECKLIST DE VERIFICACIÓN:

### Inmediato (después del deploy):
- [ ] Sitio carga en: https://www.grema-store.com
- [ ] Redirecciones funcionan desde dominios antiguos
- [ ] /index.html redirige a /
- [ ] Sitemap accesible: /sitemap.xml
- [ ] Robots.txt correcto: /robots.txt

### Google Search Console:
- [ ] Nueva propiedad agregada y verificada
- [ ] Sitemap enviado
- [ ] Re-indexación solicitada para páginas principales
- [ ] Migración de datos configurada (si aplica)

### Monitoreo (próximas 2-4 semanas):
- [ ] Revisar "Cobertura" en Search Console
- [ ] Monitorear "Rendimiento" para cambios
- [ ] Verificar indexación de nuevas URLs
- [ ] Comprobar que redirecciones aparecen en "Rastreo"

## 🆘 SOPORTE TÉCNICO:

### Si hay problemas con redirecciones:
- Revisar archivos: `vercel.json` o `public/_redirects`
- Contactar soporte del hosting provider

### Si hay problemas con indexación:
- Usar "Inspección de URLs" en Search Console
- Verificar que robots.txt no bloquee URLs importantes
- Revisar errores en "Cobertura"

### Herramientas útiles:
- **Scripts del proyecto:**
  - `npm run post-deploy` - Verificar redirecciones
  - `npm run verify:domain` - Verificar configuración
  
- **Herramientas online:**
  - https://www.redirect-checker.org/
  - https://httpstatus.io/
  - https://www.xml-sitemaps.com/validate-xml-sitemap.html

## 📊 RESULTADOS ESPERADOS:

### Inmediato (1-3 días):
- URLs limpias sin /index.html
- Redirecciones funcionando
- Nuevo dominio en Search Console

### Corto plazo (1-2 semanas):
- Indexación de nuevas URLs
- Aparición de redirecciones en Search Console
- Posible caída temporal en rankings (normal)

### Mediano plazo (2-4 semanas):
- Recuperación completa de rankings
- Indexación completa del nuevo dominio
- Mejora en CTR por URLs más limpias

## ⚠️ NOTAS IMPORTANTES:
- **No eliminar** dominios antiguos de Search Console hasta confirmar migración
- **Es normal** ver caída temporal en tráfico durante migración
- **Las redirecciones 301** pasan 90-95% del valor SEO
- **Monitorear closely** durante las primeras 4 semanas

---

**🎯 ACCIÓN INMEDIATA REQUERIDA:** 
1. Deploy de los cambios
2. Verificar redirecciones  
3. Configurar Google Search Console

**Tiempo estimado total: 50 minutos**
