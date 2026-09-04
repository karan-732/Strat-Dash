'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type ThemeName = 'light' | 'dark';

const KEY = 'altrd-theme';

/*
 * Theme is external state: the stylesheet reads it off `body[data-theme]` and
 * localStorage remembers it between sessions. It is exposed through
 * useSyncExternalStore so the server renders the default and the client picks
 * up the stored choice on hydration without a setState-in-effect cascade.
 */

const listeners = new Set<() => void>();
let current: ThemeName | null = null;

function read(): ThemeName {
  if (current) return current;
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch {
    /* storage blocked */
  }
  current = saved === 'dark' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', current);
  return current;
}

function write(next: ThemeName): void {
  current = next;
  document.body.setAttribute('data-theme', next);
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* storage blocked */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTheme() {
  const t = useSyncExternalStore<ThemeName>(subscribe, read, () => 'light');
  const apply = useCallback((next: ThemeName) => write(next), []);
  const toggle = useCallback(() => write(t === 'light' ? 'dark' : 'light'), [t]);
  return { t, apply, toggle };
}
