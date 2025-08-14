import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';

const CategoriaProductosTable = ({ categoriaSlug, readOnlyProductos, productos, productosVinculados }) => {
  const [productosState, setProductosState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (productosVinculados && Array.isArray(productosVinculados)) {
      setProductosState(productosVinculados);
      setLoading(false);
      return;
    }
    if (readOnlyProductos && Array.isArray(productos)) {
      setProductosState(productos);
      setLoading(false);
      return;
    }
    const fetchProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await window.electronAPI.productos.listar({ categoria_slug: categoriaSlug });
        setProductosState(Array.isArray(res?.results) ? res.results : Array.isArray(res) ? res : []);
      } catch (err) {
        setError(err.message || 'Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [categoriaSlug, readOnlyProductos, productos, productosVinculados]);

  return (
    <div className="min-h-screen bg-theme-background">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <button
          onClick={() => navigate('/categories')}
          className="flex items-center gap-2 px-4 py-2 mb-6 bg-theme-secondary text-theme-textSecondary rounded-lg hover:bg-theme-border transition-colors"
        >
          <ArrowLeft size={18} />
          Volver a Categorías
        </button>
        <h2 className="text-2xl font-semibold text-theme-text mb-6">Productos de la Categoría</h2>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : productosState.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-16 w-16 bg-theme-secondary rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-theme-textSecondary" />
            </div>
            <h3 className="text-lg font-medium text-theme-text mb-2">No hay productos en esta categoría</h3>
            <p className="text-theme-textSecondary mb-4">Agrega productos a esta categoría para verlos aquí.</p>
          </div>
        ) : (
          <div className="bg-theme-surface rounded-lg border border-theme-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-theme-background">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">Imagen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-theme-surface divide-y divide-theme-border">
                  {productosState.map(producto => (
                    <tr key={producto.id || producto.slug} className="hover:bg-theme-background transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {producto.imagen_principal_url ? (
                          <img
                            src={producto.imagen_principal_url}
                            alt={producto.nombre}
                            className="h-10 w-10 rounded-lg object-cover border border-theme-border"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-theme-secondary rounded-lg flex items-center justify-center border border-theme-border">
                            <Package size={18} className="text-theme-textSecondary" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{producto.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{producto.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${producto.precio?.toLocaleString('es-CO')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={parseInt(producto.stock_total_calculado || producto.stock) > 0 ? 'text-blue-600' : 'text-red-600'}>
                          {parseInt(producto.stock_total_calculado || producto.stock) || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          producto.estado === 'publicado'
                            ? 'bg-blue-100 text-blue-800'
                            : producto.estado === 'borrador'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-theme-secondary text-theme-text'
                        }`}>
                          {producto.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriaProductosTable; 