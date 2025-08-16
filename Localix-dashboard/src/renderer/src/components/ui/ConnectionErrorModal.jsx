import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const ConnectionErrorModal = () => {
  const context = useContext(AppContext);
  
  // Verificar que el contexto esté disponible
  if (!context) {
    return null;
  }

  const { connectionError, retryConnection } = context;
  
  if (!connectionError) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
        {/* Icono de error */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-red-600 dark:text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Sin Conexión a la Base de Datos
        </h2>

        {/* Mensaje */}
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
          No se puede establecer conexión con la base de datos del sistema. Esto puede deberse a:
        </p>

        {/* Lista de posibles causas */}
        <ul className="text-sm text-gray-500 dark:text-gray-400 mb-6 space-y-2">
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            El servidor no está ejecutándose
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            Problemas de red
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            La base de datos está fuera de servicio
          </li>
        </ul>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={retryConnection}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reintentar
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Recargar Página
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-xs text-gray-400 dark:text-gray-500 text-center">
          Si el problema persiste, contacta al administrador del sistema
        </div>
      </div>
    </div>
  );
};

export default ConnectionErrorModal;
