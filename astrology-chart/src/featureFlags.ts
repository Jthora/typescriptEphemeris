export const featureFlags = {
  /**
   * Controls availability of the experimental bottom drawer / timestream tooling.
   * Default is disabled; enable by setting VITE_ENABLE_BOTTOM_DRAWER="true".
   */
  bottomDrawer: import.meta.env.VITE_ENABLE_BOTTOM_DRAWER === 'true'
} as const;
