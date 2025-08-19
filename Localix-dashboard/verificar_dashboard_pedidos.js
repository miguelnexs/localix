// Script para verificar que la sección de pedidos en el dashboard esté funcionando correctamente
// Copiar y pegar este código en la consola del navegador (F12)

(function() {
  console.log('🔍 VERIFICACIÓN DE PEDIDOS EN EL DASHBOARD');
  console.log('=' * 50);
  
  // Función para verificar la página actual
  function verificarPaginaActual() {
    console.log('📋 Verificando página actual...');
    
    const titulo = document.title;
    const url = window.location.pathname;
    const h1 = document.querySelector('h1');
    
    console.log(`   - Título: "${titulo}"`);
    console.log(`   - URL: "${url}"`);
    console.log(`   - H1: "${h1?.textContent || 'No encontrado'}"`);
    
    const esDashboard = titulo.includes('Dashboard') || 
                       url.includes('dashboard') || 
                       url === '/' ||
                       h1?.textContent.includes('Dashboard');
    
    console.log(`   - Es dashboard: ${esDashboard ? '✅ Sí' : '❌ No'}`);
    
    return esDashboard;
  }
  
  // Función para verificar la sección de pedidos
  function verificarSeccionPedidos() {
    console.log('\n🔍 Verificando sección de pedidos...');
    
    // Buscar el título "Pedidos Recientes"
    const tituloPedidos = Array.from(document.querySelectorAll('h3')).find(h3 => 
      h3.textContent.includes('Pedidos Recientes')
    );
    
    if (!tituloPedidos) {
      console.log('❌ No se encontró la sección "Pedidos Recientes"');
      return false;
    }
    
    console.log('✅ Sección "Pedidos Recientes" encontrada');
    
    // Buscar la tabla de pedidos
    const tablaPedidos = tituloPedidos.closest('.bg-theme-surface')?.querySelector('table');
    
    if (!tablaPedidos) {
      console.log('❌ No se encontró la tabla de pedidos');
      return false;
    }
    
    console.log('✅ Tabla de pedidos encontrada');
    
    // Verificar filas de la tabla
    const filas = tablaPedidos.querySelectorAll('tbody tr');
    console.log(`📊 Filas de pedidos encontradas: ${filas.length}`);
    
    if (filas.length === 0) {
      console.log('⚠️ No hay pedidos para mostrar');
      
      // Verificar mensaje de "No hay pedidos recientes"
      const mensajeVacio = document.querySelector('h4');
      if (mensajeVacio && mensajeVacio.textContent.includes('No hay pedidos recientes')) {
        console.log('✅ Mensaje de "No hay pedidos" mostrado correctamente');
      } else {
        console.log('❌ No se muestra mensaje de "No hay pedidos"');
      }
      
      return true;
    }
    
    // Verificar estructura de las filas
    filas.forEach((fila, index) => {
      const celdas = fila.querySelectorAll('td');
      console.log(`\n🔘 Fila ${index + 1}:`);
      console.log(`   - Celdas encontradas: ${celdas.length}`);
      
      if (celdas.length >= 5) {
        const numeroPedido = celdas[0]?.textContent?.trim();
        const cliente = celdas[1]?.textContent?.trim();
        const fecha = celdas[2]?.textContent?.trim();
        const monto = celdas[3]?.textContent?.trim();
        const estado = celdas[4]?.textContent?.trim();
        
        console.log(`   - Número de pedido: "${numeroPedido}"`);
        console.log(`   - Cliente: "${cliente}"`);
        console.log(`   - Fecha: "${fecha}"`);
        console.log(`   - Monto: "${monto}"`);
        console.log(`   - Estado: "${estado}"`);
        
        // Verificar que los datos no estén vacíos
        if (numeroPedido && numeroPedido !== '#undefined') {
          console.log(`   ✅ Datos válidos`);
        } else {
          console.log(`   ❌ Datos inválidos o vacíos`);
        }
      } else {
        console.log(`   ❌ Estructura de fila incorrecta`);
      }
    });
    
    return true;
  }
  
  // Función para verificar el contador de pedidos
  function verificarContadorPedidos() {
    console.log('\n🔍 Verificando contador de pedidos...');
    
    // Buscar el contador de "Total Pedidos"
    const contadores = Array.from(document.querySelectorAll('p')).filter(p => 
      p.textContent.includes('Total Pedidos')
    );
    
    if (contadores.length === 0) {
      console.log('❌ No se encontró el contador de "Total Pedidos"');
      return false;
    }
    
    contadores.forEach((contador, index) => {
      const contenedor = contador.closest('.bg-theme-surface');
      const valor = contenedor?.querySelector('.text-2xl')?.textContent;
      
      console.log(`📊 Contador ${index + 1}:`);
      console.log(`   - Texto: "${contador.textContent}"`);
      console.log(`   - Valor: "${valor}"`);
      
      if (valor && valor !== '0') {
        console.log(`   ✅ Contador con valor válido`);
      } else if (valor === '0') {
        console.log(`   ⚠️ Contador muestra 0 (puede ser normal si no hay pedidos)`);
      } else {
        console.log(`   ❌ Contador sin valor`);
      }
    });
    
    return true;
  }
  
  // Función para verificar botones de acción
  function verificarBotonesAccion() {
    console.log('\n🔍 Verificando botones de acción...');
    
    // Buscar botón "Ver todos" en la sección de pedidos
    const botonVerTodos = Array.from(document.querySelectorAll('button')).find(button => 
      button.textContent.includes('Ver todos')
    );
    
    if (botonVerTodos) {
      console.log('✅ Botón "Ver todos" encontrado');
      
      // Verificar que tenga el evento onClick
      const tieneOnClick = botonVerTodos.onclick !== null;
      console.log(`   - Tiene onClick: ${tieneOnClick ? '✅ Sí' : '❌ No'}`);
      
      // Verificar que esté habilitado
      const habilitado = !botonVerTodos.disabled;
      console.log(`   - Habilitado: ${habilitado ? '✅ Sí' : '❌ No'}`);
    } else {
      console.log('❌ Botón "Ver todos" no encontrado');
    }
    
    // Buscar botón de acción rápida "Pedidos"
    const botonPedidos = Array.from(document.querySelectorAll('button')).find(button => 
      button.textContent.includes('Pedidos')
    );
    
    if (botonPedidos) {
      console.log('✅ Botón de acción rápida "Pedidos" encontrado');
      
      const tieneOnClick = botonPedidos.onclick !== null;
      console.log(`   - Tiene onClick: ${tieneOnClick ? '✅ Sí' : '❌ No'}`);
      
      const habilitado = !botonPedidos.disabled;
      console.log(`   - Habilitado: ${habilitado ? '✅ Sí' : '❌ No'}`);
    } else {
      console.log('❌ Botón de acción rápida "Pedidos" no encontrado');
    }
  }
  
  // Función para verificar datos del hook
  function verificarDatosHook() {
    console.log('\n🔍 Verificando datos del hook...');
    
    // Intentar acceder a los datos del dashboard desde la consola
    console.log('💡 Para verificar los datos del hook manualmente:');
    console.log('   1. Abre las herramientas de desarrollador (F12)');
    console.log('   2. Ve a la pestaña "Components" (React DevTools)');
    console.log('   3. Busca el componente DashboardPage');
    console.log('   4. Verifica las props y el estado');
    console.log('   5. Busca dashboardData.pedidosRecientes');
    
    // Verificar si hay errores en la consola
    console.log('\n🔍 Verificando errores en la consola...');
    console.log('   - Revisa si hay errores relacionados con pedidos');
    console.log('   - Verifica si hay errores de red (Network tab)');
    console.log('   - Busca errores de API en la consola');
  }
  
  // Función para mostrar resumen
  function mostrarResumen() {
    console.log('\n📊 RESUMEN DE LA VERIFICACIÓN');
    console.log('=' * 30);
    
    const esDashboard = verificarPaginaActual();
    
    if (!esDashboard) {
      console.log('❌ No estás en el dashboard');
      console.log('🔧 Navega al dashboard y ejecuta este script nuevamente');
      return;
    }
    
    const seccionPedidosOk = verificarSeccionPedidos();
    const contadorPedidosOk = verificarContadorPedidos();
    verificarBotonesAccion();
    verificarDatosHook();
    
    if (seccionPedidosOk && contadorPedidosOk) {
      console.log('\n✅ ÉXITO: La sección de pedidos está funcionando correctamente');
      console.log('✅ El dashboard está mostrando los pedidos correctamente');
    } else {
      console.log('\n⚠️ PROBLEMA: Hay problemas con la sección de pedidos');
      console.log('🔧 Verificar la implementación del hook useDashboardOptimized');
    }
    
    console.log('\n💡 Recomendaciones:');
    console.log('   - Verificar que el endpoint /pedidos/pedidos/ esté funcionando');
    console.log('   - Verificar que los datos se estén cargando correctamente');
    console.log('   - Probar la navegación a la página de pedidos');
    console.log('   - Verificar que no haya errores de CORS o autenticación');
  }
  
  // Función para verificar endpoint de pedidos
  function verificarEndpointPedidos() {
    console.log('\n🔍 Verificando endpoint de pedidos...');
    
    console.log('💡 Para verificar el endpoint manualmente:');
    console.log('   1. Abre las herramientas de desarrollador (F12)');
    console.log('   2. Ve a la pestaña "Network"');
    console.log('   3. Recarga la página');
    console.log('   4. Busca la petición a /pedidos/pedidos/');
    console.log('   5. Verifica que el status sea 200');
    console.log('   6. Verifica que la respuesta contenga datos de pedidos');
    
    // Función para hacer la petición directamente
    window.probarEndpointPedidos = async function() {
      try {
        console.log('🧪 Probando endpoint de pedidos...');
        const response = await fetch('/api/pedidos/pedidos/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Endpoint funcionando:', data);
          return data;
        } else {
          console.log('❌ Error en endpoint:', response.status, response.statusText);
          return null;
        }
      } catch (error) {
        console.log('❌ Error probando endpoint:', error);
        return null;
      }
    };
    
    console.log('\n💡 Para probar el endpoint ejecuta:');
    console.log('   probarEndpointPedidos()');
  }
  
  // Ejecutar verificaciones
  verificarPaginaActual();
  verificarSeccionPedidos();
  verificarContadorPedidos();
  verificarBotonesAccion();
  verificarDatosHook();
  verificarEndpointPedidos();
  mostrarResumen();
  
  // Función para verificación rápida
  window.verificarDashboardPedidos = function() {
    console.log('\n🚀 Verificación rápida de pedidos en dashboard...');
    verificarSeccionPedidos();
    verificarContadorPedidos();
  };
  
  console.log('\n💡 Funciones disponibles:');
  console.log('   - verificarSeccionPedidos() - Verifica la sección de pedidos');
  console.log('   - verificarContadorPedidos() - Verifica el contador');
  console.log('   - verificarBotonesAccion() - Verifica los botones');
  console.log('   - verificarDatosHook() - Verifica los datos del hook');
  console.log('   - verificarEndpointPedidos() - Verifica el endpoint');
  console.log('   - mostrarResumen() - Muestra resumen completo');
  console.log('   - verificarDashboardPedidos() - Verificación rápida');
  console.log('   - probarEndpointPedidos() - Prueba el endpoint directamente');
  
})(); 