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
import { parseDescriptionToSymbology } from '../utils/icsSymbologyParser'
import { ASPECT_LEGEND } from '../utils/symbology'
import themeManager, { THEMES, type ThemeType } from '../theme-manager'

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
  // Preserve original Y/M/D for all-day so we can reconstruct wall dates per TZ
  allDayParts?: { year: number; month: number; day: number }
  allDayEndParts?: { year: number; month: number; day: number }
}

const DEFAULT_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC'

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

function decodeIcsText(value?: string): string | undefined {
  if (!value) return value
  return value
    .replace(/\\\\/g, '\\')
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
}

function parseIcsDate(raw: string): { date: Date | null; allDay: boolean; parts?: { year: number; month: number; day: number } } {
  if (!raw) return { date: null, allDay: false }
  const value = raw.split(':').pop() ?? raw
  const isDateOnly = /VALUE=DATE/.test(raw) || value.length === 8

  const matchDateTime = value.match(/^(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?(\d{2})?Z?$/)
  if (matchDateTime) {
    const [, y, m, d, hh = '00', mm = '00', ss = '00'] = matchDateTime
    const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss)))
    return {
      date,
      allDay: isDateOnly && hh === '00' && mm === '00' && ss === '00',
      parts: isDateOnly ? { year: Number(y), month: Number(m), day: Number(d) } : undefined
    }
  }

  const matchDateOnly = value.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (matchDateOnly) {
    const [, y, m, d] = matchDateOnly
    const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)))
    return { date, allDay: true, parts: { year: Number(y), month: Number(m), day: Number(d) } }
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
    const { date: start, allDay: startAllDay, parts: startParts } = parseIcsDate(dtStartLine ?? '')
    const { date: end, allDay: endAllDay, parts: endParts } = parseIcsDate(dtEndLine ?? '')

    if (!start) continue

    events.push({
      uid: map.UID,
      start,
      end: end ?? start,
      summary: decodeIcsText(map.SUMMARY),
      description: decodeIcsText(map.DESCRIPTION),
      location: decodeIcsText(map.LOCATION),
      allDay: startAllDay || endAllDay,
      allDayParts: startAllDay ? startParts : undefined,
      allDayEndParts: endAllDay ? endParts : undefined
    })
  }

  return events.sort((a, b) => a.start.getTime() - b.start.getTime())
}

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

type ZonedParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(date)

  const map: Record<string, string> = {}
  for (const part of parts) {
    if (part.type !== 'literal') {
      map[part.type] = part.value
    }
  }

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour ?? 0),
    minute: Number(map.minute ?? 0),
    second: Number(map.second ?? 0)
  }
}

function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
  const parts = getZonedParts(date, timeZone)
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
  return asUtc - date.getTime()
}

function zonedStartOfDay(date: Date, timeZone: string): Date {
  const parts = getZonedParts(date, timeZone)
  const utcMidnight = Date.UTC(parts.year, parts.month - 1, parts.day, 0, 0, 0, 0)
  const offset = getTimeZoneOffsetMs(new Date(utcMidnight), timeZone)
  return new Date(utcMidnight - offset)
}

function zonedEndOfDay(date: Date, timeZone: string): Date {
  const parts = getZonedParts(date, timeZone)
  const utcEnd = Date.UTC(parts.year, parts.month - 1, parts.day, 23, 59, 59, 999)
  const offset = getTimeZoneOffsetMs(new Date(utcEnd), timeZone)
  return new Date(utcEnd - offset)
}

function toDateInputValue(date: Date, timeZone: string): string {
  const parts = getZonedParts(date, timeZone)
  const y = parts.year.toString().padStart(4, '0')
  const m = parts.month.toString().padStart(2, '0')
  const d = parts.day.toString().padStart(2, '0')
  return `${y}-${m}-${d}`
}

function startOfDay(date: Date, timeZone: string): Date {
  return zonedStartOfDay(date, timeZone)
}

function endOfDay(date: Date, timeZone: string): Date {
  return zonedEndOfDay(date, timeZone)
}

