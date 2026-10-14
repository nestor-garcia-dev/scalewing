/** Night counts at the heron colony, newest first, for the bounded list. */
export const colonyNights = [
  {
    night: 'Tue, Oct 6 · North marsh',
    detail: 'Counted 142 · expected 140 · Field team A',
    change: '+2',
    tone: 'success',
  },
  {
    night: 'Tue, Oct 6 · South reeds',
    detail: 'Counted 88 · expected 88 · Field team B',
    change: '0',
    tone: 'muted',
  },
  {
    night: 'Wed, Oct 7 · North marsh',
    detail: 'Counted 135 · expected 141 · Field team A',
    change: '−6',
    tone: 'danger',
  },
  {
    night: 'Wed, Oct 7 · South reeds',
    detail: 'Counted 90 · expected 91 · Field team C',
    change: '−1',
    tone: 'danger',
  },
  {
    night: 'Thu, Oct 8 · North marsh',
    detail: 'Counted 144 · expected 139 · Field team A · recounted',
    change: '+5',
    tone: 'success',
  },
  {
    night: 'Thu, Oct 8 · South reeds',
    detail: 'Counted 93 · expected 92 · Field team B',
    change: '+1',
    tone: 'success',
  },
  {
    night: 'Fri, Oct 9 · North marsh',
    detail: 'Counted 140 · expected 143 · Field team C',
    change: '−3',
    tone: 'danger',
  },
  {
    night: 'Fri, Oct 9 · South reeds',
    detail: 'Counted 95 · expected 93 · Field team B',
    change: '+2',
    tone: 'success',
  },
] as const;
