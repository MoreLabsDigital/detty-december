# DETTY DECEMBER — Interactive Event Discovery

A creative Next.js + TypeScript demo that transforms December 2026 into an illustrated 31-day event-discovery board. Designed as a functional foundation, **not a live event-ticketing service**.

## Quick start

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production compile, run `npm run build` and `npm start`.

## Features

- Original illustrated hero and 31-day winding board with clickable date tiles
- GSAP entrance and scroll effects, with reduced-motion fallback
- Animated day-details drawer and event cards using Motion for React
- Accessible button-based date navigation, previous/next, and date-list alternative
- Browse events, live text search, category/area/price filters and sorting
- Dedicated event detail URLs with metadata, sharing, bookmarking and adding to plans
- Guest bookmarks and itinerary saved in browser localStorage (without sign-in)
- Itinerary list/calendar views, double-booking warnings and downloadable ICS file
- Mobile responsive layouts and working empty states
- Zod event model, typed data, and separate presentation, persistence and query logic

## Critical demo limitations

All 14 listed events are **fictional demonstration events**. No event listing, venue, ticket availability or ticket link has been verified. The demo contains no purchasing flow, payment processing, or booking system. Unknown prices are labelled unconfirmed rather than free. `/admin` is deliberately a non-editable future-integration placeholder rather than an insecure public admin panel. No private itinerary-sharing backend has been implemented. Calendar export is local to the user.

## Architecture

- `app/`: home, explore, plans, event detail, admin placeholder, metadata, responsive CSS
- `components/`: board, hero, filters, event cards, plan persistence provider, shared navigation
- `lib/events.ts`: validated data schema, demonstration listings and filtering
- `lib/plans.ts`: localStorage, overlap detection and .ics calendar export

To connect real events, replace the demo array in `lib/events.ts` with a server-side verified feed that validates records against `eventSchema`. Before launching publicly, add Supabase authentication and row-level security, secure verified administration, image uploads, event submissions, content moderation, real venues and actual ticket links. Add end-to-end and accessibility audits against real browsers.

## Design notes

Colors: ink `#101010`, cream `#FFF0DB`, pink `#F36DBB`, teal `#11B8C4`, yellow `#FFD84D`, cobalt `#4355E8`. Fonts use Google-hosted Space Grotesk and DM Sans, with local fallbacks. Illustration is original SVG/CSS; no external event artwork is required. Fonts require connectivity for best fidelity.
