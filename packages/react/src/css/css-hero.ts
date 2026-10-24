import { breakpointQuery } from './breakpoints.js';

/*
 * A public page's opening: the words in one column (an eyebrow, the hero
 * title, the lead and the actions) and an optional picture beside them.
 * From `md` the picture keeps its own width at the row's end and the words
 * take the rest; below `md` the picture sits centred under the words and
 * the actions stack to the full width, as a phone's thumb expects. With no
 * picture the words keep the reading width, so a long title or lead does
 * not run the page's full width. The actions sit one spacing step further
 * from the lead than the text's gap, so the buttons read as their own row.
 */
export function cssHeroClasses(): string {
  return `.sw-hero {
  align-items: center;
  display: grid;
  gap: var(--sw-space-8);
  min-width: 0;
}

.sw-hero-text {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-4);
  min-width: 0;
}

.sw-hero:not(.sw-hero-with-media) .sw-hero-text {
  max-width: var(--sw-reading-max);
}

.sw-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-3);
  padding-top: var(--sw-space-1);
}

.sw-hero-media {
  justify-self: center;
  max-width: 100%;
  min-width: 0;
}

@media ${breakpointQuery('from', 'md')} {
  .sw-hero-text { gap: var(--sw-space-5); }
  .sw-hero-with-media { grid-template-columns: minmax(0, 1fr) auto; }
}

@media ${breakpointQuery('below', 'md')} {
  .sw-hero { gap: var(--sw-space-6); }
  .sw-hero-actions { align-items: stretch; flex-direction: column; }
}`;
}

export function heroClassCatalog(): string[] {
  return [
    'sw-hero',
    'sw-hero-with-media',
    'sw-hero-text',
    'sw-hero-actions',
    'sw-hero-media',
  ];
}
