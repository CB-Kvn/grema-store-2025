# 🔧 Configuración de Dominios en Vercel - Grema Store

## ⚠️ IMPORTANTE: 
Las redirecciones de dominio en Vercel se configuran desde el panel de control, NO desde vercel.json

## 📋 PASOS PARA CONFIGURAR DOMINIOS EN VERCEL:

### Paso 1: Acceder al panel de Vercel
1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto: `grema-store-2025`
3. Ve a la pestaña "Settings"
4. Selecciona "Domains" en el menú lateral

### Paso 2: Configurar dominio principal
1. Agrega el dominio principal: `www.grema-store.com`
2. Vercel te dará instrucciones de DNS
3. Configura los registros DNS según las instrucciones

### Paso 3: Configurar redirecciones automáticas
1. Agrega dominios adicionales:
   - `grema-store.com` (sin www)
   - `gremastore.com` (dominio anterior)
   
2. Para cada dominio adicional:
   - Haz clic en "Edit"
   - Selecciona "Redirect to www.grema-store.com"
   - Marca "Permanent (301)"

### Paso 4: Configuración DNS requerida

**Para el dominio principal (www.grema-store.com):**
```
Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com
```

**Para redirecciones (grema-store.com, gremastore.com):**
```
Tipo: A
Nombre: @
Valor: 76.76.19.61

Tipo: A  
Nombre: @
Valor: 76.76.21.61
```

## 🎯 CONFIGURACIÓN VERCEL.JSON CORREGIDA:

El archivo `vercel.json` ahora solo contiene redirecciones internas:

```json
{
  "redirects": [
    {
      "source": "/index.html",
      "destination": "/",
      "permanent": true
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## ✅ DEPLOY AHORA:

1. Los cambios ya están listos
2. Haz deploy:
   ```bash
   git add .
   git commit -m "fix: corregir configuración vercel.json"
   git push origin main
   ```

3. Una vez desplegado, configura los dominios en el panel de Vercel

## 🔍 VERIFICACIÓN POST-DEPLOY:

Después de 3-5 minutos del deploy:
1. Ve a: https://www.grema-store.com
2. Presiona Ctrl+U para ver código fuente
3. Busca: `google-site-verification`
4. Si aparece ✅ → verifica en Google Search Console
5. Si NO aparece ❌ → espera unos minutos más

## 📞 SOPORTE:

Si tienes problemas:
1. Revisa el log de deploy en Vercel
2. Verifica que los DNS estén configurados correctamente
3. Usa el método de archivo HTML para verificación en Search Console
