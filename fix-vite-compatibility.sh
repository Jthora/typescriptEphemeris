#!/bin/bash

# Script to downgrade Vite to a compatible version

echo "🔧 Fixing Vite compatibility issue..."

# Navigate to the astrology chart directory
cd "$(dirname "$0")/astrology-chart"

# Downgrade Vite and related packages
echo "📦 Downgrading Vite to v4.5.2..."
npm uninstall vite
npm install vite@4.5.2 --save-dev

echo "📦 Downgrading Vite React plugin..."
npm uninstall @vitejs/plugin-react
npm install @vitejs/plugin-react@4.2.1 --save-dev

# Create a compatible vite.config.ts file
echo "📄 Updating Vite configuration..."
cat > vite.config.ts << EOL
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
EOL

echo "✅ Vite compatibility fix complete!"
echo "🚀 You can now run the app with: npm run dev"
