/**
 * Mock climbing data for the Bloc UI.
 *
 * These shapes mirror the product layers described in the business plan:
 * identity, session/route logging, social feed, groups, and progression.
 * Swap these out for API-backed data once `src/api/client.ts` is wired up.
 */

export type Climber = {
  id: string;
  name: string;
  handle: string;
  avatarColor: string;
  initials: string;
  topGrade: string;
  homeGym: string;
};

export type Reaction = 'fire' | 'strong' | 'clap';

export type FeedKind = 'send' | 'session' | 'milestone' | 'project';

export type FeedItem = {
  id: string;
  climber: Climber;
  kind: FeedKind;
  headline: string;
  routeName?: string;
  grade?: string;
  gym: string;
  timeAgo: string;
  note?: string;
  attempts?: number;
  media?: boolean;
  reactions: { fire: number; strong: number; clap: number };
  comments: number;
  reactedByMe?: Reaction;
};

export type Session = {
  id: string;
  date: string;
  gym: string;
  durationMins: number;
  hardest: string;
  sends: number;
  attempts: number;
  flashes: number;
  note?: string;
  grades: { grade: string; count: number }[];
};

export type Route = {
  id: string;
  name: string;
  grade: string;
  gym: string;
  wall: string;
  color: string;
  setter: string;
  style: string[];
  sends: number;
  attemptsAvg: number;
  betaVideos: number;
  status?: 'sent' | 'project' | 'flashed';
};

export type Crew = {
  id: string;
  name: string;
  emoji: string;
  members: number;
  activeToday: number;
  blurb: string;
  memberColors: string[];
  joined?: boolean;
};

export type Milestone = {
  id: string;
  title: string;
  detail: string;
  date: string;
  icon: string;
  tone: 'accent' | 'purple' | 'cyan' | 'success';
};

export type Achievement = {
  id: string;
  label: string;
  icon: string;
  earned: boolean;
  tone: 'accent' | 'purple' | 'cyan' | 'success';
};

export const me: Climber = {
  id: 'me',
  name: 'You',
  handle: '@you',
  avatarColor: '#FF6B3D',
  initials: 'Y',
  topGrade: 'V5',
  homeGym: 'The Cliffs LIC',
};

export const climbers: Climber[] = [
  {
    id: 'maya',
    name: 'Maya Ramos',
    handle: '@mayasends',
    avatarColor: '#FF3D77',
    initials: 'MR',
    topGrade: 'V6',
    homeGym: 'Brooklyn Boulders',
  },
  {
    id: 'diego',
    name: 'Diego Alvarez',
    handle: '@dieaglo',
    avatarColor: '#38E1D6',
    initials: 'DA',
    topGrade: 'V4',
    homeGym: 'Movement Denver',
  },
  {
    id: 'yuki',
    name: 'Yuki Tanaka',
    handle: '@yuki.climbs',
    avatarColor: '#8B5CF6',
    initials: 'YT',
    topGrade: 'V7',
    homeGym: 'B-Pump Ogikubo',
  },
  {
    id: 'sana',
    name: 'Sana Kapoor',
    handle: '@sanak',
    avatarColor: '#3DDC97',
    initials: 'SK',
    topGrade: 'V5',
    homeGym: 'VITAL Brooklyn',
  },
  {
    id: 'leo',
    name: 'Leo Fischer',
    handle: '@leo_f',
    avatarColor: '#F2C94C',
    initials: 'LF',
    topGrade: 'V8',
    homeGym: 'The Cliffs LIC',
  },
];

