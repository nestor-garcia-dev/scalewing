import { expect, test } from '@playwright/test';

test('Dialog keeps the reading width by default and widens at size lg', async ({
  page,
}, testInfo) => {
  await page.goto('/#dialog');
  const section = page.locator('#dialog');
  const isPhone = testInfo.project.name === 'mobile-es';
  const rem = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.documentElement).fontSize),
  );

  await section.getByRole('button', { name: 'Open dialog' }).click();
  const reading = page.getByRole('dialog', { name: 'How we rank' });
  await expect(reading).toBeVisible();
  const readingBox = await reading.boundingBox();
  expect(readingBox).not.toBeNull();
  await page.screenshot({ path: testInfo.outputPath('dialog-md.png') });
  await reading.getByRole('button', { name: 'Close' }).click();
  await expect(reading).toBeHidden();

  await section.getByRole('button', { name: 'Open wide dialog' }).click();
  const wide = page.getByRole('dialog', { name: 'Log a transect' });
  await expect(wide).toBeVisible();
  const wideBox = await wide.boundingBox();
  expect(wideBox).not.toBeNull();
  const fields = wide.getByRole('textbox');
  await expect(fields).toHaveCount(6);
  const first = await fields.nth(0).boundingBox();
  const last = await fields.nth(5).boundingBox();
  expect(first).not.toBeNull();
  expect(last).not.toBeNull();
  await page.screenshot({ path: testInfo.outputPath('dialog-lg.png') });

  if (isPhone) {
    // Both sizes fill the phone width minus the gutter; six fields fold to two per row.
    expect(
      Math.abs((readingBox?.width ?? 0) - (wideBox?.width ?? 0)),
    ).toBeLessThan(2);
    expect(last?.y ?? 0).toBeGreaterThan(first?.y ?? 0);
  } else {
    expect(readingBox?.width ?? 0).toBeLessThanOrEqual(32 * rem + 1);
    expect(wideBox?.width ?? 0).toBeGreaterThan(32 * rem + 1);
    expect(wideBox?.width ?? 0).toBeLessThanOrEqual(56 * rem + 1);
    // The six fields share one row at the large size.
    expect(Math.abs((last?.y ?? 0) - (first?.y ?? 0))).toBeLessThan(2);
  }
  await wide.getByRole('button', { name: 'Cancel' }).click();
  await expect(wide).toBeHidden();
});

test('Dialog titles with an h3 by default and an h2 at titleLevel 2, in the same style', async ({
  page,
}) => {
  await page.goto('/#dialog');
  const section = page.locator('#dialog');

  await section.getByRole('button', { name: 'Open dialog' }).click();
  const reading = page.getByRole('dialog', { name: 'How we rank' });
  const readingTitle = reading.getByRole('heading', { name: 'How we rank' });
  await expect(readingTitle).toHaveJSProperty('tagName', 'H3');
  const readingFont = await readingTitle.evaluate((node) => {
    const style = getComputedStyle(node);
    return [
      style.fontFamily,
      style.fontSize,
      style.fontWeight,
      style.letterSpacing,
      style.lineHeight,
    ];
  });
  await reading.getByRole('button', { name: 'Close' }).click();

  await section.getByRole('button', { name: 'Open wide dialog' }).click();
  const wide = page.getByRole('dialog', { name: 'Log a transect' });
  const wideTitle = wide.getByRole('heading', { level: 2 });
  await expect(wideTitle).toHaveText('Log a transect');
  // The dialog's section label is one level under its title (Teisoro CHG-13).
  await expect(wide.getByRole('heading', { level: 3 })).toHaveText(
    'Sightings per habitat',
  );
  expect(
    await wideTitle.evaluate((node) => {
      const style = getComputedStyle(node);
      return [
        style.fontFamily,
        style.fontSize,
        style.fontWeight,
        style.letterSpacing,
        style.lineHeight,
      ];
    }),
  ).toEqual(readingFont);
  await wide.getByRole('button', { name: 'Cancel' }).click();
  await expect(wide).toBeHidden();
});