function startOfWeek(date: Date, timeZone: string): Date {
  const start = startOfDay(date, timeZone)
  const day = start.getUTCDay()
  const diff = (day + 6) % 7 // Monday start
  const shifted = new Date(start)
  shifted.setUTCDate(start.getUTCDate() - diff)
  return startOfDay(shifted, timeZone)
}

function endOfWeek(date: Date, timeZone: string): Date {
  const start = startOfWeek(date, timeZone)
  const end = new Date(start)
  end.setUTCDate(start.getUTCDate() + 6)
  return endOfDay(end, timeZone)
}

function startOfMonth(date: Date, timeZone: string): Date {
  const parts = getZonedParts(date, timeZone)
  const utcStart = Date.UTC(parts.year, parts.month - 1, 1, 0, 0, 0, 0)
  const offset = getTimeZoneOffsetMs(new Date(utcStart), timeZone)
  return new Date(utcStart - offset)
}

function endOfMonth(date: Date, timeZone: string): Date {
  const parts = getZonedParts(date, timeZone)
  const utcEnd = Date.UTC(parts.year, parts.month, 0, 23, 59, 59, 999)
  const offset = getTimeZoneOffsetMs(new Date(utcEnd), timeZone)
  return new Date(utcEnd - offset)
}

function sameMonthYear(left: Date, right: Date, timeZone: string): boolean {
  const l = getZonedParts(left, timeZone)
  const r = getZonedParts(right, timeZone)
  return l.year === r.year && l.month === r.month
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setUTCDate(date.getUTCDate() + days)
  return next
}

function normalizeEventRange(event: CalendarEvent, timeZone: string): { start: Date; end: Date } {
  if (event.allDay) {
    if (event.allDayParts) {
      const { year, month, day } = event.allDayParts
      const endParts = event.allDayEndParts ?? { year, month, day: day + 1 }
      const startWall = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))
      const endWall = new Date(Date.UTC(endParts.year, endParts.month - 1, endParts.day, 12, 0, 0))
      const start = startOfDay(startWall, timeZone)
      const end = startOfDay(endWall, timeZone)
      // If provider set DTEND equal or behind DTSTART, force a +1 day to keep half-open invariant
      if (end.getTime() <= start.getTime()) {
        return { start, end: startOfDay(new Date(Date.UTC(year, month - 1, day + 1, 12, 0, 0)), timeZone) }
      }
      return { start, end }
    }

    const start = startOfDay(event.start, timeZone)
    const endAnchor = event.end ? startOfDay(event.end, timeZone) : startOfDay(addDays(event.start, 1), timeZone)
    return { start, end: endAnchor }
  }

  return { start: event.start, end: event.end ?? event.start }
}

function formatRangeLabel(view: 'day' | 'week' | 'month', date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric', timeZone })
  if (view === 'month') return formatter.format(date)

  if (view === 'week') {
    const start = startOfWeek(date, timeZone)
    const end = endOfWeek(date, timeZone)
    const fmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', timeZone })
    return `${fmt.format(start)} – ${fmt.format(end)} ${new Intl.DateTimeFormat(undefined, { year: 'numeric', timeZone }).format(start)}`
  }

  const fmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone })
  return fmt.format(date)
}

