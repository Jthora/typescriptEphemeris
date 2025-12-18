import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, HardDriveDownload, RefreshCw, Trash2 } from 'lucide-react'
import TopBar from '../components/TopBar'
import './CalendarPages.css'
import {
  fetchAndCacheIcs,
  fetchIcsIndexWithFallback,
  downloadCachedIcs,
  downloadIcs,
  formatBytes,
  humanizeTitle,
  loadIcsCache,
  removeCachedIcs,
  type CachedIcsItem,
  type IcsIndexItem
} from '../utils/icsRepository'

type SeriesMeta = {
  series: string
  year?: string
}

type Toast = {
  message: string
  tone?: 'success' | 'error'
}

function useToast() {
  const [toast, setToast] = useState<Toast | null>(null)
  const timerRef = useRef<number | null>(null)

  const showToast = useCallback((message: string, tone: Toast['tone'] = 'success') => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }
    setToast({ message, tone })
    timerRef.current = window.setTimeout(() => setToast(null), 3200)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  return { toast, showToast }
}

function deriveSeries(path: string) {
  const yearMatch = path.match(/(20\d{2})/)
  const year = yearMatch?.[1]

  const spaceForce = path.match(/space[_-]?force[_-]?astrology[_-]?(\d{4})/i)
  if (spaceForce) {
    return { series: 'Space Force Astrology', year: spaceForce[1] ?? year } as SeriesMeta
  }

  const business = path.match(/business[_-]?astrology[_-]?(\d{4})/i)
  if (business) {
    return { series: 'Business Astrology', year: business[1] ?? year } as SeriesMeta
  }

  const standard = path.match(/standard[_-]?astrology[_-]?(\d{4})/i)
  if (standard) {
    return { series: 'Standard Astrology', year: standard[1] ?? year } as SeriesMeta
  }

  return { series: 'Standard Astrology', year } as SeriesMeta
}

