# 📊 Guía Google Search Console - Grema Store

## 🎯 Pasos para actualizar Google Search Console:

### Paso 1: Agregar la nueva propiedad
1. Ve a [Google Search Console](https://search.google.com/search-console/)
2. Haz clic en "Agregar propiedad"
3. Selecciona "Prefijo de URL"
4. Ingresa: `https://www.grema-store.com`
5. Haz clic en "Continuar"

### Paso 2: Verificar la propiedad
**Método recomendado: Archivo HTML**
1. Descarga el archivo de verificación que Google te proporcione
2. Súbelo a la carpeta `public/` de tu proyecto
3. Asegúrate de que sea accesible en: `https://www.grema-store.com/google[código].html`
4. Haz clic en "Verificar"

**Método alternativo: Meta tag HTML**
1. Copia el meta tag que Google te proporcione
2. Agrégalo al archivo `index.html` en la sección `<head>`
3. Ejemplo: `<meta name="google-site-verification" content="tu-codigo-aqui" />`

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
