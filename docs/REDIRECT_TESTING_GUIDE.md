# 🔗 Test de Redirecciones - Grema Store

## URLs a probar después del deploy:

### ✅ Redirecciones de dominio:
```bash
# Estas deberían redirigir a https://www.grema-store.com/
curl -I https://gremastore.com/
curl -I https://grema-store.com/
curl -I http://www.grema-store.com/
curl -I http://grema-store.com/
```

### ✅ Redirección de index.html:
```bash
# Esto debería redirigir a https://www.grema-store.com/
curl -I https://www.grema-store.com/index.html
```

### ✅ Páginas principales:
```bash
# Verificar que estas páginas carguen correctamente
curl -I https://www.grema-store.com/
curl -I https://www.grema-store.com/tienda
curl -I https://www.grema-store.com/nosotros
curl -I https://www.grema-store.com/contacto
```

### ✅ Archivos SEO:
```bash
# Verificar sitemap y robots.txt
curl -I https://www.grema-store.com/sitemap.xml
curl -I https://www.grema-store.com/robots.txt
```

## 🌐 Herramientas online para probar:

1. **Redirect Checker:**
   - https://www.redirect-checker.org/
   - Ingresa: `https://gremastore.com`
   - Debería mostrar redirección 301 → `https://www.grema-store.com`

2. **HTTP Status Checker:**
   - https://httpstatus.io/
   - Verifica que todas las páginas retornen 200 OK

3. **Sitemap Tester:**
   - https://www.xml-sitemaps.com/validate-xml-sitemap.html
   - Ingresa: `https://www.grema-store.com/sitemap.xml`

## 📋 Checklist post-deploy:

- [ ] Dominio principal (www.grema-store.com) carga correctamente
- [ ] Redirecciones 301 funcionan desde dominios antiguos
- [ ] index.html redirige a la raíz
- [ ] Sitemap es accesible y válido
- [ ] Robots.txt apunta al sitemap correcto
- [ ] Meta tags muestran el dominio correcto
- [ ] Open Graph tags usan URLs correctas
- [ ] Schema.org JSON-LD tiene URLs actualizadas

## 🚨 Si hay problemas:

### Vercel:
- Revisa el archivo `vercel.json`
- Ve a Vercel Dashboard → Functions → View Function Logs

### Netlify:
- Revisa el archivo `public/_redirects`
- Ve a Netlify Dashboard → Site Settings → Build & Deploy

### Otros hostings:
- Configura redirecciones 301 en el panel de control
- Asegúrate de que el dominio www esté configurado
