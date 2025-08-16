// Script para limpiar tokens desde la consola del navegador
// Copia y pega este código en la consola del navegador (F12)

console.log('🧹 Limpiando tokens de autenticación...');

// Limpiar tokens específicos
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');

// Limpiar cualquier otro token que pueda existir
const keys = Object.keys(localStorage);
let tokensRemoved = 0;

keys.forEach(key => {
  if (key.includes('token') || key.includes('auth') || key.includes('user')) {
    localStorage.removeItem(key);
    tokensRemoved++;
    console.log(`🗑️ Eliminado: ${key}`);
  }
});

console.log(`✅ Limpieza completada. ${tokensRemoved} elementos eliminados.`);

// Verificar que se limpiaron
const remainingTokens = Object.keys(localStorage).filter(key => 
  key.includes('token') || key.includes('auth') || key.includes('user')
);

if (remainingTokens.length === 0) {
  console.log('✅ Todos los tokens han sido eliminados correctamente.');
} else {
  console.log('⚠️ Algunos tokens permanecen:', remainingTokens);
}

// Recargar la página para aplicar los cambios
console.log('🔄 Recargando página en 3 segundos...');
setTimeout(() => {
  window.location.reload();
}, 3000);
