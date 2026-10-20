Scalewing request from Teisoro.

Status: released in `@scalewing/react` 1.44.0 (PR #215; accepted 2026-10-20; Teisoro F-014-S07 "Scalewing fidelity", task 2630; the gap Teisoro F-014-S05 task 2620 found on the training board TrainingWrite; plan approval under the owner's F-014 delegation of 2026-10-19).
Renderer: react
Missing surface: a `FileField` that shows a chosen photo as a thumbnail.
Why Box/Stack/Inline/Card/Text/Button/Field cannot do this: the page editor's cover photo, once chosen, is drawn as a small 48 × 32 picture of the photo beside its file name, so the writer sees which photo will head the page. `FileField` shows a chosen file's name, detail and an optional `icon` mark; an `<img>` passed as `icon` would be wrapped as a hidden mark at the icon's size, with no crop or radius, and Teisoro owns no CSS to size it.
Existing surface this might already be: `FileField` `icon`; `Article`'s `cover` (the whole page's cover, not a field).
Workaround I almost used: the name and size alone, which S05 shipped with the difference recorded.
Teisoro use: `training/PageEditor`'s cover photo field.
Proposed API: an optional `preview` (an image address) on `FileFieldValue`.

## Accepted API (2026-10-20)

- `FileFieldValue.preview?: string`: the address of a small image of the chosen file, such as an object URL the consumer makes from the `File` and revokes; the field never reads the file itself.
- Drawn as `img.sw-file-field-preview` with `alt=""` before the name, in place of `icon`: a 3:2 thumbnail a space-8 wide and a space-6 tall, `object-fit: cover`, the small radius, on the subtle fill while it loads. It is decorative: the button is still described by the name and detail.
- A blank `preview` throws a `RangeError`. No new tokens, layers or dependencies. New class `sw-file-field-preview`.

### Differences from the boards (Teisoro D-29)

- The board's thumbnail sits in a 44 px frame row; Scalewing's chosen file keeps its own frame and its Choose another button.

Evidence: `file-field-preview.test.tsx` (the thumbnail's address, its empty alt and no image role, the mark replaced, the description unchanged, the mark kept without a preview, the refusal of a blank address, the generated rule and the catalog); gallery "FileField" (Cover photo: a chosen PNG drawn as a thumbnail from an object URL the example revokes); `apps/gallery/e2e/file-field.spec.ts` on desktop-en, mobile-es and forced-colors (the description, an empty alt and a `blob:` address, the loaded image at 48 × 32, cropped, before the name, no image role), with the field's other tests and `tab-order.spec.ts` passing.
