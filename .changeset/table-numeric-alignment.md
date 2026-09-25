---
'@scalewing/react': patch
---

`TableCell numeric` and `TableCell align="end"` cells now line up at the end of
the cell again. The base `.sw-table th, .sw-table td { text-align: start }` rule
was more specific than `.sw-table-numeric` and `.sw-table-end`, so those cells
had been aligned to the start since the table styles were added. The alignment
rules are now `.sw-table .sw-table-numeric` and `.sw-table .sw-table-end`. No
prop changes.
