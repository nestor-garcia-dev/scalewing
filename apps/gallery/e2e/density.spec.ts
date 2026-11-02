import { expect, test, type Locator, type Page } from '@playwright/test';

import { textContrast } from './contrast.js';

const heightOf = async (locator: Locator) =>
  (await locator.boundingBox())!.height;

async function density(page: Page, id: string): Promise<Locator> {
  await page.goto('/#density');
  const sample = page.getByTestId(`density-${id}`);
  await expect(sample).toBeVisible();
  return sample;
}

test('comfortable keeps the sizes consumers already have', async ({ page }) => {
  const sample = await density(page, 'comfortable');
  const coarse = await page.evaluate(
    () => matchMedia('(pointer: coarse)').matches,
  );
  const sizes = sample.getByRole('button');
  expect(await heightOf(sizes.nth(0))).toBe(44);
  expect(await heightOf(sizes.nth(1))).toBe(coarse ? 44 : 32);
  expect(await heightOf(sizes.nth(2))).toBe(coarse ? 44 : 28);
  expect(await heightOf(sample.locator('.sw-filter-chip-face').first())).toBe(
    44,
  );
  expect(await heightOf(sample.getByLabel('Species'))).toBe(44);
  await expect(sample.locator('.sw-card')).toHaveCSS('border-radius', '24px');
  await expect(sample.locator('.sw-card .sw-text-body').first()).toHaveCSS(
    'font-size',
    '17px',
  );
});

test('compact draws the desktop scale on a fine pointer and 44 px on touch', async ({
  page,
}) => {
  const sample = await density(page, 'compact');
  const coarse = await page.evaluate(
    () => matchMedia('(pointer: coarse)').matches,
  );
  const sizes = sample.getByRole('button');
  const chip = sample.locator('.sw-filter-chip-face').first();
  const field = sample.getByLabel('Species');
  const select = sample.locator('.sw-select-trigger');
  const card = sample.locator('.sw-card');
  const reading = sample.locator('.sw-card .sw-text-body').first();
  if (coarse) {
    for (const index of [0, 1, 2])
      expect(await heightOf(sizes.nth(index))).toBe(44);
    expect(await heightOf(chip)).toBe(44);
    expect(await heightOf(field)).toBe(44);
    await expect(card).toHaveCSS('border-radius', '24px');
    await expect(reading).toHaveCSS('font-size', '17px');
    return;
  }
  expect(await heightOf(sizes.nth(0))).toBe(36);
  await expect(sizes.nth(0)).toHaveCSS('padding-inline-start', '14px');
  expect(await heightOf(sizes.nth(1))).toBe(28);
  expect(await heightOf(sizes.nth(2))).toBe(24);
  expect(await heightOf(chip)).toBe(32);
  expect(await heightOf(field)).toBe(36);
  await expect(field).toHaveCSS('padding-inline-start', '14px');
  expect(await heightOf(select)).toBe(36);
  await expect(card).toHaveCSS('border-radius', '16px');
  await expect(reading).toHaveCSS('font-size', '15px');
  await expect(reading).toHaveCSS('line-height', '22px');
  await expect(sample.locator('td').first()).toHaveCSS('font-size', '15px');
  await expect(
    sample.locator('.sw-description-detail .sw-text-body'),
  ).toHaveCSS('font-size', '15px');
});

test('a quiet chosen chip keeps 4.5:1, and Highlight in forced colours', async ({
  page,
}, testInfo) => {
  const sample = await density(page, 'comfortable');
  const chosen = sample
    .locator('.sw-filter-chip-input:checked + .sw-filter-chip-face')
    .first();
  if (testInfo.project.name === 'forced-colors') {
    await page.emulateMedia({ forcedColors: 'active' });
    const fill = await chosen.evaluate((node) => {
      const probe = document.createElement('i');
      probe.style.color = 'Highlight';
      document.body.append(probe);
      const highlight = getComputedStyle(probe).color;
      probe.remove();
      return getComputedStyle(node).backgroundColor === highlight;
    });
    expect(fill).toBe(true);
    return;
  }
  expect(await textContrast(chosen)).toBeGreaterThanOrEqual(4.5);
});

test('fixed sides set the score at one place across runs, and fluid does not', async ({
  page,
}, testInfo) => {
  await page.goto('/#fixture-group-sides');
  const centreXs = async (sides: string) =>
    page
      .getByTestId(`fixture-sides-${sides}`)
      .locator('.sw-fixture-center')
      .evaluateAll((nodes) =>
        nodes.map((node) => {
          const box = node.getBoundingClientRect();
          return Math.round(box.x + box.width / 2);
        }),
      );
  const fixed = await centreXs('fixed');
  expect(fixed.length).toBe(4);
  if (testInfo.project.name !== 'mobile-es')
    expect(new Set(fixed).size).toBe(1);
  // Below md the end moves under the sides, as in a fluid run.
  if (testInfo.project.name === 'mobile-es') {
    const row = page
      .getByTestId('fixture-sides-fixed')
      .locator('.sw-fixture-list')
      .first();
    const fluid = page
      .getByTestId('fixture-sides-fluid')
      .locator('.sw-fixture-list')
      .first();
    const columns = (list: Locator) =>
      list.evaluate(
        (node) => getComputedStyle(node).gridTemplateColumns.split(' ').length,
      );
    expect(await columns(row)).toBe(await columns(fluid));
  }
});

