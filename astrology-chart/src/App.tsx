import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import type { TouchEvent } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { CalendarDays, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'
import BirthChartVisualization from './components/BirthChartVisualization'
import TopBar from './components/TopBar'
import LeftSideDrawer from './components/LeftSideDrawer'
import RightSideDrawer from './components/RightSideDrawer'
import BottomBar from './components/BottomBar'
import BottomDrawer from './components/BottomDrawer'
import { AstrologyCalculator, type BirthData, type AstrologyChart, type HouseSystemType } from './astrology'
import './App.css'
import './components/SideDrawers.css'
import themeManager from './theme-manager'
import { featureFlags } from './featureFlags'
import { captureChart, CaptureError } from './utils/share/captureChart'
import type { CaptureErrorCode } from './utils/share/captureChart'
import { shareOrDownload, type ShareOutcome } from './utils/share/shareBridge'
import type { ShareState } from './utils/share/shareState'
import ShareDialog from './components/share/ShareDialog'
import {
  loadShareOptions,
  saveShareOptions,
  type ShareOptions,
  getResolutionScale,
  resolveShareBackgroundColor,
  loadCustomShareMessage,
  saveCustomShareMessage
} from './utils/share/shareOptions'
import { generateShareText } from './utils/share/shareText'
import TutorialPage from './pages/TutorialPage'
import InfoPage from './pages/InfoPage'

const astrologyCalculator = new AstrologyCalculator();

// Example location presets
const exampleLocations = [
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 }
];

