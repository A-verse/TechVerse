import { Job, Sponsor, Stage, Speaker, Talk } from '@lib/types';

const avatar = (name: string) => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `/avatars/${slug}.png`;
};

const speakers: Speaker[] = [
  {
    name: 'Aarav Mehta',
    bio: 'Product engineer and developer advocate focused on building reliable, human-centered software.',
    title: 'Staff Software Engineer',
    slug: 'aarav-mehta',
    twitter: '',
    github: 'https://github.com/',
    company: 'TechVerse',
    talk: {
      title: 'Building for the next billion interactions',
      description: 'Practical lessons from shipping products at scale.',
      start: '2026-10-18T09:00:00Z',
      end: '2026-10-18T09:40:00Z',
      speaker: []
    },
    image: { url: avatar('Aarav Mehta') },
    imageSquare: { url: avatar('Aarav Mehta') }
  },
  {
    name: 'Maya Shah',
    bio: 'Frontend engineer exploring design systems, accessibility, and delightful interfaces.',
    title: 'Frontend Engineer',
    slug: 'maya-shah',
    twitter: '',
    github: 'https://github.com/',
    company: 'TechVerse',
    talk: {
      title: 'Interfaces that feel inevitable',
      description: 'Design systems that scale without flattening creativity.',
      start: '2026-10-18T10:00:00Z',
      end: '2026-10-18T10:40:00Z',
      speaker: []
    },
    image: { url: avatar('Maya Shah') },
    imageSquare: { url: avatar('Maya Shah') }
  },
  {
    name: 'Kabir Rao',
    bio: 'Platform engineer working on cloud architecture, observability, and developer experience.',
    title: 'Platform Engineer',
    slug: 'kabir-rao',
    twitter: '',
    github: 'https://github.com/',
    company: 'TechVerse',
    talk: {
      title: 'Observability without the noise',
      description: 'Turn production signals into useful decisions.',
      start: '2026-10-18T11:00:00Z',
      end: '2026-10-18T11:40:00Z',
      speaker: []
    },
    image: { url: avatar('Kabir Rao') },
    imageSquare: { url: avatar('Kabir Rao') }
  },
  {
    name: 'Riya Kapoor',
    bio: 'Security-minded engineer passionate about privacy, identity, and resilient systems.',
    title: 'Security Engineer',
    slug: 'riya-kapoor',
    twitter: '',
    github: 'https://github.com/',
    company: 'TechVerse',
    talk: {
      title: 'Security as a product feature',
      description: 'Threat modeling techniques teams can actually use.',
      start: '2026-10-18T13:00:00Z',
      end: '2026-10-18T13:40:00Z',
      speaker: []
    },
    image: { url: avatar('Riya Kapoor') },
    imageSquare: { url: avatar('Riya Kapoor') }
  }
];

const talks: Talk[] = [
  {
    title: 'Building for the next billion interactions',
    description: 'Practical lessons from shipping products at scale.',
    start: '2026-10-18T09:00:00Z',
    end: '2026-10-18T09:40:00Z',
    speaker: [speakers[0]]
  },
  {
    title: 'Interfaces that feel inevitable',
    description: 'Design systems that scale without flattening creativity.',
    start: '2026-10-18T10:00:00Z',
    end: '2026-10-18T10:40:00Z',
    speaker: [speakers[1]]
  },
  {
    title: 'Observability without the noise',
    description: 'Turn production signals into useful decisions.',
    start: '2026-10-18T11:00:00Z',
    end: '2026-10-18T11:40:00Z',
    speaker: [speakers[2]]
  },
  {
    title: 'Security as a product feature',
    description: 'Threat modeling techniques teams can actually use.',
    start: '2026-10-18T13:00:00Z',
    end: '2026-10-18T13:40:00Z',
    speaker: [speakers[3]]
  }
];

const stages: Stage[] = [
  {
    name: 'Main Stage',
    slug: 'a',
    stream: '',
    discord: '',
    schedule: talks,
    isLive: false,
    roomId: '',
    stagePeers: [],
    backstagePeers: []
  },
  {
    name: 'Engineering Stage',
    slug: 'c',
    stream: '',
    discord: '',
    schedule: talks.slice(1),
    isLive: false,
    roomId: '',
    stagePeers: [],
    backstagePeers: []
  },
  {
    name: 'Community Stage',
    slug: 'm',
    stream: '',
    discord: '',
    schedule: talks.slice(2),
    isLive: false,
    roomId: '',
    stagePeers: [],
    backstagePeers: []
  }
];

const sponsors: Sponsor[] = [
  {
    name: 'Vertex Labs',
    description: 'Developer tooling and cloud infrastructure.',
    slug: 'vertex-labs',
    website: '',
    callToAction: 'Visit booth',
    callToActionLink: '',
    links: [],
    discord: '',
    tier: 'Platinum',
    cardImage: { url: avatar('Vertex Labs') },
    logo: { url: avatar('Vertex Labs') },
    youtubeSlug: ''
  },
  {
    name: 'Nova Systems',
    description: 'Infrastructure for ambitious engineering teams.',
    slug: 'nova-systems',
    website: '',
    callToAction: 'Learn more',
    callToActionLink: '',
    links: [],
    discord: '',
    tier: 'Gold',
    cardImage: { url: avatar('Nova Systems') },
    logo: { url: avatar('Nova Systems') },
    youtubeSlug: ''
  }
];

const jobs: Job[] = [
  {
    id: 'frontend-engineer',
    companyName: 'TechVerse',
    title: 'Frontend Engineer',
    description: 'Build accessible, performant web experiences.',
    discord: '',
    link: '',
    rank: 1
  },
  {
    id: 'fullstack-engineer',
    companyName: 'Vertex Labs',
    title: 'Full-Stack Engineer',
    description: 'Own product features across frontend and backend.',
    discord: '',
    link: '',
    rank: 2
  },
  {
    id: 'platform-engineer',
    companyName: 'Nova Systems',
    title: 'Platform Engineer',
    description: 'Build reliable developer infrastructure.',
    discord: '',
    link: '',
    rank: 3
  }
];

export const getSampleSpeakers = () => speakers;
export const getSampleStages = () => stages;
export const getSampleSponsors = () => sponsors;
export const getSampleJobs = () => jobs;
