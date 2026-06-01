# Desk Dashboard — Agent Instructions

## Project

Premium macOS-style dashboard for Windows (secondary monitor). Next.js static export + Tauri v2 + Rust.

## Key paths

- `app/page.tsx` — Landing (web)
- `app/dashboard/page.tsx` — Dashboard layout + widget order (dnd-kit, Tauri)
- `app/globals.css` — Tailwind v4 theme + glass materials
- `components/dashboard/` — Widgets
- `lib/settings.tsx` — User preferences (localStorage)
- `lib/tauri.ts` — Tauri invoke wrappers
- `src-tauri/src/main.rs` — System info, iCal fetch, YouTube window, LHM/WMI, updater

## Commands

```bash
npm run dev          # Web preview
npm run tauri:dev    # Desktop app
npm run tauri:build  # Windows installer
npm run lint && npm run typecheck && npm run build
```

## Integrations

- **Weather**: Open-Meteo (no API key)
- **Calendar**: Google Calendar iCal URL in settings
- **YouTube**: `open_youtube_window` Tauri command
- **Temps**: LibreHardwareMonitor via WMI (`src-tauri/bin/` optional)
- **Updates**: `tauri-plugin-updater` + `docs/UPDATER.md`

## Conventions

- Use semantic tokens (`text-foreground`, `bg-muted`) — never hardcode `text-white` in widgets
- Call `isTauri()` before Tauri APIs
- Hydration: time widgets need `mounted` state
