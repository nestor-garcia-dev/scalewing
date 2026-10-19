import { contrastRatio } from '@scalewing/tokens';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { inspectMarkdown, MarkdownView } from './components/MarkdownView.js';
import {
  maxNesting,
  maxParseNesting,
} from './components/markdown/markdown-limits.js';
import {
  HeadingIds,
  isSafeImageSrc,
  photoId,
  safeLinkHref,
} from './components/markdown/markdown-rules.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { forEveryTheme } from './every-theme.test-support.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function view(
  source: string,
  props: Partial<Parameters<typeof MarkdownView>[0]> = {},
) {
  return render(
    <MarkdownView
      newTabLabel="(opens in a new tab)"
      source={source}
      {...props}
    />,
  ).container;
}

describe('MarkdownView subset', () => {
  it('draws paragraphs, bold, italic and hard line breaks as elements', () => {
    const container = view(
      'Herons **wait** in *still* water.  \nThey strike fast.\n\nSecond.',
    );
    const paragraphs = container.querySelectorAll('p.sw-markdown-paragraph');
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]?.querySelector('strong')?.textContent).toBe('wait');
    expect(paragraphs[0]?.querySelector('em')?.textContent).toBe('still');
    expect(paragraphs[0]?.querySelector('br')).not.toBeNull();
    expect(container.firstElementChild?.className).toBe('sw-markdown');
  });

  it('draws # as the page’s second level, ## and ### under it, deeper ones as ###', () => {
    const container = view(
      '# Before\n\n## At the hide\n\n### Notes\n\n#### Small',
    );
    const headings = Array.from(container.querySelectorAll('h2, h3, h4')).map(
      (node) => [node.tagName, node.className, node.id, node.textContent],
    );
    expect(headings).toEqual([
      ['H2', 'sw-markdown-heading sw-markdown-heading-1', 'before', 'Before'],
      [
        'H3',
        'sw-markdown-heading sw-markdown-heading-2',
        'at-the-hide',
        'At the hide',
      ],
      ['H4', 'sw-markdown-heading sw-markdown-heading-3', 'notes', 'Notes'],
      ['H4', 'sw-markdown-heading sw-markdown-heading-3', 'small', 'Small'],
    ]);
    expect(container.querySelector('h1')).toBeNull();
  });

  it('draws bullet and numbered lists, nested, tight and loose', () => {
    const container = view(
      '- Grey heron\n- Night heron\n  - Juvenile\n\n3. Count\n4. Write it down\n\n- Loose one\n\n- Loose two',
    );
    const lists = container.querySelectorAll(
      ':scope > div > ul, :scope > div > ol',
    );
    expect(lists).toHaveLength(3);
    expect(lists[0]?.querySelectorAll(':scope > li')).toHaveLength(2);
    expect(lists[0]?.querySelector('li ul li')?.textContent).toBe('Juvenile');
    expect(lists[0]?.querySelector('li > p')).toBeNull();
    expect(lists[1]?.tagName).toBe('OL');
    expect(lists[1]?.getAttribute('start')).toBe('3');
    expect(lists[2]?.querySelectorAll('li > p')).toHaveLength(2);
  });

  it('draws a block quote as the highlighted box', () => {
    const container = view('> If the amounts **don’t match**, hand it back.');
    const quote = container.querySelector('blockquote');
    expect(quote?.className).toBe('sw-markdown-quote');
    expect(quote?.querySelector('strong')?.textContent).toBe('don’t match');
  });

  it('draws a thematic break as a separator', () => {
    const container = view('Above\n\n---\n\nBelow');
    expect(container.querySelector('.sw-separator')).not.toBeNull();
  });
});

