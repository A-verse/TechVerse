/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import cn from 'classnames';
import { Stage, Talk } from '@lib/types';
import styles from './schedule.module.css';
import styleUtils from './utils.module.css';
import TalkCard from './talk-card';

function StageRow({ stage }: { stage: Stage }) {
  // Group talks by the time block
  const timeBlocks = stage.schedule.reduce((allBlocks: any, talk) => {
    allBlocks[talk.start] = [...(allBlocks[talk.start] || []), talk];
    return allBlocks;
  }, {});

  const startTimes = Object.keys(timeBlocks);

  return (
    <div key={stage.name} className={styles.row}>
      <h3 className={cn(styles['stage-name'], styles[stage.slug])}>
        <span>{stage.name}</span>
      </h3>
      {startTimes.length === 0 ? (
        <p className={styles.noSessions}>No sessions scheduled for this stage yet.</p>
      ) : (
        <div className={cn(styles.talks, styles[stage.slug])}>
          {startTimes.map((startTime: string) => (
            <div key={startTime}>
              {timeBlocks[startTime].map((talk: Talk, index: number) => (
                <TalkCard key={talk.title} talk={talk} showTime={index === 0} stageSlug={stage.slug} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type Props = {
  allStages: Stage[];
};

export default function Schedule({ allStages }: Props) {
  if (allStages.length === 0) {
    return (
      <div className={styleUtils.emptyState}>
        <p>The schedule isn&apos;t available yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles['row-wrapper']}>
        {allStages.map(stage => (
          <StageRow key={stage.slug} stage={stage} />
        ))}
      </div>
    </div>
  );
}
