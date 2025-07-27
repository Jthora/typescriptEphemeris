# TypeScript Ephemeris Calculator 🌟

A high-performance TypeScript library for astronomical ephemeris calculations, optimized for minimal VSCode lag and fast development. **Now includes a complete astrology birth chart application!**

## Projects

### 🔭 Core Ephemeris Engine (`src/`)
High-performance astronomical calculation library with geocentric coordinates, rise/set times, nodes, apsis, and more.

### 🌟 Astrology Birth Chart App (`astrology-chart/`)
Complete React TypeScript application for generating professional astrology birth charts with:
- **Real-time chart calculation** using astronomical ephemeris data
- **Beautiful chart wheel visualization** with D3.js and SVG
- **Comprehensive planetary data** including all planets, nodes, houses, and aspects
- **Techno-mechanical UI** inspired by Starcraft and C&C Tiberian Sun interfaces
- **Dark/Light Theme Support** with system detection and manual override
- **Mobile-friendly design** with swipeable panels and responsive layout
- **Hardware-style controls** with proper mechanical feedback animations
- **Quick location presets** for major cities worldwide

## Features

- **Fast Development**: Optimized for VSCode performance with minimal indexing overhead
- **Modern TypeScript**: ES2022 target with full type safety
- **Astronomical Accuracy**: Powered by the `astronomy-engine` library
- **Performance-First**: Incremental compilation and fast builds with Vite
- **Zero-Config**: Ready to use with sensible defaults

## Quick Start

```bash
# Run the example
npm run start

# Development with auto-reload
npm run dev

# Build for production
npm run build

# Type checking only
npm run type-check
```

## Usage Example

```typescript
import EphemerisCalculator, { formatRA, formatDec } from './src/index.js';
import * as Astronomy from 'astronomy-engine';

// Create calculator for your location (lat, lon, elevation)
const ephemeris = new EphemerisCalculator(51.4769, -0.0005, 46);

// Calculate Mars ephemeris for the next 30 days
const marsData = ephemeris.calculatePlanetEphemeris(Astronomy.Body.Mars, {
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  stepSize: 1, // 1 day steps
  includeVelocity: true
});

// Format and display results
marsData.forEach((data, index) => {
  console.log(`RA: ${formatRA(data.position.ra)}`);
  console.log(`Dec: ${formatDec(data.position.dec)}`);
  console.log(`Distance: ${data.position.distance.toFixed(4)} AU`);
});
```

## 🌟 Astrology Birth Chart Application

### Quick Start with Astrology App

```bash
# Navigate to the astrology chart application
cd astrology-chart

# Install dependencies
npm install

# Start the development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Features
- **Professional birth chart calculation** with accurate planetary positions
- **Interactive chart wheel** showing planets, signs, houses, and aspects
- **Comprehensive data tables** with planetary positions, house cusps, and aspects
- **Quick location presets** for major cities worldwide
- **Modern responsive design** that works on all devices
- **Real-time calculations** using the ephemeris engine

See the [`astrology-chart/README.md`](./astrology-chart/README.md) for complete documentation.

## Performance Optimizations

This workspace is specifically optimized to prevent VSCode, Git, and Copilot from lagging:

### VSCode Settings
- ✅ Excluded `node_modules`, `dist`, and build artifacts from file watching
- ✅ Disabled automatic type acquisition for faster startup
- ✅ Optimized TypeScript IntelliSense settings
- ✅ Configured search exclusions to prevent slow indexing
- ✅ Disabled telemetry and experiments

### Build Performance
- ✅ Incremental TypeScript compilation with `.tsbuildinfo`
- ✅ Vite for lightning-fast development builds
- ✅ ESM modules for better tree-shaking
- ✅ Separate type-checking from compilation

### Git Performance
- ✅ Disabled auto-fetch to prevent network delays
- ✅ Smart commit enabled
- ✅ Comprehensive `.gitignore` for build artifacts

## API Reference

### EphemerisCalculator

```typescript
class EphemerisCalculator {
  constructor(latitude: number, longitude: number, elevation?: number)
  
  calculatePlanetEphemeris(body: Astronomy.Body, options: EphemerisOptions): CelestialBody[]
  calculateMoonEphemeris(options: EphemerisOptions): CelestialBody[]
  calculateSunEphemeris(options: EphemerisOptions): CelestialBody[]
  calculateRiseTransitSet(body: Astronomy.Body, date: Date): { rise?: Date; transit?: Date; set?: Date }
  setObserver(latitude: number, longitude: number, elevation?: number): void
}
```

### Interfaces

```typescript
interface CelestialBody {
  name: string;
  position: { ra: number; dec: number; distance: number };
  velocity: { ra: number; dec: number; radial: number };
}

interface EphemerisOptions {
  observer?: Astronomy.Observer;
  startDate: Date;
  endDate: Date;
  stepSize: number; // in days
  includeVelocity?: boolean;
}
```

### Utility Functions

```typescript
formatRA(ra: number): string    // Format Right Ascension as "HHh MMm SS.Ss"
formatDec(dec: number): string  // Format Declination as "±DD° MM' SS.S""
```

## Development Scripts

| Script | Description |
|--------|-------------|
| `npm run start` | Run the example calculation |
| `npm run dev` | Development mode with auto-reload |
| `npm run build` | Full TypeScript + Vite build |
| `npm run build:fast` | Fast Vite-only build |
| `npm run type-check` | Type checking without emit |
| `npm run test` | Run tests with Vitest |
| `npm run clean` | Clean build artifacts |

## Supported Celestial Bodies

The calculator supports all bodies from the `astronomy-engine` library:
- ☀️ Sun
- 🌙 Moon  
- ☿️ Mercury
- ♀️ Venus
- ♂️ Mars
- ♃ Jupiter
- ♄ Saturn
- ♅ Uranus
- ♆ Neptune
- ♇ Pluto

## Contributing

This project is optimized for development performance. When contributing:

1. Use the provided VSCode settings for optimal performance
2. Follow the TypeScript strict mode conventions
3. Include proper JSDoc comments for public APIs
4. Use the astronomy-engine library for all calculations
5. Test with the example script before submitting

## License

MIT
