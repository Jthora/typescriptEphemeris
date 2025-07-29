# House System Implementation Plan

## Overview
This document outlines the implementation plan for upgrading the astrology chart application to support multiple house systems, with Placidus as the default, and adding a dropdown selector in the left sidebar.

## Current State Analysis

### Existing Implementation
- **Current System**: Equal House only (30° divisions from Ascendant)
- **Location**: `astrology.ts` - `calculateHouses()` method
- **Interface**: `HouseSystem` interface exists with `cusps: number[]` and `system: string`
- **UI**: No house system selector currently exists

### Codebase Structure
- **State Management**: App.tsx manages `birthData` state
- **Calculator**: `AstrologyCalculator.calculateChart(birthData)` 
- **UI Pattern**: LeftSideDrawer contains form fields with `.form-group` styling
- **Dropdown Pattern**: ThemeToggle component shows custom dropdown implementation

## Implementation Plan

### Phase 1: Core Types & Constants (astrology.ts)

#### 1.1 Add House System Types
```typescript
export type HouseSystemType = 
  | 'placidus' 
  | 'equal' 
  | 'koch' 
  | 'whole-sign' 
  | 'campanus' 
  | 'regiomontanus';

export const HOUSE_SYSTEMS = {
  placidus: { 
    name: 'Placidus', 
    description: 'Most widely used system',
    isDefault: true 
  },
  equal: { 
    name: 'Equal House', 
    description: 'Simple 30° divisions',
    isDefault: false 
  },
  koch: { 
    name: 'Koch', 
    description: 'Birthplace system',
    isDefault: false 
  },
  'whole-sign': { 
    name: 'Whole Sign', 
    description: 'Ancient system',
    isDefault: false 
  },
  campanus: { 
    name: 'Campanus', 
    description: 'Prime vertical system',
    isDefault: false 
  },
  regiomontanus: { 
    name: 'Regiomontanus', 
    description: 'Medieval system',
    isDefault: false 
  }
} as const;
```

#### 1.2 Extend BirthData Interface
```typescript
export interface BirthData {
  date: Date;
  latitude: number;
  longitude: number;
  name?: string;
  houseSystem?: HouseSystemType; // NEW: Optional house system preference
}
```

#### 1.3 Update Method Signatures
```typescript
// Current
async calculateChart(birthData: BirthData): Promise<AstrologyChart>

// New
async calculateChart(birthData: BirthData, houseSystem?: HouseSystemType): Promise<AstrologyChart>

// Current
private calculateHouses(astroTime: any, latitude: number, _longitude: number): HouseSystem

// New  
private calculateHouses(astroTime: any, latitude: number, longitude: number, system: HouseSystemType): HouseSystem
```

### Phase 2: House Calculation Logic (astrology.ts)

#### 2.1 Main calculateHouses Method
```typescript
private calculateHouses(astroTime: any, latitude: number, longitude: number, system: HouseSystemType): HouseSystem {
  try {
    switch (system) {
      case 'placidus':
        return this.calculatePlacidusHouses(astroTime, latitude, longitude);
      case 'equal':
        return this.calculateEqualHouses(astroTime, latitude, longitude);
      case 'koch':
        return this.calculateKochHouses(astroTime, latitude, longitude);
      case 'whole-sign':
        return this.calculateWholeSignHouses(astroTime, latitude, longitude);
      case 'campanus':
        return this.calculateCampanusHouses(astroTime, latitude, longitude);
      case 'regiomontanus':
        return this.calculateRegiomontanusHouses(astroTime, latitude, longitude);
      default:
        console.warn(`Unknown house system: ${system}, falling back to Placidus`);
        return this.calculatePlacidusHouses(astroTime, latitude, longitude);
    }
  } catch (error) {
    console.warn(`House calculation failed for ${system}, falling back to Equal House:`, error);
    return this.calculateEqualHouses(astroTime, latitude, longitude);
  }
}
```

#### 2.2 Placidus Implementation (Priority)
```typescript
private calculatePlacidusHouses(astroTime: any, latitude: number, longitude: number): HouseSystem {
  // Key components needed:
  // 1. Sidereal Time calculation (already available)
  // 2. Ascendant and MC calculation
  // 3. Oblique ascension formulas
  // 4. Time division between MC and Ascendant for intermediate houses
  
  const siderealTime = Astronomy.SiderealTime(astroTime);
  const ascendant = this.calculateAscendant(siderealTime, latitude);
  const midheaven = this.calculateMidheaven(siderealTime);
  
  // Implementation details:
  // - Houses 1, 4, 7, 10 are angles (ASC, IC, DSC, MC)
  // - Houses 2, 3, 5, 6, 8, 9, 11, 12 calculated via trisection
  // - Use oblique ascension for latitude corrections
  
  return {
    cusps: cusps,
    system: 'Placidus'
  };
}
```

#### 2.3 Other House Systems (Lower Priority)
- Equal House (already implemented, needs refactoring)
- Koch, Whole Sign, Campanus, Regiomontanus (implement later)

### Phase 3: UI State Management (App.tsx)

#### 3.1 Add House System State
```typescript
// Add to App component state
const [houseSystem, setHouseSystem] = useState<HouseSystemType>('placidus');

// Update chart calculation
const calculateChart = useCallback(async () => {
  setIsCalculating(true);
  setError('');
  
  try {
    console.log('🚀 Starting chart calculation with birth data:', birthData, 'house system:', houseSystem);
    const newChart = await astrologyCalculator.calculateChart(birthData, houseSystem);
    // ... rest of method
  }
  // ... error handling
}, [birthData, houseSystem]); // Add houseSystem to dependencies
```

