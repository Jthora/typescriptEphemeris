# Technical Implementation Specifications

## CSS Variable Mapping & Implementation Details

### Color System Migration Map

#### Background Colors
```css
/* BEFORE (Legacy) */
background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);

/* AFTER (Techno-Mechanical) */
background: var(--color-panel);
background-image: 
  linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px);
background-size: 20px 20px;
```

#### Accent Colors
```css
/* BEFORE */
color: #ffd700;          /* Gold primary */
border-color: #ffa500;   /* Orange accent */
background: #4ECDC4;     /* Teal elements */

/* AFTER */
color: var(--color-primary);           /* #00A8FF */
border-color: var(--color-info);       /* #03E9F4 */
background: var(--color-success);      /* #0AE173 */
```

#### Text Hierarchy
```css
/* BEFORE */
color: #ffffff;    /* Primary text */
color: #b8b8cc;    /* Secondary text */
color: #95a5a6;    /* Muted text */

/* AFTER */
color: var(--color-text-primary);     /* #E0E6F0 */
color: var(--color-text-secondary);   /* #B8C0CC */
color: var(--color-text-disabled);    /* #636B7A */
```

---

## Component-by-Component Implementation

### 1. Main Container Transformation

```css
/* BEFORE */
.planetary-harmonics-sidebar {
  width: 400px;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #ffffff;
  border-left: 1px solid #2a2a5a;
  overflow-y: auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* AFTER */
.planetary-harmonics-sidebar {
  width: var(--panel-width);
  min-height: 100vh;
  background: var(--color-panel);
  background-image: 
    linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  color: var(--color-text-primary);
  border-left: var(--border-width) var(--border-style) var(--color-border);
  overflow-y: auto;
  font-family: var(--font-primary);
  position: relative;
}

/* Add mechanical panel lip effect */
.planetary-harmonics-sidebar::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--panel-lip-width);
  background: linear-gradient(to bottom, 
    var(--color-border-highlight) 0%,
    var(--color-border) 20%,
    var(--color-border) 80%,
    var(--color-border-highlight) 100%);
  z-index: 1;
}
```

### 2. Header Section Redesign

```css
/* BEFORE */
.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #2a2a5a;
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-header h3 {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  font-weight: 600;
  background: linear-gradient(45deg, #ffd700, #ffa500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* AFTER */
.sidebar-header {
  padding: var(--panel-padding);
  padding-left: calc(var(--panel-padding) + var(--panel-lip-width));
  border-bottom: var(--border-width) var(--border-style) var(--color-border);
  background: var(--color-surface);
  position: relative;
}

/* Add mechanical header decoration */
.sidebar-header::after {
  content: "";
  position: absolute;
  top: 50%;
  right: var(--panel-padding);
  transform: translateY(-50%);
  width: var(--screw-size);
  height: var(--screw-size);
  background: var(--color-border-highlight);
  border-radius: 50%;
  box-shadow: 
    inset 0 0 0 2px var(--color-border),
    0 1px 2px var(--color-shadow);
}

.sidebar-header h3 {
  margin: 0 0 var(--section-gap) 0;
  font-size: 1.2rem;
  font-weight: 600;
  font-family: var(--font-primary);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

### 3. Tab System Complete Overhaul

```css
/* BEFORE */
.sidebar-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid #2a2a5a;
  overflow-x: auto;
}

.tab {
  flex: 1;
  min-width: 80px;
  padding: 12px 8px;
  background: transparent;
  color: #b8b8cc;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.tab.active {
  color: #ffd700;
  border-bottom-color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
}

/* AFTER */
.sidebar-tabs {
  display: flex;
  background: var(--color-surface);
  border-bottom: var(--border-width) var(--border-style) var(--color-border);
  overflow-x: auto;
  margin-left: var(--panel-lip-width);
  position: relative;
}

