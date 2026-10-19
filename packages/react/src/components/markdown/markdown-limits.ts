/** How many quotes and lists the view draws inside one another. */
export const maxNesting = 16;

/**
 * How deep the parser reads (a quote is one level, a list and its item
 * two). markdown-it stops reading a block that nests deeper (its words are
 * lost, and reported as `limit`). Its work on runs of link and image
 * openers grows with this cap, so it stays low: 128 keeps 60-deep lists
 * and reads 25,000 `![` in about 0.1 s.
 */
export const maxParseNesting = 128;

/** The longest excerpt an omission keeps. */
export const maxExcerpt = 80;

/** How many omissions the reading lists; the counts keep the rest. */
export const maxOmissionsListed = 100;