describe('MarkdownView links', () => {
  it('opens http, https and mailto links in a new tab without an opener', () => {
    view(
      '[Guide](https://example.org/guide) [Old](http://example.org) [Mail](mailto:ranger@example.org)',
      { newTabLabel: '(opens in a new tab)' },
    );
    for (const [name, href] of [
      ['Guide', 'https://example.org/guide'],
      ['Old', 'http://example.org/'],
      ['Mail', 'mailto:ranger@example.org'],
    ] as const) {
      const link = screen.getByRole('link', {
        // jsdom trims the hidden span's leading space; Playwright checks
        // the browser's name with it.
        name: new RegExp(`^${name} ?\\(opens in a new tab\\)$`),
      });
      expect(link.getAttribute('href')).toBe(href);
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link.className).toBe('sw-markdown-link');
      expect(link.getAttribute('tabindex')).toBe('0');
    }
  });

  it.each([
    ['javascript:alert(1)'],
    ['JavaScript:alert(1)'],
    ['jav&#x09;ascript:alert(1)'],
    ['data:text/html,hello'],
    ['vbscript:msgbox'],
    ['file:///etc/passwd'],
    ['ftp://example.org/file'],
    ['tel:+15550100'],
    ['/relative/path'],
    ['#section'],
    ['//example.org/protocol-relative'],
    ['not a url'],
  ])('shows a link to %s as its plain words and reports it', (url) => {
    const source = `Go [there](<${url}>) now.`;
    const container = view(source);
    expect(container.querySelector('a')).toBeNull();
    expect(container.textContent).toBe('Go there now.');
    const [omission, ...rest] = inspectMarkdown(source).omissions;
    expect(rest).toEqual([]);
    // The link's words and its address as the parser read it.
    expect(omission?.kind).toBe('link');
    expect(omission?.source.startsWith('[there](')).toBe(true);
  });

  it('holds reference links and autolinks to the same schemes', () => {
    const source = [
      'See [the guide][g] and [the trap][t], <https://example.org/auto> and <javascript:alert(1)>.',
      '',
      '[g]: https://example.org/guide',
      '[t]: javascript:alert(1)',
    ].join('\n');
    const container = view(source);
    const links = Array.from(container.querySelectorAll('a')).map((link) => [
      link.textContent,
      link.getAttribute('href'),
    ]);
    expect(links).toEqual([
      ['the guide (opens in a new tab)', 'https://example.org/guide'],
      [
        'https://example.org/auto (opens in a new tab)',
        'https://example.org/auto',
      ],
    ]);
    expect(container.textContent).toContain('the trap');
    expect(container.textContent).toContain('javascript:alert(1)');
    expect(inspectMarkdown(source).omissions.map((item) => item.kind)).toEqual([
      'link',
      'link',
    ]);
  });

  it('decides on the address the browser would read, never the raw text', () => {
    expect(safeLinkHref(' https://example.org ')).toBe('https://example.org/');
    expect(safeLinkHref('java\tscript:alert(1)')).toBeNull();
    expect(safeLinkHref('\u0000javascript:alert(1)')).toBeNull();
    expect(safeLinkHref('HTTPS://EXAMPLE.ORG/A')).toBe('https://example.org/A');
    expect(safeLinkHref('mailto:a@example.org')).toBe('mailto:a@example.org');
  });
});

