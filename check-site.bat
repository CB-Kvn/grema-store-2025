@echo off
echo 🔍 Verificando estado del sitio Grema Store...
echo.

echo ✅ Verificando si el sitio responde...
curl -s -o nul -w "Status: %%{http_code}\n" https://www.grema-store.com/

echo.
echo ✅ Verificando etiqueta meta de verificación...
curl -s https://www.grema-store.com/ | findstr "google-site-verification" > nul
if %errorlevel% == 0 (
    echo ✅ Etiqueta meta encontrada
    curl -s https://www.grema-store.com/ | findstr "google-site-verification"
) else (
    echo ❌ Etiqueta meta NO encontrada
    echo 💡 Necesitas hacer deploy de los cambios
)

echo.
echo ✅ Verificando robots.txt...
curl -s -o nul -w "Status: %%{http_code}\n" https://www.grema-store.com/robots.txt

echo.
echo ✅ Verificando sitemap.xml...
curl -s -o nul -w "Status: %%{http_code}\n" https://www.grema-store.com/sitemap.xml

echo.
echo 📋 Si la etiqueta meta NO aparece:
echo 1. Haz push de los cambios: git push origin main
echo 2. Espera 2-3 minutos
echo 3. Ejecuta este script otra vez
echo.
echo 📋 Si la etiqueta meta SÍ aparece:
echo 1. Espera 5-10 minutos
echo 2. Intenta verificar en Google Search Console otra vez
echo 3. Si no funciona, usa el método de archivo HTML
pause
