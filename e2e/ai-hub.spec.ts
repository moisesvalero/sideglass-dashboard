import { test, expect } from "@playwright/test"

test.describe("ai hub smoke", () => {
  test("loads shell and lists AI platforms including Grok", async ({ page }) => {
    await page.goto("/ai-hub?tab=chatgpt")
    await expect(page.getByText("AI Hub", { exact: true })).toBeVisible()
    await expect(page.getByRole("button", { name: "ChatGPT" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Gemini" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Claude" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Grok" })).toBeVisible()
  })

  test("sidebar tab switch updates active item", async ({ page }) => {
    await page.goto("/ai-hub?tab=chatgpt")
    await page.getByRole("button", { name: "Gemini" }).click()
    const gemini = page.getByRole("button", { name: "Gemini" })
    await expect(gemini).toHaveClass(/bg-accent/)
    const chatgpt = page.getByRole("button", { name: "ChatGPT" })
    await expect(chatgpt).not.toHaveClass(/bg-accent/)
  })

  test("ai dock widget renders on dashboard even when legacy localStorage lacks 'ai' in widgetOrder", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      // Simulate legacy v0.2.29 localStorage without 'ai' in widgetOrder
      localStorage.setItem(
        "dashboard-settings",
        JSON.stringify({
          widgetOrder: ["time", "motivation", "notes", "calendar", "hardware", "music"],
          widgetLayouts: {
            time: { cols: 4, rows: 10 },
            hardware: { cols: 4, rows: 8 },
          },
        })
      )
    })
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" })
    await expect(page.locator('[data-widget-id="ai"]')).toBeVisible()
    await expect(page.getByText("Grok")).toBeVisible()
  })
})
