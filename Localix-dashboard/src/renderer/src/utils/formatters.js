/**
 * Utilidades para formatear valores en el frontend
 */

/**
 * Formatea un precio de manera segura con símbolo de moneda
 * @param {number|string|null|undefined} price - El precio a formatear
 * @param {string} currency - Símbolo de moneda (por defecto '$')
 * @returns {string} El precio formateado como string con símbolo de moneda
 */
export const formatPrice = (price, currency = '$') => {
  if (price === null || price === undefined) return `${currency} 0.00`;
  const numPrice = typeof price === 'number' ? price : parseFloat(price);
  return isNaN(numPrice) ? `${currency} 0.00` : `${currency} ${numPrice.toFixed(2)}`;
};

/**
 * Formatea un número de manera segura
 * @param {number|string|null|undefined} value - El valor a formatear
 * @param {number} decimals - Número de decimales (por defecto 2)
 * @returns {string} El valor formateado como string
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return `0.${'0'.repeat(decimals)}`;
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  return isNaN(numValue) ? `0.${'0'.repeat(decimals)}` : numValue.toFixed(decimals);
};

/**
 * Formatea un porcentaje de manera segura
 * @param {number|string|null|undefined} value - El valor a formatear
 * @returns {string} El porcentaje formateado como string
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined) return '0.00%';
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  return isNaN(numValue) ? '0.00%' : `${numValue.toFixed(2)}%`;
};

/**
 * Formatea una cantidad de manera segura
 * @param {number|string|null|undefined} value - El valor a formatear
 * @returns {string} La cantidad formateada como string
 */
export const formatQuantity = (value) => {
  if (value === null || value === undefined) return '0';
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  return isNaN(numValue) ? '0' : Math.floor(numValue).toString();
};

/**
 * Formatea una fecha de manera segura
 * @param {string|Date|null|undefined} date - La fecha a formatear
 * @returns {string} La fecha formateada como string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES');
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Formatea una fecha y hora de manera segura
 * @param {string|Date|null|undefined} date - La fecha a formatear
 * @returns {string} La fecha y hora formateada como string
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('es-ES');
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Formatea un precio en pesos colombianos
 * @param {number|string|null|undefined} price - El precio a formatear
 * @returns {string} El precio formateado en pesos colombianos
 */
export const formatPriceCOP = (price) => {
  return formatPrice(price, '$');
}; 