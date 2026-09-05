Scalewing request from fantasy-football.

Status: implemented in this checkout (gallery + changeset; not yet published).

Renderer: react
Missing surface: Accordion (disclosure) component
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Card is always open in document flow. Draft needs Why this grade to sit
under a round, stay in flow, and expand/collapse from a title without a
modal, a second overlay kit, or app CSS on details/summary. Button can
toggle state, but the heading-as-disclosure pattern is a native control
(details/summary) with its own open state, marker, and keyboard behavior.
Existing surface this might already be: none. Card is in-flow and always
expanded. Dialog leaves the page on the top layer. Field labels a control;
it does not disclose a panel.
Workaround I almost used: mount a Card when a player is selected and a Hide
Button to unmount it; raw details/summary with invented CSS.
Proposed API:
<Accordion open={open} onOpenChange={setOpen} title="Why this grade">
{children}
</Accordion>
Native <details>/<summary>. Optional name for exclusive groups. Web only.
