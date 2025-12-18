import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, DownloadCloud, RefreshCw } from 'lucide-react'
import TopBar from '../components/TopBar'
import './CalendarPages.css'
import {
  fetchAndCacheIcs,
  fetchIcsIndexWithFallback,
  downloadCachedIcs,
  loadIcsCache,
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

type CalendarEvent = {
  uid?: string
  start: Date
  end: Date
  summary?: string
  description?: string
  location?: string
  allDay?: boolean
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

function unfoldLines(input: string): string {
  return input.replace(/\r?\n[ \t]/g, '')
}

function parseIcsDate(raw: string): { date: Date | null; allDay: boolean } {
  if (!raw) return { date: null, allDay: false }
  const value = raw.split(':').pop() ?? raw
  const isDateOnly = /VALUE=DATE/.test(raw) || value.length === 8

  const matchDateTime = value.match(/^(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?(\d{2})?Z?$/)
  if (matchDateTime) {
    const [, y, m, d, hh = '00', mm = '00', ss = '00'] = matchDateTime
    const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss)))
    return { date, allDay: isDateOnly && hh === '00' && mm === '00' && ss === '00' }
  }

  const matchDateOnly = value.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (matchDateOnly) {
    const [, y, m, d] = matchDateOnly
    const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)))
    return { date, allDay: true }
  }

  return { date: null, allDay: false }
}

function parseIcsEvents(content: string): CalendarEvent[] {
  const unfolded = unfoldLines(content)
  const blocks = unfolded.split('BEGIN:VEVENT').slice(1)

  const events: CalendarEvent[] = []

  for (const block of blocks) {
    const body = block.split('END:VEVENT')[0]
    const lines = body.split(/\r?\n/)
    const map: Record<string, string> = {}

    for (const line of lines) {
      const [rawKey, ...rest] = line.split(':')
      if (!rawKey || rest.length === 0) continue
      const key = rawKey.toUpperCase()
      const value = rest.join(':')
      map[key] = value
    }

    const dtStartLine = lines.find((l) => l.startsWith('DTSTART'))
    const dtEndLine = lines.find((l) => l.startsWith('DTEND'))
    const { date: start, allDay: startAllDay } = parseIcsDate(dtStartLine ?? '')
    const { date: end, allDay: endAllDay } = parseIcsDate(dtEndLine ?? '')

    if (!start) continue

    events.push({
      uid: map.UID,
      start,
      end: end ?? start,
      summary: map.SUMMARY,
      description: map.DESCRIPTION,
      location: map.LOCATION,
      allDay: startAllDay || endAllDay
    })
  }

  return events.sort((a, b) => a.start.getTime() - b.start.getTime())
}

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function startOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function endOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999))
}

function startOfWeek(date: Date): Date {
  const day = date.getUTCDay()
  const diff = (day + 6) % 7 // Monday start
  const start = new Date(date)
  start.setUTCDate(date.getUTCDate() - diff)
  return startOfDay(start)
}

function endOfWeek(date: Date): Date {
  const start = startOfWeek(date)
  const end = new Date(start)
  end.setUTCDate(start.getUTCDate() + 6)
  return endOfDay(end)
}

function startOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
}

function endOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59, 999))
}

function formatRangeLabel(view: 'day' | 'week' | 'month', date: Date): string {
  const formatter = new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' })
  if (view === 'month') return formatter.format(date)

  if (view === 'week') {
    const start = startOfWeek(date)
    const end = endOfWeek(date)
    const fmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
    return `${fmt.format(start)} – ${fmt.format(end)} ${start.getUTCFullYear()}`
  }

  const fmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  return fmt.format(date)
}

function eventsInRange(events: CalendarEvent[], start: Date, end: Date): CalendarEvent[] {
  return events
    .filter((event) => event.end >= start && event.start <= end)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}

