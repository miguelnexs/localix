import React, { useState } from 'react';
import { 
  Settings, 
  Palette, 
  Bell, 
  Zap, 
  Minimize2, 
  RotateCcw,
  ArrowLeft,
  Image,
  Type,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Droplets,
  Leaf,
  Sparkles,
  Building2,
  FileText,
  Users,
  Shield,
  User,
  Save,
  X
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import ImageUpload from '../components/ui/ImageUpload';
import UserManagementPanel from '../components/layout/UserManagementPanel';

const SettingsPage = () => {
  const { 
    settings, 
    themes, 
    currentTheme, 
    updateTheme, 
    toggleNotifications, 
    toggleAnimations, 
    toggleCompactMode,
    updateLogo,
    updateCompanyName,
    toggleLogoVisibility,
    toggleCompanyNameVisibility,
    updateCompanyField,
    resetSettings 
  } = useSettings();
  
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user?.rol === 'admin';

  const [activeTab, setActiveTab] = useState('themes');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const tabs = [
    { id: 'themes', label: 'Temas', icon: Palette, description: 'Personaliza la apariencia' },
    { id: 'brand', label: 'Marca', icon: Image, description: 'Logo y nombre de empresa' },
    { id: 'company', label: 'Empresa', icon: Building2, description: 'Datos para PDFs' },
    ...(isAdmin ? [{ id: 'users', label: 'Usuarios', icon: Users, description: 'Gestión de usuarios' }] : []),
    { id: 'interface', label: 'Interfaz', icon: Settings, description: 'Configuración de UI' },
    { id: 'notifications', label: 'Notificaciones', icon: Bell, description: 'Alertas del sistema' },
  ];

  const themeIcons = {
    dark: Moon,
    blue: Droplets,
    light: Sun
  };

  const handleResetSettings = () => {
    resetSettings();
    showToast('Configuración restablecida', 'success');
    setShowResetConfirm(false);
  };

  const handleSaveAll = () => {
    showToast('Configuración guardada automáticamente', 'success');
  };

  return (
    <div className="min-h-screen bg-theme-background">
      {/* Header */}
      <div className="bg-theme-surface border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-theme-border rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-theme-text" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-theme-accent rounded-lg">
                  <Settings size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-theme-text">Configuración</h1>
                  <p className="text-sm text-theme-textSecondary">Personaliza tu experiencia</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-theme-textSecondary hover:text-theme-text transition-all duration-200 hover:scale-105"
              >
                <RotateCcw size={16} />
                Restablecer
              </button>
              
              <button
                onClick={handleSaveAll}
                className="flex items-center gap-2 px-4 py-2 bg-theme-accent text-white rounded-lg hover:bg-theme-primary transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
              >
                <Save size={16} />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-theme-surface rounded-xl border border-theme-border p-4 sticky top-8">
              <h3 className="text-lg font-semibold text-theme-text mb-4">Categorías</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-theme-accent text-white shadow-md'
                          : 'text-theme-text hover:bg-theme-border'
                      }`}
                    >
                      <Icon size={18} className="mt-0.5" />
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div className={`text-xs ${
                          activeTab === tab.id ? 'text-white/80' : 'text-theme-textSecondary'
                        }`}>
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="lg:col-span-3">
            <div className="bg-theme-surface rounded-xl border border-theme-border p-6">
              {/* Temas */}
              {activeTab === 'themes' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-theme-text mb-4">Configuración de Temas</h3>
                    <p className="text-sm text-theme-textSecondary mb-6">
                      Personaliza la apariencia visual de la aplicación
                    </p>
                    
                    {/* Temas disponibles */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {Object.entries(themes).map(([themeKey, theme]) => {
                        const ThemeIcon = themeIcons[themeKey];
                        return (
                          <button
                            key={themeKey}
                            onClick={() => updateTheme(themeKey)}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                              currentTheme === themeKey
                                ? 'border-theme-accent bg-theme-accent/10'
                                : 'border-theme-border hover:border-theme-accent/50'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <ThemeIcon size={20} className="text-theme-accent" />
                              <span className="font-medium text-theme-text capitalize">{themeKey}</span>
                            </div>
                            <div className="flex gap-2">
                              <div className="w-4 h-4 rounded-full bg-primary-500"></div>
                              <div className="w-4 h-4 rounded-full bg-secondary-500"></div>
                              <div className="w-4 h-4 rounded-full bg-accent-500"></div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Opciones adicionales */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-theme-secondary rounded-lg border border-theme-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <Zap size={16} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-theme-text">Animaciones</h4>
                            <p className="text-sm text-theme-textSecondary">Efectos de transición y animaciones</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleAnimations}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.animations ? 'bg-theme-accent' : 'bg-theme-border'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.animations ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-theme-secondary rounded-lg border border-theme-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <Minimize2 size={16} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-theme-text">Modo Compacto</h4>
                            <p className="text-sm text-theme-textSecondary">Reducir espaciado y tamaños</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleCompactMode}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.compactMode ? 'bg-theme-accent' : 'bg-theme-border'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.compactMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Marca */}
              {activeTab === 'brand' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-theme-text mb-4">Configuración de Marca</h3>
                    <p className="text-sm text-theme-textSecondary mb-6">
                      Personaliza el logo y nombre de tu empresa
                    </p>
                    
                    {/* Logo */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between p-4 bg-theme-secondary rounded-lg border border-theme-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Image size={16} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-theme-text">Logo de la Empresa</h4>
                            <p className="text-sm text-theme-textSecondary">Sube tu logo personalizado</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleLogoVisibility}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.customBrand?.showLogo ? 'bg-theme-accent' : 'bg-theme-border'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.customBrand?.showLogo ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      
                      {settings.customBrand?.showLogo && (
                        <ImageUpload
                          currentImage={settings.customBrand?.logo}
                          onImageChange={updateLogo}
                          accept="image/*"
                          maxSize={2 * 1024 * 1024} // 2MB
                        />
                      )}
                    </div>

                    {/* Nombre de la empresa */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-theme-secondary rounded-lg border border-theme-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <Type size={16} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-theme-text">Nombre de la Empresa</h4>
                            <p className="text-sm text-theme-textSecondary">Mostrar nombre personalizado</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleCompanyNameVisibility}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.customBrand?.showCompanyName ? 'bg-theme-accent' : 'bg-theme-border'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.customBrand?.showCompanyName ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      
                      {settings.customBrand?.showCompanyName && (
                        <div className="p-4 bg-theme-secondary rounded-lg border border-theme-border">
                          <label className="block text-sm font-medium text-theme-text mb-2">
                            Nombre de la Empresa
                          </label>
                          <input
                            type="text"
                            value={settings.customBrand?.companyName || ''}
                            onChange={(e) => updateCompanyName(e.target.value)}
                            className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-background text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                            placeholder="Ingresa el nombre de tu empresa"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Empresa */}
              {activeTab === 'company' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-theme-text mb-4">Datos de la Empresa</h3>
                    <p className="text-sm text-theme-textSecondary mb-6">
                      Configura los datos que aparecerán en los recibos PDF y documentos oficiales
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-theme-text mb-2">
                          Nombre de la Empresa *
                        </label>
                        <input
                          type="text"
                          value={settings.companyData?.nombre || ''}
                          onChange={(e) => updateCompanyField('nombre', e.target.value)}
                          className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                          placeholder="Nombre completo de la empresa"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-theme-text mb-2">
                          Dirección *
                        </label>
                        <input
                          type="text"
                          value={settings.companyData?.direccion || ''}
                          onChange={(e) => updateCompanyField('direccion', e.target.value)}
                          className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                          placeholder="Dirección completa"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-theme-text mb-2">
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          value={settings.companyData?.ciudad || ''}
                          onChange={(e) => updateCompanyField('ciudad', e.target.value)}
                          className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                          placeholder="Ciudad"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-theme-text mb-2">
                          País *
                        </label>
                        <input
                          type="text"
                          value={settings.companyData?.pais || ''}
                          onChange={(e) => updateCompanyField('pais', e.target.value)}
                          className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                          placeholder="País"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-theme-text mb-2">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          value={settings.companyData?.telefono || ''}
                          onChange={(e) => updateCompanyField('telefono', e.target.value)}
                          className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                          placeholder="Número de teléfono"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-theme-text mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={settings.companyData?.email || ''}
                          onChange={(e) => updateCompanyField('email', e.target.value)}
                          className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                          placeholder="Email de contacto"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-theme-text mb-2">
                          Sitio Web
                        </label>
                        <input
                          type="url"
                          value={settings.companyData?.web || ''}
                          onChange={(e) => updateCompanyField('web', e.target.value)}
                          className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                          placeholder="www.tuempresa.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-theme-text mb-2">
                          NIT *
                        </label>
                        <input
                          type="text"
                          value={settings.companyData?.nit || ''}
                          onChange={(e) => updateCompanyField('nit', e.target.value)}
                          className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                          placeholder="Número de identificación tributaria"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-theme-text mb-2">
                          RUC
                        </label>
                        <input
                          type="text"
                          value={settings.companyData?.ruc || ''}
                          onChange={(e) => updateCompanyField('ruc', e.target.value)}
                          className="w-full px-3 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                          placeholder="Registro único de contribuyentes"
                        />
                      </div>
                    </div>

                    {/* Vista previa del PDF */}
                    <div className="p-4 bg-theme-secondary rounded-lg border border-theme-border">
                      <h4 className="font-medium text-theme-text mb-3">Vista previa del encabezado PDF</h4>
                      <div className="bg-white rounded-lg p-4 border border-theme-border">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-theme-accent/10 rounded-lg flex items-center justify-center">
                            <Building2 size={20} className="text-theme-accent" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">
                              {settings.companyData?.nombre || 'Nombre de la empresa'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {settings.companyData?.direccion || 'Dirección de la empresa'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {settings.companyData?.telefono || 'Teléfono'} | {settings.companyData?.nit || 'NIT'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {settings.companyData?.email || 'Email de la empresa'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-theme-textSecondary mt-2">
                        Esta información aparecerá en el encabezado de todos los recibos PDF generados
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Usuarios */}
              {activeTab === 'users' && isAdmin && (
                <UserManagementPanel />
              )}

              {/* Interfaz */}
              {activeTab === 'interface' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-theme-text mb-4">Configuración de Interfaz</h3>
                    <p className="text-sm text-theme-textSecondary mb-6">
                      Personaliza la experiencia de usuario y comportamiento de la aplicación
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-theme-secondary rounded-lg border border-theme-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <Zap size={16} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-theme-text">Animaciones</h4>
                            <p className="text-sm text-theme-textSecondary">Efectos de transición y animaciones</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleAnimations}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.animations ? 'bg-theme-accent' : 'bg-theme-border'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.animations ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-theme-secondary rounded-lg border border-theme-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <Minimize2 size={16} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-theme-text">Modo Compacto</h4>
                            <p className="text-sm text-theme-textSecondary">Reducir espaciado y tamaños</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleCompactMode}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.compactMode ? 'bg-theme-accent' : 'bg-theme-border'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.compactMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notificaciones */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-theme-text mb-4">Configuración de Notificaciones</h3>
                    <p className="text-sm text-theme-textSecondary mb-6">
                      Personaliza cómo recibes las notificaciones en la aplicación
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-theme-secondary rounded-lg border border-theme-border">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Bell size={16} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-theme-text">Notificaciones Generales</h4>
                            <p className="text-sm text-theme-textSecondary">Recibir notificaciones del sistema</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleNotifications}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.notifications ? 'bg-theme-accent' : 'bg-theme-border'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.notifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para restablecer */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-theme-surface rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500 rounded-lg">
                <RotateCcw size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-theme-text">Restablecer Configuración</h3>
                <p className="text-sm text-theme-textSecondary">¿Estás seguro de que quieres restablecer toda la configuración?</p>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 border border-theme-border rounded-lg bg-theme-secondary text-theme-text hover:bg-theme-border transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetSettings}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Restablecer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage; 