
import { ShoppingBag, Truck, Shield, Award, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import HamburgerMenu from "@/components/HamburgerMenu";
import HeroCarousel from "@/components/HeroCarousel";
import CartDropdown from "@/components/CartDropdown";
import SocialLinks from "@/components/SocialLinks";
import LocationInfo from "@/components/LocationInfo";
import { Link } from "react-router-dom";
import logoImage from "../../img/logo_Mesa de trabajo 1.png";
import { useProductos } from "../hooks/useProductos";
import { useCategorias } from "../hooks/useCategorias";

const Index = () => {
  const { products, loading, error } = useProductos();
  const { categorias, loading: loadingCategorias, error: errorCategorias } = useCategorias();

  // Agrupar productos por categoría
  const grouped = products.reduce((acc: Record<string, typeof products>, prod) => {
    if (!acc[prod.category]) acc[prod.category] = [];
    acc[prod.category].push(prod);
    return acc;
  }, {} as Record<string, typeof products>);
  const categories = Object.keys(grouped);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Navigation Bar */}
      {/* Buscador */}
      <div className="bg-white px-6 py-4 border-b border-neutral-200">
        <div className="flex items-center space-x-2 max-w-md mx-auto">
          <Search className="w-5 h-5 text-neutral-400" />
          <Input 
            type="text" 
            placeholder="Buscar productos..."
            className="flex-1 border-0 bg-neutral-100 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Categories Grid (catálogos visuales) */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-neutral-900 tracking-wide mb-4">
            Tus CG Indispensables
          </h2>
          <div className="w-24 h-px bg-neutral-300 mx-auto mb-6"></div>
          <Link to="/todos-productos">
            <Button className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-3 text-sm font-medium tracking-wider rounded-sm">
              VER TODOS LOS PRODUCTOS
            </Button>
          </Link>
        </div>
        {loadingCategorias && <div className="text-center text-neutral-500 py-8">Cargando categorías...</div>}
        {errorCategorias && <div className="text-center text-red-500 py-8">{errorCategorias}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {categorias.slice(0, 4).map((cat) => (
            <Link
              key={cat.slug}
              to={`/categoria/${cat.slug}`}
            >
              {/* El div y img están correctamente usados en JSX, pero asegúrate de que no haya errores de sintaxis ni etiquetas mal cerradas */}
              <div className={`group relative h-80 rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm hover:shadow-md transition-all duration-300`}>
                {cat.imagen_url && (
                  <img
                    src={cat.imagen_url}
                    alt={cat.nombre}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300">
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-medium text-white tracking-wide mb-2">
                      {cat.nombre}
                    </h3>
                    <span className="inline-block bg-white/90 text-neutral-900 px-4 py-1 text-sm font-medium tracking-wider rounded-sm">
                      VER COLECCIÓN
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {categorias.length > 4 && (
          <div className="text-center mb-8">
            <Link to="/todas-categorias">
              <Button className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-3 text-sm font-medium tracking-wider rounded-sm">
                VER TODAS LAS CATEGORÍAS
              </Button>
            </Link>
          </div>
        )}

        {loading && <div className="text-center text-neutral-500 py-12">Cargando productos...</div>}
        {error && <div className="text-center text-red-500 py-12">{error}</div>}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center text-neutral-500 py-12">No hay productos disponibles.</div>
        )}

        {/* Products by Category */}
        {categories.map((category) => (
          <div key={category} className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-light text-neutral-900 tracking-wide mb-4">
                {category}
              </h3>
              <div className="w-16 h-px bg-neutral-300 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {grouped[category].map((product) => (
                <Link 
                  key={product.id}
                  to={`/producto/${product.slug}`}
                  className="group block"
                >
                  <Card className="border-0 shadow-none group cursor-pointer">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-neutral-100 mb-4 overflow-hidden rounded-lg">
                        <img 
                          src={product.colors[0]?.images[0] || ''} 
                          alt={product.name}
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="space-y-1 text-center">
                        <h4 className="text-sm font-medium text-neutral-900 tracking-wide">
                          {product.name}
                        </h4>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider">
                          {category}
                        </p>
                        <p className="text-sm font-semibold text-neutral-900">
                          {product.price}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Location and Contact Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-light text-neutral-900 mb-6">
                Visítanos en Pereira
              </h2>
              <p className="text-neutral-600 mb-8 leading-relaxed">
                Te esperamos en nuestra tienda física donde podrás ver y sentir 
                la calidad de nuestros productos. Nuestro equipo estará encantado 
                de ayudarte a encontrar el accesorio perfecto.
              </p>
              <LocationInfo />
            </div>
            <div className="h-96 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.6123456789!2d-75.6963892!3d4.8132841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3877d9b8c6f1a3%3A0x1234567890abcdef!2sCarrera%207%20%2317-45%2C%20Pereira%2C%20Risaralda%2C%20Colombia!5e0!3m2!1ses!2sco!4v1234567890123!5m2!1ses!2sco"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de cgcaroGonzalez"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="bg-neutral-100 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-3">
              <Truck className="w-8 h-8 text-neutral-700 mx-auto" />
              <h3 className="text-sm font-medium text-neutral-900 tracking-wide">
                Envíos Gratuitos
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Entrega en 24-48h para pedidos superiores a €300
              </p>
              <div className="text-xs text-neutral-400 font-mono">
                Metric heathesion: 0.95
              </div>
            </div>
            <div className="text-center space-y-3">
              <Award className="w-8 h-8 text-neutral-700 mx-auto" />
              <h3 className="text-sm font-medium text-neutral-900 tracking-wide">
                Alibretas de Cuero
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Materiales premium seleccionados artesanalmente
              </p>
              <div className="text-xs text-neutral-400 font-mono">
                Quality index: 9.8/10
              </div>
            </div>
            <div className="text-center space-y-3">
              <Shield className="w-8 h-8 text-neutral-700 mx-auto" />
              <h3 className="text-sm font-medium text-neutral-900 tracking-wide">
                Garantía Extendida
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                2 años de garantía en todos nuestros productos
              </p>
              <div className="text-xs text-neutral-400 font-mono">
                Reliability: 99.2%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-light text-neutral-900 mb-4 tracking-wide">
            Cosmetique Socialista
          </h2>
          <p className="text-neutral-600 text-sm mb-8 max-w-md mx-auto">
            Suscríbete para recibir las últimas colecciones y ofertas exclusivas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-neutral-500"
            />
            <Button className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-2 text-sm">
              Suscribir
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-neutral-200 font-medium mb-4 text-sm tracking-wide">
                cgcaroGonzalez
              </h4>
              <p className="text-xs leading-relaxed mb-4">
                Elegancia minimalista para el mundo moderno
              </p>
              <SocialLinks variant="footer" />
            </div>
            <div>
              <h4 className="text-neutral-200 font-medium mb-4 text-sm tracking-wide">
                Productos
              </h4>
              <ul className="space-y-2 text-xs">
                {categories.map((category) => (
                  <li key={category}>
                    <Link to="#" className="hover:text-neutral-200 transition-colors">
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-neutral-200 font-medium mb-4 text-sm tracking-wide">
                Información
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/ventas" className="hover:text-neutral-200 transition-colors">Ofertas</Link></li>
                <li><Link to="/politicas-privacidad" className="hover:text-neutral-200 transition-colors">Privacidad</Link></li>
                <li><Link to="/terminos-condiciones" className="hover:text-neutral-200 transition-colors">Términos</Link></li>
                <li><Link to="/checkout" className="hover:text-neutral-200 transition-colors">Checkout</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-neutral-200 font-medium mb-4 text-sm tracking-wide">
                Contacto
              </h4>
              <div className="text-xs space-y-2">
                <p>Carrera 7 #17-45</p>
                <p>Pereira, Colombia</p>
                <p>+57 300 123 4567</p>
                <p>contacto@cgcarogonzalez.com</p>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center">
            <p className="text-xs text-neutral-500">
              © 2024 cgcaroGonzalez. Todos los derechos reservados.
            </p>
            <div className="text-xs text-neutral-600 font-mono mt-2">
              Technical coefficient: α = 1.618 | Performance index: 94.2%
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
