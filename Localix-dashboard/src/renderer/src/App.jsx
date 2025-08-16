// src/App.jsx
import React from 'react';
import { AppProvider } from './context/AppContext';
import { LoadingProvider } from './context/LoadingContext';
import { OrderNotificationsProvider } from './context/OrderNotificationsContext';
import { PreloadProvider } from './context/PreloadContext';
import { SettingsProvider } from './context/SettingsContext';

import AppRouter from './routes/AppRouter';
import ToastContainer from './components/ui/ToastContainer';
import { GlobalLoadingManager } from './components/ui/LoadingComponents';
import ConnectionErrorModal from './components/ui/ConnectionErrorModal';
import ConnectionStatusIndicator from './components/ui/ConnectionStatusIndicator';
import ErrorBoundary from './components/ui/ErrorBoundary';
import './index.css' // Asegúrate de que esta importación esté correcta

// Suprimir warnings conocidos de bibliotecas externas
if (typeof console !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args.join(' ');
    
    // Suprimir warnings de defaultProps de bibliotecas externas
    if (
      message.includes('Support for defaultProps will be removed') && 
      (message.includes('Chrome2') || 
       message.includes('Checkboard2') || 
       message.includes('ColorPicker2') ||
       message.includes('react-color'))
    ) {
      return; // No mostrar estas advertencias
    }
    
    // Mostrar todas las demás advertencias normalmente
    originalWarn.apply(console, args);
  };
}

// Componente interno que usa el contexto
const AppContent = () => {
  return (
    <div className="app-container">
      {/* Indicador de pre-carga deshabilitado */}
      
      <AppRouter />
      <ToastContainer />
      <GlobalLoadingManager />
      
      {/* Indicador de estado de conexión */}
      <ConnectionStatusIndicator />
      
      {/* Modal de error de conexión */}
      <ConnectionErrorModal />
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <LoadingProvider>
        <AppProvider>
          <OrderNotificationsProvider>
            <PreloadProvider>
              <SettingsProvider>
                <AppContent />
              </SettingsProvider>
            </PreloadProvider>
          </OrderNotificationsProvider>
        </AppProvider>
      </LoadingProvider>
    </ErrorBoundary>
  );
};

export default App;