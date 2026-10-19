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
 * What axe finds wrong in the articles. In forced colours its contrast
 * check reads author colours the browser does not paint, so contrast is
 * checked in the other projects.
 */
async function axeViolations(page: Page, contrast: boolean) {
  await page.addScriptTag({ path: require.resolve('axe-core') });
  return page.evaluate(
    (withContrast) =>
      (window as Window & { axe: Axe }).axe
        .run(
          { include: [['#article .sw-article']] },
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

test('Article reads like a post: cover, eyebrow and actions, title, meta, hairline, body', async ({
  page,
}, testInfo) => {
  await page.goto('/#article');
  const post = page.getByRole('article', {
    name: 'How to count herons at the north hide',
  });
  await expect(post).toBeVisible();
  await expect(
    post.getByRole('heading', {
      level: 3,
      name: 'How to count herons at the north hide',
    }),
  ).toBeVisible();

  // The cover is edge to edge across the top, 3:1 (2:1 on a phone), with
  // the card's top corners.
  const cover = post.getByRole('img', {
    name: 'A grey heron standing in shallow water in front of reeds',
  });
  expect(
    await cover.evaluate((node) => (node as HTMLImageElement).naturalWidth),
  ).toBeGreaterThan(0);
  const [postBox, coverBox] = await Promise.all([
    post.boundingBox(),
    cover.boundingBox(),
  ]);
  if (!postBox || !coverBox) throw new Error('The article is not drawn');
  expect(Math.abs(coverBox.y - postBox.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(coverBox.width - postBox.width)).toBeLessThanOrEqual(2);
  const phone = testInfo.project.name === 'mobile-es';
  expect(coverBox.width / coverBox.height).toBeCloseTo(phone ? 2 : 3, 1);
  await expect(cover).toHaveCSS(
    'border-top-left-radius',
    await post.evaluate((node) => getComputedStyle(node).borderTopLeftRadius),
  );

  // The reading width: never wider than 46rem.
  expect(postBox.width).toBeLessThanOrEqual(46 * 16 + 0.5);

  // The eyebrow's row holds the language switch at its end.
  const eyebrow = post.locator('.sw-article-eyebrow');
  await expect(eyebrow).toHaveText('Field guide · Wetlands › Herons');
  const language = post.getByRole('radiogroup', { name: 'Language' });
  const [switchBox, metaBox, bodyBox, eyebrowBox] = await Promise.all([
    language.boundingBox(),
    post.locator('.sw-article-meta').boundingBox(),
    post.locator('.sw-article-content').boundingBox(),
    eyebrow.boundingBox(),
  ]);
  if (!switchBox || !metaBox || !bodyBox || !eyebrowBox)
    throw new Error('Missing parts');
  if (phone) {
    // Too narrow for one row: the switch wraps under the eyebrow, at its start.
    expect(switchBox.y).toBeGreaterThanOrEqual(
      eyebrowBox.y + eyebrowBox.height,
    );
    expect(Math.abs(switchBox.x - eyebrowBox.x)).toBeLessThanOrEqual(1);
  } else {
    expect(
      Math.abs(switchBox.x + switchBox.width - (bodyBox.x + bodyBox.width)),
    ).toBeLessThanOrEqual(1);
    expect(switchBox.y).toBeLessThan(eyebrowBox.y + eyebrowBox.height);
  }
  await expect(post.locator('.sw-article-meta')).toHaveText(
    'Ranger 1 · Oct 16 · 4 min read',
  );
  expect(metaBox.y).toBeLessThan(bodyBox.y);
  const forced = testInfo.project.name === 'forced-colors';
  if (!forced)
    await expect(eyebrow).toHaveCSS('color', await tokenColor(page, 'muted'));

  // The switch is the consumer's: it changes the article's words.
  await language.getByRole('radio', { name: 'Español' }).click();
  const spanish = page.getByRole('article', {
    name: 'Cómo contar garzas desde el observatorio norte',
  });
  await expect(spanish).toHaveAttribute('lang', 'es');
  await expect(spanish.locator('.sw-article-meta')).toHaveText(
    'Guardabosques 1 · 16 oct · 4 min de lectura',
  );

  // An article without a cover or meta starts with its eyebrow.
  const bulletin = page.getByRole('article', {
    name: 'The east trail is closed for nesting season',
  });
  await expect(bulletin.locator('img, .sw-article-meta')).toHaveCount(0);
  await expect(bulletin).toHaveClass(/sw-card-glass/);

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(0);
  expect(await axeViolations(page, !forced)).toEqual([]);
  await spanish.screenshot({ path: testInfo.outputPath('article-light.png') });
  if (forced) return;
  await page.getByRole('radio', { name: 'Dark' }).first().check();
  expect(await axeViolations(page, true)).toEqual([]);
  await spanish.screenshot({ path: testInfo.outputPath('article-dark.png') });
});
