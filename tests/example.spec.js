const { test, expect } = require('@playwright/test');
const { getLatestOtp } = require('./gmail');

test.use({ browserName: 'chromium' });

// const { chromium } = require('playwright');
// const browser = await chromium.launch({ headless: false });

// test.only('homepage has Playwright in title', async ({ page }, testInfo) => {
//   console.log('Browser / project:', testInfo.project.name);
//   await page.goto('https://playwright.dev/');
//   await expect(page).toHaveTitle(/Playwright/);
// });

test.only('Browser context playwright test', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://sso.teachable.com/secure/9521/identity/sign_up/otp?wizard_id=BEi7-P6ZvMXI1VOuPwFbEbrUvqeWbny-i7noy1y2ulZkZx3YM0UJs9RdXXRANTmTPoRj01DiK90cHelIe6hbpw");
  console.log(await page.title());
  await page.locator('#name').fill('test');
  await page.waitForTimeout(1000);
  await page.locator('#email').fill('sayantanipaltest@gmail.com');
  await page.waitForTimeout(1000);
  await page.locator('#allowMarketingEmails').check();
  await page.waitForTimeout(500);
  await page.locator('#otp-login-btn').click();

  // await page.waitForSelector('#otp', { state: 'visible', timeout: 20000 });
  // const otp = await getLatestOtp(
  //   'from:no-reply@rahulshettyacademy.com subject:OTP',
  //   /\\b(\\d{4,6})\\b/
  // );
  // await expect(otp).not.toBeNull();
  // await page.locator('#otp').fill(otp);
  // await expect(page.locator('#otp')).toHaveValue(otp);

  await page.waitForTimeout(1000);
});


test('homepage has Playwright in title', async ({ browser, page }) => {
  console.log( await browser.version());
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
  console.log(await page.title());
  await expect(page).toHaveTitle('Fast and reliable end-to-end testing for modern web apps | Playwright');

  
});

test('click on API', async ({ browser, page }) => {
  await page.goto('https://playwright.dev/docs/api/class-playwright');
  await expect(page).toHaveTitle(/Playwright/);
});

test('click on API and check for text', async ({ browser, page }) => {
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