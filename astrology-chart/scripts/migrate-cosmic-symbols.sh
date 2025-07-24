#!/bin/bash
# migrate-cosmic-symbols.sh
# Script to replace cosmic modality images in the astrology chart

# Set up paths
PROJECT_DIR="$(pwd)"
COSMIC_MODALITIES_DIR="${PROJECT_DIR}/src/assets/images/cosmic-modalities"
BACKUP_DIR="${PROJECT_DIR}/backup_cosmic_modalities_$(date +%Y%m%d_%H%M%S)"

echo "==== Cosmic Modality Image Migration ===="
echo "Project directory: ${PROJECT_DIR}"

# Create backup of original images
echo "1. Creating backup of original modality images..."
mkdir -p "${BACKUP_DIR}"
cp -v "${COSMIC_MODALITIES_DIR}/"*.png "${BACKUP_DIR}/"
echo "✓ Backup created at ${BACKUP_DIR}"

# Map the new images based on the provided mapping
echo -e "\n2. Copying new modality images..."
# Script would normally copy the attachment files here

# Display completion
echo -e "\n==== Migration Complete! ===="
echo "Please manually copy the 12 attachment images to:"
echo "${COSMIC_MODALITIES_DIR}"
echo ""
echo "Using the following naming convention:"
echo "- Yellow up-arrow -> air-cardinal.png"
echo "- Yellow arc -> air-mutable.png"
echo "- Yellow block -> air-fixed.png"
echo "- Green up-arrow -> earth-cardinal.png"
echo "- Green arc -> earth-mutable.png"
echo "- Green block -> earth-fixed.png"
echo "- Red up-arrow -> fire-cardinal.png"
echo "- Red arc -> fire-mutable.png"
echo "- Red block -> fire-fixed.png"
echo "- Blue up-arrow -> water-cardinal.png"
echo "- Blue arc -> water-mutable.png"
echo "- Blue block -> water-fixed.png"
echo ""
echo "Then run: npm run dev to see the changes"
