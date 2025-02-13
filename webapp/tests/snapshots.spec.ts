import { test, expect } from '@playwright/test';

let styles = ["primary", "secondary"]
let orientations = [{ name: "Portrait", width: 1080, height: 1920 }, { name: "Landscape", width: 1920, height: 1080 }]
let datetime = [
  { name: "No Selection", time: "2025-01-31 01:00:00" },
  { name: "Highlight", time: "2025-01-31 07:30:00" },
  { name: "Dhuhr", time: "2025-01-31 14:00:00" },
  { name: "Holyday", time: "2025-02-13 22:00:00" },
]

test.beforeEach(async ({ }, testInfo) => {
  testInfo.snapshotSuffix = '';
});


styles.forEach(style => {
  orientations.forEach(orientation => {
    datetime.forEach(datetime => {
      test(orientation.name + " " + datetime.name + " " + style, async ({ page }) => {
        await page.setViewportSize({ width: orientation.width, height: orientation.height });
        await page.goto("?style=" + style + "&mocktime=" + datetime.time + "&bgColor=#6C7C8B&mockfreeze=1");
        await expect(page.locator("body")).toContainText("Fajr");
        await expect(page.locator("body")).not.toContainText("00:00:00");
        await expect(page).toHaveScreenshot();
      });
    });
  });
});