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
