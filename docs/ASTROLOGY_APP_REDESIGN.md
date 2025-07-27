# Astrology Chart App UI Redesign

## Overview

This document outlines the comprehensive UI redesign for the TypeScript Ephemeris Astrology Chart application. The redesign focuses on creating a more immersive, mobile-friendly experience that puts the birth chart visualization at the center while making controls accessible when needed.

## Design Principles

- **Content-First**: The birth chart is the primary focus and should dominate the screen
- **Progressive Disclosure**: Controls and information are hidden by default, revealed when needed
- **Touch-Optimized**: Mobile-friendly with swipe gestures and touch targets
- **Animated Transitions**: Smooth animations for a polished user experience
- **Responsive**: Adapts to all screen sizes while maintaining focus on the chart

## Key UI Components

### 1. Central Birth Chart

- Dominant position in the center of the screen
- Maximized viewport utilization
- Responsive sizing across all devices
- Interactive elements remain accessible

### 2. Side Panels ("Shelves")

#### Left Panel: Birth Information
- Hidden by default
- Appears with left-to-right swipe gesture on mobile
- Toggle button ([>]) on left edge of screen
- Slides over the chart when opened (higher z-index)
- Contains all birth data input controls

#### Right Panel: Planetary Harmonics
- Hidden by default
- Appears with right-to-left swipe gesture on mobile
- Toggle button ([<]) on right edge of screen
- Slides over the chart when opened (higher z-index)
- Contains all harmonics data and visualizations

### 3. Top and Bottom Bars

#### Top Bar
- Minimal height
- Contains app title and global controls (theme toggle)
- Hardware-style panel with proper mechanical aesthetic
- Always visible

#### Bottom Bar
- Minimal height
- Reserved for future action buttons or status information
- Always visible

### 4. Theme Toggle
- Located in the top bar
- Provides dark/light mode switching
- Auto-detects system preference
- Persists user selection in localStorage
- Hardware-style button with dropdown menu
- Digital display styling for options menu
- Mechanical feedback animations on interaction

## Animations and Interactions

### Panel Animations
- **Opening**: Smooth slide-in from edge of screen (300ms easeOutQuint)
- **Closing**: Smooth slide-out to edge of screen (250ms easeInQuad)
- **Button Hover**: Scale and color change animation (no position change)
- Hardware-accelerated transforms for performance
- Optional backdrop dimming for visual hierarchy

### Gesture Support
- Horizontal swipe to reveal/hide panels
- Tap outside panel to dismiss
- Button toggle as alternative to gestures

## Style Guide

### Color Palette

#### Base Colors
- **Gunmetal Dark**: #1A1C20 (dark mode) / #8D9CAA (light mode)
- **Gunmetal Medium**: #2D3142 (dark mode) / #B8C0CC (light mode)
- **Gunmetal Light**: #424B5A (dark mode) / #D5D9E0 (light mode)

#### Accent Colors (Neon)
- **Primary Blue**: #00A8FF - Main interactive elements
- **Warning Yellow**: #FFC107 - Caution states, important notices
- **Error Red**: #FF4757 - Errors, critical states
- **Success Green**: #0AE173 - Success states, confirmations
- **Info Cyan**: #03E9F4 - Informational elements, highlights

#### Text Colors
- **Primary Text**: #E0E6F0 (dark mode) / #2D3142 (light mode)
- **Secondary Text**: #B8C0CC (dark mode) / #424B5A (light mode)
- **Disabled Text**: #636B7A (dark mode) / #8D9CAA (light mode)

### Color Usage Protocol

1. **Structural Elements**
   - Panels, backgrounds, and containers use gunmetal colors
   - Borders use slightly lighter gunmetal variants
   - Always use proper contrast between elements

2. **Interactive Elements**
   - **Primary Blue**: Used for primary actions, navigation, and selection states
   - **Warning Yellow**: Reserved for caution states and important user choices
   - **Error Red**: Only for errors, critical warnings, and destructive actions
   - **Success Green**: Confirmations, completion indicators, and positive metrics
   - **Info Cyan**: Help icons, tooltips, and informational highlights

3. **Status Indicators**
   - Pulsing lights or indicators must use the appropriate semantic color
   - Active/inactive states should maintain color consistency (dimmed when inactive)

