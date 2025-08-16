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
import { generarPDFPedido } from '../utils/pedidoPDFGenerator.js';





// Componentes UI estandarizados
import DataTable from '../components/ui/DataTable';
import ActionButtons from '../components/ui/ActionButtons';

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

  // Configuración de columnas para la tabla estandarizada
  const getPedidoColumns = (onView, onEdit, onDelete, onPrint) => [
    {
      key: 'pedido',
      label: 'Pedido',
      sortable: true,
      render: (pedido) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-8 h-8">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-theme-text truncate">
              {pedido.numero_pedido}
            </p>
            <p className="text-xs text-theme-textSecondary truncate">
              {new Date(pedido.fecha_creacion).toLocaleDateString()}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'cliente',
      label: 'Cliente',
      sortable: true,
      render: (pedido) => (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-theme-text">
              {pedido.cliente?.nombre || 'Cliente anónimo'}
            </p>
            <p className="text-xs text-theme-textSecondary">
              {pedido.cliente?.telefono || 'Sin teléfono'}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'estado_pedido',
      label: 'Estado',
      sortable: true,
      render: (pedido) => {
        const estados = {
          pendiente: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
          confirmado: { color: 'bg-blue-100 text-blue-800', icon: CheckSquare },
          en_preparacion: { color: 'bg-orange-100 text-orange-800', icon: Package },
          enviado: { color: 'bg-purple-100 text-purple-800', icon: Truck },
          entregado: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
          cancelado: { color: 'bg-red-100 text-red-800', icon: XSquare }
        };
        
        const estado = estados[pedido.estado_pedido] || estados.pendiente;
        const IconComponent = estado.icon;
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estado.color}`}>
            <IconComponent className="w-3 h-3 mr-1" />
            {pedido.estado_pedido?.replace('_', ' ').toUpperCase()}
          </span>
        );
      }
    },
    {
      key: 'productos_count',
      label: 'Productos',
      sortable: true,
      render: (pedido) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {pedido.productos_count || 0} items
        </span>
      )
    },
    {
      key: 'total_pedido',
      label: 'Total',
      sortable: true,
      align: 'right',
      render: (pedido) => (
        <div className="text-right">
          <p className="text-sm font-medium text-theme-text">
            ${parseFloat(pedido.total_pedido || 0).toFixed(2)}
          </p>
          <p className="text-xs text-theme-textSecondary">
            {pedido.estado_pago === 'pagado' ? 'Pagado' : 'Pendiente'}
          </p>
        </div>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      sortable: false,
      render: (pedido) => (
        <ActionButtons
          onView={() => onView(pedido)}
          onEdit={() => onEdit(pedido)}
          onDelete={() => onDelete(pedido)}
          onPrint={() => onPrint(pedido)}
          showPrint={true}
          size="sm"
          variant="compact"
        />
      )
    }
  ];

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

  const handlePrintPedido = async (pedido) => {
    try {
      console.log('🖨️ Iniciando generación de PDF para pedido:', pedido.numero_pedido);
      
      // Usar el nuevo generador de PDFs con HTML
      await generarPDFPedido(pedido, true);
      
      toast.success(`PDF del pedido ${pedido.numero_pedido} generado exitosamente`, {
        position: "top-right",
        autoClose: 3000,
      });
      
    } catch (error) {
      console.error('❌ Error al generar PDF del pedido:', error);
      toast.error('Error al generar el PDF del pedido: ' + (error.message || 'Error desconocido'), {
        position: "top-right",
        autoClose: 5000,
      });
    }
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

  // Función de prueba para el PDF de pedidos
  const testPedidoPDF = async () => {
    console.log('🧪 Iniciando prueba de PDF de pedido...');
    
    const testPedido = {
      numero_pedido: 'TEST-001',
      fecha_creacion: new Date().toISOString(),
      cliente_nombre: 'Cliente de Prueba',
      estado_pedido: 'pendiente',
      metodo_pago: 'efectivo',
      items: [
        {
          producto_nombre: 'Producto de Prueba',
          sku: 'SKU-001',
          cantidad: 2,
          precio_unitario: 100,
          subtotal: 200
        }
      ]
    };
    
    try {
      await handlePrintPedido(testPedido);
      console.log('✅ Prueba de PDF completada');
    } catch (error) {
      console.error('❌ Error en la prueba:', error);
    }
  };

  // Exponer la función de prueba globalmente
  if (typeof window !== 'undefined') {
    window.testPedidoPDF = testPedidoPDF;
  }

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

      {/* Tabla de Pedidos estandarizada */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <DataTable
          columns={getPedidoColumns(openDialogFor, null, handleDelete, handlePrintPedido)}
          data={filteredPedidos || []}
          sortConfig={sortConfig}
          onSort={requestSort}
          loading={loading.pedidos}
          emptyMessage="No hay pedidos disponibles"
          size="md"
          striped={true}
          hover={true}
        />
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