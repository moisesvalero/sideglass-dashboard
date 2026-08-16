import type { LandingLang } from "@/lib/landing-content"

const landingHighlights: Record<string, Record<LandingLang, string[]>> = {
  "0.2.28": {
    es: ["La app vuelve a detectar correctamente las actualizaciones desde Sideglass."],
    en: ["The app can correctly detect updates from inside Sideglass again."],
    zh: ["应用现在可以正确地从 Sideglass 内部检测更新了。"],
  },
  "0.2.27": {
    es: [
      "Arrastrar enlaces de YouTube desde Chrome o Edge ahora funciona tambien en la app de escritorio.",
    ],
    en: ["Dragging YouTube links from Chrome or Edge now works in the desktop app too."],
    zh: ["从 Chrome 或 Edge 拖拽 YouTube 链接到桌面应用现在也可以正常工作了。"],
  },
  "0.2.26": {
    es: [
      "Arrastra un enlace de YouTube al widget y el video se reproduce dentro de Sideglass.",
      "Tambien puedes pegar una URL de YouTube en el buscador y abrirla al momento.",
    ],
    en: [
      "Drop a YouTube link onto the widget and the video plays inside Sideglass.",
      "You can also paste a YouTube URL into search and open it instantly.",
    ],
    zh: [
      "将 YouTube 链接拖到小组件上，视频即可在 Sideglass 内播放。",
      "你也可以将 YouTube 网址粘贴到搜索框中，立即打开。",
    ],
  },
  "0.2.25": {
    es: [
      "El clima encuentra mejor tu ciudad, incluso si esta guardada con provincia y pais.",
      "Si Windows bloquea la ubicacion automatica, Sideglass usa tu ciudad guardada y sigue funcionando.",
    ],
    en: [
      "Weather now finds your city more reliably, even when it is saved with region and country.",
      "If Windows blocks automatic location, Sideglass uses your saved city and keeps working.",
    ],
    zh: [
      "天气现在能更可靠地定位你的城市，即使保存时带有省份和国家。",
      "如果 Windows 阻止自动定位，Sideglass 会使用你保存的城市并继续正常工作。",
    ],
  },
  "0.2.24": {
    es: [
      "Sideglass recuerda mejor en que monitor estaba y vuelve a abrirse donde lo dejaste.",
      "Los accesos al clima, agenda y YouTube ahora se sienten claramente clicables.",
    ],
    en: [
      "Sideglass remembers the monitor you used and opens back where you left it.",
      "Weather, calendar and YouTube shortcuts now feel clearly clickable.",
    ],
    zh: [
      "Sideglass 会记住你上次使用的显示器，并在原位置重新打开。",
      "天气、日程和 YouTube 的快捷入口现在点击手感更清晰。",
    ],
  },
  "0.2.23": {
    es: [
      "El layout inicial queda mas equilibrado en monitores verticales y horizontales.",
      "El reloj y el clima dejan de pelearse por el espacio cuando haces grande la tarjeta.",
      "Puedes abrir el detalle del clima, Google Calendar o YouTube con un clic.",
    ],
    en: [
      "The default layout feels more balanced on both portrait and landscape monitors.",
      "Clock and weather no longer fight for space when the card gets large.",
      "Weather details, Google Calendar and YouTube open with one click.",
    ],
    zh: [
      "默认布局在竖屏和横屏显示器上都更加均衡。",
      "卡片放大时，时钟和天气不再互相抢占空间。",
      "一键即可打开天气详情、Google 日历或 YouTube。",
    ],
  },
  "0.2.22": {
    es: [
      "El estado del sistema gana una metrica util: uso real del disco principal.",
      "El dashboard se ajusta mejor a la ventana, sin convertirse en una pagina larga con scroll.",
      "La frase del dia y la tipografia de la app se sienten mas cuidadas.",
    ],
    en: [
      "System status now includes a useful metric: real primary disk usage.",
      "The dashboard fits the window better instead of becoming a long scrolling page.",
      "Daily quotes and app typography feel more polished.",
    ],
    zh: [
      "系统状态新增实用指标：主磁盘真实使用率。",
      "仪表盘更好地适配窗口，不再变成需要滚动的一长页。",
      "每日一言和应用字体排版更加精致。",
    ],
  },
  "0.2.21": {
    es: [
      "La frase del dia funciona sin internet y cambia entre espanol e ingles segun el idioma.",
      "Las notas y la frase diaria se adaptan mejor cuando haces pequenas sus tarjetas.",
    ],
    en: [
      "Daily quotes work offline and switch between English and Spanish with the app language.",
      "Notes and daily quotes adapt better when their cards are made smaller.",
    ],
    zh: [
      "每日一言支持离线使用，并会随应用语言在中文、英文和西班牙文之间切换。",
      "笔记和每日一言在卡片缩小后适配得更好。",
    ],
  },
  "0.2.20": {
    es: [
      "Reloj, clima, agenda y YouTube responden mejor al tamano real de cada tarjeta.",
      "YouTube ocupa menos alto por defecto y encaja mejor al final de un monitor vertical.",
      "La agenda vuelve a mostrar solo los proximos eventos sin salirse de su tarjeta.",
    ],
    en: [
      "Clock, weather, agenda and YouTube respond better to the real size of each card.",
      "YouTube uses less height by default and fits better at the bottom of a portrait monitor.",
      "Agenda shows only the next events without spilling outside its card.",
    ],
    zh: [
      "时钟、天气、日程和 YouTube 能更好地响应每张卡片的实际大小。",
      "YouTube 默认占用更少高度，在竖屏显示器底部更协调。",
      "日程只显示接下来的事件，不再超出卡片范围。",
    ],
  },
}

export function getLandingChangelogHighlights(version: string, lang: LandingLang) {
  return landingHighlights[version]?.[lang] ?? null
}
