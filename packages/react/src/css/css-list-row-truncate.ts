/*
 * A truncated row keeps its title and its detail to one line each, cut
 * with "…" where they do not fit. The title's words sit in their own box
 * (`sw-list-row-title-text`) beside the unread dot, so the cut never hides
 * the dot; the title is a one-line flex row centring them. The label
 * column already shrinks (`min-width: 0`), so the value, the tag and the
 * action keep their place and their words whole.
 */
export function cssListRowTruncateClasses(): string {
  return `.sw-list-row-truncate .sw-list-row-title {
  align-items: center;
  display: flex;
  min-width: 0;
}

.sw-list-row-truncate .sw-list-row-unread { flex: none; }

.sw-list-row-truncate .sw-list-row-title-text,
.sw-list-row-truncate .sw-list-row-detail {
  min-width: 0;
  overflow: hidden;
  overflow-wrap: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}`;
}

export function listRowTruncateClassCatalog(): string[] {
  return ['sw-list-row-truncate', 'sw-list-row-title-text'];
}
