import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Box, 
  ShoppingCart, 
  Users, 
  Settings,
  BarChart2,
  FileText,
  HelpCircle,
  PlusCircle,
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Package,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Sun
} from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useOrderNotifications } from '../../context/OrderNotificationsContext';
import { useSettings } from '../../context/SettingsContext';
import SettingsPanel from './SettingsPanel';
import ThemeIndicator from './ThemeIndicator';
import localixLogo from '../../img/localix-logo.png';

const Sidebar = ({ collapsed = false, onToggle }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { newOrders, clearOrderNotifications, removeOrderNotification, getNotificationsSummary } = useOrderNotifications();
  const { settings } = useSettings();

  // Cerrar sidebar en móvil al navegar
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location, isMobile]);

  // Limpiar notificaciones cuando se visite la página de pedidos
  useEffect(() => {
    if (location.pathname === '/orders' && newOrders.length > 0) {
      console.log('🔔 Usuario visitó la página de pedidos, limpiando notificaciones...');
      clearOrderNotifications();
    }
  }, [location.pathname, newOrders.length, clearOrderNotifications]);

  const toggleMobileSidebar = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileOpen(false);
  }, []);

  // Función para navegar a pedidos y mostrar detalle específico
  const handleOrderClick = (order) => {
    console.log('🔍 Navegando a detalles del pedido:', order.numero_venta);
    
    // Navegar a la página de pedidos con el ID del pedido específico
    navigate('/orders', { 
      state: { 
        selectedOrderId: order.id,
        selectedOrderNumber: order.numero_venta,
        orderData: order
      } 
    });
    
    // Cerrar sidebar móvil si está abierto
    if (isMobile) {
      closeMobileSidebar();
    }
  };

  // Función para eliminar una notificación específica
  const handleRemoveNotification = (e, orderId) => {
    e.stopPropagation(); // Evitar que se navegue a pedidos
    removeOrderNotification(orderId);
  };

  // Función para formatear tiempo relativo
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)}d`;
  };

  // Función para obtener color del estado
  const getStatusColor = (order) => {
    // Si es una venta reciente, usar verde
    const now = new Date();
    const orderTime = new Date(order.timestamp);
    const diffInMinutes = (now - orderTime) / (1000 * 60);
    
    if (diffInMinutes < 30) return 'text-blue-400 bg-blue-900/30 border-blue-700/30';
    if (diffInMinutes < 120) return 'text-blue-400 bg-blue-900/30 border-blue-700/30';
    return 'text-yellow-400 bg-yellow-900/30 border-yellow-700/30';
  };

  // Grupos de navegación con textos fijos en español
  const navGroups = [
    {
      title: 'Panel',
      items: [
        { path: '/', icon: Home, label: 'Panel' }
      ]
    },
    {
      title: 'Gestión',
      items: [
        { path: '/products', icon: Box, label: 'Productos' },
        { path: '/categories', icon: Box, label: 'Categorías' },
        { 
          path: '/orders', 
          icon: ShoppingCart, 
          label: 'Pedidos',
          hasNotifications: newOrders.length > 0,
          notificationCount: newOrders.length
        },
        { path: '/customers', icon: Users, label: 'Clientes' },
      ]
    },
    {
      title: 'Ventas rápidas',
      items: [
        { path: '/quick-sales', icon: PlusCircle, label: 'Ventas rápidas' }
      ]
    },
    {
      title: 'Sistema',
      items: [
        { 
          path: '#', 
          icon: Settings, 
          label: 'Configuración',
          onClick: () => setSettingsPanelOpen(true),
          isButton: true
        },
        { path: '/help', icon: HelpCircle, label: 'Ayuda' }
      ]
    }
  ];

  // Estilo para items de navegación
  const navItemStyle = ({ isActive }) => `
    flex items-center rounded-lg transition-all duration-200
            hover:bg-theme-sidebar-surface hover:text-theme-sidebar
        ${isActive ? 'bg-theme-accent text-white font-medium shadow-md' : 'text-theme-sidebar-secondary'}
    ${collapsed && !isMobile ? 'p-3 justify-center' : 'p-3'}
  `;

  // Renderizar contenido de navegación
  const renderNavContent = () => (
    <div className="h-full flex flex-col">
      {/* Encabezado */}
      <div className="flex items-center justify-between p-3 border-b border-theme-sidebar bg-theme-primary">
        <div className={`flex items-center gap-2 transition-all duration-300 ${collapsed && !isMobile ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 flex items-center justify-center shadow-lg">
            <img 
              src={localixLogo} 
              alt="Localix Logo" 
              className="w-8 h-8 object-cover rounded-full"
            />
          </div>
          {(!collapsed || isMobile) && (
            <h1 className="text-lg font-extrabold tracking-tight text-white font-serif whitespace-nowrap">
              LOCALIX
            </h1>
          )}
        </div>
        
        {/* Botón de toggle para desktop */}
        {!isMobile && onToggle && (
          <button 
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-theme-sidebar-surface transition-colors text-white"
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
        
        {/* Botón cerrar para móvil */}
        {isMobile && (
          <button 
            onClick={closeMobileSidebar}
            className="p-1 rounded-lg hover:bg-theme-sidebar-surface transition-colors text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title} className={`${collapsed && !isMobile ? 'mb-4' : 'mb-6'}`}>
            {(!collapsed || isMobile) && (
              <h2 className="px-2 py-2 text-xs font-semibold text-theme-sidebar-secondary uppercase tracking-wider">
                {group.title}
              </h2>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.path}>
                  {item.isButton ? (
                    <button
                      onClick={() => {
                        if (item.onClick) item.onClick();
                        if (isMobile) closeMobileSidebar();
                      }}
                      className={navItemStyle({ isActive: false })}
                    >
                      <item.icon size={20} className="flex-shrink-0" />
                      {(!collapsed || isMobile) && (
                        <span className="ml-3 truncate">{item.label}</span>
                      )}
                    </button>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={navItemStyle}
                      onClick={isMobile ? closeMobileSidebar : undefined}
                    >
                      <item.icon size={20} className="flex-shrink-0" />
                      {(!collapsed || isMobile) && (
                        <span className="ml-3 truncate">{item.label}</span>
                      )}
                      {item.hasNotifications && item.notificationCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                          {item.notificationCount}
                        </span>
                      )}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Indicador de tema */}
        {(!collapsed || isMobile) && (
          <div className="mb-4 px-2">
            <ThemeIndicator collapsed={collapsed} />
          </div>
        )}

        {/* Sección de pedidos recientes mejorada */}
        {newOrders.length > 0 && (!collapsed || isMobile) && (
          <div className="mb-4 px-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="notifications-header px-2 py-2 text-xs font-semibold text-theme-sidebar-secondary uppercase tracking-wider flex items-center rounded-lg">
                <Bell size={12} className="mr-2 animate-pulse" />
                Pedidos Recientes
                <span className="notification-badge ml-2 text-white text-xs px-2 py-1 rounded-full">
                  {newOrders.length}
                </span>
              </h2>
              {newOrders.length > 0 && (
                <button
                  onClick={() => clearOrderNotifications()}
                  className="text-theme-sidebar-secondary hover:text-red-400 transition-colors"
                  title="Limpiar todas las notificaciones"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {newOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className={`notification-card notification-enter group relative px-3 py-3 rounded-xl border cursor-pointer ${getStatusColor(order).includes('green') ? 'notification-recent' : getStatusColor(order).includes('blue') ? 'notification-medium' : 'notification-old'}`}
                  onClick={() => handleOrderClick(order)}
                  title={`Click para ir a pedidos y ver detalles del pedido #${order.numero_venta}`}
                >
                  {/* Indicador de estado */}
                  <div className="notification-status-indicator bg-blue-400"></div>
                  
                  {/* Botón eliminar notificación */}
                  <button
                    onClick={(e) => handleRemoveNotification(e, order.id)}
                    className="notification-remove-btn absolute top-2 right-2 p-1 rounded-full"
                    title="Eliminar notificación"
                  >
                    <X size={12} className="text-theme-sidebar-secondary hover:text-red-400" />
                  </button>

                  <div className="flex items-start justify-between mb-2 pl-3">
                    <div className="flex items-center text-sm">
                      <Package size={14} className="mr-2 text-current" />
                      <span className="font-bold">#{order.numero_venta}</span>
                    </div>
                    <span className="text-blue-300 text-xs font-bold">
                      ${parseFloat(order.total).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="pl-3 space-y-1">
                    <div className="text-xs text-theme-sidebar-secondary truncate flex items-center">
                      <Users size={10} className="mr-1" />
                      {order.cliente}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-theme-textSecondary flex items-center">
                        <Clock size={10} className="mr-1" />
                        {getTimeAgo(order.timestamp)}
                      </span>
                      <span className="text-theme-sidebar-secondary flex items-center">
                        <Package size={10} className="mr-1" />
                        {order.items_count} item{order.items_count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  {/* Indicador de navegación */}
                  <div className="absolute bottom-2 right-2">
                    <div className="flex items-center gap-1">
                                             <div className="notification-action-btn p-1 rounded-full flex items-center gap-1">
                         <Eye size={12} className="text-blue-300" />
                         <span className="text-xs text-blue-300 hidden group-hover:inline whitespace-nowrap">Ir a detalles</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {newOrders.length > 5 && (
                <div className="px-3 py-2 text-center border border-theme-sidebar rounded-lg bg-theme-sidebar-surface">
                  <button
                    onClick={() => navigate('/orders')}
                    className="text-xs text-theme-accent hover:text-theme-primary transition-colors font-medium"
                  >
                    +{newOrders.length - 5} pedido{newOrders.length - 5 !== 1 ? 's' : ''} más
                    <br />
                                            <span className="text-theme-sidebar-secondary">Click para ver todos</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );

  // Renderizar sidebar móvil
  if (isMobile) {
    return (
      <>
        {/* Botón hamburguesa */}
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-theme-primary text-white rounded-lg shadow-lg lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeMobileSidebar}
          />
        )}

        {/* Sidebar móvil */}
        <div
          className={`
            fixed left-0 top-0 h-full w-64 bg-theme-sidebar z-50 transform transition-transform duration-300 ease-in-out lg:hidden
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {renderNavContent()}
        </div>

        {/* Panel de configuración */}
        <SettingsPanel 
          isOpen={settingsPanelOpen} 
          onClose={() => setSettingsPanelOpen(false)} 
        />
      </>
    );
  }

  // Renderizar sidebar desktop
  return (
    <>
      <div
        className={`
          fixed left-0 top-0 h-full bg-theme-sidebar z-30 transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        {renderNavContent()}
      </div>

      {/* Panel de configuración */}
      <SettingsPanel 
        isOpen={settingsPanelOpen} 
        onClose={() => setSettingsPanelOpen(false)} 
      />
    </>
  );
};

export default Sidebar;