test('Dialog asks onClose on Escape and stays open while the consumer is busy', async ({
  page,
}) => {
  // The demo stays busy for 1.5 s; the test owns the clock so the busy window
  // lasts exactly as long as the assertions need.
  await page.clock.install();
  await page.goto('/#dialog');
  const section = page.locator('#dialog');

  await section.getByRole('button', { name: 'Open dialog' }).click();
  const reading = page.getByRole('dialog', { name: 'How we rank' });
  await expect(reading).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(reading).toBeHidden();

  await section.getByRole('button', { name: 'Open wide dialog' }).click();
  const wide = page.getByRole('dialog', { name: 'Log a transect' });
  await expect(wide).toBeVisible();
  await wide.getByRole('button', { name: 'Record transect' }).click();
  await expect(wide.getByRole('button', { name: 'Recording…' })).toBeFocused();
  await expect(wide.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  // Chromium lets a page cancel one Escape per user activation; the dialog
  // must hold through repeated presses while open stays true.
  for (let press = 0; press < 3; press += 1) {
    await page.keyboard.press('Escape');
  }
  expect(await wide.evaluate((node: HTMLDialogElement) => node.open)).toBe(
    true,
  );
  await expect(wide).toBeVisible();
  await page.clock.runFor(1500);
  await expect(wide).toBeHidden();
});

test('Dialog is a bottom sheet on a phone and centered from md up, with a close button ending its title row', async ({
  page,
}, testInfo) => {
  const isPhone = testInfo.project.name === 'mobile-es';
  const forced = testInfo.project.name === 'forced-colors';
  // As with forcedColors, the project's reducedMotion option alone does not
  // reach the page's media queries, so emulate both here.
  await page.emulateMedia({
    forcedColors: forced ? 'active' : 'none',
    reducedMotion: 'reduce',
  });
  await page.goto('/#dialog');
  expect(
    await page.evaluate(
      () => matchMedia('(prefers-reduced-motion: reduce)').matches,
    ),
  ).toBe(true);
  const viewport = page.viewportSize();
  expect(viewport).toBeTruthy();
  if (!viewport) return;
  const trigger = page
    .locator('#dialog')
    .getByRole('button', { name: 'Review night count' });
  await trigger.click();
  const sheet = page.getByRole('dialog', { name: 'Review the night count' });
  await expect(sheet).toBeVisible();
  const title = sheet.getByRole('heading', { name: 'Review the night count' });
  await expect(title).toHaveJSProperty('tagName', 'H3');
  const close = sheet.getByRole('button', { name: 'Close' });
  // The first control in the dialog takes the focus on open.
  await expect(close).toBeFocused();

  const box = await sheet.boundingBox();
  expect(box).toBeTruthy();
  if (!box) return;
  const shape = await sheet.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      topLeft: style.borderTopLeftRadius,
      bottomLeft: style.borderBottomLeftRadius,
      bottomRight: style.borderBottomRightRadius,
      paddingBottom: style.paddingBottom,
      animation: style.animationName,
      lgRadius: getComputedStyle(element)
        .getPropertyValue('--sw-radius-lg')
        .trim(),
    };
  });
  expect(shape.topLeft).toBe(shape.lgRadius);
  if (isPhone) {
    // Docked to the bottom edge at the full width, a space-8 strip of
    // backdrop at least above it, bottom corners square.
    expect(Math.abs(box.x)).toBeLessThan(1);
    expect(Math.abs(box.width - viewport.width)).toBeLessThan(1);
    expect(Math.abs(box.y + box.height - viewport.height)).toBeLessThan(1);
    expect(box.y).toBeGreaterThanOrEqual(48 - 1);
    expect(shape.bottomLeft).toBe('0px');
    expect(shape.bottomRight).toBe('0px');
    expect(shape.paddingBottom).toBe('24px');
    // Reduced motion: no slide.
    expect(shape.animation).toBe('none');
  } else {
    // The centered dialog at the reading width, every corner rounded.
    const left = box.x;
    const right = viewport.width - (box.x + box.width);
    expect(Math.abs(left - right)).toBeLessThan(2);
    expect(box.y + box.height).toBeLessThan(viewport.height - 1);
    expect(shape.bottomLeft).toBe(shape.lgRadius);
  }

  // The close button ends the title row: centered on the title's line, its
  // glyph's end on the padding edge, a 44 px target on a touch screen.
  const closeBox = await close.boundingBox();
  const titleBox = await title.boundingBox();
  const glyph = close.locator('.sw-dialog-close-glyph');
  const glyphBox = await glyph.boundingBox();
  expect(closeBox && titleBox && glyphBox).toBeTruthy();
  if (!closeBox || !titleBox || !glyphBox) return;
  expect(
    Math.abs(
      closeBox.y + closeBox.height / 2 - (titleBox.y + titleBox.height / 2),
    ),
  ).toBeLessThan(1);
  expect(closeBox.x).toBeGreaterThan(titleBox.x + titleBox.width - 1);
  const contentEnd = await sheet.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.right -
      parseFloat(getComputedStyle(element).paddingRight) -
      parseFloat(getComputedStyle(element).borderRightWidth)
    );
  });
  expect(Math.abs(glyphBox.x + glyphBox.width - contentEnd)).toBeLessThan(1);
  expect(glyphBox.width).toBe(16);
  expect(closeBox.width).toBeGreaterThanOrEqual(isPhone ? 44 : 32);
  expect(
    await glyph.evaluate((element) => {
      const stroke = getComputedStyle(element, '::before');
      return [stroke.borderTopStyle, stroke.borderTopWidth];
    }),
  ).toEqual(['solid', '2px']);
  await page.screenshot({ path: testInfo.outputPath('dialog-sheet.png') });

  await close.click();
  await expect(sheet).toBeHidden();
  await expect(trigger).toBeFocused();

  // Escape still asks to close a sheet.
  await trigger.click();
  await expect(sheet).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
});

test('Dialog keeps its markup without a closeLabel', async ({ page }) => {
  await page.goto('/#dialog');
  await page
    .locator('#dialog')
    .getByRole('button', { name: 'Open dialog' })
    .click();
  const reading = page.getByRole('dialog', { name: 'How we rank' });
  await expect(reading).toBeVisible();
  await expect(reading.locator('.sw-dialog-header')).toHaveCount(0);
  await expect(reading.getByRole('button')).toHaveCount(1);
  await expect(reading.getByRole('button', { name: 'Close' })).toHaveClass(
    /sw-button-primary/,
  );
});

test('Dialog slides a sheet up on a phone with the motion tokens, unless reduced motion is asked for', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'mobile-es',
    'The sheet only exists below md.',
  );
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#dialog');
  await page
    .locator('#dialog')
    .getByRole('button', { name: 'Review night count' })
    .click();
  const sheet = page.getByRole('dialog', { name: 'Review the night count' });
  const motion = await sheet.evaluate((element) => {
    const style = getComputedStyle(element);
    return [style.animationName, style.animationDuration];
  });
  expect(motion).toEqual(['sw-dialog-sheet-in', '0.18s']);
  await sheet.evaluate((element) =>
    Promise.all(element.getAnimations().map((animation) => animation.finished)),
  );
  const box = await sheet.boundingBox();
  const viewport = page.viewportSize();
  expect(box && viewport).toBeTruthy();
  if (!box || !viewport) return;
  expect(Math.abs(box.y + box.height - viewport.height)).toBeLessThan(1);
});
