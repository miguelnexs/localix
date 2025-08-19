// Script de verificación rápida para la API de clientes
// Copiar y pegar este código en la consola del navegador (F12)

console.log('🔍 VERIFICACIÓN RÁPIDA DE LA API DE CLIENTES');
console.log('=' * 50);

// 1. Verificar si window.clientesAPI existe
console.log('1. Verificando window.clientesAPI...');
if (window.clientesAPI) {
  console.log('✅ window.clientesAPI está disponible');
  
  // Verificar métodos específicos
  const metodos = ['obtenerTodos', 'crear', 'actualizar', 'eliminar', 'buscar'];
  const metodosDisponibles = metodos.filter(metodo => typeof window.clientesAPI[metodo] === 'function');
  
  console.log('✅ Métodos disponibles:', metodosDisponibles);
  
  if (metodosDisponibles.length === metodos.length) {
    console.log('✅ Todos los métodos están disponibles');
  } else {
    console.log('❌ Métodos faltantes:', metodos.filter(m => !metodosDisponibles.includes(m)));
  }
} else {
  console.log('❌ window.clientesAPI NO está disponible');
  console.log('🔧 Esto indica un problema con el preload o los handlers');
}

// 2. Verificar otras APIs
console.log('\n2. Verificando otras APIs...');
console.log('window.electronAPI:', window.electronAPI ? '✅ Disponible' : '❌ No disponible');
console.log('window.ventasAPI:', window.ventasAPI ? '✅ Disponible' : '❌ No disponible');
console.log('window.pedidosAPI:', window.pedidosAPI ? '✅ Disponible' : '❌ No disponible');

// 3. Verificar localStorage
console.log('\n3. Verificando localStorage...');
const token = localStorage.getItem('access_token');
console.log('Token de acceso:', token ? '✅ Presente' : '❌ Ausente');

// 4. Probar conexión directa al servidor
console.log('\n4. Probando conexión al servidor...');
fetch('http://localhost:8000/api/')
  .then(response => {
    if (response.ok) {
      console.log('✅ Servidor respondiendo correctamente');
      return response.json();
    } else {
      console.log('❌ Servidor respondió con error:', response.status);
    }
  })
  .then(data => {
    if (data) {
      console.log('✅ Datos del servidor:', data);
    }
  })
  .catch(error => {
    console.log('❌ Error conectando al servidor:', error.message);
  });

// 5. Función para probar la API de clientes
async function probarAPI() {
  console.log('\n5. Probando API de clientes...');
  
  if (!window.clientesAPI) {
    console.log('❌ No se puede probar - window.clientesAPI no está disponible');
    return;
  }
  
  try {
    // Probar obtener clientes
    console.log('🔍 Probando obtenerTodos...');
    const result = await window.clientesAPI.obtenerTodos();
    console.log('✅ Resultado obtenerTodos:', result);
    
    // Probar crear cliente
    console.log('🔍 Probando crear cliente...');
    const clienteData = {
      nombre: 'Cliente Test API',
      email: 'test-api@example.com',
      telefono: '3001234567',
      tipo_documento: 'dni',
      numero_documento: '12345678',
      direccion: 'Dirección test',
      activo: true
    };
    
    const crearResult = await window.clientesAPI.crear(clienteData);
    console.log('✅ Resultado crear:', crearResult);
    
  } catch (error) {
    console.log('❌ Error probando API:', error);
  }
}

// 6. Función para reiniciar la aplicación
function reiniciarAplicacion() {
  console.log('\n6. Para reiniciar la aplicación:');
  console.log('   1. Cerrar la aplicación Electron');
  console.log('   2. Volver a abrir la aplicación');
  console.log('   3. Ejecutar este script nuevamente');
}

// 7. Función para verificar el preload
function verificarPreload() {
  console.log('\n7. Verificando preload...');
  
  // Verificar si estamos en Electron
  if (window.electronAPI) {
    console.log('✅ Electron API disponible');
    
    // Verificar si hay errores en el preload
    if (window.electronAPI.error) {
      console.log('❌ Error en preload:', window.electronAPI.error);
    } else {
      console.log('✅ Preload funcionando correctamente');
    }
  } else {
    console.log('❌ No estamos en Electron o hay problemas con el preload');
  }
}

// Ejecutar verificaciones
setTimeout(() => {
  verificarPreload();
  probarAPI();
  reiniciarAplicacion();
}, 1000);

// Función para mostrar resumen
function mostrarResumen() {
  console.log('\n📊 RESUMEN DEL DIAGNÓSTICO');
  console.log('=' * 30);
  
  const problemas = [];
  
  if (!window.clientesAPI) {
    problemas.push('window.clientesAPI no está disponible');
  }
  
  if (!localStorage.getItem('access_token')) {
    problemas.push('No hay token de autenticación');
  }
  
  if (!window.electronAPI) {
    problemas.push('Electron API no está disponible');
  }
  
  if (problemas.length === 0) {
    console.log('✅ No se detectaron problemas evidentes');
    console.log('💡 Si sigues teniendo problemas, verifica:');
    console.log('   - Los logs del servidor Django');
    console.log('   - Los logs de la aplicación Electron');
    console.log('   - La configuración de la base de datos');
  } else {
    console.log('❌ Problemas detectados:');
    problemas.forEach((problema, index) => {
      console.log(`   ${index + 1}. ${problema}`);
    });
    
    console.log('\n🔧 SOLUCIONES RECOMENDADAS:');
    console.log('   1. Reiniciar la aplicación Electron');
    console.log('   2. Verificar que el servidor Django esté ejecutándose');
    console.log('   3. Verificar que los handlers estén registrados');
    console.log('   4. Iniciar sesión nuevamente');
  }
}

// Mostrar resumen después de 3 segundos
setTimeout(mostrarResumen, 3000);

console.log('\n💡 Para ejecutar pruebas específicas:');
console.log('   - probarAPI() - Probar la API de clientes');
console.log('   - verificarPreload() - Verificar el preload');
console.log('   - mostrarResumen() - Mostrar resumen del diagnóstico'); 