export const feed: FeedItem[] = [
  {
    id: 'f1',
    climber: climbers[0],
    kind: 'send',
    headline: 'sent her first V6',
    routeName: 'Tundra',
    grade: 'V6',
    gym: 'Brooklyn Boulders',
    timeAgo: '2h',
    note: 'Twelve sessions on this crimpy slab. Screamed at the top 🥹',
    attempts: 12,
    media: true,
    reactions: { fire: 48, strong: 21, clap: 12 },
    comments: 9,
    reactedByMe: 'fire',
  },
  {
    id: 'f2',
    climber: climbers[2],
    kind: 'project',
    headline: 'is projecting',
    routeName: 'Static Memory',
    grade: 'V7',
    gym: 'B-Pump Ogikubo',
    timeAgo: '5h',
    note: 'Powerful overhang. Sticking the dyno now — send is close.',
    attempts: 6,
    reactions: { fire: 15, strong: 30, clap: 4 },
    comments: 5,
  },
  {
    id: 'f3',
    climber: climbers[1],
    kind: 'session',
    headline: 'logged a session',
    gym: 'Movement Denver',
    timeAgo: '8h',
    note: '9 problems, V2 → V4. Legs are done.',
    reactions: { fire: 8, strong: 6, clap: 3 },
    comments: 2,
  },
  {
    id: 'f4',
    climber: climbers[3],
    kind: 'milestone',
    headline: 'hit a 30-day streak',
    gym: 'VITAL Brooklyn',
    timeAgo: '1d',
    note: 'One month on the wall every other day. Feeling strong.',
    reactions: { fire: 62, strong: 18, clap: 27 },
    comments: 14,
    reactedByMe: 'clap',
  },
];

export const stories: Climber[] = [me, ...climbers];

export const sessions: Session[] = [
  {
    id: 's1',
    date: 'Today',
    gym: 'The Cliffs LIC',
    durationMins: 95,
    hardest: 'V5',
    sends: 8,
    attempts: 23,
    flashes: 3,
    note: 'Worked the comp wall. Crimps felt good.',
    grades: [
      { grade: 'V2', count: 2 },
      { grade: 'V3', count: 3 },
      { grade: 'V4', count: 2 },
      { grade: 'V5', count: 1 },
    ],
  },
  {
    id: 's2',
    date: 'Mon · May 25',
    gym: 'Brooklyn Boulders',
    durationMins: 75,
    hardest: 'V4',
    sends: 9,
    attempts: 18,
    flashes: 5,
    grades: [
      { grade: 'V1', count: 2 },
      { grade: 'V2', count: 3 },
      { grade: 'V3', count: 2 },
      { grade: 'V4', count: 2 },
    ],
  },
  {
    id: 's3',
    date: 'Sat · May 23',
    gym: 'VITAL Brooklyn',
    durationMins: 120,
    hardest: 'V5',
    sends: 14,
    attempts: 31,
    flashes: 7,
    note: 'New set. So many fun slabs.',
    grades: [
      { grade: 'V2', count: 4 },
      { grade: 'V3', count: 5 },
      { grade: 'V4', count: 3 },
      { grade: 'V5', count: 2 },
    ],
  },
];

export const routes: Route[] = [
  {
    id: 'r1',
    name: 'Tundra',
    grade: 'V6',
    gym: 'Brooklyn Boulders',
    wall: 'Comp slab',
    color: '#38E1D6',
    setter: 'Nils K.',
    style: ['Crimpy', 'Slab', 'Balance'],
    sends: 34,
    attemptsAvg: 8.4,
    betaVideos: 6,
    status: 'project',
  },
  {
    id: 'r2',
    name: 'Static Memory',
    grade: 'V7',
    gym: 'B-Pump Ogikubo',
    wall: '45° cave',
    color: '#FF3D5A',
    setter: 'Aya M.',
    style: ['Powerful', 'Overhang', 'Dyno'],
    sends: 12,
    attemptsAvg: 14.1,
    betaVideos: 9,
  },
  {
    id: 'r3',
    name: 'Paper Cranes',
    grade: 'V4',
    gym: 'The Cliffs LIC',
    wall: 'Sunset wall',
    color: '#FF9F45',
    setter: 'Jordan P.',
    style: ['Techy', 'Vertical'],
    sends: 88,
    attemptsAvg: 3.2,
    betaVideos: 3,
    status: 'sent',
  },
  {
    id: 'r4',
    name: 'Molasses',
    grade: 'V3',
    gym: 'The Cliffs LIC',
    wall: 'Cave',
    color: '#F2C94C',
    setter: 'Jordan P.',
    style: ['Sloper', 'Compression'],
    sends: 121,
    attemptsAvg: 2.1,
    betaVideos: 2,
    status: 'flashed',
  },
];

