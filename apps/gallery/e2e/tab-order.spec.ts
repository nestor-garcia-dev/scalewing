import { expect, test, type Locator, type Page } from '@playwright/test';

/**
 * Safari leaves buttons, links, checkboxes and radios out of the Tab order
 * unless they carry an explicit tabindex. The `safari` project runs this file
 * in WebKit, which keeps that default; the Chromium projects run it too, so
 * every browser holds the same order.
 */

test('every press control and link on the gallery carries an explicit tabindex', async ({
  page,
}) => {
  await page.goto('/');
  const missing = await page
    .locator(
      'main button, main a[href], main input[type="checkbox"], main [role="switch"]',
    )
    .evaluateAll((nodes) =>
      nodes
        .filter((node) => !node.hasAttribute('tabindex'))
        .map((node) => node.outerHTML.slice(0, 120)),
    );
  expect(missing).toEqual([]);
});

/** Focus `from`, press Tab, and expect `to` to hold focus. */
async function tabsTo(page: Page, from: Locator, to: Locator) {
  await from.focus();
  await expect(from).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(to).toBeFocused();
}

test('Tab moves between Buttons, segmented items, links and checkboxes', async ({
  page,
}) => {
  await page.goto('/#button');
  const habitat = page
    .locator('#button')
    .getByRole('group', { name: 'Preferred habitat' });
  await tabsTo(
    page,
    habitat.getByRole('button').nth(0),
    habitat.getByRole('button').nth(1),
  );

  const classes = page
    .locator('#segmented-control')
    .getByRole('radiogroup')
    .first()
    .getByRole('radio');
  await tabsTo(page, classes.nth(0), classes.nth(1));

  const sections = page
    .locator('#section-nav')
    .getByRole('navigation')
    .first()
    .getByRole('link');
  await tabsTo(page, sections.nth(0), sections.nth(1));

  const boxes = page.locator('#checkbox').getByRole('checkbox');
  await tabsTo(page, boxes.nth(0), boxes.nth(1));

  const watchDays = page
    .locator('#filter-chips')
    .getByRole('group', { name: 'Watch days' })
    .getByRole('checkbox');
  await tabsTo(page, watchDays.nth(0), watchDays.nth(1));
});

test('Tab goes from one Stepper count to the next, past its − and +', async ({
  page,
}) => {
  await page.goto('/#stepper');
  const counts = page.locator('#stepper').getByRole('spinbutton');
  await tabsTo(page, counts.nth(0), counts.nth(1));
});

test('a RadioGroup or FilterChips is one tab stop, on its checked radio', async ({
  page,
}) => {
  await page.goto('/');
  const groups = await page
    // A multiple FilterChips is checkboxes, each its own stop (below).
    .locator(
      '#radio-group fieldset, #filter-chips fieldset:has(input[type="radio"])',
    )
    .evaluateAll((sets) =>
      sets.map((set) => {
        const radios = [
          ...set.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
        ];
        const stops = radios.filter(
          (radio) => radio.getAttribute('tabindex') === '0',
        );
        const checked = radios.find((radio) => radio.checked);
        const firstEnabled = radios.find((radio) => !radio.disabled);
        return {
          stops: stops.length,
          onEntry: stops[0] === (checked ?? firstEnabled),
          others: radios.every(
            (radio) => radio === stops[0] || !radio.hasAttribute('tabindex'),
          ),
        };
      }),
    );
  expect(groups.length).toBeGreaterThan(1);
  for (const group of groups) {
    expect(group).toEqual({ stops: 1, onEntry: true, others: true });
  }
});

test('Tab reaches both Pagination steps, the one at an end too', async ({
  page,
}) => {
  await page.goto('/#pagination');
  const pager = page.getByRole('navigation', { name: 'Site pages' });
  const previous = pager.getByRole('button', { name: 'Previous page' });
  const next = pager.getByRole('button', { name: 'Next page' });
  await expect(previous).toHaveAttribute('aria-disabled', 'true');
  await tabsTo(page, previous, next);
});

test('Tab moves through ListRows, the link rows too, past a disabled one', async ({
  page,
}) => {
  await page.goto('/#list-group');
  const look = page
    .locator('#list-group')
    .getByRole('list', { name: 'Worth a look' });
  await tabsTo(page, look.getByRole('button').first(), look.getByRole('link'));
  await tabsTo(page, look.getByRole('link'), look.getByRole('button').nth(1));

  const station = page
    .locator('#list-group')
    .getByRole('list', { name: 'Station' });
  // The disabled row is no tab stop: Shift+Tab from the row after it goes
  // back to the choice list above.
  await station.getByRole('button', { name: 'Leave the survey' }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(
    page
      .locator('#list-group')
      .getByRole('list', { name: 'Survey habitat' })
      .getByRole('button', { name: 'Savanna' }),
  ).toBeFocused();
});
