// Este hook requiere que React esté instalado y tipado correctamente en el proyecto.
import * as React from "react";
import { API_CONFIG } from '../config/api';
import { USER_CONFIG, buildUserApiUrl } from '../config/user';

export interface ProductColor {
  name: string;
  images: string[];
}

export interface Product {
  id: number;
  name: string;
  price: string;
  priceNumber: number;
  category: string;
  colors: ProductColor[];
  slug: string; // <-- Agregado
}

// Utilidad para asegurar URLs absolutas y seguras
import { getImageUrl } from '../config/api';

export function useProductos() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        // Obtener productos específicos del usuario 'admin'
        const url = buildUserApiUrl(`${API_CONFIG.API_URL}/productos/productos/`, {
          publicos: USER_CONFIG.FILTERS.PRODUCTOS_PUBLICOS
        });
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
        // Soporta respuesta paginada (con results) o array directo
        const productosRaw = Array.isArray(data) ? data : data.results;
        if (!Array.isArray(productosRaw)) throw new Error("La respuesta de la API no es un array de productos");
        // Mapear los productos del backend al formato esperado
        const mapped: Product[] = productosRaw.map((p: any) => ({
          id: p.id,
          name: p.nombre,
          price: `€${p.precio}`,
          priceNumber: Number(p.precio),
          category: p.categoria?.nombre || "Sin categoría",
          colors: [
            {
              name: "Único",
              images: p.imagen_principal_url ? [getImageUrl(p.imagen_principal_url)] : [],
            },
          ],
          slug: p.slug, // <-- Agregado
        }));
        setProducts(mapped);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return { products, loading, error };
}