const { chromium } = require('playwright');
const fs = require('fs');

async function comparePages() {
  const browser = await chromium.launch({ headless: true });

  // Take screenshots at same viewport size
  const nextPage = await browser.newPage();
  await nextPage.setViewportSize({ width: 1366, height: 768 });
  await nextPage.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 15000 });
  await nextPage.waitForTimeout(1500);
  const nextBuf = await nextPage.screenshot({ fullPage: false });
  fs.writeFileSync('snap_next.png', nextBuf);
  console.log('Next.js screenshot:', nextBuf.length, 'bytes');

  const vitePage = await browser.newPage();
  await vitePage.setViewportSize({ width: 1366, height: 768 });
  await vitePage.goto('http://localhost:3100/', { waitUntil: 'networkidle', timeout: 15000 });
  await vitePage.waitForTimeout(1500);
  const viteBuf = await vitePage.screenshot({ fullPage: false });
  fs.writeFileSync('snap_vite.png', viteBuf);
  console.log('Vite screenshot:', viteBuf.length, 'bytes');

  await browser.close();

  // Pixel comparison using raw PNG data
  // PNG files start with header then IHDR chunk: width(4) + height(4) at bytes 16-24
  function readPNGSize(buf) {
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    return { w, h };
  }

  const nextSize = readPNGSize(nextBuf);
  const viteSize = readPNGSize(viteBuf);
  console.log('Next.js dimensions:', nextSize.w, 'x', nextSize.h);
  console.log('Vite dimensions:', viteSize.w, 'x', viteSize.h);

  // Use canvas via node-canvas or just do raw byte comparison
  // Let's do a simple raw data comparison on the compressed bytes as a rough estimate
  // Better: use pixel-by-pixel via sharp or manually decode

  // We'll use a diff by comparing the raw PNG bytes sections after the header
  // This isn't pixel-accurate but gives a rough size ratio indication
  const totalPixels = nextSize.w * nextSize.h;
  console.log('Total pixels (Next.js):', totalPixels);

  // For real pixel comparison, we need to decompress PNG
  // Use Node's built-in zlib + manual PNG parsing
  const zlib = require('zlib');
  
  function parsePNG(buf) {
    let offset = 8; // Skip PNG signature
    let imageData = null;
    let width, height, bitDepth, colorType;
    const idatChunks = [];
    
    while (offset < buf.length) {
      const length = buf.readUInt32BE(offset);
      const type = buf.slice(offset + 4, offset + 8).toString('ascii');
      const data = buf.slice(offset + 8, offset + 8 + length);
      offset += 12 + length; // length(4) + type(4) + data + crc(4)
      
      if (type === 'IHDR') {
        width = data.readUInt32BE(0);
        height = data.readUInt32BE(4);
        bitDepth = data[8];
        colorType = data[9];
      } else if (type === 'IDAT') {
        idatChunks.push(data);
      } else if (type === 'IEND') {
        break;
      }
    }
    
    const compressed = Buffer.concat(idatChunks);
    const decompressed = zlib.inflateSync(compressed);
    
    return { width, height, bitDepth, colorType, decompressed };
  }
  
  console.log('Parsing PNG files...');
  const nextPNG = parsePNG(nextBuf);
  const vitePNG = parsePNG(viteBuf);
  
  console.log(`Next.js: ${nextPNG.width}x${nextPNG.height}, bitDepth=${nextPNG.bitDepth}, colorType=${nextPNG.colorType}`);
  console.log(`Vite: ${vitePNG.width}x${vitePNG.height}, bitDepth=${vitePNG.bitDepth}, colorType=${vitePNG.colorType}`);
  
  // Get pixels (assuming RGBA = colorType 6, or RGB = colorType 2)
  function getPixels(png) {
    const { width, height, bitDepth, colorType, decompressed } = png;
    const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 4;
    const bytesPerRow = 1 + width * channels; // Filter byte + pixel data
    const pixels = [];
    
    for (let y = 0; y < height; y++) {
      const rowStart = y * bytesPerRow;
      const filter = decompressed[rowStart];
      for (let x = 0; x < width; x++) {
        const pixOffset = rowStart + 1 + x * channels;
        const r = decompressed[pixOffset];
        const g = decompressed[pixOffset + 1];
        const b = decompressed[pixOffset + 2];
        pixels.push(r, g, b);
      }
    }
    return pixels;
  }
  
  // Since dimensions may differ, compare at the minimum shared area
  const compareW = Math.min(nextPNG.width, vitePNG.width);
  const compareH = Math.min(nextPNG.height, vitePNG.height);
  
  console.log(`Comparing ${compareW}x${compareH} area...`);
  
  const nextChannels = nextPNG.colorType === 6 ? 4 : 3;
  const viteChannels = vitePNG.colorType === 6 ? 4 : 3;
  
  let diffPixels = 0;
  const threshold = 10; // color difference threshold per channel
  
  for (let y = 0; y < compareH; y++) {
    const nextRowStart = y * (1 + nextPNG.width * nextChannels) + 1;
    const viteRowStart = y * (1 + vitePNG.width * viteChannels) + 1;
    
    for (let x = 0; x < compareW; x++) {
      const ni = nextRowStart + x * nextChannels;
      const vi = viteRowStart + x * viteChannels;
      
      const dr = Math.abs(nextPNG.decompressed[ni] - vitePNG.decompressed[vi]);
      const dg = Math.abs(nextPNG.decompressed[ni + 1] - vitePNG.decompressed[vi + 1]);
      const db = Math.abs(nextPNG.decompressed[ni + 2] - vitePNG.decompressed[vi + 2]);
      
      if (dr > threshold || dg > threshold || db > threshold) {
        diffPixels++;
      }
    }
  }
  
  const totalComparePixels = compareW * compareH;
  const diffPct = (diffPixels / totalComparePixels * 100).toFixed(2);
  
  console.log(`\n=== PIXEL COMPARISON RESULTS ===`);
  console.log(`Total pixels compared: ${totalComparePixels}`);
  console.log(`Different pixels: ${diffPixels}`);
  console.log(`Difference: ${diffPct}%`);
  console.log(`Target: < 2%`);
  console.log(parseFloat(diffPct) < 2 ? '✅ PASS: Difference is below 2%!' : '❌ FAIL: Difference exceeds 2%, more fixes needed');
}

comparePages().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
