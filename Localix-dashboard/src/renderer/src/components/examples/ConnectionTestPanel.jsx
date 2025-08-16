import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const ConnectionTestPanel = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Contexto no disponible</div>;
  }

  const { 
    connectionError, 
    isCheckingConnection, 
    retryConnection, 
    checkConnection 
  } = context;

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border max-w-sm z-50">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
        🔧 Panel de Prueba de Conexión
      </h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300">Estado:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            connectionError 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {connectionError ? '❌ Sin Conexión' : '✅ Conectado'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300">Verificando:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            isCheckingConnection 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {isCheckingConnection ? '🔄 Verificando...' : '⏸️ Inactivo'}
          </span>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <button
          onClick={checkConnection}
          disabled={isCheckingConnection}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-xs py-2 px-3 rounded transition-colors"
        >
          🔍 Verificar Conexión
        </button>
        
        <button
          onClick={retryConnection}
          disabled={isCheckingConnection}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-xs py-2 px-3 rounded transition-colors"
        >
          🔄 Reintentar
        </button>
        
        <button
          onClick={() => {
            // Simular error de conexión cambiando la URL temporalmente
            const originalBaseURL = context.api?.defaults?.baseURL;
            if (originalBaseURL) {
              context.api.defaults.baseURL = 'http://localhost:9999';
              setTimeout(() => {
                context.api.defaults.baseURL = originalBaseURL;
              }, 2000);
            }
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded transition-colors"
        >
          🧪 Simular Error
        </button>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        💡 Usa este panel para probar el sistema de detección de errores de conexión
      </div>
    </div>
  );
};

export default ConnectionTestPanel;