describe('MarkdownView images', () => {
  const resolveImage = (id: string) =>
    id === 'nest-1'
      ? { src: 'blob:nest-1', alt: 'A heron nest in reeds' }
      : null;

  it('draws a photo: image as a figure with its caption, resolved by the consumer', () => {
    const source =
      'Before\n\n![The north colony at dawn](photo:nest-1)\n\nAfter';
    const container = view(source, { resolveImage });
    const figure = container.querySelector('figure.sw-markdown-figure');
    const image = figure?.querySelector('img');
    expect(image?.getAttribute('src')).toBe('blob:nest-1');
    expect(image?.getAttribute('alt')).toBe('A heron nest in reeds');
    expect(figure?.querySelector('figcaption')?.textContent).toBe(
      'The north colony at dawn',
    );
    // A figure is never inside a paragraph.
    expect(container.querySelector('p figure')).toBeNull();
    expect(inspectMarkdown(source, { resolveImage }).omissions).toEqual([]);
  });

  it('splits a paragraph around a photo inside it', () => {
    const container = view('Look here ![Nest](photo:nest-1) and here.', {
      resolveImage,
    });
    expect(
      Array.from(container.firstElementChild?.children ?? []).map(
        (node) => node.tagName,
      ),
    ).toEqual(['P', 'FIGURE', 'P']);
    expect(container.querySelectorAll('p')[0]?.textContent).toBe('Look here');
    expect(container.querySelectorAll('p')[1]?.textContent).toBe('and here.');
  });

  it.each([
    ['![Outside](https://example.org/nest.png)'],
    ['![Data](data:image/png;base64,AAAA)'],
    ['![Unknown](photo:nest-9)'],
    ['![Bad id](photo:../../etc)'],
    ['![Ref][r]\n\n[r]: https://example.org/r.png'],
  ])('leaves out %s and reports it', (source) => {
    const container = view(source, { resolveImage });
    expect(container.querySelector('img')).toBeNull();
    expect(
      inspectMarkdown(source, { resolveImage }).omissions.map(
        (item) => item.kind,
      ),
    ).toEqual(['image']);
  });

  it('gives a photo words: its alt, else its caption; with neither it is left out', () => {
    const noAlt = (id: string) =>
      id === 'p1' ? { src: '/photos/p1.jpg' } : null;
    const captioned = view('![The south colony](photo:p1)', {
      resolveImage: noAlt,
    });
    expect(captioned.querySelector('img')?.getAttribute('alt')).toBe(
      'The south colony',
    );
    const bare = '![](photo:p1)';
    expect(view(bare, { resolveImage: noAlt }).querySelector('img')).toBeNull();
    expect(
      inspectMarkdown(bare, { resolveImage: noAlt }).omissions.map(
        (item) => item.kind,
      ),
    ).toEqual(['image']);
    const named = (id: string) =>
      id === 'p1' ? { src: 'p1.jpg', alt: 'A heron' } : null;
    const figure = view('![](photo:p1)', { resolveImage: named });
    expect(figure.querySelector('img')?.getAttribute('alt')).toBe('A heron');
    expect(figure.querySelector('figcaption')).toBeNull();
  });

  it.each([
    ['javascript:alert(1)', false],
    ['data:image/svg+xml,<svg/>', true],
    ['data:image/x-icon;base64,AAAA', false],
    ['data:text/html,hi', false],
    ['vbscript:x', false],
    [' ', false],
    ['/photos/p1.jpg', true],
    ['p1.jpg', true],
    ['https://cdn.example.org/p1.jpg', true],
    ['blob:https://example.org/1', true],
    ['data:image/png;base64,AAAA', true],
  ])(
    'draws a resolved photo at %s only when its address is safe (%s)',
    (src, drawn) => {
      const container = view('![Nest](photo:p1)', {
        resolveImage: () => ({ src, alt: 'Nest' }),
      });
      expect(container.querySelector('img') !== null).toBe(drawn);
      expect(isSafeImageSrc(src)).toBe(drawn);
    },
  );

  it('keeps a paragraph whole around an image it leaves out', () => {
    const container = view(
      'An ![outside photo](https://example.org/egret.png) stays out.',
    );
    expect(container.querySelectorAll('p')).toHaveLength(1);
    expect(container.textContent).toBe('An stays out.');
  });

  it('leaves out every photo when the consumer resolves none', () => {
    const container = view('![Nest](photo:nest-1)');
    expect(container.querySelector('img')).toBeNull();
  });

  it('reads photo ids of letters, digits, - and _ only', () => {
    expect(photoId('photo:2f1c6a9e-0b6e-4c7a-9a43-1f9a3d0e5b21')).toBe(
      '2f1c6a9e-0b6e-4c7a-9a43-1f9a3d0e5b21',
    );
    expect(photoId('photo:')).toBeNull();
    expect(photoId('PHOTO:abc')).toBeNull();
    expect(photoId('photo:a/b')).toBeNull();
  });
});

