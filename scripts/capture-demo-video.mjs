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
UID:sideglass-design
DTSTART:${icalDate(0, 10)}
DTEND:${icalDate(0, 11)}
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
BEGIN:VEVENT
UID:sideglass-studio
DTSTART:${icalDate(2, 12)}
DTEND:${icalDate(2, 13)}
SUMMARY:Studio setup
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
      time: { cols: 3, rows: 12 },
      motivation: { cols: 1, rows: 8 },
      notes: { cols: 1, rows: 8 },
      calendar: { cols: 2, rows: 13 },
      hardware: { cols: 2, rows: 10 },
      music: { cols: 2, rows: 10 },
    },
    widgetOrder: ["time", "motivation", "notes", "calendar", "hardware", "music"],
    showCalendar: true,
    showMotivation: true,
    showHardware: true,
    showNotes: true,
    showMusic: true,
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

async function installDemoCursor(page) {
  await page.addStyleTag({
    content: `
      #sideglass-demo-cursor {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 2147483647;
        width: 22px;
        height: 22px;
        pointer-events: none;
        transform: translate3d(-80px, -80px, 0);
        filter: drop-shadow(0 12px 22px rgb(0 0 0 / 0.32));
        transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      #sideglass-demo-cursor::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 0;
        border-left: 17px solid white;
        border-top: 13px solid transparent;
        border-bottom: 13px solid transparent;
        transform: rotate(-18deg);
      }

      #sideglass-demo-cursor::after {
        content: "";
        position: absolute;
        left: 2px;
        top: 1px;
        width: 0;
        height: 0;
        border-left: 13px solid oklch(0.18 0.02 260);
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        transform: rotate(-18deg);
        opacity: 0.9;
      }

      #sideglass-demo-cursor.is-clicking {
        transition-duration: 120ms;
      }

      #sideglass-demo-cursor.is-clicking .demo-cursor-ring {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.8);
      }

      .demo-cursor-ring {
        position: absolute;
        left: 2px;
        top: 2px;
        width: 42px;
        height: 42px;
        border: 2px solid oklch(0.72 0.14 215 / 0.8);
        border-radius: 999px;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.4);
        transition:
          opacity 260ms ease-out,
          transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
      }
    `,
  })
  await page.evaluate(() => {
    const cursor = document.createElement("div")
    cursor.id = "sideglass-demo-cursor"
    const ring = document.createElement("span")
    ring.className = "demo-cursor-ring"
    cursor.append(ring)
    document.body.append(cursor)
  })
}

async function cursorMove(page, x, y, { steps = 18, wait = 360 } = {}) {
  await page.evaluate(
    ({ x, y }) => {
      document
        .getElementById("sideglass-demo-cursor")
        ?.style.setProperty("transform", `translate3d(${x}px, ${y}px, 0)`)
    },
    { x, y }
  )
  await page.mouse.move(x, y, { steps })
  await page.waitForTimeout(wait)
}

async function cursorClick(page, x, y) {
  await cursorMove(page, x, y, { steps: 12, wait: 120 })
  await page.evaluate(() =>
    document.getElementById("sideglass-demo-cursor")?.classList.add("is-clicking")
  )
  await page.mouse.down()
  await page.waitForTimeout(120)
  await page.mouse.up()
  await page.waitForTimeout(220)
  await page.evaluate(() =>
    document.getElementById("sideglass-demo-cursor")?.classList.remove("is-clicking")
  )
}

