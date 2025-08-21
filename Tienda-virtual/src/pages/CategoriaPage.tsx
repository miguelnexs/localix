import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { API_CONFIG, getImageUrlWithFallback } from '../config/api';
import { USER_CONFIG, buildUserApiUrl } from '../config/user';
import { useCategorias } from '../hooks/useCategorias';
import OptimizedImage from '../components/ui/OptimizedImage';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, DollarSign, ArrowLeft, Grid3X3 } from "lucide-react";

interface ProductoVinculado {
  id: number;
  slug: string;
  nombre: string;
  precio: string;
  imagen_principal_url?: string;
}

interface Categoria {
  nombre: string;
  descripcion: string;
  imagen_url: string | null;
  productos_vinculados: ProductoVinculado[];
}

const CategoriaPage = () => {
  const { slug } = useParams();
  const [categoria, setCategoria] = React.useState<Categoria | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Hook para obtener todas las categorías para navegación
  const { categorias: todasCategorias } = useCategorias();

  // Filtros
  const [search, setSearch] = React.useState("");
  const [minPrice, setMinPrice] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState("");

  React.useEffect(() => {
    async function fetchCategoria() {
      setLoading(true);
      setError(null);
      try {
        // Obtener categoría específica del usuario 'admin' con productos vinculados
        const url = buildUserApiUrl(`${API_CONFIG.API_URL}/categorias/${slug}/`, {
          activa: USER_CONFIG.FILTERS.CATEGORIAS_ACTIVAS
        });
        const res = await fetch(url);
        if (!res.ok) throw new Error("No se pudo cargar la categoría");
        const data = await res.json();
        setCategoria(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchCategoria();
  }, [slug]);

  // Filtrado de productos
  const productosFiltrados = React.useMemo(() => {
    if (!categoria) return [];
    return categoria.productos_vinculados.filter((prod) => {
      // Filtro por nombre
      const nombreMatch = prod.nombre.toLowerCase().includes(search.toLowerCase());
      // Filtro por precio
      const precioNum = parseFloat((prod.precio || "0").toString().replace(/[^\d.]/g, ""));
      const min = minPrice ? parseFloat(minPrice) : undefined;
      const max = maxPrice ? parseFloat(maxPrice) : undefined;
      const minOk = min === undefined || precioNum >= min;
      const maxOk = max === undefined || precioNum <= max;
      return nombreMatch && minOk && maxOk;
    });
  }, [categoria, search, minPrice, maxPrice]);

  if (loading) return <div className="text-center py-16 text-neutral-500">Cargando categoría...</div>;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
  if (!categoria) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-6 py-12">
        {/* Navegación superior */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
            <Link to="/" className="hover:text-neutral-900 transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link to="/todas-categorias" className="hover:text-neutral-900 transition-colors">
              Categorías
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">{categoria?.nombre}</span>
          </div>
        </div>

        {/* Encabezado principal */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-neutral-900 mb-2 tracking-tight">{categoria.nombre}</h1>
            <p className="text-neutral-600 max-w-2xl text-lg leading-relaxed">{categoria.descripcion}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/todas-categorias">
              <Button variant="outline" className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                Ver todas las categorías
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>

        {/* Navegación entre categorías */}
        {todasCategorias.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-neutral-700 mb-3">Explorar otras categorías:</h3>
            <div className="flex flex-wrap gap-2">
              {todasCategorias
                .filter(cat => cat.slug !== slug) // Excluir la categoría actual
                .slice(0, 8) // Mostrar máximo 8 categorías
                .map((cat) => (
                  <Link key={cat.slug} to={`/categoria/${cat.slug}`}>
                    <Badge 
                      variant="secondary" 
                      className="hover:bg-neutral-200 transition-colors cursor-pointer px-3 py-1 text-sm"
                    >
                      {cat.nombre}
                    </Badge>
                  </Link>
                ))
              }
              {todasCategorias.length > 9 && (
                <Link to="/todas-categorias">
                  <Badge 
                    variant="outline" 
                    className="hover:bg-neutral-100 transition-colors cursor-pointer px-3 py-1 text-sm"
                  >
                    Ver todas +{todasCategorias.length - 8}
                  </Badge>
                </Link>
              )}
            </div>
          </div>
        )}
        {/* Filtros mejorados */}
        <Card className="mb-10 p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="flex-1 relative">
              <label className="block text-sm text-neutral-700 mb-1 font-medium">Buscar por nombre</label>
              <Input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 h-12 text-base"
              />
              <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-9" />
            </div>
            <div className="relative">
              <label className="block text-sm text-neutral-700 mb-1 font-medium">Precio mínimo</label>
              <Input
                type="number"
                min="0"
                placeholder="Mínimo"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="w-36 pl-10 h-12 text-base"
              />
              <DollarSign className="w-5 h-5 text-neutral-400 absolute left-3 top-9" />
            </div>
            <div className="relative">
              <label className="block text-sm text-neutral-700 mb-1 font-medium">Precio máximo</label>
              <Input
                type="number"
                min="0"
                placeholder="Máximo"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="w-36 pl-10 h-12 text-base"
              />
              <DollarSign className="w-5 h-5 text-neutral-400 absolute left-3 top-9" />
            </div>
          </div>
        </Card>
        {/* Encabezado con contador de productos */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Productos de esta categoría
          </h2>
          <div className="text-sm text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
            {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </div>
        </div>

        {/* Lista de productos */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-neutral-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-medium text-neutral-700 mb-2">
              No hay productos disponibles
            </h3>
            <p className="text-neutral-500 max-w-md mx-auto">
              {search || minPrice || maxPrice 
                ? 'No se encontraron productos que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda.'
                : 'Esta categoría no tiene productos disponibles en este momento.'}
            </p>
            {(search || minPrice || maxPrice) && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  setMinPrice('');
                  setMaxPrice('');
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map((prod) => (
              <Link key={prod.id} to={`/producto/${prod.slug}`} className="group block">
                <Card className="border-0 shadow-md group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/95 h-full">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="aspect-square bg-neutral-100 overflow-hidden rounded-t-lg relative">
                      {prod.imagen_principal_url ? (
                        <OptimizedImage
                          src={prod.imagen_principal_url}
                          alt={prod.nombre}
                          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                          fallbackSrc="/placeholder-product.jpg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📷</div>
                            <p className="text-sm">Sin imagen</p>
                          </div>
                        </div>
                      )}
                      {/* Badge de precio destacado */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                        <span className="text-sm font-semibold text-neutral-900">€{prod.precio}</span>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-base font-medium text-neutral-900 tracking-wide group-hover:text-neutral-700 transition-colors line-clamp-2 mb-2">
                          {prod.nombre}
                        </h4>
                      </div>
                      <div className="mt-auto">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold text-neutral-900">
                            €{prod.precio}
                          </p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            Ver detalles
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriaPage;