import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type DisclosureGroupValue = {
  openId: string | null;
  setOpenId: (update: (current: string | null) => string | null) => void;
};

const DisclosureGroupContext = createContext<DisclosureGroupValue | null>(null);

/**
 * Holds which picker is open under one ThemeProvider, so opening a
 * DateField, TimeField, or WheelField closes any other one.
 */
export function DisclosureGroup({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const value = useMemo(() => ({ openId, setOpenId }), [openId]);
  return (
    <DisclosureGroupContext.Provider value={value}>
      {children}
    </DisclosureGroupContext.Provider>
  );
}

/**
 * A picker's open state. Under a DisclosureGroup, opening it closes the
 * group's other pickers; without one it is local state.
 */
export function useExclusiveDisclosure(): [
  open: boolean,
  setOpen: (open: boolean) => void,
] {
  const id = useId();
  const group = useContext(DisclosureGroupContext);
  const [localOpen, setLocalOpen] = useState(false);
  const setGroupOpenId = group?.setOpenId;
  const setOpen = useCallback(
    (next: boolean) => {
      if (!setGroupOpenId) {
        setLocalOpen(next);
        return;
      }
      setGroupOpenId((current) => {
        if (next) return id;
        return current === id ? null : current;
      });
    },
    [id, setGroupOpenId],
  );
  return [group ? group.openId === id : localOpen, setOpen];
}
