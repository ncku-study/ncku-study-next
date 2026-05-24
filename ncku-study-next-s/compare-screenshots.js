const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();

  const nextPage = await browser.newPage();
  await nextPage.setViewportSize({ width: 1366, height: 768 });
  await nextPage.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 15000 });
  await nextPage.waitForTimeout(2000);
  const nextBuf = await nextPage.screenshot({ path: 'C:/snapshot_next.png' });

  const vitePage = await browser.newPage();
  await vitePage.setViewportSize({ width: 1366, height: 768 });
  await vitePage.goto('http://localhost:3100/', { waitUntil: 'networkidle', timeout: 15000 });
  await vitePage.waitForTimeout(2000);
  const viteBuf = await vitePage.screenshot({ path: 'C:/snapshot_vite.png' });

  await browser.close();
  console.log('Screenshots saved: next=' + nextBuf.length + ' vite=' + viteBuf.length);
  
  // Simple pixel comparison using raw PNG data
  // Since we can't use pngjs, let's use the Playwright's built-in comparison
  // Compare by reading the PNG files
  const nextImg = fs.readFileSync('C:/snapshot_next.png');
  const viteImg = fs.readFileSync('C:/snapshot_vite.png');
  
  console.log('Next.js screenshot size:', nextImg.length, 'bytes');
  console.log('Vite screenshot size:', viteImg.length, 'bytes');
  console.log('Size ratio:', (nextImg.length / viteImg.length).toFixed(3));
})().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
