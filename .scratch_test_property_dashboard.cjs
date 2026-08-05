const { chromium } = require('playwright');
const path = require('path');
const SHOT_DIR = '/private/tmp/claude-501/-Users-rayyanshaikh-VSProjects-PMS-Frontend-pms-frontend/17f2e7ce-a304-4e2e-8a9e-95276308cd45/scratchpad';

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', (err) => consoleErrors.push('pageerror: ' + err.message));
  page.on('requestfinished', async (req) => { if (req.url().includes('/property/')) { const res = await req.response(); console.log('REQ', req.method(), req.url(), '->', res?.status()); } });

  await page.goto('http://localhost:5173/auth/sign-in', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[name="username"]', { timeout: 15000 });
  await page.fill('input[name="username"]', 'Marketing1@alwijha.net');
  await page.fill('input[name="password"]', '123456789');
  await page.click('button[type="submit"]');
  await page.waitForURL(/dashboards/, { timeout: 15000 });
  console.log('LOGIN OK');

  await page.goto('http://localhost:5173/property-dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('text=Property Dashboard', { timeout: 20000 });
  await page.waitForTimeout(15000);
  await page.screenshot({ path: path.join(SHOT_DIR, '57_property_dashboard.png'), fullPage: true });

  const bodyText = await page.textContent('body');
  console.log('CONTAINS "1500":', bodyText.includes('1500'));
  console.log('CONTAINS fake "574":', bodyText.includes('574'));
  console.log('CONTAINS fake "Silver Apartment":', bodyText.includes('Silver Apartment'));

  console.log('CONSOLE ERRORS:', JSON.stringify(consoleErrors, null, 2));
  await browser.close();
})();
