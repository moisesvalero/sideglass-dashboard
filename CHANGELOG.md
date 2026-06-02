# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Spanish version:** [CHANGELOG.es.md](./CHANGELOG.es.md) — keep both files in sync when you add a release.

## [0.2.24] - 2026-06-02

### Changed

- **Starts on the right monitor**: Sideglass now saves position, size, maximized state and the monitor in use, then retries restoring the window on the secondary monitor when Windows finishes detecting it at login
- **Clearer clickable state**: external shortcuts for Weather, Agenda and YouTube now show the hand cursor plus visible hover/focus feedback so they read as detail links

### Fixed

- **More robust window restore**: saved positions are validated against currently available monitors and safely clamped if Windows changed the display setup
- **Complete window state**: Tauri now saves window size as well as position and maximized state

## [0.2.23] - 2026-06-02

### Changed

- **Responsive default layout**: first run and `Reset layout` now use different compositions for portrait and landscape monitors, avoiding flattened cards
- **Clock and weather no longer overlap**: the clock reserves real space for the weather panel, so the temperature no longer covers the time in large cards
- **Detail shortcuts**: clicking weather opens a detailed weather view, Agenda opens Google Calendar, and the YouTube title opens YouTube

### Fixed

- **Weather auto-location**: Sideglass no longer falls back to Madrid as a fake location when geolocation is unavailable or too imprecise
- **Manual city picker**: selecting an autocomplete suggestion now fills the input with the full selected city
- **Dashboard visual tests**: e2e coverage now checks real geometry to prevent overlaps, clipped clock text, and flattened widgets in portrait/landscape layouts

## [0.2.22] - 2026-06-02

### Added

- **Useful disk metric**: hardware status now includes real primary disk usage from Tauri, shown as percent plus used/total GB

### Changed

- **No page scroll dashboard**: the dashboard grid now fits the available window height and compresses widget rows instead of creating vertical page scroll
- **Daily quote quality pass**: replaced the large imported quote dump with a short curated bilingual set from well-known classic authors
- **Daily quote typography**: the quote text now uses Architects Daughter for a cleaner handwritten look
- **Satoshi app typography**: replaced Inter with locally bundled Satoshi as the main app font
- **Weather scaling**: the weather icon and temperature scale more aggressively with large clock cards

### Fixed

- **YouTube controls**: the close button no longer collides with the widget drag handle in edit mode
- **Weather unit rendering**: Celsius/Fahrenheit suffixes render as `°C` and `°F` instead of broken characters

## [0.2.21] - 2026-06-02

### Added

- **Offline daily quotes**: the daily quote widget uses a local bilingual dataset with English and Spanish text, selected according to the app language

### Changed

- **Apple-like typography on Windows**: dashboard typography uses a real bundled font, with Windows-native fallbacks only
- **Responsive quote and notes cards**: daily quote content scales/scrolls inside small cards, and the notes `+` button no longer overlaps the drag handle in edit mode

## [0.2.20] - 2026-06-01

### Changed

- **Responsive widget contents**: clock/weather, agenda, and YouTube now adapt to the actual card size instead of leaving empty space or overflowing when resized
- **Compact YouTube widget**: reduced default height and improved the embedded player/search area so it fits better at the bottom of vertical layouts
- **Agenda layout**: reset layout now gives the calendar a full-width card and always shows the next 4 events at most

### Fixed

- **Reset layout overflow**: agenda events no longer spill outside their card or overlap the YouTube widget after restoring the default layout

## [0.2.19] - 2026-06-01

### Fixed

- **Displayed version synchronized**: Settings and landing now show `0.2.19` instead of being stuck at `0.2.15`
- **Complete installable release**: installer/updater now includes the changes that landed on `main` after `0.2.18`, including the landing video and handwritten daily quote
- **Updater delivery**: new version number forces a clean update path so older installs do not keep stale artifacts

## [0.2.18] - 2026-06-01

### Added

- **Resizable dashboard widgets**: edit mode lets users drag widgets and resize each card from the corner, with the custom layout saved locally
- **Fresh marketing screenshots**: README and landing screenshots now reflect the customizable dashboard

### Fixed

- **Updater installer lock**: includes the installer fix that closes the internal `desk-dashboard.exe` process before replacing files

