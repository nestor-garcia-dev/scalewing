import { expect, test } from '@playwright/test';

test('An external link opens a new tab, draws its arrow and says so', async ({
  page,
}, testInfo) => {
  await page.goto('/#link');
  const link = page
    .locator('#link')
    .getByRole('link', { name: 'Check the marsh map (opens in a new tab)' });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer');

  // The arrow follows the words in the link's colour, on their line.
  const mark = link.locator('.sw-link-external-mark');
  await expect(mark).toHaveAttribute('aria-hidden', 'true');
  const [markStyle, linkColor] = await mark.evaluate((node) => {
    const style = getComputedStyle(node);
    return [
      {
        top: style.borderTopColor,
        right: style.borderRightColor,
        width: style.borderTopWidth,
      },
      getComputedStyle(node.parentElement!).color,
    ];
  });
  expect(markStyle.top).toBe(linkColor);
  expect(markStyle.right).toBe(linkColor);
  expect(markStyle.width).toBe('2px');
  // Both boxes in one read, so a page still laying out cannot move one.
  const [markBox, linkBox] = await mark.evaluate((node) =>
    [node, node.parentElement!].map((element) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height };
    }),
  );
  expect(markBox.width).toBeGreaterThan(0);
  expect(markBox.x + markBox.width).toBeLessThanOrEqual(
    linkBox.x + linkBox.width + 1,
  );
  expect(markBox.y).toBeGreaterThanOrEqual(linkBox.y);
  expect(markBox.y + markBox.height).toBeLessThanOrEqual(
    linkBox.y + linkBox.height,
  );

  // The hidden words are not drawn.
  const hidden = link.locator('.sw-sr-only');
  await expect(hidden).toHaveText(' (opens in a new tab)');
  expect((await hidden.boundingBox())!.width).toBeLessThanOrEqual(1);

  // A press opens the address in a new page, not this one.
  await page.route('https://example.org/**', (route) =>
    route.fulfill({ body: 'map', contentType: 'text/plain' }),
  );
  const [popup] = await Promise.all([
    page.context().waitForEvent('page'),
    link.click(),
  ]);
  await popup.waitForLoadState();
  expect(popup.url()).toBe('https://example.org/marsh-map');
  expect(await popup.evaluate(() => window.opener)).toBeNull();
  expect(page.url()).toContain('#link');
  await popup.close();
  await link.screenshot({
    path: testInfo.outputPath('link-external.png'),
  });
});
