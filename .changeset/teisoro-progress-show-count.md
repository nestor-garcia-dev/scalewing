---
'@scalewing/react': minor
---

`Progress` takes `showCount` (default `true`). `showCount={false}` hides the
visible `value / max` count beside the label when the page shows its own count
caption, so the count appears once (see the 2026-09-28 follow-up in
`docs/requests/teisoro-progress.md`). The progress bar still exposes its value
and maximum to assistive tech.

```tsx
<Progress label="Registers closed" max={2} showCount={false} value={0} />
```

Additive; the count shows as before when the prop is left out.
