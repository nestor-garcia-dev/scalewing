# Delivery workflow

Repository documents are durable memory. Chat is not.

## Document hierarchy

- `docs/ARCHITECTURE.md`: package boundaries and CSS ownership.
- `docs/adr/`: accepted decisions.
- `docs/ROADMAP.md`: current focus and next action.
- Accepted implementation plan: one story.
- Code and tests: executable result.

## Starting work

When asked “What’s next?”:

1. Read `docs/ROADMAP.md` and this workflow.
2. Identify the highest-priority unfinished item whose dependencies are met.
3. Confirm it with the user.
4. Plan one lane: `tokens`, `react`, or `react-native`.
5. Do not implement a catalog dump because it appears on the roadmap.

## Story rules

- One public surface at a time: a token family, a utility family, or one component on one renderer.
- Shared token work may land before both renderers when both will consume it.
- Do not combine a new React component and a new React Native component in the same implementation unless they are the same already-planned primitive and the plan says so.
- Stop and discuss new public class names, new spacing steps, or new components.

## Finishing

Apply `docs/DEFINITION_OF_DONE.md`. Update the roadmap with the exact next action.
