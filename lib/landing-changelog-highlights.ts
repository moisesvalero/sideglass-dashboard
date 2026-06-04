import type { LandingLang } from "@/lib/landing-content"

const landingHighlights: Record<string, Record<LandingLang, string[]>> = {
  "0.2.25": {
    es: [
      "El clima encuentra mejor tu ciudad, incluso si esta guardada con provincia y pais.",
      "Si Windows bloquea la ubicacion automatica, Sideglass usa tu ciudad guardada y sigue funcionando.",
    ],
    en: [
      "Weather now finds your city more reliably, even when it is saved with region and country.",
      "If Windows blocks automatic location, Sideglass uses your saved city and keeps working.",
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
  },
}

export function getLandingChangelogHighlights(version: string, lang: LandingLang) {
  return landingHighlights[version]?.[lang] ?? null
}
