import { createRequire } from 'node:module';

import { expect, test, type Locator, type Page } from '@playwright/test';

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

function underline(link: Locator) {
  return link.evaluate((node) => {
    const computed = getComputedStyle(node);
    return {
      color: computed.color,
      line: computed.textDecorationLine,
      lineColor: computed.textDecorationColor,
      thickness: computed.textDecorationThickness,
      offset: computed.textUnderlineOffset,
    };
  });
}

test('An inline link in a sentence is the accent, always underlined, light and dark', async ({
  page,
}, testInfo) => {
  await page.goto('/#link');
  const forced = testInfo.project.name === 'forced-colors';
  const paragraph = page.locator('[data-example="inline-link"]');
  const link = paragraph.getByRole('link', { name: 'nesting guide' });
  const external = paragraph.getByRole('link', {
    name: 'see which hides are closed (opens in a new tab)',
  });
  await expect(link).toBeVisible();
  await expect(external).toHaveAttribute('target', '_blank');
  await expect(external.locator('.sw-link-external-mark')).toBeVisible();
  await page.addScriptTag({ path: require.resolve('axe-core') });

  for (const scheme of ['Light', 'Dark'] as const) {
    if (!forced) {
      await page.getByRole('radio', { name: scheme, exact: true }).check();
      await expect(
        page.getByRole('radio', { name: scheme, exact: true }),
      ).toBeChecked();
    }
    const rest = await underline(link);
    // Underlined at rest: a hairline below the baseline, not the full colour.
    expect(rest.line).toBe('underline');
    expect(rest.thickness).toBe('1px');
    expect(parseFloat(rest.offset)).toBeGreaterThan(0);
    if (!forced) {
      // The canvas link's accent, the line a fainter mix of it.
      const canvasLink = page.getByRole('link', {
        name: 'Layout link to Field',
      });
      expect(rest.color).toBe(
        await canvasLink.evaluate((node) => getComputedStyle(node).color),
      );
      expect(rest.lineColor).not.toBe(rest.color);
    }
    expect((await underline(external)).line).toBe('underline');

    // axe passes both links in the paragraph on their underline.
    expect(await linkViolations(page, '[data-example="inline-link"]')).toEqual(
      [],
    );
    await paragraph.screenshot({
      path: testInfo.outputPath(`link-inline-${scheme.toLowerCase()}.png`),
    });
    if (forced) break;
  }

  if (!forced) {
    // The negative control, in dark: the canvas's accent link (no underline)
    // in the same paragraph is flagged, so the check above can fail.
    await link.evaluate((node) => node.classList.remove('sw-link-inline'));
    await external.evaluate((node) => node.classList.remove('sw-link-inline'));
    expect(
      await linkViolations(page, '[data-example="inline-link"]'),
    ).toContain('link-in-text-block');
    await link.evaluate((node) => node.classList.add('sw-link-inline'));
    await external.evaluate((node) => node.classList.add('sw-link-inline'));
  }

  // Hover and keyboard focus strengthen the line; the words stay in the
  // accent and focus keeps the ring.
  const rest = await underline(link);
  if (!testInfo.project.use.hasTouch) {
    await link.hover();
    await expect(link).toHaveCSS('text-decoration-thickness', '2px');
    const hovered = await underline(link);
    expect(hovered.color).toBe(rest.color);
    expect(hovered.lineColor).toBe(hovered.color);
    await page.mouse.move(0, 0);
  }
  await link.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS('text-decoration-line', 'underline');
  await expect(link).toHaveCSS('text-decoration-thickness', '2px');
  await expect(link).toHaveCSS('outline-style', 'solid');
  expect((await underline(link)).color).toBe(rest.color);
});
