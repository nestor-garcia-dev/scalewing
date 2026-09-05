Scalewing request from fantasy-football.

Renderer: react
Missing surface: Dialog (modal) component
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this:
Card and Stack stay in document flow. An info surface opened from a nested
column (How we grade on Draft) must leave that column, sit on the top layer,
dim the page, trap focus, and close on Escape. Layout primitives cannot do
that without a second overlay kit or invented positioning CSS.
Existing surface this might already be: none. Card is an in-flow surface.
AppHeader sticky z-index is chrome, not a modal.
Workaround I almost used: inline Card in the grade column (pushes Team
context down); Canvas used a fixed hex overlay.
Proposed API:
<Dialog open={open} onClose={close} title="How we grade">{children}</Dialog>
Native <dialog>.showModal(). Web only for this story.
