import { expect, test } from '@playwright/test';

import { chromiumNaming } from './chromium-naming.js';

test('TaskList draws a marker per status, reads each status word and keeps its actions in the row', async ({
  page,
}, testInfo) => {
  const project = testInfo.project.name;
  if (project === 'forced-colors')
    await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#task-list');
  const card = page.getByTestId('task-list-card');
  const list = card.getByRole('list', { name: 'Get the spring survey ready' });
  await expect(list).toBeVisible();
  const rows = list.getByRole('listitem');
  await expect(rows).toHaveCount(5);

  // Each title is read with its status word in one line (no space before the comma).
  const spoken = await rows.evaluateAll((items) =>
    items.map((item) => item.querySelector('.sw-sr-only')?.textContent),
  );
  expect(spoken).toEqual([
    'The site, Done',
    'The count, Next step',
    'Photos, To do',
    'Send the report, Waiting',
    'Share with volunteers, Waiting',
  ]);

  // Chromium describes the Change button by its task's title.
  const change = await chromiumNaming(
    page,
    `document.querySelector('#task-list .sw-task-list-item-done button')`,
  );
  expect(change).toEqual({ name: 'Change', description: 'The site' });

  // Markers are 24 px and decorative; the next one is an accent ring.
  const markers = list.locator('.sw-task-list-marker');
  for (const marker of await markers.all()) {
    const box = (await marker.boundingBox())!;
    expect(Math.round(box.width)).toBe(24);
    expect(Math.round(box.height)).toBe(24);
    await expect(marker).toHaveAttribute('aria-hidden', 'true');
  }
  if (project === 'forced-colors') {
    await expect(markers.nth(2)).toHaveCSS('border-top-style', 'solid');
  } else {
    await expect(
      list.locator('.sw-task-list-item-next .sw-task-list-marker'),
    ).toHaveCSS('box-shadow', /inset/);
  }

  // Actions stay inside the card, and on touch every small Button is 44 px.
  const cardBox = (await card.boundingBox())!;
  for (const button of await list.getByRole('button').all()) {
    const box = (await button.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(cardBox.x);
    expect(box.x + box.width).toBeLessThanOrEqual(cardBox.x + cardBox.width);
    if (project === 'mobile-es') {
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    } else {
      expect(Math.round(box.height)).toBe(32);
    }
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  // The next task's action completes it: the following task becomes next.
  await list.getByRole('button', { name: 'Start counting' }).click();
  await expect(list.locator('.sw-task-list-item-next')).toContainText('Photos');
  await expect(list.locator('.sw-task-list-item-done')).toHaveCount(2);
});
