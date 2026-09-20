import { GetStaticProps } from 'next';

import Page from '@components/page';
import LiveStagesGrid from '@components/live-stages-grid';
import Header from '@components/header';
import Layout from '@components/layout';

import { getAllStages } from '@lib/cms-api';
import { Stage } from '@lib/types';
import { META_DESCRIPTION } from '@lib/constants';

type Props = {
  stages: Stage[];
};

export default function LiveStagesPage({ stages }: Props) {
  const meta = {
    title: 'Live Stages - TechVerse',
    description: META_DESCRIPTION
  };

  const anyLive = stages.some(stage => stage.isLive);

  return (
    <Page meta={meta}>
      <Layout isLive={anyLive}>
        <Header
          hero="Live Stages"
          description="Join a session as it happens. You'll be asked to sign in first if you haven't already."
        />
        <LiveStagesGrid stages={stages} />
      </Layout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const stages = await getAllStages();

  return {
    props: {
      stages: stages || []
    },
    revalidate: 30
  };
};
