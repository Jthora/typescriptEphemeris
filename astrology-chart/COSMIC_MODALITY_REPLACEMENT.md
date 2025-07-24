# Cosmic Modality Image Replacement

This document explains how to replace the cosmic modality symbols used in the birth chart.

## Image Replacement Guide

### What's Changed

We've updated the modality naming convention and corresponding images:
- **Cardinal** is now **Active** (Up-arrow/Chevron symbol)
- **Fixed** is now **Static** (Block/Square symbol)
- **Mutable** is now **Reactive** (Arc/Curve symbol)

The cosmic element colors remain the same:
- **Fire**: Red
- **Earth**: Green
- **Air**: Yellow
- **Water**: Blue

### Manual Replacement Process

1. First, back up the existing images:
   ```bash
   mkdir -p backup_cosmic_modalities
   cp -v src/assets/images/cosmic-modalities/*.png backup_cosmic_modalities/
   ```

2. Copy the 12 new image files to the `src/assets/images/cosmic-modalities` directory with the following naming convention:

   | Element | Modality  | File Name          |
   |---------|-----------|-------------------|
   | Air     | Cardinal  | air-cardinal.png  |
   | Air     | Mutable   | air-mutable.png   |
   | Air     | Fixed     | air-fixed.png     |
   | Earth   | Cardinal  | earth-cardinal.png|
   | Earth   | Mutable   | earth-mutable.png |
   | Earth   | Fixed     | earth-fixed.png   |
   | Fire    | Cardinal  | fire-cardinal.png |
   | Fire    | Mutable   | fire-mutable.png  |
   | Fire    | Fixed     | fire-fixed.png    |
   | Water   | Cardinal  | water-cardinal.png|
   | Water   | Mutable   | water-mutable.png |
   | Water   | Fixed     | water-fixed.png   |

3. Run the development server to see the changes:
   ```bash
   npm run dev
   ```

### Automated Replacement

You can use the included scripts to automate the process:

```bash
# Run the migration script
npm run migrate-symbols

# Or the Node.js version
npm run replace-modality-images
```

## Technical Details

The cosmic modality symbols are used in the ChartWheel component to represent each zodiac sign's element-modality combination. Each symbol is displayed in the outer wheel of the birth chart.

The mapping between zodiac signs, elements, and modalities is defined in `src/assets/images/cosmic-symbols.ts`.
