import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import BolsosGrandes from "./pages/BolsosGrandes";
import BolsosPequenos from "./pages/BolsosPequenos";
import Canguros from "./pages/Canguros";
import Billeteras from "./pages/Billeteras";
import Complementos from "./pages/Complementos";
import Carpetas from "./pages/Carpetas";
import PasaporteGuarda from "./pages/PasaporteGuarda";
import Cosmeteria from "./pages/Cosmeteria";
import Ventas from "./pages/Ventas";
import PoliticasPrivacidad from "./pages/PoliticasPrivacidad";
import TerminosCondiciones from "./pages/TerminosCondiciones";
import ProductoDetalle from "./pages/ProductoDetalle";
import TodosProductos from "./pages/TodosProductos";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import CategoriaPage from "./pages/CategoriaPage";
import TodasCategorias from "./pages/TodasCategorias";
import Header from "./components/Header";
import CookiesNotice from "./components/ui/CookiesNotice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CookiesNotice />
        <BrowserRouter>
          <Routes>
              <Route path="/" element={
                <>
                  <Header />
                  <Index />
                </>
              } />
            <Route path="/bolsos-grandes" element={
              <>
                <Header />
                <BolsosGrandes />
              </>
            } />
            <Route path="/bolsos-pequenos" element={
              <>
                <Header />
                <BolsosPequenos />
              </>
            } />
            <Route path="/canguros" element={
              <>
                <Header />
                <Canguros />
              </>
            } />
            <Route path="/billeteras" element={
              <>
                <Header />
                <Billeteras />
              </>
            } />
            <Route path="/complementos" element={
              <>
                <Header />
                <Complementos />
              </>
            } />
            <Route path="/carpetas" element={
              <>
                <Header />
                <Carpetas />
              </>
            } />
            <Route path="/pasaporte-guarda" element={
              <>
                <Header />
                <PasaporteGuarda />
              </>
            } />
            <Route path="/cosmeteria" element={
              <>
                <Header />
                <Cosmeteria />
              </>
            } />
            <Route path="/ventas" element={
              <>
                <Header />
                <Ventas />
              </>
            } />
            <Route path="/todos-productos" element={
              <>
                <Header />
                <TodosProductos />
              </>
            } />
            <Route path="/todas-categorias" element={
              <>
                <Header />
                <TodasCategorias />
              </>
            } />
            <Route path="/checkout" element={
              <>
                <Header />
                <Checkout />
              </>
            } />
            <Route path="/politicas-privacidad" element={
              <>
                <Header />
                <PoliticasPrivacidad />
              </>
            } />
            <Route path="/terminos-condiciones" element={
              <>
                <Header />
                <TerminosCondiciones />
              </>
            } />
            <Route path="/producto/:slug" element={
              <>
                <Header />
                <ProductoDetalle />
              </>
            } />
            <Route path="/categoria/:slug" element={
              <>
                <Header />
                <CategoriaPage />
              </>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
