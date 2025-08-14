import React, { useCallback, useMemo, useRef } from 'react';
import {
  Search, Plus, RefreshCw, Eye, Edit, Trash2,
  Package, Filter, ArrowUpDown, ChevronDown, ChevronUp,
  CheckCircle, Edit as EditIcon, AlertTriangle, XCircle, TrendingUp, Package2,
  FolderOpen, Settings, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Componentes personalizados
import ProductStatusChip from './ProductStatusChip';
import ProductVariantAccordion from './ProductVariantAccordion';
import ProductDialog from './ProductDialog';
import ProductFormOptimized from './ProductFormOptimized';
import EmptyState from './EmptyState';
import PaginationControls from './PaginationControls';
import ErrorBoundary from './ErrorBoundary';
import ProductColorsDisplay from './ProductColorsDisplay';
import SmartProductSearch from './SmartProductSearch';

// Hooks y utilidades optimizadas
import { useToast } from '../../hooks/useToast';
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation';
import { useProductListOptimized } from '../../hooks/useProductListOptimized';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';
import { formatPrice } from '../../utils/formatters';
import { RESOURCE_URL } from '../../api/apiConfig';
import { useLoadingState, InlineLoading, ErrorState, CardSkeleton } from '../ui/LoadingComponents';

// Componentes memoizados para mejor rendimiento
const ProductRow = React.memo(({ 
  product, 
  index, 
  onView, 
  onEdit, 
  onDelete, 
  onRetryEdit,
  isLast,
  lastProductElementRef 
}) => {
  const navigate = useNavigate();
  
  const handleEdit = useCallback(() => {
    if (product.slug && product.slug !== 'producto' && product.slug !== ':1') {
      navigate(`/product/edit/${product.slug}`);
    } else {
      onRetryEdit(product.id);
    }
  }, [product, navigate, onRetryEdit]);

  const handleView = useCallback(() => {
    onView(product);
  }, [product, onView]);

  const handleDelete = useCallback(() => {
    onDelete(product);
  }, [product, onDelete]);

  const ref = isLast ? lastProductElementRef : null;

  return (
    <tr 
      ref={ref}
      className="hover:bg-theme-background transition-colors duration-150"
    >
      <td className="px-4 py-3 text-sm text-theme-text">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {product.imagen_principal_url ? (
              <img
                src={getImageUrl(product.imagen_principal_url)}
                alt={product.nombre}
                className="w-10 h-10 rounded-lg object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-10 h-10 bg-theme-border rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-theme-textSecondary" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-theme-text truncate">
              {product.nombre}
            </p>
            <p className="text-sm text-theme-textSecondary truncate">
              SKU: {product.sku || 'N/A'}
            </p>
          </div>
        </div>
      </td>
      
      <td className="px-4 py-3 text-sm text-theme-text">
        {formatPrice(product.precio)}
      </td>
      
      <td className="px-4 py-3 text-sm text-theme-text">
        <ProductStatusChip status={product.estado} />
      </td>
      
      <td className="px-4 py-3 text-sm text-theme-text">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          product.stock > 0 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {product.stock} unidades
        </span>
      </td>
      
      <td className="px-4 py-3 text-sm text-theme-text">
        {product.categoria?.nombre || 'Sin categoría'}
      </td>
      
      <td className="px-4 py-3 text-sm text-theme-textSecondary">
        {new Date(product.fecha_creacion).toLocaleDateString()}
      </td>
      
      <td className="px-4 py-3 text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleView}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleEdit}
            className="text-green-600 hover:text-green-900 transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
});

const ProductListOptimized = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { deleteModal, hideDeleteConfirmation, confirmDeleteProduct } = useDeleteConfirmation();
  const { isLoading, startLoading, stopLoading } = useLoadingState('products-main');
  
  // Usar el hook optimizado
  const {
    products,
    stats,
    pagination,
    searchQuery,
    filters,
    sortConfig,
    loading,
    error,
    handleSearch,
    handleFilterChange,
    handleSort,
    refreshData,
    loadMore,
    setSelectedProduct
  } = useProductListOptimized();
  
  const [ui, setUi] = useState({
    openDialog: false,
    dialogMode: 'view',
    error: null
  });
  
  const [suggestions, setSuggestions] = useState([]);
  const observer = useRef();
  
  // Función memoizada para obtener sugerencias
  const fetchSuggestions = useCallback(async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await window.electronAPI.productos.buscar({
        search: searchTerm,
        page_size: 5
      });
      
      if (response?.results) {
        setSuggestions(response.results);
      }
    } catch (error) {
      console.warn('Error fetching search suggestions:', error);
      setSuggestions([]);
    }
  }, []);

  // Función memoizada para reintentar edición
  const retryEditProduct = useCallback(async (productId) => {
    try {
      const response = await window.electronAPI.productos.listar({ 
        search: `id:${productId}`,
        page_size: 1 
      });
      
      const updatedProduct = response.results?.[0];
      if (updatedProduct?.slug && updatedProduct.slug !== 'producto' && updatedProduct.slug !== ':1') {
        console.log('✅ Slug recuperado exitosamente:', updatedProduct.slug);
        navigate(`/product/edit/${updatedProduct.slug}`);
      } else {
        toast.error('No se pudo recuperar el slug del producto');
      }
    } catch (error) {
      console.error('Error retrying edit:', error);
      toast.error('Error al reintentar la edición');
    }
  }, [navigate, toast]);

  // Función memoizada para manejar eliminación
  const handleDeleteProduct = useCallback(async (product) => {
    try {
      startLoading('Eliminando producto...');
      
      const response = await window.electronAPI.productos.eliminar(product.id);
      
      if (response.success) {
        toast.success('Producto eliminado exitosamente');
        refreshData();
      } else {
        toast.error(response.message || 'Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto');
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, toast, refreshData]);

  // Función memoizada para manejar vista de producto
  const handleViewProduct = useCallback((product) => {
    setSelectedProduct(product);
    setUi(prev => ({ ...prev, openDialog: true, dialogMode: 'view' }));
  }, [setSelectedProduct]);

  // Configurar intersection observer para infinite scroll
  const lastProductElementRef = useCallback(node => {
    if (pagination.loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination.hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [pagination.loading, pagination.hasMore, loadMore]);

  // Memoizar estadísticas para evitar re-renders
  const statsDisplay = useMemo(() => [
    { label: 'Total', value: stats.total, icon: Package, color: 'bg-blue-100 text-blue-800' },
    { label: 'Publicados', value: stats.publicados, icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { label: 'Borradores', value: stats.borradores, icon: EditIcon, color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Agotados', value: stats.agotados, icon: AlertTriangle, color: 'bg-red-100 text-red-800' },
    { label: 'Con Stock', value: stats.conStock, icon: TrendingUp, color: 'bg-green-100 text-green-800' },
    { label: 'Sin Stock', value: stats.sinStock, icon: XCircle, color: 'bg-red-100 text-red-800' },
    { label: 'Descontinuados', value: stats.descontinuados, icon: Package2, color: 'bg-theme-secondary text-theme-text' }
  ], [stats]);

  // Renderizar estados de carga
  if (loading.initial) {
    return (
      <div className="space-y-4">
        <CardSkeleton count={5} />
      </div>
    );
  }

  // Renderizar estado de error
  if (error) {
    return <ErrorState message={error} onRetry={refreshData} />;
  }

  // Renderizar estado vacío
  if (products.length === 0 && !loading.refresh) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-theme-surface rounded-lg border border-theme-border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-theme-text">Productos</h1>
            <p className="text-theme-textSecondary">Gestiona tu catálogo de productos</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/product/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Link>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {statsDisplay.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.color} mb-2`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-theme-text">{stat.value}</p>
              <p className="text-sm text-theme-textSecondary">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Controles de búsqueda y filtros */}
      <div className="bg-theme-surface rounded-lg border border-theme-border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-lg">
            <SmartProductSearch
              value={searchQuery}
              onChange={handleSearch}
              suggestions={suggestions}
              onSuggestionSelect={(suggestion) => handleSearch(suggestion.nombre)}
              placeholder="Buscar productos..."
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={refreshData}
              disabled={loading.refresh}
              className="inline-flex items-center px-3 py-2 border border-theme-border shadow-sm text-sm leading-4 font-medium rounded-md text-theme-textSecondary bg-theme-surface hover:bg-theme-background focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading.refresh ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-theme-surface rounded-lg border border-theme-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-theme-border">
            <thead className="bg-theme-background">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('precio')}
                    className="flex items-center space-x-1 hover:text-theme-textSecondary transition-colors"
                  >
                    <span>Precio</span>
                    {sortConfig.key === 'precio' ? (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    ) : <ArrowUpDown className="w-4 h-4" />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('fecha_creacion')}
                    className="flex items-center space-x-1 hover:text-theme-textSecondary transition-colors"
                  >
                    <span>Fecha</span>
                    {sortConfig.key === 'fecha_creacion' ? (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    ) : <ArrowUpDown className="w-4 h-4" />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-theme-surface divide-y divide-theme-border">
              {products.map((product, index) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  index={index}
                  onView={handleViewProduct}
                  onEdit={() => navigate(`/product/edit/${product.slug}`)}
                  onDelete={handleDeleteProduct}
                  onRetryEdit={retryEditProduct}
                  isLast={index === products.length - 1}
                  lastProductElementRef={lastProductElementRef}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Loading indicator para infinite scroll */}
        {pagination.loading && (
          <div className="p-4 text-center">
            <InlineLoading message="Cargando más productos..." />
          </div>
        )}
      </div>

      {/* Diálogo de producto */}
      {ui.openDialog && (
        <ProductDialog
          product={selectedProduct}
          mode={ui.dialogMode}
          onClose={() => setUi(prev => ({ ...prev, openDialog: false }))}
          onEdit={() => {
            setUi(prev => ({ ...prev, openDialog: false }));
            navigate(`/product/edit/${selectedProduct.slug}`);
          }}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={hideDeleteConfirmation}
        onConfirm={confirmDeleteProduct}
        title="Eliminar Producto"
        message="¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer."
      />
    </div>
  );
};

// Función helper para obtener URL de imagen
function getImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return RESOURCE_URL(url);
  return url;
}

export default React.memo(ProductListOptimized);
