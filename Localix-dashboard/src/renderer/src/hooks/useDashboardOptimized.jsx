import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios';

// Cache global para datos del dashboard
const dashboardCache = new Map();
const CACHE_DURATION = 60000; // 1 minuto para dashboard

export const useDashboardOptimized = () => {
  const [dashboardData, setDashboardData] = useState({
    resumen: {
      totalVentas: 0,
      totalIngresos: 0,
      totalPedidos: 0,
      totalClientes: 0,
      totalProductos: 0,
      gananciaTotal: 0
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

  // Función para verificar autenticación
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('access_token');
    return !!token;
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

    try {
      setLoading(prev => ({ ...prev, initial: true }));
      setError(null);

      // Verificar autenticación
      if (!isAuthenticated()) {
        console.log('Usuario no autenticado, usando datos por defecto');
        setDashboardData({
          resumen: {
            totalVentas: 0,
            totalIngresos: 0,
            totalPedidos: 0,
            totalClientes: 0,
            totalProductos: 0,
            gananciaTotal: 0
          },
          estadisticas: [],
          ventasRecientes: [],
          productosTop: [],
          pedidosRecientes: []
        });
        setLoading(prev => ({ ...prev, initial: false }));
        return;
      }

      console.log('Usuario autenticado, cargando datos del dashboard...');

      // Cargar datos usando APIs HTTP directas
      const [resumenRes, categoriasRes, productosRes, pedidosRes] = await Promise.all([
        api.get('/ventas/resumen/').catch(() => ({ data: { resumen: {}, ventas: [] } })),
        api.get('/categorias/').catch(() => ({ data: { results: [] } })),
        api.get('/productos/productos/').catch(() => ({ data: { results: [] } })),
        api.get('/pedidos/pedidos/').catch(() => ({ data: { results: [] } }))
      ]);

      // Procesar datos
      const resumenData = resumenRes.data?.resumen || {};
      const ventasData = resumenRes.data?.ventas || [];
      const categoriasData = categoriasRes.data?.results || categoriasRes.data || [];
      const productosData = productosRes.data?.results || productosRes.data || [];
      const pedidosData = pedidosRes.data?.results || pedidosRes.data || [];

      // Debug: Verificar estructura de datos
      console.log('🔍 Debug - Estructura de datos recibidos:');
      console.log('  - resumenRes.data:', resumenRes.data);
      console.log('  - categoriasRes.data:', categoriasRes.data);
      console.log('  - productosRes.data:', productosRes.data);
      console.log('  - pedidosRes.data:', pedidosRes.data);
      console.log('  - productosData procesado:', productosData);
      console.log('  - productosData es array:', Array.isArray(productosData));
      console.log('  - pedidosData procesado:', pedidosData);
      console.log('  - pedidosData es array:', Array.isArray(pedidosData));

      // Calcular totales
      const totalVentas = resumenData.total_ventas || ventasData.length || 0;
      const totalIngresos = resumenData.total_ingresos || 0;
      const totalProductos = Array.isArray(productosData) ? productosData.length : 0;
      const totalCategorias = Array.isArray(categoriasData) ? categoriasData.length : 0;
      const totalPedidos = Array.isArray(pedidosData) ? pedidosData.length : 0;

      // Calcular ganancia total de las ventas
      let gananciaTotal = 0;
      if (Array.isArray(ventasData) && ventasData.length > 0) {
        gananciaTotal = ventasData.reduce((total, venta) => {
          if (venta.items && Array.isArray(venta.items)) {
            const gananciaVenta = venta.items.reduce((subtotal, item) => {
              const precioVenta = parseFloat(item.precio_unitario || 0);
              const costo = parseFloat(item.producto_detalle?.costo || 0);
              const cantidad = parseInt(item.cantidad || 0);
              const gananciaItem = (precioVenta - costo) * cantidad;
              return subtotal + gananciaItem;
            }, 0);
            return total + gananciaVenta;
          }
          return total;
        }, 0);
      }

      const processedData = {
        resumen: {
          totalVentas,
          totalIngresos,
          totalPedidos: totalPedidos, // Usar pedidos reales
          totalClientes: totalCategorias, // Usar categorías como clientes por ahora
          totalProductos,
          gananciaTotal: gananciaTotal
        },
        estadisticas: Array.isArray(productosData) ? productosData : [],
        ventasRecientes: Array.isArray(ventasData) ? ventasData.slice(0, 10) : [],
        productosTop: Array.isArray(productosData) ? productosData.slice(0, 5) : [],
        pedidosRecientes: Array.isArray(pedidosData) ? pedidosData.slice(0, 5) : []
      };

      console.log('Datos del dashboard cargados:', processedData);

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
  }, [isAuthenticated]);

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
    clearCache,
    isAuthenticated: isAuthenticated()
  };
};

export default useDashboardOptimized;
