import { useState, useCallback, useEffect, useRef } from 'react'
import { CalendarDays, MapPin, User, Clock, Loader2, Play, Pause, RotateCcw } from 'lucide-react'
import ChartWheel from './components/ChartWheel'
import ChartDetails from './components/ChartDetails'
import PlanetaryHarmonicsSidebar from './components/PlanetaryHarmonicsSidebar'
import { AstrologyCalculator, type BirthData, type AstrologyChart } from './astrology'
import './App.css'

const astrologyCalculator = new AstrologyCalculator();

function App() {
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
  
  // Real-time mode state
  const [isRealTimeMode, setIsRealTimeMode] = useState(true); // Default to real-time mode
  const [currentTime, setCurrentTime] = useState(new Date());
  const realTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chartCalculationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update current time every second when in real-time mode
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
      }, 1000);
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

  // Auto-calculate chart when birth data changes (with debouncing)
  useEffect(() => {
    // Clear existing timeout
    if (chartCalculationTimeoutRef.current) {
      clearTimeout(chartCalculationTimeoutRef.current);
    }

    // Set new timeout for chart calculation (debounced to avoid excessive calculations)
    chartCalculationTimeoutRef.current = setTimeout(() => {
      calculateChart();
    }, isRealTimeMode ? 100 : 500); // Faster updates in real-time mode

    return () => {
      if (chartCalculationTimeoutRef.current) {
        clearTimeout(chartCalculationTimeoutRef.current);
      }
    };
  }, [birthData]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const calculateChart = useCallback(async () => {
    setIsCalculating(true);
    setError('');
    
    try {
      console.log('🚀 Starting chart calculation with birth data:', birthData);
      const newChart = await astrologyCalculator.calculateChart(birthData);
      console.log('✅ Chart calculated successfully:', newChart);
      console.log('📊 Number of bodies:', newChart.bodies.length);
      console.log('🏠 Number of houses:', newChart.houses.cusps.length);
      console.log('🔗 Number of aspects:', newChart.aspects.length);
      setChart(newChart);
    } catch (err) {
      console.error('❌ Chart calculation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate chart');
    } finally {
      setIsCalculating(false);
    }
  }, [birthData]);

  // Example locations for quick selection
  const exampleLocations = [
    { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321 },
    { name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 }
  ];

  return (
    <div className="app">
      <main className="app-main">
        <div className="input-section">        <div className="form-card">
          <div className="form-header">
            <h2><User className="icon" /> Birth Information</h2>
            
            {/* Real-time controls with time jump options */}
            <div className="real-time-controls">
              <div className="control-group">
                <button
                  type="button"
                  className={`real-time-toggle ${isRealTimeMode ? 'active' : ''}`}
                  onClick={toggleRealTimeMode}
                  title={isRealTimeMode ? 'Pause real-time mode' : 'Start real-time mode'}
                >
                  {isRealTimeMode ? <Pause className="icon" /> : <Play className="icon" />}
                  {isRealTimeMode ? 'Live' : 'Paused'}
                </button>
                
                <button
                  type="button"
                  className="reset-time-btn"
                  onClick={resetToCurrentTime}
                  title="Reset to current time"
                >
                  <RotateCcw className="icon" />
                  Now
                </button>
              </div>
              
              <div className="time-jump-hint">
                {isRealTimeMode ? (
                  <div className="live-indicator">
                    <div className="pulse-dot"></div>
                    <span className="live-time">
                      {currentTime.toLocaleTimeString()}
                    </span>
                  </div>
                ) : (
                  <span className="jump-hint">
                    Edit date/time fields for time jumps
                  </span>
                )}
              </div>
            </div>
          </div>
            
            <div className="form-group">
              <label htmlFor="name">
                <User className="icon" />
                Name (optional)
              </label>
              <input
                id="name"
                type="text"
                value={birthData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">
                  <CalendarDays className="icon" />
                  Birth Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={birthData.date.toISOString().split('T')[0]}
                  onChange={(e) => {
                    const newDate = new Date(birthData.date);
                    const [year, month, day] = e.target.value.split('-');
                    newDate.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day));
                    handleInputChange('date', newDate);
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">
                  <Clock className="icon" />
                  Birth Time
                </label>
                <input
                  id="time"
                  type="time"
                  value={birthData.date.toTimeString().slice(0, 5)}
                  onChange={(e) => {
                    const newDate = new Date(birthData.date);
                    const [hours, minutes] = e.target.value.split(':');
                    newDate.setHours(parseInt(hours), parseInt(minutes));
                    handleInputChange('date', newDate);
                  }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="latitude">
                  <MapPin className="icon" />
                  Latitude
                </label>
                <input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  min="-90"
                  max="90"
                  value={birthData.latitude}
                  onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                  placeholder="40.7128"
                />
              </div>

              <div className="form-group">
                <label htmlFor="longitude">
                  <MapPin className="icon" />
                  Longitude
                </label>
                <input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  min="-180"
                  max="180"
                  value={birthData.longitude}
                  onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                  placeholder="-74.0060"
                />
              </div>
            </div>

            <div className="location-presets">
              <label>Quick Locations:</label>
              <div className="preset-buttons">
                {exampleLocations.map((location, index) => (
                  <button
                    key={index}
                    type="button"
                    className="preset-btn"
                    onClick={() => {
                      handleInputChange('latitude', location.lat);
                      handleInputChange('longitude', location.lng);
                    }}
                  >
                    {location.name}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            {isCalculating && (
              <div className="calculating-indicator">
                <Loader2 className="icon spinning" />
                Calculating chart...
              </div>
            )}
          </div>
        </div>

        <div className="chart-section">
          {chart ? (
            <div className="chart-layout">
              <div className="chart-main">
                <div className="chart-wheel-container">
                  <ChartWheel chart={chart} width={700} height={700} />
                </div>
                <div className="chart-details-container">
                  <ChartDetails chart={chart} />
                </div>
              </div>
              <div className="chart-sidebar">
                <PlanetaryHarmonicsSidebar chart={chart} />
              </div>
            </div>
          ) : (
            <div className="chart-placeholder">
              <div className="placeholder-content">
                <CalendarDays size={64} />
                <h3>Enter birth information above</h3>
                <p>Fill in the birth date, time, and location to generate an accurate astrology chart</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
