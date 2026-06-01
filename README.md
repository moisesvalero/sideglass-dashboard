# Sideglass

<p align="center">
  <img src="public/screenshots/landscape-dark.png" alt="Sideglass — panel para monitor secundario en Windows" width="720" />
</p>

<p align="center">
  <strong>App de escritorio para Windows</strong> (Tauri + Next.js) pensada para dejar fija en un monitor secundario: clima, agenda, hardware, notas, YouTube embebido y acceso rápido a IAs.
</p>

<p align="center">
  <a href="https://github.com/moisesvalero/personal-dashboard/releases/latest">Descargar instalador (.exe)</a>
  ·
  <a href="https://personal-dashboard.vercel.app">Web / landing</a>
  ·
  <a href="./CHANGELOG.md">Changelog</a>
</p>

---

## Capturas

| Vertical (oscuro) | Vertical (claro) |
| --- | --- |
| ![Vertical oscuro](./public/screenshots/portrait-dark.png) | ![Vertical claro](./public/screenshots/portrait-light.png) |

| Horizontal (oscuro) |
| --- |
| ![Horizontal](./public/screenshots/landscape-dark.png) |

---

## Funcionalidades

- Reloj y clima (Open-Meteo, sin API key)
- Google Calendar vía URL iCal
- CPU, RAM y GPU en vivo; temperaturas con LibreHardwareMonitor / NVML
- YouTube **dentro del panel** (pega un enlace, sin ventana aparte)
- Dock de IAs (ChatGPT, Gemini, Claude, Perplexity, Microsoft Copilot)
- Notas locales, frase del día, widgets reordenables
- Barra de título estilo **Windows** (minimizar / maximizar / cerrar a la derecha)
- Auto-actualización: **Ajustes → Buscar actualizaciones**
- Arranque con Windows, atajo global, bandeja del sistema

## Stack

| Capa | Tecnología |
| --- | --- |
| UI | Next.js 16, React 19, TypeScript, Tailwind v4 |
| Escritorio | Tauri v2 (ventana sin marco, tray, updater firmado) |
| Nativo | Rust — sysinfo, WMI/LibreHardwareMonitor, NVML |

## Desarrollo

```bash
npm install
npm run dev          # Vista web en http://localhost:3000
npm run tauri:dev    # App de escritorio
npm run tauri:build  # Instalador Windows
```

```bash
npm run lint && npm run typecheck && npm run build
```

Capturas para README / landing:

```bash
npm run screenshots
```

## Configuración rápida

| Función | Dónde |
| --- | --- |
| Calendario | Ajustes → URL iCal de Google Calendar |
| YouTube | Widget YouTube → pegar enlace → Reproducir |
| Temperaturas | Incluidas en el instalador (LHM); si no aparecen °C, ejecuta como administrador |
| Actualizaciones | Ajustes → **Buscar actualizaciones** |
| Autostart / atajo | Ajustes |

## Publicar release

```bash
git tag v0.2.3
git push origin v0.2.3
```

Secrets en GitHub: ver [docs/UPDATER.md](docs/UPDATER.md).

## Licencia

MIT — [LICENSE](LICENSE)
