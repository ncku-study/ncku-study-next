const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const viewport = { width: 1366, height: 768 };

  const ctxV = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const vPage = await ctxV.newPage();
  await vPage.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
  await vPage.waitForTimeout(2000);
  const vRes = await vPage.evaluate(() => {
    const h1 = document.querySelector('h1');
    const h1Style = getComputedStyle(h1);
    const cards = document.querySelectorAll('.MuiCard-root');
    const firstCard = cards[0];
    return {
      title: h1 ? { x: h1.getBoundingClientRect().x, y: h1.getBoundingClientRect().y, h: h1.getBoundingClientRect().height } : null,
      h1FontSize: h1Style.fontSize,
      h1LineHeight: h1Style.lineHeight,
      card1: firstCard ? { x: firstCard.getBoundingClientRect().x, y: firstCard.getBoundingClientRect().y, w: firstCard.getBoundingClientRect().width, h: firstCard.getBoundingClientRect().height } : null,
      card2: cards[1] ? { x: cards[1].getBoundingClientRect().x, y: cards[1].getBoundingClientRect().y, w: cards[1].getBoundingClientRect().width, h: cards[1].getBoundingClientRect().height } : null,
    };
  });

  const ctxN = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const nPage = await ctxN.newPage();
  await nPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await nPage.waitForTimeout(2000);
  const nRes = await nPage.evaluate(() => {
    const h1 = document.querySelector('h1');
    const h1Style = getComputedStyle(h1);
    const cards = document.querySelectorAll('[class*="rounded-[15px]"]');
    const firstCard = cards[0];
    return {
      title: h1 ? { x: h1.getBoundingClientRect().x, y: h1.getBoundingClientRect().y, h: h1.getBoundingClientRect().height } : null,
      h1FontSize: h1Style.fontSize,
      h1LineHeight: h1Style.lineHeight,
      card1: firstCard ? { x: firstCard.getBoundingClientRect().x, y: firstCard.getBoundingClientRect().y, w: firstCard.getBoundingClientRect().width, h: firstCard.getBoundingClientRect().height } : null,
      card2: cards[1] ? { x: cards[1].getBoundingClientRect().x, y: cards[1].getBoundingClientRect().y, w: cards[1].getBoundingClientRect().width, h: cards[1].getBoundingClientRect().height } : null,
    };
  });

  console.log('Vite title:', JSON.stringify(vRes.title), 'fontSize:', vRes.h1FontSize, 'lineHeight:', vRes.h1LineHeight);
  console.log('Next title:', JSON.stringify(nRes.title), 'fontSize:', nRes.h1FontSize, 'lineHeight:', nRes.h1LineHeight);
  console.log('Vite card1:', JSON.stringify(vRes.card1), 'card2:', JSON.stringify(vRes.card2));
  console.log('Next card1:', JSON.stringify(nRes.card1), 'card2:', JSON.stringify(nRes.card2));

  await browser.close();
})();
