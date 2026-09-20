import Link from 'next/link';
import { Stage } from '@lib/types';
import styles from './live-stages-grid.module.css';
import styleUtils from './utils.module.css';

type Props = {
  stages: Stage[];
};

export default function LiveStagesGrid({ stages }: Props) {
  if (stages.length === 0) {
    return (
      <div className={styleUtils.emptyState}>
        <p>No stages are set up yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {stages.map(stage => (
        <Link key={stage.slug} href={`/stage/${stage.slug}`} className={styles.card}>
          <div className={styles.cardBody}>
            <span
              className={stage.isLive ? styles.badgeLive : styles.badgeOffline}
              aria-hidden="true"
            />
            <h3 className={styles.title}>{stage.name}</h3>
            <p className={styles.status}>{stage.isLive ? 'Live now' : 'Not live yet'}</p>
          </div>
          <span className={styles.cta}>{stage.isLive ? 'Join stage' : 'View stage'}</span>
        </Link>
      ))}
    </div>
  );
}
