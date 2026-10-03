---
'@scalewing/react': minor
---

`ActionBar` `status` takes a node (`docs/requests/fantasy-football-action-bar-status.md`, the fantasy-football companion's trade verdict): `status?: ReactNode`, widened from `string`, so a `Badge` and a short line can share the status. The status element is now a `div` (was a `p`) that keeps `className="sw-action-bar-status"` and `role="status"`, is still rendered while empty, and still takes no room when empty. It lays its children on one wrapping row a `space-2` gap apart (`space-1` between wrapped rows), so a line that does not fit beside its badge wraps under it at phone width. A string status renders as before; a phrase that mixes text and elements belongs in one `span`. Consumers whose tests looked for a `P` status element need to update that query. No new classes, tokens or dependencies.
