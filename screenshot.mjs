import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const screenshotDir = join(__dirname, 'temporary screenshots');

if (!existsSync(screenshotDir)) {
  mkdirSync(screenshotDir, { recursive: true });
}

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const existing = existsSync(screenshotDir)
  ? readdirSync(screenshotDir).filter(f => /^screenshot-\d+/.test(f))
  : [];
const nums = existing.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1] || '0')).filter(n => !isNaN(n));
const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;

const filename = label ? `screenshot-${nextNum}-${label}.png` : `screenshot-${nextNum}.png`;
const outputPath = join(screenshotDir, filename);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0' });

// Unhide all scroll-reveal elements so full-page screenshots capture them
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('hidden');
    el.classList.add('in');
  });
  // Also handle any reveal-on-scroll pattern
  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    el.classList.add('revealed');
  });
});

await page.screenshot({ path: outputPath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${outputPath}`);