describe('MarkdownView leaves out what it does not draw', () => {
  it('drops raw HTML and scripts, keeping the words between tags', () => {
    const source =
      'Hello <b onclick="alert(1)">there</b>.\n\n<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>';
    const container = view(source);
    expect(container.querySelector('script, img, b')).toBeNull();
    expect(container.textContent).toBe('Hello there.');
    expect(inspectMarkdown(source).omissions).toEqual([
      { kind: 'html', source: '<b onclick="alert(1)">' },
      { kind: 'html', source: '</b>' },
      { kind: 'html', source: '<script>alert(1)</script>' },
      { kind: 'html', source: '<img src=x onerror=alert(1)>' },
    ]);
  });

  it('drops tables', () => {
    const source = '| Species | Count |\n| --- | --- |\n| Heron | 4 |\n\nAfter';
    const container = view(source);
    expect(container.querySelector('table')).toBeNull();
    expect(container.textContent).toBe('After');
    expect(inspectMarkdown(source).omissions[0]?.kind).toBe('table');
  });

  it('shows code as plain text and reports it', () => {
    const source =
      'Run `count --all`.\n\n```js\nconst herons = 4;\nlog(herons);\n```';
    const container = view(source);
    expect(container.querySelector('code, pre')).toBeNull();
    expect(container.textContent).toBe(
      'Run count --all.const herons = 4;log(herons);',
    );
    expect(container.querySelectorAll('br')).toHaveLength(1);
    expect(inspectMarkdown(source).omissions.map((item) => item.kind)).toEqual([
      'code',
      'code',
    ]);
  });

  it('cuts a long omission to 80 characters', () => {
    const long = `<div>${'x'.repeat(200)}</div>`;
    const [omission] = inspectMarkdown(long).omissions;
    expect(omission?.source).toHaveLength(80);
    expect(omission?.source.endsWith('…')).toBe(true);
  });

  it('never sets HTML from a string', () => {
    const container = view('<p onmouseover="alert(1)">x</p>\n\n**ok**');
    expect(container.innerHTML).not.toContain('onmouseover');
    expect(container.querySelector('[onmouseover]')).toBeNull();
  });
});

describe('MarkdownView headings list', () => {
  it('lists the headings with the ids the view gives them, unique, after a prefix', () => {
    const source =
      '# Before you start\n\n## At the counter\n\n## At the counter\n\n# Después\n\n# !!!';
    const { headings } = inspectMarkdown(source, { idPrefix: 'page-' });
    expect(headings).toEqual([
      { id: 'page-before-you-start', level: 1, text: 'Before you start' },
      { id: 'page-at-the-counter', level: 2, text: 'At the counter' },
      { id: 'page-at-the-counter-2', level: 2, text: 'At the counter' },
      { id: 'page-despues', level: 1, text: 'Después' },
      { id: 'page-section', level: 1, text: '!!!' },
    ]);
    const container = view(source, { idPrefix: 'page-' });
    expect(
      Array.from(container.querySelectorAll('[id]')).map((node) => node.id),
    ).toEqual(headings.map((heading) => heading.id));
  });

  it('numbers repeats from where it left off, past ids the words already took', () => {
    const ids = new HeadingIds('p-');
    expect(
      ['Nest', 'Nest 2', 'Nest', 'Nest', 'Nest 3'].map((text) =>
        ids.take(text),
      ),
    ).toEqual(['p-nest', 'p-nest-2', 'p-nest-3', 'p-nest-4', 'p-nest-3-2']);
    // Ten thousand repeats (the 50,000-character limit) stay unique and
    // take one step each.
    const many = inspectMarkdown('# a\n\n'.repeat(10000)).headings;
    expect(many).toHaveLength(10000);
    expect(new Set(many.map((heading) => heading.id)).size).toBe(10000);
    expect(many.at(-1)?.id).toBe('a-10000');
  });

  it('makes ids from a heading’s words without its marks', () => {
    expect(new HeadingIds('').take('**Bold** and *more*')).toBe(
      'bold-and-more',
    );
    expect(inspectMarkdown('# **Bold** move').headings[0]?.text).toBe(
      'Bold move',
    );
  });
});