#### 3.2 Pass Props to LeftSideDrawer
```typescript
<LeftSideDrawer
  isOpen={leftPanelOpen}
  onClose={() => setLeftPanelOpen(false)}
  birthData={birthData}
  onInputChange={handleInputChange}
  houseSystem={houseSystem}
  onHouseSystemChange={setHouseSystem}
  exampleLocations={exampleLocations}
/>
```

### Phase 4: Dropdown Component (LeftSideDrawer.tsx)

#### 4.1 Update Component Interface
```typescript
interface LeftSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  birthData: BirthData;
  onInputChange: (field: keyof BirthData, value: string | number | Date) => void;
  houseSystem: HouseSystemType; // NEW
  onHouseSystemChange: (system: HouseSystemType) => void; // NEW
  exampleLocations: Array<{name: string; lat: number; lng: number}>;
}
```

#### 4.2 Add House System Selector
```typescript
// Import Settings icon
import { CalendarDays, MapPin, Settings } from 'lucide-react';

// Add to form section after date field
<div className="form-group">
  <label htmlFor="houseSystem" className="form-label">
    <Settings size={16} />
    <span>House System</span>
  </label>
  <select
    id="houseSystem"
    className="form-select"
    value={houseSystem}
    onChange={(e) => onHouseSystemChange(e.target.value as HouseSystemType)}
  >
    {Object.entries(HOUSE_SYSTEMS).map(([key, info]) => (
      <option key={key} value={key}>
        {info.name} {info.isDefault ? '(Default)' : ''}
      </option>
    ))}
  </select>
  <div className="form-hint">
    {HOUSE_SYSTEMS[houseSystem].description}
  </div>
</div>
```

### Phase 5: Styling (App.css)

#### 5.1 Add Select Dropdown Styles
```css
/* Form select styling to match existing inputs */
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-surface);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-primary);
}

.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 168, 255, 0.1);
}

.form-select option {
  background: var(--color-surface);
  color: var(--color-text-primary);
  padding: 0.5rem;
}

/* Form hint text for descriptions */
.form-hint {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
  font-style: italic;
}
```

## Implementation Timeline

### Iteration 1: Foundation (High Priority)
1. ✅ **Analysis Complete**: Codebase exploration and planning
2. **Add Types**: House system types and constants in astrology.ts
3. **Basic Placidus**: Implement core Placidus calculation
4. **State Management**: Add house system state to App.tsx
5. **UI Dropdown**: Basic select element in LeftSideDrawer

### Iteration 2: Polish (Medium Priority)
6. **Styling**: Match dropdown to app theme
7. **Error Handling**: Fallbacks for calculation failures
8. **Testing**: Verify Placidus accuracy against known charts
9. **Documentation**: User-facing help text

### Iteration 3: Expansion (Lower Priority)
10. **Additional Systems**: Koch, Whole Sign implementations
11. **Advanced Features**: House system preferences persistence
12. **Performance**: Caching and optimization

## Technical Considerations

### Mathematical Requirements for Placidus
- **Sidereal Time**: `Astronomy.SiderealTime(astroTime)` ✅ Available
- **Ascendant**: Calculate from sidereal time and latitude ✅ Partially implemented
- **Midheaven**: Calculate from sidereal time ✅ Partially implemented  
- **Oblique Ascension**: Complex trigonometric formulas ❌ Needs implementation
- **Time Division**: Trisect semi-arcs between angles ❌ Needs implementation

### Error Handling Strategy
- **Extreme Latitudes**: Placidus fails near poles, fallback to Equal House
- **Invalid Coordinates**: Graceful degradation with user notification
- **Calculation Errors**: Always provide fallback house system

### Performance Optimizations
- **Debounced Updates**: Follow existing pattern for real-time mode
- **Calculation Caching**: Cache house cusps when birth data unchanged
- **Lazy Loading**: Only calculate selected house system

### Data Persistence
- **Local Storage**: Consider storing house system preference
- **URL Parameters**: Potentially include in shareable chart URLs

## File Dependencies

### Files to Modify
- `astrology-chart/src/astrology.ts` - Core calculation logic
- `astrology-chart/src/App.tsx` - State management
- `astrology-chart/src/components/LeftSideDrawer.tsx` - UI component
- `astrology-chart/src/App.css` - Styling

### Files to Reference
- `astrology-chart/src/components/ThemeToggle.tsx` - Dropdown pattern
- `astrology-chart/src/components/ThemeToggle.css` - Dropdown styling
- `astrology-chart/src/components/SideDrawers.css` - Form styling

## Success Criteria

### Functional Requirements
- ✅ Dropdown displays available house systems
- ✅ Placidus selected by default
- ✅ Chart updates when house system changes
- ✅ House cusps calculated accurately for Placidus
- ✅ Fallback to Equal House on calculation errors

### Quality Requirements
- ✅ UI matches existing app aesthetic
- ✅ Performance comparable to current implementation
- ✅ Error handling provides user feedback
- ✅ Code follows existing patterns and conventions

### Validation Methods
- **Manual Testing**: Compare against professional astrology software
- **Known Charts**: Test with celebrities/historical figures
- **Edge Cases**: Test extreme latitudes and coordinates
- **Performance**: Measure calculation times

---

**Status**: Planning Complete - Ready for Implementation
**Next Step**: Begin Phase 1 - Core Types & Constants
**Updated**: July 29, 2025
