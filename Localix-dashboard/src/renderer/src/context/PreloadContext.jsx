import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import api from '../api/axios';

// 🚀 CONTEXTO PARA PRE-CARGA INTELIGENTE DE DATOS
const PreloadContext = createContext();

// 🚀 CONFIGURACIÓN DE PRE-CARGA
const PRELOAD_CONFIG = {
  // Tiempo de espera antes de iniciar pre-carga (ms)
  INITIAL_DELAY: 3000,
  // Intervalo entre pre-cargas (ms)
  REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutos
  // Tiempo máximo de espera para pre-carga (ms)
  TIMEOUT: 10000,
  // Número máximo de intentos de pre-carga
  MAX_RETRIES: 3,
  // Prioridades de pre-carga
  PRIORITIES: {
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
  }
};

// 🚀 ESTADOS DE PRE-CARGA
const PRELOAD_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  STALE: 'stale'
};

export const PreloadProvider = ({ children }) => {
  // No usar useAuth aquí para evitar dependencias circulares
  // En su lugar, verificaremos la autenticación de forma dinámica
  
  // 🚀 ESTADO PRINCIPAL DE PRE-CARGA
  const [preloadState, setPreloadState] = useState({
    products: { state: PRELOAD_STATES.IDLE, data: null, error: null, lastUpdated: null },
    categories: { state: PRELOAD_STATES.IDLE, data: null, error: null, lastUpdated: null },
    dashboard: { state: PRELOAD_STATES.IDLE, data: null, error: null, lastUpdated: null }
  });

  // 🚀 ESTADO DE CONFIGURACIÓN
  const [config, setConfig] = useState({
    isEnabled: true,
    autoRefresh: true,
    backgroundLoading: true
  });

  // 🚀 REFERENCIAS PARA CONTROL
  const abortControllers = useMemo(() => ({
    products: null,
    categories: null,
    dashboard: null
  }), []);

  // 🚀 FUNCIÓN PARA PRE-CARGAR PRODUCTOS
  const preloadProducts = useCallback(async (priority = PRELOAD_CONFIG.PRIORITIES.MEDIUM) => {
    // Verificar si ya está cargando o si hay un request activo
    if (preloadState.products.state === PRELOAD_STATES.LOADING || abortControllers.products) {
      console.log('🚀 Pre-carga de productos ya en progreso, saltando...');
      return;
    }

    console.log(`🚀 Iniciando pre-carga de productos (prioridad: ${priority})`);
    
    setPreloadState(prev => ({
      ...prev,
      products: { ...prev.products, state: PRELOAD_STATES.LOADING, error: null }
    }));

    // Cancelar request anterior si existe
    if (abortControllers.products) {
      abortControllers.products.abort();
    }

    const controller = new AbortController();
    abortControllers.products = controller;

    try {
      const startTime = Date.now();
      
      let result;
      
      // Verificar autenticación de forma dinámica
      const token = localStorage.getItem('access_token');
      const isAuthenticated = !!token;
      
      if (isAuthenticated) {
        console.log('🚀 Usando API HTTP para productos (usuario autenticado)');
        const response = await api.get('productos/productos/', {
          params: { 
            ordering: 'nombre',
            page_size: 100 // Limitar a 100 productos para preload
          },
          signal: controller.signal
        });
        result = { products: response.data.results || response.data };
      } else {
        // Si no está autenticado, usar IPC
        console.log('🚀 Usando IPC para productos (usuario no autenticado)');
        result = await window.electronAPI.productos.cargarProductosYCategorias({
          signal: controller.signal,
          priority
        });
      }

      const loadTime = Date.now() - startTime;
      console.log(`🚀 Productos pre-cargados en ${loadTime}ms`);

      setPreloadState(prev => ({
        ...prev,
        products: {
          state: PRELOAD_STATES.SUCCESS,
          data: result.products || [],
          error: null,
          lastUpdated: Date.now()
        }
      }));

    } catch (error) {
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        console.log('🚀 Pre-carga de productos cancelada');
        return;
      }

      console.error('🚀 Error en pre-carga de productos:', error);
      setPreloadState(prev => ({
        ...prev,
        products: {
          ...prev.products,
          state: PRELOAD_STATES.ERROR,
          error: error.message
        }
      }));
    }
  }, [preloadState.products.state, abortControllers]);

  // 🚀 FUNCIÓN PARA PRE-CARGAR CATEGORÍAS
  const preloadCategories = useCallback(async (priority = PRELOAD_CONFIG.PRIORITIES.HIGH) => {
    // Verificar si ya está cargando o si hay un request activo
    if (preloadState.categories.state === PRELOAD_STATES.LOADING || abortControllers.categories) {
      console.log('🚀 Pre-carga de categorías ya en progreso, saltando...');
      return;
    }

    console.log(`🚀 Iniciando pre-carga de categorías (prioridad: ${priority})`);
    
    // 🚀 DEBUG: Verificar APIs disponibles
    console.log('🚀 DEBUG - APIs disponibles:', {
      electronAPI: !!window.electronAPI,
      debugAPI: !!window.debugAPI,
      ventasAPI: !!window.ventasAPI,
      clientesAPI: !!window.clientesAPI,
              pedidosAPI: !!(window.electronAPI?.pedidos || window.pedidosAPI)
    });

    if (window.debugAPI) {
      const debugInfo = window.debugAPI.checkElectronAPI();
      console.log('🚀 DEBUG - Información de electronAPI:', debugInfo);
    }
    
    setPreloadState(prev => ({
      ...prev,
      categories: { ...prev.categories, state: PRELOAD_STATES.LOADING, error: null }
    }));

    // Cancelar request anterior si existe
    if (abortControllers.categories) {
      abortControllers.categories.abort();
    }

    const controller = new AbortController();
    abortControllers.categories = controller;

    try {
      const startTime = Date.now();
      
      let result;
      
      // Verificar autenticación de forma dinámica
      const token = localStorage.getItem('access_token');
      const isAuthenticated = !!token;
      
      if (isAuthenticated) {
        console.log('🚀 Usando API HTTP para categorías (usuario autenticado)');
        const response = await api.get('categorias/', {
          params: { ordering: 'orden,nombre' },
          signal: controller.signal
        });
        result = response.data.results || response.data;
      } else {
        // Si no está autenticado, usar IPC
        console.log('🚀 Usando IPC para categorías (usuario no autenticado)');
        result = await window.electronAPI.categorias.listar({
          signal: controller.signal,
          priority
        });
      }

      const loadTime = Date.now() - startTime;
      console.log(`🚀 Categorías pre-cargadas en ${loadTime}ms`);

      setPreloadState(prev => ({
        ...prev,
        categories: {
          state: PRELOAD_STATES.SUCCESS,
          data: result || [],
          error: null,
          lastUpdated: Date.now()
        }
      }));

    } catch (error) {
      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        console.log('🚀 Pre-carga de categorías cancelada');
        return;
      }

      console.error('🚀 Error en pre-carga de categorías:', error);
      setPreloadState(prev => ({
        ...prev,
        categories: {
          ...prev.categories,
          state: PRELOAD_STATES.ERROR,
          error: error.message
        }
      }));
    }
  }, [preloadState.categories.state, abortControllers]);

  // 🚀 FUNCIÓN PARA PRE-CARGAR DASHBOARD
  const preloadDashboard = useCallback(async (priority = PRELOAD_CONFIG.PRIORITIES.LOW) => {
    if (preloadState.dashboard.state === PRELOAD_STATES.LOADING) {
      console.log('🚀 Pre-carga de dashboard ya en progreso, saltando...');
      return;
    }

    console.log(`🚀 Iniciando pre-carga de dashboard (prioridad: ${priority})`);
    
    setPreloadState(prev => ({
      ...prev,
      dashboard: { ...prev.dashboard, state: PRELOAD_STATES.LOADING, error: null }
    }));

    // Cancelar request anterior si existe
    if (abortControllers.dashboard) {
      abortControllers.dashboard.abort();
    }

    const controller = new AbortController();
    abortControllers.dashboard = controller;

    try {
      const startTime = Date.now();
      
      const result = await window.electronAPI.ventas.obtenerEstadisticas({
        signal: controller.signal,
        priority
      });

      const loadTime = Date.now() - startTime;
      console.log(`🚀 Dashboard pre-cargado en ${loadTime}ms`);

      setPreloadState(prev => ({
        ...prev,
        dashboard: {
          state: PRELOAD_STATES.SUCCESS,
          data: result || {},
          error: null,
          lastUpdated: Date.now()
        }
      }));

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('🚀 Pre-carga de dashboard cancelada');
        return;
      }

      console.error('🚀 Error en pre-carga de dashboard:', error);
      setPreloadState(prev => ({
        ...prev,
        dashboard: {
          ...prev.dashboard,
          state: PRELOAD_STATES.ERROR,
          error: error.message
        }
      }));
    }
  }, [preloadState.dashboard.state, abortControllers]);

  // 🚀 FUNCIÓN PARA PRE-CARGAR TODO
  const preloadAll = useCallback(async (priority = PRELOAD_CONFIG.PRIORITIES.MEDIUM) => {
    console.log('🚀 Iniciando pre-carga completa de datos');
    
    // Verificar si ya hay requests activos
    const hasActiveRequests = Object.values(preloadState).some(
      state => state.state === PRELOAD_STATES.LOADING
    );
    
    if (hasActiveRequests) {
      console.log('🚀 Saltando pre-carga completa - requests activos en progreso');
      return;
    }
    
    // Pre-cargar en secuencia para evitar conflictos
    try {
      await preloadCategories(PRELOAD_CONFIG.PRIORITIES.HIGH);
      // Pequeña pausa entre requests
      await new Promise(resolve => setTimeout(resolve, 100));
      await preloadProducts(PRELOAD_CONFIG.PRIORITIES.MEDIUM);
      // Pequeña pausa entre requests
      await new Promise(resolve => setTimeout(resolve, 100));
      await preloadDashboard(PRELOAD_CONFIG.PRIORITIES.LOW);
    } catch (error) {
      console.log('🚀 Error en pre-carga completa:', error);
    }
  }, [preloadCategories, preloadProducts, preloadDashboard, preloadState]);

  // 🚀 FUNCIÓN PARA FORZAR REFRESH
  const forceRefresh = useCallback(async (dataType = 'all') => {
    console.log(`🚀 Forzando refresh de ${dataType}`);
    
    switch (dataType) {
      case 'products':
        await preloadProducts(PRELOAD_CONFIG.PRIORITIES.CRITICAL);
        break;
      case 'categories':
        await preloadCategories(PRELOAD_CONFIG.PRIORITIES.CRITICAL);
        break;
      case 'dashboard':
        await preloadDashboard(PRELOAD_CONFIG.PRIORITIES.CRITICAL);
        break;
      case 'all':
      default:
        await preloadAll(PRELOAD_CONFIG.PRIORITIES.CRITICAL);
        break;
    }
  }, [preloadProducts, preloadCategories, preloadDashboard, preloadAll]);

  // 🚀 FUNCIÓN PARA OBTENER DATOS PRE-CARGADOS
  const getPreloadedData = useCallback((dataType) => {
    const data = preloadState[dataType];
    
    if (!data) {
      return { data: null, isLoading: false, error: null, isStale: false };
    }

    const isStale = data.lastUpdated && 
      (Date.now() - data.lastUpdated) > PRELOAD_CONFIG.REFRESH_INTERVAL;

    return {
      data: data.data,
      isLoading: data.state === PRELOAD_STATES.LOADING,
      error: data.error,
      isStale: isStale,
      lastUpdated: data.lastUpdated
    };
  }, [preloadState]);

  // 🚀 INICIALIZACIÓN AUTOMÁTICA
  useEffect(() => {
    if (!config.isEnabled) return;

    console.log('🚀 Configurando pre-carga automática de datos');
    
    // Pre-carga inicial con delay
    const initialTimer = setTimeout(() => {
      preloadAll();
    }, PRELOAD_CONFIG.INITIAL_DELAY);

    // Pre-carga periódica solo si autoRefresh está habilitado
    let refreshTimer;
    if (config.autoRefresh) {
      refreshTimer = setInterval(() => {
        // Solo ejecutar pre-carga periódica si no hay requests en progreso
        const hasActiveRequests = Object.values(preloadState).some(
          state => state.state === PRELOAD_STATES.LOADING
        );
        
        if (!hasActiveRequests) {
          console.log('🚀 Ejecutando pre-carga periódica');
          preloadAll();
        } else {
          console.log('🚀 Saltando pre-carga periódica - requests activos en progreso');
        }
      }, PRELOAD_CONFIG.REFRESH_INTERVAL);
    }

    return () => {
      clearTimeout(initialTimer);
      clearInterval(refreshTimer);
      
      // Cancelar todas las requests pendientes
      Object.values(abortControllers).forEach(controller => {
        if (controller) controller.abort();
      });
    };
  }, [config.isEnabled, config.autoRefresh, preloadAll, abortControllers, preloadState]);

  // 🚀 VALOR DEL CONTEXTO
  const contextValue = useMemo(() => ({
    // Estado
    preloadState,
    
    // Configuración
    config,
    setConfig,
    
    // Funciones de pre-carga
    preloadProducts,
    preloadCategories,
    preloadDashboard,
    preloadAll,
    forceRefresh,
    
    // Utilidades
    getPreloadedData,
    
    // Constantes
    PRELOAD_CONFIG,
    PRELOAD_STATES
  }), [
    preloadState,
    config,
    preloadProducts,
    preloadCategories,
    preloadDashboard,
    preloadAll,
    forceRefresh,
    getPreloadedData
  ]);

  return (
    <PreloadContext.Provider value={contextValue}>
      {children}
    </PreloadContext.Provider>
  );
};

