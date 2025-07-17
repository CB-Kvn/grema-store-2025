# 📊 Guía Google Search Console - Grema Store

## 🎯 Pasos para actualizar Google Search Console:

### Paso 1: Agregar la nueva propiedad
1. Ve a [Google Search Console](https://search.google.com/search-console/)
2. Haz clic en "Agregar propiedad"
3. Selecciona "Prefijo de URL"
4. Ingresa: `https://www.grema-store.com`
5. Haz clic en "Continuar"

### Paso 2: Verificar la propiedad

⚠️ **PROBLEMA COMÚN:** Si Google no encuentra la etiqueta meta, usa el método de archivo HTML.

**Método RECOMENDADO: Archivo HTML** ✅
1. En Google Search Console, selecciona "Archivo HTML"
2. Descarga el archivo de verificación (ej: `googleXXXXXXXX.html`)
3. Coloca el archivo en la carpeta `public/` de tu proyecto
4. Asegúrate de que sea accesible en: `https://www.grema-store.com/googleXXXXXXXX.html`
5. Haz deploy de los cambios
6. Regresa a Search Console y haz clic en "Verificar"

**Método alternativo: Meta tag HTML** (si ya tienes la etiqueta)
Si ya agregaste la etiqueta meta pero Google no la encuentra:
1. Verifica que el sitio esté desplegado correctamente
2. Abre `https://www.grema-store.com` en tu navegador
3. Ve el código fuente (Ctrl+U) y busca: `google-site-verification`
4. Si la etiqueta está presente, espera unos minutos y vuelve a intentar
5. Si no funciona, usa el método de archivo HTML arriba ⬆️

### Paso 3: Configurar el nuevo sitio
Una vez verificado:

1. **Enviar Sitemap:**
   - Ve a "Sitemaps" en el menú lateral
   - Agrega: `https://www.grema-store.com/sitemap.xml`
   - Haz clic en "Enviar"

2. **Configurar dominio preferido:**
   - En la configuración, establece `www.grema-store.com` como dominio principal

### Paso 4: Migrar datos del dominio anterior
Si tenías `gremastore.com` o `grema-store.com` en Search Console:

1. **Cambio de dirección:**
   - Ve a la propiedad antigua en Search Console
   - Configuración → Cambio de dirección
   - Selecciona la nueva propiedad como destino
   - Confirma el cambio

2. **Solicitar re-indexación:**
   - Ve a "Inspección de URLs"
   - Ingresa URLs importantes una por una
   - Haz clic en "Solicitar indexación"

### Paso 5: URLs prioritarias para re-indexar
```
https://www.grema-store.com/
https://www.grema-store.com/tienda
https://www.grema-store.com/nosotros
https://www.grema-store.com/contacto
https://www.grema-store.com/historia
https://www.grema-store.com/valores
```

### Paso 6: Monitorear durante 2-4 semanas
- Revisa "Cobertura" para errores de indexación
- Monitorea "Rendimiento" para cambios en tráfico
- Verifica que las redirecciones aparezcan en "Rastreo"

## ⚠️ Notas importantes:
- La migración completa puede tomar 2-4 semanas
- Es normal ver una caída temporal en rankings
- Mantén ambas propiedades activas durante la transición
- Las redirecciones 301 pasarán el 90-95% del "link juice"
