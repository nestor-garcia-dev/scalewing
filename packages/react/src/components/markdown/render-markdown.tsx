import { type ReactNode } from 'react';

import { Separator } from '../Separator.js';
import { type MarkdownBlock, type MarkdownInline } from './markdown-model.js';

/** What every drawn link carries besides its own words. */
export type LinkOptions = { newTabLabel: string };

const headingElements = { 1: 'h2', 2: 'h3', 3: 'h4' } as const;

/** Draws a run of text as React elements: never HTML from a string. */
export function renderInlines(
  inlines: readonly MarkdownInline[],
  links: LinkOptions,
): ReactNode[] {
  return inlines.map((inline, index) => {
    switch (inline.kind) {
      case 'text':
        return inline.value;
      case 'break':
        return <br key={index} />;
      case 'strong':
        return (
          <strong key={index}>{renderInlines(inline.children, links)}</strong>
        );
      case 'emphasis':
        return <em key={index}>{renderInlines(inline.children, links)}</em>;
      case 'link':
        return (
          <a
            className="sw-markdown-link"
            href={inline.href}
            key={index}
            rel="noopener noreferrer"
            // Safari leaves a link out of the Tab order without one.
            tabIndex={0}
            target="_blank"
          >
            {renderInlines(inline.children, links)}
            <span className="sw-sr-only"> {links.newTabLabel}</span>
          </a>
        );
    }
  });
}

/** Draws a list item: a tight list's paragraphs are its words alone. */
function renderItem(
  blocks: readonly MarkdownBlock[],
  tight: boolean,
  links: LinkOptions,
): ReactNode {
  if (!tight) return renderBlocks(blocks, links);
  return blocks.map((block, index) =>
    block.kind === 'paragraph' ? (
      <span className="sw-markdown-item-text" key={index}>
        {renderInlines(block.children, links)}
      </span>
    ) : (
      renderBlock(block, index, links)
    ),
  );
}

function renderBlock(
  block: MarkdownBlock,
  key: number,
  links: LinkOptions,
): ReactNode {
  switch (block.kind) {
    case 'paragraph':
      return (
        <p className="sw-markdown-paragraph" key={key}>
          {renderInlines(block.children, links)}
        </p>
      );
    case 'heading': {
      const Heading = headingElements[block.level];
      return (
        <Heading
          className={`sw-markdown-heading sw-markdown-heading-${block.level}`}
          id={block.id}
          key={key}
        >
          {renderInlines(block.children, links)}
        </Heading>
      );
    }
    case 'list': {
      const items = block.items.map((item, index) => (
        <li key={index}>{renderItem(item, block.tight, links)}</li>
      ));
      return block.ordered ? (
        <ol
          className="sw-markdown-list"
          key={key}
          start={
            block.start === null || block.start === 1 ? undefined : block.start
          }
        >
          {items}
        </ol>
      ) : (
        <ul className="sw-markdown-list" key={key}>
          {items}
        </ul>
      );
    }
    case 'quote':
      return (
        <blockquote className="sw-markdown-quote" key={key}>
          {renderBlocks(block.children, links)}
        </blockquote>
      );
    case 'figure':
      return (
        <figure className="sw-markdown-figure" key={key}>
          <img alt={block.alt} className="sw-markdown-image" src={block.src} />
          {block.caption ? (
            <figcaption className="sw-markdown-caption">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case 'rule':
      return <Separator key={key} />;
  }
}

/** Draws blocks in order. */
export function renderBlocks(
  blocks: readonly MarkdownBlock[],
  links: LinkOptions,
): ReactNode[] {
  return blocks.map((block, index) => renderBlock(block, index, links));
}
