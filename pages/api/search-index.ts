import { NextApiRequest, NextApiResponse } from 'next';
import { getAllStages, getAllSpeakers, getAllSponsors, getAllJobs } from '@lib/cms-api';
import { SearchResult } from '@lib/types';

const EXPIRES_SECONDS = 30;

export default async function searchIndex(_: NextApiRequest, res: NextApiResponse) {
  try {
    const [stages, speakers, sponsors, jobs] = await Promise.all([
      getAllStages(),
      getAllSpeakers(),
      getAllSponsors(),
      getAllJobs()
    ]);

    const results: SearchResult[] = [];

    for (const stage of stages || []) {
      for (const talk of stage.schedule) {
        results.push({
          type: 'session',
          title: talk.title,
          subtitle: `${stage.name}${talk.speaker[0] ? ` · ${talk.speaker[0].name}` : ''}`,
          url: talk.speaker[0] ? `/speakers/${talk.speaker[0].slug}` : '/schedule'
        });
      }
    }

    for (const speaker of speakers || []) {
      results.push({
        type: 'speaker',
        title: speaker.name,
        subtitle: [speaker.title, speaker.company].filter(Boolean).join(' @ '),
        url: `/speakers/${speaker.slug}`
      });
    }

    for (const sponsor of sponsors || []) {
      results.push({
        type: 'company',
        title: sponsor.name,
        subtitle: sponsor.description,
        url: `/expo/${sponsor.slug}`
      });
    }

    for (const job of jobs || []) {
      results.push({
        type: 'job',
        title: job.title,
        subtitle: job.companyName,
        url: '/jobs'
      });
    }

    res.setHeader('Cache-Control', `s-maxage=${EXPIRES_SECONDS}, stale-while-revalidate`);
    return res.status(200).json(results);
  } catch (error) {
    console.error('Failed to build search index:', error);
    return res
      .status(500)
      .json({ error: { code: 'server_error', message: 'Internal server error' } });
  }
}
