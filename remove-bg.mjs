import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, 'images', 'New logo 2.0.png');
const outputPath = path.join(__dirname, 'images', 'logo-hero.png');

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();

// Read the image as base64
const imgData = fs.readFileSync(inputPath).toString('base64');

const pngBase64 = await page.evaluate(async (b64) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const px = data.data;

      // Make near-white pixels transparent (white background removal)
      // Only remove pixels very close to pure white to preserve logo colors
      for (let i = 0; i < px.length; i += 4) {
        const r = px[i], g = px[i + 1], b = px[i + 2];
        if (r > 250 && g > 250 && b > 250) {
          px[i + 3] = 0; // fully transparent — essentially pure white
        } else if (r > 240 && g > 240 && b > 240) {
          // Tight feather only on near-pure-white edge pixels
          const whiteness = Math.min(r, g, b);
          px[i + 3] = Math.round((1 - (whiteness - 240) / 10) * 255);
        }
      }

      ctx.putImageData(data, 0, 0);
      resolve(canvas.toDataURL('image/png').split(',')[1]);
    };
    img.src = 'data:image/png;base64,' + b64;
  });
}, imgData);

fs.writeFileSync(outputPath, Buffer.from(pngBase64, 'base64'));
await browser.close();
console.log('Saved:', outputPath);
