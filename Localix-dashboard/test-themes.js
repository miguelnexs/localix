// Script de prueba para verificar que los temas funcionen correctamente
console.log('🎨 Probando sistema de temas...');

// Función para verificar que las variables CSS se apliquen correctamente
function testThemeApplication() {
  const root = document.documentElement;
  const themes = ['light', 'dark', 'blue'];
  
  console.log('📋 Temas disponibles:', themes);
  
  themes.forEach(theme => {
    console.log(`\n🔍 Probando tema: ${theme}`);
    
    // Aplicar tema
    root.setAttribute('data-theme', theme);
    
    // Verificar que el atributo se aplicó
    const appliedTheme = root.getAttribute('data-theme');
    console.log(`  ✅ Atributo data-theme: ${appliedTheme}`);
    
    // Verificar variables CSS
    const primaryColor = getComputedStyle(root).getPropertyValue('--color-primary');
    const backgroundColor = getComputedStyle(root).getPropertyValue('--color-background');
    
    console.log(`  🎨 Color primario: ${primaryColor}`);
    console.log(`  🎨 Color de fondo: ${backgroundColor}`);
    
    // Verificar que los colores no estén vacíos
    if (primaryColor && backgroundColor) {
      console.log(`  ✅ Variables CSS aplicadas correctamente`);
    } else {
      console.log(`  ❌ Error: Variables CSS no aplicadas`);
    }
  });
  
  // Restaurar tema por defecto
  root.setAttribute('data-theme', 'light');
  console.log('\n🔄 Tema restaurado a: light');
}

// Función para verificar que las clases CSS funcionen
function testThemeClasses() {
  console.log('\n🧪 Probando clases CSS de tema...');
  
  // Crear elementos de prueba
  const testContainer = document.createElement('div');
  testContainer.innerHTML = `
    <div class="bg-theme-primary p-4 m-2 rounded">Fondo Primario</div>
    <div class="bg-theme-secondary p-4 m-2 rounded">Fondo Secundario</div>
    <div class="text-theme-text p-4 m-2">Texto Principal</div>
    <div class="text-theme-textSecondary p-4 m-2">Texto Secundario</div>
    <div class="border-theme-border p-4 m-2 border rounded">Borde del Tema</div>
  `;
  
  // Agregar al DOM temporalmente
  document.body.appendChild(testContainer);
  
  // Verificar estilos aplicados
  const elements = testContainer.querySelectorAll('div');
  elements.forEach((el, index) => {
    const styles = getComputedStyle(el);
    console.log(`  Elemento ${index + 1}:`, {
      backgroundColor: styles.backgroundColor,
      color: styles.color,
      borderColor: styles.borderColor
    });
  });
  
  // Limpiar
  document.body.removeChild(testContainer);
  console.log('  ✅ Prueba de clases completada');
}

// Función para verificar localStorage
function testLocalStorage() {
  console.log('\n💾 Probando localStorage...');
  
  try {
    // Guardar configuración de prueba
    const testSettings = {
      theme: 'blue',
      sidebarCollapsed: false,
      notifications: true,
      animations: true,
      compactMode: false
    };
    
    localStorage.setItem('localix-settings', JSON.stringify(testSettings));
    console.log('  ✅ Configuración guardada en localStorage');
    
    // Leer configuración
    const savedSettings = localStorage.getItem('localix-settings');
    const parsedSettings = JSON.parse(savedSettings);
    console.log('  📖 Configuración leída:', parsedSettings);
    
    // Limpiar
    localStorage.removeItem('localix-settings');
    console.log('  🧹 Configuración de prueba eliminada');
    
  } catch (error) {
    console.error('  ❌ Error con localStorage:', error);
  }
}

// Ejecutar pruebas cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM cargado, ejecutando pruebas...');
    testThemeApplication();
    testThemeClasses();
    testLocalStorage();
    console.log('\n🎉 Pruebas completadas!');
  });
} else {
  console.log('🚀 DOM ya cargado, ejecutando pruebas...');
  testThemeApplication();
  testThemeClasses();
  testLocalStorage();
  console.log('\n🎉 Pruebas completadas!');
}

// Exportar funciones para uso manual
window.testThemes = {
  testThemeApplication,
  testThemeClasses,
  testLocalStorage
};

console.log('💡 Usa window.testThemes para ejecutar pruebas manualmente');
