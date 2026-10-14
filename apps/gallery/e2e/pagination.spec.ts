import { expect, test } from '@playwright/test';

test('Pagination steps through the pages, keeps focus at the end and says the range', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  await page.goto('/#pagination');
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const pager = page.getByRole('navigation', { name: 'Site pages' });
  await pager.scrollIntoViewIfNeeded();
  const previous = pager.getByRole('button', { name: 'Previous page' });
  const next = pager.getByRole('button', { name: 'Next page' });
  const table = page.getByRole('table', { name: 'Sites, a page at a time' });
  const range = pager.getByText(/of 30 sites/);

  await expect(range).toHaveText('1–10 of 30 sites · 10 a page');
  await expect(range).toHaveAttribute('aria-live', 'polite');
  await expect(previous).toHaveAttribute('aria-disabled', 'true');
  await expect(next).not.toHaveAttribute('aria-disabled', 'true');
  await expect(
    table.getByRole('cell', { name: 'North reed bed' }),
  ).toBeVisible();

  // A press at the start does nothing. (Playwright waits for an
  // aria-disabled button to enable, so press it from the keyboard.)
  await previous.focus();
  await page.keyboard.press('Enter');
  await expect(range).toHaveText('1–10 of 30 sites · 10 a page');

  // From the keyboard to the last page; focus stays on next there.
  await next.focus();
  await page.keyboard.press('Enter');
  await expect(range).toHaveText('11–20 of 30 sites · 10 a page');
  await page.keyboard.press('Enter');
  await expect(range).toHaveText('21–30 of 30 sites · 10 a page');
  await expect(next).toHaveAttribute('aria-disabled', 'true');
  await expect(next).toBeFocused();
  await expect(table.getByRole('cell', { name: 'Scrape' })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(range).toHaveText('21–30 of 30 sites · 10 a page');

  // The range sits at the start, the steps at the end of the row.
  const navBox = (await pager.boundingBox())!;
  const rangeBox = (await range.boundingBox())!;
  const nextBox = (await next.boundingBox())!;
  expect(rangeBox.x - navBox.x).toBeLessThanOrEqual(1);
  expect(
    navBox.x + navBox.width - (nextBox.x + nextBox.width),
  ).toBeLessThanOrEqual(1);

  // Square steps; the touch target on a coarse pointer.
  const coarse = await page.evaluate(
    () => matchMedia('(pointer: coarse)').matches,
  );
  expect(Math.abs(nextBox.width - nextBox.height)).toBeLessThanOrEqual(1);
  if (coarse) expect(nextBox.height).toBeGreaterThanOrEqual(44);

  // The glyph is drawn in the button's colour, a border forced colours keep.
  const glyph = await next.evaluate((node) => {
    const mark = getComputedStyle(node.querySelector('.sw-pagination-glyph')!);
    return [
      mark.borderBottomColor,
      getComputedStyle(node).color,
      mark.borderBottomWidth,
    ];
  });
  expect(glyph[0]).toBe(glyph[1]);
  expect(glyph[2]).toBe('2px');
  await pager.screenshot({ path: testInfo.outputPath('pagination.png') });

  // Which way each chevron's tip points on screen: its corner (the
  // bottom-right of the stroked square) through the turn and any flip.
  const pointing = (step: typeof next) =>
    step.evaluate((node) => {
      const glyph = node.querySelector('.sw-pagination-glyph')!;
      const style = getComputedStyle(glyph);
      const size = glyph.getBoundingClientRect().width;
      const turned = new DOMMatrix(style.transform).transformPoint(
        new DOMPoint(size / 2, size / 2),
      );
      const flip =
        style.scale === 'none' ? 1 : Number(style.scale.split(' ')[0]);
      return Math.sign(turned.x * flip) < 0 ? 'left' : 'right';
    });
  expect(await pointing(previous)).toBe('left');
  expect(await pointing(next)).toBe('right');

  // Right to left the steps swap sides and their chevrons turn round.
  await pager.evaluate((node) => node.setAttribute('dir', 'rtl'));
  expect(await pointing(previous)).toBe('right');
  expect(await pointing(next)).toBe('left');
  const rtlPrevious = (await previous.boundingBox())!;
  const rtlNext = (await next.boundingBox())!;
  expect(rtlPrevious.x).toBeGreaterThan(rtlNext.x);
  await pager.screenshot({ path: testInfo.outputPath('pagination-rtl.png') });
});

test('Pagination with one page greys both steps', async ({ page }) => {
  await page.goto('/#pagination');
  const pager = page.getByRole('navigation', { name: 'Heron pages' });
  await pager.scrollIntoViewIfNeeded();
  for (const name of ['Previous page', 'Next page'])
    await expect(pager.getByRole('button', { name })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
});
