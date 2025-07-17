# Script de verificación de dominio - Grema Store
# Verificar que todas las URLs estén configuradas correctamente

Write-Host "🔍 Verificando configuración de dominio..." -ForegroundColor Cyan

# Verificar archivos principales
$files = @(
    "src\utils\seo.ts",
    "src\config\seo.ts", 
    "index.html",
    "public\robots.txt",
    "public\sitemap.xml",
    "public\_redirects",
    "vercel.json"
)

$expectedDomain = "https://www.grema-store.com"
$issues = @()

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Buscar dominios incorrectos
        if ($content -match "https://gremastore\.com") {
            $issues += "❌ $file contiene 'gremastore.com' (sin guiones)"
        }
        if ($content -match "https://grema-store\.com(?!//)") {
            $issues += "⚠️  $file contiene 'grema-store.com' (sin www)"
        }
        if ($content -match $expectedDomain) {
            Write-Host "✅ $file - Dominio correcto configurado" -ForegroundColor Green
        }
    } else {
        $issues += "❌ Archivo no encontrado: $file"
    }
}

if ($issues.Count -eq 0) {
    Write-Host "`n🎉 ¡Configuración de dominio correcta!" -ForegroundColor Green
    Write-Host "Todos los archivos usan: $expectedDomain" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Problemas encontrados:" -ForegroundColor Yellow
    foreach ($issue in $issues) {
        Write-Host $issue -ForegroundColor Red
    }
}

Write-Host "`n📋 Archivos de configuración creados:" -ForegroundColor Cyan
Write-Host "- vercel.json (redirecciones para Vercel)" -ForegroundColor White
Write-Host "- public\_redirects (redirecciones para Netlify)" -ForegroundColor White
Write-Host "- Sitemap y robots.txt actualizados" -ForegroundColor White
