# Calendar Page — Implementation Plan

## Milestones
1) **Index & selection foundation**
   - Load ICS index (manifest fallback → tree API).
   - Build series picker (Standard/Business/Space Force) and auto-select preferred series if none chosen.
   - Derive year from selected date; compute key `${series}-${year}`.

2) **Data loading per series-year**
   - Locate ICS entry for series/year; if missing, set empty events and surface empty-state copy.
   - If cached, parse immediately; if not cached, fetch → cache → parse.
   - Store parsed events in `eventsByKey[key]` sorted by start.
   - Add “refresh current year” action that re-fetches just this key.

3) **Views**
   - **Month:** weekday headers (Mon–Sun), today highlight, leading/trailing days, event dots/count pill, click-to-day.
   - **Week:** time grid with all-day lane, overlap stacking, mobile fallback list.
   - **Day:** timeline with all-day strip; prev/next day controls in-view.
   - Add loading placeholders per view while year loads.

4) **Navigation & jump**
   - Prev/Next/Today buttons adjust date respecting current view (day/week/month deltas).
   - Add date picker or mini month picker to jump to a date.
   - Keep range label updated and announced for accessibility.

5) **Empty/error states**
   - Missing ICS for series/year → “No data for this series/year.”
   - ICS present but no events in range → “No events for this period.”
   - Fetch/parse errors → inline error banner, keep UI navigable.

6) **Download/cache UX**
   - If current series-year ICS cached → show “Download .ics” from cache.
   - Offer “Cache year” if not cached; keep behavior aligned with Downloads page.

7) **Accessibility & responsiveness**
   - `aria-pressed` on toggles; labeled groups for series/view controls.
   - Keyboard: arrows for day/week navigation; PageUp/PageDown for month (optional); Enter on day cell → day view.
   - Responsive: wrap toolbars, collapse month grid columns on mobile, week fallback to list.

## Components & state (suggested)
- `CalendarPage` (container): holds selectedDate, viewMode, activeSeries, eventsByKey, cache, index.
- `useCalendarData(series, year)`: encapsulate fetch/cache/parse logic and returns events + loading/error.
- `MonthView`, `WeekView`, `DayView`: pure renderers receiving events + selection callbacks.
- `CalendarNav`: prev/next/today/date-picker and range label.

## Testing checklist
- Series switch changes data and empties when ICS missing.
- Year change (e.g., Dec → Jan) loads next year ICS when needed.
- Month view shows today highlight, leading/trailing days, and click-to-day works.
- Week time grid handles overlapping events; mobile fallback list renders.
- Day view shows all-day vs timed blocks; prev/next day updates correctly.
- Download uses cache; refresh only re-fetches current series-year.
- Empty/errored states render without crashes; keyboard navigation works.

## Future enhancements (optional)
- Recurrence (RRULE) expansion; timezone-aware parsing (TZID); alarm surface.
- Web worker parsing for large ICS files.
- Color-coding by event type/aspect; filters by category.
- Persist last selected series/view/date in storage.
