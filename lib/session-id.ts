import { Talk } from '@lib/types';

/**
 * The `Talk` type has no unique id — only title/description/start/end.
 * The same title can appear on more than one stage (confirmed in the
 * existing schedule data), so title alone isn't a safe key. This builds
 * a stable composite id from fields that are already unique together.
 */
export function getSessionId(stageSlug: string, talk: Pick<Talk, 'title' | 'start'>): string {
  return `${stageSlug}::${talk.start}::${talk.title}`;
}
