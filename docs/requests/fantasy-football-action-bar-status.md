Scalewing request from fantasy-football.

Status: implemented on branch `claude/trade-desk-surfaces` for the next `@scalewing/react` minor; pending review, release, and the companion's pin bump (it is on `@scalewing/react` 1.17.0).
Source: the fantasy-football companion redesign (`apps/companion`, ADR 0014 in that repository): the long trade builder ends in an `ActionBar` whose status shows the trade's verdict while the manager builds it, read mostly at 390 px.
Renderer: react
Missing surface: `ActionBar` `status` widened from `string` to `ReactNode`, rendered in a `div` that lays a `Badge` and a short line on one wrapping row.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the status slot is `ActionBar`'s own live region (`role="status"`, always rendered so the first status is announced). It took only a string, and it was a `<p>`, which cannot validly hold block content such as an `Inline` or a `Stack`. Putting the verdict outside the bar would lose the live region and the place by the actions.
Existing surface this might already be: `ActionBar` `status` (a string line); `Badge` (the verdict chip, which belongs in that line); `Toast` (transient, not a standing verdict).
Workaround I almost used: a string verdict ("Worth sending: You +2.7/wk, Jacob −0.7/wk, fair") with no Badge, or a Badge drawn above the bar in the page with a second live region.
fantasy-football use: the trade builder's bar shows a success `Badge` "Worth sending" and then the line "You +2.7/wk · Jacob −0.7/wk, fair" (other tones for other verdicts), with the send and review actions as its children.
Proposed API: `status?: ReactNode` on `ActionBar` (was `string`); every existing string status keeps working.

```tsx
<ActionBar
  status={
    <>
      <Badge tone="success">Ready to submit</Badge>
      <span>14 sightings · 3 habitats</span>
    </>
  }
  stickyBelow="md"
>
  <Button onPress={submit}>Submit sightings</Button>
</ActionBar>
```

Behavior and failure boundary: the status element is now `<div className="sw-action-bar-status" role="status">`, still rendered while empty and still the same node across updates, so each new status is announced politely. Nothing (`undefined`, `null`, `false`) leaves it empty, and the existing `:empty` rule keeps it in the accessibility tree while taking no room. `.sw-action-bar-status` is a wrapping flex row, centered, `column-gap: var(--sw-space-2)` and `row-gap: var(--sw-space-1)`, with the caption type and muted color it had: a Badge and its line sit on one line 8 px apart, and a line that does not fit beside the badge wraps under it as a whole and then wraps its own words, never past the bar. Below `md` the status keeps its full row above the actions. A plain string is one flex item and wraps as before. Because the direct children are the row's items, a phrase that mixes text and elements (`14 sightings · <strong>3</strong> habitats`) goes in one `span`, or its pieces become separate items a gap apart; the JSDoc and README say so (the same rule `Button` documents for its children). The consumer owns what it puts there: a status still should be short, and an interactive control does not belong in a live region.

Rejected alternatives:

- A `badge` prop beside a string `status`. It fixes one layout (badge first) and one component in the API; a node lets a product put the badge where its language needs it and adds no second prop.
- Keeping the `<p>` and documenting phrasing content only. A `Badge` is a `span` and would be valid, but an `Inline` or `Stack` the consumer reaches for would not, and React warns on a `div` inside a `p`.
- Inline flow with a margin on a direct-child badge. It couples `ActionBar` CSS to `Badge`'s class and gives no gap token between other children.

Scalewing owns the prop type, the element, the row layout, the tests, the gallery and the changeset. fantasy-football owns the verdict, its tone and its words.

Evidence: `packages/react/src/action-bar.test.tsx` (the status is a `DIV` with the same class and role; a string, then a Badge and a `span` holding a `strong`, then `undefined`, `null` and `false` all land in the same node, the empty ones with no child nodes; the generated rule is a wrapping, centered flex row with the space-2 column gap and space-1 row gap); `apps/gallery/e2e/action-bar.spec.ts` on desktop-en, mobile-es and forced-colors: after Submit the survey bar's status is a `DIV` holding the "Submitted" Badge and "11 stops · 14 sightings" centered on one line 8 px apart; the stickyBelow bar's "Saved" Badge and its longer line sit on one line on desktop and wrap under the badge at its start edge at 390 px, with no horizontal overflow; the existing sticky, live-region and popup checks still pass.
