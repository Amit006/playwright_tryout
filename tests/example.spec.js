const { test, expect } = require('@playwright/test');

test('homepage has Playwright in title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('click on API', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/api/class-playwright');
  await expect(page).toHaveTitle(/Playwright/);
});

test('click on API and check for text', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/api/class-playwright');
  await expect(page.locator('h1')).toHaveText('Playwright Library');
});
test('click on CLI and check for text', async ({ page }) => {
  await page.goto('https://playwright.dev/agent-cli/introduction');
  await expect(page.locator('h1')).toHaveText('Playwright CLI');
});
test('click on MCP and check for text', async ({ page }) => {
  await page.goto('https://playwright.dev/mcp/introduction');
  await expect(page.locator('h1')).toHaveText('Playwright MCP');
});
test('click on Docs and check for text', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');
  await expect(page.locator('h1')).toHaveText('Installation');
});
test('check for introduction text', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');
  await expect(page.locator('p').first()).toHaveText('Playwright Test is an end-to-end test framework for modern web apps. It bundles test runner, assertions, isolation, parallelization and rich tooling. Playwright supports Chromium, WebKit and Firefox on Windows, Linux and macOS, locally or in CI, headless or headed, with native mobile emulation for Chrome (Android) and Mobile Safari.');
});

test('intro page - verify installation section exists', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');
  await expect(page.getByRole('heading', { name: /Installation/ })).toBeVisible();
});

test('intro page - check for getting started link', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');
  const gettingStartedLink = page.getByRole('link', { name: /Getting started/ }).first();
  await expect(gettingStartedLink).toBeVisible();
});

test('intro page - verify code block exists', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');
  const codeBlocks = page.locator('pre code');
  await expect(codeBlocks.first()).toBeVisible();
});

test('intro page - click and verify navigation', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');
  const apiLink = page.getByRole('link', { name: /API/ }).first();
  await expect(apiLink).toBeVisible();
});

test('intro page - verify introduction anchor link exists', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');
  const introLink = page.locator('a[href="#introduction"]').first();
  await expect(introLink).toBeVisible();
});

test('intro page - click introduction anchor link', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');
  const introLink = page.getByRole('link', { name: 'Introduction', exact: true });
  await expect(introLink).toBeVisible();
  await introLink.click();
  await page.waitForTimeout(500);
  await expect(page).toHaveURL(/.*#introduction/);
});