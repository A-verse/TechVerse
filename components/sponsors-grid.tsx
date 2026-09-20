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

import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { Sponsor } from '@lib/types';
import styles from './sponsors-grid.module.css';
import styleUtils from './utils.module.css';

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const tier = sponsor.tier?.toLowerCase();

  return (
    <Link key={sponsor.name} href={`/expo/${sponsor.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          alt={sponsor.name}
          src={sponsor.cardImage.url}
          className={cn(styles.image, {
            [styles.silver]: tier === 'silver'
          })}
          loading="lazy"
          title={sponsor.name}
          width={900}
          height={500}
        />
      </div>
      {tier !== 'silver' && (
        <div className={styles.cardBody}>
          <div>
            <h2 className={styles.name}>{sponsor.name}</h2>
            <p className={styles.description}>{sponsor.description}</p>
          </div>
        </div>
      )}
    </Link>
  );
}

type Props = {
  sponsors: Sponsor[];
};

export default function SponsorsGrid({ sponsors }: Props) {
  const silverSponsors = sponsors.filter(s => s.tier?.toLowerCase() === 'silver');
  const otherSponsors = sponsors.filter(s => s.tier?.toLowerCase() !== 'silver');

  if (sponsors.length === 0) {
    return (
      <div className={styleUtils.emptyState}>
        <p>No exhibitors listed yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.grid}>
        {otherSponsors.map(sponsor => (
          <SponsorCard key={sponsor.name} sponsor={sponsor} />
        ))}
      </div>
      <div className={styles.grid}>
        {silverSponsors.map(sponsor => (
          <SponsorCard key={sponsor.name} sponsor={sponsor} />
        ))}
      </div>
    </>
  );
}
