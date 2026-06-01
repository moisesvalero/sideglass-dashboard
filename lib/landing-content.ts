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
    eyebrow: "Escritorio · Windows · Código abierto",
    heroTitle: ["Sideglass", "tu panel de monitor secundario"],
    heroSubtitle:
      "Clima, agenda, hardware, notas, YouTube y acceso a tus IAs favoritas. Se adapta a monitor vertical u horizontal.",
    ctaDownload: "Descargar para Windows",
    heroNote: "MIT · Sin API keys obligatorias",
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
        label: "YouTube con tu cuenta",
        desc: "Ventana integrada: inicia sesión, busca, maximiza y pantalla completa.",
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
      "Pulsa «Descargar para Windows» arriba y guarda el instalador (.exe) desde GitHub Releases.",
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
        q: "¿YouTube funciona con mi cuenta de Google?",
        a: "Sí. Pulsa «Abrir YouTube» en el widget, inicia sesión una vez en la ventana integrada y tus cookies se guardan en tu equipo.",
      },
      {
        q: "¿Es gratis y de código abierto?",
        a: "Sí. Licencia MIT: puedes usarla, modificarla y compartir mejoras.",
      },
    ],
    changelogTitle: "Novedades",
    changelogLink: "Ver CHANGELOG completo",
    footerDeveloped: "Desarrollado por",
    footerSource: "Código fuente del proyecto",
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
    ogDescription: "Sideglass — premium second-monitor panel for Windows. MIT.",
    eyebrow: "Desktop · Windows · Open Source",
    heroTitle: ["Sideglass", "your second-monitor panel"],
    heroSubtitle:
      "Weather, agenda, hardware, notes, YouTube and access to your favorite AIs. Responsive in portrait and landscape.",
    ctaDownload: "Download for Windows",
    heroNote: "MIT · No required API keys",
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
        label: "YouTube with your account",
        desc: "Embedded window: sign in, search, maximize and go fullscreen.",
      },
      {
        label: "AI dock",
        desc: "ChatGPT, Gemini, Claude, Perplexity and Microsoft Copilot with official brand icons.",
      },
      { label: "Local notes", desc: "Quick notepad with premium design. Data stays on your PC." },
    ],
    installTitle: "Install in 4 steps",
    install: [
      "Click «Download for Windows» above and save the installer (.exe) from GitHub Releases.",
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
        q: "Does YouTube work with my Google account?",
        a: "Yes. Click Open YouTube in the widget. Sign in once in the embedded window; cookies are stored on your machine.",
      },
      {
        q: "Is it free and open source?",
        a: "Yes. MIT license. You can use it, modify it and publish improvements.",
      },
    ],
    changelogTitle: "What's new",
    changelogLink: "View full CHANGELOG",
    footerDeveloped: "Developed by",
    footerSource: "Project source code",
    keywords: [
      "second monitor dashboard",
      "windows desktop panel",
      "hardware monitor temperatures",
      "tauri nextjs app",
      "weather calendar widget windows",
    ],
  },
}
