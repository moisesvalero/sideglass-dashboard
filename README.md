# Sideglass

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.es.md">Español</a>
</p>

<p align="center">
  <img src="public/screenshots/landscape-dark.png" alt="Sideglass — second-monitor dashboard for Windows" width="720" />
</p>

<p align="center">
  <strong>Source-available desktop app for Windows</strong> (Tauri + Next.js) — customizable secondary monitor dashboard: weather, calendar, hardware, notes, embedded YouTube, and AI dock.
</p>

<p align="center">
  <a href="https://github.com/moisesvalero/sideglass-dashboard/releases/latest/download/Sideglass_x64-setup.exe">Download .exe</a>
  ·
  <a href="https://sideglass.moisesvalero.es">Landing</a>
  ·
  <a href="https://github.com/moisesvalero/sideglass-dashboard">GitHub</a>
  ·
  <a href="./CHANGELOG.md">Changelog</a>
</p>

<p align="center">
  <a href="https://www.producthunt.com/products/sideglass?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-sideglass" target="_blank" rel="noopener noreferrer"><img alt="Sideglass - Stop using browser tabs for your daily workflow | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1171679&amp;theme=light&amp;t=1781977293116"></a>
</p>

<p align="center">
  If this project helps you, a <a href="https://github.com/moisesvalero/sideglass-dashboard">GitHub star</a> or issue/PR makes a real difference.
</p>

---

## Screenshots

| Portrait (dark)                                          | Portrait (light)                                           |
| -------------------------------------------------------- | ---------------------------------------------------------- |
| ![Portrait dark](./public/screenshots/portrait-dark.png) | ![Portrait light](./public/screenshots/portrait-light.png) |

| Landscape (dark)                                           |
| ---------------------------------------------------------- |
| ![Landscape dark](./public/screenshots/landscape-dark.png) |

---

## Features

- Clock and weather (Open-Meteo, no API key)
- Google Calendar via iCal URL
- Live CPU, RAM, GPU, and primary disk usage; temperatures via bundled sensors / NVML
- **Resizable responsive widgets**: drag the corner to any saved size; contents scale inside the card
- **YouTube inside the panel** with real search in the Tauri app
- AI dock (ChatGPT, Gemini, Claude, Perplexity, Microsoft Copilot)
- Satoshi app typography, local notes, curated bilingual daily quotes, reorderable widgets
- **Windows-style** title bar (minimize / maximize / close on the right)
- Auto-update: **Settings → Check for updates**
- Start with Windows, global hotkey, system tray

## Stack

| Layer   | Tech                                              |
| ------- | ------------------------------------------------- |
| UI      | Next.js 16, React 19, TypeScript, Tailwind v4     |
| Desktop | Tauri v2 (frameless window, tray, signed updater) |
| Native  | Rust — sysinfo, WMI/LibreHardwareMonitor, NVML    |

## Development

```bash
pnpm install
pnpm run dev          # Web preview http://localhost:3000
pnpm run tauri:dev    # Desktop app
pnpm run tauri:build  # Windows installer
```

```bash
pnpm run lint && pnpm run check && pnpm run build
```

Regenerate marketing screenshots:

```bash
pnpm run screenshots
```

Check private GitHub Release download counts:

```bash
pnpm run stats:downloads
```

Generate WinGet manifests for a release:

```bash
pnpm run winget:manifest -- --installer ./path/to/Sideglass_x64-setup.exe
```

See [docs/WINGET.md](docs/WINGET.md).

## Quick setup

| Feature            | Where                                                       |
| ------------------ | ----------------------------------------------------------- |
| Calendar           | Settings → Google Calendar iCal URL                         |
| Resize widgets     | Top bar → customize button → drag the card corner freely    |
| YouTube            | YouTube widget → search in app or paste link in web preview |
| Temperatures       | Bundled in installer; run as administrator if °C is missing |
| Updates            | Settings → **Check for updates**                            |
| Autostart / hotkey | Settings                                                    |

## Changelog (website + repo)

- **English:** [CHANGELOG.md](./CHANGELOG.md) — parsed on the landing at build time (`/en`)
- **Spanish:** [CHANGELOG.es.md](./CHANGELOG.es.md) — parsed on the Spanish landing (`/`)

Add the same `## [x.y.z] - date` section to **both** files when you ship a release.

## Publish a release

```bash
git tag v0.2.4
git push origin v0.2.4
```

GitHub Actions secrets: [docs/UPDATER.md](docs/UPDATER.md).

## Source available

Sideglass is source-available under the PolyForm Noncommercial License 1.0.0. Commercial use, resale, redistribution, white-labeling, paid hosting, or competing commercial forks require written permission from Moises Valero.

- [Open an issue](https://github.com/moisesvalero/sideglass-dashboard/issues)
- Pull requests welcome

## License

[PolyForm Noncommercial License 1.0.0](LICENSE) — Copyright (c) 2026 Moises Valero
