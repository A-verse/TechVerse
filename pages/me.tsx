import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import Page from '@components/page';
import Layout from '@components/layout';
import Header from '@components/header';
import TicketVisual from '@components/ticket-visual';
import ticketStyles from '@components/ticket.module.css';
import MySchedule from '@components/my-schedule';
import useUpcomingNotifications from '@lib/hooks/use-upcoming-notifications';

import { getUserById, getTicketNumberByUserId } from '@lib/db-api';
import { getAllStages } from '@lib/cms-api';
import { ConfUser, Stage } from '@lib/types';
import { COOKIE, META_DESCRIPTION } from '@lib/constants';

import styles from './me.module.css';

type Props = {
  user: ConfUser;
  allStages: Stage[];
};

export default function MePage({ user, allStages }: Props) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const notifications = useUpcomingNotifications(allStages);

  const meta = {
    title: 'My TechVerse',
    description: META_DESCRIPTION
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await fetch('/api/logout', { method: 'POST' });
    } finally {
      router.push('/');
    }
  };

  return (
    <Page meta={meta}>
      <Layout>
        <Header
          hero="My TechVerse"
          description={`Signed in as ${user.email || 'a TechVerse attendee'}.`}
        />

        {notifications.length > 0 && (
          <div className={styles.notifications}>
            {notifications.map(n => (
              <p key={n.id} className={styles.notification}>
                <strong>{n.talk.title}</strong> on {n.stageName} starts in {n.minutesUntilStart}{' '}
                {n.minutesUntilStart === 1 ? 'minute' : 'minutes'}.
              </p>
            ))}
          </div>
        )}

        <section className={styles.section}>
          <div className={styles.ticketWrapper}>
            <TicketVisual
              username={user.username ?? undefined}
              name={user.name ?? undefined}
              ticketNumber={user.ticketNumber ?? undefined}
            />
          </div>
          <a href="/" className={styles.ticketLink}>
            {user.username ? 'Manage your ticket' : 'Add your GitHub profile to your ticket'} →
          </a>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>My Schedule</h2>
          <MySchedule allStages={allStages} />
        </section>

        <section className={styles.section}>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className={styles.signOutButton}
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </section>
      </Layout>
    </Page>
  );
}

/**
 * Server-side authentication guard, matching the same pattern used for
 * /stage/[slug] — never trust a client-side-only check for a page that
 * shows account data.
 */
export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext
) => {
  const sessionId = context.req.cookies[COOKIE];

  if (!sessionId) {
    return {
      redirect: {
        destination: `/?login=1&returnTo=${encodeURIComponent('/me')}`,
        permanent: false
      }
    };
  }

  try {
    const ticketNumber = await getTicketNumberByUserId(sessionId);

    if (!ticketNumber) {
      return {
        redirect: {
          destination: `/?login=1&returnTo=${encodeURIComponent('/me')}`,
          permanent: false
        }
      };
    }

    // Best-effort profile details for display. In fallback/demo mode
    // (no Supabase configured) this can come back mostly empty — that's
    // fine, the page still renders with the ticket number it does have.
    let user: ConfUser = {};
    try {
      user = await getUserById(sessionId);
    } catch (profileError) {
      console.error('/me profile lookup failed (non-fatal):', profileError);
    }

    const allStages = await getAllStages();

    return {
      props: {
        user: { ...user, id: sessionId, ticketNumber: Number(ticketNumber) },
        allStages: allStages || []
      }
    };
  } catch (error) {
    console.error('/me authentication check failed:', error);

    return {
      redirect: {
        destination: `/?login=1&returnTo=${encodeURIComponent('/me')}`,
        permanent: false
      }
    };
  }
};