// 🚀 HOOK PARA USAR EL CONTEXTO
export const usePreload = () => {
  const context = useContext(PreloadContext);
  if (!context) {
    throw new Error('usePreload debe ser usado dentro de PreloadProvider');
  }
  return context;
};

// 🚀 HOOK ESPECÍFICO PARA PRODUCTOS
export const usePreloadedProducts = () => {
  const { getPreloadedData, preloadProducts, forceRefresh } = usePreload();
  const productsData = getPreloadedData('products');
  
  return {
    ...productsData,
    refresh: () => forceRefresh('products'),
    preload: () => preloadProducts()
  };
};

// 🚀 HOOK ESPECÍFICO PARA CATEGORÍAS
export const usePreloadedCategories = () => {
  const { getPreloadedData, preloadCategories, forceRefresh } = usePreload();
  const categoriesData = getPreloadedData('categories');
  
  return {
    ...categoriesData,
    refresh: () => forceRefresh('categories'),
    preload: () => preloadCategories()
  };
};

// 🚀 HOOK ESPECÍFICO PARA DASHBOARD
export const usePreloadedDashboard = () => {
  const { getPreloadedData, preloadDashboard, forceRefresh } = usePreload();
  const dashboardData = getPreloadedData('dashboard');
  
  return {
    ...dashboardData,
    refresh: () => forceRefresh('dashboard'),
    preload: () => preloadDashboard()
  };
};
