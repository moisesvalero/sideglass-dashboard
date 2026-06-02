import { test, expect } from "@playwright/test"
import { seedDashboard } from "./helpers/dashboard-seed"
import dailyQuotes from "../data/daily-quotes.json"

function icalDate(offsetDays: number, hour: number) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  d.setHours(hour, 0, 0, 0)
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}0000`
}

function demoIcalText() {
  const events = [
    ["vet", "Sansa veterinario", 1, 15],
    ["doctor", "Manolo medico", 2, 9],
    ["hair", "Peluquero", 3, 12],
    ["doctor-2", "Medico Virgi", 8, 10],
    ["hidden", "Evento extra", 10, 18],
  ]
    .map(
      ([uid, title, offset, hour]) => `BEGIN:VEVENT
UID:${uid}
DTSTART:${icalDate(Number(offset), Number(hour))}
DTEND:${icalDate(Number(offset), Number(hour) + 1)}
SUMMARY:${title}
END:VEVENT`
    )
    .join("\n")

  return `BEGIN:VCALENDAR
VERSION:2.0
${events}
END:VCALENDAR`
}

const resetLayoutSettings = {
  calendarIcalUrl: "/demo-calendar.ics",
  widgetOrder: ["time", "motivation", "notes", "calendar", "music", "hardware"],
  widgetLayouts: {
    time: { cols: 4, rows: 12 },
    motivation: { cols: 2, rows: 6 },
    notes: { cols: 2, rows: 6 },
    calendar: { cols: 4, rows: 10 },
    music: { cols: 3, rows: 9 },
    hardware: { cols: 4, rows: 9 },
  },
}

async function gridWidthRatio(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const grid = document.querySelector(".dashboard-grid")
    if (!grid) return 0
    const gridW = grid.getBoundingClientRect().width
    const shell = document.querySelector(".dashboard-scroll") ?? document.documentElement
    const shellW = shell.getBoundingClientRect().width
    return shellW > 0 ? gridW / shellW : 0
  })
}

test.describe("dashboard layout width", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const isResetLayoutTest = testInfo.title.includes("reset layout")
    if (isResetLayoutTest) {
      await page.route("**/demo-calendar.ics", (route) =>
        route.fulfill({
          status: 200,
          contentType: "text/calendar",
          body: demoIcalText(),
        })
      )
    }

    await seedDashboard(page, "dark", isResetLayoutTest ? resetLayoutSettings : {})
    await page.goto("/dashboard", { waitUntil: "networkidle" })
    await expect(page.locator(".dashboard-grid")).toBeVisible()
  })

  test("portrait monitor uses most of horizontal space (not ~520px column)", async ({ page }) => {
    const ratio = await gridWidthRatio(page)
    expect(ratio).toBeGreaterThan(0.88)
  })

  test("hero and hardware widgets are visible", async ({ page }) => {
    await expect(page.locator(".glass-hero")).toBeVisible()
    await expect(page.locator(".hardware-control-grid")).toBeVisible()
    await expect(page.getByText("DISK")).toBeVisible()
  })

  test("dashboard fits the viewport without page scroll", async ({ page }) => {
    const overflow = await page.evaluate(() => ({
      body: document.body.scrollHeight - window.innerHeight,
      document: document.documentElement.scrollHeight - window.innerHeight,
      dashboard: document.querySelector(".dashboard-scroll")?.scrollHeight ?? 0,
      viewport: document.querySelector(".dashboard-scroll")?.clientHeight ?? 0,
    }))

    expect(overflow.body).toBeLessThanOrEqual(2)
    expect(overflow.document).toBeLessThanOrEqual(2)
    expect(overflow.dashboard - overflow.viewport).toBeLessThanOrEqual(2)
  })

  test("customize mode exposes resize handles", async ({ page }) => {
    await page.waitForTimeout(1000)
    await page.getByTestId("customize-layout").dispatchEvent("click")
    await expect(page.locator(".dashboard-edit-toolbar")).toBeVisible()
    await expect(page.locator(".dashboard-resize-handle")).toHaveCount(6)
  })

  test("reset layout keeps calendar and youtube content inside cards", async ({ page }) => {
    await expect(page.locator(".calendar-event-row")).toHaveCount(3)
    await page.getByTestId("customize-layout").dispatchEvent("click")
    await page.getByRole("button", { name: "Restablecer layout" }).click()
    await expect(page.locator(".calendar-event-row")).toHaveCount(3)

    const overflow = await page.evaluate(() => {
      const calendar = document.querySelector<HTMLElement>(".calendar-widget")
      const music = document.querySelector<HTMLElement>(".music-widget")
      const motivation = document.querySelector<HTMLElement>(".motivation-card")
      const notes = document.querySelector<HTMLElement>(".notes-widget")
      return {
        calendar: calendar ? calendar.scrollHeight - calendar.clientHeight : 0,
        music: music ? music.scrollHeight - music.clientHeight : 0,
        motivation: motivation ? motivation.scrollHeight - motivation.clientHeight : 0,
        notes: notes ? notes.scrollHeight - notes.clientHeight : 0,
      }
    })

    expect(overflow.calendar).toBeLessThanOrEqual(2)
    expect(overflow.music).toBeLessThanOrEqual(2)
    expect(overflow.motivation).toBeLessThanOrEqual(2)
    expect(overflow.notes).toBeLessThanOrEqual(2)

    const notesControlsOverlap = await page.evaluate(() => {
      const shell = document.querySelector<HTMLElement>('[data-widget-id="notes"]')
      const add = shell?.querySelector<HTMLElement>(".notes-add-button")
      const drag = shell?.querySelector<HTMLElement>('[aria-label="Reordenar widget"]')
      if (!add || !drag) return false
      const a = add.getBoundingClientRect()
      const b = drag.getBoundingClientRect()
      return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
    })

    expect(notesControlsOverlap).toBe(false)
  })
})

test("daily quote dataset stays short, known and bilingual", () => {
  expect(dailyQuotes.length).toBeGreaterThanOrEqual(100)

  for (const quote of dailyQuotes) {
    expect(quote.author.length).toBeGreaterThan(2)
    expect(quote.text.en.length).toBeLessThanOrEqual(115)
    expect(quote.text.es.length).toBeLessThanOrEqual(125)
    expect(quote.text.en.split(/\s+/).length).toBeLessThanOrEqual(18)
    expect(quote.text.es.split(/\s+/).length).toBeLessThanOrEqual(18)
    expect(/[?�]/.test(quote.text.en)).toBe(false)
    expect(/[?�]/.test(quote.text.es)).toBe(false)
  }
})