async function dragPointer(page, from, to, { steps = 30, hold = 140 } = {}) {
  await cursorMove(page, from.x, from.y, { steps: 12, wait: 120 })
  await page.evaluate(() =>
    document.getElementById("sideglass-demo-cursor")?.classList.add("is-clicking")
  )
  await page.mouse.down()
  await page.waitForTimeout(hold)
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const ease = 1 - Math.pow(1 - t, 3)
    const x = from.x + (to.x - from.x) * ease
    const y = from.y + (to.y - from.y) * ease
    await page.evaluate(
      ({ x, y }) => {
        document
          .getElementById("sideglass-demo-cursor")
          ?.style.setProperty("transform", `translate3d(${x}px, ${y}px, 0)`)
      },
      { x, y }
    )
    await page.mouse.move(x, y)
    await page.waitForTimeout(18)
  }
  await page.waitForTimeout(100)
  await page.mouse.up()
  await page.evaluate(() =>
    document.getElementById("sideglass-demo-cursor")?.classList.remove("is-clicking")
  )
}

async function centerOf(locator) {
  const box = await locator.boundingBox()
  if (!box) throw new Error("Element box not found")
  return { x: box.x + box.width / 2, y: box.y + box.height / 2, box }
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
    viewport: { width: 1440, height: 920 },
    deviceScaleFactor: 1,
    recordVideo: { dir: tempDir, size: { width: 1440, height: 920 } },
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
          { id: "a2", text: "Ship the next Sideglass build", createdAt: Date.now() },
        ]),
        lang: "en",
      }
    )

    await page.goto(baseURL, { waitUntil: "networkidle", timeout: 60_000 })
    await page.waitForTimeout(900)
    await installDemoCursor(page)
    await cursorMove(page, 980, 36, { wait: 450 })

    const customize = page.getByTestId("customize-layout")
    const customizePoint = await centerOf(customize)
    await cursorClick(page, customizePoint.x, customizePoint.y)
    await page.waitForTimeout(520)

    const timeHandle = page.locator('[data-widget-id="time"] .dashboard-resize-handle')
    const timePoint = await centerOf(timeHandle)
    await dragPointer(
      page,
      { x: timePoint.x, y: timePoint.y },
      { x: Math.min(timePoint.x + 360, 1330), y: Math.min(timePoint.y + 178, 720) },
      { steps: 36 }
    )
    await page.waitForTimeout(520)

    const musicDrag = page.locator('[data-widget-id="music"] [aria-label="Reorder widget"]')
    const hardwareDrag = page.locator('[data-widget-id="hardware"] [aria-label="Reorder widget"]')
    const musicPoint = await centerOf(musicDrag)
    const hardwarePoint = await centerOf(hardwareDrag)
    await dragPointer(
      page,
      { x: musicPoint.x, y: musicPoint.y },
      { x: hardwarePoint.x + 160, y: hardwarePoint.y - 34 },
      { steps: 32 }
    )
    await page.waitForTimeout(520)

    const hardwareHandle = page.locator('[data-widget-id="hardware"] .dashboard-resize-handle')
    const hardwareHandlePoint = await centerOf(hardwareHandle)
    await dragPointer(
      page,
      { x: hardwareHandlePoint.x, y: hardwareHandlePoint.y },
      { x: Math.min(hardwareHandlePoint.x + 240, 1330), y: hardwareHandlePoint.y + 74 },
      { steps: 24 }
    )
    await page.waitForTimeout(520)

    const notesDrag = page.locator('[data-widget-id="notes"] [aria-label="Reorder widget"]')
    const quoteDrag = page.locator('[data-widget-id="motivation"] [aria-label="Reorder widget"]')
    const notesPoint = await centerOf(notesDrag)
    const quotePoint = await centerOf(quoteDrag)
    await dragPointer(
      page,
      { x: notesPoint.x, y: notesPoint.y },
      { x: quotePoint.x + 210, y: quotePoint.y + 20 },
      { steps: 28 }
    )
    await page.waitForTimeout(420)

    await cursorMove(page, 1268, 786, { wait: 420 })
    await cursorMove(page, 1030, 474, { wait: 420 })
    await cursorMove(page, 1168, 36, { wait: 260 })
    await cursorClick(page, customizePoint.x, customizePoint.y)
    await page.waitForTimeout(900)

    await cursorMove(page, 1030, 780, { wait: 900 })

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
