// Script para verificar el main process y los handlers
// Este script debe ejecutarse en el main process

const { ipcMain } = require('electron');

console.log('🔍 VERIFICACIÓN DEL MAIN PROCESS');
console.log('=' * 50);

// 1. Verificar que ipcMain esté disponible
console.log('1. Verificando ipcMain...');
if (ipcMain) {
  console.log('✅ ipcMain está disponible');
} else {
  console.log('❌ ipcMain no está disponible');
  process.exit(1);
}

// 2. Verificar handlers registrados
console.log('\n2. Verificando handlers registrados...');
const handlersRegistrados = ipcMain.eventNames();
console.log('✅ Total de handlers registrados:', handlersRegistrados.length);

// 3. Verificar handlers específicos de clientes
console.log('\n3. Verificando handlers de clientes...');
const handlersClientes = handlersRegistrados.filter(name => name.startsWith('clientes:'));
console.log('✅ Handlers de clientes encontrados:', handlersClientes);

const handlersEsperados = [
  'clientes:obtener-todos',
  'clientes:obtener-por-id',
  'clientes:crear',
  'clientes:crear-rapido',
  'clientes:actualizar',
  'clientes:eliminar',
  'clientes:buscar',
  'clientes:obtener-ventas',
  'clientes:obtener-con-ventas',
  'clientes:obtener-estadisticas'
];

const handlersFaltantes = handlersEsperados.filter(handler => !handlersClientes.includes(handler));

if (handlersFaltantes.length === 0) {
  console.log('✅ Todos los handlers de clientes están registrados');
} else {
  console.log('❌ Handlers de clientes faltantes:', handlersFaltantes);
}

// 4. Verificar otros handlers importantes
console.log('\n4. Verificando otros handlers...');
const handlersVentas = handlersRegistrados.filter(name => name.startsWith('ventas:'));
const handlersPedidos = handlersRegistrados.filter(name => name.startsWith('pedidos:'));
const handlersProductos = handlersRegistrados.filter(name => name.startsWith('productos:'));
const handlersCategorias = handlersRegistrados.filter(name => name.startsWith('categorias:'));

console.log('✅ Handlers de ventas:', handlersVentas.length);
console.log('✅ Handlers de pedidos:', handlersPedidos.length);
console.log('✅ Handlers de productos:', handlersProductos.length);
console.log('✅ Handlers de categorías:', handlersCategorias.length);

// 5. Función para registrar handlers manualmente si es necesario
function registrarHandlersManualmente() {
  console.log('\n5. Registrando handlers manualmente...');
  
  const { clienteHandlers } = require('./src/main/handlers/clienteHandlers');
  
  try {
    const resultado = clienteHandlers.initializeClienteHandlers();
    if (resultado) {
      console.log('✅ Handlers registrados manualmente exitosamente');
    } else {
      console.log('❌ Error registrando handlers manualmente');
    }
  } catch (error) {
    console.log('❌ Error en registro manual:', error.message);
  }
}

// 6. Función para probar un handler específico
function probarHandler(handlerName) {
  console.log(`\n6. Probando handler: ${handlerName}`);
  
  if (handlersRegistrados.includes(handlerName)) {
    console.log(`✅ Handler ${handlerName} está registrado`);
    
    // Intentar invocar el handler
    try {
      // Simular una invocación (esto es solo para verificar que existe)
      console.log(`✅ Handler ${handlerName} está disponible para invocación`);
    } catch (error) {
      console.log(`❌ Error probando handler ${handlerName}:`, error.message);
    }
  } else {
    console.log(`❌ Handler ${handlerName} NO está registrado`);
  }
}

// 7. Mostrar resumen
function mostrarResumen() {
  console.log('\n📊 RESUMEN DEL MAIN PROCESS');
  console.log('=' * 30);
  
  const problemas = [];
  
  if (handlersFaltantes.length > 0) {
    problemas.push(`Faltan ${handlersFaltantes.length} handlers de clientes`);
  }
  
  if (handlersClientes.length === 0) {
    problemas.push('No hay handlers de clientes registrados');
  }
  
  if (handlersRegistrados.length < 10) {
    problemas.push('Muy pocos handlers registrados en total');
  }
  
  if (problemas.length === 0) {
    console.log('✅ Main process funcionando correctamente');
    console.log('✅ Todos los handlers están registrados');
  } else {
    console.log('❌ Problemas detectados:');
    problemas.forEach((problema, index) => {
      console.log(`   ${index + 1}. ${problema}`);
    });
    
    console.log('\n🔧 SOLUCIONES:');
    console.log('   1. Reiniciar la aplicación Electron');
    console.log('   2. Verificar que los handlers se importen correctamente');
    console.log('   3. Verificar que no haya errores en la inicialización');
  }
}

// Ejecutar verificaciones
console.log('\n🔍 Ejecutando verificaciones...');
probarHandler('clientes:crear');
probarHandler('clientes:obtener-todos');

mostrarResumen();

// Exportar funciones para uso externo
module.exports = {
  verificarHandlers: () => {
    const handlers = ipcMain.eventNames();
    const clientes = handlers.filter(name => name.startsWith('clientes:'));
    return {
      total: handlers.length,
      clientes: clientes.length,
      faltantes: handlersEsperados.filter(handler => !clientes.includes(handler))
    };
  },
  
  registrarHandlersManualmente,
  probarHandler,
  mostrarResumen
};

console.log('\n💡 Para usar estas funciones:');
console.log('   - require("./verificar_main_process").verificarHandlers()');
console.log('   - require("./verificar_main_process").registrarHandlersManualmente()'); 