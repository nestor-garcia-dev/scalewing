import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { FileField } from './components/FileField.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const words = {
  changeLabel: 'Choose another',
  chooseLabel: 'Choose a photo',
  label: 'Cover photo',
  onChange: () => undefined,
};

describe('FileField preview', () => {
  it('draws a chosen photo’s thumbnail in place of the mark, hidden from assistive technology', () => {
    render(
      <FileField
        {...words}
        icon={<svg data-testid="mark" />}
        value={{
          name: 'heron-reeds.jpg',
          detail: '1.2 MB',
          preview: 'blob:https://gallery.test/heron',
        }}
      />,
    );
    const thumbnail = document.querySelector('img.sw-file-field-preview');
    expect(thumbnail?.getAttribute('src')).toBe(
      'blob:https://gallery.test/heron',
    );
    // An empty alt: the name beside it says which file it is.
    expect(thumbnail?.getAttribute('alt')).toBe('');
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.queryByTestId('mark')).toBeNull();
    const change = screen.getByRole('button', {
      name: 'Cover photo Choose another',
    });
    const described = (change.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent)
      .join(' ');
    expect(described).toBe('heron-reeds.jpg 1.2 MB');
  });

  it('keeps the mark for a file without a preview', () => {
    render(
      <FileField
        {...words}
        icon={<svg data-testid="mark" />}
        value={{ name: 'heron-reeds.pdf' }}
      />,
    );
    expect(screen.getByTestId('mark')).toBeTruthy();
    expect(document.querySelector('.sw-file-field-preview')).toBeNull();
  });

  it('swaps the thumbnail for a new preview and gives the mark back when the preview goes', () => {
    const field = (value: { name: string; preview?: string }) => (
      <FileField {...words} icon={<svg data-testid="mark" />} value={value} />
    );
    const { rerender } = render(
      field({ name: 'heron.jpg', preview: 'blob:https://gallery.test/heron' }),
    );
    rerender(
      field({ name: 'egret.jpg', preview: 'blob:https://gallery.test/egret' }),
    );
    const thumbnails = document.querySelectorAll('img.sw-file-field-preview');
    expect(thumbnails).toHaveLength(1);
    expect(thumbnails[0]?.getAttribute('src')).toBe(
      'blob:https://gallery.test/egret',
    );
    rerender(field({ name: 'egret.pdf' }));
    expect(document.querySelector('.sw-file-field-preview')).toBeNull();
    expect(screen.getByTestId('mark')).toBeTruthy();
  });

  it('refuses a blank preview address', () => {
    for (const preview of ['', '  '])
      expect(() =>
        render(<FileField {...words} value={{ name: 'heron.jpg', preview }} />),
      ).toThrow(
        new RangeError('FileField value preview must be an image address'),
      );
  });

  it('generates a 3:2 thumbnail from tokens and catalogs it', () => {
    expect(generateStylesheet()).toContain(
      '.sw-file-field-preview {\n  background: var(--sw-color-subtle);\n  border-radius: var(--sw-radius-sm);\n  display: block;\n  flex: none;\n  height: var(--sw-space-6);\n  object-fit: cover;\n  width: var(--sw-space-8);\n}',
    );
    expect(utilityClassCatalog()).toContain('sw-file-field-preview');
  });
});
