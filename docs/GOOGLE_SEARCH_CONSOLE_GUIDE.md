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

🚨 **PROBLEMA COMÚN:** La etiqueta no aparece en el código fuente = el sitio NO está desplegado

**SOLUCIÓN INMEDIATA:**
1. ✅ Archivo `vercel.json` ya corregido (error de sintaxis resuelto)
2. ✅ Deploy inmediato requerido:
   ```bash
   git add .
   git commit -m "fix: corregir vercel.json y deploy cambios SEO"
   git push origin main
   ```
3. ✅ Esperar 3-5 minutos después del deploy
4. ✅ Verificar: abre `https://www.grema-store.com` → Ctrl+U → buscar `google-site-verification`
5. ✅ Si aparece la etiqueta → volver a intentar verificación en Search Console
6. ✅ Si NO aparece → usar método de archivo HTML arriba ⬆️

### Paso 3: Configurar el nuevo sitio 🚀 **HACER AHORA**

🎉 **¡VERIFICACIÓN EXITOSA!** Tu dominio está verificado en Google Search Console.

**ACCIÓN INMEDIATA REQUERIDA:**

1. **Enviar Sitemap:** ⚡ **URGENTE**
   - Ve a "Sitemaps" en el menú lateral izquierdo
   - En el campo "Agregar un nuevo sitemap" ingresa: `sitemap.xml`
   - Haz clic en "Enviar"
   - Deberías ver: ✅ Estado: Correcto

2. **Verificar sitemap enviado:**
   - URL completa: `https://www.grema-store.com/sitemap.xml`
   - Estado esperado: "Correcto" o "Procesando"

3. **Configurar dominio preferido:**
   - En "Configuración" → "Configuración del sitio"
   - Confirma que `www.grema-store.com` sea el dominio principal

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
