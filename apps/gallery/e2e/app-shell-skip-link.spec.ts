import { expect, test, type Page } from '@playwright/test';

import { axeViolations } from './axe-scan.js';
import { paintedTextContrast, textContrast } from './contrast.js';

const frame = '/?frame=app-shell';

/* The shell's layouts: full sidebar, rail, the bar with its drawer, and a phone. */
const windows = [
  { name: 'the full sidebar', width: 1366, height: 680 },
  { name: 'the rail', width: 1180, height: 820 },
  { name: 'the top bar', width: 820, height: 1180 },
  { name: 'a phone', width: 390, height: 844 },
] as const;

// The forced-colors project's option alone leaves the media query off.
test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
});

async function open(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.goto(frame);
  await expect(page.getByRole('main')).toBeVisible();
}

for (const size of windows) {
  test(`AppShell skip link is the first Tab stop and moves focus to main, over ${size.name}`, async ({
    page,
  }, testInfo) => {
    await open(page, size.width, size.height);
    const link = page.getByRole('link', { name: 'Skip to main content' });
    // Hidden until it has focus.
    expect((await link.boundingBox())!.width).toBeLessThanOrEqual(1);

    await page.keyboard.press('Tab');
    await expect(link).toBeFocused();
    const box = (await link.boundingBox())!;
    expect(box.width).toBeGreaterThan(40);
    expect(box.height).toBeGreaterThanOrEqual(36);
    // At the window's top start, painted over the sidebar or the bar.
    expect(box.x).toBeLessThanOrEqual(16);
    expect(box.y).toBeLessThanOrEqual(16);
    const onTop = await page.evaluate(
      ([x, y]) =>
        document
          .elementFromPoint(x!, y!)
          ?.closest('.sw-app-shell-skip-link') !== null,
      [box.x + box.width / 2, box.y + box.height / 2],
    );
    expect(onTop).toBe(true);
    const forced = testInfo.project.name === 'forced-colors';
    expect(
      forced ? await paintedTextContrast(link) : await textContrast(link),
    ).toBeGreaterThanOrEqual(4.5);
    expect(await axeViolations(page, '.sw-app-shell-skip-link')).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`app-shell-skip-link-${size.width}.png`),
    });

    // Enter moves focus to main without changing the address.
    const address = page.url();
    await page.keyboard.press('Enter');
    const main = page.getByRole('main');
    await expect(main).toBeFocused();
    expect(page.url()).toBe(address);
    expect(
      await main.evaluate((element) => getComputedStyle(element).outlineStyle),
    ).toBe('none');
    // The next Tab is the page's first control, past every destination.
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('button', { name: 'Export sightings' }),
    ).toBeFocused();
  });
}

test('AppShell skip link shows at the window top however far the page has scrolled', async ({
  page,
}) => {
  await open(page, 1366, 680);
  await page.mouse.move(800, 400);
  await page.mouse.wheel(0, 900);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(0);
  const link = page.getByRole('link', { name: 'Skip to main content' });
  await link.focus();
  await expect(link).toBeInViewport();
  expect((await link.boundingBox())!.y).toBeLessThanOrEqual(16);
});