function eventsInRange(events: CalendarEvent[], start: Date, end: Date, timeZone: string): CalendarEvent[] {
  return events
    .filter((event) => {
      const normalized = normalizeEventRange(event, timeZone)
      // Overlap test using half-open intervals: eventStart < rangeEnd && eventEnd > rangeStart
      return normalized.start < end && normalized.end > start
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}

function isDailyTransit(summary?: string): boolean {
  if (!summary) return false
  return summary.trim().toLowerCase().startsWith('daily transit')
}

function dedupeDailyTransitEvents(events: CalendarEvent[], timeZone: string): CalendarEvent[] {
  const seen = new Set<string>()
  const result: CalendarEvent[] = []

  for (const event of events) {
    if (!isDailyTransit(event.summary)) {
      result.push(event)
      continue
    }

    const normalized = normalizeEventRange(event, timeZone)
    const dayKey = startOfDay(normalized.start, timeZone).toISOString()
    if (seen.has(dayKey)) continue
    seen.add(dayKey)
    result.push(event)
  }

  return result
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
  const [timeZone, setTimeZone] = useState<string>(DEFAULT_TIME_ZONE)
  const [selectedDate, setSelectedDate] = useState<Date>(() => startOfDay(new Date(), DEFAULT_TIME_ZONE))
  const [timeZones] = useState<string[]>(() => {
    if (typeof Intl.supportedValuesOf === 'function') {
      return Intl.supportedValuesOf('timeZone')
    }
    return ['UTC', 'America/New_York', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney']
  })
  const prevTimeZoneRef = useRef<string>(DEFAULT_TIME_ZONE)
  const [activeSeries, setActiveSeries] = useState<string | null>(null)
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (typeof window === 'undefined') return THEMES.DARK
    return themeManager.getActualTheme()
  })
  const { toast, showToast } = useToast()
  const today = useMemo(() => startOfDay(new Date(), timeZone), [timeZone])

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

  const selectedYear = getZonedParts(selectedDate, timeZone).year.toString()
  const eventsKey = activeSeries ? `${activeSeries}-${selectedYear}` : ''
  const eventsForYear = eventsKey ? eventsByKey[eventsKey] : undefined

  useEffect(() => {
    themeManager.initialize()
    const handleThemeChange = (nextTheme: ThemeType) => {
      setTheme(nextTheme === THEMES.SYSTEM ? themeManager.getActualTheme() : nextTheme)
    }
    themeManager.addListener(handleThemeChange)
    return () => {
      themeManager.removeListener(handleThemeChange)
    }
  }, [])

  const isDarkMode = theme === THEMES.DARK

  useEffect(() => {
    setSelectedDate((prev) => {
      const prevTz = prevTimeZoneRef.current
      const parts = getZonedParts(prev, prevTz)
      const seed = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12, 0, 0))
      prevTimeZoneRef.current = timeZone
      return startOfDay(seed, timeZone)
    })
  }, [timeZone])

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
      const start = startOfDay(selectedDate, timeZone)
      return { start, end: addDays(start, 1) }
    }
    if (viewMode === 'week') {
      const start = startOfWeek(selectedDate, timeZone)
      return { start, end: addDays(start, 7) }
    }
    return { start: startOfMonth(selectedDate, timeZone), end: endOfMonth(selectedDate, timeZone) }
  }, [viewMode, selectedDate, timeZone])

  const rangeEvents = useMemo(() => {
    if (!eventsForYear) return []
    const overlapped = eventsInRange(eventsForYear, currentRange.start, currentRange.end, timeZone)
    return dedupeDailyTransitEvents(overlapped, timeZone)
  }, [eventsForYear, currentRange, timeZone])

  const handlePrev = () => {
    const next = new Date(selectedDate)
    if (viewMode === 'day') {
      next.setUTCDate(selectedDate.getUTCDate() - 1)
    } else if (viewMode === 'week') {
      next.setUTCDate(selectedDate.getUTCDate() - 7)
    } else {
      next.setUTCMonth(selectedDate.getUTCMonth() - 1)
    }
    setSelectedDate(startOfDay(next, timeZone))
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
    setSelectedDate(startOfDay(next, timeZone))
  }

  const handleToday = () => setSelectedDate(startOfDay(new Date(), timeZone))

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
    const [y, m, d] = value.split('-').map((v) => Number.parseInt(v, 10))
    if (!y || !m || !d) return
    const utc = Date.UTC(y, m - 1, d, 0, 0, 0, 0)
    const offset = getTimeZoneOffsetMs(new Date(utc), timeZone)
    const next = new Date(utc - offset)
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
                minute: '2-digit',
                timeZone
              })
              const startLabel = event.allDay ? 'All day' : timeFmt.format(event.start)
              const endLabel = event.allDay ? '' : ` · ${timeFmt.format(event.end)}`
              const parsed = event.description ? parseDescriptionToSymbology(event.description, { isDarkMode }) : null
              const displayDescription = parsed ? parsed.otherLines.join('\n') : event.description
              return (
                <div key={event.uid ?? `${event.start.toISOString()}-${event.summary}`} className="calendar-event">
                  <div className="calendar-event-title">{event.summary ?? 'Untitled event'}</div>
                  <div className="calendar-event-meta">{startLabel}{endLabel}</div>
                  {event.location && <div className="calendar-event-meta">{event.location}</div>}
                  {parsed && (parsed.positions.length > 0 || parsed.aspects.length > 0) && (
                    <div className="calendar-event-symbology" aria-label="Event symbology">
                      {parsed.positions.length > 0 && (
                        <div className="calendar-event-block">
                          <div className="calendar-event-block-title">Positions</div>
                          <ul className="calendar-positions-list">
                            {parsed.positions.map((pos, idx) => (
                              <li key={`${event.uid ?? event.summary}-pos-${idx}`} className="calendar-position-row table">
                                {pos.bodyIcon ? (
                                  <span className={pos.bodyIcon.invertInDark && isDarkMode ? 'calendar-glyph dark-invert' : 'calendar-glyph'}>
                                    <img src={pos.bodyIcon.src} alt={pos.bodyIcon.alt} loading="lazy" />
                                  </span>
                                ) : (
                                  <span className="calendar-glyph placeholder" aria-hidden="true" />
                                )}

                                {pos.elementIcon ? (
                                  <span className="calendar-glyph">
                                    <img src={pos.elementIcon.src} alt={pos.elementIcon.alt} loading="lazy" />
                                  </span>
                                ) : (
                                  <span className="calendar-glyph placeholder" aria-hidden="true" />
                                )}

                                {pos.modalityIcon ? (
                                  <span className="calendar-glyph">
                                    <img src={pos.modalityIcon.src} alt={pos.modalityIcon.alt} loading="lazy" />
                                  </span>
                                ) : (
                                  <span className="calendar-glyph placeholder" aria-hidden="true" />
                                )}

                                {pos.signIcon ? (
                                  <span className="calendar-glyph">
                                    <img src={pos.signIcon.src} alt={pos.signIcon.alt} loading="lazy" />
                                  </span>
                                ) : (
                                  <span className="calendar-glyph placeholder" aria-hidden="true" />
                                )}

                                {pos.decanIcon ? (
                                  <span className="calendar-glyph">
                                    <img src={pos.decanIcon.src} alt={pos.decanIcon.alt} loading="lazy" />
                                  </span>
                                ) : (
                                  <span className="calendar-glyph placeholder" aria-hidden="true" />
                                )}

                                {pos.classicSignIcon ? (
                                  <span className="calendar-glyph" title={pos.signLabel ?? ''}>
                                    <img src={pos.classicSignIcon.src} alt={pos.classicSignIcon.alt} loading="lazy" />
                                  </span>
                                ) : (
                                  <span className="calendar-glyph placeholder" aria-hidden="true" />
                                )}

                                <span className="calendar-position-stack">
                                  <span className="top-line">
                                    {pos.bodyLabel}
                                    {pos.retrograde && <span className="calendar-position-retro"> ℞</span>}
                                  </span>
                                  <span className="bottom-line">
                                    {pos.signLabel ?? ''} {pos.degreesText ?? ''}
                                  </span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {parsed.aspects.length > 0 && (
                        <div className="calendar-event-block">
                          <div className="calendar-event-block-title">Aspects</div>
                          <div className="calendar-aspect-legend" aria-label="Aspect legend">
                            {ASPECT_LEGEND.map((entry) => (
                              <span key={entry.key} className="calendar-aspect-legend-item">
                                <span className="calendar-aspect-icon" aria-label={entry.label}>
                                  <img src={entry.icon.src} alt={`${entry.label} icon`} loading="lazy" />
                                </span>
                                <span className="calendar-aspect-legend-label">{entry.label}</span>
                              </span>
                            ))}
                          </div>
                          <ul className="calendar-aspect-list">
                            {parsed.aspects.map((aspect, idx) => (
                              <li
                                key={`${event.uid ?? event.summary}-asp-${idx}`}
                                className="calendar-aspect-row"
                                aria-label={`Aspect: ${aspect.leftBody} ${aspect.aspectLabel} ${aspect.rightBody}${aspect.tone ? `, ${aspect.tone.label}` : ''}`}
                              >
                                {aspect.time && <span className="calendar-aspect-time">{aspect.time}</span>}
                                {aspect.leftIcon && (
                                  <span className={aspect.leftIcon.invertInDark && isDarkMode ? 'calendar-glyph dark-invert' : 'calendar-glyph'}>
                                    <img src={aspect.leftIcon.src} alt={aspect.leftIcon.alt} loading="lazy" />
                                  </span>
                                )}
                                <span className="calendar-aspect-body">{aspect.leftBody}</span>
                                {aspect.aspectIcon ? (
                                  <span className="calendar-aspect-icon" aria-label={aspect.aspectLabel}>
                                    <img src={aspect.aspectIcon.src} alt={aspect.aspectIcon.alt} loading="lazy" />
                                  </span>
                                ) : (
                                  <span className="calendar-aspect-label">{aspect.aspectLabel}</span>
                                )}
                                {aspect.rightIcon && (
                                  <span className={aspect.rightIcon.invertInDark && isDarkMode ? 'calendar-glyph dark-invert' : 'calendar-glyph'}>
                                    <img src={aspect.rightIcon.src} alt={aspect.rightIcon.alt} loading="lazy" />
                                  </span>
                                )}
                                <span className="calendar-aspect-body">{aspect.rightBody}</span>
                                {aspect.tone && (
                                  <span className={`calendar-tone-badge ${aspect.tone.tone}`}>{aspect.tone.label}</span>
                                )}
                                {aspect.note && <span className="calendar-aspect-note">{aspect.note}</span>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                    {parsed && (parsed.positions.length > 0 || parsed.aspects.length > 0) &&
                      displayDescription &&
                      displayDescription.trim().length > 0 && <div className="calendar-event-divider" role="separator" />}
                    {displayDescription && displayDescription.trim().length > 0 && (
                      <p className="calendar-event-desc">{displayDescription}</p>
                    )}
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
          const dayStart = startOfDay(day, timeZone)
          const overlapped = eventsInRange(eventsForYear ?? [], dayStart, addDays(dayStart, 1), timeZone)
          const dayEvents = dedupeDailyTransitEvents(overlapped, timeZone)
          return (
            <div key={day.toISOString()} className="calendar-day-card">
              <div className="calendar-day-card-header">
                <span className="calendar-day-label">
                  {new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric', timeZone }).format(day)}
                </span>
                <span className="calendar-day-count">{dayEvents.length} event{dayEvents.length === 1 ? '' : 's'}</span>
              </div>
              {dayEvents.length === 0 ? (
                <p className="calendar-empty subtle">No events</p>
              ) : (
                <ul className="calendar-day-events">
                  {dayEvents.map((event) => {
                    const timeFmt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', timeZone })
                    const label = event.allDay ? 'All day' : `${timeFmt.format(event.start)} – ${timeFmt.format(event.end)}`
                    const parsed = event.description ? parseDescriptionToSymbology(event.description, { isDarkMode }) : null
                    return (
                      <li key={event.uid ?? `${event.start.toISOString()}-${event.summary}`}>
                        <span className="calendar-event-title">{event.summary ?? 'Untitled event'}</span>
                        <span className="calendar-event-meta">{label}</span>
                        {parsed && parsed.aspects.length > 0 && (
                          <div className="calendar-aspect-inline" aria-label="Aspects">
                            {parsed.aspects.slice(0, 1).map((aspect, idx) => (
                              <div key={`${event.uid ?? event.summary}-asp-inline-${idx}`} className="calendar-aspect-row inline">
                                {aspect.time && <span className="calendar-aspect-time">{aspect.time}</span>}
                                {aspect.leftIcon && (
                                  <span className={aspect.leftIcon.invertInDark && isDarkMode ? 'calendar-glyph dark-invert' : 'calendar-glyph'}>
                                    <img src={aspect.leftIcon.src} alt={aspect.leftIcon.alt} loading="lazy" />
                                  </span>
                                )}
                                <span className="calendar-aspect-body">{aspect.leftBody}</span>
                                {aspect.aspectIcon ? (
                                  <span className="calendar-aspect-icon" aria-label={aspect.aspectLabel}>
                                    <img src={aspect.aspectIcon.src} alt={aspect.aspectIcon.alt} loading="lazy" />
                                  </span>
                                ) : (
                                  <span className="calendar-aspect-label">{aspect.aspectLabel}</span>
                                )}
                                {aspect.rightIcon && (
                                  <span className={aspect.rightIcon.invertInDark && isDarkMode ? 'calendar-glyph dark-invert' : 'calendar-glyph'}>
                                    <img src={aspect.rightIcon.src} alt={aspect.rightIcon.alt} loading="lazy" />
                                  </span>
                                )}
                                <span className="calendar-aspect-body">{aspect.rightBody}</span>
                                {aspect.tone && <span className={`calendar-tone-badge ${aspect.tone.tone}`}>{aspect.tone.label}</span>}
                              </div>
                            ))}
                          </div>
                        )}
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
    const start = startOfMonth(selectedDate, timeZone)
    const end = endOfWeek(endOfMonth(selectedDate, timeZone), timeZone)
    const firstWeekStart = startOfWeek(start, timeZone)
    const cells: Date[] = []
    let cursor = firstWeekStart
    while (cursor <= end) {
      cells.push(new Date(cursor))
      const next = new Date(cursor)
      next.setUTCDate(cursor.getUTCDate() + 1)
      cursor = next
    }

    return (
      <div className="calendar-month-section">
        <div className="calendar-month-headers" aria-hidden="true">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="calendar-month-header">
              {label}
            </div>
          ))}
        </div>
        <div className="calendar-month-grid">
          {cells.map((day) => {
            const dayEvents = eventsInRange(eventsForYear ?? [], startOfDay(day, timeZone), endOfDay(day, timeZone), timeZone).filter(
              (event) => !isDailyTransit(event.summary)
            )
            const inMonth = sameMonthYear(day, selectedDate, timeZone)
            const isToday = startOfDay(day, timeZone).getTime() === today.getTime()
            return (
              <button
                key={day.toISOString()}
                type="button"
                className={`calendar-month-cell ${inMonth ? '' : 'muted'} ${isToday ? 'today' : ''}`}
                onClick={() => {
                  setSelectedDate(startOfDay(day, timeZone))
                  setViewMode('day')
                }}
                aria-label={`View ${day.toUTCString()}`}
              >
                <div className="calendar-month-cell-header">
                  <span className="calendar-day-number">{day.getUTCDate()}</span>
                  {dayEvents.length > 0 && <span className="calendar-pill small">{dayEvents.length}</span>}
                </div>
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.uid ?? `${event.start.toISOString()}-${event.summary}`}
                    className="calendar-event-chip"
                  >
                    {event.summary ?? 'Untitled event'}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="calendar-event-meta more">+{dayEvents.length - 2} more</div>
                )}
              </button>
            )
          })}
        </div>
      </div>
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
                    {formatRangeLabel(viewMode, selectedDate, timeZone)}
                  </span>
                  <label className="timezone-select">
                    <span className="sr-only">Select time zone</span>
                    <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
                      {timeZones.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="calendar-date-picker">
                    <span className="sr-only">Jump to date</span>
                    <input
                      type="date"
                      value={toDateInputValue(selectedDate, timeZone)}
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
