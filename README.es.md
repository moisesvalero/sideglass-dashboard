# Sideglass

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.es.md">Español</a>
</p>

<p align="center">
  <img src="public/screenshots/landscape-dark.png" alt="Sideglass — panel para monitor secundario en Windows" width="720" />
</p>

<p align="center">
  <strong>App de escritorio open source para Windows</strong> (Tauri + Next.js) — panel personalizable para monitor secundario: clima, agenda, hardware, notas, YouTube embebido y dock de IAs.
</p>

<p align="center">
  <a href="https://github.com/moisesvalero/sideglass-dashboard/releases/latest/download/Sideglass_x64-setup.exe">Descargar .exe</a>
  ·
  <a href="https://personal-dashboard-gules-three.vercel.app">Landing</a>
  ·
  <a href="https://github.com/moisesvalero/sideglass-dashboard">GitHub</a>
  ·
  <a href="./CHANGELOG.es.md">Changelog</a>
</p>

<p align="center">
  Si te gusta el proyecto, una <a href="https://github.com/moisesvalero/sideglass-dashboard">estrella en GitHub</a> o un issue/PR ayuda mucho.
</p>

---

## Capturas

| Vertical (oscuro)                                          | Vertical (claro)                                           |
| ---------------------------------------------------------- | ---------------------------------------------------------- |
| ![Vertical oscuro](./public/screenshots/portrait-dark.png) | ![Vertical claro](./public/screenshots/portrait-light.png) |

| Horizontal (oscuro)                                    |
| ------------------------------------------------------ |
| ![Horizontal](./public/screenshots/landscape-dark.png) |

---

## Funcionalidades

- Reloj y clima (Open-Meteo, sin API key)
- Google Calendar vía URL iCal
- CPU, RAM, GPU y uso del disco principal en vivo; temperaturas con sensores / NVML
- **Widgets redimensionables y responsivos**: arrastra la esquina al tamaño que quieras; el contenido escala dentro de la tarjeta
- **YouTube dentro del panel** con búsqueda real en la app Tauri
- Dock de IAs (ChatGPT, Gemini, Claude, Perplexity, Microsoft Copilot)
- Tipografía Satoshi, notas locales, frases del día bilingües curadas, widgets reordenables
- Barra de título estilo **Windows** (controles a la derecha)
- Auto-actualización: **Ajustes → Buscar actualizaciones**
- Inicio con Windows, atajo global, bandeja del sistema

## Stack

| Capa       | Tecnología                                          |
| ---------- | --------------------------------------------------- |
| UI         | Next.js 16, React 19, TypeScript, Tailwind v4       |
| Escritorio | Tauri v2 (ventana sin marco, tray, updater firmado) |
| Nativo     | Rust — sysinfo, WMI/LibreHardwareMonitor, NVML      |

## Desarrollo

```bash
npm install
npm run dev          # Vista web http://localhost:3000
npm run tauri:dev    # App de escritorio
npm run tauri:build  # Instalador Windows
```

```bash
npm run lint && npm run typecheck && npm run build
```

Regenerar capturas:

```bash
npm run screenshots
```

## Configuración rápida

| Función           | Dónde                                                                |
| ----------------- | -------------------------------------------------------------------- |
| Calendario        | Ajustes → URL iCal de Google Calendar                                |
| Redimensionar     | Barra superior → botón personalizar → arrastra la esquina libremente |
| YouTube           | Widget YouTube → buscar en la app o pegar enlace en la preview web   |
| Temperaturas      | Incluidas en el instalador; ejecuta como administrador si no ves °C  |
| Actualizaciones   | Ajustes → **Buscar actualizaciones**                                 |
| Autostart / atajo | Ajustes                                                              |

## Changelog (web y repo)

- **Español:** [CHANGELOG.es.md](./CHANGELOG.es.md) — se muestra en la landing `/` al hacer build
- **Inglés:** [CHANGELOG.md](./CHANGELOG.md) — se muestra en `/en`

Añade la misma sección `## [x.y.z] - fecha` en **ambos** archivos en cada release.

## Publicar release

```bash
git tag v0.2.4
git push origin v0.2.4
```

Secrets en GitHub: [docs/UPDATER.md](docs/UPDATER.md).

## Open source

Licencia [MIT](LICENSE): puedes usarlo, modificarlo y compartirlo con el aviso de copyright.

- [Abre un issue](https://github.com/moisesvalero/sideglass-dashboard/issues)
- Pull requests bienvenidos

## Licencia

[MIT](LICENSE) — Copyright (c) 2026 Moises Valero
