import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ScreenPreview } from './components/ScreenPreview.js';
import { PreviewGroup } from './components/screen-preview/PreviewGroup.js';
import { PreviewRow } from './components/screen-preview/PreviewRow.js';
import { PreviewTiles } from './components/screen-preview/PreviewTiles.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const css = generateStylesheet();

function Census({ frame }: { frame?: 'card' | 'device' }) {
  return (
    <ScreenPreview
      caption="A photo of the real board goes here."
      eyebrow="Census · Today"
      frame={frame}
      label="Today's census: herons, egrets and the total"
      title="Birds on the marsh"
    >
      <PreviewGroup>
        <PreviewRow label="Grey herons" value="14" />
        <PreviewRow kind="total" label="All birds" value="20" />
      </PreviewGroup>
      <PreviewGroup>
        <PreviewRow kind="note" label="Last count" value="North hide · 9:12" />
        <PreviewRow kind="filled" label="Rails" value="2" />
        <PreviewRow kind="alert" label="Alert" value="Hide closed" />
      </PreviewGroup>
      <PreviewTiles
        items={[
          { id: 'n', label: 'North', value: '6' },
          { id: 's', label: 'South', value: '8' },
        ]}
      />
    </ScreenPreview>
  );
}

describe('ScreenPreview', () => {
  it('draws one image named by its label inside a figure with a caption', () => {
    const { container } = render(<Census />);
    const figure = container.querySelector('figure') as HTMLElement;
    expect(figure.className).toBe('sw-screen-preview sw-screen-preview-card');
    const image = screen.getByRole('img', {
      name: "Today's census: herons, egrets and the total",
    });
    expect(image.className).toBe('sw-screen-preview-screen');
    expect(image.parentElement?.className).toBe('sw-screen-preview-bezel');
    expect(figure.querySelector('figcaption')?.textContent).toBe(
      'A photo of the real board goes here.',
    );
    expect(
      [...image.querySelectorAll('.sw-screen-preview-header > span')].map(
        (span) => [span.className, span.textContent],
      ),
    ).toEqual([
      ['sw-screen-preview-eyebrow', 'Census · Today'],
      ['sw-screen-preview-title', 'Birds on the marsh'],
    ]);
  });

  it('marks each row by its kind and lays tiles out by item', () => {
    const { container } = render(<Census frame="device" />);
    expect(container.querySelector('figure')?.className).toBe(
      'sw-screen-preview sw-screen-preview-device',
    );
    expect(
      [...container.querySelectorAll('.sw-preview-row')].map(
        (row) => row.className,
      ),
    ).toEqual([
      'sw-preview-row sw-preview-row-plain',
      'sw-preview-row sw-preview-row-total',
      'sw-preview-row sw-preview-row-note',
      'sw-preview-row sw-preview-row-filled',
      'sw-preview-row sw-preview-row-alert',
    ]);
    expect(container.querySelectorAll('.sw-preview-group')).toHaveLength(2);
    const tiles = [...container.querySelectorAll('.sw-preview-tile')];
    expect(tiles.map((tile) => tile.textContent)).toEqual(['North6', 'South8']);
    expect(tiles[0]?.lastElementChild?.className).toBe('sw-preview-tile-value');
  });

  it('leaves out the header and the caption when not given', () => {
    const { container } = render(
      <ScreenPreview className="extra" label="A count">
        <PreviewRow label="Herons" value="14" />
      </ScreenPreview>,
    );
    expect(container.querySelector('figure')?.className).toBe(
      'sw-screen-preview sw-screen-preview-card extra',
    );
    expect(container.querySelector('.sw-screen-preview-header')).toBeNull();
    expect(container.querySelector('figcaption')).toBeNull();
    render(
      <ScreenPreview label="Only a title" title="Birds">
        <PreviewRow label="Herons" value="14" />
      </ScreenPreview>,
    );
    expect(
      screen
        .getByRole('img', { name: 'Only a title' })
        .querySelector('.sw-screen-preview-eyebrow'),
    ).toBeNull();
  });

  it('fails closed on a blank label, an unknown frame or kind, and bad tiles', () => {
    expect(() => render(<ScreenPreview label=" ">rows</ScreenPreview>)).toThrow(
      RangeError,
    );
    expect(() =>
      render(
        <ScreenPreview frame={'poster' as never} label="A count">
          rows
        </ScreenPreview>,
      ),
    ).toThrow('Unknown ScreenPreview frame: poster');
    expect(() =>
      render(<PreviewRow kind={'loud' as never} label="a" value="b" />),
    ).toThrow('Unknown PreviewRow kind: loud');
    expect(() => render(<PreviewTiles items={[]} />)).toThrow(RangeError);
    expect(() =>
      render(<PreviewTiles items={[{ id: ' ', label: 'a', value: '1' }]} />),
    ).toThrow('PreviewTiles items need nonempty ids');
    expect(() =>
      render(
        <PreviewTiles
          items={[
            { id: 'a', label: 'a', value: '1' },
            { id: 'a', label: 'b', value: '2' },
          ]}
        />,
      ),
    ).toThrow('PreviewTiles items need unique ids');
  });

  it('draws the phone bezel only from md, and a card below it', () => {
    const wide = css.slice(
      css.indexOf('.sw-screen-preview-device { width: 20rem; }') - 400,
    );
    expect(wide).toContain('@media (min-width: 48rem) {');
    expect(css).toContain(
      '.sw-screen-preview-device .sw-screen-preview-bezel {\n    background: var(--sw-color-text);',
    );
    expect(css).toContain(
      '.sw-preview-tiles { grid-template-columns: repeat(6, minmax(0, 1fr)); }',
    );
    expect(css).toContain(
      '.sw-preview-row-alert {\n  background: color-mix(in srgb, var(--sw-color-danger) 10%, var(--sw-color-surface));',
    );
    expect(css).toContain(
      '@media (forced-colors: active) and (min-width: 48rem) {\n  .sw-screen-preview-device .sw-screen-preview-screen { border: 0; }\n  .sw-screen-preview-device .sw-screen-preview-bezel { border: 1px solid CanvasText; }\n}',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-screen-preview',
        'sw-screen-preview-card',
        'sw-screen-preview-device',
        'sw-preview-row-total',
        'sw-preview-tiles',
      ]),
    );
  });
});
