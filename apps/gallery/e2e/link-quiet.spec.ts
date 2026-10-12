import { createRequire } from 'node:module';

import { expect, test, type Page } from '@playwright/test';

const require = createRequire(import.meta.url);

/** The part of axe-core's page API this check calls. */
type Axe = {
  run: (
    context: unknown,
    options: unknown,
  ) => Promise<{ violations: { id: string }[] }>;
};

/** axe's link checks on the elements `selector` matches. */
function linkViolations(page: Page, selector: string): Promise<string[]> {
  return page.evaluate(
    (include) =>
      (window as Window & { axe: Axe }).axe
        .run(
          { include: [[include]] },
          { runOnly: ['link-in-text-block', 'link-name'] },
        )
        .then((result) => result.violations.map((violation) => violation.id)),
    selector,
  );
}

test('A quiet link reads as its row’s title, set apart by weight', async ({
  page,
}, testInfo) => {
  await page.goto('/#link');
  // The sky palette, whose accent is under 3:1 against the text, so an
  // accent link in body text fails axe there (the negative control below).
  await page
    .getByRole('combobox', { name: 'Palette', exact: true })
    .first()
    .selectOption('sky');
  await expect(page.locator('[data-palette="sky"]').first()).toBeAttached();
  const table = page.getByRole('table', { name: 'Morning sightings' });
  const link = table.getByRole('link', { name: 'Grey heron' });
  await expect(link).toBeVisible();
  // Against its nearest block, the body cell, as axe compares it: the
  // cell's colour, and weight 600 in 400 text.
  const [linkStyle, cellStyle] = await link.evaluate((node) => {
    const style = (element: Element) => {
      const computed = getComputedStyle(element);
      return {
        color: computed.color,
        weight: computed.fontWeight,
        line: computed.textDecorationLine,
      };
    };
    return [style(node), style(node.closest('td, th')!)];
  });
  expect(linkStyle.weight).toBe('600');
  expect(cellStyle.weight).toBe('400');
  expect(linkStyle.line).toBe('none');
  if (testInfo.project.name !== 'forced-colors')
    expect(linkStyle.color).toBe(cellStyle.color);

  // axe checks a link only in a text block: each row's detail is longer
  // than its title, so both rows are in scope.
  await page.addScriptTag({ path: require.resolve('axe-core') });
  await link.evaluate((node) =>
    node.closest('td')!.setAttribute('data-check', 'quiet'),
  );
  expect(await linkViolations(page, '[data-check="quiet"]')).toEqual([]);

  if (testInfo.project.name !== 'forced-colors') {
    // The negative control: the canvas's accent link at weight 400 in the
    // same kind of cell is flagged, so the check above can fail.
    await table.getByRole('link', { name: 'River otter' }).evaluate((node) => {
      const cell = node.closest('td')!;
      node.classList.remove('sw-link-quiet');
      cell.setAttribute('data-check', 'accent');
    });
    expect(await linkViolations(page, '[data-check="accent"]')).toEqual([
      'link-in-text-block',
    ]);
  }

  // Hover and keyboard focus underline it; focus keeps the ring.
  if (!testInfo.project.use.hasTouch) {
    await link.hover();
    await expect(link).toHaveCSS('text-decoration-line', 'underline');
    await page.mouse.move(0, 0);
  }
  await link.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS('text-decoration-line', 'underline');
  await expect(link).toHaveCSS('outline-style', 'solid');
  await page.screenshot({ path: testInfo.outputPath('link-quiet.png') });
});
