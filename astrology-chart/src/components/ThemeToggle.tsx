import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, MonitorSmartphone } from 'lucide-react';
import themeManager, { THEMES, type ThemeType } from '../theme-manager';
import './ThemeToggle.css';

/**
 * ThemeToggleButton - Hardware-style square button for the TopBar
 */
const ThemeToggleButton = ({ 
  onClick, 
  currentTheme 
}: { 
  onClick: () => void; 
  currentTheme: ThemeType;
}) => {
  // Get theme icon based on current theme
  const getThemeIcon = () => {
    const actualTheme = themeManager.getActualTheme();
    
    switch (actualTheme) {
      case THEMES.DARK:
        return <Moon className="theme-icon" size={16} />;
      case THEMES.LIGHT:
        return <Sun className="theme-icon" size={16} />;
      default:
        return <MonitorSmartphone className="theme-icon" size={16} />;
    }
  };

  return (
    <button 
      className="hardware-button"
      onClick={onClick}
      aria-label="Toggle theme menu"
      title="Display Mode"
    >
      {getThemeIcon()}
    </button>
  );
};

/**
 * ThemeToggleMenuButton - Individual option buttons in the dropdown menu
 */
const ThemeToggleMenuButton = ({ 
  theme, 
  currentTheme, 
  onClick, 
  icon, 
  label 
}: { 
  theme: ThemeType;
  currentTheme: ThemeType;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <button 
      className={`theme-menu-button ${currentTheme === theme ? 'active' : ''}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

/**
 * ThemeToggleMenu - Digital display style dropdown menu
 */
const ThemeToggleMenu = ({ 
  currentTheme, 
  onThemeChange 
}: { 
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}) => {
  return (
    <div className="theme-toggle-menu digital-display">
      <div className="theme-menu-header">
        <div className="digital-display-heading">DISPLAY MODE</div>
      </div>
      
      <div className="theme-menu-options">
        <ThemeToggleMenuButton
          theme={THEMES.DARK}
          currentTheme={currentTheme}
          onClick={() => onThemeChange(THEMES.DARK)}
          icon={<Moon size={14} />}
          label="Dark"
        />
        
        <ThemeToggleMenuButton
          theme={THEMES.LIGHT}
          currentTheme={currentTheme}
          onClick={() => onThemeChange(THEMES.LIGHT)}
          icon={<Sun size={14} />}
          label="Light"
        />
        
        <ThemeToggleMenuButton
          theme={THEMES.SYSTEM}
          currentTheme={currentTheme}
          onClick={() => onThemeChange(THEMES.SYSTEM)}
          icon={<MonitorSmartphone size={14} />}
          label="System"
        />
      </div>
    </div>
  );
};

/**
 * ThemeToggle - Main container component
 */
const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(themeManager.getTheme());
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize theme manager and set up listener
  useEffect(() => {
    themeManager.initialize();
    
    const handleThemeChange = (theme: ThemeType) => {
      setCurrentTheme(theme);
    };
    
    themeManager.addListener(handleThemeChange);
    
    return () => {
      themeManager.removeListener(handleThemeChange);
    };
  }, []);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handler for changing theme
  const handleThemeChange = (theme: ThemeType) => {
    themeManager.setTheme(theme);
    setIsOpen(false);
  };

  return (
    <div className="theme-toggle-container" ref={containerRef}>
      <ThemeToggleButton 
        onClick={() => setIsOpen(!isOpen)}
        currentTheme={currentTheme}
      />
      
      {isOpen && (
        <ThemeToggleMenu
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
        />
      )}
    </div>
  );
};

export default ThemeToggle;
