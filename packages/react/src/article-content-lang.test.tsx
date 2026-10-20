import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Article } from './components/Article.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/** Every element in the article that carries a `lang`, as `tag.class: lang`. */
function langs(node: HTMLElement): string[] {
  return [...node.querySelectorAll('[lang]')].map(
    (element) =>
      `${element.tagName.toLowerCase()}.${element.className}: ${element.getAttribute('lang') ?? ''}`,
  );
}

describe('Article contentLang', () => {
  it('marks the title and the body only, never the eyebrow, meta, actions or cover', () => {
    render(
      <Article
        actions={<button type="button">Language</button>}
        contentLang="es"
        cover={{ src: '/marsh.jpg', alt: 'Reeds at the north hide' }}
        eyebrow="Bulletin · Only in Spanish"
        meta="Ranger 2 · Oct 18"
        title="El sendero este cierra por la anidación"
        titleAs="h2"
      >
        <p>Las garzas anidan junto al sendero.</p>
      </Article>,
    );
    const article = screen.getByRole('article', {
      name: 'El sendero este cierra por la anidación',
    });
    expect(article.getAttribute('lang')).toBeNull();
    expect(langs(article)).toEqual([
      'h2.sw-text-heading sw-article-title: es',
      'div.sw-article-content: es',
    ]);
    for (const part of [
      '.sw-article-eyebrow',
      '.sw-article-meta',
      '.sw-article-actions',
      '.sw-article-cover',
    ])
      expect(article.querySelector(part)?.closest('[lang]')).toBeNull();
    expect(
      screen
        .getByText('Las garzas anidan junto al sendero.')
        .closest('[lang]')
        ?.getAttribute('lang'),
    ).toBe('es');
  });

  it('marks the title alone when there is no body', () => {
    render(<Article contentLang="en" title="Heron calls" />);
    expect(langs(screen.getByRole('article', { name: 'Heron calls' }))).toEqual(
      ['h1.sw-text-heading sw-article-title: en'],
    );
  });

  it('adds no lang without contentLang, and keeps a lang the consumer puts on the article', () => {
    render(
      <>
        <Article title="Heron calls">
          <p>Body</p>
        </Article>
        <Article lang="es" title="Garzas">
          <p>Cuerpo</p>
        </Article>
      </>,
    );
    expect(langs(screen.getByRole('article', { name: 'Heron calls' }))).toEqual(
      [],
    );
    const whole = screen.getByRole('article', { name: 'Garzas' });
    expect(whole.getAttribute('lang')).toBe('es');
    expect(langs(whole)).toEqual([]);
  });

  it('throws on a blank contentLang', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    for (const contentLang of ['', '  '])
      expect(() =>
        render(<Article contentLang={contentLang} title="Heron calls" />),
      ).toThrow(
        new RangeError('Article contentLang must be a non-empty language tag'),
      );
  });
});
