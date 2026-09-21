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
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { parseISO, format, isBefore, isAfter } from 'date-fns';
import { Talk } from '@lib/types';
import { getSessionId } from '@lib/session-id';
import useSavedSessions from '@lib/hooks/use-saved-sessions';
import styles from './talk-card.module.css';

type Props = {
  talk: Talk;
  showTime: boolean;
  stageSlug: string;
};

const formatDate = (date: string) => {
  // https://github.com/date-fns/date-fns/issues/946
  return format(parseISO(date), "h:mmaaaaa'm'");
};

export default function TalkCard({
  talk: { title, speaker, start, end },
  showTime,
  stageSlug
}: Props) {
  const [isTalkLive, setIsTalkLive] = useState(false);
  const [startAndEndTime, setStartAndEndTime] = useState('');
  const { isSaved, toggleSave } = useSavedSessions();

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      setIsTalkLive(isAfter(now, parseISO(start)) && isBefore(now, parseISO(end)));
    };

    update();
    setStartAndEndTime(`${formatDate(start)} – ${formatDate(end)}`);

    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [end, start]);

  const firstSpeakerLink = speaker[0] ? `/speakers/${speaker[0].slug}` : '/speakers';
  const sessionId = getSessionId(stageSlug, { title, start });
  const saved = isSaved(sessionId);

  return (
    <div className={styles.talk}>
      {showTime && <p className={styles.time}>{startAndEndTime || <>&nbsp;</>}</p>}
      <div className={styles.cardWrapper}>
        <Link
          href={firstSpeakerLink}
          className={cn(styles.card, {
            [styles['is-live']]: isTalkLive
          })}
        >
          <div className={styles['card-body']}>
            <h4 title={title} className={styles.title}>
              {title}
            </h4>
            <div className={styles.speaker}>
              <div className={styles['avatar-group']}>
                {speaker.map(s => (
                  <div key={s.name} className={styles['avatar-wrapper']}>
                    <Image
                      loading="lazy"
                      alt={s.name}
                      className={styles.avatar}
                      src={s.image.url}
                      title={s.name}
                      width={24}
                      height={24}
                    />
                  </div>
                ))}
              </div>
              <h5 className={styles.name}>
                {speaker.length === 1 ? speaker[0].name : `${speaker.length} speakers`}
              </h5>
            </div>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => toggleSave(sessionId)}
          className={styles.saveButton}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${title} from My Schedule` : `Save ${title} to My Schedule`}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
