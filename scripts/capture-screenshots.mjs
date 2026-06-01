import { chromium } from "playwright"
import { spawn } from "node:child_process"
import { mkdir } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const outDir = path.join(root, "public", "screenshots")
const staticPort = Number(process.env.SCREENSHOT_PORT || 3456)
const baseURL =
  process.env.SCREENSHOT_URL || `http://127.0.0.1:${staticPort}/dashboard`

function demoSettings(theme, { compact = false } = {}) {
  return {
    weatherCity: "London",
    useAutoLocation: false,
    tempUnit: "celsius",
    timeFormat: "24",
    theme,
    calendarIcalUrl: "",
    widgetOrder: compact
      ? ["time", "calendar", "motivation", "hardware"]
      : ["time", "calendar", "motivation", "hardware", "notes", "music"],
    showCalendar: true,
    showMotivation: true,
    showHardware: true,
    showNotes: !compact,
    showMusic: !compact,
    autostart: false,
    globalHotkey: "CommandOrControl+Shift+D",
    calendarNotifications: true,
  }
}

const demoNotes = JSON.stringify([
  { id: "a1", text: "Review the dashboard PR", createdAt: Date.now() },
  { id: "a2", text: "Secondary monitor in portrait", createdAt: Date.now() },
])

const today = new Date()
const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
const demoQuote = JSON.stringify({
  date: todayKey,
  quote: {
    text: "Discipline is the bridge between goals and accomplishment.",
    author: "Jim Rohn",
  },
})

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

async function seedPage(page, theme, { compact = false } = {}) {
  await page.addInitScript(
    ({ settings, notes, quote, lang }) => {
      localStorage.setItem("dashboard-settings", JSON.stringify(settings))
      localStorage.setItem("dashboard-notes", notes)
      localStorage.setItem("daily-quote", quote)
      localStorage.setItem("dashboard-lang", lang)
    },
    {
      settings: demoSettings(theme, { compact }),
      notes: demoNotes,
      quote: demoQuote,
      lang: "en",
    }
  )
}

async function capture(page, fileName, viewport) {
  await page.setViewportSize(viewport)
  await page.evaluate(() => {
    window.scrollTo(0, 0)
    const scroller = document.querySelector(".dashboard-scroll")
    if (scroller) scroller.scrollTop = 0
  })
  await page.waitForTimeout(2500)
  // Viewport only — fullPage stitches scroll height and pins fixed UI (dock) mid-frame.
  await page.screenshot({
    path: path.join(outDir, fileName),
    fullPage: false,
  })
  console.log("Saved", fileName)
}

async function main() {
  await mkdir(outDir, { recursive: true })

  let server
  if (!process.env.SCREENSHOT_URL) {
    server = startStaticServer()
    await waitForServer(baseURL)
    console.log("Serving static export at", baseURL)
  }

  const browser = await chromium.launch()

  try {
    for (const theme of ["dark", "light"]) {
      const portraitPage = await browser.newPage({ deviceScaleFactor: 2 })
      await seedPage(portraitPage, theme, { compact: true })
      await portraitPage.goto(baseURL, { waitUntil: "networkidle", timeout: 60_000 })
      await capture(portraitPage, `portrait-${theme}.png`, { width: 480, height: 980 })
      await portraitPage.close()

      if (theme === "dark") {
        const landscapePage = await browser.newPage({ deviceScaleFactor: 2 })
        await seedPage(landscapePage, theme)
        await landscapePage.goto(baseURL, { waitUntil: "networkidle", timeout: 60_000 })
        await capture(landscapePage, "landscape-dark.png", { width: 1120, height: 780 })
        await landscapePage.close()
      }
    }
  } finally {
    await browser.close()
    server?.kill("SIGTERM")
  }

  console.log("Done. Output:", outDir)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