.tab {
  flex: 1;
  min-width: 80px;
  padding: calc(var(--panel-padding) * 0.75) var(--section-gap);
  background: transparent;
  color: var(--color-text-secondary);
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--font-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all var(--animation-press);
  white-space: nowrap;
  position: relative;
}

/* Mechanical button press effect */
.tab:hover {
  color: var(--color-text-primary);
  background: var(--color-border);
  transform: translateY(1px);
  box-shadow: inset 0 1px 2px var(--color-shadow);
}

.tab:active {
  transform: translateY(2px);
  box-shadow: inset 0 2px 4px var(--color-shadow);
}

.tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  background: rgba(0, 168, 255, 0.1);
  box-shadow: 
    inset 0 1px 2px rgba(0, 168, 255, 0.2),
    0 -2px 4px rgba(0, 168, 255, 0.1);
}

/* Add mechanical tab separators */
.tab:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 25%;
  bottom: 25%;
  width: 1px;
  background: var(--color-border);
}
```

### 4. Data Visualization Bars

```css
/* BEFORE */
.harmonic-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.harmonic-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

/* AFTER */
.harmonic-bar {
  flex: 1;
  height: 6px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--corner-radius-small);
  overflow: hidden;
  box-shadow: var(--inset-shadow);
  position: relative;
}

.harmonic-fill {
  height: 100%;
  background: linear-gradient(90deg, 
    var(--color-primary) 0%, 
    var(--color-info) 100%);
  border-radius: var(--corner-radius-small);
  transition: width var(--animation-duration-open) var(--animation-easing-open);
  box-shadow: var(--outset-shadow);
  position: relative;
}

/* Add mechanical progress indicator */
.harmonic-fill::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 2px rgba(255, 255, 255, 0.3);
}
```

### 5. Force Indicators Modernization

```css
/* BEFORE */
.force-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* AFTER */
.force-indicator {
  width: 12px;
  height: 12px;
  border: 2px solid var(--color-border);
  border-radius: var(--corner-radius-small);
  background: var(--force-color);
  box-shadow: 
    var(--inset-shadow),
    0 1px 2px var(--color-shadow);
  position: relative;
  transition: all var(--animation-press);
}

/* Add mechanical rivet effect */
.force-indicator::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  background: var(--color-border-highlight);
  border-radius: 50%;
  box-shadow: inset 0 0 1px var(--color-shadow);
}
```

### 6. Button System Redesign

```css
/* BEFORE */
.demo-btn {
  width: 100%;
  padding: 8px 12px;
  background: linear-gradient(45deg, #ffd700, #ffa500);
  color: #1a1a2e;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.demo-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

/* AFTER */
.demo-btn {
  width: 100%;
  padding: calc(var(--panel-padding) * 0.75) var(--panel-padding);
  background: var(--color-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-highlight);
  border-radius: var(--corner-radius-medium);
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--font-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all var(--animation-press);
  box-shadow: var(--outset-shadow);
  position: relative;
  overflow: hidden;
}

/* Mechanical button states */
.demo-btn:hover {
  background: var(--color-primary-dim);
  transform: translateY(-1px);
  box-shadow: 
    var(--outset-shadow),
    0 3px 6px var(--color-shadow);
}

.demo-btn:active {
  transform: translateY(1px);
  box-shadow: var(--inset-shadow);
  background: var(--color-base-dark);
}

/* Add mechanical button highlight */
.demo-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.4), 
    transparent);
  transition: left 0.5s ease;
}

.demo-btn:hover::before {
  left: 100%;
}
```

---

## Animation Enhancements

### Mechanical Loading States

```css
/* Enhanced pulse animation */
@keyframes mechanical-pulse {
  0% { 
    opacity: 1;
    box-shadow: var(--outset-shadow);
    transform: scale(1);
  }
  50% { 
    opacity: 0.7;
    box-shadow: var(--inset-shadow);
    transform: scale(0.98);
  }
  100% { 
    opacity: 1;
    box-shadow: var(--outset-shadow);
    transform: scale(1);
  }
}

