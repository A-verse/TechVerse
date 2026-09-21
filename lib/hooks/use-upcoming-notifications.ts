import { useEffect, useMemo, useState } from 'react';
import { Stage, Talk } from '@lib/types';
import { getSessionId } from '@lib/session-id';
import useSavedSessions from './use-saved-sessions';

const STARTING_SOON_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

export type SessionNotification = {
  id: string;
  talk: Talk;
  stageSlug: string;
  stageName: string;
  minutesUntilStart: number;
};

/**
 * Real, derived notifications — "a session you saved starts soon" — computed
 * entirely from data that already exists (saved sessions + their real start
 * times). There is no push/announcement backend, so this intentionally does
 * not claim to be one; it only ever reflects the saved-sessions data a
 * person already has.
 */
export default function useUpcomingNotifications(allStages: Stage[]) {
  const { savedIds } = useSavedSessions();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  const notifications = useMemo<SessionNotification[]>(() => {
    const upcoming: SessionNotification[] = [];

    for (const stage of allStages) {
      for (const talk of stage.schedule) {
        const id = getSessionId(stage.slug, talk);
        if (!savedIds.includes(id)) continue;

        const startMs = new Date(talk.start).getTime();
        const msUntilStart = startMs - now;

        if (msUntilStart > 0 && msUntilStart <= STARTING_SOON_WINDOW_MS) {
          upcoming.push({
            id,
            talk,
            stageSlug: stage.slug,
            stageName: stage.name,
            minutesUntilStart: Math.max(1, Math.round(msUntilStart / 60000))
          });
        }
      }
    }

    return upcoming.sort((a, b) => a.minutesUntilStart - b.minutesUntilStart);
  }, [allStages, savedIds, now]);

  return notifications;
}
