/**
 * Theme Manager for Astrology Chart App
 * Handles dark/light mode switching and persistence
 */

// Theme types
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system' // Uses system preference
} as const;

export type ThemeType = typeof THEMES[keyof typeof THEMES];

// Local storage key for theme preference
const THEME_STORAGE_KEY = 'astrology-chart-theme-preference';

/**
 * Theme Manager Class
 */
export class ThemeManager {
  private currentTheme: ThemeType;
  private initialized: boolean;
  private mediaQuery: MediaQueryList;
  private listeners: Array<(theme: ThemeType) => void>;
  private boundSystemListener?: (e: MediaQueryListEvent) => void;

  constructor() {
  this.currentTheme = THEMES.DARK;
    this.initialized = false;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.listeners = [];
    // Pre-bind the system theme change handler to keep a stable reference
    this.boundSystemListener = this.handleSystemThemeChange.bind(this);
  }

  /**
   * Initialize theme manager
   */
  initialize(): void {
    if (this.initialized) return;
    
    // Load saved preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    
    if (savedTheme && Object.values(THEMES).includes(savedTheme as ThemeType)) {
      this.currentTheme = savedTheme as ThemeType;
    }
    
    // Setup system theme change listener with stable reference
    if (this.boundSystemListener) {
      this.mediaQuery.addEventListener('change', this.boundSystemListener);
    }
    
    // Apply initial theme
    this.applyTheme();
    
    this.initialized = true;
    
    if (import.meta.env.DEV) console.log(`🎨 Theme Manager initialized with theme: ${this.currentTheme}`);
  }

  /**
   * Handle system theme change event
   */
  handleSystemThemeChange(_e: MediaQueryListEvent): void {
    if (this.currentTheme === THEMES.SYSTEM) {
      this.applyTheme();
      this.notifyListeners();
    }
  }

  /**
   * Set theme
   * @param {ThemeType} theme - Theme to set (dark, light, or system)
   */
  setTheme(theme: ThemeType): void {
    if (!Object.values(THEMES).includes(theme)) {
      console.error(`Invalid theme: ${theme}`);
      return;
    }
    
    this.currentTheme = theme;
    
    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Apply theme
    this.applyTheme();
    
    // Notify listeners
    this.notifyListeners();
    
    if (import.meta.env.DEV) console.log(`🎨 Theme changed to: ${theme}`);
  }

  /**
   * Get current theme
   * @returns {ThemeType} Current theme
   */
  getTheme(): ThemeType {
    return this.currentTheme;
  }

  /**
   * Get actual theme (resolves system preference)
   * @returns {ThemeType} Actual theme (dark or light)
   */
  getActualTheme(): ThemeType {
    if (this.currentTheme === THEMES.SYSTEM) {
      return this.mediaQuery.matches ? THEMES.DARK : THEMES.LIGHT;
    }
    return this.currentTheme;
  }

  /**
   * Apply current theme to document
   */
  applyTheme(): void {
    const actualTheme = this.getActualTheme();
    
    // Remove existing theme classes
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    
    // Add current theme class
    document.documentElement.classList.add(`theme-${actualTheme}`);
    
    // Set color-scheme meta tag for browser UI elements
    document.documentElement.style.colorScheme = actualTheme;
  }

  /**
   * Toggle between dark and light themes
   */
  toggleTheme(): void {
    const actualTheme = this.getActualTheme();
    const newTheme = actualTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    this.setTheme(newTheme);
  }

  /**
   * Add theme change listener
   * @param {(theme: ThemeType) => void} listener - Callback function
   */
  addListener(listener: (theme: ThemeType) => void): void {
    if (typeof listener === 'function' && !this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
  }

  /**
   * Remove theme change listener
   * @param {(theme: ThemeType) => void} listener - Callback function to remove
   */
  removeListener(listener: (theme: ThemeType) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners about theme change
   */
  notifyListeners(): void {
    const actualTheme = this.getActualTheme();
    this.listeners.forEach(listener => {
      try {
        listener(actualTheme);
      } catch (error) {
        console.error('Error in theme listener:', error);
      }
    });
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.boundSystemListener) {
      this.mediaQuery.removeEventListener('change', this.boundSystemListener);
    }
    this.listeners = [];
  }
}

// Singleton instance
const themeManager = new ThemeManager();

export default themeManager;
