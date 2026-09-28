Scalewing request from Teisoro.

Status: implemented on `claude/closeout-ux-surfaces`; pending review, merge and a `@scalewing/react` minor release. Do not version, tag or publish until the owner says so.
Renderer: react
Change to an existing surface: web `Accordion` takes `subtitle` (one muted line under the title) and `size="sm"` (a nested disclosure), and draws a token chevron in place of the browser's `details` marker. Generated classes `sw-accordion-sm`, `sw-accordion-heading`, `sw-accordion-marker`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Accordion` takes `title: string` only and renders it as one `title`-size line with `display: list-item`, so the browser's own triangle is the marker. A summary line, a different marker or a smaller header all need Scalewing's `summary` markup and CSS, which Teisoro does not own.
Existing surface this might already be: native `Accordion` already has `subtitle` (`futmas-accordion-subtitle.md`), a muted caption line under the title, and a chevron at the end of the header; this reuses the prop name and the placement on web. A `ReactNode` title was rejected there too: it would let consumers restyle the header.
Workaround I almost used: one long title joined with " · " (what ships today), or a second `Text` inside the panel repeating the totals.
Teisoro use: F-007-S03 task 1280, UX review finding UX-7 ("Section headers are long run-on lines with the browser's triangle", `docs/features/F-007-journey-suite-scale.in-progress/ux-reviews/closeouts-close-a-register.md`). The closeout form's section headers become `title="Cash count"` with `subtitle="Steps 1–3 · Counted $841.27 · Drop $141.00"`, and the "Show how expected is calculated" disclosure inside the review section becomes `size="sm"` so it stops looking like a section.
Proposed API: `subtitle?: string` and `size?: 'sm' | 'md'` (default `md`, type `AccordionSize`) on `AccordionProps`:

```tsx
<Accordion
  open={open}
  onOpenChange={setOpen}
  subtitle="Twelve sightings · Two nests"
  title="Wetlands"
>
  <Accordion
    open={methodOpen}
    onOpenChange={setMethodOpen}
    size="sm"
    title="How the count is taken"
  >
    …
  </Accordion>
</Accordion>
```

Behavior and failure boundary: presentation only; `open`/`onOpenChange` and the native `<details>` keyboard behavior are unchanged. The summary is a flex row: the title with the subtitle under it in the `caption` variant and `muted` color, then an `aria-hidden` chevron drawn from two muted hairline borders at the inline end. The chevron points to the inline end when closed (mirrored under `dir="rtl"`) and down when open, turning over `--sw-motion-default`; under `prefers-reduced-motion: reduce` it switches without a transition, and in forced colors it uses `CanvasText`. The subtitle wraps instead of truncating (it may carry amounts that must stay visible), and it is part of the summary's accessible name after the title. `size="sm"` uses the `label` title variant, spacing step 3 instead of 4 for the body and the header's inline padding, the `md` radius, and a header that is an `sm` control: spacing step 1 of block padding over the `sm` control minimum height (32px, the `Button` `sm` target) instead of the `md` 44px. Differences from native: native truncates its subtitle to one line and uses a `label` title at every size.

Scalewing owns the props, the generated classes, the tests, the gallery evidence (the Accordion section's "Range" subtitle and nested "How the range is measured" disclosure, checked in `apps/gallery/e2e/accordion.spec.ts`) and the changeset. Teisoro owns the title and subtitle copy (including the Over/Short wording of the variance) and adopts the release in task 1285.
