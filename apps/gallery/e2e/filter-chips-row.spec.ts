import { expect, test } from '@playwright/test';

test('FilterChipsRow scrolls two groups together on a phone, the end group last', async ({
  page,
}, testInfo) => {
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#filter-chips-row');
  const section = page.locator('#filter-chips-row');
  const kinds = section.getByRole('group', {
    name: 'Scrolling guides by kind',
  });
  const end = section.getByRole('group', {
    name: 'Scrolling guides not translated',
  });
  const row = section.locator('.sw-filter-chips-row-scroll').first();
  const toggle = end.getByRole('checkbox', { name: 'Not translated 2' });

  // One line: every chip of both groups shares the first chip's top.
  const tops = await row.evaluate((node) =>
    Array.from(node.querySelectorAll('.sw-filter-chip-face'), (face) =>
      Math.round(face.getBoundingClientRect().top),
    ),
  );
  expect(tops).toHaveLength(6);
  expect(new Set(tops).size).toBe(1);

  const [rowWidth, scrollWidth, kindsOverflow] = await row.evaluate((node) => [
    node.clientWidth,
    node.scrollWidth,
    getComputedStyle(node.querySelector('.sw-filter-chips-options') ?? node)
      .overflowX,
  ]);
  // The kinds' own scroll gives way: only the row scrolls.
  expect(kindsOverflow).toBe('visible');
  const phone = testInfo.project.name === 'mobile-es';
  if (phone) {
    expect(scrollWidth).toBeGreaterThan(rowWidth);
    // The end chip is past the edge, and Tab brings it into view.
    await kinds.getByRole('radio', { name: 'All 14' }).focus();
    await page.keyboard.press('Tab');
    await expect(toggle).toBeFocused();
    await expect
      .poll(() => row.evaluate((node) => node.scrollLeft))
      .toBeGreaterThan(0);
    const [chip, box] = await Promise.all([
      toggle.locator('xpath=following-sibling::*[1]').boundingBox(),
      row.boundingBox(),
    ]);
    expect(chip && box).toBeTruthy();
    if (chip && box)
      expect(chip.x + chip.width).toBeLessThanOrEqual(box.x + box.width + 1);
  } else {
    // Everything fits: the end group sits at the row's end.
    expect(scrollWidth).toBeLessThanOrEqual(rowWidth);
    const [chip, box] = await Promise.all([
      end.boundingBox(),
      row.boundingBox(),
    ]);
    expect(chip && box).toBeTruthy();
    if (chip && box) {
      const padding = await row.evaluate((node) =>
        Number.parseFloat(getComputedStyle(node).paddingRight),
      );
      expect(
        Math.abs(chip.x + chip.width - (box.x + box.width - padding)),
      ).toBeLessThan(1);
    }
  }
  await toggle.check();
  await expect(
    section.getByText('Showing All, not translated only.').first(),
  ).toBeVisible();

  // The page never scrolls sideways.
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(0);
  await row.screenshot({
    path: testInfo.outputPath('filter-chips-row-scroll.png'),
  });
});

test('FilterChipsRow wraps its groups, the end group at the row’s end (its own line’s on a phone)', async ({
  page,
}, testInfo) => {
  await page.goto('/#filter-chips-row');
  const section = page.locator('#filter-chips-row');
  const row = section.locator(
    '.sw-filter-chips-row:not(.sw-filter-chips-row-scroll)',
  );
  const end = section.getByRole('group', {
    name: 'Wrapping guides not translated',
  });
  const [endBox, rowBox] = await Promise.all([
    end.boundingBox(),
    row.boundingBox(),
  ]);
  expect(endBox && rowBox).toBeTruthy();
  if (endBox && rowBox)
    expect(
      Math.abs(endBox.x + endBox.width - (rowBox.x + rowBox.width)),
    ).toBeLessThan(1);
  // On a phone the kinds wrap past the row's width no further: the kinds
  // scroll in their own box, and the page never scrolls sideways.
  const [rowRight, kindsRight] = await Promise.all([
    row.evaluate((node) => node.getBoundingClientRect().right),
    section
      .getByRole('group', { name: 'Wrapping guides by kind' })
      .evaluate((node) => node.getBoundingClientRect().right),
  ]);
  expect(kindsRight).toBeLessThanOrEqual(rowRight + 0.5);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(0);
  await row.screenshot({
    path: testInfo.outputPath('filter-chips-row-wrap.png'),
  });
});

test('FilterChipsRow keeps a scrolling group as wide as its chips, its label and error wrapping under them', async ({
  page,
}, testInfo) => {
  await page.goto('/#filter-chips-row');
  const section = page.locator('#filter-chips-row');
  const kinds = section.getByRole('group', {
    name: 'Labelled guides by kind',
  });
  await expect(kinds).toHaveAccessibleDescription(
    'Pick one kind of animal before you export these field guides to the ranger station, so each ranger gets only the guides for the animals they count.',
  );
  const sizes = await kinds.evaluate((node) => {
    const options = node.querySelector('.sw-filter-chips-options');
    const error = node.querySelector('.sw-filter-chips-error');
    const line = error
      ? Number.parseFloat(getComputedStyle(error).lineHeight)
      : 0;
    const row = node.closest('.sw-filter-chips-row');
    return {
      group: node.getBoundingClientRect().width,
      chips: options?.getBoundingClientRect().width ?? 0,
      errorWidth: error?.getBoundingClientRect().width ?? 0,
      errorLines: error
        ? Math.round(error.getBoundingClientRect().height / line)
        : 0,
      rowScroll: row?.scrollWidth ?? 0,
      rowWidth: row?.clientWidth ?? 0,
      // Where the last chip ends in the row's scrolled content, with the
      // row's end padding (the focus ring's reach).
      chipsEnd: (() => {
        if (!row) return 0;
        const chips = row.querySelectorAll('.sw-filter-chip');
        const last = chips[chips.length - 1];
        if (!last) return 0;
        return (
          last.getBoundingClientRect().right -
          row.getBoundingClientRect().left +
          row.scrollLeft +
          Number.parseFloat(getComputedStyle(row).paddingRight)
        );
      })(),
    };
  });
  // The group is its chips' width, not its words': the error wraps.
  expect(Math.abs(sizes.group - sizes.chips)).toBeLessThan(1);
  expect(sizes.errorLines).toBeGreaterThan(1);
  expect(sizes.errorWidth).toBeLessThanOrEqual(sizes.chips + 1);
  // The row scrolls, if at all, only as far as its chips (with their gaps
  // and padding), never as far as the error's words.
  expect(sizes.rowScroll).toBeLessThanOrEqual(
    Math.ceil(Math.max(sizes.rowWidth, sizes.chipsEnd)) + 1,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(0);
  await kinds.locator('xpath=..').screenshot({
    path: testInfo.outputPath('filter-chips-row-labelled.png'),
  });
});
