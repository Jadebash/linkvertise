const { chromium } = require('playwright');

async function getProfileName(userId) {
  const url = `https://linkvertise.com/profile/${userId}`;

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    locale: 'en-US',
    viewport: { width: 1280, height: 720 },
    javaScriptEnabled: true,
  });

  const page = await context.newPage();

  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const title = await page.title();
    await browser.close();
    return title;
  } catch (err) {
    await browser.close();
    return `Error: ${err.message}`;
  }
}

(async () => {
  let id = 0;

  while (true) {
    const name = await getProfileName(id);
    console.log(`User ID ${id} is "${name}"`);

    id++;
  }
})();
