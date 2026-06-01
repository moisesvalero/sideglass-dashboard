import { chromium } from "playwright"
import { mkdir } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const outDir = path.join(root, "public", "screenshots")
const baseURL = process.env.SCREENSHOT_URL || "http://localhost:3000/dashboard"

function demoSettings(theme) {
  return {
    weatherCity: "Madrid",
    useAutoLocation: false,
    tempUnit: "celsius",
    timeFormat: "24",
    theme,
    calendarIcalUrl: "",
    widgetOrder: ["time", "calendar", "motivation", "hardware", "notes", "music"],
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

const demoNotes = JSON.stringify([
  { id: "a1", text: "Revisar el PR del dashboard", createdAt: Date.now() },
  { id: "a2", text: "Monitor secundario en vertical", createdAt: Date.now() },
])

const today = new Date()
const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
const demoQuote = JSON.stringify({
  date: todayKey,
  quote: {
    text: "La disciplina es el puente entre las metas y los logros.",
    author: "Jim Rohn",
  },
})

async function seedPage(page, theme) {
  await page.addInitScript(
    ({ settings, notes, quote, lang }) => {
      localStorage.setItem("dashboard-settings", JSON.stringify(settings))
      localStorage.setItem("dashboard-notes", notes)
      localStorage.setItem("daily-quote", quote)
      localStorage.setItem("dashboard-lang", lang)
    },
    {
      settings: demoSettings(theme),
      notes: demoNotes,
      quote: demoQuote,
      lang: "es",
    }
  )
}

async function capture(page, fileName, viewport, options = {}) {
  await page.setViewportSize(viewport)
  await page.waitForTimeout(2000)
  await page.screenshot({
    path: path.join(outDir, fileName),
    fullPage: options.fullPage ?? true,
    ...options,
  })
  console.log("Saved", fileName)
}

async function main() {
  await mkdir(outDir, { recursive: true })
  const browser = await chromium.launch()

  for (const theme of ["dark", "light"]) {
    const page = await browser.newPage({ deviceScaleFactor: 2 })
    await seedPage(page, theme)
    await page.goto(baseURL, { waitUntil: "networkidle", timeout: 60_000 })

    await capture(page, `portrait-${theme}.png`, { width: 480, height: 980 })

    if (theme === "dark") {
      await capture(page, "landscape-dark.png", { width: 1120, height: 780 })
      await page.setViewportSize({ width: 480, height: 980 })
      await page.waitForTimeout(800)
      await page.screenshot({
        path: path.join(outDir, "hero.png"),
        clip: { x: 0, y: 0, width: 480, height: 820 },
      })
      console.log("Saved hero.png")
    }

    await page.close()
  }

  await browser.close()
  console.log("Done. Output:", outDir)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
