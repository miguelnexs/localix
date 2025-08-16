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

// Componentes UI estandarizados
import DataTable from '../ui/DataTable';
import ActionButtons from '../ui/ActionButtons';

// Hooks y utilidades optimizadas
import { useToast } from '../../hooks/useToast';
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation';
import { useProductListOptimized } from '../../hooks/useProductListOptimized';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';
import { formatPrice } from '../../utils/formatters';
import { RESOURCE_URL } from '../../api/apiConfig';
import { useLoadingState, InlineLoading, ErrorState, CardSkeleton } from '../ui/LoadingComponents';

// Función para obtener URL de imagen
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${RESOURCE_URL}${imagePath}`;
};

// Configuración de columnas para la tabla estandarizada
const getProductColumns = (onView, onEdit, onDelete, onRetryEdit) => {
  const navigate = useNavigate();
  
  const handleEdit = (product) => {
    if (product.slug && product.slug !== 'producto' && product.slug !== ':1') {
      navigate(`/product/edit/${product.slug}`);
    } else {
      onRetryEdit(product.id);
    }
  };

  return [
    {
      key: 'producto',
      label: 'Producto',
      sortable: true,
      render: (product) => (
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
      )
    },
    {
      key: 'precio',
      label: 'Precio',
      sortable: true,
      render: (product) => formatPrice(product.precio)
    },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      render: (product) => <ProductStatusChip status={product.estado} />
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (product) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          product.stock > 0 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {product.stock} unidades
        </span>
      )
    },
    {
      key: 'categoria',
      label: 'Categoría',
      sortable: true,
      render: (product) => product.categoria?.nombre || 'Sin categoría'
    },
    {
      key: 'fecha_creacion',
      label: 'Fecha',
      sortable: true,
      render: (product) => new Date(product.fecha_creacion).toLocaleDateString()
    },
    {
      key: 'acciones',
      label: 'Acciones',
      sortable: false,
      render: (product) => (
        <ActionButtons
          onView={() => onView(product)}
          onEdit={() => handleEdit(product)}
          onDelete={() => onDelete(product)}
          size="sm"
          variant="compact"
        />
      )
    }
  ];
};

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

      {/* Tabla de productos estandarizada */}
      <DataTable
        columns={getProductColumns(handleViewProduct, null, handleDeleteProduct, retryEditProduct)}
        data={products}
        sortConfig={sortConfig}
        onSort={handleSort}
        loading={pagination.loading}
        emptyMessage="No hay productos disponibles"
        size="md"
        striped={true}
        hover={true}
      />

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
