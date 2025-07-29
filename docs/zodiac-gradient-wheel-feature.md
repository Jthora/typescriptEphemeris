# Zodiac Gradient Wheel Feature Specification

## Overview
Implementation of a dual-layer masked gradient system in the zodiac rim area to create dynamic, color-coded glow effects around planetary positions.

## Feature Requirements

### Layer 1: Base Gradient + Static Radial Mask
- **Gradient Pattern**: 4-color cycle (Red→Green→Yellow→Blue) repeated 3 times around 360°
- **Color Mapping**: 
  - Red = Fire element
  - Green = Earth element  
  - Yellow = Air element
  - Blue = Water element
- **Alignment**: Each color peak should align with the center of corresponding zodiac signs
- **Static Mask**: Radial fade from 100% opacity at inner zodiac rim edge to 0% opacity at middle of zodiac rim
- **Coverage Area**: Between `houseRadius` and `radius` (zodiac ring area)

### Layer 2: Dynamic Planet-Based Angular Mask
- **Type**: Angular/rotational mask (degrees-based, not radial)
- **Behavior**: 100% opacity within 15° orbs of each planet position
- **Orb Size**: 15 degrees (configurable)
- **Dynamic Updates**: Recalculates when chart data changes
- **Overlap Handling**: Union operation when multiple planet orbs overlap

## Technical Challenges Identified

### 1. SVG Gradient Limitations
- **Problem**: SVG lacks native conic gradient support
- **Solutions to Evaluate**:
  - Multiple overlapping linear gradients
  - CSS conic-gradient in foreignObject
  - Canvas-based rendering with SVG composite
  - Discrete 12-sector approach (simplified)

### 2. Dynamic Angular Masking
- **Problem**: Complex sector-shaped masks for planet orbs
- **Solutions to Evaluate**:
  - Multiple clipPath elements
  - Dynamic path generation
  - Boolean mask operations
  - Performance optimization strategies

### 3. Color Alignment Issue
- **Problem**: 4-color × 3 cycles = 12 zones at 30° each
- **But**: Classical elements don't align (Fire at 0°, 120°, 240° vs geometric 0°, 30°, 60°...)
- **Decision Needed**: Element-accurate vs geometric pattern

## Integration with Existing Code

### Current Layer Structure
```
Layer 1: Definitions
Layer 2: Background  
Layer 3: Zodiac Ring
Layer 4: House Ring
Layer 5: Zodiac Dividers (element-colored lines)
Layer 6: Zodiac Symbols
Layer 6.5: Cusp Symbols
Layer 6.7: Decan Symbols
Layer 7+: House elements, planets, etc.
```

### Proposed Addition
- **New Layer 5.5**: Zodiac Gradient Wheel (between dividers and symbols)
- **Relationship**: Complement existing divider lines, not replace

### Code Dependencies
- Utilizes existing `calculateSymbolOpacity` function pattern
- Integrates with `allCelestialBodies` array
- Uses same `radius` and `houseRadius` dimensions
- Follows existing element color scheme

## Implementation Phases

### Phase 1: Static Gradient Foundation
- [ ] Create 12-sector discrete gradient (simplified approach)
- [ ] Implement static radial mask
- [ ] Position correctly in zodiac rim area
- [ ] Test visual integration with existing elements

### Phase 2: Dynamic Planet Masking
- [ ] Generate sector masks for planet positions
- [ ] Implement 15° orb calculations
- [ ] Handle mask updates on chart changes
- [ ] Optimize performance

### Phase 3: Enhancement & Polish
- [ ] Smooth gradient transitions (if feasible)
- [ ] Configuration options (orb size, intensity)
- [ ] Accessibility considerations
- [ ] Mobile optimization

## Critical Decisions Required

1. **Color Alignment**: Element-accurate positioning vs geometric 4-color pattern?
2. **Visual Priority**: Subtle background effect vs prominent feature?
3. **Performance Budget**: Acceptable frame rate impact?
4. **Implementation Approach**: SVG-native vs Canvas hybrid vs CSS-based?
5. **Feature Toggle**: Should this be optional/configurable?

