import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('hidden');
    el.classList.add('in');
  });
});
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: 'temporary screenshots/screenshot-13-full-reveal.png', fullPage: true });
await browser.close();
console.log('Done');
