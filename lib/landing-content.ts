export type LandingLang = "es" | "en"

type Feature = { label: string; desc: string }
type FeatureGroup = { title: string; items: Feature[] }
type Faq = { q: string; a: string; steps?: string[]; note?: string }

export type LandingCopy = {
  htmlLang: string
  metaTitle: string
  metaDescription: string
  ogDescription: string
  eyebrow: string
  heroTitle: string[]
  heroSubtitle: string
  ctaDownload: string
  ctaGithub: string
  heroNote: string
  heroVideoPlayLabel: string
  navFaq: string
  screenshotsTitle: string
  screenshotsSubtitle: string
  screenshotLabels: { portraitDark: string; portraitLight: string; landscapeDark: string }
  screenshotAlts: { portraitDark: string; portraitLight: string; landscapeDark: string }
  featuresTitle: string
  featureGroups: FeatureGroup[]
  installTitle: string
  install: string[]
  faqTitle: string
  faq: Faq[]
  changelogTitle: string
  changelogSubtitle: string
  changelogLink: string
  changelogEmpty: string
  footerDeveloped: string
  footerReportIssue: string
  keywords: string[]
}

export const landingContent: Record<LandingLang, LandingCopy> = {
  es: {
    htmlLang: "es",
    metaTitle: "Panel para monitor secundario en Windows",
    metaDescription:
      "Sideglass: aplicación de escritorio gratuita y de código abierto, con estética macOS, para tu monitor secundario: clima, calendario, hardware con temperaturas reales, YouTube y acceso rápido a tus IAs. Sin API keys obligatorias.",
    ogDescription: "Sideglass: panel para monitor secundario en Windows. Licencia MIT.",
    eyebrow: "Escritorio · Windows · Open source",
    heroTitle: ["Tu monitor secundario,", "siempre a la vista"],
    heroSubtitle:
      "Clima, agenda, hardware, notas, YouTube y acceso a tus IAs favoritas. Ordena y redimensiona cada widget libremente; el contenido se adapta a la tarjeta.",
    ctaDownload: "Descargar para Windows",
    ctaGithub: "Ver en GitHub",
    heroNote: "Open source (MIT)",
    heroVideoPlayLabel: "Reproducir video de Sideglass",
    navFaq: "Ayuda",
    screenshotsTitle: "Capturas reales",
    screenshotsSubtitle:
      "Diseño adaptable para monitor secundario en vertical u horizontal. Modo claro y oscuro con materiales tipo macOS.",
    screenshotLabels: {
      portraitDark: "Vertical · Oscuro",
      portraitLight: "Vertical · Claro",
      landscapeDark: "Horizontal · Layout personalizado",
    },
    screenshotAlts: {
      portraitDark: "Sideglass en monitor vertical, modo oscuro",
      portraitLight: "Sideglass en monitor vertical, modo claro",
      landscapeDark: "Sideglass en monitor horizontal con widgets redimensionables",
    },
    featuresTitle: "Qué incluye",
    featureGroups: [
      {
        title: "Información del día",
        items: [
          {
            label: "Hardware nativo",
            desc: "CPU, RAM y GPU en tiempo real, con temperaturas reales en el instalador.",
          },
          {
            label: "Calendario Google",
            desc: "Conéctalo con tu URL iCal secreta. Sin scripts ni configuraciones raras.",
          },
          {
            label: "Clima sin API key",
            desc: "Open-Meteo con detección automática de ubicación.",
          },
        ],
      },
      {
        title: "Panel completo",
        items: [
          {
            label: "Layout personalizable",
            desc: "Activa el modo editar, arrastra los widgets y redimensiona cada tarjeta libremente desde la esquina.",
          },
          {
            label: "YouTube integrado",
            desc: "Busca y reproduce vídeos dentro del dashboard, sin pegar enlaces.",
          },
          {
            label: "Dock de IAs",
            desc: "ChatGPT, Gemini, Claude, Perplexity y Copilot con iconos oficiales.",
          },
          {
            label: "Notas locales",
            desc: "Bloc rápido y frases del día bilingües, cortas y curadas, sin depender de internet.",
          },
        ],
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
        q: "¿Cómo consigo la dirección secreta iCal de mi Google Calendar?",
        a: "Para sincronizar tu calendario pegas la dirección secreta en formato iCal en Ajustes. Esa clave es privada: se guarda solo en tu PC y Sideglass no la envía a ningún servidor nuestro; nosotros no podemos verla ni leer tus eventos. Sigue estos pasos desde tu ordenador (no está disponible en la app del móvil):",
        steps: [
          "Entra en Google Calendar: ve a calendar.google.com desde tu navegador.",
          "Abre la configuración de tu calendario: en el menú lateral izquierdo, baja hasta «Configuración de mis calendarios» y haz clic sobre el nombre del calendario que quieres sincronizar.",
          "Ve a la sección de integración: en el menú que se despliega a la izquierda, haz clic en «Integrar el calendario».",
          "Copia la dirección secreta: busca el recuadro «Dirección secreta en formato iCal» y pulsa el icono de copiar (los dos folios) a la derecha del enlace.",
          "Pega esa URL en Ajustes de Sideglass, en el campo Google Calendar (iCal).",
        ],
        note: "Privacidad: la URL iCal queda en la configuración local de Sideglass en tu ordenador. No hay base de datos en la nube ni registro del enlace por parte del proyecto. Tampoco la compartas con otras personas: quien la tenga puede ver tu calendario sin contraseña. Si se filtra, pulsa «Restablecer» en Google Calendar para generar una URL nueva.",
      },
      {
        q: "¿Cómo veo temperaturas reales de CPU y GPU?",
        a: "El instalador ya incluye el servicio de sensores. Sideglass lo arranca en segundo plano y lee las temperaturas por WMI. Para la temperatura de la CPU, Windows pedirá permiso de administrador al abrir (el servicio lo necesita para leer ese sensor); acéptalo y, en unos segundos, verás los °C.",
      },
      {
        q: "¿Puedo cambiar el tamaño de los widgets?",
        a: "Sí. Pulsa el botón de personalización en la barra superior, arrastra los widgets para ordenarlos y usa la esquina inferior de cada tarjeta para redimensionarla libremente. Reloj, clima, agenda y YouTube adaptan su contenido al tamaño disponible. Sideglass guarda el layout en tu PC.",
      },
      {
        q: "¿Cómo veo YouTube?",
        a: "En el widget de YouTube escribe lo que quieras buscar y pulsa Buscar: se muestran los resultados dentro del panel. Haz clic en un video y se reproduce embebido, sin salir de Sideglass.",
      },
      {
        q: "¿Es open source?",
        a: "Sí. Código en GitHub con licencia MIT: puedes usarlo, estudiarlo, modificarlo y compartirlo. Si te sirve, una estrella o un PR ayuda mucho a dar visibilidad al proyecto.",
      },
    ],
    changelogTitle: "Última versión",
    changelogSubtitle: "Lo más reciente. El historial completo está en GitHub.",
    changelogLink: "Ver todas las versiones en GitHub",
    changelogEmpty:
      "No hay entradas de changelog en este despliegue. Edita CHANGELOG.es.md y vuelve a desplegar la web.",
    footerDeveloped: "Desarrollado por",
    footerReportIssue: "¿Algo no funciona? Abre un issue en GitHub",
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
    metaTitle: "Second-monitor panel for Windows",
    metaDescription:
      "Sideglass: free, open-source macOS-style desktop app for your secondary monitor: weather, calendar, hardware with real temperatures, YouTube and AI dock. No required API keys.",
    ogDescription: "Sideglass: open-source second-monitor panel for Windows (MIT).",
    eyebrow: "Desktop · Windows · Open source",
    heroTitle: ["Your second monitor,", "always in view"],
    heroSubtitle:
      "Weather, agenda, hardware, notes, YouTube and access to your favorite AIs. Arrange and freely resize every widget; content adapts to the card.",
    ctaDownload: "Download for Windows",
    ctaGithub: "View on GitHub",
    heroNote: "Open source (MIT)",
    heroVideoPlayLabel: "Play Sideglass video",
    navFaq: "Help",
    screenshotsTitle: "Real screenshots",
    screenshotsSubtitle:
      "Responsive design for a secondary monitor in portrait or landscape. Light and dark mode with macOS-style materials.",
    screenshotLabels: {
      portraitDark: "Portrait · Dark",
      portraitLight: "Portrait · Light",
      landscapeDark: "Landscape · Custom layout",
    },
    screenshotAlts: {
      portraitDark: "Sideglass on a portrait monitor, dark mode",
      portraitLight: "Sideglass on a portrait monitor, light mode",
      landscapeDark: "Sideglass on a landscape monitor with resizable widgets",
    },
    featuresTitle: "What's inside",
    featureGroups: [
      {
        title: "Daily information",
        items: [
          {
            label: "Native hardware",
            desc: "Real-time CPU, RAM and GPU, with real temperatures in the installer.",
          },
          {
            label: "Google Calendar",
            desc: "Link it with your secret iCal URL. No scripts, no weird code.",
          },
          {
            label: "Weather without API key",
            desc: "Open-Meteo with automatic location detection.",
          },
        ],
      },
      {
        title: "Full panel",
        items: [
          {
            label: "Customizable layout",
            desc: "Turn on edit mode, drag widgets around, and freely resize every card from the corner.",
          },
          {
            label: "Built-in YouTube",
            desc: "Search and play videos inside the dashboard, no links to paste.",
          },
          {
            label: "AI dock",
            desc: "ChatGPT, Gemini, Claude, Perplexity and Copilot with official icons.",
          },
          {
            label: "Local notes",
            desc: "Quick notepad plus short, curated bilingual daily quotes without internet dependency.",
          },
        ],
      },
    ],
    installTitle: "Install in 4 steps",
    install: [
      "Click «Download for Windows» above to download the latest installer (.exe).",
      "Run the file and follow the setup wizard. If Windows shows a security prompt, confirm to continue. That is normal for new desktop apps.",
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
        q: "How do I get the secret iCal address of my Google Calendar?",
        a: "To sync your calendar you paste the secret iCal address into Settings. That key is private: it stays on your PC only and Sideglass does not send it to any server we run; we cannot see it or read your events. Follow these steps from your computer (not available in the mobile app):",
        steps: [
          "Open Google Calendar: go to calendar.google.com in your browser.",
          "Open your calendar settings: in the left sidebar, scroll to «Settings for my calendars» and click the name of the calendar you want to sync.",
          "Go to the integration section: in the menu that opens on the left, click «Integrate calendar».",
          "Copy the secret address: find the «Secret address in iCal format» box and click the copy icon (the two sheets) to the right of the link.",
          "Paste that URL into Sideglass Settings, in the Google Calendar (iCal) field.",
        ],
        note: "Privacy: the iCal URL is stored in Sideglass local settings on your computer. There is no cloud database and the project does not log your link. Do not share it with others either: anyone with the link can view your calendar without a password. If it leaks, use «Reset» in Google Calendar to generate a new URL.",
      },
      {
        q: "How do I see real CPU and GPU temperatures?",
        a: "Sideglass ships with an integrated sensor service that runs in the background and reads temperatures via WMI. For the CPU temperature, Windows will ask for administrator permission on launch (the service needs it to read that sensor); accept it and the °C will appear within a few seconds.",
      },
      {
        q: "Can I resize the widgets?",
        a: "Yes. Click the customization button in the title bar, drag widgets to reorder them, and use the bottom corner of each card to resize it freely. Clock, weather, agenda, and YouTube adapt their content to the available size. Sideglass saves the layout on your PC.",
      },
      {
        q: "How do I watch YouTube?",
        a: "In the YouTube widget, type what you want to find and press Search: results show inside the panel. Click a video and it plays embedded, without leaving Sideglass.",
      },
      {
        q: "Is it open source?",
        a: "Yes. Source on GitHub under the MIT license: use, study, modify and share freely. A star or pull request helps the project get seen.",
      },
    ],
    changelogTitle: "Latest version",
    changelogSubtitle: "Recent highlights. Full history is on GitHub.",
    changelogLink: "View all releases on GitHub",
    changelogEmpty:
      "No changelog entries in this deployment. Edit CHANGELOG.md and redeploy the site.",
    footerDeveloped: "Developed by",
    footerReportIssue: "Something broken? Open a GitHub issue",
    keywords: [
      "second monitor dashboard",
      "windows desktop panel",
      "hardware monitor temperatures",
      "tauri nextjs app",
      "weather calendar widget windows",
    ],
  },
}