describe('MarkdownView limits', () => {
  it('draws quotes nested past the limit as words, without overflowing', () => {
    const source = `${'>'.repeat(100)} deep heron`;
    const container = view(source);
    expect(container.textContent).toContain('deep heron');
    expect(container.querySelectorAll('blockquote').length).toBeLessThanOrEqual(
      maxNesting,
    );
    expect(inspectMarkdown(source).omissionCounts.limit).toBe(1);
  });

  it('keeps the parser shallow, where opener runs stay fast', () => {
    // markdown-it's work on runs of `[` and `![` grows with this cap:
    // 25,000 `![` took 1.1 s at 1,000 levels and under 0.1 s at 128.
    expect(maxParseNesting).toBe(128);
  });

  it('reports what the parser stops reading past its own depth', () => {
    const source = `${'>'.repeat(maxParseNesting + 500)} lost words\n\nAfter`;
    const container = view(source);
    expect(container.textContent).toContain('After');
    expect(inspectMarkdown(source).omissionCounts.limit).toBeGreaterThan(0);
  });

  it('draws lists nested past the limit as words', () => {
    const source = Array.from(
      { length: 60 },
      (_, depth) => `${'  '.repeat(depth)}- level ${depth}`,
    ).join('\n');
    const container = view(source);
    expect(container.textContent).toContain('level 59');
    expect(container.querySelectorAll('ul').length).toBeLessThanOrEqual(
      maxNesting + 2,
    );
    expect(inspectMarkdown(source).omissionCounts.limit).toBeGreaterThan(0);
  });

  it('draws marks nested past the limit as their words', () => {
    const source = `${'*a '.repeat(40)}x${' a*'.repeat(40)}`;
    const container = view(source);
    let deepest = 0;
    for (const node of container.querySelectorAll('em, strong')) {
      let depth = 0;
      for (let at: Element | null = node; at; at = at.parentElement)
        if (at.matches('em, strong')) depth += 1;
      deepest = Math.max(deepest, depth);
    }
    expect(deepest).toBeLessThanOrEqual(maxNesting);
    expect(container.textContent?.replace(/\s+/g, ' ')).toContain('a x a');
    expect(inspectMarkdown(source).omissionCounts.limit).toBeGreaterThan(0);
    expect(() => view(`${'*'.repeat(4000)}a${'*'.repeat(4000)}`)).not.toThrow();
  });

  it('keeps every word of emphasis nested 8,333 deep, once', () => {
    const source = `${'*a '.repeat(8333)}x${' a*'.repeat(8333)}`;
    const words = view(source).textContent?.trim().split(/\s+/) ?? [];
    expect(words).toHaveLength(8333 * 2 + 1);
  });

  it('counts a link drawn as words past the mark limit', () => {
    const source = `${'*a '.repeat(17)}[x](https://ok.example/) ${' a*'.repeat(17)}`;
    const container = view(source);
    expect(container.querySelector('a')).toBeNull();
    expect(container.textContent).toContain('x');
    const { omissions, omissionCounts } = inspectMarkdown(source);
    // One omission for the run, quoting the link in it.
    expect(omissionCounts.limit).toBe(1);
    expect(omissions[0]?.source).toContain('[x](https://ok.example/)');
  });

  it('draws nothing for an empty code block, and takes a photo’s caption when its alt is not text', () => {
    expect(view('```\n```\n\nafter').querySelectorAll('p')).toHaveLength(1);
    const container = view('![Nest at dawn](photo:p1)', {
      resolveImage: () => ({ src: 'p1.jpg', alt: 42 as never }),
    });
    expect(container.querySelector('img')?.getAttribute('alt')).toBe(
      'Nest at dawn',
    );
  });

  it('lists the first 100 omissions and counts them all', () => {
    const source = '<b>x</b> '.repeat(150);
    const { omissions, omissionCounts } = inspectMarkdown(source);
    expect(omissions).toHaveLength(100);
    expect(omissionCounts.html).toBe(300);
  });
});

