/**
 * The engagements the console opens with.
 *
 * These are demonstration fixtures, not client data. The figures are
 * illustrative and were written for the console, not researched — nothing
 * here should be quoted as a finding about a real company.
 */
import type { Engagement } from '@/lib/domain/types';
import { dotAndKeyEngagement } from './dotandkey';
import { wakefitEngagement } from './wakefit';

export function seedEngagements(): Engagement[] {
  return [dotAndKeyEngagement(), wakefitEngagement()];
}

/* The pack-preview dev harness renders any phase from a single engagement. */
export { dotAndKeyEngagement, dotAndKeyEngagement as demoEngagement } from './dotandkey';
export { wakefitEngagement } from './wakefit';
export { DOTANDKEY_PACKS as DEMO_PACKS } from './dotandkey';
