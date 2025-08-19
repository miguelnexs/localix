// Script para verificar que solo hay un botón de recargar en la página de clientes
// Copiar y pegar este código en la consola del navegador (F12)

(function() {
  console.log('🔍 VERIFICACIÓN DE BOTONES DE RECARGAR');
  console.log('=' * 50);
  
  // Función para verificar botones de recargar
  function verificarBotonesRecargar() {
    console.log('📋 Buscando botones de recargar...');
    
    // Buscar todos los botones que contengan "Recargar" o el ícono RefreshCw
    const botonesRecargar = [];
    
    // Buscar por texto
    const botonesPorTexto = Array.from(document.querySelectorAll('button')).filter(button => {
      const texto = button.textContent.toLowerCase();
      return texto.includes('recargar') || texto.includes('refresh');
    });
    
    // Buscar por ícono RefreshCw
    const botonesPorIcono = Array.from(document.querySelectorAll('button')).filter(button => {
      const iconos = button.querySelectorAll('svg');
      return Array.from(iconos).some(icono => {
        const clases = icono.className.baseVal || '';
        return clases.includes('refresh') || clases.includes('RefreshCw');
      });
    });
    
    // Combinar y eliminar duplicados
    const todosLosBotones = [...botonesPorTexto, ...botonesPorIcono];
    const botonesUnicos = todosLosBotones.filter((boton, index, array) => 
      array.indexOf(boton) === index
    );
    
    console.log(`✅ Total de botones de recargar encontrados: ${botonesUnicos.length}`);
    
    if (botonesUnicos.length === 0) {
      console.log('❌ No se encontraron botones de recargar');
      return;
    }
    
    if (botonesUnicos.length === 1) {
      console.log('✅ Perfecto: Solo hay un botón de recargar');
    } else if (botonesUnicos.length > 1) {
      console.log(`⚠️ ADVERTENCIA: Se encontraron ${botonesUnicos.length} botones de recargar`);
    }
    
    // Mostrar detalles de cada botón
    botonesUnicos.forEach((boton, index) => {
      console.log(`\n🔘 Botón ${index + 1}:`);
      console.log(`   - Texto: "${boton.textContent.trim()}"`);
      console.log(`   - Clases: "${boton.className}"`);
      console.log(`   - Posición: ${boton.offsetTop}, ${boton.offsetLeft}`);
      
      // Verificar si está visible
      const rect = boton.getBoundingClientRect();
      const visible = rect.width > 0 && rect.height > 0;
      console.log(`   - Visible: ${visible ? '✅ Sí' : '❌ No'}`);
      
      // Verificar si está habilitado
      const habilitado = !boton.disabled;
      console.log(`   - Habilitado: ${habilitado ? '✅ Sí' : '❌ No'}`);
    });
    
    return botonesUnicos;
  }
  
  // Función para verificar la funcionalidad del botón
  function verificarFuncionalidad() {
    console.log('\n🔍 Verificando funcionalidad del botón de recargar...');
    
    const botones = verificarBotonesRecargar();
    
    if (!botones || botones.length === 0) {
      console.log('❌ No hay botones para verificar');
      return;
    }
    
    const boton = botones[0]; // Tomar el primer botón
    
    console.log('\n🧪 Probando funcionalidad:');
    console.log('1. Verificando que el botón tenga el evento onClick...');
    
    // Verificar si tiene el evento onClick
    const tieneOnClick = boton.onclick !== null || boton.getAttribute('onclick');
    console.log(`   - Tiene onClick: ${tieneOnClick ? '✅ Sí' : '❌ No'}`);
    
    // Verificar si está en el contexto correcto
    const estaEnPaginaClientes = window.location.pathname.includes('clientes') || 
                                 document.title.includes('Clientes') ||
                                 document.querySelector('h1')?.textContent.includes('Clientes');
    console.log(`   - Está en página de clientes: ${estaEnPaginaClientes ? '✅ Sí' : '❌ No'}`);
    
    console.log('\n💡 Para probar manualmente:');
    console.log('1. Haz clic en el botón de recargar');
    console.log('2. Verifica que los datos se actualicen');
    console.log('3. Verifica que el ícono gire durante la carga');
  }
  
  // Función para verificar el diseño
  function verificarDiseno() {
    console.log('\n🎨 Verificando diseño del botón...');
    
    const botones = verificarBotonesRecargar();
    
    if (!botones || botones.length === 0) {
      console.log('❌ No hay botones para verificar');
      return;
    }
    
    const boton = botones[0];
    
    console.log('📋 Análisis de diseño:');
    
    // Verificar clases CSS
    const clases = boton.className.split(' ');
    console.log(`   - Clases CSS: ${clases.join(', ')}`);
    
    // Verificar si tiene estilos de hover
    const tieneHover = clases.some(clase => clase.includes('hover'));
    console.log(`   - Tiene efectos hover: ${tieneHover ? '✅ Sí' : '❌ No'}`);
    
    // Verificar si tiene transiciones
    const tieneTransiciones = clases.some(clase => clase.includes('transition'));
    console.log(`   - Tiene transiciones: ${tieneTransiciones ? '✅ Sí' : '❌ No'}`);
    
    // Verificar ícono
    const icono = boton.querySelector('svg');
    if (icono) {
      console.log(`   - Ícono presente: ✅ Sí`);
      console.log(`   - Tamaño del ícono: ${icono.getAttribute('size') || 'no especificado'}`);
    } else {
      console.log(`   - Ícono presente: ❌ No`);
    }
    
    // Verificar texto
    const texto = boton.textContent.trim();
    console.log(`   - Texto del botón: "${texto}"`);
  }
  
  // Función para mostrar resumen
  function mostrarResumen() {
    console.log('\n📊 RESUMEN DE LA VERIFICACIÓN');
    console.log('=' * 30);
    
    const botones = verificarBotonesRecargar();
    
    if (!botones || botones.length === 0) {
      console.log('❌ PROBLEMA: No se encontraron botones de recargar');
      console.log('🔧 Solución: Verificar que la página esté cargada correctamente');
    } else if (botones.length === 1) {
      console.log('✅ ÉXITO: Solo hay un botón de recargar');
      console.log('✅ El problema de duplicación ha sido solucionado');
    } else {
      console.log(`⚠️ PROBLEMA: Se encontraron ${botones.length} botones de recargar`);
      console.log('🔧 Solución: Eliminar los botones duplicados');
    }
    
    console.log('\n💡 Recomendaciones:');
    console.log('   - Mantener solo un botón de recargar por página');
    console.log('   - Asegurar que el botón esté en una ubicación lógica');
    console.log('   - Verificar que la funcionalidad sea consistente');
  }
  
  // Ejecutar verificaciones
  verificarBotonesRecargar();
  verificarFuncionalidad();
  verificarDiseno();
  mostrarResumen();
  
  // Función para verificación rápida
  window.verificarRecargar = function() {
    console.log('\n🚀 Verificación rápida de botones de recargar...');
    verificarBotonesRecargar();
  };
  
  console.log('\n💡 Funciones disponibles:');
  console.log('   - verificarBotonesRecargar() - Cuenta los botones de recargar');
  console.log('   - verificarFuncionalidad() - Verifica la funcionalidad');
  console.log('   - verificarDiseno() - Analiza el diseño');
  console.log('   - mostrarResumen() - Muestra resumen completo');
  console.log('   - verificarRecargar() - Verificación rápida');
  
})(); 