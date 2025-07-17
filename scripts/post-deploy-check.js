#!/usr/bin/env node

/**
 * Script de verificación post-deploy para Grema Store
 * Verifica que todas las redirecciones y URLs funcionen correctamente
 */

const https = require('https');
const http = require('http');

const EXPECTED_DOMAIN = 'https://www.grema-store.com';
const TIMEOUT = 10000;

// URLs a verificar
const redirectTests = [
  { from: 'https://gremastore.com/', to: EXPECTED_DOMAIN + '/' },
  { from: 'https://grema-store.com/', to: EXPECTED_DOMAIN + '/' },
  { from: EXPECTED_DOMAIN + '/index.html', to: EXPECTED_DOMAIN + '/' }
];

const pageTests = [
  EXPECTED_DOMAIN + '/',
  EXPECTED_DOMAIN + '/tienda',
  EXPECTED_DOMAIN + '/nosotros',
  EXPECTED_DOMAIN + '/contacto',
  EXPECTED_DOMAIN + '/sitemap.xml',
  EXPECTED_DOMAIN + '/robots.txt'
];

function checkRedirect(test) {
  return new Promise((resolve) => {
    const url = new URL(test.from);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'HEAD',
      timeout: TIMEOUT
    };

    const request = (url.protocol === 'https:' ? https : http).request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400) {
        const location = res.headers.location;
        if (location && location.startsWith(test.to)) {
          resolve({ success: true, status: res.statusCode, location });
        } else {
          resolve({ success: false, status: res.statusCode, location, expected: test.to });
        }
      } else {
        resolve({ success: false, status: res.statusCode, message: 'No redirect found' });
      }
    });

    request.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });

    request.on('timeout', () => {
      resolve({ success: false, error: 'Timeout' });
    });

    request.end();
  });
}

function checkPage(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'HEAD',
      timeout: TIMEOUT
    };

    const request = (urlObj.protocol === 'https:' ? https : http).request(options, (res) => {
      resolve({ 
        success: res.statusCode === 200, 
        status: res.statusCode,
        contentType: res.headers['content-type']
      });
    });

    request.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });

    request.on('timeout', () => {
      resolve({ success: false, error: 'Timeout' });
    });

    request.end();
  });
}

async function runTests() {
  console.log('🔍 Iniciando verificación post-deploy de Grema Store...\n');

  // Test redirecciones
  console.log('📋 Verificando redirecciones...');
  for (const test of redirectTests) {
    const result = await checkRedirect(test);
    if (result.success) {
      console.log(`✅ ${test.from} → ${result.location} (${result.status})`);
    } else {
      console.log(`❌ ${test.from} → Error: ${result.error || result.message} (${result.status})`);
      if (result.location) {
        console.log(`   Redirección encontrada: ${result.location}, esperada: ${test.to}`);
      }
    }
  }

  console.log('\n📋 Verificando páginas...');
  // Test páginas
  for (const url of pageTests) {
    const result = await checkPage(url);
    if (result.success) {
      console.log(`✅ ${url} (${result.status})`);
    } else {
      console.log(`❌ ${url} → Error: ${result.error || 'HTTP ' + result.status}`);
    }
  }

  console.log('\n🎉 Verificación completada!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Agregar nueva propiedad en Google Search Console');
  console.log('2. Enviar sitemap: https://www.grema-store.com/sitemap.xml');
  console.log('3. Solicitar re-indexación de páginas principales');
  console.log('4. Monitorear durante 2-4 semanas');
}

runTests().catch(console.error);
