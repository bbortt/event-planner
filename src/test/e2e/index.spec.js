const { it, test, expect } = require('@playwright/test');

test('should load the landing page', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('h1')).toContainText('Willkommä bim Event Planer!');
});
