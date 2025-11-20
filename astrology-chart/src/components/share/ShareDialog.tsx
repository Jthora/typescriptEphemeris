import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Copy, Check, AlertTriangle, Download, Send } from 'lucide-react';
import type { ShareOptions } from '../../utils/share/shareOptions';
import type { ShareState } from '../../utils/share/shareState';
import {
  SHARE_BACKGROUND_OPTIONS,
  type ShareBackgroundOption,
  resolveShareBackgroundColor,
  getResolutionScale,
  MIN_CUSTOM_RESOLUTION,
  MAX_CUSTOM_RESOLUTION
} from '../../utils/share/shareOptions';
import './ShareDialog.css';

const RESOLUTION_LABELS: Record<ShareOptions['resolution'], string> = {
  standard: 'Standard',
  high: 'Hi-Res',
  ultra: 'Ultra',
  custom: 'Custom'
};

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

const defaultCharLimit = 280;
type CopyState = 'idle' | 'copied' | 'error';

type ShareDialogTab = 'share' | 'settings';

interface ShareDialogProps {
  isOpen: boolean;
  options: ShareOptions;
  onOptionsChange: (options: ShareOptions) => void;
  shareState: ShareState;
  shareMessage?: string | null;
  shareDisabled: boolean;
  onShare: () => void;
  onShareToX: () => void;
  onClose: () => void;
  chartDimension: number;
  shareText: string;
  customMessage: string;
  onCustomMessageChange: (value: string) => void;
  charCount: number;
  charLimit?: number;
  onCopyShareText: () => Promise<boolean>;
}

interface ShareDialogCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  layout?: 'default' | 'compact' | 'full';
}

const ShareDialogCard: React.FC<ShareDialogCardProps> = ({ title, description, children, layout = 'default' }) => (
  <section className={`share-dialog__card share-dialog__card--${layout}`}>
    <header className="share-dialog__card-header">
      <h3>{title}</h3>
      {description && <p className="share-dialog__card-description">{description}</p>}
    </header>
    <div className="share-dialog__card-body">{children}</div>
  </section>
);

const BackgroundOptionTile: React.FC<{
  option: ShareBackgroundOption;
  selected: boolean;
  onSelect: (value: ShareBackgroundOption['value']) => void;
}> = ({ option, selected, onSelect }) => {
  const swatchStyle = useMemo(() => {
    const color = resolveShareBackgroundColor(option.value);
    return color ? { background: color } : undefined;
  }, [option.value]);

  return (
    <button
      type="button"
      className={`share-dialog__option share-dialog__option--compact ${selected ? 'is-selected' : ''}`}
      onClick={() => onSelect(option.value)}
    >
      <span
        className={`share-dialog__swatch share-dialog__swatch--${option.tone}`}
        aria-hidden="true"
        style={swatchStyle}
      />
      <span className="share-dialog__option-label">{option.label}</span>
    </button>
  );
};

const ToggleRow: React.FC<{
  label: React.ReactNode;
  checked: boolean;
  onChange: () => void;
}> = ({ label, checked, onChange }) => (
  <label className="share-dialog__toggle">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="share-dialog__toggle-label">{label}</span>
  </label>
);

const ShareDialogHeader: React.FC<{
  onClose: () => void;
  activeTab: ShareDialogTab;
  onTabChange: (tab: ShareDialogTab) => void;
}> = ({ onClose, activeTab, onTabChange }) => (
  <header className="share-dialog__header">
    <div className="share-dialog__header-main">
      <h2 id="share-dialog-title">Share your chart</h2>
      <div className="share-dialog__subtitle-row">
        <p className="share-dialog__subtitle">Choose image styling and copy text before exporting.</p>
        <div className="share-dialog__tabs" role="tablist" aria-label="Share dialog sections">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'share'}
            className={`share-dialog__tab ${activeTab === 'share' ? 'is-active' : ''}`}
            onClick={() => onTabChange('share')}
          >
            Share
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'settings'}
            className={`share-dialog__tab ${activeTab === 'settings' ? 'is-active' : ''}`}
            onClick={() => onTabChange('settings')}
          >
            Settings
          </button>
        </div>
      </div>
    </div>
    <button type="button" className="share-dialog__close" onClick={onClose} aria-label="Close share dialog">
      <X size={18} />
    </button>
  </header>
);