## [0.2.17] - 2026-06-01

### Fixed

- **Updater installer lock**: the Windows installer now closes the internal `desk-dashboard.exe` process before replacing files, so updates no longer stop with “Error opening file for writing”

## [0.2.16] - 2026-06-01

### Changed

- **Dashboard redesign**: refreshed the cards, spacing, material system, hover states, loading states, and light/dark theme polish for a more modern macOS-style desktop feel
- **Widget hierarchy**: clock/weather, hardware, calendar, notes, music, and motivation now use clearer roles and calmer visual density while keeping the AI dock unchanged

## [0.2.15] - 2026-06-01

### Fixed

- **«Enable °C» with no UAC / PawnIO never installed**: PawnIO install no longer runs from the normal process (it failed silently). A single Windows prompt elevates Sideglass; the helper installs PawnIO with admin rights and reads temperature. `PawnIO_setup.exe` bundled in the installer
- Clearer error messages (UAC cancelled, missing installer, timeout, read failure)

## [0.2.14] - 2026-06-01

### Changed

- **CPU temperature without opening another app**: Sideglass no longer launches LibreHardwareMonitor. It now reads the CPU temperature directly from inside the app by talking to the PawnIO driver (the same way MSI Afterburner or HWiNFO do). Works on Intel (MSR) and AMD Ryzen (SMN). A hidden elevated helper provides the reading after a single Windows prompt; no extra window appears
- The PawnIO driver is installed inside Sideglass's own installer; tapping «Enable °C» only requires accepting one administrator prompt

## [0.2.13] - 2026-06-01

### Fixed

- **CPU temperature without weird installers**: opening Sideglass no longer launches LibreHardwareMonitor in the background, so the PawnIO popup and the `failed to open current executable 0xc0000033` error are gone. The PawnIO driver (2.2.0) is now installed silently inside Sideglass's own installer (same UAC), and tapping «Enable °C» installs PawnIO first if missing, then launches LHM elevated
- **Clear messages**: if PawnIO fails to install or you cancel the Windows prompt, the panel explains exactly what to do

## [0.2.12] - 2026-06-01

### Fixed

- **Fullscreen (F11)**: immersive mode covers the monitor, hides the Windows taskbar and the app title bar (− □ ×). Esc to exit; restores previous size and position

### Changed

- **Web FAQ**: clarifies the secret iCal URL stays on the user's PC only and Sideglass cannot see it

## [0.2.11] - 2026-06-01

### Fixed

- **"Enable °C" button: the Windows UAC prompt now actually appears**. The previous PowerShell-based launch with a hidden window could silently suppress the prompt on some setups, making the button look broken. We now call the native `ShellExecuteW` API with `runas`, which forces the prompt every time

## [0.2.10] - 2026-06-01

### Fixed

- **"Enable °C" button**: now kills any existing LibreHardwareMonitor instance before relaunching it elevated (a non-elevated instance was blocking the UAC prompt, making the button look like it did nothing). Waits up to 30 s for sensors to appear after accepting the Windows prompt

### Changed

- **Settings**: wider drawer with a two-column layout on medium/large screens to reduce vertical scrolling
- **Landing**: color pass (cyan + soft + warm palette), hero entrance animations with feature stagger, CTA and FAQ micro-interactions, contrast and tokens aligned

## [0.2.9] - 2026-06-01

### Fixed

- **Updates**: prompt no longer hides behind Settings (portal + top z-index); progress works without Content-Length (animation + downloaded MB); install reuses the update already found (no second check); error screen shows technical detail

### Changed

- **Landing**: shortened changelog (latest version only), feature lists instead of card grid, distinct brand styling, improved text contrast

## [0.2.8] - 2026-06-01

### Fixed

- **CPU temperature**: the "Enable °C" button is no longer hidden when the GPU already shows degrees (NVIDIA). It appears on the CPU row, next to the usage percentage
- Broader CPU sensor parsing (LHM Parent/Identifier, AMD CCD/Tdie, ACPI thermal zone fallback)

## [0.2.7] - 2026-06-01

### Fixed

- Update error "error opening file for writing LibreHardwareMonitor.exe": the sensor service is now stopped before installing (both in-app and via an installer hook), so the file is no longer locked

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
