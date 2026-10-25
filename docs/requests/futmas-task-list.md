Scalewing request from FutMas.

Status: implemented for `@scalewing/react` 1.51.0 (accepted 2026-10-24; FutMas F-010-S12 "seasons, competitions and league settings": the draft season Overview's checklist, board C1DraftOverview, and the published season's, D5bPublished; reused by S15's publish review; the owner approved the F-010 canvas v15 and the whole feature on 2026-10-24, with standing approval for Scalewing changes, PRs, merges and publishing).
Renderer: react
Missing surface: `TaskList`, a setup checklist: tasks in order, each with a status marker, a title, a muted detail and an action at the row's end, and the status said to assistive technology.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: FutMas owns no CSS for the markers (a check on the success fill, an accent ring round a dot, an empty ring, a lock), the row's wrap on a phone, or the hidden status words.
Existing surface this might already be: `Steps` (a form stepper: numbered markers, folded summaries with Edit, fields inside the current step, no per-row action or waiting state); `ListGroup` + `ListRow` (`leading` and `action`, but a stated row's `leading` is hidden and `aria-label` names only pressable rows, so the status words would have to be drawn).
Workaround I almost used: `ListGroup` + `ListRow` with a Lucide glyph in `leading` and the status words at the start of `detail` ("Done · Spring 2027 · Sundays").
FutMas use: "Get Spring 2027 ready" under a `Progress`: Season, Divisions, Teams, Venues, Rules, Schedule, Publish, Make it the current season, each with Change, Review, Open or the next step's primary action; waiting rows ("Needs the schedule") have no action.

## Proposed API (S12 plan, "Scalewing gap list" row 1)

```ts
type TaskListProps = {
  label: string;
  items: {
    id: string;
    title: string;
    detail?: string;
    status: 'done' | 'next' | 'todo' | 'waiting';
    action?: ReactNode;
  }[];
  labels?: Partial<Record<'done' | 'next' | 'todo' | 'waiting', string>>;
};
```

## Accepted API (2026-10-24)

The plan's API, plus `action` may be a function given `{ titleId }` (`TaskListActionContext`), and the other `ol` attributes pass through. Exports: `TaskList`, `TaskListProps`, `TaskListItem`, `TaskListActionContext`, `TaskListLabels`, `TaskListStatus`, `taskListStatuses`, `defaultTaskListLabels`.

- An `ol` named by `label` (`aria-label`); one `li` per item in order, a hairline between rows, rows spaced step 2 above and below, parts a step 3 apart.
- Marker: 24 px (spacing step 5), `aria-hidden`, private chrome drawn with borders and an inset ring so forced colours keep it and each status has its own shape. `done`: the success fill with a check in the surface colour (Steps' check). `next`: a 2 px accent ring round an 8 px accent dot. `todo`: a 2 px hairline ring (`--sw-color-border`, Steps' step ahead). `waiting`: a lock in the muted colour, no ring (FutMas's semantic colour: amber means "needs you", and a waiting task waits on something else).
- Title: label type (15/600); a waiting task's title muted at the body weight (400). Detail: muted caption (13). Both break long words.
- Action: at the row's end, on the row's middle; the words keep at least half the row, so a wide action wraps to its own line at the row's end on a phone.
- Spoken: the drawn title is `aria-hidden` and one visually hidden line holds "Title, Status word" (Steps' lesson: a hidden box is laid out as a block, so separate boxes put a space before the comma). Then the detail, then the action. English words by default: Done, Next step, To do, Waiting.
- `action` as a function receives the drawn title's id, for `aria-describedby`, so the board's several Change buttons are told apart.
- No `aria-current` and no order rules: the consumer sets each status, and which action is primary.
- Failure boundary: a blank label, status word, id, title or detail, a repeated id, or an unknown status throws a `RangeError`.

### Deviations from the canvas

- The board's faint accent tint behind the next row (bleeding into the card's padding) is not drawn: Scalewing cannot know the card's padding, and the ring and the page's one primary action already mark it.
- The board's 500 weight for a waiting title is the body weight, 400 (no 500 in the type tokens).
- The board's hairline above the first row is not drawn; hairlines go between rows. Space the list from a `Progress` above it with the card's gap.

### Classes

`sw-task-list`, `sw-task-list-item`, `sw-task-list-item-done`, `sw-task-list-item-next`, `sw-task-list-item-todo`, `sw-task-list-item-waiting`, `sw-task-list-marker`, `sw-task-list-body`, `sw-task-list-title`, `sw-task-list-detail`, `sw-task-list-action`.

Evidence: `task-list.test.tsx` (the list and its name, rows and classes in order, the spoken line per status, consumer words, detail and action only when given, the title id handed to a function action, attributes passed through, failures, the generated rules); gallery "TaskList" (a heron survey checklist under its progress: done, next, todo and two waiting tasks); `apps/gallery/e2e/task-list.spec.ts` on desktop-en, mobile-es and forced-colors (spoken lines, Chromium's description of Change, 24 px markers, 44 px Buttons on touch, no page overflow, the next action advancing the list).