const ShareDialogFooter: React.FC<{
  shareState: ShareState;
  shareMessage?: string | null;
}> = ({ shareState, shareMessage }) => {
  const isSharing = shareState === 'capturing' || shareState === 'sharing';

  const statusLabel = useMemo(() => {
    switch (shareState) {
      case 'capturing':
        return 'Preparing chart image…';
      case 'sharing':
        return 'Finishing export…';
      case 'success':
        return 'Export complete';
      case 'fallback':
        return 'PNG downloaded';
      case 'error':
        return 'Export failed';
      default:
        return undefined;
    }
  }, [shareState]);

  if (!statusLabel && !shareMessage) {
    return null;
  }

  return (
    <footer className="share-dialog__footer">
      <div className="share-dialog__status" aria-live="polite">
        {statusLabel && (
          <span className={`share-dialog__status-indicator share-dialog__status-indicator--${shareState}`}>
            {shareState === 'error' ? <AlertTriangle size={16} /> : isSharing ? <Loader2 size={16} className="spinning" /> : <Download size={16} />}
            <span>{statusLabel}</span>
          </span>
        )}
        {shareMessage && <span className="share-dialog__status-message">{shareMessage}</span>}
      </div>
    </footer>
  );
};

const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  options,
  onOptionsChange,
  shareState,
  shareMessage,
  shareDisabled,
  onShare,
  onShareToX,
  onClose,
  chartDimension,
  shareText,
  customMessage,
  onCustomMessageChange,
  charCount,
  charLimit = defaultCharLimit,
  onCopyShareText
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<Element | null>(null);
  const customResolutionInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState<ShareDialogTab>('share');
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [isCustomResolutionOpen, setCustomResolutionOpen] = useState(false);
  const [customResolutionInput, setCustomResolutionInput] = useState(() => options.customResolution.toString());
  const [customResolutionError, setCustomResolutionError] = useState<string | null>(null);
  const [pendingResolutionRevert, setPendingResolutionRevert] = useState<ShareOptions['resolution'] | null>(null);

  const isSharing = shareState === 'capturing' || shareState === 'sharing';
  const shareButtonDisabled = shareDisabled || isSharing;
  const baseDimension = useMemo(() => Math.max(Math.round(chartDimension) || 0, 600), [chartDimension]);
  const resolutionButtons = useMemo(
    () => [
      { value: 'standard' as ShareOptions['resolution'], label: 'Standard' },
      { value: 'high' as ShareOptions['resolution'], label: 'Hi-Res' },
      { value: 'ultra' as ShareOptions['resolution'], label: 'Ultra' },
      { value: 'custom' as ShareOptions['resolution'], label: 'Custom' }
    ],
    []
  );
  const selectedResolutionDimension = useMemo(() => {
    if (options.resolution === 'custom') {
      return options.customResolution;
    }
    return Math.round(baseDimension * getResolutionScale(options.resolution));
  }, [options.resolution, options.customResolution, baseDimension]);
  const selectedResolutionLabel = useMemo(() => {
    const dimension = selectedResolutionDimension.toLocaleString();
    const name = RESOLUTION_LABELS[options.resolution];
    return `${name} · ${dimension} × ${dimension} px`;
  }, [options.resolution, selectedResolutionDimension]);

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement;

    const frame = requestAnimationFrame(() => {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusable && focusable.length) {
        focusable[0].focus();
      } else {
        dialogRef.current?.focus();
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (isCustomResolutionOpen) {
          setCustomResolutionOpen(false);
          setCustomResolutionError(null);
          setCustomResolutionInput(options.customResolution.toString());
          if (pendingResolutionRevert && pendingResolutionRevert !== 'custom') {
            onOptionsChange({
              ...options,
              resolution: pendingResolutionRevert
            });
          }
          setPendingResolutionRevert(null);
          return;
        }
        onClose();
      }

      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
      if (!focusable || !focusable.length) return;

      const focusableArray = Array.from(focusable).filter((el) => el.offsetParent !== null);
      if (!focusableArray.length) return;

      const first = focusableArray[0];
      const last = focusableArray[focusableArray.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus({ preventScroll: true });
      }
    };
  }, [isCustomResolutionOpen, isOpen, onClose, onOptionsChange, options, pendingResolutionRevert]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('share');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isCustomResolutionOpen) {
      setCustomResolutionInput(options.customResolution.toString());
      setCustomResolutionError(null);
    }
  }, [options.customResolution, isCustomResolutionOpen]);

  useEffect(() => {
    if (!isOpen) {
      setCopyState('idle');
    }
  }, [isOpen]);

  const handleOverlayMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === overlayRef.current) {
      onClose();
    }
  }, [onClose]);

  const handleBackgroundChange = useCallback((value: ShareBackgroundOption['value']) => {
    onOptionsChange({
      ...options,
      backgroundStyle: value
    });
  }, [onOptionsChange, options]);

  const openCustomResolutionDialog = useCallback(() => {
    setCustomResolutionInput(options.customResolution.toString());
    setCustomResolutionError(null);
    setCustomResolutionOpen(true);
  }, [options.customResolution]);

  const handleCustomResolutionInputChange = useCallback((event: { target: { value: string } }) => {
    const nextValue = event.target.value.replace(/[^0-9]/g, '');
    setCustomResolutionInput(nextValue);
    if (customResolutionError) {
      setCustomResolutionError(null);
    }
  }, [customResolutionError]);

  const handleResolutionSelect = useCallback((value: ShareOptions['resolution']) => {
    if (value === 'custom') {
      if (options.resolution !== 'custom') {
        setPendingResolutionRevert(options.resolution);
      } else {
        setPendingResolutionRevert(null);
      }

      onOptionsChange({
        ...options,
        resolution: 'custom'
      });
      openCustomResolutionDialog();
      return;
    }

    if (options.resolution !== value) {
      onOptionsChange({
        ...options,
        resolution: value
      });
    }

    setCustomResolutionOpen(false);
    setCustomResolutionError(null);
    setPendingResolutionRevert(null);
  }, [onOptionsChange, openCustomResolutionDialog, options]);

  const handleCustomResolutionCancel = useCallback(() => {
    setCustomResolutionOpen(false);
    setCustomResolutionError(null);
    setCustomResolutionInput(options.customResolution.toString());
    if (pendingResolutionRevert && pendingResolutionRevert !== 'custom') {
      onOptionsChange({
        ...options,
        resolution: pendingResolutionRevert
      });
    }
    setPendingResolutionRevert(null);
  }, [onOptionsChange, options, options.customResolution, pendingResolutionRevert]);

  const handleCustomResolutionSave = useCallback(() => {
    const parsed = Number(customResolutionInput);
    if (!Number.isFinite(parsed)) {
      setCustomResolutionError('Enter a numeric value.');
      return;
    }

    const rounded = Math.round(parsed);
    if (rounded < MIN_CUSTOM_RESOLUTION || rounded > MAX_CUSTOM_RESOLUTION) {
      setCustomResolutionError(`Enter a value between ${MIN_CUSTOM_RESOLUTION} and ${MAX_CUSTOM_RESOLUTION} px.`);
      return;
    }

    onOptionsChange({
      ...options,
      resolution: 'custom',
      customResolution: rounded
    });
    setCustomResolutionInput(rounded.toString());
    setCustomResolutionError(null);
    setCustomResolutionOpen(false);
    setPendingResolutionRevert(null);
  }, [customResolutionInput, onOptionsChange, options]);
  useEffect(() => {
    if (!isCustomResolutionOpen) {
      return;
    }

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() => {
      const input = customResolutionInputRef.current;
      if (input) {
        input.focus();
        input.select();
      }
    });

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCustomResolutionCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleEscape);
      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus({ preventScroll: true });
      }
    };
  }, [handleCustomResolutionCancel, isCustomResolutionOpen]);

  const toggleOverlay = useCallback((key: keyof ShareOptions['includeOverlays']) => {
    onOptionsChange({
      ...options,
      includeOverlays: {
        ...options.includeOverlays,
        [key]: !options.includeOverlays[key]
      }
    });
  }, [onOptionsChange, options]);

  const toggleTextPreference = useCallback((key: keyof ShareOptions['text']) => {
    onOptionsChange({
      ...options,
      text: {
        ...options.text,
        [key]: !options.text[key]
      }
    });
  }, [onOptionsChange, options]);

  const charUsageTone = useMemo<'ok' | 'warn' | 'limit'>(() => {
    if (charCount >= charLimit) return 'limit';
    if (charCount > charLimit * 0.9) return 'warn';
    return 'ok';
  }, [charCount, charLimit]);

  const handleCopyClick = useCallback(async () => {
    try {
      const success = await onCopyShareText();
      setCopyState(success ? 'copied' : 'error');
    } catch (error) {
      console.warn('Copy share text failed', error);
      setCopyState('error');
    } finally {
      window.setTimeout(() => setCopyState('idle'), 1800);
    }
  }, [onCopyShareText]);

  const backgroundOptions = useMemo(() => SHARE_BACKGROUND_OPTIONS, []);

  if (!isOpen) {
    return null;
  }

  const dialog = (
    <div
      className="share-dialog-overlay"
      role="presentation"
      ref={overlayRef}
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        className="share-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-dialog-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <ShareDialogHeader onClose={onClose} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="share-dialog__content">
          <div className={`share-dialog__grid share-dialog__grid--${activeTab}`}>
            {activeTab === 'share' ? (
              <>
                <ShareDialogCard
                  title="Share destinations"
                  description="Choose how you want to post or export your chart."
                  layout="compact"
                >
                  <div className="share-dialog__share-actions">
                    <button
                      type="button"
                      className="share-dialog__share-button share-dialog__share-button--primary"
                      onClick={onShareToX}
                      disabled={shareButtonDisabled}
                    >
                      <Send size={16} />
                      <span>Post to X</span>
                    </button>
                    <button
                      type="button"
                      className="share-dialog__share-button"
                      onClick={onShare}
                      disabled={shareButtonDisabled}
                    >
                      <Download size={16} />
                      <span>Export image</span>
                    </button>
                  </div>
                  <p className="share-dialog__share-helper">
                    Exports download a PNG if your device can’t share directly. Post actions open in a new tab.
                  </p>
                </ShareDialogCard>

                <ShareDialogCard
                  title="Personal note"
                  description="Add a saved note that appears with your shared chart."
                  layout="compact"
                >
                  <div className="share-dialog__personal-note">
                    <label className="share-dialog__textarea-label" htmlFor="share-dialog-message">
                      Personal note
                    </label>
                    <textarea
                      id="share-dialog-message"
                      value={customMessage}
                      onChange={(event) => onCustomMessageChange(event.target.value)}
                      rows={3}
                      placeholder="Optional: shout out a transit, tag a friend, or add a call-to-action."
                    />
                    <div className={`share-dialog__char-count share-dialog__char-count--${charUsageTone}`}>
                      {charCount}/{charLimit}
                    </div>
                  </div>
                </ShareDialogCard>

                <ShareDialogCard
                  title="Share copy"
                  description="Preview the generated message and copy it for other destinations."
                  layout="full"
                >
                  <div className="share-dialog__preview">
                    <div className="share-dialog__preview-header">
                      <span>Preview</span>
                      <button type="button" className="share-dialog__copy" onClick={handleCopyClick}>
                        {copyState === 'copied' ? <Check size={16} /> : <Copy size={16} />}
                        <span>{copyState === 'copied' ? 'Copied' : 'Copy text'}</span>
                      </button>
                    </div>
                    <pre>{shareText || 'Generate a chart to preview share text.'}</pre>
                    {copyState === 'error' && (
                      <p className="share-dialog__copy-error">
                        Copy unavailable. Select the text above and copy manually.
                      </p>
                    )}
                  </div>
                </ShareDialogCard>
              </>
            ) : (
              <>
                <ShareDialogCard
                  title="Background style"
                  description="Choose the capture background fill."
                  layout="compact"
                >
                  <div className="share-dialog__option-grid share-dialog__option-grid--pair">
                    {backgroundOptions.map((option) => (
                      <BackgroundOptionTile
                        key={option.value}
                        option={option}
                        selected={options.backgroundStyle === option.value}
                        onSelect={handleBackgroundChange}
                      />
                    ))}
                  </div>
                </ShareDialogCard>

                <ShareDialogCard
                  title="Resolution"
                  description="Select an export size or set a custom dimension."
                  layout="compact"
                >
                  <div className="share-dialog__resolution-buttons">
                    {resolutionButtons.map((option) => {
                      const isSelected = options.resolution === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          className={`share-dialog__resolution-button ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => handleResolutionSelect(option.value)}
                        >
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="share-dialog__resolution-selected">
                    <span>{selectedResolutionLabel}</span>
                    {options.resolution === 'custom' && (
                      <button
                        type="button"
                        className="share-dialog__resolution-adjust"
                        onClick={openCustomResolutionDialog}
                      >
                        Adjust size
                      </button>
                    )}
                  </div>
                </ShareDialogCard>

                <ShareDialogCard
                  title="Overlay layers"
                  description="Toggle chart layers for the exported image (live chart remains unchanged)."
                  layout="compact"
                >
                  <div className="share-dialog__toggle-grid">
                    <ToggleRow
                      label="Aspect lines"
                      checked={options.includeOverlays.aspectLines}
                      onChange={() => toggleOverlay('aspectLines')}
                    />
                    <ToggleRow
                      label="House numbers"
                      checked={options.includeOverlays.houseNumbers}
                      onChange={() => toggleOverlay('houseNumbers')}
                    />
                    <ToggleRow
                      label="Zodiac glyphs"
                      checked={options.includeOverlays.zodiacSymbols}
                      onChange={() => toggleOverlay('zodiacSymbols')}
                    />
                    <ToggleRow
                      label="Angle badges"
                      checked={options.includeOverlays.angles}
                      onChange={() => toggleOverlay('angles')}
                    />
                  </div>
                </ShareDialogCard>

                <ShareDialogCard
                  title="Share copy options"
                  description="Choose which chart details appear in the generated text."
                  layout="compact"
                >
                  <div className="share-dialog__toggle-grid">
                    <ToggleRow
                      label="Include rising & midheaven"
                      checked={options.text.includeAngles}
                      onChange={() => toggleTextPreference('includeAngles')}
                    />
                    <ToggleRow
                      label="Include aspect highlights"
                      checked={options.text.includeAspects}
                      onChange={() => toggleTextPreference('includeAspects')}
                    />
                    <ToggleRow
                      label="Add hashtag bundle"
                      checked={options.text.includeHashtags}
                      onChange={() => toggleTextPreference('includeHashtags')}
                    />
                  </div>
                </ShareDialogCard>
              </>
            )}
          </div>
        </div>

        <ShareDialogFooter
          shareState={shareState}
          shareMessage={shareMessage}
        />
      </div>
    </div>
  );

  const customResolutionDialog = isCustomResolutionOpen
    ? createPortal(
        <div
          className="share-dialog__custom-resolution-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCustomResolutionCancel();
            }
          }}
        >
          <div
            className="share-dialog__custom-resolution-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="custom-resolution-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="share-dialog__custom-resolution-header">
              <h3 id="custom-resolution-title">Set custom resolution</h3>
              <p>
                Enter a chart size between {MIN_CUSTOM_RESOLUTION.toLocaleString()} px and {MAX_CUSTOM_RESOLUTION.toLocaleString()} px.
                The chart exports as a square image.
              </p>
            </header>
            <label className="share-dialog__custom-resolution-label" htmlFor="custom-resolution-input">
              Dimension (pixels)
            </label>
            <input
              id="custom-resolution-input"
              type="text"
              inputMode="numeric"
              value={customResolutionInput}
              onChange={handleCustomResolutionInputChange}
              min={MIN_CUSTOM_RESOLUTION}
              max={MAX_CUSTOM_RESOLUTION}
              aria-invalid={customResolutionError ? 'true' : 'false'}
              ref={customResolutionInputRef}
            />
            {customResolutionError && (
              <p role="alert" className="share-dialog__custom-resolution-error">
                {customResolutionError}
              </p>
            )}
            <div className="share-dialog__custom-resolution-actions">
              <button type="button" onClick={handleCustomResolutionCancel} className="share-dialog__custom-resolution-secondary">
                Cancel
              </button>
              <button type="button" onClick={handleCustomResolutionSave} className="share-dialog__custom-resolution-primary">
                Save
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {createPortal(dialog, document.body)}
      {customResolutionDialog}
    </>
  );
};

export default ShareDialog;
