// Script para limpiar localStorage y reiniciar la aplicación
console.log('🧹 Limpiando localStorage...');

// Limpiar tokens de autenticación
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');

// Limpiar otros datos que puedan causar problemas
localStorage.removeItem('user');
localStorage.removeItem('auth_state');
localStorage.removeItem('connection_error');

console.log('✅ localStorage limpiado');
console.log('🔄 Recargando página...');

// Recargar la página
window.location.reload();
