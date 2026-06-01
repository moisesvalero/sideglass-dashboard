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
    metaTitle: "Desk Dashboard — Panel premium para tu monitor secundario en Windows",
    metaDescription:
      "App de escritorio gratuita y open source estilo macOS para tu monitor secundario en Windows: clima, calendario de Google, monitor de hardware con temperaturas reales, YouTube y acceso rapido a IAs. Sin API keys obligatorias.",
    ogDescription: "Dashboard premium para monitor secundario en Windows — Tauri + Next.js, MIT.",
    eyebrow: "Escritorio · Windows · Open Source",
    heroTitle: ["Tu monitor secundario,", "con calidad macOS"],
    heroSubtitle:
      "Clima, agenda, hardware, notas, YouTube y acceso a tus IAs favoritas. Responsive en vertical y horizontal.",
    ctaDownload: "Descargar para Windows",
    heroNote: "MIT · Sin API keys obligatorias",
    screenshotsTitle: "Capturas reales",
    screenshotsSubtitle:
      "Diseno responsive para monitor secundario en vertical u horizontal. Modo claro y oscuro con materiales tipo macOS.",
    screenshotLabels: {
      portraitDark: "Vertical · Oscuro",
      portraitLight: "Vertical · Claro",
      landscapeDark: "Horizontal · Oscuro",
    },
    featuresTitle: "Que incluye",
    features: [
      {
        label: "Hardware nativo",
        desc: "CPU, RAM y GPU en tiempo real. Temperaturas reales incluidas en el instalador.",
      },
      {
        label: "Calendario Google",
        desc: "Vincula con la URL iCal secreta. Sin scripts ni codigo raro.",
      },
      { label: "Clima sin API key", desc: "Open-Meteo con deteccion automatica de ubicacion." },
      {
        label: "YouTube con tu cuenta",
        desc: "Ventana integrada: inicia sesion, busca, maximiza y pantalla completa.",
      },
      {
        label: "AI Dock",
        desc: "ChatGPT, Gemini, Claude, Perplexity y Copilot con iconos oficiales.",
      },
      { label: "Notas locales", desc: "Bloc rapido con diseno premium. Datos solo en tu PC." },
    ],
    installTitle: "Instalacion",
    install: [
      "Descarga el instalador .exe desde GitHub Releases.",
      "Si Windows SmartScreen advierte, pulsa Mas informacion y Ejecutar de todas formas (app sin firma de pago).",
      "Abre Ajustes y pega tu URL iCal de Google Calendar si quieres agenda.",
      "Activa inicio con Windows y el atajo global desde Ajustes.",
    ],
    faqTitle: "Preguntas frecuentes",
    faq: [
      {
        q: "¿Que es Desk Dashboard?",
        a: "Una app de escritorio (Tauri + Next.js) pensada para dejar fija en un monitor secundario, vertical u horizontal, con la informacion que mas usas.",
      },
      {
        q: "¿Como instalo Desk Dashboard en Windows?",
        a: "Descarga el .exe desde Releases en GitHub, ejecutalo y acepta el aviso de SmartScreen si aparece (la app no esta firmada con certificado de pago). La primera vez puedes elegir la carpeta de instalacion.",
      },
      {
        q: "¿Como vinculo Google Calendar?",
        a: "En Google Calendar: Configuracion del calendario > Integrar calendario > Direccion secreta en formato iCal. Copia la URL y pegala en Ajustes de la app.",
      },
      {
        q: "¿Como veo temperaturas reales de CPU y GPU?",
        a: "Al instalar Desk Dashboard ya viene el servicio de sensores integrado. La app lo arranca en segundo plano y lee temperaturas via WMI. No hace falta instalar nada mas.",
      },
      {
        q: "¿YouTube funciona con mi cuenta de Google?",
        a: "Si. Pulsa Abrir YouTube en el widget. Inicia sesion una vez en la ventana integrada; las cookies se guardan en tu equipo.",
      },
      {
        q: "¿Es gratis y open source?",
        a: "Si. Licencia MIT. Puedes usarla, modificarla y publicar mejoras.",
      },
    ],
    changelogTitle: "Novedades",
    changelogLink: "Ver CHANGELOG completo",
    footerDeveloped: "Desarrollado por",
    footerSource: "Codigo fuente del proyecto",
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
    metaTitle: "Desk Dashboard — Premium second-monitor panel for Windows",
    metaDescription:
      "Free, open-source macOS-style desktop app for your secondary monitor on Windows: weather, Google Calendar, hardware monitor with real temperatures, YouTube and quick access to AI assistants. No required API keys.",
    ogDescription: "Premium second-monitor dashboard for Windows — Tauri + Next.js, MIT.",
    eyebrow: "Desktop · Windows · Open Source",
    heroTitle: ["Your second monitor,", "with macOS quality"],
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
        label: "AI Dock",
        desc: "ChatGPT, Gemini, Claude, Perplexity and Copilot with official icons.",
      },
      { label: "Local notes", desc: "Quick notepad with premium design. Data stays on your PC." },
    ],
    installTitle: "Installation",
    install: [
      "Download the .exe installer from GitHub Releases.",
      "If Windows SmartScreen warns you, click More info and Run anyway (app without a paid signature).",
      "Open Settings and paste your Google Calendar iCal URL if you want the agenda.",
      "Enable start with Windows and the global shortcut from Settings.",
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "What is Desk Dashboard?",
        a: "A desktop app (Tauri + Next.js) designed to stay fixed on a secondary monitor, portrait or landscape, with the information you use the most.",
      },
      {
        q: "How do I install Desk Dashboard on Windows?",
        a: "Download the .exe from GitHub Releases, run it and accept the SmartScreen warning if it appears (the app is not signed with a paid certificate). The first time you can choose the install folder.",
      },
      {
        q: "How do I connect Google Calendar?",
        a: "In Google Calendar: Calendar settings > Integrate calendar > Secret address in iCal format. Copy the URL and paste it into the app Settings.",
      },
      {
        q: "How do I see real CPU and GPU temperatures?",
        a: "Desk Dashboard ships with an integrated sensor service. The app starts it in the background and reads temperatures via WMI. No extra software to install.",
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
