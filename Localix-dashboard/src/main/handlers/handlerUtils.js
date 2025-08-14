/**
 * Construye un objeto FormData a partir de un objeto de datos, manejando campos anidados y archivos.
 * @param {FormData} formData - La instancia de FormData a la que se agregarán los datos.
 * @param {object} data - El objeto de datos a convertir.
 * @param {string} [parentKey] - La clave padre para la recursión (usado internamente).
 */
function buildFormData(formData, data, parentKey) {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File) && !(data.constructor && data.constructor.name === 'ReadStream')) {
    Object.keys(data).forEach(key => {
      const newKey = parentKey ? `${parentKey}[${key}]` : key;
      buildFormData(formData, data[key], newKey);
    });
  } else if (data !== null && data !== undefined) {
    // FormData solo acepta string, Buffer, ReadStream
    if (typeof data === 'number' || typeof data === 'boolean') {
      formData.append(parentKey, data.toString());
    } else {
      formData.append(parentKey, data);
    }
  }
}

module.exports = { buildFormData };
