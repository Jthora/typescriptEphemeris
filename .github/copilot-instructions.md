<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# TypeScript Ephemeris Project Instructions

This is a high-performance TypeScript project for astronomical ephemeris calculations.

## Key Technologies
- **TypeScript** with ES2022 target for modern features
- **Vite** for fast building and development
- **astronomy-engine** library for precise astronomical calculations
- **tsx** for direct TypeScript execution without compilation step

## Code Style & Performance Guidelines

### Performance Optimization
- Use incremental TypeScript compilation with `tsBuildInfoFile`
- Leverage Vite's fast bundling for development
- Minimize file watching scope in VSCode settings
- Use `skipLibCheck` to speed up type checking
- Prefer ESM modules for tree-shaking benefits

### Astronomical Calculations
- All coordinates should be in standard astronomical units (RA in hours, Dec in degrees)
- Use `astronomy-engine` library functions for accuracy
- Include proper error handling for edge cases (e.g., circumpolar objects)
- Format coordinates using the provided `formatRA` and `formatDec` utilities

### TypeScript Best Practices
- Use strict type checking
- Leverage interface definitions for astronomical data structures
- Use proper JSDoc comments for public methods
- Prefer readonly arrays for immutable data
- Use proper error boundaries for astronomical edge cases

### VSCode Integration
- The workspace is optimized to prevent indexing lag
- File exclusions are configured for `node_modules`, `dist`, and temporary files
- Git autofetch is disabled to prevent network-related slowdowns
- TypeScript IntelliSense is optimized for performance

## Development Workflow
- Use `npm run dev` for development with auto-reload
- Use `npm run build:fast` for quick builds via Vite
- Use `npm run start` for one-time execution
- Type checking is separated with `npm run type-check`

## File Structure
- `src/index.ts` - Main ephemeris calculator class
- `src/example.ts` - Usage examples and demonstrations
- All astronomical calculations should be in the `src/` directory
- Use relative imports for local modules