export const gyms = [
  {
    id: 'g1',
    name: 'The Cliffs LIC',
    city: 'Long Island City, NY',
    climbersHere: 42,
    newRoutes: 18,
    accent: '#FF6B3D',
  },
  {
    id: 'g2',
    name: 'Brooklyn Boulders',
    city: 'Gowanus, NY',
    climbersHere: 67,
    newRoutes: 24,
    accent: '#8B5CF6',
  },
  {
    id: 'g3',
    name: 'VITAL Brooklyn',
    city: 'Bushwick, NY',
    climbersHere: 29,
    newRoutes: 12,
    accent: '#38E1D6',
  },
];

export const crews: Crew[] = [
  {
    id: 'c1',
    name: 'Dawn Patrol',
    emoji: '🌅',
    members: 24,
    activeToday: 6,
    blurb: 'Early birds who climb before work.',
    memberColors: ['#FF6B3D', '#38E1D6', '#8B5CF6', '#3DDC97'],
    joined: true,
  },
  {
    id: 'c2',
    name: 'Slab Club',
    emoji: '🦶',
    members: 51,
    activeToday: 11,
    blurb: 'Footwork nerds & balance believers.',
    memberColors: ['#F2C94C', '#FF3D77', '#38E1D6'],
    joined: true,
  },
  {
    id: 'c3',
    name: 'Women Who Send',
    emoji: '💪',
    members: 138,
    activeToday: 22,
    blurb: 'Support, beta, and projecting together.',
    memberColors: ['#FF3D77', '#8B5CF6', '#3DDC97', '#FF6B3D'],
  },
  {
    id: 'c4',
    name: 'V5 Grind',
    emoji: '🎯',
    members: 76,
    activeToday: 9,
    blurb: 'Breaking into the mid grades as a squad.',
    memberColors: ['#38E1D6', '#F2C94C', '#8B5CF6'],
  },
];

export const timeline: Milestone[] = [
  {
    id: 'm1',
    title: 'First V5',
    detail: '“Paper Cranes” at The Cliffs LIC',
    date: 'May 2026',
    icon: 'trophy',
    tone: 'accent',
  },
  {
    id: 'm2',
    title: '30-day streak',
    detail: 'Consistency unlocked',
    date: 'Apr 2026',
    icon: 'flame',
    tone: 'purple',
  },
  {
    id: 'm3',
    title: 'Joined Slab Club',
    detail: 'Found your people',
    date: 'Mar 2026',
    icon: 'people',
    tone: 'cyan',
  },
  {
    id: 'm4',
    title: 'First flash',
    detail: '“Molasses” · V3',
    date: 'Feb 2026',
    icon: 'flash',
    tone: 'success',
  },
];

export const achievements: Achievement[] = [
  { id: 'a1', label: 'First V5', icon: 'trophy', earned: true, tone: 'accent' },
  { id: 'a2', label: '30-day streak', icon: 'flame', earned: true, tone: 'purple' },
  { id: 'a3', label: '10 flashes', icon: 'flash', earned: true, tone: 'success' },
  { id: 'a4', label: 'Crew founder', icon: 'people', earned: true, tone: 'cyan' },
  { id: 'a5', label: 'First V7', icon: 'rocket', earned: false, tone: 'accent' },
  { id: 'a6', label: '100 routes', icon: 'ribbon', earned: false, tone: 'purple' },
];

/** Grade pyramid — number of sends at each grade, hardest first. */
export const gradePyramid: { grade: string; sends: number }[] = [
  { grade: 'V5', sends: 4 },
  { grade: 'V4', sends: 11 },
  { grade: 'V3', sends: 19 },
  { grade: 'V2', sends: 26 },
  { grade: 'V1', sends: 22 },
];

export const profileStats = {
  sends: 82,
  sessions: 46,
  crews: 2,
  streak: 6,
};
