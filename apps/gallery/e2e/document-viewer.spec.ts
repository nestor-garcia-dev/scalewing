import { createRequire } from 'node:module';

import { expect, test, type Locator, type Page } from '@playwright/test';

import { tokenColor } from './contrast.js';

const require = createRequire(import.meta.url);

/** The part of axe-core's page API this check calls. */
type Axe = {
  run: (
    context: unknown,
    options: unknown,
  ) => Promise<{ violations: { id: string }[] }>;
};

/**
 * What axe finds wrong in the viewers. In forced colours its contrast
 * check reads author colours the browser does not paint, so contrast is
 * checked in the other projects.
 */
async function axeViolations(page: Page, contrast: boolean) {
  await page.addScriptTag({ path: require.resolve('axe-core') });
  return page.evaluate(
    (withContrast) =>
      (window as Window & { axe: Axe }).axe
        .run(
          { include: [['#document-viewer .sw-document-viewer']] },
          {
            resultTypes: ['violations'],
            rules: { 'color-contrast': { enabled: withContrast } },
          },
        )
        .then((result) => result.violations.map((violation) => violation.id)),
    contrast,
  );
}

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

/** Every URL the page and its workers ask for, other than the dev server's modules. */
function watchRequests(page: Page): string[] {
  const urls: string[] = [];
  page.on('request', (request) => urls.push(request.url()));
  return urls;
}

/** Whether the canvas has paint on it: some pixel that is not white. */
function painted(canvas: Locator) {
  return canvas.evaluate((node) => {
    const element = node as HTMLCanvasElement;
    const context = element.getContext('2d');
    if (!context || element.width === 0) return false;
    const { data } = context.getImageData(0, 0, element.width, element.height);
    for (let index = 0; index < data.length; index += 4)
      if (data[index]! < 200) return true;
    return false;
  });
}

test('DocumentViewer draws a PDF a page at a time and steps through it', async ({
  page,
}, testInfo) => {
  const urls = watchRequests(page);
  await page.goto('/#document-viewer');
  const viewer = page.getByRole('region', { name: 'Wetland field guide' });
  const status = viewer.getByText('Page 1 of 3');
  await expect(status).toBeVisible({ timeout: 15000 });
  await expect(status).toHaveAttribute('aria-live', 'polite');
  const canvas = viewer.locator('canvas');
  await expect.poll(() => painted(canvas), { timeout: 10000 }).toBe(true);
  // The page's text is there to read and select, not to see.
  const text = viewer.locator('.sw-document-viewer-text');
  await expect(text).toContainText('Wetland field guide');
  await expect(text).toContainText('Grey herons stand still in shallow water.');
  await expect(text.locator('span').first()).toHaveCSS(
    'color',
    'rgba(0, 0, 0, 0)',
  );

  // The page fills the stage's width, inside its padding.
  const stage = viewer.locator('.sw-document-viewer-stage');
  const [stageBox, pageBox] = await Promise.all([
    stage.boundingBox(),
    viewer.locator('.sw-document-viewer-page').boundingBox(),
  ]);
  expect(stageBox && pageBox).toBeTruthy();
  if (stageBox && pageBox) {
    const inset = testInfo.project.name === 'mobile-es' ? 12 : 24;
    expect(pageBox.width).toBeCloseTo(stageBox.width - 2 * inset, 0);
  }

  // 48-point round steps; the first one looks off on the first page.
  const previous = viewer.getByRole('button', { name: 'Previous page' });
  const next = viewer.getByRole('button', { name: 'Next page' });
  for (const step of [previous, next]) {
    const box = await step.boundingBox();
    expect(box?.width).toBe(48);
    expect(box?.height).toBe(48);
  }
  await expect(previous).toHaveAttribute('aria-disabled', 'true');
  await next.click();
  await expect(viewer.getByText('Page 2 of 3')).toBeVisible();
  await expect(text).toContainText('Heron calls');
  await expect(
    page.locator('#document-viewer').getByText('Showing page 2.'),
  ).toBeVisible();
  await next.click();
  await expect(viewer.getByText('Page 3 of 3')).toBeVisible();
  await expect(text).toContainText('Owl pellets');
  await expect(next).toHaveAttribute('aria-disabled', 'true');
  await previous.click();
  await expect(viewer.getByText('Page 2 of 3')).toBeVisible();

  // Nothing is fetched beyond the page, its modules, the PDF and the worker:
  // no fonts, character maps, colour profiles or WebAssembly.
  const origin = new URL(page.url()).origin;
  expect(urls.filter((url) => !url.startsWith(origin))).toEqual([]);
  expect(
    urls.filter((url) =>
      /standard_fonts|cmaps|iccs|\.wasm|\.pfb|\.bcmap/.test(url),
    ),
  ).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(0);
  await viewer.screenshot({ path: testInfo.outputPath('document-viewer.png') });
  const forced = testInfo.project.name === 'forced-colors';
  expect(await axeViolations(page, !forced)).toEqual([]);
  if (forced) {
    await expect(viewer).toHaveCSS('border-top-style', 'solid');
    return;
  }
  await page.getByRole('radio', { name: 'Dark' }).first().check();
  expect(await axeViolations(page, true)).toEqual([]);
  await expect(viewer.getByText('Page 2 of 3')).toHaveCSS(
    'color',
    await tokenColor(page, 'text'),
  );
  await viewer.screenshot({
    path: testInfo.outputPath('document-viewer-dark.png'),
  });
});