4. **Digital Displays**
   - Text within displays should use cyan (#03E9F4) for active data
   - Secondary data uses white/light gray
   - Units of measurement and labels use dimmed secondary colors

5. **Hardware Elements**
   - Screws, rivets, and hardware details use neutral gunmetal variants
   - Mechanical elements should maintain proper shadows and highlights

### Typography

- **Primary Font**: Aldrich - For all main UI text and labels
- **Display Font**: Rajdhani - For digital displays and readouts
- **Monospace Font**: Share Tech Mono - For data, measurements, and code

#### Font Sizes
- XS: 11px - Small labels, secondary information
- S: 14px - Standard UI text
- M: 16px - Headings, important information
- L: 20px - Major headings, emphasis

### Hardware Elements

- **Panels**: Angular with minimal or no rounding
- **Borders**: 1px single-pixel borders (no glowing effects)
- **Corner Style**: Sharp 90° corners with optional small 2-4px rounding on specific elements
- **Hardware Details**: Include subtle rivets, screws, vents where appropriate
- **Panel Joints**: Visible panel connections with inset lines

### Digital Display Style

- **Display Frames**: Inset dark backgrounds with thin borders
- **Text**: High contrast with monospace or display font
- **Data Visualization**: Clean, angular style with minimal decoration
- **Readouts**: Tabular data with alignment and proper spacing

### Button Hierarchy

1. **Primary Hardware Buttons**
   - Raised appearance with subtle shadow
   - Clear angular shape
   - Optional "LED" indicator for state
   - Scale/color change on hover (no position change)

2. **Secondary Hardware Controls**
   - Flat or slightly raised
   - Smaller size than primary buttons
   - Same color family as parent panel

3. **Digital Interface Buttons**
   - Appear on digital displays
   - More minimalist than hardware buttons
   - Use display-appropriate styling (borders rather than 3D effects)

### Animation Protocol

1. **Hardware Feedback**
   - Button presses: 150ms slight scale down + color shift
   - Button release: 200ms return to original state
   - Panel transitions: 250-300ms smooth movements
   - Use easing functions that mimic physical hardware

2. **Digital Elements**
   - Pulsing indicators: 1.5s subtle brightness oscillation
   - Data updates: 300ms fade transitions
   - Warning flashes: 300ms alternating opacity

3. **Status Indicators**
   - Breathing effect for standby: 3s cycle
   - Blinking for alerts: 500ms cycle
   - Spinning for processing: 1.5s rotation cycle

## Technical Implementation

### CSS Architecture
- CSS Variables for consistent theming
- CSS Grid for main layout structure
- CSS Transitions/Transforms for animations
- Media queries for responsive adaptations

### Responsive Breakpoints
- **Mobile**: < 768px (panels cover most of screen when open)
- **Tablet**: 768px - 1024px (panels cover partial screen)
- **Desktop**: > 1024px (panels can remain visible alongside chart)

### Accessibility Considerations
- Keyboard navigation support (Tab, Esc to close panels)
- ARIA attributes for screen readers
- Sufficient color contrast
- Touch targets minimum 44×44px

## Implementation Phases

1. **Layout Restructuring**
   - Reposition birth chart to center
   - Create collapsible side panel containers
   - Implement top and bottom bars

2. **Panel Functionality**
   - Implement open/close toggle mechanisms
   - Create slide animations
   - Ensure proper z-index layering

3. **Touch Gestures**
   - Add swipe detection
   - Connect gestures to panel actions
   - Test on various devices

4. **Responsive Refinement**
   - Optimize for various screen sizes
   - Adjust transition timings and behaviors
   - Test edge cases

5. **Visual Polish**
   - Refine animations
   - Add visual cues for interactive elements
   - Ensure consistent styling

## Future Enhancements

- Customizable panel widths
- Pinnable panels for desktop use
- Dark/light theme toggle in top bar
- Additional chart view options in bottom bar
- Onboarding tutorial for gesture discovery

## Techno-Mechanical UI Style Guide

### Color Palette
- **Base Colors**: Gunmetal grays (not pure black/white)
  - Dark mode: Deep gunmetal (#1A1C20), Dark steel (#2D3142), Medium steel (#424B5A)
  - Light mode: Brushed aluminum (#D5D9E0), Light steel (#B8C0CC), Titanium (#8D9CAA)
- **Accent Colors**: Neon with specific usage protocol
  - Primary action: Neon blue (#00A8FF)
  - Warning/caution: Amber (#FFC107)
  - Critical/error: Red (#FF4757)
  - Success/confirmed: Green (#0AE173)
  - Neutral/info: Cyan (#03E9F4)

### Typography
- **Primary Font**: Aldrich (Google Font)
- **Secondary Font**: Rajdhani for readouts and displays
- **Monospace**: Share Tech Mono for data and coordinates
- **Text Treatments**: 
  - Uppercase for hardware labels and headers
  - Monospaced for numerical data
  - Small caps for section titles

### Hardware Elements
- **Borders**: 1px solid or dashed with 45° angular corners
- **Panels**: Brushed metal texture with screws/rivets at corners
- **Vents**: Linear or hexagonal patterns on non-interactive areas
- **Screws/Fasteners**: Visible at key structural points
- **Indicators**: Small LED-style lights for status indication

### Digital Display Elements
- **Screens**: Slightly inset with subtle inner shadow
- **Data Displays**: Terminal-style with scan line effect
- **Interactive Controls**: Glowing highlights on hover/focus
- **Segmented Displays**: For numerical readouts (time, coordinates)

### Button Hierarchy
- **Hardware Buttons**: 3D effect with mechanical press animation
- **Digital Buttons**: Flat with glow effect on hover
- **Toggle Switches**: Sliding or rotating animation with clear state indication
- **Critical Controls**: Protected by virtual safety covers

### Animation Protocol
- **Hardware Feedback**: 150ms press/release animations
- **Digital Transitions**: 200ms with subtle scan line effect
- **Status Indicators**: Pulse at 1.5-second intervals
- **Alert States**: Rapid pulsing (3 cycles per second)
- **Mechanical Sounds**: Optional subtle click/whir sounds for feedback

### Component Guidelines
- **Chart Area**: Recessed viewport with measurement markings
- **Control Panels**: Raised with visible fasteners
- **Information Panels**: Terminal/screen appearance
- **Navigation**: Hardware-style tabs or switches
