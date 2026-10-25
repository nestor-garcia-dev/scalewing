Scalewing request from FutMas.

Status: accepted for `@scalewing/react` 1.55.0 (2026-10-25; FutMas F-010-S15 "Build, review and publish the schedule" gap 2: the review grid, games by time and field, drag to move and drop to swap; standing owner approval).
Renderer: react
Missing surface: a schedule grid, items moved between cells by drag, keys or presses. A new component, `ScheduleGrid`.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: `Table` is a static table with no cell focus model, pointer drag, drop targets, blocked cells or announcements, and WCAG 2.5.7 needs a non-drag path built in; a product-side grid would hand-write focus, drag and CSS.
Existing surface this might already be: none (`Table`, `Grid` and `ListGroup` hold no moves).
Workaround I almost used: `schedule/GridFallback.tsx`, a `Table` of times by fields whose game cells are small neutral Buttons opening the Move dialog, with no drag.

## Accepted API (2026-10-25)

`ScheduleGrid { label; columns; rows; rowsLabel?; items: { id, columnId, rowId, label, content }[]; disabledCells?: { columnId, rowId, reason }[]; canDrop?(itemId, target) => true | { reason }; onMove(itemId, { columnId, rowId }); onSwap(itemId, otherItemId); disabled?; labels?: Partial<ScheduleGridLabels> }`, with `defaultScheduleGridLabels` (English).

- `target` is `{ kind: 'move', columnId, rowId }` or `{ kind: 'swap', itemId, columnId, rowId }`; the grid holds no rules and moves nothing itself.
- A `role="grid"` table with one roving Tab stop: arrows, Home/End, Control+Home/End. M or Space picks up; arrows choose; Enter or Space drops; Escape cancels and refocuses the item.
- Mouse or pen drag past 4 px with one hover target; touch never drags: tap an item, tap a cell (its own cell or a press outside cancels).
- While carrying: the source says "Moving from here", the target "Release to move here" / "Release to swap", blocked cells show their reason in amber; disabled cells are never targets and show their reason.
- Every step is announced in a polite status; cells are named by contents plus their carry state.
- Invalid props throw a `RangeError`.

Evidence: `schedule-grid.test.tsx`, `schedule-grid-model.test.ts`, `schedule-grid-css.test.ts`; `apps/gallery/e2e/schedule-grid.spec.ts` (keys, blocked and Escape, mouse drag swap, touch taps, axe idle and carrying, desktop, phone, forced colors); gallery section "ScheduleGrid".
