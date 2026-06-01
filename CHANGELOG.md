# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2026-06-01

### Added

- Iconos OpenAI claros/oscuro según tema en el dock de IAs
- Landing Sideglass con capturas verticales/horizontales actualizadas

### Changed

- Marca unificada como **Sideglass** (ventana, landing, metadatos)
- Dock de IAs en fila inferior del layout (ya no flota encima de los widgets)
- Script de capturas: solo viewport y demo compacto en vertical

### Fixed

- Solapamiento del dock con Notas y demás widgets al hacer scroll
- CI/release: glob de recursos Tauri `bin/*` para empaquetar LibreHardwareMonitor
- Icono ChatGPT invisible en modo oscuro
- Texto FAQ sin rayas largas estilo IA

## [0.2.0] - 2026-06-01

### Added

- Premium macOS-style visual design (glass materials, semantic light/dark themes)
- Responsive layout for vertical and horizontal monitors
- Google Calendar via iCal URL (no Apps Script)
- YouTube in dedicated Tauri window with your Google account
- AI dock with official brand icons (ChatGPT, Gemini, Claude, Perplexity, Copilot)
- Open-Meteo weather (no API key) with optional auto-location
- Real hardware temperatures via LibreHardwareMonitor (WMI)
- Widget reordering by drag and drop
- Autostart with Windows, global hotkey, calendar notifications
- Spanish/English UI and 12/24h time format
- Professional landing page with FAQ, install guide, and changelog section

### Changed

- Renamed app to **Desk Dashboard**
- Window opens larger, maximizable, remembers size/position
- Notes remain local with premium styling

### Fixed

- Light mode text visibility (semantic color tokens)
- Removed fake CPU temperature fallback when no sensor is available

## [0.1.0] - 2025-05-31

### Added

- Initial Tauri + Next.js dashboard
- Hardware monitor (CPU/RAM/GPU), weather, calendar script, AI dock, notes, YouTube embed