.calculating {
  animation: mechanical-pulse var(--animation-glow) ease-in-out infinite;
}
```

### Data Bar Animations

```css
/* Enhanced bar fill animation */
.harmonic-fill {
  transition: 
    width var(--animation-duration-open) var(--animation-easing-open),
    background-color var(--animation-press) ease;
}

/* Staggered animation for multiple bars */
.harmonic-component:nth-child(1) .harmonic-fill { transition-delay: 0ms; }
.harmonic-component:nth-child(2) .harmonic-fill { transition-delay: 50ms; }
.harmonic-component:nth-child(3) .harmonic-fill { transition-delay: 100ms; }
.harmonic-component:nth-child(4) .harmonic-fill { transition-delay: 150ms; }
.harmonic-component:nth-child(5) .harmonic-fill { transition-delay: 200ms; }
```

---

## Responsive Design Specifications

### Breakpoint System

```css
/* Large screens (default) */
.planetary-harmonics-sidebar {
  width: var(--panel-width); /* 320px */
}

/* Medium screens */
@media (max-width: 1200px) {
  .planetary-harmonics-sidebar {
    width: calc(var(--panel-width) - 20px); /* 300px */
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
    gap: var(--section-gap);
  }
  
  .amplitude-grid {
    grid-template-columns: 1fr;
  }
}

/* Small screens */
@media (max-width: 768px) {
  .planetary-harmonics-sidebar {
    width: var(--panel-width-mobile);
    min-width: 280px;
  }
  
  .sidebar-tabs {
    font-size: 0.7rem;
  }
  
  .tab {
    min-width: 60px;
    padding: var(--section-gap);
  }
}
```

---

## Force Color System Integration

### Cosmic Force Palette

```css
/* Update force color function to use theme-compatible colors */
:root {
  --force-core: #FF6B35;      /* Fire+Earth: Orange-red */
  --force-void: #03E9F4;      /* Water+Air: Cyber teal */
  --force-order: #00A8FF;     /* Air+Earth: Primary blue */
  --force-chaos: #0AE173;     /* Fire+Water: Success green */
  --force-alpha: #FFC107;     /* Fire+Air: Warning yellow */
  --force-omega: #FF4757;     /* Earth+Water: Error red */
}
```

### Implementation in JavaScript

```typescript
// Update getCosmicForceColor function
const getCosmicForceColor = (force: string): string => {
  const colors = {
    'Core': 'var(--force-core)',
    'Void': 'var(--force-void)',
    'Order': 'var(--force-order)',
    'Chaos': 'var(--force-chaos)',
    'Alpha': 'var(--force-alpha)',
    'Omega': 'var(--force-omega)'
  };
  return colors[force as keyof typeof colors] || 'var(--color-text-disabled)';
};
```

---

## Quality Assurance Checklist

### Visual Consistency
- [ ] All hardcoded colors replaced with CSS variables
- [ ] Typography uses Aldrich font family consistently
- [ ] Border radius follows theme standards (2px/4px)
- [ ] Spacing uses theme variables exclusively
- [ ] Shadows follow mechanical aesthetic

### Functional Preservation
- [ ] Tab switching animations work smoothly
- [ ] Data bar animations trigger correctly
- [ ] Mathematical calculations display accurately
- [ ] Color coding for forces remains clear
- [ ] Responsive breakpoints function properly

### Performance Validation
- [ ] No increase in CSS bundle size
- [ ] Animations maintain 60fps performance
- [ ] Hover states respond immediately
- [ ] No layout shift during data updates
- [ ] Smooth scrolling performance maintained

### Cross-Browser Compatibility
- [ ] Chrome/Edge: Full feature support
- [ ] Firefox: CSS variable fallbacks work
- [ ] Safari: Webkit-specific prefixes included
- [ ] Mobile browsers: Touch interactions work

---

This technical specification provides exact CSS implementations and migration paths for transforming the Planetary Harmonics sidebar while maintaining full functionality and achieving complete visual integration with the techno-mechanical design system.
