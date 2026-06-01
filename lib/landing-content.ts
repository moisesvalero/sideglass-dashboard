export type LandingLang = "es" | "en"

type Feature = { label: string; desc: string }
type Faq = { q: string; a: string }

export type LandingCopy = {
  htmlLang: string
  metaTitle: string
  metaDescription: string
  ogDescription: string
  eyebrow: string
  heroTitle: string[]
  heroSubtitle: string
  ctaDownload: string
  ctaReleaseNotes: string
  heroNote: string
  screenshotsTitle: string
  screenshotsSubtitle: string
  screenshotLabels: { portraitDark: string; portraitLight: string; landscapeDark: string }
  screenshotAlts: { portraitDark: string; portraitLight: string; landscapeDark: string }
  featuresTitle: string
  features: Feature[]
  installTitle: string
  install: string[]
  faqTitle: string
  faq: Faq[]
  changelogTitle: string
  changelogHint: string
  changelogLink: string
  footerDeveloped: string
  footerSource: string
  keywords: string[]
}

export const landingContent: Record<LandingLang, LandingCopy> = {
  es: {
    htmlLang: "es",
    metaTitle: "Sideglass — Panel premium para tu monitor secundario en Windows",
    metaDescription:
      "Sideglass: aplicación de escritorio gratuita y de código abierto, con estética macOS, para tu monitor secundario: clima, calendario, hardware con temperaturas reales, YouTube y acceso rápido a tus IAs. Sin API keys obligatorias.",
    ogDescription: "Sideglass — panel premium para monitor secundario en Windows. Licencia MIT.",
    eyebrow: "Escritorio · Windows · Open source",
    heroTitle: ["Sideglass", "tu panel de monitor secundario"],
    heroSubtitle:
      "Clima, agenda, hardware, notas, YouTube y acceso a tus IAs favoritas. Se adapta a monitor vertical u horizontal.",
    ctaDownload: "Descargar para Windows",
    ctaReleaseNotes: "Notas de versión y otros archivos en GitHub",
    heroNote: "Open source (MIT)",
    screenshotsTitle: "Capturas reales",
    screenshotsSubtitle:
      "Diseño adaptable para monitor secundario en vertical u horizontal. Modo claro y oscuro con materiales tipo macOS.",
    screenshotLabels: {
      portraitDark: "Vertical · Oscuro",
      portraitLight: "Vertical · Claro",
      landscapeDark: "Horizontal · Oscuro",
    },
    screenshotAlts: {
      portraitDark: "Sideglass en monitor vertical, modo oscuro",
      portraitLight: "Sideglass en monitor vertical, modo claro",
      landscapeDark: "Sideglass en monitor horizontal, modo oscuro",
    },
    featuresTitle: "Qué incluye",
    features: [
      {
        label: "Hardware nativo",
        desc: "CPU, RAM y GPU en tiempo real. Temperaturas reales incluidas en el instalador.",
      },
      {
        label: "Calendario Google",
        desc: "Conéctalo con tu URL iCal secreta. Sin scripts ni configuraciones raras.",
      },
      {
        label: "Clima sin API key",
        desc: "Open-Meteo con detección automática de ubicación.",
      },
      {
        label: "YouTube en el panel",
        desc: "Pega un enlace y reproduce el video dentro del dashboard.",
      },
      {
        label: "Dock de IAs",
        desc: "ChatGPT, Gemini, Claude, Perplexity y Microsoft Copilot con iconos oficiales de marca.",
      },
      {
        label: "Notas locales",
        desc: "Bloc de notas rápido con diseño premium. Tus datos solo en tu PC.",
      },
    ],
    installTitle: "Instalación en 4 pasos",
    install: [
      "Pulsa «Descargar para Windows» arriba: se descarga el instalador (.exe) de la última versión.",
      "Abre el archivo y sigue el asistente. Si Windows muestra un aviso de seguridad, confirma que quieres continuar; es habitual en aplicaciones nuevas.",
      "Opcional: en Ajustes, pega la URL iCal de Google Calendar para ver tu agenda del día.",
      "En Ajustes puedes activar el inicio con Windows y un atajo global para mostrar u ocultar el panel.",
    ],
    faqTitle: "Preguntas frecuentes",
    faq: [
      {
        q: "¿Qué es Sideglass?",
        a: "Una aplicación de escritorio para dejar en un monitor secundario, en vertical u horizontal, con la información que más usas cada día.",
      },
      {
        q: "¿Cómo instalo Sideglass en Windows?",
        a: "Descarga el instalador desde el botón de arriba, ejecútalo y sigue los pasos del asistente. La primera vez puedes elegir la carpeta de instalación.",
      },
      {
        q: "¿Cómo vinculo Google Calendar?",
        a: "En Google Calendar: Configuración del calendario → Integrar calendario → Dirección secreta en formato iCal. Copia la URL y pégala en Ajustes de Sideglass.",
      },
      {
        q: "¿Cómo veo temperaturas reales de CPU y GPU?",
        a: "El instalador ya incluye el servicio de sensores. Sideglass lo arranca en segundo plano y lee las temperaturas por WMI. No tienes que instalar nada más.",
      },
      {
        q: "¿Cómo veo YouTube?",
        a: "En el widget de YouTube pega la URL del video y pulsa Reproducir. Se muestra embebido en el panel.",
      },
      {
        q: "¿Es open source?",
        a: "Sí. Código en GitHub con licencia MIT: puedes usarlo, estudiarlo, modificarlo y compartirlo. Si te sirve, una estrella o un PR ayuda mucho a dar visibilidad al proyecto.",
      },
    ],
    changelogTitle: "Novedades",
    changelogHint: "Se actualiza solo al editar CHANGELOG.es.md y desplegar.",
    changelogLink: "Ver CHANGELOG.es.md en GitHub",
    footerDeveloped: "Desarrollado por",
    footerSource: "Código en GitHub (open source)",
    keywords: [
      "dashboard monitor secundario",
      "panel escritorio windows",
      "monitor hardware temperaturas",
      "tauri nextjs app",
      "widget clima calendario windows",
    ],
  },
  en: {
    htmlLang: "en",
    metaTitle: "Sideglass — Premium second-monitor panel for Windows",
    metaDescription:
      "Sideglass: free, open-source macOS-style desktop app for your secondary monitor — weather, calendar, hardware with real temperatures, YouTube and AI dock. No required API keys.",
    ogDescription: "Sideglass — open-source second-monitor panel for Windows (MIT).",
    eyebrow: "Desktop · Windows · Open source",
    heroTitle: ["Sideglass", "your second-monitor panel"],
    heroSubtitle:
      "Weather, agenda, hardware, notes, YouTube and access to your favorite AIs. Responsive in portrait and landscape.",
    ctaDownload: "Download for Windows",
    ctaReleaseNotes: "Release notes and other files on GitHub",
    heroNote: "Open source (MIT)",
    screenshotsTitle: "Real screenshots",
    screenshotsSubtitle:
      "Responsive design for a secondary monitor in portrait or landscape. Light and dark mode with macOS-style materials.",
    screenshotLabels: {
      portraitDark: "Portrait · Dark",
      portraitLight: "Portrait · Light",
      landscapeDark: "Landscape · Dark",
    },
    screenshotAlts: {
      portraitDark: "Sideglass on a portrait monitor, dark mode",
      portraitLight: "Sideglass on a portrait monitor, light mode",
      landscapeDark: "Sideglass on a landscape monitor, dark mode",
    },
    featuresTitle: "What's inside",
    features: [
      {
        label: "Native hardware",
        desc: "Real-time CPU, RAM and GPU. Real temperatures bundled with the installer.",
      },
      {
        label: "Google Calendar",
        desc: "Link it with your secret iCal URL. No scripts, no weird code.",
      },
      { label: "Weather without API key", desc: "Open-Meteo with automatic location detection." },
      {
        label: "YouTube in the panel",
        desc: "Paste a link and play the video inside the dashboard.",
      },
      {
        label: "AI dock",
        desc: "ChatGPT, Gemini, Claude, Perplexity and Microsoft Copilot with official brand icons.",
      },
      { label: "Local notes", desc: "Quick notepad with premium design. Data stays on your PC." },
    ],
    installTitle: "Install in 4 steps",
    install: [
      "Click «Download for Windows» above to download the latest installer (.exe).",
      "Run the file and follow the setup wizard. If Windows shows a security prompt, confirm to continue — common for new desktop apps.",
      "Optional: in Settings, paste your Google Calendar iCal URL to see today's agenda.",
      "In Settings you can enable start with Windows and a global shortcut to show or hide the panel.",
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "What is Sideglass?",
        a: "A desktop app (Tauri + Next.js) designed to stay fixed on a secondary monitor, portrait or landscape, with the information you use the most.",
      },
      {
        q: "How do I install Sideglass on Windows?",
        a: "Download the installer from the button above, run it and follow the setup steps. On first install you can choose where to install it.",
      },
      {
        q: "How do I connect Google Calendar?",
        a: "In Google Calendar: Calendar settings > Integrate calendar > Secret address in iCal format. Copy the URL and paste it into the app Settings.",
      },
      {
        q: "How do I see real CPU and GPU temperatures?",
        a: "Sideglass ships with an integrated sensor service. The app starts it in the background and reads temperatures via WMI. No extra software to install.",
      },
      {
        q: "How do I watch YouTube?",
        a: "Paste the video URL in the YouTube widget and press Play. It embeds in the panel.",
      },
      {
        q: "Is it open source?",
        a: "Yes. Source on GitHub under the MIT license: use, study, modify and share freely. A star or pull request helps the project get seen.",
      },
    ],
    changelogTitle: "What's new",
    changelogHint: "Updates automatically when you edit CHANGELOG.md and deploy.",
    changelogLink: "View CHANGELOG.md on GitHub",
    footerDeveloped: "Developed by",
    footerSource: "Source on GitHub (open source)",
    keywords: [
      "second monitor dashboard",
      "windows desktop panel",
      "hardware monitor temperatures",
      "tauri nextjs app",
      "weather calendar widget windows",
    ],
  },
}
