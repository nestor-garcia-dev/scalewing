# Delivery workflow

Repository documents are durable memory. Chat is not.

## Document hierarchy

- `docs/ARCHITECTURE.md`: package boundaries and CSS ownership.
- `docs/adr/`: accepted decisions.
- `docs/ROADMAP.md`: current focus and next action.
- `docs/CONSUMER_REQUESTS.md`: how products consume a published version and how to file a request.
- `docs/requests/`: filled consumer requests. One reusable surface per kebab-case file (`<consumer>-<surface>.md`).
- Accepted implementation plan: one story.
- Code and tests: executable result.

## Starting work

When asked “What’s next?”:

1. Read `docs/ROADMAP.md`, `docs/CONSUMER_REQUESTS.md`, `docs/requests/`, and this workflow.
2. Prefer a filled file in `docs/requests/` over speculation. Do not scrape product UIs to guess a catalog. Do not wait for a chat paste.
3. Identify the highest-priority unfinished item whose dependencies are met.
4. Confirm it with the user.
5. Plan one lane: `tokens`, `react`, or `react-native`.
6. Do not implement a catalog dump because it appears on the roadmap.

One consumer is enough to request and ship a new public component. Before adding one, check whether an existing surface already covers the use case. Do not add a parallel control for another app.

## Story rules

- One public surface at a time: a token family, a utility family, or one component on one renderer.
- Shared token work may land before both renderers when both will consume it.
- Do not combine a new React component and a new React Native component in the same implementation unless they are the same already-planned primitive and the plan says so.
- Public names and props are reusable (`Accordion`, `title`, `open`). Do not encode the requesting product in the API (`WhyThisGrade`, `playerId`).
- Stop and discuss new public class names, new spacing steps, or new components.

## Finishing

Apply `docs/DEFINITION_OF_DONE.md`. A new public web component, prop, or meaningful state gets a gallery catalog section in the same change. Update the roadmap with the exact next action.
