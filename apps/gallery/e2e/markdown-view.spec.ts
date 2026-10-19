import { createRequire } from 'node:module';

import { expect, test, type Page } from '@playwright/test';

import { tokenColor } from './contrast.js';

const require = createRequire(import.meta.url);

/** The part of axe-core's page API this check calls. */
type Axe = {
  run: (
    context: unknown,
    options: unknown,
  ) => Promise<{ violations: { id: string }[] }>;
};

/**
 * What axe finds wrong in the drawn page. In forced colours its contrast
 * check reads author colours the browser does not paint, so contrast is
 * checked in the other projects.
 */
async function axeViolations(page: Page, contrast: boolean) {
  await page.addScriptTag({ path: require.resolve('axe-core') });
  return page.evaluate(
    (withContrast) =>
      (window as Window & { axe: Axe }).axe
        .run(
          { include: [['#markdown-view .sw-markdown']] },
          {
            resultTypes: ['violations'],
            rules: { 'color-contrast': { enabled: withContrast } },
          },
        )
        .then((result) => result.violations.map((violation) => violation.id)),
    contrast,
  );
}

// The project's forcedColors option alone does not reach the page's media
// queries, so the forced-colors project emulates it as the other specs do.
test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'forced-colors') return;
  await page.emulateMedia({ forcedColors: 'active' });
});

test('MarkdownView draws the subset as elements in Scalewing’s type', async ({
  page,
}, testInfo) => {
  await page.goto('/#markdown-view');
  const view = page.locator('#markdown-view .sw-markdown');
  await expect(view).toBeVisible();

  // `#` is the page's second level, `##` the third, with ids.
  await expect(
    view.getByRole('heading', { level: 2, name: 'Before you set out' }),
  ).toHaveAttribute('id', 'field-notes-before-you-set-out');
  await expect(
    view.getByRole('heading', { level: 3, name: 'At the hide' }),
  ).toHaveAttribute('id', 'field-notes-at-the-hide');
  await expect(view.getByRole('heading', { level: 1 })).toHaveCount(0);

  // Links: the allowed schemes, in a new tab without an opener, named
  // with the hidden new-tab words.
  const guide = view.getByRole('link', {
    name: 'survey guide (opens in a new tab)',
    exact: true,
  });
  await expect(guide).toHaveAttribute(
    'href',
    'https://example.org/heron-survey',
  );
  await expect(guide).toHaveAttribute('target', '_blank');
  await expect(guide).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(
    view.getByRole('link', { name: /^write to the warden/ }),
  ).toHaveAttribute('href', 'mailto:warden@example.org');
  await expect(view.getByRole('link')).toHaveCount(2);
  // The script link keeps its words; nothing else is drawn from HTML,
  // the table or the outside photo.
  await expect(view.getByText('a script link and an')).toBeVisible();
  await expect(view.locator('table, script, b, code, pre')).toHaveCount(0);

  // The photo is the consumer's, with its alt words and its caption.
  const photo = view.getByRole('img', {
    name: 'A grey heron standing in shallow water in front of reeds',
  });
  await expect(photo).toBeVisible();
  expect(
    await photo.evaluate((node) => (node as HTMLImageElement).naturalWidth),
  ).toBeGreaterThan(0);
  await expect(view.locator('figcaption')).toHaveText([
    'The north colony at dawn',
    'The same nests from the south path',
  ]);
  // The photo in the quote has no alt of its own: its caption names it.
  await expect(
    view
      .locator('blockquote')
      .getByRole('img', { name: 'The same nests from the south path' }),
  ).toBeVisible();
  await expect(view.locator('img')).toHaveCount(2);

  // Lists: numbered, with a nested bullet list.
  await expect(view.locator('ol > li')).toHaveCount(3);
  await expect(view.locator('ol > li ul > li')).toHaveCount(2);

  // The highlighted box, and the page's own words, in body type.
  const quote = view.locator('blockquote');
  await expect(quote).toContainText('count a third time');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await expect(quote).toHaveCSS('border-top-style', 'solid');
  else {
    await expect(quote).toHaveCSS(
      'background-color',
      await tokenColor(page, 'accentSubtle'),
    );
    // On the tint, a caption is the text colour, not the muted one.
    await expect(quote.locator('figcaption')).toHaveCSS(
      'color',
      await tokenColor(page, 'text'),
    );
  }

  // "On this page" is a Nav of the headings' ids.
  const onThisPage = page
    .locator('#markdown-view')
    .getByRole('navigation', { name: 'On this page' });
  await expect(
    onThisPage.getByRole('link', { name: 'At the hide' }),
  ).toHaveAttribute('href', '#field-notes-at-the-hide');

  // What was left out is listed for the editor.
  const omitted = page
    .locator('#markdown-view')
    .getByRole('note')
    .or(page.locator('#markdown-view .sw-notice'));
  await expect(omitted.first()).toContainText('table: | Species');
  await expect(omitted.first()).toContainText('link: [script link]');
  await expect(omitted.first()).toContainText('image: ![outside photo]');

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(0);

  expect(await axeViolations(page, !forced)).toEqual([]);
  await view.screenshot({
    path: testInfo.outputPath('markdown-view-light.png'),
  });
  if (forced) return;
  await page.getByRole('radio', { name: 'Dark' }).first().check();
  expect(await axeViolations(page, true)).toEqual([]);
  await expect(guide).toHaveCSS('color', await tokenColor(page, 'accent'));
  await view.screenshot({
    path: testInfo.outputPath('markdown-view-dark.png'),
  });
});
