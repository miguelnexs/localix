import { useState, useEffect, useCallback, useRef } from 'react';

// Cache global para datos del dashboard
const dashboardCache = new Map();
const CACHE_DURATION = 60000; // 1 minuto para dashboard

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    resumen: {
      totalVentas: 0,
      totalIngresos: 0,
      totalPedidos: 0,
      totalClientes: 0,
      totalProductos: 0,
      ticketPromedio: 0
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
      const [resumenRes, ventasRecientesRes, pedidosRes, productosRes, clientesRes, estadisticasPedidosRes] = await Promise.all([
        window.ventasAPI?.obtenerResumen?.()?.catch(() => ({ success: false, data: null })) || Promise.resolve({ success: false, data: null }),
        window.ventasAPI?.obtenerVentas?.()?.catch(() => ({ success: false, data: [] })) || Promise.resolve({ success: false, data: [] }),
        (window.electronAPI?.pedidos?.obtenerTodos || window.pedidosAPI?.obtenerTodos)?.({ page_size: 5 })?.catch(() => ({ results: [] })) || Promise.resolve({ results: [] }),
        window.electronAPI?.productos?.listar?.({ page_size: 1000 })?.catch(() => ({ results: [] })) || Promise.resolve({ results: [] }),
        window.clientesAPI?.obtenerTodos?.()?.catch(() => ({ success: false, data: [] })) || Promise.resolve({ success: false, data: [] }),
        (window.electronAPI?.pedidos?.obtenerEstadisticas || window.pedidosAPI?.obtenerEstadisticas)?.()?.catch(() => ({})) || Promise.resolve({})
      ]);

      // Procesar datos con manejo correcto de formatos de respuesta
      const resumenData = resumenRes?.success ? resumenRes.data : (resumenRes?.resumen || {});
      const ventasData = ventasRecientesRes?.success ? ventasRecientesRes.data : [];
      const pedidosData = Array.isArray(pedidosRes?.results) ? pedidosRes.results : [];
      const productosData = Array.isArray(productosRes?.results) ? productosRes.results : [];
      const clientesData = clientesRes?.success ? (Array.isArray(clientesRes.data?.results) ? clientesRes.data.results : clientesRes.data) : [];
      const estadisticasPedidos = estadisticasPedidosRes || {};

      // Calcular totales reales
      const totalProductos = productosData.length;
      const totalClientes = Array.isArray(clientesData) ? clientesData.length : 0;
      const totalPedidos = estadisticasPedidos.total_pedidos || pedidosData.length || 0;
             // Usar ingresos de pedidos entregados en lugar de todos los ingresos
       const totalIngresos = estadisticasPedidos.total_ingresos || resumenData.total_ingresos || 0;
       const totalIngresosTodos = estadisticasPedidos.total_ingresos_todos || 0;
       const pedidosEntregados = estadisticasPedidos.pedidos_entregados || 0;

      const processedData = {
        resumen: {
          totalVentas: resumenData.total_ventas || ventasData.length || 0,
          totalIngresos: totalIngresos, // Ingresos de pedidos confirmados
          totalIngresosTodos: totalIngresosTodos, // Ingresos de todos los pedidos
          totalPedidos: totalPedidos,
          totalClientes: totalClientes,
          totalProductos: totalProductos,
          ticketPromedio: resumenData.ticket_promedio || 0,
                     pedidosEntregados: pedidosEntregados
        },
        estadisticas: productosData, // Para cálculos de inventario
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

  // Función para recargar datos
  const refreshData = useCallback(async () => {
    setLoading(prev => ({ ...prev, refresh: true }));
    try {
      await fetchDashboardData(true);
    } catch (err) {
      console.error('Error en refresh:', err);
    } finally {
      setLoading(prev => ({ ...prev, refresh: false }));
    }
  }, [fetchDashboardData]);

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

  return {
    dashboardData,
    loading,
    error,
    refreshData,
    clearCache
  };
};

export default useDashboard; 