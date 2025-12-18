# Calendar Page — UX Flow & Layout

## Entry & global controls
- **Top bar:** Nav to Home, Tutorial, About, Calendar, Calendar Downloads.
- **Series picker:** Segmented control for Standard / Business / Space Force; shows active state; label the control.
- **View picker:** Segmented control for Day / Week / Month; `aria-pressed` and focus-visible states.
- **Date nav:** Prev / Today / Next buttons plus a range label; add a date input or mini month picker for jump-to-date.
- **Status chips:** Show active series + year; show loading indicators for index/year fetch; show when data is empty.
- **Download action:** If the current series/year ICS is cached, show “Download .ics” (from cache). Else prompt to cache.

## Month view (overview)
- **Headers:** Mon–Sun labels across the grid.
- **Cells:** Show leading/trailing days to complete weeks; muted style for out-of-month days.
- **Indicators:** Today highlight; event dots or count pill; up to 3 event chips; “+N more” for overflow.
- **Interaction:** Click a day to switch to Day view on that date; keyboard arrows move days; PageUp/PageDown could move months (optional).
- **Empty state:** If no events for the month but series/year is present, show quiet “No events this month.” If ICS missing, show “No data for this series/year.”

## Week view (planning)
- **All-day lane:** Events with all-day flag appear here.
- **Time grid:** Hours as rows (e.g., 00–23). Events placed by start/end; overlap stacks vertically with slight offset.
- **Day columns:** One column per day (Mon–Sun). Today highlighted. Show day label and date in header.
- **Fallback mobile:** If width is tight, degrade to a vertical list of days with their events (no horizontal scroll).
- **Empty state:** Per-day “No events” row; overall message if week empty.

## Day view (detail)
- **Timeline:** Hours as rows; show all-day events at top; timed events as blocks spanning start–end.
- **Metadata:** Summary, times, location, description snippet. Truncate long text with tooltip/expand.
- **Nav:** Prev/Next day buttons near the view; Today button; keyboard arrows move by a day.
- **Empty state:** “No events for this day.”

## Responsive behavior
- Wrap toolbar groups; avoid horizontal scroll.
- In month view, collapse to fewer columns on small screens (e.g., 2–3 columns) with vertical scroll.
- In week/day fallback, use lists instead of horizontal grids.
- Ensure tap targets are at least 40px tall; maintain spacing between chips and controls.

## Accessibility
- `aria-pressed` on toggles; `role="group"` with labels for segmented controls.
- Announce range label updates (live region polite) when navigation changes date.
- Focus order: series → view → date nav → calendar grid.
- High contrast for today/selected states; ensure pill colors meet contrast.

## Feedback & loading
- Show inline skeletons or spinners in the view while year data loads.
- Toasts for cache/download success/failure; inline errors for index/year fetch issues.
- If ICS missing for selected series/year, show a clear message with suggestions (try another year/series).

## Interaction summary
- Month: click day → Day view; Next/Prev → month jump; Today → current month/day.
- Week: scroll vertically if needed; Next/Prev → week jump; click day label to open Day view.
- Day: Next/Prev → day jump; expand/collapse long descriptions; link locations if URLs present.
