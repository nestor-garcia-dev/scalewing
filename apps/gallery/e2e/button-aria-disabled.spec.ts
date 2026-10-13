import { expect, test } from '@playwright/test';

test('Button aria-disabled looks off, yet is focused and pressed', async ({
  page,
}, testInfo) => {
  await page.goto('/#button');
  const forced = testInfo.project.name === 'forced-colors';
  if (forced) await page.emulateMedia({ forcedColors: 'active' });
  const group = page.getByRole('group', { name: 'Off until ready' });
  const count = group.getByRole('button', { name: 'Count the herd' });
  const record = page
    .getByRole('group', { name: 'Sheet actions' })
    .getByRole('button', { name: 'Log the sighting' });

  // Not the disabled attribute: only aria-disabled says it is off.
  expect(
    await count.evaluate((node) => (node as HTMLButtonElement).disabled),
  ).toBe(false);
  await expect(count).toHaveAttribute('aria-disabled', 'true');
  await expect(count).toHaveCSS('cursor', 'not-allowed');
  if (forced) {
    // Greyed in the system's GrayText, as a disabled button.
    const gray = await count.evaluate((node) => {
      const span = document.createElement('span');
      span.style.color = 'GrayText';
      node.parentElement!.append(span);
      const color = getComputedStyle(span).color;
      span.remove();
      return color;
    });
    await expect(count).toHaveCSS('color', gray);
  } else {
    // The same grey and muted words as a disabled neutral button.
    for (const property of ['background-color', 'color', 'opacity'])
      await expect(count).toHaveCSS(
        property,
        await record.evaluate(
          (node, name) => getComputedStyle(node).getPropertyValue(name),
          property,
        ),
      );
  }

  // It is a tab stop and its press runs.
  await count.focus();
  await expect(count).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(
    page.getByText('Last press: count off, name the herd first'),
  ).toBeVisible();
});
