export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || new URL(SITE_URL).origin;
export const TWITTER_USER_NAME = process.env.NEXT_PUBLIC_TWITTER_USER_NAME || '';
export const BRAND_NAME = 'TECHVERSE';
export const SITE_NAME_MULTILINE = ['TECH', 'VERSE'];
export const SITE_NAME = 'TechVerse';
export const META_DESCRIPTION =
  'TechVerse is a modern virtual conference experience for talks, live stages, speakers, networking, and career opportunities.';
export const SITE_DESCRIPTION =
  'An interactive conference experience built with Next.js, TypeScript, and modern web APIs.';
export const DATE = process.env.NEXT_PUBLIC_EVENT_DATE || '18 October 2026';
export const SHORT_DATE = process.env.NEXT_PUBLIC_SHORT_DATE || 'Oct 18';
export const FULL_DATE = process.env.NEXT_PUBLIC_FULL_DATE || 'Oct 18, 2026';
export const TWEET_TEXT = `Join me at ${SITE_NAME}.`;
export const COOKIE = 'techverse_session';

export const LEGAL_URL = process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL;
export const COPYRIGHT_HOLDER = process.env.NEXT_PUBLIC_COPYRIGHT_HOLDER || 'TechVerse';

export const CODE_OF_CONDUCT = process.env.NEXT_PUBLIC_CODE_OF_CONDUCT_URL || '';
export const REPO = process.env.NEXT_PUBLIC_REPO_URL || 'https://github.com/A-verse/TechVerse';
export const SAMPLE_TICKET_NUMBER = 1234;

export const NAVIGATION = [
  { name: 'Live', route: '/stage' },
  { name: 'Schedule', route: '/schedule' },
  { name: 'Speakers', route: '/speakers' },
  { name: 'Expo', route: '/expo' },
  { name: 'Jobs', route: '/jobs' }
];

export type TicketGenerationState = 'default' | 'loading';
