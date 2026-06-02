import type { Page } from "@playwright/test"

export const DEMO_SETTINGS = {
  weatherCity: "Madrid",
  useAutoLocation: false,
  tempUnit: "celsius" as const,
  timeFormat: "24" as const,
  theme: "dark" as const,
  calendarIcalUrl: "",
  widgetOrder: ["time", "motivation", "notes", "calendar", "hardware", "music"],
  widgetLayouts: {
    time: { cols: 4, rows: 10 },
    hardware: { cols: 4, rows: 8 },
    calendar: { cols: 4, rows: 10 },
    motivation: { cols: 2, rows: 6 },
    notes: { cols: 2, rows: 6 },
    music: { cols: 4, rows: 9 },
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

export async function seedDashboard(
  page: Page,
  theme: "dark" | "light" = "dark",
  overrides: Partial<typeof DEMO_SETTINGS> = {}
) {
  await page.addInitScript(
    (settings) => {
      localStorage.setItem("dashboard-settings", JSON.stringify(settings))
      localStorage.setItem("dashboard-lang", "es")
      localStorage.setItem("dashboard-notes", "[]")
    },
    { ...DEMO_SETTINGS, ...overrides, theme }
  )
}
