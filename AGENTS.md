# OpenCode / Codex Instructions

## Project: iOS Dashboard (Tauri Desktop App)

### Quick Context
Premium iOS/visionOS-style dashboard for Windows. Next.js frontend + Tauri/Rust backend.
Features: glassmorphism UI, real-time hardware monitoring, AI dock with 5 assistants.

### Key Files to Know
- `app/page.tsx` - Main dashboard layout
- `components/dashboard/` - All widget components
- `lib/tauri.ts` - Tauri API integration
- `src-tauri/src/main.rs` - Rust backend (system monitoring)
- `app/globals.css` - All styles and design tokens

### Important Notes
1. **Tailwind v4** - Config is in `globals.css` NOT tailwind.config.ts
2. **Tauri detection** - Use `isTauri()` from `lib/tauri.ts` before Tauri APIs
3. **Hydration** - Time components need `mounted` state to avoid SSR mismatch
4. **shadcn/ui** - Components are in `components/ui/`, use directly

### Adding Features
- New widget? Create in `components/dashboard/`, use `.glass-card` class
- New Tauri command? Add to `main.rs`, register handler, add TS types in `lib/tauri.ts`
- New styles? Add to `globals.css`, prefer semantic tokens

### Build Commands
```bash
pnpm dev          # Web preview
pnpm tauri:dev    # Desktop dev
pnpm tauri:build  # Build .exe
```

### Current TODO
- Weather API integration
- Editable calendar events  
- System tray support
- Settings panel
- More widgets (music, notes)
- Window drag region
- Persist preferences
