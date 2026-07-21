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

  test("ai dock footer renders on dashboard with Grok button", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" })
    await expect(page.locator(".dashboard-dock-row")).toBeVisible()
    await expect(page.getByRole("button", { name: "Grok" })).toBeVisible()
  })
})
