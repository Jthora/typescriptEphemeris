import { useState, useCallback } from 'react'
import { CalendarDays, MapPin, User, Clock, Loader2 } from 'lucide-react'
import ChartWheel from './components/ChartWheel'
import ChartDetails from './components/ChartDetails'
import { AstrologyCalculator, type BirthData, type AstrologyChart } from './astrology'
import './App.css'

const astrologyCalculator = new AstrologyCalculator();

function App() {
  const [birthData, setBirthData] = useState<BirthData>({
    date: new Date('1990-01-01T12:00:00'),
    latitude: 40.7128,
    longitude: -74.0060,
    name: ''
  });
  
  const [chart, setChart] = useState<AstrologyChart | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = useCallback((field: keyof BirthData, value: any) => {
    setBirthData(prev => ({
      ...prev,
      [field]: value
    }));
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
    { name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 }
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>✨ Astrology Birth Chart Calculator</h1>
        <p>Calculate accurate birth charts using astronomical ephemeris data</p>
      </header>

      <main className="app-main">
        <div className="input-section">
          <div className="form-card">
            <h2><User className="icon" /> Birth Information</h2>
            
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

            <button 
              className="calculate-btn"
              onClick={calculateChart}
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <Loader2 className="icon spinning" />
                  Calculating...
                </>
              ) : (
                'Calculate Birth Chart'
              )}
            </button>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>

        <div className="chart-section">
          {chart ? (
            <div className="chart-results">
              <div className="chart-wheel-container">
                <ChartWheel chart={chart} width={700} height={700} />
              </div>
              <div className="chart-details-container">
                <ChartDetails chart={chart} />
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
