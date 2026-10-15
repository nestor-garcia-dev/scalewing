import { groupedCanvasFill } from './css-canvas-grouped.js';

export const dialogCanvasClass = 'sw-dialog-canvas-grouped';

/*
 * A dialog on the grouped canvas: its fill is the grouped canvas grey, solid
 * with no blur, so Cards inside it stand apart as they do on a grouped page.
 * The selector carries two classes so it wins over the glass and banded
 * fills at any order. A banded title row and the pinned footer keep their
 * own surface, so they stay bands over the grey. Forced colours paint the
 * system canvas as they do any dialog.
 */
export function cssDialogCanvasClasses(): string {
  return `.sw-dialog.${dialogCanvasClass} {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  background: ${groupedCanvasFill};
}`;
}

export function dialogCanvasClassCatalog(): string[] {
  return [dialogCanvasClass];
}
