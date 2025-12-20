#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(70));
console.log('📊 STATUS DO TESTE DE PERFORMANCE - RELATÓRIO HTML');
console.log('='.repeat(70) + '\n');

const reportPath = path.join(__dirname, 'test-report.html');
const jsonPath = path.join(__dirname, 'test-results.json');

// Verificar se o relatório HTML existe
console.log('📁 RELATÓRIO HTML:');
if (fs.existsSync(reportPath)) {
  const stats = fs.statSync(reportPath);
  const size = (stats.size / 1024).toFixed(2);
  const modified = new Date(stats.mtime).toLocaleString('pt-BR');
  
  console.log('   ✅ Relatório disponível');
  console.log(`   📍 ${reportPath}`);
  console.log(`   📏 Tamanho: ${size} KB`);
  console.log(`   🕐 Modificado: ${modified}`);
} else {
  console.log('   ❌ Relatório não encontrado');
}

console.log('\n📊 DADOS JSON:');
if (fs.existsSync(jsonPath)) {
  const stats = fs.statSync(jsonPath);
  const size = (stats.size / 1024).toFixed(2);
  const modified = new Date(stats.mtime).toLocaleString('pt-BR');
  
  console.log('   ✅ Dados disponíveis');
  console.log(`   📍 ${jsonPath}`);
  console.log(`   📏 Tamanho: ${size} KB`);
  console.log(`   🕐 Modificado: ${modified}`);
} else {
  console.log('   ❌ Dados JSON não encontrados');
}

console.log('\n🚀 PRÓXIMOS PASSOS:');
console.log('   1. Executar teste:');
console.log('      Windows: test\\k6\\run-test.bat');
console.log('      Linux/Mac: ./test/k6/run-test.sh');
console.log('');
console.log('   2. Abrir relatório em navegador:');
if (process.platform === 'win32') {
  console.log(`      start "${reportPath}"`);
} else if (process.platform === 'darwin') {
  console.log(`      open "${reportPath}"`);
} else {
  console.log(`      xdg-open "${reportPath}"`);
}

console.log('\n' + '='.repeat(70) + '\n');
