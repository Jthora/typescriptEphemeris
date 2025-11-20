import aldrichFontUrl from '../../assets/fonts/Aldrich-Regular.ttf?url';
import icebergFontUrl from '../../assets/fonts/Iceberg-Regular.ttf?url';

export type CaptureErrorCode =
  | 'svg-missing'
  | 'fonts-timeout'
  | 'image-load'
  | 'canvas-unsupported'
  | 'canvas-blob-failed';

export class CaptureError extends Error {
  readonly code: CaptureErrorCode;

  constructor(code: CaptureErrorCode, message?: string) {
    super(message ?? code);
    this.code = code;
    this.name = 'CaptureError';
  }
}

export interface CaptureChartOptions {
  svg: SVGSVGElement | null;
  /** Render width in CSS pixels */
  width: number;
  /** Render height in CSS pixels */
  height: number;
  /** Optional pixel ratio multiplier (defaults to devicePixelRatio or 1) */
  scale?: number;
  /** Optional solid background color to paint behind the chart */
  backgroundColor?: string;
  /** CSS selectors to hide before rendering (applies display="none" to matches) */
  hiddenSelectors?: string[];
  /** File name to use when building the PNG */
  fileName?: string;
  /** Optional timeout (ms) for font readiness */
  fontReadyTimeoutMs?: number;
}

let fontsReadyPromise: Promise<void> | null = null;
const dataUrlCache = new Map<string, string>();

interface InlineFontSource {
  family: string;
  url: string;
  format: string;
  weight?: string;
  style?: string;
  display?: string;
}

const INLINE_FONT_SOURCES: InlineFontSource[] = [
  { family: 'Aldrich', url: aldrichFontUrl, format: 'truetype', weight: 'normal', style: 'normal', display: 'swap' },
  { family: 'Iceberg', url: icebergFontUrl, format: 'truetype', weight: 'normal', style: 'normal', display: 'swap' }
];

async function ensureFontsReady(timeoutMs = 3000): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) {
    return;
  }

  if (!fontsReadyPromise) {
    fontsReadyPromise = (document as Document & { fonts: FontFaceSet }).fonts.ready
      .then(() => undefined)
      .catch((err) => {
      fontsReadyPromise = null;
      throw err;
      });
  }

  if (!fontsReadyPromise) return; // Should not happen, defensive

  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    await fontsReadyPromise;
    return;
  }

  await Promise.race([
    fontsReadyPromise,
    new Promise<void>((_, reject) => {
      const id = window.setTimeout(() => {
        reject(new CaptureError('fonts-timeout', 'Fonts failed to load in time'));
      }, timeoutMs);
      fontsReadyPromise?.finally(() => window.clearTimeout(id));
    })
  ]);
}

