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
