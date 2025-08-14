#!/usr/bin/env node

/**
 * Script para actualizar automáticamente los temas en las páginas
 * Uso: node update-themes.js
 */

const fs = require('fs');
const path = require('path');

// Mapeo de clases de Tailwind a clases de tema
const themeClassMap = {
  // Fondos
  'bg-white': 'bg-theme-surface',
  'bg-gray-50': 'bg-theme-background',
  'bg-gray-100': 'bg-theme-secondary',
  'bg-gray-200': 'bg-theme-border',
  
  // Textos
  'text-gray-900': 'text-theme-text',
  'text-gray-800': 'text-theme-text',
  'text-gray-700': 'text-theme-textSecondary',
  'text-gray-600': 'text-theme-textSecondary',
  'text-gray-500': 'text-theme-textSecondary',
  'text-gray-400': 'text-theme-textSecondary',
  'text-gray-300': 'text-theme-textSecondary',
  
  // Bordes
  'border-gray-200': 'border-theme-border',
  'border-gray-300': 'border-theme-border',
  'border-gray-400': 'border-theme-border',
  'border-gray-500': 'border-theme-border',
  
  // Hover states
  'hover:bg-gray-50': 'hover:bg-theme-secondary',
  'hover:bg-gray-100': 'hover:bg-theme-secondary',
  'hover:text-gray-900': 'hover:text-theme-text',
  'hover:text-gray-700': 'hover:text-theme-textSecondary',
  
  // Dividers
  'divide-gray-200': 'divide-theme-border',
  'divide-gray-300': 'divide-theme-border',
};

/**
 * Aplica el mapeo de clases a un archivo
 */
function updateFileTheme(filePath) {
  try {
    console.log(`📝 Actualizando: ${filePath}`);
    
    // Leer archivo
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Aplicar mapeo de clases
    Object.entries(themeClassMap).forEach(([oldClass, newClass]) => {
      const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
      content = content.replace(regex, newClass);
    });
    
    // Verificar si hubo cambios
    if (content !== originalContent) {
      // Crear backup
      const backupPath = filePath + '.backup';
      fs.writeFileSync(backupPath, originalContent);
      console.log(`  💾 Backup creado: ${backupPath}`);
      
      // Escribir archivo actualizado
      fs.writeFileSync(filePath, content);
      console.log(`  ✅ Actualizado exitosamente`);
      
      // Contar cambios
      const changes = Object.entries(themeClassMap).reduce((count, [oldClass, newClass]) => {
        const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
        const matches = (originalContent.match(regex) || []).length;
        return count + matches;
      }, 0);
      
      console.log(`  📊 ${changes} clases actualizadas`);
    } else {
      console.log(`  ⏭️  Sin cambios necesarios`);
    }
    
  } catch (error) {
    console.error(`  ❌ Error actualizando ${filePath}:`, error.message);
  }
}

/**
 * Busca archivos recursivamente
 */
function findFiles(dir, pattern) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (pattern.test(item)) {
        files.push(fullPath);
      }
    });
  }
  
  traverse(dir);
  return files;
}

/**
 * Función principal
 */
function main() {
  console.log('🎨 Iniciando actualización automática de temas...\n');
  
  const srcDir = path.join(__dirname, 'src', 'renderer', 'src');
  
  // Archivos específicos a actualizar
  const specificFiles = [
    'pages/DashboardPage.jsx',
    'pages/ProductsPage.jsx',
    'pages/OrdersPage.jsx',
    'pages/CustomerPage.jsx',
    'pages/CategoriesPage.jsx',
    'pages/VentasPage.jsx',
    'pages/ProductFormPage.jsx',
    'pages/HelpPage.jsx',
    'components/CustomerModal.jsx',
    'components/ColorSelector.jsx',
    'components/ProductDialog/index.jsx',
    'components/ProductForm.jsx',
    'components/ProductList.jsx',
    'components/OrderModal.jsx',
    'components/ventas/CartItem.jsx',
    'components/ventas/CartSummary.jsx'
  ];
  
  // Actualizar archivos específicos
  console.log('📁 Actualizando archivos específicos:');
  specificFiles.forEach(relativePath => {
    const fullPath = path.join(srcDir, relativePath);
    if (fs.existsSync(fullPath)) {
      updateFileTheme(fullPath);
    } else {
      console.log(`⚠️  Archivo no encontrado: ${relativePath}`);
    }
  });
  
  // Buscar otros archivos JSX que puedan necesitar actualización
  console.log('\n🔍 Buscando otros archivos JSX...');
  const jsxFiles = findFiles(srcDir, /\.jsx$/);
  
  const updatedFiles = new Set(specificFiles.map(f => path.join(srcDir, f)));
  
  jsxFiles.forEach(filePath => {
    if (!updatedFiles.has(filePath)) {
      const relativePath = path.relative(srcDir, filePath);
      console.log(`📄 Encontrado: ${relativePath}`);
      
      // Verificar si el archivo contiene clases que necesitan actualización
      const content = fs.readFileSync(filePath, 'utf8');
      const needsUpdate = Object.keys(themeClassMap).some(oldClass => 
        new RegExp(`\\b${oldClass}\\b`).test(content)
      );
      
      if (needsUpdate) {
        console.log(`  🔧 Contiene clases que necesitan actualización`);
        updateFileTheme(filePath);
      } else {
        console.log(`  ✅ Ya está actualizado`);
      }
    }
  });
  
  console.log('\n🎉 Actualización completada!');
  console.log('\n📋 Resumen:');
  console.log('- Se actualizaron las clases de Tailwind a clases de tema');
  console.log('- Se crearon backups de los archivos originales');
  console.log('- Los cambios se aplican automáticamente al cambiar temas');
  console.log('\n💡 Próximos pasos:');
  console.log('1. Revisa los archivos actualizados');
  console.log('2. Prueba los diferentes temas en la aplicación');
  console.log('3. Si hay problemas, puedes restaurar desde los archivos .backup');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = {
  themeClassMap,
  updateFileTheme,
  findFiles
};
