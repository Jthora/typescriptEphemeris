import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import type { TouchEvent } from 'react'
import { CalendarDays, Loader2, Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import BirthChartVisualization from './components/BirthChartVisualization'
import TopBar from './components/TopBar'
import LeftSideDrawer from './components/LeftSideDrawer'
import RightSideDrawer from './components/RightSideDrawer'
import BottomBar from './components/BottomBar'
import { AstrologyCalculator, type BirthData, type AstrologyChart, type HouseSystemType } from './astrology'
import './App.css'
import './components/SideDrawers.css'
import themeManager from './theme-manager'

const astrologyCalculator = new AstrologyCalculator();

// Example location presets
const exampleLocations = [
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 }
];

function App() {
  // Initialize theme manager
  useEffect(() => {
    themeManager.initialize();
  }, []);

  // UI state for panel visibility
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  
  // Touch gesture handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 70; // Minimum distance for swipe detection
  
  const [birthData, setBirthData] = useState<BirthData>(() => {
    // Set to current date/time in Seattle timezone
    const now = new Date();
    return {
      date: now,
      latitude: 47.6062, // Seattle, WA
      longitude: -122.3321, // Seattle, WA  
      name: ''
    };
  });
  
  const [chart, setChart] = useState<AstrologyChart | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Remove house system state - defaulting to Equal House
  
  // Real-time mode state
  const [isRealTimeMode, setIsRealTimeMode] = useState(true); // Default to real-time mode
  const [currentTime, setCurrentTime] = useState(new Date());
  const realTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chartCalculationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Performance monitoring
  const lastCalculationTimeRef = useRef<number>(0);
  const chartCacheRef = useRef<{ birthDataKey: string; chart: AstrologyChart } | null>(null);

  // Create a stable key for birth data comparison
  const birthDataKey = useMemo(() => {
    return `${birthData.date.getTime()}-${birthData.latitude}-${birthData.longitude}`;
  }, [birthData.date.getTime(), birthData.latitude, birthData.longitude]);

  // Update current time every second when in real-time mode (with optimized calculations)
  useEffect(() => {
    if (isRealTimeMode) {
      realTimeIntervalRef.current = setInterval(() => {
        const now = new Date();
        setCurrentTime(now);
        
        // Update birth data with current time
        setBirthData(prev => ({
          ...prev,
          date: now
        }));
      }, 1000); // Back to 1-second updates - optimizations prevent slowdowns
    } else {
      if (realTimeIntervalRef.current) {
        clearInterval(realTimeIntervalRef.current);
        realTimeIntervalRef.current = null;
      }
    }

    return () => {
      if (realTimeIntervalRef.current) {
        clearInterval(realTimeIntervalRef.current);
      }
    };
  }, [isRealTimeMode]);

  // Auto-calculate chart when birth data changes (with optimized caching and debouncing)
  useEffect(() => {
    // Clear existing timeout
    if (chartCalculationTimeoutRef.current) {
      clearTimeout(chartCalculationTimeoutRef.current);
    }

    // Set new timeout for chart calculation (debounced to avoid excessive calculations)
    chartCalculationTimeoutRef.current = setTimeout(() => {
      calculateChartOptimized();
    }, isRealTimeMode ? 100 : 500); // Faster updates in real-time mode

    return () => {
      if (chartCalculationTimeoutRef.current) {
        clearTimeout(chartCalculationTimeoutRef.current);
      }
    };
  }, [birthDataKey]); // Use stable key instead of entire birthData object

  const handleInputChange = useCallback((field: keyof BirthData, value: string | number | Date) => {
    // When user manually changes data, temporarily pause real-time mode for that field
    if (field === 'date') {
      setIsRealTimeMode(false); // User is manually setting time
    }
    
    setBirthData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const toggleRealTimeMode = useCallback(() => {
    setIsRealTimeMode(prev => {
      const newMode = !prev;
      if (newMode) {
        // When enabling real-time mode, sync to current time
        const now = new Date();
        setCurrentTime(now);
        setBirthData(prev => ({
          ...prev,
          date: now
        }));
      }
      return newMode;
    });
  }, []);

  const resetToCurrentTime = useCallback(() => {
    const now = new Date();
    setCurrentTime(now);
    setBirthData(prev => ({
      ...prev,
      date: now
    }));
    setIsRealTimeMode(true);
  }, []);

  const calculateChartOptimized = useCallback(async () => {
    // Check cache first
    if (chartCacheRef.current && chartCacheRef.current.birthDataKey === birthDataKey) {
      console.log('🚀 Using cached chart calculation');
      setChart(chartCacheRef.current.chart);
      return;
    }
    
    setIsCalculating(true);
    setError('');
    
    try {
      console.log('⚡ Calculating new chart for:', birthDataKey);
      const startTime = performance.now();
      
      const newChart = await astrologyCalculator.calculateChart(birthData);
      
      const calculationTime = performance.now() - startTime;
      lastCalculationTimeRef.current = calculationTime;
      
      console.log(`📊 Chart calculation completed in ${calculationTime.toFixed(2)}ms`);
      console.log('✅ Chart calculated successfully:', newChart);
      console.log('📊 Number of bodies:', newChart.bodies.length);
      console.log('🏠 Number of houses:', newChart.houses.cusps.length, 'System:', newChart.houses.system);
      console.log('🔗 Number of aspects:', newChart.aspects.length);
      
      // Cache the result
      chartCacheRef.current = { birthDataKey, chart: newChart };
      
      setChart(newChart);
    } catch (err) {
      console.error('❌ Chart calculation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate chart');
    } finally {
      setIsCalculating(false);
    }
  }, [birthDataKey, birthData]); // Removed houseSystem dependency
  
  // Format date for display
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Handle touch gestures for panels
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return;
    
    touchEndX.current = e.changedTouches[0].clientX;
    
    const deltaX = touchEndX.current - touchStartX.current;
    
    // Detect swipe direction if it exceeds minimum distance
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right - open left panel
        setLeftPanelOpen(true);
        setRightPanelOpen(false);
      } else {
        // Swipe left - open right panel
        setRightPanelOpen(true);
        setLeftPanelOpen(false);
      }
    }
    
    // Reset touch positions
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Toggle panel functions
  const toggleLeftPanel = () => {
    setLeftPanelOpen(prev => !prev);
    
    // Close right panel if it's open
    if (rightPanelOpen) {
      setRightPanelOpen(false);
    }
  };

  const toggleRightPanel = () => {
    setRightPanelOpen(prev => !prev);
    
    // Close left panel if it's open
    if (leftPanelOpen) {
      setLeftPanelOpen(false);
    }
  };

  // Close panels when clicking overlay
  const handleOverlayClick = () => {
    setLeftPanelOpen(false);
    setRightPanelOpen(false);
  };

  return (
    <div className="app">
      {/* Panel overlay - darkens background when panels are open */}
      <div 
        className={`panel-overlay ${leftPanelOpen || rightPanelOpen ? 'active' : ''}`}
        onClick={handleOverlayClick}
      />
      
      <main className="app-main">
        {/* Top bar */}
        <TopBar />
        
        {/* Chart container - central content */}
        <div 
          className="chart-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {chart ? (
            <div className="chart-section">
              <BirthChartVisualization chart={chart} />
            </div>
          ) : (
            <div className="chart-placeholder">
              <div className="placeholder-content">
                <CalendarDays size={64} />
                <h3>Enter birth information</h3>
                <p>Swipe from the left edge or tap the side button to access birth information form</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom bar */}
        <BottomBar 
          isRealTimeMode={isRealTimeMode}
          toggleRealTimeMode={toggleRealTimeMode}
          resetToCurrentTime={resetToCurrentTime}
          birthData={birthData}
        />
        
        {/* Left panel - Birth Information */}
        <div className={`panel left-panel ${leftPanelOpen ? 'open' : ''}`}>
          <LeftSideDrawer 
            birthData={birthData}
            isCalculating={isCalculating}
            isRealTimeMode={isRealTimeMode}
            onInputChange={handleInputChange}
            toggleRealTimeMode={toggleRealTimeMode}
            resetToCurrentTime={resetToCurrentTime}
          />
          
          {/* Left panel toggle button - attached to panel */}
          <button 
            className="panel-toggle left-panel-toggle"
            onClick={toggleLeftPanel}
            title="Birth Information"
          >
            {leftPanelOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        
        {/* Right panel - Planetary Harmonics */}
        <div className={`panel right-panel ${rightPanelOpen ? 'open' : ''}`}>
          <RightSideDrawer chart={chart} />
          
          {/* Right panel toggle button - attached to panel */}
          <button 
            className="panel-toggle right-panel-toggle"
            onClick={toggleRightPanel}
            title="Planetary Harmonics"
          >
            {rightPanelOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
