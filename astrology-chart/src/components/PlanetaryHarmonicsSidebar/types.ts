/**
 * TypeScript interfaces for Planetary Harmonics Sidebar components
 * Supports modulaexport interface MechanicalPanelProps {
  title: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  showRivets?: boolean;
  collapsible?: boolean;
  className?: string;
}ent architecture with type safety
 */

import type { AstrologyChart } from '../../astrology';
import type { 
  PlanetaryHarmonics, 
  QuantumEmotionalState, 
  DimensionalCoordinate 
} from '../../planetary-harmonics';

// Core data interfaces
export interface HarmonicsData {
  planetaryHarmonics: PlanetaryHarmonics[];
  quantumEmotionalState: QuantumEmotionalState;
  dimensionalCoordinates: DimensionalCoordinate[];
  synodicPeriods: Map<string, number>;
}

export interface CosmicForce {
  name: string;
  weight: number;
  color: string;
  description: string;
}

export interface AggregatedForces {
  [key: string]: number;
}

// Main sidebar component props
export interface PlanetaryHarmonicsSidebarProps {
  chart: AstrologyChart;
  onDemo?: () => void;
}

// Tab navigation types
export type TabType = 'overview' | 'harmonics' | 'quantum' | 'dimensions' | 'synodic';

// Progress bar component interfaces
export interface ProgressBarProps {
  value: number;          // 0-1 range
  max?: number;           // Maximum value (default 1.0)
  variant: 'harmonic' | 'force' | 'magnitude';
  color?: string;
  showValue?: boolean;    // Show numeric value
  showLabel?: boolean;
  animated?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  staggerDelay?: number;  // Animation delay in ms
  mechanical?: boolean;   // Enable mechanical styling effects
}

// Force indicator component interfaces
export interface ForceIndicatorProps {
  force: CosmicForce;
  normalizedValue: number;   // 0-1: Relative strength compared to strongest force
  fractionalValue: number;   // 0-1: Actual percentage of total cosmic force energy
  differentialValue: number; // 0-1: Position relative to range, centered at 0.5 (avg)
  variant: 'dot' | 'bar' | 'detailed';
  interactive?: boolean;
  showPercentage?: boolean;
}

// Data visualization card interfaces
export interface DataVisualizationCardProps {
  title: string;
  data: any;
  renderContent: (data: any) => React.ReactNode;
  loading?: boolean;
  error?: string;
  className?: string;
}

// Main harmonics display component props
export interface HarmonicsDisplayProps {
  data: HarmonicsData | null;
  isCalculating: boolean;
}

// Status indicator component interfaces
export interface StatusIndicatorProps {
  status: 'calculating' | 'ready' | 'error';
  message?: string;
  showIcon?: boolean;
  loadingVariant?: 'pulse' | 'spinner' | 'bars';
  size?: 'small' | 'medium' | 'large';
}

// Mechanical panel component interfaces
export interface MechanicalPanelProps {
  title: string;
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  showRivets?: boolean;
  collapsible?: boolean;
  className?: string;
}

// Panel header component interfaces
export interface PanelHeaderProps {
  title: string;
  status?: React.ReactNode;
  actions?: React.ReactNode;
  showRivets?: boolean;
}

// Animation component interfaces
export interface AnimatedProgressBarProps extends ProgressBarProps {
  staggerDelay?: number;
  animationDuration?: number;
  easingFunction?: string;
}

// Loading indicator interfaces
export interface LoadingIndicatorProps {
  variant: 'pulse' | 'spinner' | 'bars';
  size: 'small' | 'medium' | 'large';
  message?: string;
}

// Harmonics display component interfaces
export interface HarmonicsDisplayProps {
  data: HarmonicsData | null;
  isCalculating: boolean;
  onDemo?: () => void;
}

// Cosmic forces display component interfaces
export interface CosmicForcesDisplayProps {
  forces: PlanetaryHarmonics[];
  showBreakdown?: boolean;
}

// Planetary data display component interfaces
export interface PlanetaryDataDisplayProps {
  planets: PlanetaryHarmonics[];
  quantumState: QuantumEmotionalState;
  dimensions: DimensionalCoordinate[];
  synodicPeriods: Map<string, number>;
}

// Cosmic forces display component interfaces
export interface CosmicForcesDisplayProps {
  forces: PlanetaryHarmonics[];
  showBreakdown?: boolean;
}

// Planetary data display component interfaces
export interface PlanetaryDataDisplayProps {
  planets: PlanetaryHarmonics[];
  quantumState: QuantumEmotionalState;
  dimensions: DimensionalCoordinate[];
  synodicPeriods: Map<string, number>;
}

// Sidebar controls component interfaces
export interface SidebarControlsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onDemo?: () => void;
  isCalculating: boolean;
}

// Utility type for cosmic force names
export type CosmicForceName = 'Core' | 'Void' | 'Order' | 'Chaos' | 'Alpha' | 'Omega';

// Utility type for cosmic force color mapping
export type CosmicForceColors = {
  [K in CosmicForceName]: string;
};

// Constants for cosmic force data
export const COSMIC_FORCE_COLORS: CosmicForceColors = {
  'Core': '#FF8C00',    // Gold orange (Fire+Earth)
  'Void': '#1E90FF',    // Opposite of gold orange: Electric blue (Water+Air)
  'Order': '#FFD700',   // Opposite of chaos: Golden yellow (Air+Earth)
  'Chaos': '#8A2BE2',   // Purple (Fire+Water)
  'Alpha': '#8B0000',   // Most masculine: Dark red (Fire+Air)
  'Omega': '#FFB6C1'    // Opposite of masculine: Light pink (Earth+Water)
};

export const COSMIC_FORCE_DESCRIPTIONS: { [K in CosmicForceName]: string } = {
  'Core': '(Fire+Earth)',
  'Void': '(Water+Air)',
  'Order': '(Air+Earth)',
  'Chaos': '(Fire+Water)',
  'Alpha': '(Fire+Air)',
  'Omega': '(Earth+Water)'
};
