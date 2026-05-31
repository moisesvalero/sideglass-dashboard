# iOS Dashboard - Tauri App

## Project Overview
Premium iOS/visionOS-style vertical dashboard built with Next.js + Tauri for Windows desktop. Features glassmorphism UI, real-time hardware monitoring, and AI assistant dock.

## Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Desktop**: Tauri v2 (Rust backend)
- **UI**: shadcn/ui components, custom glassmorphism design system
- **Hardware Monitoring**: sysinfo (Rust), nvml-wrapper (NVIDIA GPU)

## Project Structure
```
├── app/
│   ├── globals.css          # Tailwind + glassmorphism styles
│   ├── layout.tsx           # Root layout with Geist font
│   └── page.tsx             # Main dashboard page
├── components/
│   └── dashboard/
│       ├── ai-dock.tsx      # Floating AI assistant dock (ChatGPT, Gemini, Claude, Perplexity, Copilot)
│       ├── calendar-widget.tsx
│       ├── hardware-monitor.tsx  # CPU/RAM/GPU monitoring (Tauri integration)
│       ├── motivation-widget.tsx
│       └── time-weather-widget.tsx
├── lib/
│   ├── tauri.ts             # Tauri API types and invoke wrapper
│   └── utils.ts             # Utility functions (cn)
├── src-tauri/
│   ├── Cargo.toml           # Rust dependencies
│   ├── tauri.conf.json      # Tauri window/app config
│   └── src/
│       └── main.rs          # Rust backend - system info commands
└── TAURI_SETUP.md           # Installation instructions
```

## Key Features

### 1. Glassmorphism Design System
- Dark gradient background (deep blue/purple/black)
- `.glass-card` class with backdrop-blur and translucent borders
- `.dock-glass` for floating dock effect
- Smooth 24px border-radius throughout

### 2. Hardware Monitor (Real-time)
- **Web mode**: Shows demo data with "Demo" indicator
- **Tauri mode**: Real CPU, RAM, GPU data via Rust backend
- Uses `@tauri-apps/api/core` invoke() to call Rust commands
- Auto-detects environment via `window.__TAURI__`

### 3. AI Dock
- 5 AI assistants: ChatGPT, Gemini, Claude, Perplexity, Copilot
- Custom SVG icons matching brand colors
- Hover effects: scale, glow, tooltip
- Opens respective websites on click

### 4. Tauri Integration
Rust commands in `src-tauri/src/main.rs`:
- `get_system_info()` - Returns SystemInfo struct with CPU/RAM/GPU data
- Uses `sysinfo` crate for CPU/RAM
- Uses `nvml-wrapper` for NVIDIA GPU (with fallback)

## Design Tokens (globals.css)
```css
--background: oklch(0.08 0.02 260)      /* Deep dark blue */
--foreground: oklch(0.98 0 0)           /* White */
--primary: oklch(0.7 0.15 250)          /* Accent blue */
--card: oklch(0.12 0.02 260)            /* Card background */
```

## Development Commands
```bash
pnpm dev          # Next.js dev server (web preview)
pnpm tauri:dev    # Tauri dev mode (desktop app)
pnpm tauri:build  # Build .exe installer
```

## TODO / Next Steps
- [ ] Add weather API integration
- [ ] Make calendar events editable
- [ ] Add system tray support
- [ ] Add settings panel for customization
- [ ] Add more widgets (music player, notes, etc.)
- [ ] Add window drag region for frameless window
- [ ] Persist user preferences with Tauri store plugin

## Notes for AI Agents
- The project uses Tailwind CSS v4 (no tailwind.config.ts)
- All Tailwind theme config is in `app/globals.css` under `@theme inline`
- Hardware monitor auto-detects Tauri vs web environment
- Rust backend handles all system-level operations
- shadcn/ui components are in `components/ui/`
