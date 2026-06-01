import { chromium } from "playwright"
import { spawn } from "node:child_process"
import { mkdir, rm } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const mediaDir = path.join(root, "public", "media")
const tempDir = path.join(root, ".tmp", "video")
const staticPort = Number(process.env.VIDEO_PORT || 3457)
const baseURL = process.env.VIDEO_URL || `http://127.0.0.1:${staticPort}/dashboard`

function icalDate(offsetDays, hour) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  d.setHours(hour, 0, 0, 0)
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}0000`
}

function demoIcalUrl() {
  const body = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:sideglass-standup
DTSTART:${icalDate(0, 10)}
DTEND:${icalDate(0, 10)}
SUMMARY:Design review
END:VEVENT
BEGIN:VEVENT
UID:sideglass-focus
DTSTART:${icalDate(0, 14)}
DTEND:${icalDate(0, 15)}
SUMMARY:Focus block
END:VEVENT
BEGIN:VEVENT
UID:sideglass-release
DTSTART:${icalDate(1, 9)}
DTEND:${icalDate(1, 10)}
SUMMARY:Release notes
END:VEVENT
END:VCALENDAR`
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`
}

function demoSettings() {
  return {
    weatherCity: "Madrid",
    useAutoLocation: false,
    tempUnit: "celsius",
    timeFormat: "24",
    theme: "dark",
    calendarIcalUrl: demoIcalUrl(),
    widgetLayouts: {
      time: { cols: 2, rows: 10 },
      hardware: { cols: 2, rows: 10 },
      calendar: { cols: 4, rows: 14 },
      notes: { cols: 2, rows: 10 },
      motivation: { cols: 4, rows: 10 },
      music: { cols: 4, rows: 12 },
    },
    widgetOrder: ["time", "hardware", "calendar", "notes", "motivation"],
    showCalendar: true,
    showMotivation: true,
    showHardware: true,
    showNotes: true,
    showMusic: false,
    autostart: false,
    globalHotkey: "CommandOrControl+Shift+D",
    calendarNotifications: true,
  }
}

async function waitForServer(url, attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) })
      if (res.ok) return
    } catch {
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  throw new Error(`Server not ready at ${url}`)
}

function startStaticServer() {
  return spawn("npx", ["serve", "out", "-l", String(staticPort), "--no-clipboard"], {
    cwd: root,
    shell: true,
    stdio: "ignore",
  })
}

async function main() {
  await mkdir(mediaDir, { recursive: true })
  await rm(tempDir, { recursive: true, force: true })
  await mkdir(tempDir, { recursive: true })

  let server
  if (!process.env.VIDEO_URL) {
    server = startStaticServer()
    await waitForServer(baseURL)
    console.log("Serving static export at", baseURL)
  }

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1280, height: 820 },
    deviceScaleFactor: 1,
    recordVideo: { dir: tempDir, size: { width: 1280, height: 820 } },
  })
  const page = await context.newPage()

  try {
    await page.addInitScript(
      ({ settings, notes, lang }) => {
        localStorage.setItem("dashboard-settings", JSON.stringify(settings))
        localStorage.setItem("dashboard-notes", notes)
        localStorage.setItem("dashboard-lang", lang)
      },
      {
        settings: demoSettings(),
        notes: JSON.stringify([
          { id: "a1", text: "Tune the studio monitor layout", createdAt: Date.now() },
          { id: "a2", text: "Ship Sideglass 0.2.18", createdAt: Date.now() },
        ]),
        lang: "en",
      }
    )

    await page.goto(baseURL, { waitUntil: "networkidle", timeout: 60_000 })
    await page.waitForTimeout(1200)

    const customize = page.getByRole("button", { name: "Customize layout" })
    await customize.click()
    await page.waitForTimeout(800)

    const timeHandle = page.locator(".dashboard-resize-handle").first()
    const box = await timeHandle.boundingBox()
    if (!box) throw new Error("Resize handle not found")

    const startX = box.x + box.width / 2
    const startY = box.y + box.height / 2
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(startX + 280, startY + 118, { steps: 24 })
    await page.waitForTimeout(250)
    await page.mouse.up()
    await page.waitForTimeout(700)

    await customize.click()
    await page.waitForTimeout(1200)

    await page.mouse.move(860, 720)
    await page.waitForTimeout(1000)

    const video = page.video()
    await page.close()
    await video?.saveAs(path.join(mediaDir, "sideglass-dashboard-demo.webm"))
    console.log("Saved sideglass-dashboard-demo.webm")
  } finally {
    await context.close()
    await browser.close()
    server?.kill("SIGTERM")
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
