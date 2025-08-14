import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import MainLayout from '../components/layout/MainLayout';

// Pages
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductsPage';
import OrdersPage from '../pages/OrdersPage';
import CustomerPage from '../pages/CustomerPage';
import CategoriesPage from '../pages/CategoriesPage';
import ProductPage from '../pages/ProductPage';
import ProductFormPage from '../pages/ProductFormPage';
import VentasPage from '../pages/VentasPage';
import HelpPage from '../pages/HelpPage';

// Components
import ThemeDemo from '../components/ui/ThemeDemo';
import ScrollbarDemo from '../components/ui/ScrollbarDemo';
import TypographyDemo from '../components/ui/TypographyDemo';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta principal con layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="product/new" element={<ProductFormPage />} />
          <Route path="product/edit/:slug" element={<ProductFormPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categoria/:slug" element={<CategoriesPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<CustomerPage />} />
          <Route path="quick-sales" element={<VentasPage />} />
                      <Route path="theme-demo" element={<ThemeDemo />} />
            <Route path="scrollbar-demo" element={<ScrollbarDemo />} />
            <Route path="typography-demo" element={<TypographyDemo />} />
          {/* Eliminada la ruta de Analíticas */}
        </Route>

        {/* Página de producto individual (puede ir fuera si es un detalle público) */}
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/help" element={<HelpPage />} />

        {/* Ruta 404 - Opcional pero recomendado */}
      </Routes>
    </Router>
  );
};

export default AppRouter;