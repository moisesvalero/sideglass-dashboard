# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Spanish version:** [CHANGELOG.es.md](./CHANGELOG.es.md) — keep both files in sync when you add a release.

## [0.2.6] - 2026-06-01

### Added

- **CPU/GPU temperature**: an "Enable temperatures" button in the hardware monitor that starts the sensor service on demand (accept the Windows prompt). Broader sensor parsing (more names, range up to 150 °C)
- **Professional updates**: a "New version available" prompt with release notes, **Install now** / **Not now** buttons, a real progress bar during download, and a **Restart** button when finished
- **City search** in weather: live suggestions as you type (autocomplete with country and region)

### Changed

- The update checker no longer installs instantly: the user now decides when to install

### Added

- Fullscreen toggle with **F11** when the dashboard window is focused

### Changed

- Title bar follows Windows layout: app icon and name on the left, controls on the right

## [0.2.4] - 2026-06-01

### Added

- Integrated YouTube search in the panel (no more pasting links)
- Help button in the title bar that opens the web FAQ
- About section in Settings with app version and source link
- Manual city entry for weather (type any location)
- Detailed step-by-step guide for the Google Calendar secret iCal address on the website

### Changed

- Daily quotes now use a curated local list (fixes spelling, no external API)
- Spanish UI spelling fixes (accents and ñ)

### Fixed

- CPU temperature now reads correctly (sensor service launches elevated)
- "Check for updates" no longer hangs forever (request timeout)

## [0.2.3] - 2026-06-01

### Added

- **Check for updates** button in Settings

### Changed

- Windows-style title bar (controls on the right)
- YouTube plays inside the widget only (no separate window)
- App opens maximized by default

### Fixed

- Confusing “no sensor” CPU/GPU messages; more reliable LHM startup
- README updated with real screenshots

## [0.2.2] - 2026-06-01

### Added

- Light/dark OpenAI icons in the AI dock
- Updated landing screenshots (portrait and landscape)

### Changed

- Unified branding as **Sideglass**
- AI dock in a bottom layout row (no longer overlapping widgets)
- Screenshot script: viewport-only, compact demo on portrait

### Fixed

- Dock overlapping Notes and other widgets when scrolling
- CI/release: Tauri resource glob `bin/*` for bundled LibreHardwareMonitor
- ChatGPT icon invisible in dark mode
- FAQ copy without long em-dash phrasing

## [0.2.0] - 2026-06-01

### Added

- Premium macOS-style UI (glass materials, semantic light/dark themes)
- Responsive layout for vertical and horizontal monitors
- Google Calendar via iCal URL (no Apps Script)
- YouTube embedded in the dashboard (paste a link)
- AI dock with official brand icons (ChatGPT, Gemini, Claude, Perplexity, Copilot)
- Open-Meteo weather (no API key) with optional auto-location
- Real hardware temperatures via LibreHardwareMonitor (WMI)
- Widget reordering by drag and drop
- Autostart with Windows, global hotkey, calendar notifications
- Spanish/English UI and 12/24h time format
- Landing page with FAQ, install guide, and changelog

### Changed

- Window opens larger, maximizable, remembers size/position
- Notes stay local with premium styling

### Fixed

- Light mode text visibility (semantic color tokens)
- Removed fake CPU temperature fallback when no sensor is available

## [0.1.0] - 2025-05-31

### Added

- Initial Tauri + Next.js dashboard
- Hardware monitor (CPU/RAM/GPU), weather, calendar, AI dock, notes, YouTube embed
