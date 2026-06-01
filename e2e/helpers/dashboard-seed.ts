import type { Page } from "@playwright/test"

export const DEMO_SETTINGS = {
  weatherCity: "Madrid",
  useAutoLocation: false,
  tempUnit: "celsius" as const,
  timeFormat: "24" as const,
  theme: "dark" as const,
  calendarIcalUrl: "",
  widgetOrder: ["time", "hardware", "calendar", "motivation", "notes", "music"],
  widgetLayouts: {
    time: { cols: 4, rows: 9 },
    hardware: { cols: 4, rows: 16 },
    calendar: { cols: 2, rows: 9 },
    motivation: { cols: 2, rows: 7 },
    notes: { cols: 2, rows: 10 },
    music: { cols: 4, rows: 16 },
  },
  showCalendar: true,
  showMotivation: true,
  showHardware: true,
  showNotes: true,
  showMusic: true,
  autostart: false,
  globalHotkey: "CommandOrControl+Shift+D",
  calendarNotifications: true,
}

export async function seedDashboard(page: Page, theme: "dark" | "light" = "dark") {
  await page.addInitScript(
    (settings) => {
      localStorage.setItem("dashboard-settings", JSON.stringify(settings))
      localStorage.setItem("dashboard-lang", "es")
      localStorage.setItem("dashboard-notes", "[]")
    },
    { ...DEMO_SETTINGS, theme }
  )
}
