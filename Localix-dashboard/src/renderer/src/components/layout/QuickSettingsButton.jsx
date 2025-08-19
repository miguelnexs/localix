import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import SettingsPanel from './SettingsPanel';

const QuickSettingsButton = () => {
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setSettingsPanelOpen(true)}
        className="p-2 rounded-lg hover:bg-theme-border transition-all duration-200 text-theme-textSecondary hover:text-theme-text hover:scale-105"
        title="Configuración rápida"
      >
        <Settings size={20} />
      </button>

      <SettingsPanel 
        isOpen={settingsPanelOpen} 
        onClose={() => setSettingsPanelOpen(false)} 
      />
    </>
  );
};

export default QuickSettingsButton; 