test('a fixed term column lines details up across lists', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-es', 'stacks below md');
  await page.goto('/#description-list-term-width');
  const start = async (id: string) =>
    (await page.getByTestId(id).locator('dd').boundingBox())!.x -
    (await page.getByTestId(id).boundingBox())!.x;
  expect(await start('term-width-a')).toBe(await start('term-width-b'));
});

test('a rail grid sits beside its main column, and stacks when narrow', async ({
  page,
}, testInfo) => {
  await page.goto('/#grid');
  const grid = page.getByTestId('grid-rail');
  const [main, rail] = [grid.locator('> *').nth(0), grid.locator('> *').nth(1)];
  const mainBox = (await main.boundingBox())!;
  const railBox = (await rail.boundingBox())!;
  if (testInfo.project.name === 'mobile-es') {
    expect(railBox.y).toBeGreaterThan(mainBox.y);
    expect(railBox.width).toBe(mainBox.width);
    return;
  }
  expect(railBox.width).toBe(320);
  expect(railBox.y).toBe(mainBox.y);
  expect(railBox.x).toBeGreaterThan(mainBox.x);
});

test('PageHeader keeps its actions beside the title, and wraps when narrow', async ({
  page,
}, testInfo) => {
  await page.goto('/#page-header');
  const section = page.locator('#page-header');
  const heading = section.getByRole('heading', { name: 'Spring census' });
  await expect(heading).toHaveCSS(
    'font-size',
    testInfo.project.name === 'mobile-es' ? '24px' : '28px',
  );
  const publish = section.getByRole('button', { name: 'Publish' });
  const headingBox = (await heading.boundingBox())!;
  const publishBox = (await publish.boundingBox())!;
  if (testInfo.project.name === 'mobile-es')
    expect(publishBox.y).toBeGreaterThan(headingBox.y + headingBox.height - 1);
  else expect(publishBox.y).toBeLessThan(headingBox.y + headingBox.height);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('a long context name clamps to two lines and keeps its whole name', async ({
  page,
}) => {
  await page.goto('/#context-switcher');
  const name =
    'Northern reed beds and salt marsh wader survey station of the lower estuary';
  const trigger = page
    .locator('#context-switcher')
    .getByRole('button', { name: `Station ${name}` });
  await expect(trigger).toBeVisible();
  const words = trigger.locator('.sw-text-clamp-2');
  const box = (await words.boundingBox())!;
  // Two lines of a label, with more words clipped under them.
  expect(box.height).toBe(40);
  expect(
    await words.evaluate((node) => node.scrollHeight > node.clientHeight),
  ).toBe(true);
  await trigger.click();
  await expect(page.getByRole('option', { name })).toBeVisible();
});

test.describe('the compact desktop shell', () => {
  test.skip(({ hasTouch }) => hasTouch === true, 'a desktop window');

  async function open(page: Page, width: number, height: number) {
    await page.setViewportSize({ width, height });
    await page.goto('/?frame=app-shell&desktop=1');
    await expect(page.getByRole('main')).toBeVisible();
  }

  test('caps the page beside a full-width page bar on a wide window', async ({
    page,
  }) => {
    await open(page, 1600, 900);
    const mainBox = (await page.getByRole('main').boundingBox())!;
    const bar = (await page.locator('.sw-app-shell-page-bar').boundingBox())!;
    const content = (await page.locator('main > .sw-container').boundingBox())!;
    expect(bar.width).toBe(mainBox.width);
    expect(content.width).toBe(1152);
    expect(Math.round(content.x - mainBox.x)).toBe(
      Math.round(mainBox.x + mainBox.width - content.x - content.width),
    );
  });

  test('leaves the page full width where it fits, at 1366', async ({
    page,
  }) => {
    await open(page, 1366, 680);
    const mainBox = (await page.getByRole('main').boundingBox())!;
    const content = (await page.locator('main > .sw-container').boundingBox())!;
    expect(content.width).toBe(mainBox.width);
  });

  test('keeps the page bar, the sidebar and the action bar pinned while it scrolls', async ({
    page,
  }) => {
    await open(page, 1600, 700);
    const actionBar = page.locator('.sw-action-bar');
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(100);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
    expect(
      (await page.locator('.sw-app-shell-page-bar').boundingBox())!.y,
    ).toBe(0);
    expect((await page.locator('.sw-app-shell-sidebar').boundingBox())!.y).toBe(
      0,
    );
    const barBox = (await actionBar.boundingBox())!;
    expect(barBox.y + barBox.height).toBeLessThanOrEqual(700);
    expect(barBox.y + barBox.height).toBeGreaterThan(600);
  });

  test('sets the sidebar on the subtle fill, its words still 4.5:1', async ({
    page,
  }) => {
    await open(page, 1600, 900);
    const sidebar = page.locator('.sw-app-shell-sidebar');
    const subtle = await sidebar.evaluate((node) => {
      const probe = document.createElement('i');
      probe.style.color = 'var(--sw-color-subtle)';
      node.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    });
    if (test.info().project.name !== 'forced-colors')
      await expect(sidebar).toHaveCSS('background-color', subtle);
    const current = sidebar.locator('.sw-app-shell-link[aria-current]');
    expect(await textContrast(current)).toBeGreaterThanOrEqual(4.5);
    const caption = sidebar.locator('.sw-app-shell-group-label').first();
    expect(await textContrast(caption)).toBeGreaterThanOrEqual(4.5);
  });
});