test('DocumentViewer zooms the focused page with + and 0 and scrolls it sideways', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-es', 'keyboard');
  await page.goto('/#document-viewer');
  const viewer = page.getByRole('region', { name: 'Wetland field guide' });
  await expect(viewer.getByText('Page 1 of 3')).toBeVisible({ timeout: 15000 });
  const stage = viewer.getByRole('group', { name: 'Page 1 of 3' });
  const box = viewer.locator('.sw-document-viewer-page');
  const fitted = (await box.boundingBox())?.width ?? 0;
  await stage.focus();
  await expect(stage).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('+');
  await page.keyboard.press('+');
  await expect
    .poll(async () => (await box.boundingBox())?.width)
    .toBeCloseTo(fitted * 1.5, 0);
  expect(
    await stage.evaluate((node) => node.scrollWidth > node.clientWidth),
  ).toBe(true);
  // The drawing is redrawn at the new size once the zoom rests.
  await expect
    .poll(() =>
      box
        .locator('canvas')
        .evaluate((node) => (node as HTMLCanvasElement).width),
    )
    .toBeGreaterThan(fitted * 1.4);
  await page.keyboard.press('0');
  await expect
    .poll(async () => (await box.boundingBox())?.width)
    .toBeCloseTo(fitted, 0);
});

