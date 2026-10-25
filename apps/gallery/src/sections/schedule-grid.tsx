import {
  ScheduleGrid,
  type ScheduleGridItem,
  type ScheduleGridSlot,
  type ScheduleGridTarget,
  Stack,
  Switch,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

const columns = [
  { id: 'otter', label: 'Otter Pool' },
  { id: 'heron', label: 'Heron Marsh' },
  { id: 'pine', label: 'Pine Ridge' },
];

const rows = [
  { id: '9', label: '9:00' },
  { id: '10', label: '10:30' },
  { id: '12', label: '12:00' },
];

type Talk = { id: string; label: string; detail: string } & ScheduleGridSlot;

const firstTalks: Talk[] = [
  {
    id: 'otters',
    label: 'Otter feeding',
    detail: 'Keeper talk · 20 min',
    columnId: 'otter',
    rowId: '10',
  },
  {
    id: 'herons',
    label: 'Heron count',
    detail: 'Survey · 30 min',
    columnId: 'heron',
    rowId: '9',
  },
  {
    id: 'martens',
    label: 'Pine marten walk',
    detail: 'Trail · 45 min',
    columnId: 'pine',
    rowId: '9',
  },
  {
    id: 'bitterns',
    label: 'Bittern listening',
    detail: 'Hide · 30 min',
    columnId: 'heron',
    rowId: '12',
  },
];

const mowing = [{ columnId: 'pine', rowId: '12', reason: 'Closed for mowing' }];

function toItem(talk: Talk): ScheduleGridItem {
  return {
    ...talk,
    content: (
      <Stack gap={1}>
        <Text as="span" variant="label">
          {talk.label}
        </Text>
        <Text as="span" color="muted" variant="caption">
          {talk.detail}
        </Text>
      </Stack>
    ),
  };
}

export function ScheduleGridSection() {
  const [talks, setTalks] = useState(firstTalks);
  const [last, setLast] = useState('None yet');
  const [locked, setLocked] = useState(false);
  const rowOf = (id: string) => talks.find((talk) => talk.id === id)!.rowId;

  // The gallery's own rule: otters nap until 10:30, wherever a move or a
  // swap would put their feeding.
  function canDrop(itemId: string, target: ScheduleGridTarget) {
    const otterRow =
      itemId === 'otters'
        ? target.rowId
        : target.kind === 'swap' && target.itemId === 'otters'
          ? rowOf(itemId)
          : null;
    return otterRow === '9' ? { reason: 'Otters nap before 10:30' } : true;
  }

  function onMove(itemId: string, slot: ScheduleGridSlot) {
    setTalks((all) =>
      all.map((talk) => (talk.id === itemId ? { ...talk, ...slot } : talk)),
    );
    setLast(`moved ${talks.find((talk) => talk.id === itemId)!.label}`);
  }

  function onSwap(itemId: string, otherId: string) {
    setTalks((all) => {
      const a = all.find((talk) => talk.id === itemId)!;
      const b = all.find((talk) => talk.id === otherId)!;
      return all.map((talk) =>
        talk.id === a.id
          ? { ...talk, columnId: b.columnId, rowId: b.rowId }
          : talk.id === b.id
            ? { ...talk, columnId: a.columnId, rowId: a.rowId }
            : talk,
      );
    });
    setLast(`swapped ${talks.find((talk) => talk.id === itemId)!.label}`);
  }

  return (
    <Section
      id="schedule-grid"
      purpose="ScheduleGrid is items in a grid of rows (such as times) by columns (such as places), moved between cells. A mouse drags an item with one hover target at a time (a pen too, where the browser does not pan under it); dropping on an open cell moves it, on another item swaps the two. With keys, the grid is one Tab stop with arrow-key focus: M or Space picks the focused item up, the arrows choose a cell, Enter (or Space) drops it and Escape cancels. On a touch screen there is no drag: a tap picks an item up and a tap on a cell drops it (a tap on its own cell or outside the grid cancels). While an item is carried its cell says Moving from here, the target says Release to move here or Release to swap, and every cell your canDrop blocks shows its reason in amber. disabledCells are never targets and show their reason. disabled (switch Lock the talks) lets nothing be picked up while the cells keep their focus. rowsLabel heads the rows' labels (without it that corner is blank and hidden). Each step is announced in a polite live region; every word is English by default and replaceable through labels. The grid holds no rules: canDrop decides, onMove and onSwap report."
      title="ScheduleGrid"
      usage={`// TalkCard, napping, move and swap are your own component and functions.
<ScheduleGrid
  label="Sunday talks by habitat"
  columns={[{ id: 'otter', label: 'Otter Pool' }, …]}
  rows={[{ id: '9', label: '9:00' }, …]}
  rowsLabel="Time"
  items={[{ id: 'otters', columnId: 'otter', rowId: '10', label: 'Otter feeding', content: <TalkCard /> }]}
  disabledCells={[{ columnId: 'pine', rowId: '12', reason: 'Closed for mowing' }]}
  canDrop={(itemId, target) => (napping(itemId, target) ? { reason: 'Otters nap before 10:30' } : true)}
  onMove={(itemId, { columnId, rowId }) => move(itemId, columnId, rowId)}
  onSwap={(itemId, otherId) => swap(itemId, otherId)}
/>`}
    >
      <Stack gap={3}>
        <Switch
          checked={locked}
          label="Lock the talks"
          onCheckedChange={setLocked}
        />
        <ScheduleGrid
          canDrop={canDrop}
          disabled={locked}
          columns={columns}
          disabledCells={mowing}
          items={talks.map(toItem)}
          label="Sunday talks by habitat"
          onMove={onMove}
          onSwap={onSwap}
          rows={rows}
          rowsLabel="Time"
        />
        <Text color="muted" variant="caption">
          Drag a talk to an open time to move it, or drop it on another talk to
          swap the two. No mouse? Focus a talk and press M. On a touch screen,
          tap a talk, then tap where it goes.
        </Text>
        <Text color="muted" variant="caption">
          Last change: {last}
        </Text>
      </Stack>
    </Section>
  );
}
