import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { FixtureGroup, FixtureRow } from './index.js';

afterEach(cleanup);

function Sheet({ titleHidden }: { titleHidden?: boolean }) {
  return (
    <FixtureGroup
      title="Sunday 25 October · North meadow"
      titleHidden={titleHidden}
    >
      <FixtureRow
        away={{ name: 'Otter Pool' }}
        center="3–1"
        centerKind="score"
        home={{ name: 'Heron Marsh' }}
      />
    </FixtureGroup>
  );
}

describe('FixtureGroup titleHidden', () => {
  it('keeps the title as the list name without drawing the caption', () => {
    const { container } = render(<Sheet titleHidden />);
    const list = screen.getByRole('list', {
      name: 'Sunday 25 October · North meadow',
    });
    const title = document.getElementById(
      list.getAttribute('aria-labelledby')!,
    )!;
    expect(title.className).toBe('sw-sr-only');
    expect(title.textContent).toBe('Sunday 25 October · North meadow');
    expect(container.querySelector('.sw-fixture-group-title')).toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('draws the caption by default and with false', () => {
    for (const titleHidden of [undefined, false]) {
      render(<Sheet titleHidden={titleHidden} />);
      const list = screen.getByRole('list', {
        name: 'Sunday 25 October · North meadow',
      });
      expect(
        document.getElementById(list.getAttribute('aria-labelledby')!)!
          .className,
      ).toBe('sw-fixture-group-title');
      cleanup();
    }
  });

  it('still refuses a blank title', () => {
    expect(() =>
      render(
        <FixtureGroup title=" " titleHidden>
          {null}
        </FixtureGroup>,
      ),
    ).toThrow(new RangeError('FixtureGroup title must be nonempty'));
  });
});
