# Calendar Page — Data & Cache Model

## Data sources
- Primary: ICS files from `jthora/planetaryAspectEventsCalendar` under `calendars/`.
- Access: tree API or manifest (`/calendar-manifest.json`) then raw URLs; cache in localStorage.

## Series and year resolution
- Supported series: Standard Astrology, Business Astrology, Space Force Astrology.
- Year is derived from filename (e.g., `standard-astrology-2025.ics`).
- Active key = `${series}-${year}`; used to load/cache events.
- If no matching ICS for series/year, record an empty array and show an empty-state message.

## ICS ingestion pipeline
1) Fetch manifest/tree index → list of ICS entries.
2) For selected series + year: locate matching entry.
3) Load from cache if present; otherwise fetch raw, store in cache, then parse.
4) Parse ICS into events (VEVENT): DTSTART, DTEND, SUMMARY, DESCRIPTION, LOCATION, UID, all-day detection.
5) Sort events by start; store as `eventsByKey[key]`.

## Parsing notes
- Unfold lines before parsing.
- Date handling: support DATE and DATE-TIME (basic UTC/Z handling). If DTEND missing, default to DTSTART (or +1h if needed later).
- All-day detection: VALUE=DATE or zeroed time.
- Not handled yet: RRULE/recurrence, TZID time zone conversion, alarms. Consider future enhancement.

## Caching strategy
- Storage: localStorage keyed by ICS path (content + downloadedAt + metadata).
- In-memory: `eventsByKey` keyed by series-year; persists for session only.
- Refresh: re-fetch ICS for the current series-year without wiping other years; if fetch fails, keep old cache if present.
- Eviction: none yet; consider LRU or yearly clear if size grows.

## Missing/empty handling
- If no ICS for series/year: set `eventsByKey[key] = []` and show “No data for this series/year.”
- If ICS exists but has zero events: show “No events for this period.”
- On parse errors: log, show inline error, keep view usable.

## Performance considerations
- Parse once per series-year per session; reuse in-memory events.
- Avoid re-fetch unless user triggers refresh or year/series changes.
- Defer heavy recurrence/timezone support unless needed; consider web worker if ICS size grows.

## Download behavior
- If cached: trigger download from cached blob (no navigation to raw).
- If not cached yet: optional fetch-and-cache then download; keep consistent with Downloads page behavior.
