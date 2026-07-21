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

async function mockWeather(page: import("@playwright/test").Page) {
  await page.route("**/v1/search**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        results: [
          {
            id: 2521582,
            name: "Alcoy",
            admin1: "Comunitat Valenciana",
            country: "España",
            latitude: 38.3452,
            longitude: -0.4815,
          },
        ],
      }),
    })
  )
  await page.route("**/v1/forecast**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        current: {
          temperature_2m: 30,
          relative_humidity_2m: 26,
          apparent_temperature: 30,
          weather_code: 0,
        },
      }),
    })
  )
  await page.route("**/v1/reverse**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ results: [{ name: "Alcoy" }] }),
    })
  )
}

async function layoutGeometry(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const rect = (selector: string) => {
      const el = document.querySelector<HTMLElement>(selector)
      if (!el) return null
      const r = el.getBoundingClientRect()
      return {
        x: r.x,
        y: r.y,
        w: r.width,
        h: r.height,
        right: r.right,
        bottom: r.bottom,
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
        scrollH: el.scrollHeight,
        clientH: el.clientHeight,
      }
    }
    const time = rect(".time-weather-time")
    const panel = rect(".time-weather-panel")
    const clock = document.querySelector<HTMLElement>(".time-weather-time")
    return {
      viewport: { w: window.innerWidth, h: window.innerHeight },
      time,
      panel,
      timeShell: rect('[data-widget-id="time"]'),
      motivation: rect('[data-widget-id="motivation"]'),
      notes: rect('[data-widget-id="notes"]'),
      calendar: rect('[data-widget-id="calendar"]'),
      hardware: rect('[data-widget-id="hardware"]'),
      music: rect('[data-widget-id="music"]'),
      clockClip: clock ? clock.scrollWidth - clock.clientWidth : 0,
      timePanelOverlap: Boolean(
        time &&
        panel &&
        !(
          time.right <= panel.x ||
          time.x >= panel.right ||
          time.bottom <= panel.y ||
          time.y >= panel.bottom
        )
      ),
    }
  })
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
    await mockWeather(page)
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
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" })
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

  test("default dashboard geometry does not overlap or flatten widgets", async ({ page }) => {
    await page.waitForTimeout(1000)
    const g = await layoutGeometry(page)

    expect(g.timePanelOverlap).toBe(false)
    expect(g.clockClip).toBeLessThanOrEqual(2)
    expect(g.timeShell?.h ?? 0).toBeGreaterThan(170)
    expect(g.calendar?.h ?? 0).toBeGreaterThan(160)
    expect(g.hardware?.h ?? 0).toBeGreaterThan(120)
    expect(g.music?.h ?? 0).toBeGreaterThan(120)
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

test.describe("first-run responsive defaults", () => {
  test.beforeEach(async ({ page }) => {
    await mockWeather(page)
    await page.context().grantPermissions(["geolocation"])
    await page.context().setGeolocation({ latitude: 38.3452, longitude: -0.4815 })
    await page.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem("dashboard-lang", "es")
    })
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" })
    await expect(page.locator(".dashboard-grid")).toBeVisible()
  })

  test("real default layout is attractive in each monitor orientation", async ({ page }) => {
    await page.waitForTimeout(1000)
    const g = await layoutGeometry(page)

    expect(g.timePanelOverlap).toBe(false)
    expect(g.clockClip).toBeLessThanOrEqual(2)
    expect(g.timeShell?.h ?? 0).toBeGreaterThan(260)
    expect(g.motivation?.h ?? 0).toBeGreaterThan(130)
    expect(g.notes?.h ?? 0).toBeGreaterThan(130)
    expect(g.calendar?.h ?? 0).toBeGreaterThan(240)
    expect(g.hardware?.h ?? 0).toBeGreaterThan(190)
    expect(g.music?.h ?? 0).toBeGreaterThan(190)
  })

  test("weather, calendar and YouTube open their detailed pages", async ({ page }) => {
    await page.addInitScript(() => {
      window.open = ((url: string) => {
        ;(window as unknown as { __openedUrls: string[] }).__openedUrls ??= []
        ;(window as unknown as { __openedUrls: string[] }).__openedUrls.push(String(url))
        return null
      }) as typeof window.open
    })
    await page.reload({ waitUntil: "domcontentloaded" })
    await page.waitForTimeout(1000)

    await page.locator(".time-weather-panel").click()
    await page.getByTitle("Google Calendar").click()
    await page.getByTitle("YouTube").click()

    const urls = await page.evaluate(
      () => (window as unknown as { __openedUrls?: string[] }).__openedUrls ?? []
    )
    expect(urls.some((url) => url.includes("google.com/search") && url.includes("weather"))).toBe(
      true
    )
    expect(urls).toContain("https://calendar.google.com/calendar/u/0/r")
    expect(urls).toContain("https://www.youtube.com/")
  })

  test("manual weather city selection fills the input", async ({ page }) => {
    await page.getByTitle("Ajustes").click()
    await page.getByLabel("Detectar ubicación automáticamente").uncheck()
    const input = page.getByPlaceholder("Escribe una ciudad (ej. Valencia)")
    await input.fill("Alc")
    await page.getByRole("button", { name: /Alcoy, Comunitat Valenciana, España/ }).click()

    await expect(input).toHaveValue("Alcoy, Comunitat Valenciana, España")
  })

  test("legacy localStorage containing removed widget IDs does not crash dashboard", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "dashboard-settings",
        JSON.stringify({
          widgetOrder: ["time", "motivation", "notes", "calendar", "hardware", "music", "ai"],
          widgetLayouts: {
            time: { cols: 4, rows: 10 },
            hardware: { cols: 4, rows: 8 },
            ai: { cols: 4, rows: 4 },
          },
        })
      )
    })
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" })
    await expect(page.locator(".dashboard-grid")).toBeVisible()
    await expect(page.getByText("This page couldn't load")).not.toBeVisible()
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
