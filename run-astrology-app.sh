#!/bin/bash

# Script to run the redesigned astrology chart application

# Navigate to the astrology chart directory
cd "$(dirname "$0")/astrology-chart"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the development server
echo "Starting development server for redesigned UI..."
npm run dev

# Print completion message
echo "Development server started. Open your browser to view the redesigned application."
