export type ShareOutcome = 'shared' | 'downloaded' | 'dismissed' | 'unsupported';

export interface ShareBridgeOptions {
  file: File;
  title?: string;
  text?: string;
  url?: string;
  downloadFileName?: string;
}

type NavigatorShare = Navigator & {
  canShare?: (data?: ShareData) => boolean;
  share?: (data: ShareData) => Promise<void>;
};

function canUseFileShare(nav: NavigatorShare, file: File): boolean {
  if (typeof nav.share !== 'function') return false;

  if (typeof nav.canShare === 'function') {
    try {
      return nav.canShare({ files: [file] });
    } catch (err) {
      console.warn('navigator.canShare threw, falling back to download', err);
      return false;
    }
  }

  // Platforms without canShare usually support simple share()
  return true;
}

function triggerDownload(file: File, downloadFileName?: string): ShareOutcome {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 'unsupported';
  }

  const blobUrl = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = downloadFileName ?? file.name ?? 'cosmic-chart.png';
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  window.setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }, 0);

  return 'downloaded';
}

export async function shareOrDownload({ file, title, text, url, downloadFileName }: ShareBridgeOptions): Promise<ShareOutcome> {
  const nav = typeof navigator !== 'undefined' ? (navigator as NavigatorShare) : undefined;

  if (nav && canUseFileShare(nav, file)) {
    try {
      await nav.share?.({ files: [file], title, text, url });
      return 'shared';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return 'dismissed';
      }
      console.error('Web Share API failed, falling back to download', err);
    }
  }

  return triggerDownload(file, downloadFileName);
}
