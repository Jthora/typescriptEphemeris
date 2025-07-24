/**
 * Utility functions for image optimization
 */

/**
 * Scales a base image size based on the viewport size
 * Useful for responsive design of the chart
 */
export const scaleImageSizeForViewport = (baseSize: number, viewportWidth: number): number => {
  if (viewportWidth < 600) {
    return baseSize * 0.7; // 70% size for small screens
  } else if (viewportWidth < 900) {
    return baseSize * 0.9; // 90% size for medium screens
  } else if (viewportWidth < 1200) {
    return baseSize; // 100% size for large screens
  } else {
    return baseSize * 1.1; // 110% size for extra large screens
  }
};

export default {
  scaleImageSizeForViewport
};
