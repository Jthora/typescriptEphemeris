# Calendar Page — Product Overview

## Purpose
- Deliver an in-app calendar (Day/Week/Month) for Space Force, Business, and Standard astrology series, powered by ICS files.
- Provide offline-friendly caching by year/series while keeping data live when available.
- Offer fast navigation, clear empty states, and responsive layouts for mobile and desktop.

## Primary user goals
1) Quickly see what is happening today/this week/this month (events, counts, timing).
2) Jump between dates with minimal friction (Today, prev/next, date-picker).
3) Switch calendar series and know which data is current for that year.
4) Download/cache the ICS they are viewing for offline reliability.
5) Understand when no data is available (missing ICS) without confusion.

## Scope and non-goals
- In scope: read-only viewing of ICS events; caching; day/week/month layouts; series selection; year-aware loading.
- Out of scope (for now): editing events; creating custom reminders; importing external ICS beyond the provided repo; recurrence expansion beyond what is in the ICS (unless added later).

## Core principles
- **Clarity first:** Always show which series/year is active and whether data is loaded.
- **Fast navigation:** Today, prev/next, date jump; drill-down from month → day.
- **Graceful fallback:** Empty states when ICS missing for the year/series; never block the UI.
- **Mobile-ready:** Single-column or compact modes with wrapping controls.
- **Trust the data:** Reflect the raw ICS; avoid silent mutations. If parsing fails, surface a light error and show empty.

## Key entities
- **Series:** Standard Astrology, Business Astrology, Space Force Astrology.
- **Year:** Derived from ICS file naming; drives which file to load and cache.
- **View mode:** Day, Week, Month.
- **Event:** Parsed ICS VEVENT with start/end, summary, description, location, all-day flag, UID.
- **Cache entry:** Stored ICS content keyed by path; reused to avoid re-fetch.

## Success metrics (qualitative)
- Users can find today’s events in <3 clicks.
- Switching series/year clearly communicates presence/absence of data.
- Mobile users can read and scroll day/week/month without horizontal overflow.
- Downloading/caching feels obvious and safe (no accidental navigation off-site).

## Risks / watch items
- ICS parsing limitations (time zones, recurrences) could cause missing events; need visible guardrails.
- GitHub/raw availability and rate limits; manifest fallback should be used when possible.
- Large ICS files could slow parsing; consider incremental or worker-based parsing if needed later.

## References
- Data source: https://github.com/jthora/planetaryAspectEventsCalendar
- Related docs: UX flow, data & cache, implementation plan.
