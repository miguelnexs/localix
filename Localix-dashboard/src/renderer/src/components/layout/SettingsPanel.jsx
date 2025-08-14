import React, { useState } from 'react';
import { 
  Settings, 
  Palette, 
  Bell, 
  Zap, 
  Minimize2, 
  RotateCcw,
  X,
  Check,
  Moon,
  Sun,
  Droplets,
  Leaf,
  Sparkles
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const SettingsPanel = ({ isOpen, onClose }) => {
  const { 
    settings, 
    themes, 
    currentTheme, 
    updateTheme, 
    toggleNotifications, 
    toggleAnimations, 
    toggleCompactMode, 
    resetSettings 
  } = useSettings();

  const [activeTab, setActiveTab] = useState('themes');

  const tabs = [
    { id: 'themes', label: 'Temas', icon: Palette },
    { id: 'interface', label: 'Interfaz', icon: Settings },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
  ];

  const themeIcons = {
    dark: Moon,
    blue: Droplets,
    light: Sun
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Settings size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Configuración</h2>
              <p className="text-sm text-theme-textSecondary">Personaliza tu experiencia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-theme-textSecondary hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-900'
                    : 'text-theme-textSecondary hover:text-theme-textSecondary hover:bg-gray-700'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'themes' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Seleccionar Tema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(themes).map(([key, theme]) => {
                    const Icon = themeIcons[key] || Sun; // Fallback a Sun si no hay icono
                    const isActive = settings.theme === key;
                    
                    return (
                      <button
                        key={key}
                        onClick={() => updateTheme(key)}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                          isActive
                            ? 'border-blue-400 bg-blue-900/20'
                            : 'border-gray-600 bg-gray-800 hover:border-theme-border hover:bg-gray-700'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute top-2 right-2 p-1 bg-blue-400 rounded-full">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: theme.colors.primary }}>
                            <Icon size={20} className="text-white" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-medium text-white">{theme.name}</h4>
                            <p className="text-sm text-theme-textSecondary">Tema personalizado</p>
                          </div>
                        </div>
                        
                        {/* Color preview */}
                        <div className="flex gap-1">
                          {Object.entries(theme.colors).slice(0, 6).map(([colorKey, colorValue]) => (
                            <div
                              key={colorKey}
                              className="w-6 h-6 rounded border border-gray-600"
                              style={{ backgroundColor: colorValue }}
                              title={colorKey}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

                             {/* Current theme info */}
               {currentTheme ? (
                 <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                   <h4 className="font-medium text-white mb-3">Tema Actual: {currentTheme.name}</h4>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                     {Object.entries(currentTheme.colors).map(([key, value]) => (
                       <div key={key} className="flex items-center gap-2">
                         <div
                           className="w-4 h-4 rounded border border-gray-600"
                           style={{ backgroundColor: value }}
                         />
                         <span className="text-xs text-theme-textSecondary">{key}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               ) : (
                 <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                   <h4 className="font-medium text-white mb-3">Tema Actual: No disponible</h4>
                   <p className="text-sm text-theme-textSecondary">El tema actual no está disponible</p>
                 </div>
               )}

               {/* Vista previa del tema */}
               {currentTheme ? (
                 <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                   <h4 className="font-medium text-white mb-3">Vista Previa del Tema</h4>
                   <div className="space-y-3">
                     <div className="flex gap-2">
                       <button className="px-3 py-2 rounded bg-theme-primary text-white text-sm">
                         Botón Primario
                       </button>
                       <button className="px-3 py-2 rounded bg-theme-secondary text-white text-sm">
                         Botón Secundario
                       </button>
                       <button className="px-3 py-2 rounded bg-theme-accent text-white text-sm">
                         Botón Accent
                       </button>
                     </div>
                     <div className="p-3 rounded bg-theme-surface border border-theme-border">
                       <p className="text-theme-text text-sm">Este es un ejemplo de texto con el tema actual</p>
                       <p className="text-theme-textSecondary text-xs mt-1">Texto secundario del tema</p>
                     </div>
                     <div className="flex gap-2">
                       <span className="px-2 py-1 rounded text-xs bg-theme-success text-white">Éxito</span>
                       <span className="px-2 py-1 rounded text-xs bg-theme-warning text-white">Advertencia</span>
                       <span className="px-2 py-1 rounded text-xs bg-theme-error text-white">Error</span>
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                   <h4 className="font-medium text-white mb-3">Vista Previa del Tema</h4>
                   <p className="text-sm text-theme-textSecondary">No hay tema disponible para mostrar</p>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'interface' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Configuración de Interfaz</h3>
                
                {/* Animations */}
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Zap size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Animaciones</h4>
                      <p className="text-sm text-theme-textSecondary">Habilitar transiciones y efectos</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleAnimations}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.animations ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-theme-surface transition-transform ${
                        settings.animations ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Compact Mode */}
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Minimize2 size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Modo Compacto</h4>
                      <p className="text-sm text-theme-textSecondary">Reducir espaciado y tamaños</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleCompactMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.compactMode ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-theme-surface transition-transform ${
                        settings.compactMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Configuración de Notificaciones</h3>
                
                {/* Notifications Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <Bell size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Notificaciones</h4>
                      <p className="text-sm text-theme-textSecondary">Mostrar alertas y notificaciones</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleNotifications}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-theme-surface transition-transform ${
                        settings.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-800">
          <button
            onClick={resetSettings}
            className="flex items-center gap-2 px-4 py-2 text-sm text-theme-textSecondary hover:text-white transition-colors"
          >
            <RotateCcw size={16} />
            Restablecer configuración
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-theme-textSecondary hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
