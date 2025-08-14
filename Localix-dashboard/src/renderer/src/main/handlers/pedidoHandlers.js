// Handler para obtener todos los pedidos
export const getPedidos = async () => {
  try {
    const response = await window.pedidosAPI.obtenerTodos();
    return response;
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    throw error;
  }
};

// Handler para obtener un pedido específico
export const getPedido = async (pedidoId) => {
  try {
    const response = await window.pedidosAPI.obtenerPorId(pedidoId);
    return response;
  } catch (error) {
    console.error('Error obteniendo pedido:', error);
    throw error;
  }
};

// Handler para actualizar un pedido
export const updatePedido = async (pedidoId, pedidoData) => {
  try {
    const response = await window.pedidosAPI.actualizar(pedidoId, pedidoData);
    return response;
  } catch (error) {
    console.error('Error actualizando pedido:', error);
    throw error;
  }
};

// Handler para cambiar el estado de un pedido
export const cambiarEstadoPedido = async (pedidoId, nuevoEstado, notas = '') => {
  try {
    const response = await window.pedidosAPI.cambiarEstado(pedidoId, {
      estado_pedido: nuevoEstado,
      notas: notas,
    });
    return response;
  } catch (error) {
    console.error('Error cambiando estado del pedido:', error);
    throw error;
  }
};

// Handler para obtener el historial de un pedido
export const getHistorialPedido = async (pedidoId) => {
  try {
    const response = await window.pedidosAPI.obtenerHistorial(pedidoId);
    return response;
  } catch (error) {
    console.error('Error obteniendo historial del pedido:', error);
    throw error;
  }
};

// Handler para obtener estadísticas de pedidos
export const getEstadisticasPedidos = async () => {
  try {
    const response = await window.pedidosAPI.obtenerEstadisticas();
    return response;
  } catch (error) {
    console.error('Error obteniendo estadísticas de pedidos:', error);
    throw error;
  }
};

// Handler para eliminar un pedido
export const deletePedido = async (pedidoId) => {
  try {
    const response = await window.pedidosAPI.eliminar(pedidoId);
    return response;
  } catch (error) {
    console.error('Error eliminando pedido:', error);
    throw error;
  }
}; 