import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, 'images');

const photos = [
  { file: 'stock-office.jpg', id: '1745015446589-7ee6f702d8c1' }, // glass facade modern office building
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const req = https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    });
    req.on('error', err => { try { fs.unlinkSync(dest); } catch(_){} reject(err); });
  });
}

for (const { file, id } of photos) {
  const url = `https://images.unsplash.com/photo-${id}?w=1200&h=800&fit=crop&q=80&auto=format`;
  const dest = path.join(imgDir, file);
  try {
    await download(url, dest);
    const size = fs.statSync(dest).size;
    console.log(`✓ ${file} (${(size/1024).toFixed(0)} KB)`);
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}