function guessMimeType(url: string, fallback: string): string {
  const lower = url.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  if (lower.endsWith('.ttf')) return 'font/ttf';
  if (lower.endsWith('.otf')) return 'font/otf';
  if (lower.endsWith('.woff2')) return 'font/woff2';
  if (lower.endsWith('.woff')) return 'font/woff';
  return fallback;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function fetchAsDataUrl(url: string): Promise<string> {
  const cached = dataUrlCache.get(url);
  if (cached) return cached;

  const response = await fetch(url, { mode: 'cors' });
  if (!response.ok) {
    throw new CaptureError('image-load', `Failed to fetch asset: ${url}`);
  }

  const contentType = response.headers.get('content-type') ?? 'application/octet-stream';
  const arrayBuffer = await response.arrayBuffer();
  const base64 = arrayBufferToBase64(arrayBuffer);
  const mime = guessMimeType(url, contentType);
  const dataUrl = `data:${mime};base64,${base64}`;

  dataUrlCache.set(url, dataUrl);
  return dataUrl;
}

async function inlineExternalImages(svg: SVGSVGElement): Promise<void> {
  if (typeof window === 'undefined') return;

  const images = Array.from(svg.querySelectorAll('image')) as SVGImageElement[];
  if (!images.length) return;

  await Promise.all(
    images.map(async (image) => {
      const href = image.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || image.getAttribute('href');
      if (!href || href.startsWith('data:')) return;

      try {
        const resolvedUrl = new URL(href, window.location.href).toString();
        const dataUrl = await fetchAsDataUrl(resolvedUrl);
        image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', dataUrl);
        image.setAttribute('href', dataUrl);
      } catch (error) {
        if (error instanceof CaptureError) {
          throw error;
        }
        throw new CaptureError('image-load', error instanceof Error ? error.message : 'Failed to inline image');
      }
    })
  );
}

async function inlineFontFaces(svg: SVGSVGElement): Promise<void> {
  if (!INLINE_FONT_SOURCES.length) return;
  const cssRules = await Promise.all(
    INLINE_FONT_SOURCES.map(async ({ family, url, format, weight = 'normal', style = 'normal', display = 'swap' }) => {
      const dataUrl = await fetchAsDataUrl(url);
      return `@font-face { font-family: '${family}'; src: url('${dataUrl}') format('${format}'); font-weight: ${weight}; font-style: ${style}; font-display: ${display}; }`;
    })
  );

  cssRules.push(
    `svg { --font-primary: 'Aldrich', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; --font-display: 'Iceberg', 'Aldrich', sans-serif; }`
  );

  const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  styleElement.setAttribute('type', 'text/css');
  styleElement.textContent = cssRules.join('\n');
  svg.insertBefore(styleElement, svg.firstChild);
}

function applyHiddenSelectors(svg: SVGSVGElement, selectors?: string[]): void {
  if (!selectors?.length) return;

  selectors.forEach((selector) => {
    try {
      const matches = svg.querySelectorAll(selector);
      matches.forEach((node) => {
        (node as Element).setAttribute('display', 'none');
        (node as Element).setAttribute('data-share-hidden', 'true');
      });
    } catch (error) {
      console.warn(`Failed to apply hidden selector "${selector}" during capture`, error);
    }
  });
}

async function serializeSvg(svg: SVGSVGElement, width: number, height: number, hiddenSelectors?: string[]): Promise<string> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  clone.setAttribute('width', `${width}`);
  clone.setAttribute('height', `${height}`);

  if (!clone.getAttribute('viewBox')) {
    clone.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

  applyHiddenSelectors(clone, hiddenSelectors);
  await inlineFontFaces(clone);
  await inlineExternalImages(clone);

  return new XMLSerializer().serializeToString(clone);
}

function drawSvgToCanvas(svgString: string, width: number, height: number, scale: number, backgroundColor?: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    const image = new Image();
    image.decoding = 'async';
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new CaptureError('canvas-unsupported', '2D canvas context unavailable'));
          return;
        }

        const scaledWidth = Math.max(1, Math.round(width * scale));
        const scaledHeight = Math.max(1, Math.round(height * scale));
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
        ctx.clearRect(0, 0, scaledWidth, scaledHeight);
        if (backgroundColor) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, scaledWidth, scaledHeight);
        }
        ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
        resolve(canvas);
      } catch (err) {
        reject(err);
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new CaptureError('image-load', 'Failed to load serialized SVG into image'));
    };

    image.src = url;
  });
}

async function canvasToPngFile(canvas: HTMLCanvasElement, fileName: string): Promise<File> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new CaptureError('canvas-blob-failed', 'Canvas toBlob returned null'));
    }, 'image/png');
  });

  return new File([blob], fileName, { type: 'image/png' });
}

export async function captureChart({
  svg,
  width,
  height,
  scale,
  backgroundColor,
  hiddenSelectors,
  fileName = `birth-chart-${Date.now()}.png`,
  fontReadyTimeoutMs
}: CaptureChartOptions): Promise<File> {
  if (!svg) {
    throw new CaptureError('svg-missing', 'Chart SVG element not available');
  }

  await ensureFontsReady(fontReadyTimeoutMs ?? 3000);

  const pixelRatio = scale ?? (window.devicePixelRatio || 1);
  const svgString = await serializeSvg(svg, width, height, hiddenSelectors);
  const canvas = await drawSvgToCanvas(svgString, width, height, pixelRatio, backgroundColor ?? undefined);
  return canvasToPngFile(canvas, fileName);
}
