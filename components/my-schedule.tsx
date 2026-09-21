import { useMemo } from 'react';
import { Stage, Talk } from '@lib/types';
import { getSessionId } from '@lib/session-id';
import useSavedSessions from '@lib/hooks/use-saved-sessions';
import TalkCard from './talk-card';
import styleUtils from './utils.module.css';
import styles from './my-schedule.module.css';

type Props = {
  allStages: Stage[];
};

type SavedTalk = {
  talk: Talk;
  stageSlug: string;
  stageName: string;
};

export default function MySchedule({ allStages }: Props) {
  const { savedIds } = useSavedSessions();

  const savedTalks = useMemo<SavedTalk[]>(() => {
    const found: SavedTalk[] = [];

    for (const stage of allStages) {
      for (const talk of stage.schedule) {
        if (savedIds.includes(getSessionId(stage.slug, talk))) {
          found.push({ talk, stageSlug: stage.slug, stageName: stage.name });
        }
      }
    }

    return found.sort((a, b) => a.talk.start.localeCompare(b.talk.start));
  }, [allStages, savedIds]);

  if (savedTalks.length === 0) {
    return (
      <div className={styleUtils.emptyState}>
        <p>Your schedule is empty. Save sessions to see them here.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {savedTalks.map(({ talk, stageSlug, stageName }) => (
        <div key={getSessionId(stageSlug, talk)} className={styles.item}>
          <p className={styles.stageLabel}>{stageName}</p>
          <TalkCard talk={talk} showTime stageSlug={stageSlug} />
        </div>
      ))}
    </div>
  );
}
