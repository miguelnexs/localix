import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Cache global para datos del dashboard
const dashboardCache = new Map();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos

// Cache para gráficos
const chartsCache = new Map();
const CHARTS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useDashboardOptimized = () => {
  const [dashboardData, setDashboardData] = useState({
    resumen: {
      totalVentas: 0,
      totalIngresos: 0,
      totalIngresosTodos: 0,
      totalPedidos: 0,
      totalClientes: 0,
      totalProductos: 0,
      ticketPromedio: 0,
      pedidosEntregados: 0
    },
    estadisticas: [],
    ventasRecientes: [],
    productosTop: [],
    pedidosRecientes: []
  });
  
  const [loading, setLoading] = useState({
    initial: true,
    resumen: false,
    charts: false,
    refresh: false
  });
  
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Función para limpiar cache
  const clearCache = useCallback(() => {
    dashboardCache.clear();
    chartsCache.clear();
  }, []);

  // Función optimizada para cargar datos del dashboard
  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();

    // Verificar caché primero (a menos que se fuerce refresh)
    if (!forceRefresh && dashboardCache.has('dashboard')) {
      const cachedData = dashboardCache.get('dashboard');
      if (Date.now() - cachedData.timestamp < CACHE_DURATION) {
        setDashboardData(cachedData.data);
        setLoading(prev => ({ ...prev, initial: false }));
        setError(null);
        return;
      }
    }

    // Verificar que las APIs estén disponibles
    if (!window.ventasAPI || (!window.electronAPI?.pedidos && !window.pedidosAPI) || !window.electronAPI || !window.clientesAPI) {
      console.error('APIs no disponibles:', {
        ventasAPI: !!window.ventasAPI,
        pedidosAPI: !!(window.electronAPI?.pedidos || window.pedidosAPI),
        electronAPI: !!window.electronAPI,
        clientesAPI: !!window.clientesAPI
      });
      setError('Error: APIs no disponibles. Verifica la conexión.');
      setLoading(prev => ({ ...prev, initial: false }));
      return;
    }

    try {
      setLoading(prev => ({ ...prev, initial: true }));
      setError(null);

      // Cargar datos esenciales en paralelo con manejo correcto de formatos
      const [resumenRes, ventasRecientesRes, pedidosRes, productosRes, clientesRes, estadisticasPedidosRes] = await Promise.allSettled([
        window.ventasAPI?.obtenerResumen?.()?.catch(() => ({ success: false, data: null })) || Promise.resolve({ success: false, data: null }),
        window.ventasAPI?.obtenerVentas?.()?.catch(() => ({ success: false, data: [] })) || Promise.resolve({ success: false, data: [] }),
        (window.electronAPI?.pedidos?.obtenerTodos || window.pedidosAPI?.obtenerTodos)?.({ page_size: 5 })?.catch(() => ({ results: [] })) || Promise.resolve({ results: [] }),
        window.electronAPI?.productos?.listar?.({ page_size: 1000 })?.catch(() => ({ results: [] })) || Promise.resolve({ results: [] }),
        window.clientesAPI?.obtenerTodos?.()?.catch(() => ({ success: false, data: [] })) || Promise.resolve({ success: false, data: [] }),
        (window.electronAPI?.pedidos?.obtenerEstadisticas || window.pedidosAPI?.obtenerEstadisticas)?.()?.catch(() => ({})) || Promise.resolve({})
      ]);

      // Procesar datos con manejo correcto de formatos de respuesta
      const resumenData = resumenRes.status === 'fulfilled' && resumenRes.value?.success ? resumenRes.value.data : (resumenRes.status === 'fulfilled' ? resumenRes.value?.resumen : {});
      const ventasData = ventasRecientesRes.status === 'fulfilled' && ventasRecientesRes.value?.success ? ventasRecientesRes.value.data : [];
      const pedidosData = pedidosRes.status === 'fulfilled' && Array.isArray(pedidosRes.value?.results) ? pedidosRes.value.results : [];
      const productosData = productosRes.status === 'fulfilled' && Array.isArray(productosRes.value?.results) ? productosRes.value.results : [];
      const clientesData = clientesRes.status === 'fulfilled' && clientesRes.value?.success ? (Array.isArray(clientesRes.value.data?.results) ? clientesRes.value.data.results : clientesRes.value.data) : [];
      const estadisticasPedidos = estadisticasPedidosRes.status === 'fulfilled' ? estadisticasPedidosRes.value : {};

      // Calcular totales reales
      const totalProductos = productosData.length;
      const totalClientes = Array.isArray(clientesData) ? clientesData.length : 0;
      const totalPedidos = estadisticasPedidos.total_pedidos || pedidosData.length || 0;
      const totalIngresos = estadisticasPedidos.total_ingresos || resumenData.total_ingresos || 0;
      const totalIngresosTodos = estadisticasPedidos.total_ingresos_todos || 0;
      const pedidosEntregados = estadisticasPedidos.pedidos_entregados || 0;

      const processedData = {
        resumen: {
          totalVentas: resumenData.total_ventas || ventasData.length || 0,
          totalIngresos: totalIngresos,
          totalIngresosTodos: totalIngresosTodos,
          totalPedidos: totalPedidos,
          totalClientes: totalClientes,
          totalProductos: totalProductos,
          ticketPromedio: resumenData.ticket_promedio || 0,
          pedidosEntregados: pedidosEntregados
        },
        estadisticas: productosData,
        ventasRecientes: Array.isArray(ventasData) ? ventasData.slice(0, 10) : [],
        productosTop: [],
        pedidosRecientes: pedidosData.slice(0, 5)
      };

      // Guardar en caché
      dashboardCache.set('dashboard', {
        data: processedData,
        timestamp: Date.now()
      });

      setDashboardData(processedData);

    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error cargando dashboard:', err);
        setError('Error cargando los datos del dashboard. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(prev => ({ ...prev, initial: false }));
    }
  }, []);

  // Función optimizada para cargar datos de gráficos
  const fetchChartsData = useCallback(async (forceRefresh = false) => {
    const cacheKey = 'charts';
    
    if (!forceRefresh && chartsCache.has(cacheKey)) {
      const cached = chartsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CHARTS_CACHE_DURATION) {
        return cached.data;
      }
    }

    setLoading(prev => ({ ...prev, charts: true }));

    try {
      const [ventasData, productosData] = await Promise.allSettled([
        window.ventasAPI?.obtenerVentas?.()?.catch(() => ({ success: false, data: [] })) || Promise.resolve({ success: false, data: [] }),
        window.electronAPI?.productos?.listar?.({ page_size: 1000 })?.catch(() => ({ results: [] })) || Promise.resolve({ results: [] })
      ]);

      const ventas = ventasData.status === 'fulfilled' && ventasData.value?.success ? ventasData.value.data : [];
      const productos = productosData.status === 'fulfilled' && Array.isArray(productosData.value?.results) ? productosData.value.results : [];

      const chartsData = {
        ventasRecientes: Array.isArray(ventas) ? ventas.slice(0, 10) : [],
        productosTop: productos.slice(0, 10)
      };

      chartsCache.set(cacheKey, {
        data: chartsData,
        timestamp: Date.now()
      });

      setLoading(prev => ({ ...prev, charts: false }));
      return chartsData;

    } catch (err) {
      console.error('Error cargando datos de gráficos:', err);
      setLoading(prev => ({ ...prev, charts: false }));
      return { ventasRecientes: [], productosTop: [] };
    }
  }, []);

  // Función para recargar datos
  const refreshData = useCallback(async () => {
    setLoading(prev => ({ ...prev, refresh: true }));
    try {
      clearCache();
      await Promise.all([
        fetchDashboardData(true),
        fetchChartsData(true)
      ]);
    } catch (err) {
      console.error('Error en refresh:', err);
    } finally {
      setLoading(prev => ({ ...prev, refresh: false }));
    }
  }, [fetchDashboardData, fetchChartsData, clearCache]);

  // Efecto para cargar datos
  useEffect(() => {
    fetchDashboardData();
    
    // Cleanup: abortar request al desmontar
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchDashboardData]);

  // Memoizar datos procesados para gráficos
  const chartsData = useMemo(() => {
    const { ventasRecientes, estadisticas } = dashboardData;
    
    // Datos para gráfico de ventas
    const salesData = {
      labels: ventasRecientes.map(venta => 
        new Date(venta.fecha_venta).toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: '2-digit' 
        })
      ),
      datasets: [{
        label: 'Ventas',
        data: ventasRecientes.map(venta => venta.total || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.4
      }]
    };

    // Datos para gráfico de inventario
    const inventoryData = {
      labels: ['Con Stock', 'Sin Stock', 'Agotados'],
      datasets: [{
        data: [
          estadisticas.filter(p => p.stock > 0).length,
          estadisticas.filter(p => p.stock === 0).length,
          estadisticas.filter(p => p.estado === 'agotado').length
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderWidth: 0
      }]
    };

    return { salesData, inventoryData };
  }, [dashboardData]);

  return {
    dashboardData,
    chartsData,
    loading,
    error,
    refreshData,
    clearCache,
    fetchChartsData
  };
};
