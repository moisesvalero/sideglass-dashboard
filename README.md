# Sideglass

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.es.md">Español</a>
</p>

<p align="center">
  <img src="public/screenshots/landscape-dark.png" alt="Sideglass — second-monitor dashboard for Windows" width="720" />
</p>

<p align="center">
  <strong>Open-source desktop app for Windows</strong> (Tauri + Next.js) — customizable secondary monitor dashboard: weather, calendar, hardware, notes, embedded YouTube, and AI dock.
</p>

<p align="center">
  <a href="https://github.com/moisesvalero/sideglass-dashboard/releases/latest/download/Sideglass_x64-setup.exe">Download .exe</a>
  ·
  <a href="https://personal-dashboard-gules-three.vercel.app">Landing</a>
  ·
  <a href="https://github.com/moisesvalero/sideglass-dashboard">GitHub</a>
  ·
  <a href="./CHANGELOG.md">Changelog</a>
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
- Live CPU, RAM, and GPU; temperatures via bundled LibreHardwareMonitor / NVML
- **Resizable widgets**: edit mode lets you drag and resize every card from the corner
- **YouTube inside the panel** with real search in the Tauri app
- AI dock (ChatGPT, Gemini, Claude, Perplexity, Microsoft Copilot)
- Local notes, daily quote, reorderable widgets
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
npm install
npm run dev          # Web preview http://localhost:3000
npm run tauri:dev    # Desktop app
npm run tauri:build  # Windows installer
```

```bash
npm run lint && npm run typecheck && npm run build
```

Regenerate marketing screenshots:

```bash
npm run screenshots
```

## Quick setup

| Feature            | Where                                                       |
| ------------------ | ----------------------------------------------------------- |
| Calendar           | Settings → Google Calendar iCal URL                         |
| Resize widgets     | Top bar → customize button → drag the card corner           |
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

## Open source

MIT [LICENSE](LICENSE) — use, modify, and share with the copyright notice.

- [Open an issue](https://github.com/moisesvalero/sideglass-dashboard/issues)
- Pull requests welcome

## License

[MIT](LICENSE) — Copyright (c) 2026 Moises Valero
