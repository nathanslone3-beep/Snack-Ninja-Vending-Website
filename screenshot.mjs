import puppeteer from 'puppeteer';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const screenshotDir = join(__dirname, 'temporary screenshots');

if (!existsSync(screenshotDir)) {
  mkdirSync(screenshotDir, { recursive: true });
}

// Args: url [label] [--mobile] [--crop Y,HEIGHT]
// Examples:
//   node screenshot.mjs http://localhost:3000 home
//   node screenshot.mjs http://localhost:3000 hero --crop 0,900
//   node screenshot.mjs http://localhost:3000 mobile --mobile
const url = process.argv[2] || 'http://localhost:3000';
let label = '';
let mobile = false;
let crop = null; // { y, height }

for (let i = 3; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === '--mobile') {
    mobile = true;
  } else if (arg === '--crop') {
    const [y, h] = (process.argv[++i] || '0,900').split(',').map(Number);
    crop = { y, height: h };
  } else {
    label = arg;
  }
}

const existing = existsSync(screenshotDir)
  ? readdirSync(screenshotDir).filter(f => /^screenshot-\d+/.test(f))
  : [];
const nums = existing.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1] || '0')).filter(n => !isNaN(n));
const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;

const suffix = [label, mobile ? 'mobile' : '', crop ? `crop${crop.y}` : ''].filter(Boolean).join('-');
const filename = suffix ? `screenshot-${nextNum}-${suffix}.png` : `screenshot-${nextNum}.png`;
const outputPath = join(screenshotDir, filename);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

if (mobile) {
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
} else {
  await page.setViewport({ width: 1440, height: 900 });
}

await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

// Wait for web fonts to render
await page.evaluateHandle('document.fonts.ready');

// Trigger all scroll-reveal elements so full-page screenshots show all content
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
});

// Let CSS transitions settle after reveal
await new Promise(r => setTimeout(r, 500));

if (crop) {
  // Crop to a specific vertical region — useful for zooming in on sections
  const viewportWidth = mobile ? 390 : 1440;
  await page.screenshot({
    path: outputPath,
    clip: { x: 0, y: crop.y, width: viewportWidth, height: crop.height },
  });
} else {
  await page.screenshot({ path: outputPath, fullPage: true });
}

await browser.close();
console.log(`Screenshot saved: ${outputPath}`);
