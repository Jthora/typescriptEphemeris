# 🌟 Astrology Birth Chart Calculator

A modern, accurate astrology birth chart application built with React, TypeScript, and astronomical ephemeris calculations. This application uses the `astronomy-engine` library to provide precise planetary positions and create beautiful, interactive birth charts.

## ✨ Features

### 🎯 Core Functionality
- **Accurate Astronomical Calculations**: Uses `astronomy-engine` for precise planetary positions
- **Real-time Chart Generation**: Calculate birth charts instantly with accurate ephemeris data
- **Comprehensive Planetary Data**: Includes all planets, Sun, Moon, lunar nodes, and more
- **Professional Chart Visualization**: Beautiful SVG-based chart wheel with D3.js
- **Detailed Chart Information**: Comprehensive tables showing planetary positions, houses, and aspects

### 🎨 User Interface
- **Modern Design**: Clean, responsive interface with gradient backgrounds and smooth animations
- **Interactive Input**: Easy-to-use forms with date/time pickers and location presets
- **Quick Location Selection**: Pre-configured major cities for convenience
- **Mobile Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support

### 📊 Astrological Features
- **Planetary Positions**: Accurate positions for all major planets plus lunar nodes
- **House System**: Equal house system with clearly marked house cusps
- **Major Aspects**: Conjunctions, oppositions, trines, squares, and sextiles
- **Retrograde Indicators**: Visual markers for retrograde planets
- **Zodiac Signs**: Complete zodiac wheel with symbols and degree positions
- **Lunar Nodes**: North and South Node positions with accurate calculations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Navigate to the astrology chart directory**:
   ```bash
   cd astrology-chart
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🎯 How to Use

### 1. Enter Birth Information
- **Name**: (Optional) Enter the person's name
- **Birth Date**: Select the birth date using the date picker
- **Birth Time**: Enter the exact time of birth (important for accurate house positions)
- **Location**: Enter latitude and longitude, or use quick location presets

### 2. Generate Chart
- Click "Calculate Birth Chart" to generate the chart
- The application will calculate planetary positions for the exact date, time, and location
- Results appear instantly with both visual chart and detailed data

### 3. Interpret the Chart
- **Chart Wheel**: Visual representation with planets, signs, houses, and aspects
- **Planetary Positions**: Table showing each planet's sign, degree, and house
- **House Cusps**: Detailed house system information
- **Aspects**: Major planetary aspects with orbs and types
- **Lunar Nodes**: North and South Node positions

## 🏗️ Technical Architecture

### Frontend Stack
- **React 19**: Modern React with hooks for state management
- **TypeScript**: Full type safety and excellent IDE support
- **Vite**: Lightning-fast build tool and development server
- **D3.js**: Powerful SVG rendering for the chart wheel
- **CSS Grid/Flexbox**: Responsive layout system

### Astronomical Engine
- **astronomy-engine**: Professional astronomical calculations
- **Geocentric Coordinates**: Earth-centered perspective for astrology
- **High Precision**: Accurate to arc-minutes for professional use
- **Real Ephemeris Data**: Based on JPL DE405 ephemeris

## 🎨 Chart Components

### Chart Wheel
- **Zodiac Ring**: Outer ring showing the 12 zodiac signs with symbols
- **Planet Ring**: Planetary positions with color-coded symbols
- **House Ring**: House divisions with numbered sections
- **Aspect Lines**: Visual connections showing major aspects
- **Node Markers**: Special symbols for lunar nodes

### Chart Details
- **Planetary Table**: Comprehensive planetary data with signs and houses
- **House System**: Detailed house cusp positions
- **Aspect Grid**: Complete aspect analysis with orbs
- **Summary Information**: Chart metadata and statistics

## 🔧 Configuration

### Location Presets
The application includes quick presets for major cities:
- New York, NY (40.7128°N, 74.0060°W)
- Los Angeles, CA (34.0522°N, 118.2437°W)
- London, UK (51.5074°N, 0.1278°W)
- Paris, France (48.8566°N, 2.3522°E)
- Tokyo, Japan (35.6762°N, 139.6503°E)
- Sydney, Australia (33.8688°S, 151.2093°E)

### Aspect Configuration
Current aspect types and orbs:
- **Conjunction**: 0° (8° orb)
- **Opposition**: 180° (8° orb)
- **Trine**: 120° (6° orb)
- **Square**: 90° (6° orb)
- **Sextile**: 60° (4° orb)

## 🛠️ Development

### Project Structure
```
astrology-chart/
├── src/
│   ├── components/
│   │   ├── ChartWheel.tsx      # SVG chart visualization
│   │   └── ChartDetails.tsx    # Detailed chart information
│   ├── astrology.ts            # Astrological calculation engine
│   ├── ephemeris.ts           # Astronomical ephemeris calculations
│   ├── App.tsx                # Main application component
│   ├── App.css               # Application styles
│   └── index.css             # Global styles
├── public/                   # Static assets
├── package.json             # Dependencies and scripts
└── vite.config.ts          # Vite configuration
```

### Key Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run TypeScript and ESLint checks
npm run preview      # Preview production build
```

## 🔮 Future Enhancements

### Planned Features
- **Asteroid Support**: Include major asteroids (Ceres, Pallas, Juno, Vesta)
- **Multiple House Systems**: Placidus, Koch, Whole Sign options
- **Transit Calculations**: Current planetary transits to natal chart
- **Synastry Charts**: Relationship compatibility charts
- **Chart Export**: PDF/PNG export functionality
- **Advanced Aspects**: Minor aspects (quintiles, septiles, etc.)

### Technical Improvements
- **Progressive Web App**: Offline functionality and app installation
- **Chart Animation**: Smooth transitions and interactive elements
- **API Integration**: Connect to external astrological databases
- **User Accounts**: Save and manage multiple charts
- **Localization**: Multi-language support

## 📱 Browser Support

- **Chrome/Chromium**: 88+ (recommended)
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

## 📄 License

This project is part of the TypeScript Ephemeris workspace and follows the same licensing terms.

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and include tests for new features.

## 🆘 Support

For questions or issues:
1. Check the browser console for error messages
2. Verify birth data is entered correctly
3. Ensure JavaScript is enabled
4. Try refreshing the page

---

**Built with ❤️ using modern web technologies and astronomical precision**