describe('MarkdownView crafted text', () => {
  const pageOf = (block: string) => {
    let page = '';
    while (page.length < 50000) page += block;
    return page.slice(0, 50000);
  };

  it.each([
    ['nested list markers on one line', '- '.repeat(25000)],
    ['lists in quotes on one line', '- > '.repeat(12500)],
    ['a list item holding a quote, per line', pageOf('- > a\n')],
    ['nested list items, per line', pageOf('- - a\n')],
    ['quotes in numbered items', pageOf('1. > a\n')],
    ['separate quotes', pageOf('> x\n\n')],
    ['separate nested quotes', pageOf('>> x\n\n')],
    ['lists between paragraphs', pageOf('- a\n\nb\n')],
    ['lists between headings', pageOf('- a\n# b\n')],
    ['setext headings', pageOf('a\n---\n')],
    ['setext headings apart', pageOf('a\n===\n\n')],
    ['an asterisk run', '*'.repeat(50000)],
    ['a backslash run after marks', `${'*'.repeat(300)}${'\\'.repeat(49700)}`],
    ['open links', '[a]('.repeat(12500)],
    ['bracket runs', '[a]'.repeat(16666)],
    ['quote markers', '>'.repeat(50000)],
    ['a quote with lazy lines', `> a\n${'b\n'.repeat(24998)}`],
    ['nested lists in quotes', pageOf('> - - a\n')],
    ['setext headings in quotes', pageOf('> a\n> ---\n')],
    ['sub-lists by indentation', pageOf('- a\n  - b\n')],
    ['numbered sub-lists', pageOf('1. a\n   1. b\n')],
    ['three-deep lists', pageOf('- a\n  - b\n    - c\n')],
    ['emphasis runs', pageOf('*a ')],
    ['nested emphasis', `${'*a '.repeat(8333)}${' a*'.repeat(8333)}`],
    ['nested strong', `${'**a '.repeat(6250)}${' a**'.repeat(6250)}`],
    ['nested underscores', `${'_a '.repeat(8333)}${' a_'.repeat(8333)}`],
    [
      'nested emphasis in a quote',
      `> ${'*a '.repeat(8333)}${' a*'.repeat(8333)}`,
    ],
    [
      'nested emphasis in a heading',
      `# ${'*a '.repeat(8333)}${' a*'.repeat(8333)}`,
    ],
    [
      'nested emphasis in link text',
      `[${'*a '.repeat(8333)}${' a*'.repeat(8333)}](https://a.b)`,
    ],
    ['image openers', '!['.repeat(25000)],
    ['link openers', '['.repeat(50000)],
    ['wide tables', `|${'a|'.repeat(12500)}\n|${'-|'.repeat(12499)}`],
    ['quotes and rules', pageOf('> a\n***\n')],
    ['nested quotes with lazy lines', pageOf('> a\nb\n> > c\nd\n')],
    ['a list item with lazy lines', `- a\n${'b\n'.repeat(24998)}`],
    ['quotes and lists', pageOf('> a\n- b\n')],
    [
      'a realistic page',
      pageOf(
        '## Step\n\nCount the **nests** from *left* to right, see [guide](https://example.org).\n\n- one\n  - two\n\n> note\n\n',
      ),
    ],
  ])('reads 50,000 characters of %s in time', (_, source) => {
    // The bound follows how busy the machine is now: a plain 50,000-character
    // page (about 10 ms idle) read just before sets it. Measured idle on the
    // development Mac: every crafted page under about 0.1 s.
    const plain = performance.now();
    inspectMarkdown(pageOf('Herons wait in still water. '));
    const bound = Math.max(2000, 200 * (performance.now() - plain));
    const start = performance.now();
    inspectMarkdown(source);
    expect(performance.now() - start).toBeLessThan(bound);
  });

  it('keeps references, loose lists and code whole in a long page', () => {
    const filler = 'Herons wait in still water. '.repeat(80);
    const source = [
      'See [the guide][g].',
      filler,
      '- loose one',
      '',
      '- loose two',
      '',
      '```',
      filler,
      '',
      '# not a heading',
      '```',
      '',
      filler,
      '',
      '# Later',
      '',
      'And [again][g].',
      '',
      '[g]: https://example.org/guide',
    ].join('\n');
    const container = view(source);
    expect(
      Array.from(container.querySelectorAll('a')).map((link) =>
        link.getAttribute('href'),
      ),
    ).toEqual(['https://example.org/guide', 'https://example.org/guide']);
    expect(container.querySelectorAll('ul')).toHaveLength(1);
    expect(container.querySelectorAll('ul > li > p')).toHaveLength(2);
    expect(container.textContent).toContain('# not a heading');
    expect(container.querySelectorAll('h2')).toHaveLength(1);
  });

  it('keeps a long lazy paragraph one paragraph in its quote or list item', () => {
    const quote = view(`> a\n${'b\n'.repeat(200)}`);
    expect(quote.querySelectorAll('blockquote')).toHaveLength(1);
    expect(quote.querySelectorAll('blockquote > p')).toHaveLength(1);
    expect(quote.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      `a ${Array.from({ length: 200 }, () => 'b').join(' ')}`,
    );
    const nested = view(`> > a\n${'> b\n'.repeat(150)}`);
    expect(nested.querySelectorAll('blockquote blockquote > p')).toHaveLength(
      1,
    );
    const item = view(`- a\n${'b\n'.repeat(150)}`);
    expect(item.querySelectorAll('li')).toHaveLength(1);
    expect(item.querySelector('li')?.textContent?.split(/\s+/).length).toBe(
      151,
    );
  });

  it('reads link definitions as CommonMark does', () => {
    // A paragraph's next line is not a definition, so no link is made.
    const continued = view('Intro\n[ref]: https://e.org/r\n\nSee [ref] here.');
    expect(continued.querySelector('a')).toBeNull();
    // A definition in a list item holds for the whole page.
    const listed = view(
      `- [ref]: https://e.org/r\n\n${'Owls. '.repeat(400)}\n\nSee [ref].`,
    );
    expect(listed.querySelector('a')?.getAttribute('href')).toBe(
      'https://e.org/r',
    );
    // A definition's indented title line is part of it, drawn once at most.
    const titled = view('[v]: https://v.org\n  "Title"\n\nSee [v].');
    expect(titled.querySelectorAll('p')).toHaveLength(1);
  });

  it('never changes code, in quotes and lists too', () => {
    const quoted = view(`> \`\`\`\n> ${'*'.repeat(300)}\n> > x\n> \`\`\``);
    expect(quoted.textContent).toBe(`${'*'.repeat(300)}> x`);
    const listed = view(`- \`\`\`\n  ${'_'.repeat(300)}\n  \`\`\``);
    expect(listed.textContent).toBe('_'.repeat(300));
  });

  it('leaves a table out whole past the drawn depth in quotes', () => {
    const quotes = '> '.repeat(20);
    const source = `${quotes}| a | b |\n${quotes}| - | - |\n${quotes}| secretcell | x |`;
    expect(view(source).textContent).not.toContain('secretcell');
    expect(inspectMarkdown(source).omissionCounts.table).toBe(1);
  });

  it('keeps an HTML comment out whole, blank lines and all', () => {
    const filler = 'Owls hunt at dusk. '.repeat(120);
    const source = `${filler}\n\n<!--\n\nsecret\n\n# hidden\n\n-->\n\nAfter`;
    const container = view(source);
    expect(container.textContent).not.toContain('secret');
    expect(container.querySelector('h2')).toBeNull();
    expect(container.textContent).toContain('After');
  });

  it('reports an omission late in a long page by its own words', () => {
    const source = `${'Frogs sing at night. '.repeat(120)}\n\n# Later\n\n<b>bold</b>`;
    expect(inspectMarkdown(source).omissions).toEqual([
      { kind: 'html', source: '<b>' },
      { kind: 'html', source: '</b>' },
    ]);
  });

  it('leaves a table out whole at any depth', () => {
    const deep = Array.from(
      { length: 19 },
      (_, depth) => `${'  '.repeat(depth)}- level ${depth}`,
    ).join('\n');
    const source = `${deep}\n${'  '.repeat(19)}| a | b |\n${'  '.repeat(19)}| - | - |\n${'  '.repeat(19)}| secretcell | x |`;
    const container = view(source);
    expect(container.textContent).not.toContain('secretcell');
    expect(inspectMarkdown(source).omissionCounts.table).toBe(1);
  });

  it('never changes code, reads CRLF blocks one by one, and takes an empty prefix', () => {
    const fenced = `\`\`\`\n${'> '.repeat(20)}x\n${'*'.repeat(300)}\n\`\`\``;
    expect(view(fenced).textContent).toBe(
      `${'> '.repeat(20)}x${'*'.repeat(300)}`.replace(/ x/, ' x'),
    );
    const crlf = `${'*a* '.repeat(100)}\r\n\r\n${'*a* '.repeat(100)}`;
    expect(view(crlf).querySelectorAll('em')).toHaveLength(200);
    expect(inspectMarkdown('# A', { idPrefix: '' }).headings[0]?.id).toBe('a');
  });
});

