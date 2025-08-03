import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <div className={`tab-navigation ${className}`}>
      <div className="tab-list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            disabled={tab.disabled}
            className={`tab-button ${activeTab === tab.id ? 'tab-button--active' : ''} ${
              tab.disabled ? 'tab-button--disabled' : ''
            }`}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

interface TabPanelProps {
  id: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  id,
  activeTab,
  children,
  className = '',
}) => {
  const isActive = activeTab === id;
  
  return (
    <div
      id={`tabpanel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      className={`tab-panel ${isActive ? 'tab-panel--active' : 'tab-panel--hidden'} ${className}`}
      hidden={!isActive}
    >
      {isActive && children}
    </div>
  );
};
