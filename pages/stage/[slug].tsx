/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 */

import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import Page from '@components/page';
import StageContainer from '@components/stage-container';
import Layout from '@components/layout';

import { getAllStages } from '@lib/cms-api';
import { getTicketNumberByUserId } from '@lib/db-api';
import { Stage } from '@lib/types';
import { COOKIE, META_DESCRIPTION } from '@lib/constants';

type Props = {
  stage: Stage;
  allStages: Stage[];
};

export default function StagePage({ stage, allStages }: Props) {
  const meta = {
    title: 'TechVerse',
    description: META_DESCRIPTION
  };

  return (
    <Page meta={meta} fullViewport>
      <Layout isLive={stage.isLive}>
        <StageContainer stage={stage} allStages={allStages} />
      </Layout>
    </Page>
  );
}

/**
 * Server-side authentication guard.
 *
 * A user must have a valid TechVerse session before
 * the stage page itself can be opened.
 */
export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext
) => {
  const sessionId = context.req.cookies[COOKIE];

  /*
   * No login/session cookie.
   * Do not allow direct access to the stage.
   */
  if (!sessionId) {
    return {
      redirect: {
        destination: `/?login=1&returnTo=${encodeURIComponent(`/stage/${String(context.params?.slug || '')}`)}`,
        permanent: false
      }
    };
  }

  /*
   * Verify that the session belongs to an actual
   * registered TechVerse user.
   */
  try {
    const ticketNumber = await getTicketNumberByUserId(sessionId);

    if (!ticketNumber) {
      return {
        redirect: {
          destination: `/?login=1&returnTo=${encodeURIComponent(`/stage/${String(context.params?.slug || '')}`)}`,
          permanent: false
        }
      };
    }
  } catch (error) {
    console.error('Stage authentication check failed:', error);

    return {
      redirect: {
        destination: `/?login=1&returnTo=${encodeURIComponent(`/stage/${String(context.params?.slug || '')}`)}`,
        permanent: false
      }
    };
  }

  const slug = context.params?.slug;

  const stages = await getAllStages();

  const stage = stages?.find((item: Stage) => item.slug === slug) || null;

  if (!stage) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      stage,
      allStages: stages
    }
  };
};
