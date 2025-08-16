// Script para limpiar tokens y reiniciar la aplicación
// Ejecuta este código en la consola del navegador (F12)

console.log('🔧 Limpiando tokens y reiniciando aplicación...');

// Limpiar todos los tokens
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');

// Limpiar cualquier otro token relacionado
const keys = Object.keys(localStorage);
keys.forEach(key => {
  if (key.includes('token') || key.includes('auth') || key.includes('user')) {
    localStorage.removeItem(key);
    console.log(`🗑️ Eliminado: ${key}`);
  }
});

console.log('✅ Tokens limpiados. Reiniciando aplicación...');

// Recargar la página
window.location.reload();
