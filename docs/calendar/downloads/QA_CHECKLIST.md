# Calendar Downloads: QA Checklist

Use this list to validate the calendar downloads and in-app calendar flows. Run on both desktop and mobile widths.

## Environment prep
- Ensure the repo `jthora/planetaryAspectEventsCalendar` is public and reachable from the test network.
- Clear `localStorage` for the app origin before each full pass to validate first-run behavior.

## Index + listing
- [ ] Hitting "Refresh index" fetches the tree and populates cards; loading state shows, then clears.
- [ ] Index errors (e.g., force network offline) surface a visible error banner; retry works once network returns.
- [ ] Paths are sorted alphabetically; only `.ics` files under `calendars/` appear (legacy/junk files stay hidden).

## Caching flow
- [ ] Clicking "Cache locally" downloads the file, sets a cached badge, and shows a cached timestamp.
- [ ] Per-item busy state prevents double clicks while a download is in flight.
- [ ] Storage failures (simulate quota or private mode) show a warning and do not break other cards.
- [ ] Refresh cache replaces the cached copy and updates the cached timestamp.

## Downloading
- [ ] Download button triggers a file save via fetch→blob without opening GitHub; filename matches the `.ics` path.
- [ ] Download while uncached succeeds online and optionally caches when designed to do so.
- [ ] "Download from cache" works offline (disable network) and saves a valid `.ics` file.
- [ ] Cached downloads use the cached content, not the network.
- [ ] Success/failure toasts (if enabled) show and clear appropriately.

## Removal
- [ ] "Remove" deletes the cached entry, badge disappears, and localStorage no longer contains the key.
- [ ] Removing one item does not disturb other cached items.

## Calendar view (cached consumer)
- [ ] Cached items appear with readable names (X-WR-CALNAME) or fallback path/humanized title.
- [ ] Refresh-from-GitHub button appears when the item exists in the current index; handles errors gracefully.
- [ ] Bulk "cache missing" (if present) only processes items absent from cache; shows busy state while running.
- [ ] Sample metadata (description, first SUMMARY) is shown when available.

## Offline / recovery
- [ ] With network disabled: index refresh should fail visibly; cached downloads still work.
- [ ] After re-enabling network: refresh index and refresh cache succeed.

## Accessibility + UX
- [ ] All action buttons are keyboard focusable with visible focus rings.
- [ ] Icons have accessible labels via button text or sr-only spans.
- [ ] Status text uses sufficient contrast against the background.
- [ ] Loading states do not trap focus; page remains scrollable.

## Performance
- [ ] Initial index fetch completes quickly (<2–3s on standard broadband).
- [ ] Caching multiple files in sequence does not freeze the UI; busy state updates per item.

## Regression watch
- [ ] TopBar navigation still works for Chart/Tutorial/About/Calendar/Downloads.
- [ ] No TypeScript errors: `npm run type-check` passes.
- [ ] No unexpected increases in bundle size (ics logic stays client-only, no assets bundled).
