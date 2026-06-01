import { test, expect } from "@playwright/test"
import { seedDashboard } from "./helpers/dashboard-seed"

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
  test.beforeEach(async ({ page }) => {
    await seedDashboard(page)
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
  })
})
