import React, { useMemo, lazy, Suspense, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Users, DollarSign, Package, 
  TrendingUp, Activity, CreditCard, Star,
  Plus, Search, Filter, Download, RefreshCw, Loader, AlertTriangle, CheckCircle,
  ArrowUp, ArrowDown, Eye, ShoppingCart, Clock, Zap,
  Store, BarChart3, PieChart as PieChartIcon, LineChart, Calendar, Bell,
  UserPlus, PackagePlus, TrendingDown, Target, Sparkles, FolderOpen
} from 'lucide-react';
import OrderStatusBadge from '../components/OrderStatusBadge';
import DashboardSkeleton from '../components/ui/DashboardSkeleton';
import { useDashboardOptimized } from '../hooks/useDashboardOptimized';
import clsx from 'clsx';

// Lazy loading para componentes pesados
const BarChart = lazy(() => import('../components/charts/BarChart'));
const PieChart = lazy(() => import('../components/charts/PieChart'));

// Componentes memoizados para mejor rendimiento
const KPICard = React.memo(({ title, value, icon: Icon, change, changeType, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-theme-surface rounded-lg border border-theme-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-theme-textSecondary">{title}</p>
          <p className="text-2xl font-bold text-theme-text">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {changeType === 'up' ? (
                <ArrowUp className="w-4 h-4 text-blue-500" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ml-1 ${changeType === 'up' ? 'text-blue-600' : 'text-red-600'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
});

const QuickActionButton = React.memo(({ action }) => {
  const navigate = useNavigate();
  
  const handleClick = useCallback(() => {
    if (action.route) {
      navigate(action.route);
    } else if (action.action) {
      action.action();
    }
  }, [action, navigate]);

  return (
    <button
      onClick={handleClick}
      className={`p-3 border rounded-lg ${action.color} ${action.hoverColor} transition-colors text-center text-sm font-medium`}
    >
      <div className="flex flex-col items-center space-y-1">
        {action.icon}
        <span>{action.title}</span>
      </div>
    </button>
  );
});

const ChartContainer = React.memo(({ title, icon: Icon, children, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-theme-surface rounded-lg border border-theme-border p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-theme-text">{title}</h3>
          <Icon className="w-4 h-4 text-theme-textSecondary" />
        </div>
        <div className="h-64 bg-theme-secondary animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-theme-surface rounded-lg border border-theme-border p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-theme-text">{title}</h3>
        <Icon className="w-4 h-4 text-theme-textSecondary" />
      </div>
      <div className="h-64">
        {children}
      </div>
    </div>
  );
});

const DashboardPageOptimized = React.memo(() => {
  const navigate = useNavigate();
  const { dashboardData, chartsData, loading, error, refreshData } = useDashboardOptimized();

  // KPIs optimizados desde resumen
  const {
    totalVentas = 0,
    totalIngresos = 0,
    totalIngresosTodos = 0,
    totalPedidos = 0,
    totalClientes = 0,
    totalProductos = 0,
    ticketPromedio = 0,
    pedidosEntregados = 0
  } = dashboardData.resumen || {};

  // Gráfica de ventas optimizada
  const salesData = useMemo(() => {
    const { ventasRecientes } = dashboardData;
    if (!Array.isArray(ventasRecientes) || ventasRecientes.length === 0) {
      return { labels: [], datasets: [{ data: [], label: 'Ventas' }] };
    }

    return {
      labels: ventasRecientes.map(venta => 
        new Date(venta.fecha_venta).toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: '2-digit' 
        })
      ),
      datasets: [{
        label: 'Ventas',
        data: ventasRecientes.map(venta => venta.total || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.4
      }]
    };
  }, [dashboardData.ventasRecientes]);

  // Gráfica de inventario optimizada
  const inventoryData = useMemo(() => {
    const { estadisticas } = dashboardData;
    if (!Array.isArray(estadisticas) || estadisticas.length === 0) {
      return { labels: [], datasets: [{ data: [] }] };
    }

    const conStock = estadisticas.filter(p => p.stock > 0).length;
    const sinStock = estadisticas.filter(p => p.stock === 0).length;
    const agotados = estadisticas.filter(p => p.estado === 'agotado').length;

    return {
      labels: ['Con Stock', 'Sin Stock', 'Agotados'],
      datasets: [{
        data: [conStock, sinStock, agotados],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderWidth: 0
      }]
    };
  }, [dashboardData.estadisticas]);

  // Acciones rápidas memoizadas
  const quickActions = useMemo(() => [
    {
      id: 'new-product',
      title: 'Nuevo Producto',
      icon: <PackagePlus className="w-5 h-5" />,
      color: 'border-blue-200 bg-blue-50 text-blue-700',
      hoverColor: 'hover:bg-blue-100',
      route: '/product/new'
    },
    {
      id: 'new-sale',
      title: 'Nueva Venta',
      icon: <ShoppingCart className="w-5 h-5" />,
              color: 'border-blue-200 bg-blue-50 text-blue-700',
        hoverColor: 'hover:bg-blue-100',
      route: '/quick-sales'
    },
    {
      id: 'new-customer',
      title: 'Nuevo Cliente',
      icon: <UserPlus className="w-5 h-5" />,
      color: 'border-purple-200 bg-purple-50 text-purple-700',
      hoverColor: 'hover:bg-purple-100',
      route: '/customers'
    },
    {
      id: 'new-order',
      title: 'Nuevo Pedido',
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'border-orange-200 bg-orange-50 text-orange-700',
      hoverColor: 'hover:bg-orange-100',
      route: '/orders'
    },
    {
      id: 'categories',
      title: 'Categorías',
      icon: <FolderOpen className="w-5 h-5" />,
      color: 'border-indigo-200 bg-indigo-50 text-indigo-700',
      hoverColor: 'hover:bg-indigo-100',
      route: '/categories'
    },
    {
      id: 'analytics',
      title: 'Analíticas',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'border-pink-200 bg-pink-50 text-pink-700',
      hoverColor: 'hover:bg-pink-100',
      route: '/analytics'
    }
  ], []);

  // KPIs memoizados
  const kpis = useMemo(() => [
    {
      title: 'Total Ventas',
      value: totalVentas.toLocaleString(),
      icon: ShoppingBag,
      color: 'blue'
    },
    {
      title: 'Ingresos',
      value: `€${totalIngresos.toLocaleString()}`,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Total Pedidos',
      value: totalPedidos.toLocaleString(),
      icon: Package,
      color: 'purple'
    },
    {
      title: 'Clientes',
      value: totalClientes.toLocaleString(),
      icon: Users,
      color: 'yellow'
    },
    {
      title: 'Productos',
      value: totalProductos.toLocaleString(),
      icon: Store,
      color: 'indigo'
    },
    {
      title: 'Ticket Promedio',
      value: `€${ticketPromedio.toFixed(2)}`,
      icon: CreditCard,
      color: 'pink'
    },
    {
      title: 'Pedidos Entregados',
      value: pedidosEntregados.toLocaleString(),
      icon: CheckCircle,
      color: 'green'
    }
  ], [totalVentas, totalIngresos, totalPedidos, totalClientes, totalProductos, ticketPromedio, pedidosEntregados]);

  // Renderizar estados de carga
  if (loading.initial) {
    return <DashboardSkeleton />;
  }

  // Renderizar estado de error
  if (error) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-theme-text mb-2">Error al cargar el dashboard</h3>
        <p className="text-theme-textSecondary mb-4">{error}</p>
        <button
          onClick={refreshData}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-theme-text">Dashboard</h1>
          <p className="text-theme-textSecondary">Resumen general de tu tienda</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={refreshData}
            disabled={loading.refresh}
            className="inline-flex items-center px-4 py-2 border border-theme-border shadow-sm text-sm font-medium rounded-md text-theme-textSecondary bg-theme-surface hover:bg-theme-background focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading.refresh ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Botones de Acción Rápida */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-theme-text mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <QuickActionButton key={action.id} action={action} />
          ))}
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de Ventas */}
        <ChartContainer title="Tendencia de Ventas" icon={Calendar} loading={loading.charts}>
          {salesData.labels.length === 0 ? (
            <div className="flex items-center justify-center h-full text-theme-textSecondary">
              <div className="text-center">
                <LineChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay datos disponibles</p>
              </div>
            </div>
          ) : (
            <Suspense fallback={<div className="h-64 bg-theme-secondary animate-pulse rounded"></div>}>
              <BarChart 
                data={salesData} 
                options={{ 
                  plugins: { 
                    legend: { display: false }, 
                    tooltip: { enabled: true } 
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    x: {
                      grid: { display: false }
                    }
                  }
                }} 
              />
            </Suspense>
          )}
        </ChartContainer>

        {/* Estado del Inventario */}
        <ChartContainer title="Estado del Inventario" icon={Activity} loading={loading.charts}>
          {inventoryData.labels.length === 0 ? (
            <div className="flex items-center justify-center h-full text-theme-textSecondary">
              <div className="text-center">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay datos disponibles</p>
              </div>
            </div>
          ) : (
            <Suspense fallback={<div className="h-64 bg-theme-secondary animate-pulse rounded"></div>}>
              <PieChart 
                data={inventoryData} 
                options={{ 
                  plugins: { 
                    legend: { 
                      display: true,
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 12 }
                      }
                    } 
                  }
                }} 
              />
            </Suspense>
          )}
        </ChartContainer>
      </div>

      {/* Pedidos Recientes */}
      {dashboardData.pedidosRecientes && dashboardData.pedidosRecientes.length > 0 && (
        <div className="bg-theme-surface rounded-lg border border-theme-border p-6">
          <h3 className="text-lg font-semibold text-theme-text mb-4">Pedidos Recientes</h3>
          <div className="space-y-3">
            {dashboardData.pedidosRecientes.slice(0, 5).map((pedido) => (
              <div key={pedido.id} className="flex items-center justify-between p-3 bg-theme-background rounded-lg">
                <div className="flex items-center space-x-3">
                  <OrderStatusBadge status={pedido.estado} />
                  <div>
                    <p className="text-sm font-medium text-theme-text">Pedido #{pedido.id}</p>
                    <p className="text-xs text-theme-textSecondary">
                      {new Date(pedido.fecha_creacion).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-theme-text">
                    €{pedido.total?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-theme-textSecondary">{pedido.cliente?.nombre || 'Cliente'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default DashboardPageOptimized;
