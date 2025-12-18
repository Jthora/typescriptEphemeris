# Calendar Downloads: UX and Copy Notes

## Tone and clarity
- Be explicit: users are downloading live `.ics` files from GitHub and may cache them locally for offline use.
- Avoid jargon like "tree API" in user-facing text; keep that in tooltips/dev docs.
- Prefer short action labels: "Cache locally", "Download", "Refresh cache", "Remove".
- Show friendly titles (e.g., "Space Force 2025 Calendar") with the raw path as secondary text for traceability.

## States to cover
- **Index loading**: show a brief message (e.g., "Refreshing…").
- **Cached**: badge plus timestamp in a subtle meta row.
- **Busy per item**: disable only the active card’s buttons during cache/refresh.
- **Errors**: concise banner near the header; do not hide cards.
- **Empty**: friendly prompt to refresh index.
- **Download in progress**: optional toast/spinner while fetch→blob runs; keep buttons disabled only for that card.

## Messaging patterns
- Header description: "Fetch live .ics files from GitHub and keep them cached locally for offline calendar use."
- Error: "Unable to load index. Check your connection or try again in a minute."
- Storage warning: "Local storage is unavailable; caching is disabled."
- Download success: "Saved calendar file." Keep it short; no need to mention GitHub.
- Download failure: "Download failed. Check your connection and try again." Offer retry.

## Accessibility
- All actionable icons must have visible text or `sr-only` text.
- Keep focus order consistent; avoid focus traps during loading.
- Maintain contrast: pills and buttons should meet contrast against the dark background.

## Mobile
- Ensure grid cards stack to single column; padding remains touch-friendly (≥44px hit targets where possible).
- Keep header actions in a wrap-friendly flex row.

## Future copy hooks
- Add a short explainer for bulk caching if introduced.
- Add a note if a static manifest fallback is ever used to mitigate GitHub rate limits.
