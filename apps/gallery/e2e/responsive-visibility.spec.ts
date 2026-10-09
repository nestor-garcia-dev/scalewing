import { expect, test } from '@playwright/test';

test('Box hides the wide or narrow region at the md breakpoint', async ({
  page,
}, testInfo) => {
  await page.goto('/#responsive-visibility');
  const section = page.locator('#responsive-visibility');
  const wide = section.getByText(/^Wide layout/);
  const narrow = section.getByText(/^Narrow layout/);
  const isMobile = testInfo.project.name === 'mobile-es';

  if (isMobile) {
    await expect(wide).toBeHidden();
    await expect(narrow).toBeVisible();
  } else {
    await expect(wide).toBeVisible();
    await expect(narrow).toBeHidden();
  }
  await section.screenshot({
    path: testInfo.outputPath('responsive-visibility.png'),
  });

  const { width } = page.viewportSize() ?? { width: 0 };
  await page.setViewportSize({ width: isMobile ? 768 : 767, height: 900 });
  if (isMobile) {
    await expect(wide).toBeVisible();
    await expect(narrow).toBeHidden();
  } else {
    await expect(wide).toBeHidden();
    await expect(narrow).toBeVisible();
  }
  await page.setViewportSize({ width, height: 900 });
});

test('Box hides a label below the lg breakpoint, leaving the named glyph', async ({
  page,
}, testInfo) => {
  await page.goto('/#responsive-visibility');
  const habitats = page.getByRole('navigation', { name: 'Habitats' });
  const wetlands = habitats.getByRole('button', { name: 'Wetlands' });
  const label = wetlands.getByText('Wetlands');
  const { width } = page.viewportSize() ?? { width: 0 };
  const note = page.getByText(/^Below lg: each habitat is its glyph/);
  await page.setViewportSize({ width: 1023, height: 900 });
  await expect(wetlands).toBeVisible();
  await expect(label).toBeHidden();
  await expect(note).toBeVisible();
  // The glyph is named by its tooltip, switched on by script that follows
  // breakpointQuery.
  await expect(wetlands).toHaveAttribute('aria-labelledby', /.+/);
  // A destination is a 44 px target on a coarse pointer (the phone
  // project), whatever its size.
  const box = await wetlands.boundingBox();
  const coarse = await page.evaluate(
    () => window.matchMedia('(pointer: coarse)').matches,
  );
  expect(coarse).toBe(testInfo.project.name === 'mobile-es');
  expect(Math.min(box!.width, box!.height) >= 44).toBe(coarse);
  await wetlands.screenshot({ path: testInfo.outputPath('glyph.png') });
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(label).toBeVisible();
  await expect(note).toBeHidden();
  await expect(wetlands).not.toHaveAttribute('aria-labelledby');
  await expect(wetlands).toHaveAccessibleName('Wetlands');
  await wetlands.click();
  await expect(page.getByText('Opened: Wetlands.')).toBeVisible();
  await page.setViewportSize({ width, height: 900 });
});
