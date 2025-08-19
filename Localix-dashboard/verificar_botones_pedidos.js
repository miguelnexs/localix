// Script para verificar que el botón de editar ha sido eliminado de la página de pedidos
// Copiar y pegar este código en la consola del navegador (F12)

(function() {
  console.log('🔍 VERIFICACIÓN DE BOTONES EN PEDIDOS');
  console.log('=' * 50);
  
  // Función para verificar botones de editar
  function verificarBotonesEditar() {
    console.log('📋 Buscando botones de editar...');
    
    // Buscar todos los botones que contengan "Editar" o el ícono Edit
    const botonesEditar = [];
    
    // Buscar por texto
    const botonesPorTexto = Array.from(document.querySelectorAll('button')).filter(button => {
      const texto = button.textContent.toLowerCase();
      return texto.includes('editar') || texto.includes('edit');
    });
    
    // Buscar por ícono Edit
    const botonesPorIcono = Array.from(document.querySelectorAll('button')).filter(button => {
      const iconos = button.querySelectorAll('svg');
      return Array.from(iconos).some(icono => {
        const clases = icono.className.baseVal || '';
        return clases.includes('edit') || clases.includes('Edit');
      });
    });
    
    // Combinar y eliminar duplicados
    const todosLosBotones = [...botonesPorTexto, ...botonesPorIcono];
    const botonesUnicos = todosLosBotones.filter((boton, index, array) => 
      array.indexOf(boton) === index
    );
    
    console.log(`✅ Total de botones de editar encontrados: ${botonesUnicos.length}`);
    
    if (botonesUnicos.length === 0) {
      console.log('✅ Perfecto: No se encontraron botones de editar');
      return [];
    }
    
    // Mostrar detalles de cada botón encontrado
    botonesUnicos.forEach((boton, index) => {
      console.log(`\n🔘 Botón de editar ${index + 1}:`);
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
  
  // Función para verificar botones de acciones en la tabla
  function verificarBotonesAcciones() {
    console.log('\n🔍 Verificando botones de acciones en la tabla...');
    
    // Buscar la tabla de pedidos
    const tabla = document.querySelector('table');
    if (!tabla) {
      console.log('❌ No se encontró tabla de pedidos');
      return;
    }
    
    console.log('✅ Tabla de pedidos encontrada');
    
    // Buscar botones de acciones en las filas de la tabla
    const filas = tabla.querySelectorAll('tbody tr');
    console.log(`📊 Filas encontradas: ${filas.length}`);
    
    let botonesEditarEnTabla = 0;
    let botonesVerEnTabla = 0;
    let botonesEliminarEnTabla = 0;
    
    filas.forEach((fila, index) => {
      const botones = fila.querySelectorAll('button');
      
      botones.forEach(boton => {
        const texto = boton.textContent.toLowerCase();
        const iconos = boton.querySelectorAll('svg');
        
        // Verificar tipo de botón
        if (texto.includes('editar') || texto.includes('edit') || 
            Array.from(iconos).some(icono => icono.className.baseVal?.includes('edit'))) {
          botonesEditarEnTabla++;
          console.log(`   ❌ Botón de editar encontrado en fila ${index + 1}`);
        }
        
        if (texto.includes('ver') || texto.includes('view') || 
            Array.from(iconos).some(icono => icono.className.baseVal?.includes('eye'))) {
          botonesVerEnTabla++;
        }
        
        if (texto.includes('eliminar') || texto.includes('delete') || 
            Array.from(iconos).some(icono => icono.className.baseVal?.includes('trash'))) {
          botonesEliminarEnTabla++;
        }
      });
    });
    
    console.log('\n📊 Resumen de botones en la tabla:');
    console.log(`   - Botones de ver: ${botonesVerEnTabla}`);
    console.log(`   - Botones de editar: ${botonesEditarEnTabla}`);
    console.log(`   - Botones de eliminar: ${botonesEliminarEnTabla}`);
    
    if (botonesEditarEnTabla === 0) {
      console.log('✅ ÉXITO: No hay botones de editar en la tabla');
    } else {
      console.log(`⚠️ PROBLEMA: Se encontraron ${botonesEditarEnTabla} botones de editar en la tabla`);
    }
  }
  
  // Función para verificar la página actual
  function verificarPaginaActual() {
    console.log('\n🔍 Verificando página actual...');
    
    const titulo = document.title;
    const url = window.location.pathname;
    const h1 = document.querySelector('h1');
    
    console.log(`   - Título: "${titulo}"`);
    console.log(`   - URL: "${url}"`);
    console.log(`   - H1: "${h1?.textContent || 'No encontrado'}"`);
    
    const esPaginaPedidos = titulo.includes('Pedidos') || 
                           url.includes('pedidos') || 
                           url.includes('orders') ||
                           h1?.textContent.includes('Pedidos');
    
    console.log(`   - Es página de pedidos: ${esPaginaPedidos ? '✅ Sí' : '❌ No'}`);
    
    return esPaginaPedidos;
  }
  
  // Función para mostrar resumen
  function mostrarResumen() {
    console.log('\n📊 RESUMEN DE LA VERIFICACIÓN');
    console.log('=' * 30);
    
    const esPaginaPedidos = verificarPaginaActual();
    
    if (!esPaginaPedidos) {
      console.log('❌ No estás en la página de pedidos');
      console.log('🔧 Navega a la página de pedidos y ejecuta este script nuevamente');
      return;
    }
    
    const botonesEditar = verificarBotonesEditar();
    verificarBotonesAcciones();
    
    if (botonesEditar.length === 0) {
      console.log('\n✅ ÉXITO: El botón de editar ha sido eliminado correctamente');
      console.log('✅ La corrección ha sido aplicada exitosamente');
    } else {
      console.log('\n⚠️ PROBLEMA: Aún se encontraron botones de editar');
      console.log('🔧 Verificar que la corrección se haya aplicado correctamente');
    }
    
    console.log('\n💡 Recomendaciones:');
    console.log('   - Verificar que no haya funcionalidad de edición implementada');
    console.log('   - Asegurar que los botones restantes funcionen correctamente');
    console.log('   - Probar la funcionalidad de ver y eliminar pedidos');
  }
  
  // Función para verificar funcionalidad de otros botones
  function verificarFuncionalidadOtrosBotones() {
    console.log('\n🔍 Verificando funcionalidad de otros botones...');
    
    const botonesVer = Array.from(document.querySelectorAll('button')).filter(button => {
      const texto = button.textContent.toLowerCase();
      const iconos = button.querySelectorAll('svg');
      return texto.includes('ver') || texto.includes('view') || 
             Array.from(iconos).some(icono => icono.className.baseVal?.includes('eye'));
    });
    
    const botonesEliminar = Array.from(document.querySelectorAll('button')).filter(button => {
      const texto = button.textContent.toLowerCase();
      const iconos = button.querySelectorAll('svg');
      return texto.includes('eliminar') || texto.includes('delete') || 
             Array.from(iconos).some(icono => icono.className.baseVal?.includes('trash'));
    });
    
    console.log(`📊 Botones de ver encontrados: ${botonesVer.length}`);
    console.log(`📊 Botones de eliminar encontrados: ${botonesEliminar.length}`);
    
    if (botonesVer.length > 0) {
      console.log('✅ Botones de ver están disponibles');
    }
    
    if (botonesEliminar.length > 0) {
      console.log('✅ Botones de eliminar están disponibles');
    }
  }
  
  // Ejecutar verificaciones
  verificarPaginaActual();
  verificarBotonesEditar();
  verificarBotonesAcciones();
  verificarFuncionalidadOtrosBotones();
  mostrarResumen();
  
  // Función para verificación rápida
  window.verificarPedidos = function() {
    console.log('\n🚀 Verificación rápida de botones en pedidos...');
    verificarBotonesEditar();
    verificarBotonesAcciones();
  };
  
  console.log('\n💡 Funciones disponibles:');
  console.log('   - verificarBotonesEditar() - Busca botones de editar');
  console.log('   - verificarBotonesAcciones() - Verifica botones en la tabla');
  console.log('   - verificarPaginaActual() - Verifica la página actual');
  console.log('   - verificarFuncionalidadOtrosBotones() - Verifica otros botones');
  console.log('   - mostrarResumen() - Muestra resumen completo');
  console.log('   - verificarPedidos() - Verificación rápida');
  
})(); 