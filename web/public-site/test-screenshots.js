import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function capturePages() {
  const browser = await chromium.launch();
  const context = await browser.createContext();
  const page = await context.newPage();

  const baseURL = 'http://localhost:3000';
  const screenshotDir = './screenshots';

  // Create screenshots directory if it doesn't exist
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }

  try {
    console.log('Starting page capture...\n');

    // === HOME PAGE ===
    console.log('1. Capturing HOME PAGE...');
    await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: `${screenshotDir}/01-home-full.png`,
      fullPage: true,
    });

    // Check for header and footer
    const homeHeader = await page
      .locator('header')
      .isVisible()
      .catch(() => false);
    const homeFooter = await page
      .locator('footer')
      .isVisible()
      .catch(() => false);
    console.log(`   ✓ Header visible: ${homeHeader}`);
    console.log(`   ✓ Footer visible: ${homeFooter}`);
    console.log(`   ✓ Screenshot: 01-home-full.png\n`);

    // === ARCHIVE PAGE ===
    console.log('2. Capturing ARCHIVE PAGE...');
    await page.goto(`${baseURL}/archive/1`, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: `${screenshotDir}/02-archive-full.png`,
      fullPage: true,
    });

    const archiveHeader = await page
      .locator('header')
      .isVisible()
      .catch(() => false);
    const archiveFooter = await page
      .locator('footer')
      .isVisible()
      .catch(() => false);
    console.log(`   ✓ Header visible: ${archiveHeader}`);
    console.log(`   ✓ Footer visible: ${archiveFooter}`);
    console.log(`   ✓ Screenshot: 02-archive-full.png\n`);

    // === POST DETAIL PAGE ===
    console.log('3. Checking for first post to navigate to detail page...');
    const postLink = await page
      .locator('article a')
      .first()
      .getAttribute('href')
      .catch(() => null);

    if (postLink) {
      console.log(`4. Capturing POST DETAIL PAGE (${postLink})...`);
      await page.goto(`${baseURL}${postLink}`, { waitUntil: 'networkidle' });
      await page.screenshot({
        path: `${screenshotDir}/03-post-detail-full.png`,
        fullPage: true,
      });

      const postHeader = await page
        .locator('header')
        .isVisible()
        .catch(() => false);
      const postFooter = await page
        .locator('footer')
        .isVisible()
        .catch(() => false);
      console.log(`   ✓ Header visible: ${postHeader}`);
      console.log(`   ✓ Footer visible: ${postFooter}`);
      console.log(`   ✓ Screenshot: 03-post-detail-full.png\n`);
    } else {
      console.log('   ✗ No post link found on archive page\n');
    }

    // === VIEWPORT COMPARISON ===
    console.log('5. Capturing MOBILE VIEW (375x667)...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: `${screenshotDir}/04-mobile-home.png`,
      fullPage: true,
    });
    console.log(`   ✓ Screenshot: 04-mobile-home.png\n`);

    console.log('6. Capturing TABLET VIEW (768x1024)...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: `${screenshotDir}/05-tablet-home.png`,
      fullPage: true,
    });
    console.log(`   ✓ Screenshot: 05-tablet-home.png\n`);

    // === COMPONENT CHECK ===
    console.log('7. Detailed Component Analysis...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });

    const headerElement = await page
      .locator('header')
      .evaluate((el) => ({
        visible: el.offsetParent !== null,
        height: el.offsetHeight,
        width: el.offsetWidth,
        classes: el.className,
      }))
      .catch(() => ({ visible: false }));

    const footerElement = await page
      .locator('footer')
      .evaluate((el) => ({
        visible: el.offsetParent !== null,
        height: el.offsetHeight,
        width: el.offsetWidth,
        classes: el.className,
      }))
      .catch(() => ({ visible: false }));

    const mainElement = await page
      .locator('main')
      .evaluate((el) => ({
        visible: el.offsetParent !== null,
        height: el.offsetHeight,
        classes: el.className,
      }))
      .catch(() => ({ visible: false }));

    console.log('\n   HEADER:', JSON.stringify(headerElement, null, 2));
    console.log('\n   MAIN:', JSON.stringify(mainElement, null, 2));
    console.log('\n   FOOTER:', JSON.stringify(footerElement, null, 2));

    console.log('\n✅ All screenshots captured successfully!');
    console.log(`📁 Location: ${path.resolve(screenshotDir)}`);
  } catch (error) {
    console.error('❌ Error capturing pages:', error.message);
  } finally {
    await browser.close();
  }
}

capturePages();
