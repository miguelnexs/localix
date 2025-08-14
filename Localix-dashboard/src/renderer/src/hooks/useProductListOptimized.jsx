import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Cache global para productos
const productCache = new Map();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos

// Cache para estadísticas
const statsCache = new Map();
const STATS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useProductListOptimized = () => {
  const [data, setData] = useState({
    products: [],
    selectedProduct: null
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    hasMore: true,
    loading: false
  });
  
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
  const [stats, setStats] = useState({
    total: 0,
    publicados: 0,
    borradores: 0,
    agotados: 0,
    conStock: 0,
    sinStock: 0,
    descontinuados: 0
  });
  
  const [loading, setLoading] = useState({
    initial: true,
    refresh: false,
    stats: false
  });
  
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Función para generar clave de cache
  const getCacheKey = useCallback((params) => {
    const { page, pageSize, search, filters, sortConfig } = params;
    return JSON.stringify({ page, pageSize, search, filters, sortConfig });
  }, []);

  // Función optimizada para cargar productos
  const fetchProducts = useCallback(async (page = 1, search = '', appliedFilters = {}, append = false) => {
    // Cancelar request anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    const cacheKey = getCacheKey({ page, pageSize: pagination.pageSize, search, filters: appliedFilters, sortConfig });
    
    // Verificar cache
    if (!append && productCache.has(cacheKey)) {
      const cached = productCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        setData(prev => ({
          products: append ? [...prev.products, ...cached.data.products] : cached.data.products,
          selectedProduct: null
        }));
        setPagination(prev => ({
          ...prev,
          page,
          totalItems: cached.data.totalItems,
          hasMore: cached.data.hasMore,
          loading: false
        }));
        return;
      }
    }

    setPagination(prev => ({ ...prev, loading: true }));
    setError(null);

    try {
      const searchParams = {
        page,
        page_size: pagination.pageSize,
        ordering: `${sortConfig.direction === 'desc' ? '-' : ''}${sortConfig.key}`
      };

      if (search) searchParams.search = search;
      if (appliedFilters.categoria) searchParams.categoria_slug = appliedFilters.categoria;
      if (appliedFilters.estado) searchParams.estado = appliedFilters.estado;
      if (appliedFilters.fechaDesde) searchParams.created_gte = appliedFilters.fechaDesde;
      if (appliedFilters.fechaHasta) searchParams.created_lte = appliedFilters.fechaHasta;

      const response = await window.electronAPI.productos.listar(searchParams);
      const productsData = Array.isArray(response?.results)
        ? response.results
        : (Array.isArray(response) ? response : []);
      
      const newData = {
        products: productsData,
        totalItems: typeof response?.count === 'number' ? response.count : productsData.length,
        hasMore: productsData.length === pagination.pageSize
      };

      // Guardar en cache
      productCache.set(cacheKey, {
        data: newData,
        timestamp: Date.now()
      });

      setData(prev => ({
        products: append ? [...prev.products, ...productsData] : productsData,
        selectedProduct: null
      }));
      
      setPagination(prev => ({
        ...prev,
        page,
        totalItems: newData.totalItems,
        hasMore: newData.hasMore,
        loading: false
      }));

    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching products:', err);
        setError(err.message || 'Error al cargar los productos');
      }
    } finally {
      setPagination(prev => ({ ...prev, loading: false }));
    }
  }, [pagination.pageSize, sortConfig, getCacheKey]);

  // Función optimizada para cargar estadísticas
  const fetchStats = useCallback(async () => {
    const cacheKey = 'stats';
    
    if (statsCache.has(cacheKey)) {
      const cached = statsCache.get(cacheKey);
      if (Date.now() - cached.timestamp < STATS_CACHE_DURATION) {
        setStats(cached.data);
        return;
      }
    }

    setLoading(prev => ({ ...prev, stats: true }));

    try {
      const response = await window.electronAPI.productos.obtenerEstadisticas();
      
      if (response && typeof response === 'object') {
        const newStats = {
          total: response.total || 0,
          publicados: response.publicados || 0,
          borradores: response.borradores || 0,
          agotados: response.agotados || 0,
          conStock: response.con_stock || 0,
          sinStock: response.sin_stock || 0,
          descontinuados: response.descontinuados || 0
        };

        statsCache.set(cacheKey, {
          data: newStats,
          timestamp: Date.now()
        });

        setStats(newStats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  }, []);

  // Función para limpiar cache
  const clearCache = useCallback(() => {
    productCache.clear();
    statsCache.clear();
  }, []);

  // Función para refrescar datos
  const refreshData = useCallback(async () => {
    setLoading(prev => ({ ...prev, refresh: true }));
    clearCache();
    await Promise.all([
      fetchProducts(1, searchQuery, filters),
      fetchStats()
    ]);
    setLoading(prev => ({ ...prev, refresh: false }));
  }, [fetchProducts, fetchStats, searchQuery, filters, clearCache]);

  // Función para manejar búsqueda
  const handleSearch = useCallback((searchTerm) => {
    setSearchQuery(searchTerm);
    fetchProducts(1, searchTerm, filters);
  }, [fetchProducts, filters]);

  // Función para manejar filtros
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    fetchProducts(1, searchQuery, newFilters);
  }, [searchQuery, fetchProducts]);

  // Función para manejar ordenamiento
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Función para cargar más productos (infinite scroll)
  const loadMore = useCallback(() => {
    if (!pagination.loading && pagination.hasMore) {
      fetchProducts(pagination.page + 1, searchQuery, filters, true);
    }
  }, [fetchProducts, pagination, searchQuery, filters]);

  // Efecto inicial
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(prev => ({ ...prev, initial: true }));
      try {
        await Promise.all([
          fetchProducts(1, '', {}),
          fetchStats()
        ]);
      } catch (err) {
        console.error('Error loading initial data:', err);
      } finally {
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };

    loadInitialData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts, fetchStats]);

  // Memoizar productos filtrados
  const filteredProducts = useMemo(() => {
    return data.products;
  }, [data.products]);

  return {
    // Data
    products: filteredProducts,
    selectedProduct: data.selectedProduct,
    stats,
    
    // Pagination
    pagination,
    loadMore,
    
    // Search & Filters
    searchQuery,
    filters,
    sortConfig,
    handleSearch,
    handleFilterChange,
    handleSort,
    
    // Loading states
    loading,
    error,
    
    // Actions
    refreshData,
    clearCache,
    setSelectedProduct: (product) => setData(prev => ({ ...prev, selectedProduct: product }))
  };
};
