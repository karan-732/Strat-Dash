import type { Engagement } from '@/lib/domain/types';

/** Chart read-outs shared by the Phase 0 and Phase 1 quadrants. */
export interface PickReadout {
  show: boolean;
  line: string;
}

export interface Picks {
  bench0: PickReadout;
  pos0: PickReadout;
  bcg0: PickReadout;
  bench1: PickReadout;
  [key: string]: PickReadout;
}

/**
 * What a pack builder needs: the engagement, the accent, the currently
 * selected chart point (`pick`) and the handler that selects one. `picks` is
 * filled in by the builders and read back by the card read-outs.
 */
export interface PackContext {
  p: Engagement;
  accent: string;
  pk: string;
  pickOn: (key: string) => () => void;
  picks: Picks;
}

export function emptyPicks(): Picks {
  return {
    bench0: { show: false, line: '' },
    pos0: { show: false, line: '' },
    bcg0: { show: false, line: '' },
    bench1: { show: false, line: '' },
  };
}
