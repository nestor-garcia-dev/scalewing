---
'@scalewing/react': minor
---

`BarChart` `formatValue` and `diverging` (`docs/requests/teisoro-bar-chart.md`, Teisoro F-006-S11, RPT-14). `formatValue?: (value: number) => string` writes the axis's values and every item's value that has no `valueLabel`, such as a currency (default: the plain number it wrote before, so the axis's "0" is now `formatValue(0)`). `diverging?: boolean`, off by default, puts zero in the middle of each track behind a hairline: a positive value's bar grows toward the inline end and a negative value's toward the start, each up to half the track on the same scale, with a square end at zero, and the axis reads minus `max`, 0 and `max`. Without it every bar still grows from the start. New generated class `sw-bar-chart-diverging`. No new tokens and no new dependencies.