describe('MarkdownView refusals and styles', () => {
  it('refuses a bad id prefix and a blank or missing new-tab label', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(<MarkdownView {...({ source: 'x' } as never)} />),
    ).toThrow('MarkdownView newTabLabel must be non-empty text');
    expect(() => view('x', { idPrefix: '1-' })).toThrow(
      'MarkdownView idPrefix must be empty or start with a letter',
    );
    expect(() => view('x', { newTabLabel: ' ' })).toThrow(
      'MarkdownView newTabLabel must be non-empty text',
    );
    expect(() => view(42 as never)).toThrow('MarkdownView source must be text');
  });

  it('refuses in inspectMarkdown what the view refuses, the same way', () => {
    expect(() => inspectMarkdown('# a', { idPrefix: '"><x' })).toThrow(
      'inspectMarkdown idPrefix must be empty or start with a letter',
    );
    expect(() => inspectMarkdown(42 as never)).toThrow(RangeError);
    expect(() => inspectMarkdown('x', { idPrefix: null as never })).toThrow(
      RangeError,
    );
    expect(() => inspectMarkdown(undefined as never)).toThrow(
      'inspectMarkdown source must be text',
    );
    expect(() =>
      inspectMarkdown('x', { resolveImage: 'photos' as never }),
    ).toThrow('inspectMarkdown resolveImage must be a function');
  });

  it('draws nothing for an empty source', () => {
    expect(view('').querySelector('.sw-markdown')?.childElementCount).toBe(0);
    expect(inspectMarkdown('')).toEqual({
      headings: [],
      omissions: [],
      omissionCounts: {
        html: 0,
        table: 0,
        image: 0,
        link: 0,
        code: 0,
        limit: 0,
      },
    });
  });

  it('generates its type, quote box and underlined links from tokens', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-markdown-quote {\n  background: var(--sw-color-accentSubtle);',
    );
    expect(css).toContain('text-decoration-line: underline;');
    expect(css).toContain(
      'text-decoration-thickness: var(--sw-focus-ring-width);',
    );
    expect(css).toContain(
      '[data-theme] .sw-markdown-quote :is(.sw-markdown-link, .sw-markdown-caption) {\n  color: var(--sw-color-text);',
    );
    const own = css.slice(
      css.indexOf('.sw-markdown {'),
      css.indexOf('.sw-markdown-caption {'),
    );
    // Lengths come from tokens: no pixel, em or rem literal of its own.
    expect(own.replace(/\$\{[^}]*\}/g, '')).not.toMatch(
      /:\s*[\d.]+(em|rem)\b|thickness: \d/,
    );
    expect(css).not.toMatch(/sw-markdown[^}]*#[0-9a-f]{3,6}\b/i);
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-markdown',
        'sw-markdown-quote',
        'sw-markdown-link',
      ]),
    );
  });

  it('keeps links, quote words and captions at 4.5:1, but for the named palette gap', () => {
    const below: string[] = [];
    forEveryTheme((colors, label) => {
      for (const [words, ground, what] of [
        ['accent', 'surface', 'link on the surface'],
        ['accent', 'background', 'link on the background'],
        // A link in a quote is the text colour, as its words are.
        ['text', 'accentSubtle', 'words, links and captions in a quote'],
        ['muted', 'surface', 'caption on the surface'],
        ['muted', 'background', 'caption on the background'],
      ] as const)
        if (contrastRatio(colors[words], colors[ground]) < 4.5)
          below.push(`${label} ${what}`);
    });
    // Harvest's dark accent is 4.24:1 on its own surface, a palette
    // property the tokens tests record (as the table's selected row and
    // ledger tests do); any new entry is a regression.
    expect(below).toEqual(['harvest dark link on the surface']);
  });
});
