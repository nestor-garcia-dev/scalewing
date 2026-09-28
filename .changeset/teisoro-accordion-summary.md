---
'@scalewing/react': minor
---

`Accordion` takes `subtitle`, one muted caption line under the title, and
`size="sm"` for a quieter disclosure nested inside other content (a
label-size title, spacing step 3, `md` corners, and a header that is an `sm`
control of at least 32px instead of 44px). The header now draws a
token chevron at its inline end in place of the browser's `details` triangle;
it turns when the disclosure opens and holds still under reduced motion. See
`docs/requests/teisoro-accordion-summary.md`.

```tsx
<Accordion
  open={open}
  onOpenChange={setOpen}
  subtitle="Twelve sightings · Two nests"
  title="Wetlands"
>
  {children}
</Accordion>
```

New generated classes `sw-accordion-sm`, `sw-accordion-heading` and
`sw-accordion-marker`, and a new exported type `AccordionSize`. The summary is
now a flex row instead of `display: list-item`, so the native marker is gone;
an app that styled `.sw-accordion-summary::marker` has nothing left to style.
Additive for the public API.
