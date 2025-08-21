// Configuración del usuario específico para la tienda virtual
export const USER_CONFIG = {
  // Usuario específico cuyos productos y categorías se mostrarán en la tienda
  USERNAME: 'admin',
  
  // Configuración adicional del usuario
  DISPLAY_NAME: 'Admin Store',
  STORE_DESCRIPTION: 'Tienda oficial del administrador',
  
  // Configuración de filtros
  FILTERS: {
    // Solo mostrar productos públicos del usuario especificado
    PRODUCTOS_PUBLICOS: true,
    // Solo mostrar categorías activas del usuario especificado
    CATEGORIAS_ACTIVAS: true,
  }
};

// Función helper para construir parámetros de consulta con usuario
export const buildUserParams = (additionalParams: Record<string, any> = {}): string => {
  const params = new URLSearchParams({
    usuario: USER_CONFIG.USERNAME,
    ...additionalParams
  });
  return params.toString();
};

// Función para obtener la URL completa con parámetros de usuario
export const buildUserApiUrl = (endpoint: string, additionalParams: Record<string, any> = {}): string => {
  const baseUrl = endpoint.includes('?') ? endpoint : `${endpoint}?`;
  const userParams = buildUserParams(additionalParams);
  return `${baseUrl}${userParams}`;
};