import { expect, test } from '@playwright/test';

test('Checkbox responds once to pointer and keyboard and preserves invalid and disabled states', async ({
  page,
}, testInfo) => {
  await page.goto('/#checkbox');
  const section = page.locator('#checkbox');
  const source = section.getByRole('checkbox', { name: 'Source confirmed' });
  const disabled = section.getByRole('checkbox', {
    name: 'Archived habitat observations require curator access',
  });

  await expect(source).not.toBeChecked();
  await expect(source).toHaveAttribute('aria-invalid', 'true');
  await expect(source).toHaveAccessibleDescription(/Confirm the source/);
  // Associated as Field's error is, in a polite live region, not an alert.
  await expect(section.getByRole('alert')).toHaveCount(0);
  const region = section.locator('.sw-checkbox-error').first();
  await expect(region).toHaveAttribute('aria-live', 'polite');
  await expect(region).toHaveText('Confirm the source');
  await expect(source).toHaveAttribute('required', '');
  await expect(disabled).toBeDisabled();
  const disabledLabel = section.getByText(
    'Archived habitat observations require curator access',
  );
  const labelBounds = await disabledLabel.boundingBox();
  const sectionBounds = await section.boundingBox();
  expect(labelBounds).not.toBeNull();
  expect(sectionBounds).not.toBeNull();
  expect((labelBounds?.x ?? 0) + (labelBounds?.width ?? 0)).toBeLessThanOrEqual(
    (sectionBounds?.x ?? 0) + (sectionBounds?.width ?? 0) + 1,
  );
  await section.screenshot({
    path: testInfo.outputPath('checkbox-invalid.png'),
  });

  await section.getByText('Source confirmed', { exact: true }).click();
  await expect(source).toBeChecked();
  await expect(source).toHaveAttribute('aria-invalid', 'false');
  // The region stays, empty, ready to announce the next error.
  await expect(region).toHaveText('');
  await expect(region).toHaveAttribute('aria-live', 'polite');
  await expect(section.getByText(/Callbacks: 1\./)).toBeVisible();
  await source.focus();
  await source.press('Space');
  await expect(source).not.toBeChecked();
  await expect(section.getByText(/Callbacks: 2\./)).toBeVisible();
  await expect(disabled).not.toBeChecked();
});
