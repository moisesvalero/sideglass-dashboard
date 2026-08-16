export type LandingLang = "es" | "en" | "zh"

type Feature = { label: string; desc: string }
type FeatureGroup = { title: string; items: Feature[] }
type Faq = { q: string; a: string; steps?: string[]; code?: string; note?: string }

export type LandingCopy = {
  htmlLang: string
  metaTitle: string
  metaDescription: string
  ogDescription: string
  eyebrow: string
  heroTitle: string[]
  heroSubtitle: string
  ctaDownload: string
  ctaGithubStar: string
  ctaWinget: string
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
  footerCookies: string
  footerDeveloped: string
  footerReportIssue: string
  footerSupport: string
  keywords: string[]
}

export const landingContent: Record<LandingLang, LandingCopy> = {
  es: {
    htmlLang: "es",
    metaTitle: "Dashboard para monitor secundario en Windows",
    metaDescription:
      "Sideglass es un dashboard gratuito para monitor secundario en Windows: clima, Google Calendar, CPU/GPU con temperaturas, YouTube, notas y dock de IAs. Descarga el instalador o usa WinGet.",
    ogDescription:
      "Dashboard gratuito y source available para monitor secundario en Windows: clima, calendario, hardware, YouTube e IAs en un solo panel.",
    eyebrow: "Escritorio · Windows · Source available",
    heroTitle: ["Todo lo importante,", "siempre a la vista"],
    heroSubtitle:
      "Sideglass reúne clima, agenda, hardware, notas y accesos rápidos en un dashboard limpio para tu monitor secundario, sin apartarte de lo que estás haciendo.",
    ctaDownload: "Descargar para Windows",
    ctaGithubStar: "Dale una estrella en GitHub",
    ctaWinget: "También desde WinGet",
    heroNote: "Gratis para uso personal",
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
            desc: "CPU, RAM, GPU y disco en tiempo real, con temperaturas reales cuando activas los sensores.",
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
            desc: "ChatGPT, Gemini, Claude, Perplexity, Copilot y Grok con iconos oficiales.",
          },
          {
            label: "Notas locales",
            desc: "Bloc rápido guardado en tu PC, pensado para apuntes breves sin depender de internet.",
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
        a: "Tienes dos formas de instalarlo:",
        steps: [
          "Instalador: descarga el instalador desde el botón de arriba, ejecútalo y sigue los pasos del asistente. La primera vez puedes elegir la carpeta de instalación.",
          "WinGet: abre PowerShell o Terminal en Windows y ejecuta este comando:",
        ],
        code: "winget install Sideglass",
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
        a: "En el widget de YouTube escribe lo que quieras buscar y pulsa Buscar: se muestran los resultados dentro del panel. Haz clic en un video y se reproduce embebido, sin salir de Sideglass. También puedes arrastrar una URL de YouTube desde el navegador y soltarla en el widget para ver el video al instante.",
      },
      {
        q: "¿Puedo ver el código?",
        a: "Sí. El código está disponible en GitHub bajo PolyForm Noncommercial 1.0.0 para uso no comercial, aprendizaje y contribuciones al proyecto oficial. El uso comercial requiere permiso escrito.",
      },
    ],
    changelogTitle: "Última versión",
    changelogSubtitle:
      "Mejoras recientes explicadas sin jerga. El historial completo esta en GitHub.",
    changelogLink: "Ver todas las versiones en GitHub",
    changelogEmpty:
      "No hay entradas de changelog en este despliegue. Edita CHANGELOG.es.md y vuelve a desplegar la web.",
    footerCookies: "Política de cookies",
    footerDeveloped: "Desarrollado por",
    footerReportIssue: "¿Algo no funciona? Abre un issue en GitHub",
    footerSupport: "Apoya el proyecto",
    keywords: [
      "dashboard monitor secundario windows",
      "aplicacion monitor secundario",
      "panel escritorio windows gratis",
      "widget clima calendario windows",
      "monitor hardware cpu gpu temperatura",
      "alternativa rainmeter windows 11",
      "desk setup monitor vertical",
      "dashboard tauri nextjs",
      "sideglass",
    ],
  },
  en: {
    htmlLang: "en",
    metaTitle: "Second-monitor dashboard for Windows",
    metaDescription:
      "Sideglass is a free Windows dashboard for your second monitor: weather, Google Calendar, CPU/GPU temps, YouTube, notes and an AI dock. Download the installer or use WinGet.",
    ogDescription:
      "Free, source-available second-monitor dashboard for Windows: weather, calendar, hardware, YouTube and AI shortcuts in one panel.",
    eyebrow: "Desktop · Windows · Source available",
    heroTitle: ["Everything that matters,", "always in view"],
    heroSubtitle:
      "Sideglass keeps weather, agenda, hardware, notes, YouTube and AI shortcuts in a clean dashboard for your second monitor, without pulling you away from your main screen.",
    ctaDownload: "Download for Windows",
    ctaGithubStar: "Star on GitHub",
    ctaWinget: "Also via WinGet",
    heroNote: "Free for personal use",
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
            desc: "Real-time CPU, RAM, GPU and disk usage, with real temperatures when sensors are enabled.",
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
            desc: "ChatGPT, Gemini, Claude, Perplexity, Copilot, and Grok with official icons.",
          },
          {
            label: "Local notes",
            desc: "A quick notepad saved on your PC, built for short notes without relying on the internet.",
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
        a: "You can install it in two ways:",
        steps: [
          "Installer: download from the button above, run it and follow the setup wizard. On first install you can choose the install folder.",
          "WinGet: open PowerShell or Windows Terminal and run:",
        ],
        code: "winget install Sideglass",
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
        a: "In the YouTube widget, type what you want to find and press Search: results show inside the panel. Click a video and it plays embedded, without leaving Sideglass. You can also drag a YouTube URL from your browser and drop it on the widget to play the video right away.",
      },
      {
        q: "Can I view the source code?",
        a: "Yes. The source is available on GitHub under PolyForm Noncommercial 1.0.0 for noncommercial use, learning, and contributions to the official project. Commercial use requires written permission.",
      },
    ],
    changelogTitle: "Latest version",
    changelogSubtitle: "Recent improvements, explained without jargon. Full history is on GitHub.",
    changelogLink: "View all releases on GitHub",
    changelogEmpty:
      "No changelog entries in this deployment. Edit CHANGELOG.md and redeploy the site.",
    footerCookies: "Cookie policy",
    footerDeveloped: "Developed by",
    footerReportIssue: "Something broken? Open a GitHub issue",
    footerSupport: "Support the project",
    keywords: [
      "second monitor dashboard windows",
      "secondary monitor always on display",
      "windows desktop widget panel",
      "hardware monitor cpu gpu temperature",
      "rainmeter alternative windows 11",
      "vertical monitor desk setup",
      "weather calendar widget windows",
      "tauri nextjs desktop app",
      "sideglass",
    ],
  },
  zh: {
    htmlLang: "zh",
    metaTitle: "Windows 副屏仪表盘",
    metaDescription:
      "Sideglass 是一款免费的 Windows 副屏仪表盘：天气、Google 日历、CPU/GPU 温度、YouTube、笔记和 AI 面板。下载安装包或使用 WinGet。",
    ogDescription:
      "免费、开放源码的 Windows 副屏仪表盘：天气、日历、硬件、YouTube 和 AI 快捷方式，全部集中在一个面板。",
    eyebrow: "桌面 · Windows · 开放源码",
    heroTitle: ["所有重要信息，", "尽收眼底"],
    heroSubtitle:
      "Sideglass 将天气、日程、硬件、笔记、YouTube 和 AI 快捷方式整合成一个简洁的副屏仪表盘，让你无需离开主屏即可一览所有信息。",
    ctaDownload: "下载 Windows 版",
    ctaGithubStar: "在 GitHub 上点个星",
    ctaWinget: "也可以通过 WinGet 安装",
    heroNote: "个人使用免费",
    heroVideoPlayLabel: "播放 Sideglass 视频",
    navFaq: "帮助",
    screenshotsTitle: "真实截图",
    screenshotsSubtitle:
      "专为竖屏或横屏副屏设计的自适应界面，支持浅色和深色模式，采用 macOS 风格的材质效果。",
    screenshotLabels: {
      portraitDark: "竖屏 · 深色",
      portraitLight: "竖屏 · 浅色",
      landscapeDark: "横屏 · 自定义布局",
    },
    screenshotAlts: {
      portraitDark: "Sideglass 在竖屏显示器上，深色模式",
      portraitLight: "Sideglass 在竖屏显示器上，浅色模式",
      landscapeDark: "Sideglass 在横屏显示器上，带可调整大小的小组件",
    },
    featuresTitle: "功能一览",
    featureGroups: [
      {
        title: "每日信息",
        items: [
          {
            label: "原生硬件监控",
            desc: "实时显示 CPU、内存、GPU 和磁盘使用率，启用传感器后可显示真实温度。",
          },
          {
            label: "Google 日历",
            desc: "使用你的私密 iCal 网址连接，无需脚本，无需复杂配置。",
          },
          {
            label: "无需 API 密钥的天气",
            desc: "Open-Meteo，支持自动定位。",
          },
        ],
      },
      {
        title: "完整面板",
        items: [
          {
            label: "可自定义布局",
            desc: "开启编辑模式，拖动小组件，并从卡片边角自由调整大小。",
          },
          {
            label: "内置 YouTube",
            desc: "在仪表盘内直接搜索和播放视频，无需粘贴链接。",
          },
          {
            label: "AI 面板",
            desc: "ChatGPT、Gemini、Claude、Perplexity、Copilot 和 Grok，使用官方图标。",
          },
          {
            label: "本地笔记",
            desc: "保存在电脑上的快速便签，无需联网即可记录简短内容。",
          },
        ],
      },
    ],
    installTitle: "4 步完成安装",
    install: [
      "点击上方「下载 Windows 版」：将下载最新版本的安装程序（.exe）。",
      "运行安装文件并按照向导操作。如果 Windows 显示安全提示，请确认继续；新桌面应用出现该提示属正常现象。",
      "可选：在设置中粘贴你的 Google 日历 iCal 网址，即可查看今日日程。",
      "在设置中可以开启随 Windows 启动，以及用于显示/隐藏面板的全局快捷键。",
    ],
    faqTitle: "常见问题",
    faq: [
      {
        q: "什么是 Sideglass？",
        a: "一款桌面应用（Tauri + Next.js），可以固定在副屏上（竖屏或横屏），集中展示你每天最常用的信息。",
      },
      {
        q: "如何在 Windows 上安装 Sideglass？",
        a: "有两种安装方式：",
        steps: [
          "安装程序：点击上方按钮下载安装包，运行并按照向导操作。首次安装时可以选择安装目录。",
          "WinGet：打开 PowerShell 或 Windows Terminal，运行以下命令：",
        ],
        code: "winget install Sideglass",
      },
      {
        q: "如何获取 Google 日历的 iCal 私密地址？",
        a: "要同步日历，你需要在设置中粘贴 iCal 格式的私密地址。该密钥属于私密信息：它只保存在你的电脑上，Sideglass 不会将其发送到我们运行的任何服务器；我们无法查看它，也无法读取你的事件。请在电脑上按以下步骤操作（手机应用中不可用）：",
        steps: [
          "打开 Google 日历：在浏览器中访问 calendar.google.com。",
          "打开你的日历设置：在左侧边栏中，滚动到「我的日历的设置」，点击要同步的日历名称。",
          "进入集成设置：在左侧展开的菜单中，点击「集成日历」。",
          "复制私密地址：找到「iCal 格式的私密地址」输入框，点击链接右侧的复制图标（两个叠放的页面）。",
          "将该网址粘贴到 Sideglass 设置的「Google 日历 (iCal)」字段中。",
        ],
        note: "隐私说明：iCal 网址仅保存在你电脑上 Sideglass 的本地设置中。项目没有云端数据库，也不会记录你的链接。请勿将链接分享给他人：任何人拿到链接都可以无需密码查看你的日历。如果泄露，请在 Google 日历中使用「重置」生成新的网址。",
      },
      {
        q: "如何查看真实的 CPU 和 GPU 温度？",
        a: "Sideglass 自带传感器服务，会在后台运行并通过 WMI 读取温度。要显示 CPU 温度，Windows 会在启动时请求管理员权限（该服务需要此权限才能读取该传感器）；接受后，几秒钟内就会显示温度数值。",
      },
      {
        q: "可以调整小组件的大小吗？",
        a: "可以。点击标题栏中的自定义按钮，拖动小组件重新排列，并使用每张卡片底部的边角自由调整大小。时钟、天气、日程和 YouTube 会自适应可用空间。Sideglass 会将布局保存在你的电脑上。",
      },
      {
        q: "如何观看 YouTube？",
        a: "在 YouTube 小组件中输入想搜索的内容并点击搜索：结果会显示在面板内。点击视频即可内嵌播放，无需离开 Sideglass。你也可以从浏览器拖拽 YouTube 网址到小组件上，立即播放视频。",
      },
      {
        q: "可以查看源代码吗？",
        a: "可以。源代码以 PolyForm Noncommercial 1.0.0 许可在 GitHub 上开放，可用于非商业用途、学习以及对官方项目的贡献。商业使用需要书面许可。",
      },
    ],
    changelogTitle: "最新版本",
    changelogSubtitle: "最近的改进，用通俗的语言说明。完整历史请查看 GitHub。",
    changelogLink: "在 GitHub 上查看所有版本",
    changelogEmpty: "此部署中没有更新日志条目。请编辑 CHANGELOG.md 并重新部署网站。",
    footerCookies: "Cookie 政策",
    footerDeveloped: "开发者",
    footerReportIssue: "遇到问题？在 GitHub 上提交 issue",
    footerSupport: "支持本项目",
    keywords: [
      "windows 副屏仪表盘",
      "副屏常显桌面面板",
      "windows 桌面小组件",
      "cpu gpu 温度监控",
      "rainmeter 替代 windows 11",
      "竖屏显示器桌面布局",
      "天气日历小组件 windows",
      "tauri nextjs 桌面应用",
      "sideglass",
    ],
  },
}
