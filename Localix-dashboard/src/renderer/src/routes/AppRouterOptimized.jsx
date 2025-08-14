import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import MainLayout from '../components/layout/MainLayout';

// Loading component para lazy loading
const PageLoading = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Lazy loading para páginas optimizadas
const DashboardPageOptimized = lazy(() => import('../pages/DashboardPageOptimized'));
const ProductListOptimized = lazy(() => import('../components/productos/ProductListOptimized'));
const ProductFormPage = lazy(() => import('../pages/ProductFormPage'));
const OrdersPage = lazy(() => import('../pages/OrdersPage'));
const CustomerPage = lazy(() => import('../pages/CustomerPage'));
const CategoriesPage = lazy(() => import('../pages/CategoriesPage'));
const ProductPage = lazy(() => import('../pages/ProductPage'));
const VentasPage = lazy(() => import('../pages/VentasPage'));
const HelpPage = lazy(() => import('../pages/HelpPage'));

// Componente wrapper para Suspense
const LazyPage = ({ children }) => (
  <Suspense fallback={<PageLoading />}>
    {children}
  </Suspense>
);

const AppRouterOptimized = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta principal con layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={
            <LazyPage>
              <DashboardPageOptimized />
            </LazyPage>
          } />
          <Route path="products" element={
            <LazyPage>
              <ProductListOptimized />
            </LazyPage>
          } />
          <Route path="product/new" element={
            <LazyPage>
              <ProductFormPage />
            </LazyPage>
          } />
          <Route path="product/edit/:slug" element={
            <LazyPage>
              <ProductFormPage />
            </LazyPage>
          } />
          <Route path="/categories" element={
            <LazyPage>
              <CategoriesPage />
            </LazyPage>
          } />
          <Route path="/categoria/:slug" element={
            <LazyPage>
              <CategoriesPage />
            </LazyPage>
          } />
          <Route path="orders" element={
            <LazyPage>
              <OrdersPage />
            </LazyPage>
          } />
          <Route path="customers" element={
            <LazyPage>
              <CustomerPage />
            </LazyPage>
          } />
          <Route path="quick-sales" element={
            <LazyPage>
              <VentasPage />
            </LazyPage>
          } />
        </Route>

        {/* Página de producto individual */}
        <Route path="/product/:slug" element={
          <LazyPage>
            <ProductPage />
          </LazyPage>
        } />
        <Route path="/help" element={
          <LazyPage>
            <HelpPage />
          </LazyPage>
        } />

        {/* Ruta 404 */}
        <Route path="*" element={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-theme-text mb-4">404</h1>
              <p className="text-theme-textSecondary mb-4">Página no encontrada</p>
              <a 
                href="/" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default AppRouterOptimized;
