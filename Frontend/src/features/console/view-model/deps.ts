import type { Weighting } from '@/lib/domain/progress';
import type { ConsoleActions, ConsoleState } from '@/store/console-store';

/** Where the console navigates to; backed by the app router. */
export interface ConsoleNav {
  toDashboard: () => void;
  toAttention: () => void;
  /** Engagement overview. */
  toEngagement: (engagementId: string) => void;
  /** A phase workspace inside an engagement. */
  toPhase: (engagementId: string, phaseIndex: number) => void;
  /** Altrd's reusable knowledge assets, optionally filtered to one kind. */
  toLibrary: (kind?: string) => void;
}

export interface ConsoleTheme {
  t: 'light' | 'dark';
  toggle: () => void;
}

/**
 * Tunables that were editor props on the original component. They are constants
 * here; move them into settings when the console gets a preferences surface.
 */
export interface ConsoleSettings {
  accent: string;
  weighting: Weighting;
  model: string;
}

/**
 * Where the console is, resolved from the URL rather than from the store, so
 * the first server-rendered paint is already the right view.
 */
export interface ConsoleRoute {
  view: 'dashboard' | 'project' | 'attention';
  /** Engagement on screen; falls back to the first in the portfolio. */
  engagementId: string;
  phase: number;
  /** true = the engagement overview, false = a phase workspace. */
  projectHome: boolean;
}

export interface ViewModelDeps {
  route: ConsoleRoute;
  state: ConsoleState;
  actions: ConsoleActions;
  nav: ConsoleNav;
  theme: ConsoleTheme;
  settings: ConsoleSettings;
}
