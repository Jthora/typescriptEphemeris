export type ShareBackgroundStyle = 'transparent' | 'theme-surface';
export type ShareResolution = 'standard' | 'high' | 'ultra' | 'custom';

export interface ShareBackgroundOption {
  value: ShareBackgroundStyle;
  label: string;
  helper: string;
  tone: 'light' | 'dark' | 'transparent';
}

export interface ShareOverlayOptions {
  aspectLines: boolean;
  houseNumbers: boolean;
  zodiacSymbols: boolean;
  angles: boolean;
}

export interface ShareTextPreferences {
  includeAngles: boolean;
  includeAspects: boolean;
  includeHashtags: boolean;
}

export interface ShareOptions {
  backgroundStyle: ShareBackgroundStyle;
  resolution: ShareResolution;
  customResolution: number;
  includeOverlays: ShareOverlayOptions;
  text: ShareTextPreferences;
}

export const DEFAULT_SHARE_OPTIONS: ShareOptions = {
  backgroundStyle: 'theme-surface',
  resolution: 'high',
  customResolution: 2400,
  includeOverlays: {
    aspectLines: true,
    houseNumbers: true,
    zodiacSymbols: true,
    angles: true
  },
  text: {
    includeAngles: true,
    includeAspects: true,
    includeHashtags: true
  }
};

const STORAGE_KEY = 'cosmic-cypher.share-options.v2';
const CUSTOM_MESSAGE_STORAGE_KEY = 'cosmic-cypher.share-custom-message.v1';

const LEGACY_BACKGROUND_MAP: Record<string, ShareBackgroundStyle> = {
  transparent: 'transparent',
  midnight: 'theme-surface',
  dawn: 'theme-surface',
  nebula: 'theme-surface',
  'theme-panel': 'theme-surface',
  'theme-contrast': 'theme-surface',
  'creative-nebula': 'theme-surface'
};

export const MIN_CUSTOM_RESOLUTION = 512;
export const MAX_CUSTOM_RESOLUTION = 4096;

function normalizeBackgroundStyle(value: unknown): ShareBackgroundStyle {
  if (typeof value !== 'string') return DEFAULT_SHARE_OPTIONS.backgroundStyle;
  if (['transparent', 'theme-surface'].includes(value)) {
    return value as ShareBackgroundStyle;
  }
  if (value in LEGACY_BACKGROUND_MAP) {
    return LEGACY_BACKGROUND_MAP[value as keyof typeof LEGACY_BACKGROUND_MAP];
  }
  return DEFAULT_SHARE_OPTIONS.backgroundStyle;
}
function normalizeCustomResolution(value: unknown): number {
  const fallback = DEFAULT_SHARE_OPTIONS.customResolution;
  if (typeof value !== 'number') return fallback;
  if (!Number.isFinite(value)) return fallback;
  const rounded = Math.round(value);
  if (rounded <= 0) return fallback;
  return Math.min(Math.max(rounded, MIN_CUSTOM_RESOLUTION), MAX_CUSTOM_RESOLUTION);
}

export function loadShareOptions(): ShareOptions {
  if (typeof window === 'undefined') {
    return DEFAULT_SHARE_OPTIONS;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_SHARE_OPTIONS;
    }

    const parsed = JSON.parse(stored) as Partial<ShareOptions> | null;
    if (!parsed) {
      return DEFAULT_SHARE_OPTIONS;
    }

    const backgroundStyle = normalizeBackgroundStyle(parsed.backgroundStyle);
    const customResolution = normalizeCustomResolution(parsed.customResolution);

    return {
      ...DEFAULT_SHARE_OPTIONS,
      ...parsed,
      backgroundStyle,
      customResolution,
      includeOverlays: {
        ...DEFAULT_SHARE_OPTIONS.includeOverlays,
        ...parsed.includeOverlays
      },
      text: {
        ...DEFAULT_SHARE_OPTIONS.text,
        ...parsed.text
      }
    };
  } catch (error) {
    console.warn('Failed to load share options from storage, falling back to defaults:', error);
    return DEFAULT_SHARE_OPTIONS;
  }
}

export function saveShareOptions(options: ShareOptions): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
  } catch (error) {
    console.warn('Failed to persist share options:', error);
  }
}

export function loadCustomShareMessage(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    const stored = window.localStorage.getItem(CUSTOM_MESSAGE_STORAGE_KEY);
    if (typeof stored !== 'string') {
      return '';
    }
    return stored;
  } catch (error) {
    console.warn('Failed to load custom share message from storage:', error);
    return '';
  }
}

export function saveCustomShareMessage(message: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (!message) {
      window.localStorage.removeItem(CUSTOM_MESSAGE_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(CUSTOM_MESSAGE_STORAGE_KEY, message);
  } catch (error) {
    console.warn('Failed to persist custom share message:', error);
  }
}

export function getResolutionScale(resolution: ShareResolution): number {
  switch (resolution) {
    case 'standard':
      return 1;
    case 'ultra':
      return 3;
    case 'custom':
      return 1;
    case 'high':
    default:
      return 2;
  }
}

function resolveCssVariable(variableName: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const styles = getComputedStyle(document.documentElement);
  const value = styles.getPropertyValue(variableName).trim();
  return value || fallback;
}

export function resolveShareBackgroundColor(style: ShareBackgroundStyle): string | undefined {
  switch (style) {
    case 'theme-surface':
      return resolveCssVariable('--color-surface', '#232731');
    case 'transparent':
    default:
      return undefined;
  }
}

export const SHARE_BACKGROUND_OPTIONS: ShareBackgroundOption[] = [
  {
    value: 'theme-surface',
    label: 'Opaque',
    helper: 'Fills with the active theme background color.',
    tone: 'dark'
  },
  {
    value: 'transparent',
    label: 'Transparent',
    helper: 'Preserves transparency to blend with destination.',
    tone: 'transparent'
  }
];