test('DocumentViewer zooms with two fingers, keeping the spot under them', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'forced-colors', 'touch');
  await page.goto('/#document-viewer');
  const viewer = page.getByRole('region', { name: 'Wetland field guide' });
  await expect(viewer.getByText('Page 1 of 3')).toBeVisible({ timeout: 15000 });
  const stage = viewer.locator('.sw-document-viewer-stage');
  await expect(stage).toHaveCSS('touch-action', 'pan-x pan-y');
  const box = viewer.locator('.sw-document-viewer-page');
  const fitted = (await box.boundingBox())?.width ?? 0;
  const words = box.getByText('Grey herons stand still');
  await words.scrollIntoViewIfNeeded();
  // The spot pinched: a point a quarter into the sentence, on its line.
  const centre = async () => {
    const rect = await words.boundingBox();
    if (!rect) throw new Error('The page words are not drawn');
    return { x: rect.x + rect.width / 4, y: rect.y + rect.height / 2 };
  };
  const at = await centre();
  const pinch = await stage.evaluate((node, spot) => {
    const touch = (id: number, x: number) =>
      new Touch({ identifier: id, target: node, clientX: x, clientY: spot.y });
    node.dispatchEvent(
      new TouchEvent('touchstart', {
        bubbles: true,
        touches: [touch(1, spot.x - 25), touch(2, spot.x + 25)],
      }),
    );
    const move = new TouchEvent('touchmove', {
      bubbles: true,
      cancelable: true,
      touches: [touch(1, spot.x - 50), touch(2, spot.x + 50)],
    });
    node.dispatchEvent(move);
    node.dispatchEvent(
      new TouchEvent('touchend', { bubbles: true, touches: [] }),
    );
    return move.defaultPrevented;
  }, at);
  expect(pinch).toBe(true);
  await expect
    .poll(async () => (await box.boundingBox())?.width)
    .toBeCloseTo(fitted * 2, 0);
  // Once the page is drawn again at its size, the same words are under the
  // fingers: the stage scrolled across, the window down.
  await expect
    .poll(() =>
      box
        .locator('canvas')
        .evaluate((node) => (node as HTMLCanvasElement).width),
    )
    .toBeGreaterThan(fitted * 1.9);
  await expect
    .poll(async () => {
      const now = await centre();
      return Math.max(Math.abs(now.x - at.x), Math.abs(now.y - at.y));
    })
    .toBeLessThanOrEqual(2);
  // The page's own scroll takes the wider page; the screen does not scroll sideways.
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(0);
});

test('DocumentViewer says a PDF could not be shown, with the consumer’s actions', async ({
  page,
}, testInfo) => {
  await page.goto('/#document-viewer');
  const viewer = page.getByRole('region', { name: 'Damaged field guide' });
  const alert = viewer.getByRole('alert');
  await expect(alert).toContainText('This field guide couldn’t be shown', {
    timeout: 15000,
  });
  await expect(alert).toContainText('The file may be damaged.');
  await viewer.getByRole('button', { name: 'Ask for a copy' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'will send a copy' }),
  ).toBeVisible();
  await viewer.getByRole('button', { name: 'Try again' }).click();
  await expect(
    page
      .getByRole('region', { name: 'Damaged field guide' })
      .getByRole('alert'),
  ).toContainText('couldn’t be shown', { timeout: 15000 });
  await expect(viewer.getByRole('button', { name: /page/ })).toHaveCount(0);
  // The failed words keep 4.5:1 on the stage, light and dark.
  const forced = testInfo.project.name === 'forced-colors';
  expect(await axeViolations(page, !forced)).toEqual([]);
  if (forced) return;
  await page.getByRole('radio', { name: 'Dark' }).first().check();
  expect(await axeViolations(page, true)).toEqual([]);
  await viewer.screenshot({
    path: testInfo.outputPath('document-viewer-failed-dark.png'),
  });
});

test('DocumentViewer says it is opening, once, in words that keep 4.5:1', async ({
  page,
}, testInfo) => {
  // The worker is held back, so both viewers stay opening
  // (the worker's own script, not the module that names its URL).
  await page.route(
    (url) => url.searchParams.has('worker_file'),
    () => undefined,
  );
  await page.goto('/#document-viewer', { waitUntil: 'domcontentloaded' });
  const viewer = page.getByRole('region', { name: 'Wetland field guide' });
  await expect(viewer.getByRole('status')).toHaveText(
    'Opening the field guide…',
    { timeout: 15000 },
  );
  await expect(viewer.locator('p', { hasText: 'Opening' })).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  const forced = testInfo.project.name === 'forced-colors';
  expect(await axeViolations(page, !forced)).toEqual([]);
  if (forced) return;
  await page.getByRole('radio', { name: 'Dark' }).first().check();
  expect(await axeViolations(page, true)).toEqual([]);
});
