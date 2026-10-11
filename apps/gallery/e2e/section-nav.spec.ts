import { expect, test } from '@playwright/test';

test('SectionNav marks the current section, a row on a phone and a side list from md', async ({
  page,
}, testInfo) => {
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#section-nav');
  const nav = page.getByRole('navigation', { name: 'Reserve office' });
  await nav.scrollIntoViewIfNeeded();
  const counts = nav.getByRole('link', { name: 'Counts' });
  const rangers = nav.getByRole('link', { name: 'Rangers' });
  await expect(counts).toHaveAttribute('aria-current', 'page');
  await expect(rangers).not.toHaveAttribute('aria-current');
  // Each link's decorative glyph sits before its label, hidden from the
  // link's name.
  const glyph = counts.locator('.sw-section-nav-icon');
  await expect(glyph).toHaveAttribute('aria-hidden', 'true');
  const glyphBox = await glyph.boundingBox();
  const labelStart = await counts.evaluate((link) => {
    const range = document.createRange();
    range.selectNodeContents(link.lastChild!);
    return range.getBoundingClientRect().left;
  });
  expect(glyphBox!.x + glyphBox!.width).toBeLessThanOrEqual(labelStart);

  // Quiet: no underline, no fill; the current one in another color.
  const look = (element: HTMLElement) => {
    const style = getComputedStyle(element);
    return {
      color: style.color,
      decoration: style.textDecorationLine,
      bottom: style.borderBottomColor,
      start: style.borderInlineStartColor,
    };
  };
  const current = await counts.evaluate(look);
  const other = await rangers.evaluate(look);
  expect(other.decoration).toBe('none');
  expect(current.color).not.toBe(other.color);

  const phone = testInfo.project.name === 'mobile-es';
  const countsBox = await counts.boundingBox();
  const rangersBox = await rangers.boundingBox();
  if (phone) {
    // A row, marked by the underline.
    expect(Math.abs(countsBox!.y - rangersBox!.y)).toBeLessThanOrEqual(1);
    expect(current.bottom).not.toBe(other.bottom);
    // The coarse pointer's 44 px target.
    expect(countsBox!.height).toBeGreaterThanOrEqual(44);
  } else {
    // A side list, marked by the bar at its start.
    expect(rangersBox!.y).toBeGreaterThan(countsBox!.y + countsBox!.height - 1);
    expect(Math.abs(countsBox!.x - rangersBox!.x)).toBeLessThanOrEqual(1);
    expect(current.start).not.toBe(other.start);
  }

  // A press moves to the section; the router gets it, the page stays.
  await rangers.click();
  await expect(rangers).toHaveAttribute('aria-current', 'page');
  await expect(counts).not.toHaveAttribute('aria-current');
  await expect(page.getByRole('heading', { name: 'Rangers' })).toBeVisible();
  // A page inside the section keeps it current, as its location.
  await page.getByRole('link', { name: "Open today's page" }).click();
  await expect(rangers).toHaveAttribute('aria-current', 'location');

  // The keyboard reaches each link with a visible ring.
  await counts.focus();
  await page.keyboard.press('Tab');
  await expect(rangers).toBeFocused();
  const ring = await rangers.evaluate(
    (element) => getComputedStyle(element).outlineStyle,
  );
  expect(ring).toBe('solid');
  await nav
    .locator('..')
    .screenshot({ path: testInfo.outputPath('section-nav.png') });
});

test('SectionNav filled marks the current page with a fill and shows a count in the name', async ({
  page,
}, testInfo) => {
  await page.goto('/#section-nav');
  if (testInfo.project.name === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  const nav = page.getByRole('navigation', { name: 'Reserve pages' });
  const today = nav.getByRole('link', { name: 'Today' });
  const tasks = nav.getByRole('link', { name: 'Tasks 3' });
  await expect(today).toHaveAttribute('aria-current', 'page');
  await expect(tasks).toBeVisible();
  const pill = tasks.locator('.sw-section-nav-count');
  await expect(pill).toHaveText('3');
  // No underline and no hairline; the sm control height.
  const list = nav.locator('.sw-section-nav-list');
  await expect(list).toHaveCSS('border-bottom-width', '0px');
  const box = (await today.boundingBox())!;
  if (testInfo.project.name !== 'mobile-es')
    expect(Math.round(box.height)).toBe(32);
  else expect(Math.round(box.height)).toBeGreaterThanOrEqual(44);
  if (testInfo.project.name === 'forced-colors') {
    // The pill keeps an edge where its fill is dropped.
    await expect(pill).toHaveCSS('border-top-width', '1px');
    const [current, other] = await Promise.all([
      today.evaluate((node) => getComputedStyle(node).borderTopColor),
      tasks.evaluate((node) => getComputedStyle(node).borderTopColor),
    ]);
    expect(current).not.toBe(other);
  } else {
    const [current, other] = await Promise.all([
      today.evaluate((node) => getComputedStyle(node).backgroundColor),
      tasks.evaluate((node) => getComputedStyle(node).backgroundColor),
    ]);
    expect(current).not.toBe(other);
    expect(other).toBe('rgba(0, 0, 0, 0)');
    // The pill is 20 high on the danger fill.
    const pillBox = (await pill.boundingBox())!;
    expect(Math.round(pillBox.height)).toBe(20);
    expect(Math.round(pillBox.width)).toBeGreaterThanOrEqual(20);
  }
  await nav.screenshot({ path: testInfo.outputPath('section-nav-filled.png') });
});

test('SectionNav filled as a side list fills the current link instead of a start bar', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop-en',
    'The side list starts at md.',
  );
  await page.goto('/#section-nav');
  const nav = page.getByRole('navigation', { name: 'Reserve archive' });
  const year = nav.getByRole('link', { name: 'This year' });
  const last = nav.getByRole('link', { name: 'Last year' });
  await expect(nav.locator('.sw-section-nav-list')).toHaveCSS(
    'flex-direction',
    'column',
  );
  const [current, other] = await Promise.all(
    [year, last].map((link) =>
      link.evaluate((node) => {
        const style = getComputedStyle(node);
        return {
          start: style.borderInlineStartColor,
          width: style.borderInlineStartWidth,
          fill: style.backgroundColor,
          radius: style.borderTopLeftRadius,
          weight: style.fontWeight,
        };
      }),
    ),
  );
  // No accent start bar: the same transparent 2 px border as the others.
  expect(current!.start).toBe(other!.start);
  expect(current!.width).toBe('2px');
  expect(current!.fill).not.toBe(other!.fill);
  expect(current!.radius).toBe(other!.radius);
  expect(current!.radius).not.toBe('0px');
  expect([current!.weight, other!.weight]).toEqual(['600', '500']);
  // The underline demo's count is named in words.
  await expect(
    page.getByRole('link', { name: 'Rangers 2 walks to assign' }),
  ).toBeVisible();
});
