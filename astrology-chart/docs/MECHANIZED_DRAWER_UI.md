# Mechanized Drawer UI Implementation

This document explains the implementation of the integrated panel toggle buttons that move with the drawers (shelves) in a mechanized manner, creating the appearance of being part of the physical shelf structure.

## Design Concept

The toggle buttons are designed to appear as an integrated mechanical component of each panel, like a handle or control mechanism built into the edge of the drawer/shelf. The goal is to create a techno-mechanical aesthetic where:

1. Each panel has a visible "lip" or edge that extends slightly beyond the panel's main body
2. The toggle buttons are positioned at the outer edge of this lip
3. The buttons move together with the panel when it opens and closes
4. The visual styling creates a cohesive look that makes the buttons appear to be part of the panel's structure

## Implementation

### Panel Structure

1. **Enhanced Mechanical Panel Lip**
   - Created a more pronounced visual "edge" or "lip" for each panel using the `::before` and `::after` pseudo-elements
   - Used gradient backgrounds to create depth and angular clip paths for a mechanical look
   - Added mechanical details like ventilation lines to enhance the industrial appearance
   - Positioned these lips on the appropriate side of each panel (right side for left panel, left side for right panel)

2. **Button Positioning**
   - Toggle buttons are children of their respective panel containers
   - Positioned them at the edge of each panel using absolute positioning with CSS variables for easy adjustment
   - Added mechanical details like "screws" using pseudo-elements to enhance the hardware appearance

3. **Overflow Handling**
   - Set `overflow: visible` on the panels to allow the buttons to be visible outside the panel's main width
   - Created a separate scrollable container within each panel for the drawer content

4. **Visual Integration**
   - Applied consistent styling for buttons and panel edges to create a unified appearance
   - Used gradient backgrounds and shadows to create a 3D effect that makes the buttons appear to be part of the panel structure

## CSS Details

### Panel Lip/Edge
```css
.left-panel::before,
.right-panel::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 12px;
  background: linear-gradient(to bottom, 
    var(--color-border-highlight) 0%,
    var(--color-border) 20%,
    var(--color-border) 80%,
    var(--color-border-highlight) 100%
  );
  z-index: -1;
  box-shadow: 0 0 10px var(--color-shadow);
}

.left-panel::before {
  right: -12px;
  border-right: 2px solid var(--color-border-highlight);
  clip-path: polygon(
    0 0, 100% 15px, 100% calc(100% - 15px), 0 100%
  );
}

.right-panel::before {
  left: -12px;
  border-left: 2px solid var(--color-border-highlight);
  clip-path: polygon(
    100% 0, 0 15px, 0 calc(100% - 15px), 100% 100%
  );
}
```

### Mechanical Details
```css
.left-panel::after,
.right-panel::after {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 80px;
  background: repeating-linear-gradient(
    to bottom,
    var(--color-border-highlight),
    var(--color-border-highlight) 2px,
    var(--color-border) 2px,
    var(--color-border) 6px
  );
  z-index: -1;
}
```

### Toggle Button Integration
```css
.panel-toggle {
  position: absolute;
  height: var(--toggle-button-size);
  width: var(--toggle-button-size);
  background: linear-gradient(135deg, 
    var(--color-surface) 0%, 
    var(--panel-background) 80%
  );
  /* Additional styling... */
}

.left-panel-toggle {
  top: 50%;
  right: -40px;
  transform: translateY(-50%);
}

.right-panel-toggle {
  top: 50%;
  left: -40px;
  transform: translateY(-50%);
}

/* Mechanical "screw" details */
.panel-toggle::before,
.panel-toggle::after {
  content: "";
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle at center, 
    var(--color-border-highlight) 10%, 
    var(--color-border) 30%, 
    var(--color-surface) 100%
  );
  border-radius: 50%;
  box-shadow: inset 0 0 1px var(--color-shadow);
}
```

## Result

The toggle buttons now appear to be part of the mechanical structure of the panels and move with them when opened or closed. The enhanced design features:

1. A more distinct mechanized lip that gives the panels a hardware-like appearance
2. Toggle buttons that visually integrate with the panel lips and move with the panels
3. Additional mechanical details like ventilation lines and "screws" for authenticity
4. Proper overflow handling to ensure all elements remain visible and functional

This implementation creates a more immersive, cohesive techno-mechanical UI that aligns with the project's aesthetic goals while ensuring the toggle buttons function as intended.
