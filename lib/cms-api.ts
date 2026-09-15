import { Job, Sponsor, Stage, Speaker } from '@lib/types';
import * as datoCmsApi from './cms-providers/dato';
import { getSampleJobs, getSampleSponsors, getSampleStages, getSampleSpeakers } from './sample-data';

const hasDatoCms = Boolean(process.env.DATOCMS_READ_ONLY_API_TOKEN);

export async function getAllSpeakers(): Promise<Speaker[]> {
  if (!hasDatoCms) return getSampleSpeakers();
  try {
    return (await datoCmsApi.getAllSpeakers()) || [];
  } catch (error) {
    console.error('DatoCMS speakers fetch failed:', error);
    return getSampleSpeakers();
  }
}

export async function getAllStages(): Promise<Stage[]> {
  if (!hasDatoCms) return getSampleStages();
  try {
    return (await datoCmsApi.getAllStages()) || [];
  } catch (error) {
    console.error('DatoCMS stages fetch failed:', error);
    return getSampleStages();
  }
}

export async function getAllSponsors(): Promise<Sponsor[]> {
  if (!hasDatoCms) return getSampleSponsors();
  try {
    return (await datoCmsApi.getAllSponsors()) || [];
  } catch (error) {
    console.error('DatoCMS sponsors fetch failed:', error);
    return getSampleSponsors();
  }
}

export async function getAllJobs(): Promise<Job[]> {
  if (!hasDatoCms) return getSampleJobs();
  try {
    return (await datoCmsApi.getAllJobs()) || [];
  } catch (error) {
    console.error('DatoCMS jobs fetch failed:', error);
    return getSampleJobs();
  }
}
