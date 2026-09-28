import { expect, test } from '@playwright/test';

test('Accordion shows a subtitle, a turning chevron, and a smaller nested title', async ({
  page,
}, testInfo) => {
  await page.goto('/#accordion');
  const section = page.locator('#accordion');
  const range = section.locator('details').first();
  const summary = range.locator(':scope > summary');
  await expect(range).toHaveAttribute('open', '');

  const layout = await summary.evaluate((element) => {
    const style = getComputedStyle(element);
    return { display: style.display, listStyle: style.listStyleType };
  });
  expect(layout).toEqual({ display: 'flex', listStyle: 'none' });

  const title = summary.getByText('Range', { exact: true });
  const subtitle = summary.getByText(
    'Four regions · Wintering grounds labeled',
  );
  const titleBox = await title.boundingBox();
  const subtitleBox = await subtitle.boundingBox();
  expect(titleBox && subtitleBox).toBeTruthy();
  if (!titleBox || !subtitleBox) return;
  expect(subtitleBox.y).toBeGreaterThanOrEqual(
    titleBox.y + titleBox.height - 1,
  );
  const fontSize = (locator: typeof title) =>
    locator.evaluate((element) =>
      parseFloat(getComputedStyle(element).fontSize),
    );
  expect(await fontSize(subtitle)).toBeLessThan(await fontSize(title));

  const marker = summary.locator('.sw-accordion-marker');
  await expect(marker).toHaveAttribute('aria-hidden', 'true');
  const openTransform = await marker.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  const transitionDuration = () =>
    marker.evaluate((element) => getComputedStyle(element).transitionDuration);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  expect(await transitionDuration()).not.toBe('0s');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await transitionDuration()).toBe('0s');

  const nested = range.locator('details.sw-accordion-sm');
  const nestedTitle = nested.getByText('How the range is measured');
  expect(await fontSize(nestedTitle)).toBeLessThan(await fontSize(title));
  // The nested header is an sm control: 32px at least, shorter than a md one.
  const nestedHeader = await nested.locator(':scope > summary').boundingBox();
  expect(nestedHeader).toBeTruthy();
  expect(nestedHeader?.height).toBeGreaterThanOrEqual(32);
  expect(nestedHeader?.height).toBeLessThan(44);
  await nested.locator('summary').click();
  await expect(nested).toHaveAttribute('open', '');
  await expect(nested.getByText(/Field teams walk/)).toBeVisible();
  await section.screenshot({ path: testInfo.outputPath('accordion-open.png') });

  await summary.click();
  await expect(range).not.toHaveAttribute('open', '');
  const closedTransform = await marker.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  expect(closedTransform).not.toBe(openTransform);
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(range).toHaveAttribute('open', '');
  await section.screenshot({ path: testInfo.outputPath('accordion.png') });
});
