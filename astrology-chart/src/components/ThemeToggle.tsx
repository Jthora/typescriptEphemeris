import { useState, useEffect } from 'react';
import { Moon, Sun, MonitorSmartphone } from 'lucide-react';
import themeManager, { THEMES, type ThemeType } from '../theme-manager';
import './ThemeToggle.css';

/**
 * ThemeToggle component
 * Provides hardware-style toggle for switching between dark, light, and system themes
 */
const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(themeManager.getTheme());
  const [isOpen, setIsOpen] = useState(false);

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

  // Handler for changing theme
  const handleThemeChange = (theme: ThemeType) => {
    themeManager.setTheme(theme);
    setIsOpen(false);
  };

  // Get theme icon based on current theme
  const getThemeIcon = () => {
    const actualTheme = themeManager.getActualTheme();
    
    switch (actualTheme) {
      case THEMES.DARK:
        return <Moon className="theme-icon" />;
      case THEMES.LIGHT:
        return <Sun className="theme-icon" />;
      default:
        return <MonitorSmartphone className="theme-icon" />;
    }
  };

  return (
    <div className="theme-toggle-container">
      <button 
        className="theme-toggle-button hardware-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme menu"
      >
        {getThemeIcon()}
      </button>
      
      {isOpen && (
        <div className="theme-dropdown hardware-panel">
          <div className="digital-display">
            <div className="digital-display-heading">DISPLAY MODE</div>
          </div>
          
          <button 
            className={`theme-option hardware-button ${currentTheme === THEMES.DARK ? 'active' : ''}`}
            onClick={() => handleThemeChange(THEMES.DARK)}
          >
            <Moon size={16} />
            <span>Dark</span>
          </button>
          
          <button 
            className={`theme-option hardware-button ${currentTheme === THEMES.LIGHT ? 'active' : ''}`}
            onClick={() => handleThemeChange(THEMES.LIGHT)}
          >
            <Sun size={16} />
            <span>Light</span>
          </button>
          
          <button 
            className={`theme-option hardware-button ${currentTheme === THEMES.SYSTEM ? 'active' : ''}`}
            onClick={() => handleThemeChange(THEMES.SYSTEM)}
          >
            <MonitorSmartphone size={16} />
            <span>System</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