function CalendarPage() {
  const navigate = useNavigate()
  const [index, setIndex] = useState<IcsIndexItem[]>([])
  const [cache, setCache] = useState<Record<string, CachedIcsItem>>(() => loadIcsCache())
  const [eventsByKey, setEventsByKey] = useState<Record<string, CalendarEvent[]>>({})
  const [loadingIndex, setLoadingIndex] = useState(false)
  const [loadingYear, setLoadingYear] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month')
  const [selectedDate, setSelectedDate] = useState<Date>(() => startOfDay(new Date()))
  const [activeSeries, setActiveSeries] = useState<string | null>(null)
  const { toast, showToast } = useToast()
  const today = useMemo(() => startOfDay(new Date()), [])

  const seriesFilters = useMemo(() => {
    const set = new Set<string>()
    index.forEach((item) => set.add(deriveSeries(item.path).series))
    return Array.from(set)
  }, [index])

  useEffect(() => {
    if (activeSeries) return
    if (seriesFilters.length === 0) return
    const priority = ['Standard Astrology', 'Business Astrology', 'Space Force Astrology']
    const preferred = priority.find((p) => seriesFilters.includes(p)) ?? seriesFilters[0]
    setActiveSeries(preferred)
  }, [activeSeries, seriesFilters])

  const selectedYear = selectedDate.getUTCFullYear().toString()
  const eventsKey = activeSeries ? `${activeSeries}-${selectedYear}` : ''
  const eventsForYear = eventsKey ? eventsByKey[eventsKey] : undefined

  useEffect(() => {
    const loadIndex = async () => {
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

    loadIndex()
  }, [])

  useEffect(() => {
    if (!activeSeries) return
    if (loadingIndex) return
    const key = `${activeSeries}-${selectedYear}`
    if (eventsByKey[key]) return

    const entry = index.find((item) => {
      const meta = deriveSeries(item.path)
      return meta.series === activeSeries && meta.year === selectedYear
    })

    if (!entry) {
      setEventsByKey((prev) => ({ ...prev, [key]: [] }))
      return
    }

    const cached = cache[entry.path]

    const loadYear = async () => {
      setLoadingYear(true)
      setError(null)
      try {
        let record = cached
        if (!record) {
          record = await fetchAndCacheIcs(entry)
          setCache((prev) => ({ ...prev, [entry.path]: record }))
          showToast(`Cached ${entry.path}`)
        }

        const parsed = parseIcsEvents(record.content)
        setEventsByKey((prev) => ({ ...prev, [key]: parsed }))
      } catch (err) {
        setError(err instanceof Error ? err.message : `Failed to load ${entry.path}`)
        setEventsByKey((prev) => ({ ...prev, [key]: [] }))
      } finally {
        setLoadingYear(false)
      }
    }

    void loadYear()
  }, [activeSeries, selectedYear, index, cache, loadingIndex, eventsByKey, showToast])

  const currentRange = useMemo(() => {
    if (viewMode === 'day') {
      return { start: startOfDay(selectedDate), end: endOfDay(selectedDate) }
    }
    if (viewMode === 'week') {
      return { start: startOfWeek(selectedDate), end: endOfWeek(selectedDate) }
    }
    return { start: startOfMonth(selectedDate), end: endOfMonth(selectedDate) }
  }, [viewMode, selectedDate])

  const rangeEvents = useMemo(() => {
    if (!eventsForYear) return []
    return eventsInRange(eventsForYear, currentRange.start, currentRange.end)
  }, [eventsForYear, currentRange])

  const handlePrev = () => {
    const next = new Date(selectedDate)
    if (viewMode === 'day') {
      next.setUTCDate(selectedDate.getUTCDate() - 1)
    } else if (viewMode === 'week') {
      next.setUTCDate(selectedDate.getUTCDate() - 7)
    } else {
      next.setUTCMonth(selectedDate.getUTCMonth() - 1)
    }
    setSelectedDate(startOfDay(next))
  }

  const handleNext = () => {
    const next = new Date(selectedDate)
    if (viewMode === 'day') {
      next.setUTCDate(selectedDate.getUTCDate() + 1)
    } else if (viewMode === 'week') {
      next.setUTCDate(selectedDate.getUTCDate() + 7)
    } else {
      next.setUTCMonth(selectedDate.getUTCMonth() + 1)
    }
    setSelectedDate(startOfDay(next))
  }

  const handleToday = () => setSelectedDate(startOfDay(new Date()))

  const currentIndexEntry = useMemo(() => {
    if (!activeSeries) return null
    return index.find((item) => {
      const meta = deriveSeries(item.path)
      return meta.series === activeSeries && meta.year === selectedYear
    })
  }, [activeSeries, index, selectedYear])

  const handleDownloadCurrent = () => {
    if (!currentIndexEntry) return
    const cached = cache[currentIndexEntry.path]
    if (cached) {
      downloadCachedIcs(cached)
      showToast(`Downloaded ${currentIndexEntry.path} from cache`)
    }
  }

  const handleRefreshYear = async () => {
    if (!currentIndexEntry || !activeSeries) return
    setLoadingYear(true)
    setError(null)
    try {
      const record = await fetchAndCacheIcs(currentIndexEntry)
      setCache((prev) => ({ ...prev, [currentIndexEntry.path]: record }))
      const parsed = parseIcsEvents(record.content)
      const key = `${activeSeries}-${selectedYear}`
      setEventsByKey((prev) => ({ ...prev, [key]: parsed }))
      showToast(`Refreshed ${currentIndexEntry.path}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to refresh ${currentIndexEntry.path}`)
    } finally {
      setLoadingYear(false)
    }
  }

  const handleDateChange = (value: string) => {
    if (!value) return
    const next = startOfDay(new Date(`${value}T00:00:00Z`))
    if (Number.isNaN(next.getTime())) return
    setSelectedDate(next)
  }

  const renderDayView = () => {
    return (
      <div className="calendar-day-view">
        {rangeEvents.length === 0 ? (
          <p className="calendar-empty">No events for this day.</p>
        ) : (
          <div className="calendar-day-list">
            {rangeEvents.map((event) => {
              const timeFmt = new Intl.DateTimeFormat(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              })
              const startLabel = event.allDay ? 'All day' : timeFmt.format(event.start)
              const endLabel = event.allDay ? '' : ` · ${timeFmt.format(event.end)}`
              return (
                <div key={event.uid ?? `${event.start.toISOString()}-${event.summary}`} className="calendar-event">
                  <div className="calendar-event-title">{event.summary ?? 'Untitled event'}</div>
                  <div className="calendar-event-meta">{startLabel}{endLabel}</div>
                  {event.location && <div className="calendar-event-meta">{event.location}</div>}
                  {event.description && <p className="calendar-event-desc">{event.description}</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const renderWeekView = () => {
    const start = currentRange.start
    const days: Date[] = []
    for (let i = 0; i < 7; i += 1) {
      const day = new Date(start)
      day.setUTCDate(start.getUTCDate() + i)
      days.push(day)
    }

    return (
      <div className="calendar-week-grid">
        {days.map((day) => {
          const dayEvents = eventsInRange(eventsForYear ?? [], startOfDay(day), endOfDay(day))
          return (
            <div key={day.toISOString()} className="calendar-day-card">
              <div className="calendar-day-card-header">
                <span className="calendar-day-label">
                  {new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(day)}
                </span>
                <span className="calendar-day-count">{dayEvents.length} event{dayEvents.length === 1 ? '' : 's'}</span>
              </div>
              {dayEvents.length === 0 ? (
                <p className="calendar-empty subtle">No events</p>
              ) : (
                <ul className="calendar-day-events">
                  {dayEvents.map((event) => {
                    const timeFmt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' })
                    const label = event.allDay ? 'All day' : `${timeFmt.format(event.start)} – ${timeFmt.format(event.end)}`
                    return (
                      <li key={event.uid ?? `${event.start.toISOString()}-${event.summary}`}>
                        <span className="calendar-event-title">{event.summary ?? 'Untitled event'}</span>
                        <span className="calendar-event-meta">{label}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const renderMonthView = () => {
    const start = startOfMonth(selectedDate)
    const end = endOfWeek(endOfMonth(selectedDate))
    const firstWeekStart = startOfWeek(start)
    const cells: Date[] = []
    let cursor = firstWeekStart
    while (cursor <= end) {
      cells.push(new Date(cursor))
      const next = new Date(cursor)
      next.setUTCDate(cursor.getUTCDate() + 1)
      cursor = next
    }

    return (
      <>
        <div className="calendar-month-headers" aria-hidden="true">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="calendar-month-header">
              {label}
            </div>
          ))}
        </div>
        <div className="calendar-month-grid">
          {cells.map((day) => {
            const dayEvents = eventsInRange(eventsForYear ?? [], startOfDay(day), endOfDay(day))
            const inMonth = day.getUTCMonth() === selectedDate.getUTCMonth()
            const isToday = day.getTime() === today.getTime()
            return (
              <button
                key={day.toISOString()}
                type="button"
                className={`calendar-month-cell ${inMonth ? '' : 'muted'} ${isToday ? 'today' : ''}`}
                onClick={() => {
                  setSelectedDate(startOfDay(day))
                  setViewMode('day')
                }}
                aria-label={`View ${day.toUTCString()}`}
              >
                <div className="calendar-month-cell-header">
                  <span className="calendar-day-number">{day.getUTCDate()}</span>
                  {dayEvents.length > 0 && <span className="calendar-pill small">{dayEvents.length}</span>}
                </div>
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.uid ?? `${event.start.toISOString()}-${event.summary}`}
                    className="calendar-event-chip"
                  >
                    {event.summary ?? 'Untitled event'}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="calendar-event-meta more">+{dayEvents.length - 3} more</div>
                )}
              </button>
            )
          })}
        </div>
      </>
    )
  }

  return (
    <div className="calendar-page">
      <TopBar
        onNavigateHome={() => navigate('/')}
        onOpenTutorial={() => navigate('/tutorial')}
        onOpenAbout={() => navigate('/about')}
        onOpenCalendar={() => navigate('/calendar')}
        onOpenCalendarDownloads={() => navigate('/calendar-downloads')}
        calendarActive
      />

      <main className="calendar-shell">
        {toast && (
          <div className={`calendar-toast ${toast.tone ?? 'success'}`} role="status">
            {toast.message}
          </div>
        )}
        <header className="calendar-header">
          <h1>Calendar</h1>
          <p>
            View Space Force, Business, or Standard astrology calendars in day, week, or month layouts. Data caches
            automatically for the year you are viewing and falls back to an empty view if unavailable.
          </p>

          <div className="toolbar">
            <div className="toolbar-row">
              <div className="toolbar-group wrap">
                <div className="segmented-control" role="group" aria-label="View mode">
                  {(['day', 'week', 'month'] as const).map((mode) => (
                    <button
                      key={mode}
                      className={`segmented-button ${viewMode === mode ? 'active' : ''}`}
                      onClick={() => setViewMode(mode)}
                      aria-pressed={viewMode === mode}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
                {seriesFilters.length > 0 && (
                  <div className="segmented-control scrollable" aria-label="Select calendar type">
                    {seriesFilters.map((series) => (
                      <button
                        key={series}
                        className={`segmented-button ${activeSeries === series ? 'active' : ''}`}
                        onClick={() => setActiveSeries(series)}
                        aria-pressed={activeSeries === series}
                      >
                        {series}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="toolbar-row">
              <div className="toolbar-group wrap">
                <div className="calendar-nav">
                  <button className="calendar-button" onClick={handlePrev}>
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button className="calendar-button" onClick={handleToday}>
                    <CalendarIcon size={16} /> Today
                  </button>
                  <button className="calendar-button" onClick={handleNext}>
                    Next <ChevronRight size={16} />
                  </button>
                  <span className="calendar-range-label" aria-live="polite">
                    {formatRangeLabel(viewMode, selectedDate)}
                  </span>
                  <label className="calendar-date-picker">
                    <span className="sr-only">Jump to date</span>
                    <input
                      type="date"
                      value={toDateInputValue(selectedDate)}
                      onChange={(e) => handleDateChange(e.target.value)}
                    />
                  </label>
                </div>
                {currentIndexEntry && (
                  <button className="calendar-button" onClick={handleDownloadCurrent} disabled={!cache[currentIndexEntry.path]}>
                    <DownloadCloud size={16} /> Download .ics
                  </button>
                )}
                <button className="calendar-button" onClick={handleRefreshYear} disabled={loadingYear}>
                  <RefreshCw size={16} /> {loadingYear ? 'Refreshing…' : 'Refresh year'}
                </button>
              </div>
            </div>
          </div>

          <div className="calendar-inline-list">
            <span>
              <strong>{activeSeries ?? 'Select a series'}</strong>
            </span>
            <span>·</span>
            <span>
              Viewing {selectedYear}
            </span>
            {loadingYear && <span>· Loading year…</span>}
            {loadingIndex && <span>· Loading index…</span>}
          </div>

          {error && <div className="calendar-status" role="alert">{error}</div>}
          {loadingYear && <div className="calendar-status subtle">Loading events for {selectedYear}…</div>}
        </header>

        {activeSeries && eventsForYear && eventsForYear.length === 0 && !loadingYear ? (
          <div className="calendar-empty">
            No events loaded for this year. If the ICS is missing for this series/year, the view will stay empty.
          </div>
        ) : null}

        {viewMode === 'day' && renderDayView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
      </main>
    </div>
  )
}

export default CalendarPage
