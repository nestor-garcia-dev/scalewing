import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Article, type ArticleProps } from './components/Article.js';
import { Text } from './components/Text.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function article(props: Partial<ArticleProps> = {}) {
  return render(
    <Article
      cover={{ src: 'heron.jpg', alt: 'A grey heron in the reeds' }}
      eyebrow="Field guide · Wetlands"
      meta="Ranger 1 · Oct 16 · 4 min read"
      title="How to count herons"
      {...props}
    >
      <p>Count at first light.</p>
    </Article>,
  );
}

describe('Article', () => {
  it('is an article named by its title, the title a level-one heading', () => {
    article();
    const node = screen.getByRole('article', { name: 'How to count herons' });
    expect(node.className).toBe('sw-card sw-card-glass sw-article');
    const title = screen.getByRole('heading', {
      level: 1,
      name: 'How to count herons',
    });
    expect(title.className).toContain('sw-text-heading');
    expect(title.className).toContain('sw-article-title');
    expect(node.getAttribute('aria-labelledby')).toBe(title.id);
  });

  it('draws the cover first, then the eyebrow, title, meta, a hairline and the body', () => {
    const { container } = article({
      actions: <button type="button">Español</button>,
    });
    const node = container.querySelector('article');
    expect(
      Array.from(node?.children ?? []).map((child) => child.className),
    ).toEqual(['sw-article-cover', 'sw-article-body']);
    const cover = screen.getByRole('img', {
      name: 'A grey heron in the reeds',
    });
    expect(cover.getAttribute('src')).toBe('heron.jpg');
    const body = node?.querySelector('.sw-article-body');
    expect(
      Array.from(body?.children ?? []).map((child) => child.className),
    ).toEqual([
      'sw-article-header',
      'sw-separator sw-separator-horizontal',
      'sw-article-content',
    ]);
    const header = body?.querySelector('header');
    expect(header?.querySelector('.sw-article-eyebrow')?.textContent).toBe(
      'Field guide · Wetlands',
    );
    expect(header?.querySelector('.sw-article-actions')?.textContent).toBe(
      'Español',
    );
    expect(header?.querySelector('.sw-article-meta')?.textContent).toBe(
      'Ranger 1 · Oct 16 · 4 min read',
    );
    expect(body?.querySelector('[role="none"]')).not.toBeNull();
    expect(
      screen.getByText('Count at first light.').parentElement?.className,
    ).toBe('sw-article-content');
  });

  it('draws only what it is given', () => {
    const { container } = render(<Article title="Owl pellets" />);
    expect(
      container.querySelector(
        'img, .sw-article-top, .sw-article-meta, .sw-article-content',
      ),
    ).toBeNull();
    const { container: eyebrowOnly } = render(
      <Article eyebrow="Guide" meta={false} title="Frogs">
        {null}
      </Article>,
    );
    expect(eyebrowOnly.querySelector('.sw-article-actions')).toBeNull();
    expect(eyebrowOnly.querySelector('.sw-article-eyebrow')).not.toBeNull();
    expect(
      eyebrowOnly.querySelector('.sw-article-meta, .sw-article-content'),
    ).toBeNull();
    const { container: actionsOnly } = render(
      <Article
        actions={<button type="button">English</button>}
        title="Toads"
      />,
    );
    expect(actionsOnly.querySelector('.sw-article-eyebrow')).toBeNull();
    expect(actionsOnly.querySelector('.sw-article-actions')).not.toBeNull();
  });

  it('takes an h2 title inside another page, a decorative cover, a variant and a class', () => {
    article({
      titleAs: 'h2',
      cover: { src: 'reeds.jpg', alt: '' },
      variant: 'outlined',
      className: 'trail-notes',
      id: 'notes',
    });
    expect(
      screen.getByRole('heading', { level: 2, name: 'How to count herons' }),
    ).toBeTruthy();
    const node = screen.getByRole('article');
    expect(node.className).toBe(
      'sw-card sw-card-outlined sw-article trail-notes',
    );
    expect(node.id).toBe('notes');
    expect(screen.queryByRole('img')).toBeNull();
    expect(node.querySelector('img')?.getAttribute('alt')).toBe('');
  });

  it('takes block content in its eyebrow and meta, an h3 title, a lang and a ref', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Article
        actions={true}
        cover={null}
        eyebrow={<Text as="span">Guide</Text>}
        lang="es"
        meta={<Text variant="caption">Guardabosques 1</Text>}
        ref={ref}
        title="Garzas"
        titleAs="h3"
      />,
    );
    const node = screen.getByRole('article', { name: 'Garzas' });
    expect(ref.current).toBe(node);
    expect(node.getAttribute('lang')).toBe('es');
    expect(
      screen.getByRole('heading', { level: 3, name: 'Garzas' }),
    ).toBeTruthy();
    // Block content never lands in a paragraph.
    expect(container.querySelector('.sw-article-meta')?.tagName).toBe('DIV');
    expect(container.querySelector('.sw-article-eyebrow')?.tagName).toBe('DIV');
    expect(container.querySelector('p p, p div')).toBeNull();
    // A null cover and boolean actions draw nothing.
    expect(container.querySelector('img, .sw-article-actions')).toBeNull();
  });

  it.each([
    [{ title: ' ' }, 'Article title must be non-empty text'],
    [{ title: undefined }, 'Article title must be non-empty text'],
    [{ titleAs: 'h4' }, 'Unknown Article titleAs: h4'],
    [{ variant: 'paper' }, 'Unknown Article variant: paper'],
    [
      { cover: { src: '', alt: 'x' } },
      'Article cover src must be non-empty text',
    ],
    [{ cover: { src: 'a.jpg' } }, 'Article cover alt must be text'],
  ])('refuses %o', (props, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => article(props as Partial<ArticleProps>)).toThrow(message);
  });

  it('generates a card at the reading width, its cover edge to edge, from tokens', () => {
    const css = generateStylesheet();
    expect(css).toContain('--sw-reading-max: 46rem;');
    expect(css).toContain('max-inline-size: var(--sw-reading-max);');
    expect(css).toContain('border-start-start-radius: inherit;');
    expect(css).toContain('aspect-ratio: 3 / 1;');
    expect(css).toMatch(/\.sw-article-cover \{ aspect-ratio: 2 \/ 1; \}/);
    expect(css).toMatch(
      /\.sw-article-body \{\n {2}display: flex;[^}]*padding: var\(--sw-space-6\) var\(--sw-space-8\);/,
    );
    // Wrapped actions start at the row's start; alone, they keep its end.
    expect(css).toContain(
      '.sw-article-actions:only-child { margin-inline-start: auto; }',
    );
    const rules = css.slice(
      css.indexOf('.sw-article {'),
      css.indexOf('.sw-article-content'),
    );
    expect(rules).not.toMatch(/#[0-9a-f]{3,6}\b/i);
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-article',
        'sw-article-cover',
        'sw-article-eyebrow',
      ]),
    );
  });
});
