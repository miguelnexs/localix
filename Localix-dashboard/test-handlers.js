const { ipcMain } = require('electron');

console.log('🧪 Iniciando prueba de handlers...');

// Verificar si los handlers están registrados
const checkHandlers = () => {
  console.log('🔍 Verificando handlers registrados...');
  
  // Lista de handlers que deberían estar registrados
  const expectedHandlers = [
    'pedidos:obtener-todos',
    'pedidos:obtener-estadisticas',
    'pedidos:obtener-por-id',
    'pedidos:crear',
    'pedidos:actualizar',
    'pedidos:eliminar',
    'pedidos:cambiar-estado',
    'pedidos:obtener-historial',
    'pedidos:buscar'
  ];
  
  let foundHandlers = 0;
  
  expectedHandlers.forEach(handlerName => {
    // Verificar si el handler está registrado
    const isRegistered = ipcMain.listenerCount(handlerName) > 0;
    console.log(`${isRegistered ? '✅' : '❌'} ${handlerName}: ${isRegistered ? 'Registrado' : 'No registrado'}`);
    
    if (isRegistered) {
      foundHandlers++;
    }
  });
  
  console.log(`📊 Resultado: ${foundHandlers}/${expectedHandlers.length} handlers registrados`);
  
  if (foundHandlers === expectedHandlers.length) {
    console.log('🎉 ¡Todos los handlers están registrados correctamente!');
  } else {
    console.log('⚠️ Algunos handlers no están registrados');
  }
};

// Exportar la función de verificación
module.exports = { checkHandlers };
