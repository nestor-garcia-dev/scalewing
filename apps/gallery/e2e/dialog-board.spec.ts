import { expect, test, type Page } from '@playwright/test';

import { colorContrast } from './contrast.js';

const bg = (page: Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((node) => getComputedStyle(node).backgroundColor);

for (const [title, banded] of [
  ['Tally the roosts', false],
  ['Tally the bridge roosts', true],
] as const) {
  test(`${title}: a grabber on the phone sheet, cards on the grouped canvas, a status line and no figure until one is counted`, async ({
    page,
  }, testInfo) => {
    const forced = testInfo.project.name === 'forced-colors';
    const phone = testInfo.project.name === 'mobile-es';
    await page.goto('/#dialog');
    const fills: string[] = [];
    for (const scheme of forced ? ['Light'] : ['Light', 'Dark']) {
      await page.getByRole('radio', { name: scheme, exact: true }).check();
      await page
        .locator('#dialog')
        .getByRole('button', { name: title, exact: true })
        .click();
      const dialog = page.getByRole('dialog', { name: title });
      await expect(dialog).toBeVisible();

      // No figure yet: the live region holds only the status line.
      const status = dialog.getByRole('status');
      await expect(status).toHaveText('Nothing counted yet');
      await expect(status.locator('.sw-action-bar-summary')).toHaveCount(0);

      // The grouped canvas: solid, no blur, apart from the cards on it.
      const fill = await dialog.evaluate(
        (node) => getComputedStyle(node).backgroundColor,
      );
      expect(
        await dialog.evaluate((node) => getComputedStyle(node).backdropFilter),
      ).toBe('none');
      if (!forced) {
        expect(await bg(page, 'dialog[open] .sw-card')).not.toBe(fill);
        // The status line's muted words on the footer surface.
        const note = dialog.locator('.sw-dialog-footer-note');
        const [ink, surface] = await Promise.all([
          note.evaluate((node) => getComputedStyle(node).color),
          bg(page, 'dialog[open] .sw-dialog-footer'),
        ]);
        expect(colorContrast(ink, surface)).toBeGreaterThanOrEqual(4.5);
      }
      fills.push(fill);

      const grabber = dialog.locator('.sw-dialog-grabber');
      await expect(grabber).toHaveAttribute('aria-hidden', 'true');
      if (phone) {
        await expect(grabber).toBeVisible();
        const [box, bar, heading] = await Promise.all([
          dialog.boundingBox(),
          grabber.boundingBox(),
          dialog.getByRole('heading', { name: title }).boundingBox(),
        ]);
        // Centered, a step under the top edge, above the title.
        expect(
          Math.abs(bar!.x + bar!.width / 2 - (box!.x + box!.width / 2)),
        ).toBeLessThanOrEqual(1);
        // space-2 under the top edge, inside its 1px border.
        expect(Math.round(bar!.y - box!.y)).toBe(9);
        expect(bar!.y + bar!.height).toBeLessThan(heading!.y);
        // Drawn over a banded title band, not under it.
        const onTop = await grabber.evaluate((node) => {
          const r = node.getBoundingClientRect();
          return (
            document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) ===
            node
          );
        });
        expect(onTop).toBe(true);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
        expect(
          await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth),
        ).toBe(true);
      } else {
        await expect(grabber).toBeHidden();
      }
      await dialog.screenshot({
        path: testInfo.outputPath(
          `${banded ? 'banded' : 'glass'}-${scheme.toLowerCase()}.png`,
        ),
      });

      // The first count brings the figure into the same live region.
      await dialog
        .getByRole('button', { name: 'Add four at church loft' })
        .click();
      await expect(status).toHaveText(
        'Bats 4 in all roostsSaved on this device',
      );
      if (phone) {
        // The grabber stays at the top while the content scrolls.
        await dialog.evaluate((node) => node.scrollTo(0, node.scrollHeight));
        const [box, bar] = await Promise.all([
          dialog.boundingBox(),
          grabber.boundingBox(),
        ]);
        expect(Math.round(bar!.y - box!.y)).toBe(9);
      }
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    }
    if (fills.length === 2) expect(fills[1]).not.toBe(fills[0]);
    if (!phone) return;
    // Forced colours on the phone: the bar is drawn in the text colour.
    await page.emulateMedia({ forcedColors: 'active' });
    await page
      .locator('#dialog')
      .getByRole('button', { name: title, exact: true })
      .click();
    const dialog = page.getByRole('dialog', { name: title });
    const [bar, ink] = await Promise.all([
      dialog
        .locator('.sw-dialog-grabber')
        .evaluate((node) => getComputedStyle(node).backgroundColor),
      dialog
        .getByRole('heading', { name: title })
        .evaluate((node) => getComputedStyle(node).color),
    ]);
    expect(bar).toBe(ink);
    await dialog.screenshot({
      path: testInfo.outputPath(`${banded ? 'banded' : 'glass'}-forced.png`),
    });
  });
}
