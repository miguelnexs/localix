import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search, Plus, RefreshCw, Eye, Edit, Trash2,
  Package, Filter, ArrowUpDown, ChevronDown, ChevronUp,
  CheckCircle, Edit as EditIcon, AlertTriangle, XCircle, TrendingUp, Package2,
  FolderOpen, Settings, Clock, Truck, User, Calendar, DollarSign,
  MapPin, Phone, FileText, CheckSquare, XSquare, Clock as ClockIcon
} from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  getPedidos, 
  getEstadisticasPedidos, 
  deletePedido, 
  cambiarEstadoPedido,
  getHistorialPedido 
} from '../main/handlers/pedidoHandlers';
import PedidoDetailModal from '../components/PedidoDetailModal';
import { jsPDF } from 'jspdf';

const OrdersPage = () => {
  const location = useLocation();
  
  // Estados
  const [data, setData] = useState({
    pedidos: [],
    selectedPedido: null
  });
  
  const [loading, setLoading] = useState({ 
    pedidos: true, 
    initialLoad: true 
  });
  
  const [ui, setUi] = useState({
    openDialog: false,
    dialogMode: 'view', // 'view' | 'edit'
    openNewPedidoDialog: false,
    error: null
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'fecha_creacion', direction: 'desc' });
  const [filterStatus, setFilterStatus] = useState('todos');
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    confirmados: 0,
    enPreparacion: 0,
    enviados: 0,
    entregados: 0,
    cancelados: 0
  });

  // Datos de ejemplo para demostración
  const pedidosEjemplo = [
    {
      id: 1,
      numero_pedido: 'PED-000001',
      cliente: { nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '+51 999 123 456' },
      fecha_creacion: '2024-01-15T10:30:00Z',
      estado_pedido: 'pendiente',
      estado_pago: 'pendiente',
      total_pedido: 299.99,
      productos_count: 3,
      direccion_entrega: 'Av. Arequipa 123, Lima',
      metodo_pago: 'efectivo',
      notas: 'Entregar en horario de oficina'
    },
    {
      id: 2,
      numero_pedido: 'PED-000002',
      cliente: { nombre: 'María García', email: 'maria@email.com', telefono: '+51 999 789 012' },
      fecha_creacion: '2024-01-14T14:20:00Z',
      estado_pedido: 'confirmado',
      estado_pago: 'pagado',
      total_pedido: 159.50,
      productos_count: 2,
      direccion_entrega: 'Jr. Tacna 456, Lima',
      metodo_pago: 'transferencia',
      notas: 'Cliente solicita entrega antes de las 6pm'
    },
    {
      id: 3,
      numero_pedido: 'PED-000003',
      cliente: { nombre: 'Carlos López', email: 'carlos@email.com', telefono: '+51 999 345 678' },
      fecha_creacion: '2024-01-13T09:15:00Z',
      estado_pedido: 'enviado',
      estado_pago: 'pagado',
      total_pedido: 450.00,
      productos_count: 4,
      direccion_entrega: 'Av. La Marina 789, Lima',
      metodo_pago: 'efectivo',
      codigo_seguimiento: 'TRK-123456789',
      empresa_envio: 'Olva Courier'
    },
    {
      id: 4,
      numero_pedido: 'PED-000004',
      cliente: { nombre: 'Ana Rodríguez', email: 'ana@email.com', telefono: '+51 999 901 234' },
      fecha_creacion: '2024-01-12T16:45:00Z',
      estado_pedido: 'entregado',
      estado_pago: 'pagado',
      total_pedido: 89.99,
      productos_count: 1,
      direccion_entrega: 'Calle Los Pinos 321, Lima',
      metodo_pago: 'transferencia',
      fecha_entrega: '2024-01-14T15:30:00Z'
    },
    {
      id: 5,
      numero_pedido: 'PED-000005',
      cliente: { nombre: 'Pedro Sánchez', email: 'pedro@email.com', telefono: '+51 999 567 890' },
      fecha_creacion: '2024-01-11T11:20:00Z',
      estado_pedido: 'cancelado',
      estado_pago: 'cancelado',
      total_pedido: 199.99,
      productos_count: 2,
      direccion_entrega: 'Av. Brasil 654, Lima',
      metodo_pago: 'efectivo',
      notas: 'Cliente canceló por cambio de dirección'
    }
  ];

  // Fetch de pedidos
  const fetchPedidos = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, pedidos: true }));
      setUi(prev => ({ ...prev, error: null }));
      
      console.log('🔄 Iniciando fetch de pedidos...');
      
      // Obtener pedidos del backend
      const pedidosData = await getPedidos();
      
      console.log('📦 Datos recibidos del backend:', pedidosData);
      
      // Verificar el formato de los datos (Django REST Framework con paginación)
      let pedidosArray = [];
      if (Array.isArray(pedidosData)) {
        pedidosArray = pedidosData;
        console.log('✅ Datos recibidos como array directo');
      } else if (pedidosData && Array.isArray(pedidosData.results)) {
        // Django REST Framework con paginación
        pedidosArray = pedidosData.results;
        console.log('✅ Datos recibidos con paginación (results)');
      } else if (pedidosData && Array.isArray(pedidosData.data)) {
        pedidosArray = pedidosData.data;
        console.log('✅ Datos recibidos con estructura data');
      } else if (pedidosData && typeof pedidosData === 'object') {
        // Si es un objeto pero no tiene results, puede ser un solo pedido
        pedidosArray = [pedidosData];
        console.log('✅ Datos recibidos como objeto único');
      } else {
        console.warn('⚠️ Formato de datos inesperado:', pedidosData);
        pedidosArray = [];
      }
      
      console.log('📊 Pedidos procesados:', pedidosArray.length);
      
      setData({
        pedidos: pedidosArray,
        selectedPedido: null
      });
      
      // Obtener estadísticas del backend
      const estadisticasData = await getEstadisticasPedidos();
      
      // Actualizar estadísticas con datos del backend
      setStats({
        total: estadisticasData.total_pedidos || 0,
        pendientes: estadisticasData.pedidos_pendientes || 0,
        confirmados: estadisticasData.pedidos_en_proceso || 0,
        enPreparacion: estadisticasData.pedidos_en_proceso || 0,
        enviados: estadisticasData.pedidos_enviados || 0,
        entregados: estadisticasData.pedidos_entregados || 0,
        cancelados: 0 // El backend no proporciona este dato específico
      });
      
    } catch (err) {
      console.error('Error fetching pedidos:', err);
      setUi(prev => ({ ...prev, error: err.message || 'Error al cargar los pedidos' }));
      setData(prev => ({ ...prev, pedidos: [] }));
    } finally {
      setLoading(prev => ({ ...prev, pedidos: false, initialLoad: false }));
    }
  }, []);

  // Efecto para cargar pedidos
  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  // Efecto para abrir pedido específico desde notificaciones
  useEffect(() => {
    const { selectedOrderId, selectedOrderNumber, orderData } = location.state || {};
    
    if (selectedOrderId && orderData && !loading.pedidos) {
      
      // Buscar el pedido en la lista cargada primero
      let foundPedido = data.pedidos.find(p => 
        p.id === selectedOrderId || 
        p.numero_pedido === selectedOrderNumber ||
        p.numero_venta === selectedOrderNumber
      );
      
      // Si no se encuentra en la lista, crear un pedido temporal con los datos de la notificación
      if (!foundPedido) {
        foundPedido = {
          id: orderData.id,
          numero_pedido: orderData.numero_venta,
          numero_venta: orderData.numero_venta,
          fecha_creacion: orderData.timestamp,
          total_pedido: parseFloat(orderData.total),
          total: parseFloat(orderData.total),
          cliente: {
            nombre: orderData.cliente
          },
          estado: orderData.estado || 'pendiente',
          estado_pedido: orderData.estado || 'pendiente',
          items: orderData.items || [],
          metodo_pago: orderData.metodo_pago || 'No especificado',
          tipo_venta: orderData.tipo_venta || 'fisica',
          observaciones: orderData.observaciones || '',
          precio_envio: orderData.precio_envio || 0,
          vendedor: orderData.vendedor || 'Sistema',
          venta: {
            cliente_nombre: orderData.cliente,
            total: orderData.total,
            metodo_pago: orderData.metodo_pago || 'No especificado'
          }
        };
        
        console.log('📦 Pedido creado temporalmente para mostrar detalles:', foundPedido);
      }
      
      // Abrir el modal con el pedido encontrado o creado
      setData(prev => ({ ...prev, selectedPedido: foundPedido }));
      setUi(prev => ({ ...prev, openDialog: true, dialogMode: 'view' }));
      
      // Limpiar el estado de navegación para evitar que se abra repetidamente
      window.history.replaceState({}, document.title);
      
      // Mostrar toast de confirmación
      toast.success(`Mostrando detalles del pedido #${selectedOrderNumber}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [location.state, data.pedidos, loading.pedidos]);

  // Handlers optimizados
  const openDialogFor = useCallback(async (pedido, mode='view') => {
    try {
      setData(prev => ({ ...prev, selectedPedido: pedido }));
      setUi(prev => ({ ...prev, openDialog: true, dialogMode: mode }));
    } catch (error) {
      console.error('Error opening pedido dialog:', error);
    }
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  // Función para ordenar
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Función para obtener icono de ordenamiento
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="ml-1" />;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp size={14} className="ml-1" /> : 
      <ChevronDown size={14} className="ml-1" />;
  };

  // Calcular estadísticas de pedidos
  const calculateStats = useCallback((pedidos) => {
    const stats = {
      total: pedidos.length,
      pendientes: 0,
      confirmados: 0,
      enPreparacion: 0,
      enviados: 0,
      entregados: 0,
      cancelados: 0
    };
    
    pedidos.forEach(pedido => {
      switch (pedido.estado_pedido) {
        case 'pendiente':
          stats.pendientes++;
          break;
        case 'confirmado':
          stats.confirmados++;
          break;
        case 'en_preparacion':
          stats.enPreparacion++;
          break;
        case 'enviado':
          stats.enviados++;
          break;
        case 'entregado':
          stats.entregados++;
          break;
        case 'cancelado':
          stats.cancelados++;
          break;
      }
    });
    return stats;
  }, []);

  // Ordenar pedidos (asegurar que data.pedidos sea un array)
  const pedidosArray = Array.isArray(data.pedidos) ? data.pedidos : [];
  const sortedPedidos = [...pedidosArray].sort((a, b) => {
    let aValue, bValue;
    
    // Manejo especial para campos anidados
    if (sortConfig.key === 'cliente.nombre') {
      aValue = a.cliente?.nombre || a.venta?.cliente_nombre || '';
      bValue = b.cliente?.nombre || b.venta?.cliente_nombre || '';
    } else {
      aValue = a[sortConfig.key];
      bValue = b[sortConfig.key];
    }
    
    // Manejo especial para fechas
    if (sortConfig.key === 'fecha_creacion') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    // Manejo para valores numéricos
    if (typeof aValue === 'string' && !isNaN(parseFloat(aValue))) {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filtrar por búsqueda y estado (asegurar que sortedPedidos sea un array)
  const pedidosToFilter = Array.isArray(sortedPedidos) ? sortedPedidos : [];
  const filteredPedidos = pedidosToFilter.filter(pedido => {
    const clienteNombre = pedido.cliente?.nombre || pedido.venta?.cliente_nombre || '';
    const clienteEmail = pedido.cliente?.email || '';
    
    const matchesSearch = 
      (pedido.numero_pedido || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      clienteNombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clienteEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'todos' || pedido.estado_pedido === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handlers para CRUD
  const handleCreateSuccess = () => {
    fetchPedidos();
    setUi(prev => ({ ...prev, openDialog: false }));
    toast.success('¡Pedido creado exitosamente!');
  };

  const handleUpdateSuccess = () => {
    fetchPedidos();
    setUi(prev => ({ ...prev, openDialog: false }));
    toast.success('¡Pedido actualizado exitosamente!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      return;
    }
    
    try {
      await deletePedido(id);
      fetchPedidos();
      toast.success('Pedido eliminado exitosamente.');
    } catch (err) {
      console.error('Error eliminando pedido:', err);
      setUi(prev => ({ ...prev, error: err.message }));
      toast.error('Error al eliminar el pedido: ' + (err.message || 'Error desconocido'));
    }
  };

  const handlePrintPedido = (pedido) => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const tienda = {
      nombre: 'Mi Tienda Ejemplo',
      direccion: 'Calle Principal 123, Ciudad, País',
      telefono: '+57 300 123 4567',
      email: 'contacto@mitienda.com',
    };

    // Encabezado elegante
    doc.setFillColor(30, 41, 59); // azul oscuro
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(tienda.nombre, 12, 16);
    doc.setFontSize(11);
    doc.text(`Dirección: ${tienda.direccion}`, 12, 22);
    doc.text(`Tel: ${tienda.telefono}  |  Email: ${tienda.email}`, 110, 22);

    // Línea divisoria
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(1);
    doc.line(10, 30, 200, 30);

    // Datos del pedido y cliente
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(13);
    let y = 38;
    doc.text(`Pedido #: ${pedido.numero_pedido || ''}`, 12, y);
    doc.text(`Fecha: ${pedido.fecha_creacion ? new Date(pedido.fecha_creacion).toLocaleString() : ''}`, 110, y);
    y += 7;
    doc.text(`Cliente: ${pedido.cliente_nombre || (pedido.cliente && pedido.cliente.nombre) || ''}`, 12, y);
    if (pedido.cliente && pedido.cliente.telefono) doc.text(`Teléfono: ${pedido.cliente.telefono}`, 110, y);
    y += 7;
    if (pedido.cliente && pedido.cliente.email) { doc.text(`Email: ${pedido.cliente.email}`, 12, y); y += 7; }
    if (pedido.cliente && pedido.cliente.direccion) { doc.text(`Dirección: ${pedido.cliente.direccion}`, 12, y); y += 7; }
    doc.setFontSize(12);
    doc.text(`Estado: ${pedido.estado_pedido || ''}`, 12, y);
    doc.text(`Método de pago: ${pedido.metodo_pago || ''}`, 110, y);
    y += 10;

    // Tabla de productos elegante
    // Cabecera de la tabla de productos
    doc.setFontSize(11);
    doc.setFillColor(226, 232, 240); // gris claro
    doc.setDrawColor(30, 41, 59);
    doc.rect(10, y, 190, 9, 'F');
    doc.rect(10, y, 190, 9); // Borde de cabecera
    doc.setTextColor(30, 41, 59);
    doc.text('Nombre', 14, y + 6, { align: 'left' });
    doc.text('SKU', 60, y + 6, { align: 'center' });
    doc.text('Color', 90, y + 6, { align: 'center' });
    doc.text('Cantidad', 120, y + 6, { align: 'center' });
    doc.text('Precio', 150, y + 6, { align: 'center' });
    doc.text('Subtotal', 185, y + 6, { align: 'center' });
    y += 18; // Más espacio después de la cabecera
    if (pedido.items && pedido.items.length > 0) {
      let totalGeneral = 0;
      pedido.items.forEach(item => {
        const nombreProducto = (item.producto && item.producto.nombre) || item.producto_nombre || 'Producto';
        const sku = (item.producto && item.producto.sku) || item.sku || '';
        // Restaurar la lógica original para mostrar el color en la columna de color
        let color = '';
        if (item.color) {
          if (typeof item.color === 'object' && item.color.nombre) {
            color = item.color.nombre;
          } else if (typeof item.color === 'string') {
            color = item.color;
          }
        } else if (item.producto) {
          if (item.producto.variante && (item.producto.variante.color_nombre || item.producto.variante.color)) {
            color = item.producto.variante.color_nombre || item.producto.variante.color;
          } else if (item.producto.color_nombre || item.producto.color) {
            color = item.producto.color_nombre || item.producto.color;
          }
        } else if (item.variante && (item.variante.color_nombre || item.variante.color)) {
          color = item.variante.color_nombre || item.variante.color;
        } else if (item.color_nombre || item.color) {
          color = item.color_nombre || item.color;
        }
        // Obtener nombre y código hexadecimal del color
        let colorNombre = item.color_nombre || (item.color && (item.color.nombre || item.color)) || '';
        let colorHex = '';
        if (item.color && typeof item.color === 'object') {
          colorHex = item.color.hex_code || item.color.hex || '';
        }
        // Imprimir el nombre del producto en la columna 'Nombre'
        doc.text(String(nombreProducto), 14, y, { align: 'left' });
        doc.text(String(sku), 60, y, { align: 'center' });
        // Mostrar solo el nombre del color en la celda de la columna 'Color', sin círculo unicode
        doc.text(String(colorNombre), 90, y, { align: 'center' });
        doc.text(String(item.cantidad || ''), 120, y, { align: 'center' });
        const precio = Number(item.precio_unitario);
        const subtotal = Number(item.subtotal);
        totalGeneral += !isNaN(subtotal) ? subtotal : 0;
        doc.text(`$${!isNaN(precio) ? precio.toFixed(2) : ''}`, 150, y, { align: 'center' });
        doc.text(`$${!isNaN(subtotal) ? subtotal.toFixed(2) : ''}`, 185, y, { align: 'center' });
        y += 12;
        if (y > 260) { doc.addPage(); y = 20; }
      });
      // Total general al final de la tabla
      y += 2;
      doc.setFontSize(12);
      doc.setTextColor(37, 99, 235);
      doc.text('TOTAL:', 150, y, { align: 'center' });
      doc.text(`$${totalGeneral.toFixed(2)}`, 185, y, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      y += 10;
    } else {
      doc.setTextColor(120, 120, 120);
      doc.text('No hay productos en este pedido.', 14, y);
      y += 7;
    }
    y += 8; // Más espacio después de la tabla

    // Total destacado
    doc.setFontSize(13);
    doc.setTextColor(37, 99, 235); // azul elegante
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.7);
    doc.line(120, y, 200, y);
    y += 7;
    doc.text(`Total: $${pedido.total?.toFixed(2) || ''}`, 175, y, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    y += 10;

    // Observaciones
    if (pedido.notas) {
      doc.setFontSize(11);
      doc.setFillColor(254, 243, 199); // amarillo suave
      doc.rect(10, y, 190, 10, 'F');
      doc.setTextColor(202, 138, 4);
      doc.text('Observaciones:', 12, y + 6);
      doc.setTextColor(0, 0, 0);
      doc.text(String(pedido.notas), 45, y + 6);
      y += 14;
    }

    // Pie de página elegante
    doc.setFontSize(11);
    doc.setTextColor(120, 120, 120);
    doc.text('¡Gracias por tu compra! Para dudas o soporte, contáctanos.', 12, 290);
    doc.save(`pedido_${pedido.numero_pedido || ''}.pdf`);
  };

  // Función para obtener el color del estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmado':
        return 'bg-blue-100 text-blue-800';
      case 'en_preparacion':
        return 'bg-orange-100 text-orange-800';
      case 'enviado':
        return 'bg-purple-100 text-purple-800';
      case 'entregado':
        return 'bg-blue-100 text-blue-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-theme-secondary text-theme-text';
    }
  };

  // Función para obtener el texto del estado
  const getEstadoText = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'confirmado':
        return 'Confirmado';
      case 'en_preparacion':
        return 'En Preparación';
      case 'enviado':
        return 'Enviado';
      case 'entregado':
        return 'Entregado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Componentes renderizados condicionalmente
  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-600"></div>
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center py-12">
      <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-theme-text mb-2">
        Error al cargar pedidos
      </h3>
      <p className="text-theme-textSecondary mb-4">{ui.error}</p>
      <button
        onClick={handleRefresh}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        <RefreshCw size={16} />
        <span className="font-medium">Reintentar</span>
      </button>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto h-16 w-16 bg-theme-secondary rounded-full flex items-center justify-center mb-4">
        <Package className="h-8 w-8 text-theme-textSecondary" />
      </div>
      <h3 className="text-lg font-medium text-theme-text mb-2">
        {searchQuery ? 'No se encontraron pedidos' : 'No hay pedidos registrados'}
      </h3>
      <p className="text-theme-textSecondary mb-4">
        {searchQuery 
          ? 'Intenta con otros términos de búsqueda.' 
          : 'Los pedidos aparecerán aquí cuando se creen.'
        }
      </p>
      {/* Botón de crear pedido eliminado */}
    </div>
  );

  const renderPedidoRow = (pedido) => (
    <tr key={pedido.id} className="hover:bg-theme-background transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-theme-secondary rounded-lg flex items-center justify-center">
            <Package size={18} className="text-theme-textSecondary" />
          </div>
          <div className="ml-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-700">
                {pedido.numero_pedido}
              </span>
            </div>
            <div className="text-xs text-theme-textSecondary mt-1">
              {formatDate(pedido.fecha_creacion)}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-theme-text">
            {pedido.cliente?.nombre || 'Cliente anónimo'}
          </div>
          <div className="text-xs text-theme-textSecondary">
            {pedido.cliente?.email || pedido.venta?.cliente_nombre || 'Sin email'}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${getEstadoColor(pedido.estado_pedido)}`}
          title="Haz clic para cambiar el estado"
          onClick={() => {
            setData(prev => ({ ...prev, selectedPedido: pedido }));
            setUi(prev => ({ ...prev, openDialog: true, dialogMode: 'view' }));
          }}
        >
          {getEstadoText(pedido.estado_pedido)}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="text-sm text-theme-text">{pedido.productos_count || 0}</div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="text-sm font-medium text-theme-text">
          $ {parseFloat(pedido.total_pedido || 0).toFixed(2)}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => openDialogFor(pedido, 'view')}
            className="flex items-center gap-1 px-2 py-1 bg-theme-secondary text-theme-textSecondary rounded hover:bg-theme-border transition-colors"
            title="Ver detalles"
          >
            <Eye size={14} />
            <span className="text-xs">Ver</span>
          </button>
          {/* <button
            onClick={() => openDialogFor(pedido, 'edit')}
            className="flex items-center gap-1 px-2 py-1 bg-theme-secondary text-theme-textSecondary rounded hover:bg-theme-border transition-colors"
            title="Editar pedido"
          >
            <Edit size={14} />
            <span className="text-xs">Editar</span>
          </button> */}
          <button
            onClick={() => handlePrintPedido(pedido)}
            className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            title="Imprimir pedido en PDF"
          >
            <FileText size={14} />
            <span className="text-xs">PDF</span>
          </button>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              if (window.confirm(`¿Estás seguro de eliminar "${pedido.numero_pedido}"?`)) {
                await handleDelete(pedido.id);
              }
            }}
            className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            title="Eliminar pedido"
          >
            <Trash2 size={14} />
            <span className="text-xs">Eliminar</span>
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading.initialLoad) return renderLoadingState();
  if (ui.error) return renderErrorState();

  return (
    <div className="min-h-screen bg-theme-background">
      {/* Header con diseño sobrio */}
      <div className="bg-theme-surface border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-theme-secondary rounded-lg">
                  <Package className="h-6 w-6 text-theme-textSecondary" />
                </div>
                <h1 className="text-2xl font-semibold text-theme-text">
                  Pedidos
                </h1>
              </div>
              <p className="text-theme-textSecondary">Administra los pedidos de tu tienda</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas de pedidos mejoradas */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Pedidos */}
          <div className="bg-theme-surface rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col items-center group cursor-pointer border border-gray-100">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-3 group-hover:scale-105 transition-transform">
              <Package2 className="text-blue-600" size={32} />
            </div>
            <span className="text-xs text-theme-textSecondary font-medium mb-1">Total Pedidos</span>
            <span className="text-2xl font-bold text-theme-text">{stats.total}</span>
          </div>
          {/* Pendientes */}
          <div className="bg-theme-surface rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col items-center group cursor-pointer border border-gray-100">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 mb-3 group-hover:scale-105 transition-transform">
              <Clock className="text-yellow-600" size={32} />
            </div>
            <span className="text-xs text-theme-textSecondary font-medium mb-1">Pendientes</span>
            <span className="text-2xl font-bold text-yellow-700">{stats.pendientes}</span>
          </div>
          {/* En Proceso */}
          <div className="bg-theme-surface rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col items-center group cursor-pointer border border-gray-100">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 mb-3 group-hover:scale-105 transition-transform">
              <Truck className="text-orange-600" size={32} />
            </div>
            <span className="text-xs text-theme-textSecondary font-medium mb-1">En Proceso</span>
            <span className="text-2xl font-bold text-orange-700">{stats.enPreparacion + stats.confirmados + stats.enviados}</span>
          </div>
          {/* Entregados */}
          <div className="bg-theme-surface rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col items-center group cursor-pointer border border-gray-100">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-3 group-hover:scale-105 transition-transform">
              <CheckCircle className="text-blue-600" size={32} />
            </div>
            <span className="text-xs text-theme-textSecondary font-medium mb-1">Entregados</span>
            <span className="text-2xl font-bold text-blue-700">{stats.entregados}</span>
          </div>
        </div>
      </div>

      {/* Filtros con diseño sobrio */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-theme-surface rounded-lg border border-theme-border p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-theme-textSecondary" />
              <input
                type="text"
                placeholder="Buscar pedidos por número, cliente o email..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full bg-theme-background text-theme-text placeholder-theme-textSecondary"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-theme-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-theme-background text-theme-text"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="confirmado">Confirmados</option>
                <option value="en_preparacion">En Preparación</option>
                <option value="enviado">Enviados</option>
                <option value="entregado">Entregados</option>
                <option value="cancelado">Cancelados</option>
              </select>
              
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-3 py-2 bg-theme-secondary text-theme-textSecondary rounded-lg hover:bg-theme-border transition-colors"
                title="Refrescar"
              >
                <RefreshCw size={16} />
                <span className="text-sm">Refrescar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Pedidos con diseño sobrio */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <div className="bg-theme-surface rounded-lg border border-theme-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-theme-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider cursor-pointer hover:bg-theme-secondary transition-colors"
                      onClick={() => requestSort('numero_pedido')}>
                    <div className="flex items-center">
                      Pedido
                      {getSortIcon('numero_pedido')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider cursor-pointer hover:bg-theme-secondary transition-colors"
                      onClick={() => requestSort('cliente.nombre')}>
                    <div className="flex items-center">
                      Cliente
                      {getSortIcon('cliente.nombre')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider cursor-pointer hover:bg-theme-secondary transition-colors"
                      onClick={() => requestSort('estado_pedido')}>
                    <div className="flex items-center">
                      Estado
                      {getSortIcon('estado_pedido')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider cursor-pointer hover:bg-theme-secondary transition-colors"
                      onClick={() => requestSort('productos_count')}>
                    <div className="flex items-center">
                      Productos
                      {getSortIcon('productos_count')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider cursor-pointer hover:bg-theme-secondary transition-colors"
                      onClick={() => requestSort('total_pedido')}>
                    <div className="flex items-center">
                      Total
                      {getSortIcon('total_pedido')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-theme-textSecondary uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-theme-surface divide-y divide-theme-border">
                {loading.pedidos ? (
                  // Skeleton loading
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`skeleton-${index}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-theme-border rounded-lg animate-pulse"></div>
                          <div className="ml-3">
                            <div className="h-4 bg-theme-border rounded animate-pulse w-32"></div>
                            <div className="h-3 bg-theme-border rounded animate-pulse w-24 mt-2"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-theme-border rounded animate-pulse w-24"></div>
                        <div className="h-3 bg-theme-border rounded animate-pulse w-32 mt-2"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-theme-border rounded animate-pulse w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-theme-border rounded animate-pulse w-8"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-theme-border rounded animate-pulse w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <div className="h-6 bg-theme-border rounded animate-pulse w-12"></div>
                          <div className="h-6 bg-theme-border rounded animate-pulse w-12"></div>
                          <div className="h-6 bg-theme-border rounded animate-pulse w-12"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (filteredPedidos && Array.isArray(filteredPedidos) && filteredPedidos.length === 0) ? (
                  <tr key="empty-state">
                    <td colSpan={6} className="px-6 py-12">
                      {renderEmptyState()}
                    </td>
                  </tr>
                ) : (
                  (filteredPedidos && Array.isArray(filteredPedidos) ? filteredPedidos : []).map(renderPedidoRow)
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de detalles del pedido */}
      <PedidoDetailModal
        pedido={data.selectedPedido}
        isOpen={ui.openDialog && ui.dialogMode === 'view'}
        onClose={() => setUi(prev => ({ ...prev, openDialog: false }))}
        onEstadoCambiado={fetchPedidos}
      />
    </div>
  );
};

// Agregar función utilitaria para convertir hex a rgb
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export default OrdersPage;