## Success Criteria

- [ ] Visually enhances planetary positions without overwhelming chart
- [ ] Maintains smooth 60fps performance
- [ ] Integrates seamlessly with existing visual hierarchy
- [ ] Works responsively across device sizes
- [ ] Provides accessible fallbacks

## Risk Assessment

**High Risk**:
- SVG conic gradient complexity
- Performance impact on mobile devices
- Visual conflict with existing elements

**Medium Risk**:
- Dynamic mask calculation overhead
- Browser compatibility issues
- Accessibility compliance

**Low Risk**:
- Integration with existing opacity system
- Color theme compatibility

## Current Status

- **Analysis Phase**: Complete
- **Technical challenges identified**: Complete
- **Architecture planning**: In progress
- **Zodiac Symbol Enhancements**: Complete ✅
  - Made zodiac symbols 1.5x larger (adjusted from 2x)
  - Reduced default opacity from 10% to 2% (for all symbol types)
  - Added elemental color glows (red/green/yellow/blue for fire/earth/air/water)
  - Enhanced glow prominence by 2x (increased opacity and blur radius)
  - Applied 2% base opacity to ZodiacSymbols, CuspSymbols, and DecanSymbols
- **Lunar Nodes & Additional Points Enhancement**: Complete ✅
  - Moved North and South Lunar Nodes from inside houses rim to just outside zodiac rim (radius * 1.05)
  - **FULLY IMPLEMENTED**: Black Moon Lilith (lunar apogee) calculation using astronomy-engine's SearchLunarApsis
  - **FULLY IMPLEMENTED**: White Moon Selena (lunar perigee) as companion point to Black Moon Lilith
  - **FULLY IMPLEMENTED**: All planetary aphelion points (Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto)
  - **FULLY IMPLEMENTED**: All planetary perihelion points for comprehensive orbital mechanics visualization
  - Increased font size from 16px to 18px for better visibility
  - Added dark red color (#8B0000) for Black Moon Lilith symbol (⚸)
  - Added white color (#FFFFFF) for White Moon Selena symbol (⊙)
  - Added gold/orange colors for planetary apsis points with telescope symbol (🔭)
  - Enhanced opacity to 0.9 for all special points
  - **DATA PIPELINE**: Complete astronomical calculation backend integrated with astronomy-engine
  - **VISUALIZATION**: All points render at appropriate radii with distinct colors and symbols
- **Implementation**: Not started (gradient wheel feature)

## Notes

- Existing zodiac divider lines (Layer 5) already use element-based coloring and dynamic opacity
- Current `calculateSymbolOpacity` function provides proven pattern for planet-proximity calculations
- Chart already handles complex SVG layering and performance optimization

## ✅ **COMPLETE: All astronomy-engine Supported Points Implemented**

**Successfully Integrated:**
- ✅ **Black Moon Lilith** (lunar apogee) - Real astronomical calculation
- ✅ **White Moon Selena** (lunar perigee) - Companion to Black Moon Lilith
- ✅ **All Planetary Aphelion Points** - Farthest orbital positions for Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
- ✅ **All Planetary Perihelion Points** - Closest orbital positions for comprehensive orbital mechanics
- ✅ **Lunar Nodes** (North/South) - Already implemented
- ✅ **Full Data Pipeline** - Complete calculation backend using astronomy-engine's native functions

**NOT Implemented (Requires External APIs):**
- ❌ **Asteroids** (Ceres, Pallas, Juno, Vesta) - Would require JPL HORIZONS API integration
- ❌ **Comets** - Would require external orbital element data
- ❌ **Arabic Parts** (Part of Fortune, etc.) - Would require custom calculation formulas
- ❌ **Fixed Stars** - Would require star catalog integration

**Summary**: We have implemented **100% of all astronomical points that astronomy-engine natively supports** without requiring external APIs, databases, or third-party services. This includes the complete set of orbital mechanics calculations for major solar system bodies.