function ChartExperience() {
  const bottomDrawerEnabled = featureFlags.bottomDrawer
  const navigate = useNavigate();

  const handleOpenTutorial = useCallback(() => {
    navigate('/tutorial');
  }, [navigate]);

  const handleOpenAbout = useCallback(() => {
    navigate('/about');
  }, [navigate]);

  const handleNavigateHome = useCallback(() => {
    navigate('/');
  }, [navigate]);
  // Initialize theme manager
  useEffect(() => {
    themeManager.initialize();
  }, []);

  // UI state for panel visibility
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false);
  const chartSvgRef = useRef<SVGSVGElement | null>(null);
  const chartSizeRef = useRef<number>(0);
  
  // Touch gesture handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 70 // Minimum distance for swipe detection
  
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
  const [shareState, setShareState] = useState<ShareState>('idle');
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [isShareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareOptions, setShareOptions] = useState<ShareOptions>(() => loadShareOptions());
  const [customShareMessage, setCustomShareMessage] = useState(() => loadCustomShareMessage());
  const [chartDimension, setChartDimension] = useState<number>(600);
  
  useEffect(() => {
    saveShareOptions(shareOptions);
  }, [shareOptions]);

  useEffect(() => {
    saveCustomShareMessage(customShareMessage.trim());
  }, [customShareMessage]);

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

  const shareTextResult = useMemo(() => {
    return generateShareText(chart, shareOptions.text, customShareMessage, birthData.name);
  }, [chart, shareOptions.text, customShareMessage, birthData.name]);

  const shareTextPreview = shareTextResult.text;
  const shareCharCount = shareTextResult.charCount;

  const hiddenSelectors = useMemo(() => {
    const selectors: string[] = [];
    if (!shareOptions.includeOverlays.aspectLines) selectors.push('.aspect-lines');
    if (!shareOptions.includeOverlays.houseNumbers) selectors.push('.house-numbers');
    if (!shareOptions.includeOverlays.zodiacSymbols) {
      selectors.push('.zodiac-symbols', '.cusp-symbols', '.decan-symbols', '.cosmic-symbol');
    }
    if (!shareOptions.includeOverlays.angles) selectors.push('.chart-angles');
    return Array.from(new Set(selectors));
  }, [shareOptions.includeOverlays]);

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
        // Swipe right - open left panel (do not force close right panel)
        setLeftPanelOpen(true);
      } else {
        // Swipe left - open right panel (do not force close left panel)
        setRightPanelOpen(true);
      }
    }
    
    // Reset touch positions
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Toggle panel functions (no longer mutually exclusive)
  const toggleLeftPanel = () => {
    setLeftPanelOpen(prev => !prev);
  };

  const toggleRightPanel = () => {
    setRightPanelOpen(prev => !prev);
  };

  const toggleBottomPanel = () => {
    if (!bottomDrawerEnabled) return
    setBottomPanelOpen(prev => !prev);
  };

  const buildShareFileName = useCallback(() => {
    const date = birthData.date instanceof Date ? birthData.date : new Date();
    const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`;
    const nameSegment = birthData.name?.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
    const baseName = nameSegment ? `${nameSegment}-birth-chart` : 'cosmic-birth-chart';
    return `${baseName}-${formattedDate}.png`;
  }, [birthData]);

  const handleOpenShareDialog = useCallback(() => {
    if (!chart) {
      setShareState('error');
      setShareMessage('Generate a chart before sharing.');
      return;
    }
    setShareDialogOpen(true);
  }, [chart]);

  const handleCopyShareText = useCallback(async () => {
    const text = shareTextPreview?.trim();
    if (!text) return false;

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.warn('Clipboard API copy failed, attempting fallback', error);
      }
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (fallbackError) {
      console.warn('Fallback copy failed', fallbackError);
      return false;
    }
  }, [shareTextPreview]);

  const handleShareExecute = useCallback(async () => {
    if (!chart) {
      setShareState('error');
      setShareMessage('Generate a chart before exporting.');
      return;
    }

    const svg = chartSvgRef.current;
    if (!svg) {
      setShareState('error');
      setShareMessage('Chart visualization not ready yet.');
      return;
    }

    const sizeFromRef = chartSizeRef.current;
    const sizeFromDom = svg.getBoundingClientRect?.().width ?? 0;
    const svgDeclared = parseFloat(svg.getAttribute('width') ?? '0');
    const chartSize = Math.max(1, Math.round(sizeFromRef || sizeFromDom || svgDeclared || 600));
    const targetDimension =
      shareOptions.resolution === 'custom'
        ? shareOptions.customResolution
        : Math.round(chartSize * getResolutionScale(shareOptions.resolution));
  const pixelRatio = Math.min(Math.max(targetDimension / chartSize, 0.1), 4);
    const fileName = buildShareFileName();
  const backgroundColor = resolveShareBackgroundColor(shareOptions.backgroundStyle);
    const shareText = shareTextPreview?.trim() ? shareTextPreview : undefined;

    try {
      setShareState('capturing');
      setShareMessage('Preparing chart image…');

      const pngFile = await captureChart({
        svg,
        width: chartSize,
        height: chartSize,
        scale: pixelRatio,
        backgroundColor,
        hiddenSelectors,
        fileName,
        fontReadyTimeoutMs: 4000
      });

      setShareState('sharing');
      setShareMessage('Opening system share…');

      const outcome: ShareOutcome = await shareOrDownload({
        file: pngFile,
        title: birthData.name ? `${birthData.name}'s Birth Chart` : 'Cosmic Birth Chart',
        text: shareText,
        downloadFileName: fileName
      });

      if (outcome === 'shared') {
        setShareState('success');
        setShareMessage('Image exported via system share.');
        setShareDialogOpen(false);
      } else if (outcome === 'downloaded') {
        setShareState('fallback');
        setShareMessage('PNG downloaded to your device.');
        setShareDialogOpen(false);
      } else if (outcome === 'dismissed') {
        setShareState('idle');
        setShareMessage('Export cancelled.');
      } else {
        setShareState('fallback');
        setShareMessage('System share unavailable. PNG downloaded instead.');
        setShareDialogOpen(false);
      }
    } catch (err) {
      console.error('Export flow failed', err);
      if (err instanceof CaptureError) {
        const messages: Partial<Record<CaptureErrorCode, string>> = {
          'svg-missing': 'Chart visualization not available.',
          'fonts-timeout': 'Fonts did not load in time. Try again in a moment.',
          'image-load': 'Unable to load chart graphics for export.',
          'canvas-unsupported': 'Canvas rendering is unavailable in this browser.',
          'canvas-blob-failed': 'Failed to convert chart into an image.'
        };
        setShareState('error');
        setShareMessage(messages[err.code] ?? 'Unable to capture chart for export.');
      } else if (err instanceof Error) {
        setShareState('error');
        setShareMessage(err.message || 'Unexpected error while exporting chart.');
      } else {
        setShareState('error');
        setShareMessage('Unexpected error while exporting chart.');
      }
    }
  }, [
    birthData.name,
    buildShareFileName,
    chart,
    hiddenSelectors,
    shareOptions.backgroundStyle,
  shareOptions.resolution,
  shareOptions.customResolution,
    shareTextPreview
  ]);

  const handleShareToX = useCallback(async () => {
    if (!chart) {
      setShareState('error');
      setShareMessage('Generate a chart before posting.');
      return;
    }

    const svg = chartSvgRef.current;
    if (!svg) {
      setShareState('error');
      setShareMessage('Chart visualization not ready yet.');
      return;
    }

    const sizeFromRef = chartSizeRef.current;
    const sizeFromDom = svg.getBoundingClientRect?.().width ?? 0;
    const svgDeclared = parseFloat(svg.getAttribute('width') ?? '0');
    const chartSize = Math.max(1, Math.round(sizeFromRef || sizeFromDom || svgDeclared || 600));
    const targetDimension =
      shareOptions.resolution === 'custom'
        ? shareOptions.customResolution
        : Math.round(chartSize * getResolutionScale(shareOptions.resolution));
  const pixelRatio = Math.min(Math.max(targetDimension / chartSize, 0.1), 4);
    const fileName = buildShareFileName();
    const backgroundColor = resolveShareBackgroundColor(shareOptions.backgroundStyle);
    const shareText = shareTextPreview?.trim() ?? '';

    try {
      setShareState('capturing');
      setShareMessage('Preparing chart image…');

      const pngFile = await captureChart({
        svg,
        width: chartSize,
        height: chartSize,
        scale: pixelRatio,
        backgroundColor,
        hiddenSelectors,
        fileName,
        fontReadyTimeoutMs: 4000
      });

      const blobUrl = URL.createObjectURL(pngFile);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);

      if (shareText) {
        try {
          await navigator.clipboard?.writeText?.(shareText);
          setShareMessage('PNG downloaded. Share text copied—opening X…');
        } catch (clipboardError) {
          console.warn('Clipboard write failed; continuing without copy', clipboardError);
          setShareMessage('PNG downloaded. Opening X compose window…');
        }
      } else {
        setShareMessage('PNG downloaded. Opening X compose window…');
      }

      setShareState('sharing');

      const xText = shareText || 'Exploring today’s cosmic chart.';
      const intentUrl = `https://x.com/intent/post?text=${encodeURIComponent(xText)}`;
      window.open(intentUrl, '_blank', 'noopener');

      setShareState('success');
      setShareMessage('PNG downloaded. Complete your post on X in the new tab.');
    } catch (err) {
      console.error('Post to X failed', err);
      if (err instanceof CaptureError) {
        const messages: Partial<Record<CaptureErrorCode, string>> = {
          'svg-missing': 'Chart visualization not available.',
          'fonts-timeout': 'Fonts did not load in time. Try again in a moment.',
          'image-load': 'Unable to load chart graphics for export.',
          'canvas-unsupported': 'Canvas rendering is unavailable in this browser.',
          'canvas-blob-failed': 'Failed to convert chart into an image.'
        };
        setShareState('error');
        setShareMessage(messages[err.code] ?? 'Unable to prepare the chart image.');
      } else if (err instanceof Error) {
        setShareState('error');
        setShareMessage(err.message || 'Unexpected error while preparing the X post.');
      } else {
        setShareState('error');
        setShareMessage('Unexpected error while preparing the X post.');
      }
    }
  }, [
    chart,
    shareOptions.backgroundStyle,
  shareOptions.resolution,
  shareOptions.customResolution,
    shareTextPreview,
    hiddenSelectors,
    buildShareFileName,
    chartSvgRef
  ]);

  const handleCloseShareDialog = useCallback(() => {
    if (shareState === 'capturing' || shareState === 'sharing') {
      return;
    }
    setShareDialogOpen(false);
  }, [shareState]);

  useEffect(() => {
    if (!chart && isShareDialogOpen) {
      setShareDialogOpen(false);
    }
  }, [chart, isShareDialogOpen]);

  useEffect(() => {
    if (!shareMessage || typeof window === 'undefined') return;
    const timeout = window.setTimeout(() => {
      setShareMessage(null);
    }, 4000);
    return () => window.clearTimeout(timeout);
  }, [shareMessage]);

  useEffect(() => {
    if (shareState === 'success' || shareState === 'fallback' || shareState === 'error') {
      if (typeof window === 'undefined') return;
      const timeout = window.setTimeout(() => {
        setShareState('idle');
      }, 4000);
      return () => window.clearTimeout(timeout);
    }
    return;
  }, [shareState]);

  const shareBusy = shareState === 'capturing' || shareState === 'sharing';
  const shareUnavailable = !chart || isCalculating;
  const shareDisabled = shareUnavailable || shareBusy;

  return (
    <div className="app">
      {/* Removed panel overlay to keep chart fully visible without dimming */}
      {/* <div className={`panel-overlay ${leftPanelOpen || rightPanelOpen ? 'active' : ''}`} onClick={handleOverlayClick} /> */}
      <main className="app-main">
        {/* Top bar */}
        <TopBar
          shareState={shareState}
          shareMessage={shareMessage}
          onOpenTutorial={handleOpenTutorial}
          onOpenAbout={handleOpenAbout}
          onNavigateHome={handleNavigateHome}
          homeActive
        />

        <ShareDialog
          isOpen={isShareDialogOpen}
          options={shareOptions}
          onOptionsChange={setShareOptions}
          shareState={shareState}
          shareMessage={shareMessage}
          shareDisabled={shareUnavailable}
          onShare={handleShareExecute}
          onShareToX={handleShareToX}
          onClose={handleCloseShareDialog}
          chartDimension={chartDimension}
          shareText={shareTextPreview}
          customMessage={customShareMessage}
          onCustomMessageChange={setCustomShareMessage}
          charCount={shareCharCount}
          onCopyShareText={handleCopyShareText}
        />
        
        {/* Chart container - central content */}
        <div 
          className="chart-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {chart ? (
            <div className="chart-section">
              <BirthChartVisualization
                ref={chartSvgRef}
                chart={chart}
                onSizeChange={(size) => {
                  chartSizeRef.current = size;
                    setChartDimension((prev) => (prev === size ? prev : size));
                }}
              />
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
        
        {/* Bottom panel - slides above bottom bar */}
        {bottomDrawerEnabled && (
          <div className={`bottom-panel ${bottomPanelOpen ? 'open' : ''}`}>
            <div className="bottom-panel-content-wrapper">
              <BottomDrawer />
            </div>
          </div>
        )}
        {/* Bottom bar */}
        <BottomBar 
          isRealTimeMode={isRealTimeMode}
          toggleRealTimeMode={toggleRealTimeMode}
          resetToCurrentTime={resetToCurrentTime}
          birthData={birthData}
          bottomPanelOpen={bottomDrawerEnabled ? bottomPanelOpen : false}
          toggleBottomPanel={bottomDrawerEnabled ? toggleBottomPanel : undefined}
          onShare={handleOpenShareDialog}
          shareDisabled={shareDisabled}
          shareState={shareState}
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<ChartExperience />} />
      <Route path="/tutorial" element={<TutorialPage />} />
  <Route path="/about" element={<InfoPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