function CalendarDownloadsPage() {
  const navigate = useNavigate()
  const [index, setIndex] = useState<IcsIndexItem[]>([])
  const [cache, setCache] = useState<Record<string, CachedIcsItem>>(() => loadIcsCache())
  const [loadingIndex, setLoadingIndex] = useState(false)
  const [syncingAll, setSyncingAll] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<Record<string, boolean>>({})
  const [activeSeries, setActiveSeries] = useState<string>('All')
  const [downloading, setDownloading] = useState<Record<string, boolean>>({})
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid')
  const { toast, showToast } = useToast()
  const seriesDescriptions: Record<string, string> = useMemo(
    () => ({
      'Standard Astrology': 'Standard: classic astrology interpretations for everyday planning.',
      'Business Astrology': 'Business: timing cues for launches, deals, and operations.',
      'Space Force Astrology': 'Space Force: mission-aligned ephemeris for USSF crews.'
    }),
    []
  )

  const cachedCount = useMemo(() => Object.keys(cache).length, [cache])
  const missingFromCache = useMemo(() => index.filter((item) => !cache[item.path]), [index, cache])

  const seriesFilters = useMemo(() => {
    const set = new Set<string>(['All'])
    index.forEach((item) => set.add(deriveSeries(item.path).series))
    return Array.from(set)
  }, [index])

  const filteredIndex = useMemo(() => {
    if (activeSeries === 'All') return index
    return index.filter((item) => deriveSeries(item.path).series === activeSeries)
  }, [activeSeries, index])

  useEffect(() => {
    refreshIndex()
  }, [])

  const refreshIndex = async () => {
    setLoadingIndex(true)
    setError(null)
    try {
      const items = await fetchIcsIndexWithFallback()
      setIndex(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load calendar index')
    } finally {
      setLoadingIndex(false)
    }
  }

  const handleCache = async (item: IcsIndexItem) => {
    setBusy((prev) => ({ ...prev, [item.path]: true }))
    setError(null)
    try {
      const record = await fetchAndCacheIcs(item)
      setCache((prev) => ({ ...prev, [item.path]: record }))
      showToast(`Cached ${item.path}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to cache ${item.path}`)
      showToast(`Failed to cache ${item.path}`, 'error')
    } finally {
      setBusy((prev) => ({ ...prev, [item.path]: false }))
    }
  }

  const handleCacheMissing = async () => {
    if (missingFromCache.length === 0) return
    setSyncingAll(true)
    setError(null)
    try {
      for (const item of missingFromCache) {
        // Sequential to reduce GitHub rate-limit risk
        // eslint-disable-next-line no-await-in-loop
        await handleCache(item)
      }
    } finally {
      setSyncingAll(false)
    }
  }

  const handleRemove = (path: string) => {
    removeCachedIcs(path)
    setCache((prev) => {
      const next = { ...prev }
      delete next[path]
      return next
    })
    showToast(`Removed ${path}`)
  }

  const handleDownload = async (item: IcsIndexItem) => {
    setDownloading((prev) => ({ ...prev, [item.path]: true }))
    setError(null)
    try {
      const cached = cache[item.path]
      if (cached) {
        downloadCachedIcs(cached)
        showToast(`Downloaded ${item.path} from cache`)
      } else {
        await downloadIcs(item)
        showToast(`Downloaded ${item.path}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to download ${item.path}`)
      showToast(`Failed to download ${item.path}`, 'error')
    } finally {
      setDownloading((prev) => ({ ...prev, [item.path]: false }))
    }
  }

  return (
    <div className="calendar-page">
      <TopBar
        onNavigateHome={() => navigate('/')}
        onOpenTutorial={() => navigate('/tutorial')}
        onOpenAbout={() => navigate('/about')}
        onOpenCalendar={() => navigate('/calendar')}
        onOpenCalendarDownloads={() => navigate('/calendar-downloads')}
        calendarDownloadsActive
      />

      <main className="calendar-shell">
        {toast && (
          <div className={`calendar-toast ${toast.tone ?? 'success'}`} role="status">
            {toast.message}
          </div>
        )}
        <header className="calendar-header">
          <h1>Calendar Downloads</h1>
          <div className="toolbar">
            <div className="toolbar-row">
              <div className="toolbar-group">
                <button className="calendar-button primary" onClick={refreshIndex} disabled={loadingIndex}>
                  <RefreshCw size={16} /> {loadingIndex ? 'Refreshing…' : 'Refresh index'}
                </button>
                <button
                  className="calendar-button primary"
                  onClick={handleCacheMissing}
                  disabled={syncingAll || missingFromCache.length === 0}
                >
                  <HardDriveDownload size={16} />
                  {syncingAll
                    ? 'Caching missing…'
                    : missingFromCache.length === 0
                      ? 'All cached'
                      : `Cache ${missingFromCache.length} missing`}
                </button>
                <span className="calendar-metric">Cached Calendars: {cachedCount}</span>
              </div>
            </div>

            <div className="toolbar-row">
              <div className="toolbar-group wrap">
                <div className="segmented-control" role="group" aria-label="Layout mode">
                  <button
                    className={`segmented-button ${layoutMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setLayoutMode('grid')}
                    aria-pressed={layoutMode === 'grid'}
                  >
                    Grid
                  </button>
                  <button
                    className={`segmented-button ${layoutMode === 'list' ? 'active' : ''}`}
                    onClick={() => setLayoutMode('list')}
                    aria-pressed={layoutMode === 'list'}
                  >
                    List
                  </button>
                </div>
                <span className="toolbar-divider" aria-hidden="true" />
                {seriesFilters.length > 1 && (
                  <div className="segmented-control scrollable" aria-label="Filter by series">
                    {seriesFilters.map((series) => {
                      const isActive = activeSeries === series
                      return (
                        <button
                          key={series}
                          className={`segmented-button ${isActive ? 'active' : ''}`}
                          onClick={() => setActiveSeries(series)}
                          aria-pressed={isActive}
                        >
                          {series}
                        </button>
                      )
                    })}
                  </div>
                )}
                {activeSeries !== 'All' && (
                  <p className="calendar-path">{seriesDescriptions[activeSeries] ?? `${activeSeries} calendars`}</p>
                )}
              </div>
            </div>
          </div>
          {error && <div className="calendar-status" role="alert">{error}</div>}

        </header>
        {filteredIndex.length === 0 && !loadingIndex ? (
          <div className="calendar-empty">No calendars detected yet. Refresh the index to load the .ics list.</div>
        ) : (
          <div className={`calendar-grid ${layoutMode === 'list' ? 'list' : ''}`}>
            {filteredIndex.map((item) => {
              const cached = cache[item.path]
              const isBusy = busy[item.path]
              const isDownloading = downloading[item.path]
              return (
                <article key={item.path} className="calendar-card">
                  <div className="calendar-card-header">
                    <div>
                      <h3>{item.title ?? humanizeTitle(item.path)}</h3>
                      <p className="calendar-path">
                        Source:{' '}
                        <a href={item.downloadUrl} target="_blank" rel="noreferrer">
                          {item.path.split('/').pop() ?? item.path}
                        </a>
                      </p>
                    </div>
                    <div className="calendar-meta inline">
                      <span className="calendar-pill">{formatBytes(item.size)}</span>
                      {cached && <span className="calendar-pill">Cached</span>}
                      {(() => {
                        const meta = deriveSeries(item.path)
                        return (
                          <>
                            <span className="calendar-pill">{meta.series}</span>
                            {meta.year && <span className="calendar-pill">{meta.year}</span>}
                          </>
                        )
                      })()}
                    </div>
                  </div>
                  {cached?.downloadedAt && (
                    <p>Cached at: {new Date(cached.downloadedAt).toLocaleString()}</p>
                  )}
                  <div className="calendar-card-actions">
                    <button
                      className="calendar-button"
                      onClick={() => handleDownload(item)}
                      disabled={!!isDownloading}
                    >
                      <Download size={16} /> {isDownloading ? 'Downloading…' : 'Download'}
                    </button>
                    {cached ? (
                      <>
                        <button
                          className="calendar-button"
                          onClick={() => handleCache(item)}
                          disabled={isBusy}
                          title="Re-download latest copy"
                        >
                          <RefreshCw size={16} /> {isBusy ? 'Updating…' : 'Refresh cache'}
                        </button>
                        <button
                          className="calendar-button"
                          onClick={() => handleRemove(item.path)}
                          title="Remove cached copy"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      </>
                    ) : (
                      <button
                        className="calendar-button"
                        onClick={() => handleCache(item)}
                        disabled={isBusy}
                      >
                        <HardDriveDownload size={16} /> {isBusy ? 'Caching…' : 'Cache locally'}
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default CalendarDownloadsPage
