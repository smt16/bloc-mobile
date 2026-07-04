/**
 * API response shapes returned by the bloc-backend NestJS service.
 *
 * These mirror the DTO/view shapes produced by the backend controllers and
 * replace the old `src/data/mock.ts` types.
 */

export type ReactionType = 'fire' | 'strong' | 'clap';
export type FeedKind = 'send' | 'session' | 'milestone' | 'project';
export type ClimbOutcome = 'flash' | 'send' | 'project';
export type RouteStatus = 'sent' | 'project' | 'flashed';
export type Tone = 'accent' | 'purple' | 'cyan' | 'success';

export interface ClimberSummary {
  id: string;
  name: string;
  handle: string | null;
  avatarColor: string | null;
  initials: string | null;
  topGrade: string | null;
  pictureUrl: string | null;
}

export interface ClimberListItem extends ClimberSummary {
  homeGym?: string | null;
  isFollowing: boolean;
}

export interface Gym {
  id: string;
  name: string;
  city: string | null;
  accentColor: string | null;
  climbersHere: number;
  newRoutes: number;
}

export interface RouteSummary {
  id: string;
  name: string;
  grade: string;
  gymId: string;
  gym: string | null;
  wall: string | null;
  color: string | null;
  setter: string | null;
  setterInitials: string | null;
  style: string[];
  sends: number;
  attemptsAvg: number;
  betaVideos: number;
}

export interface RouteComment {
  id: string;
  body: string;
  timeAgo: string;
  createdAt: string;
  climber: ClimberSummary | null;
}

export interface RouteDetail extends RouteSummary {
  setterNote: string | null;
  recentSenders: ClimberSummary[];
  comments: RouteComment[];
  status: RouteStatus | null;
}

export interface FeedItem {
  id: string;
  kind: FeedKind;
  headline: string;
  climber: ClimberSummary | null;
  routeId: string | null;
  routeName: string | null;
  grade: string | null;
  gym: string | null;
  note: string | null;
  attempts: number | null;
  media: boolean;
  timeAgo: string;
  createdAt: string;
  reactions: { fire: number; strong: number; clap: number };
  comments: number;
  reactedByMe: ReactionType | null;
}

export interface SessionGrade {
  grade: string;
  count: number;
}

export interface Session {
  id: string;
  date: string;
  gym: string | null;
  gymId: string | null;
  durationMins: number | null;
  note: string | null;
  hardest: string | null;
  sends: number;
  attempts: number;
  flashes: number;
  grades: SessionGrade[];
}

export interface Logbook {
  summary: {
    sessionsThisWeek: number;
    hoursThisWeek: number;
    flashRate: number;
  };
  sessions: Session[];
}

export interface Milestone {
  id: string;
  title: string;
  detail: string | null;
  icon: string | null;
  tone: Tone;
  date: string | null;
}

export interface Achievement {
  id: string;
  label: string;
  icon: string | null;
  tone: Tone;
  earned: boolean;
}

export interface ProfileStats {
  sends: number;
  flashes: number;
  sessions: number;
  crews: number;
  streak: number;
  hardest: string | null;
}

export interface Profile extends ClimberSummary {
  email: string | null;
  bio: string | null;
  styleTags: string[];
  privacy: 'public' | 'private';
  homeGym: { id: string; name: string | null } | null;
  stats: ProfileStats;
  gradePyramid: { grade: string; sends: number }[];
  timeline: Milestone[];
  achievements: Achievement[];
  isFollowing?: boolean;
  isMe?: boolean;
}

export interface Crew {
  id: string;
  name: string;
  emoji: string | null;
  blurb: string | null;
  members: number;
  activeToday: number;
  memberColors: string[];
  joined: boolean;
}

export interface CreateLogInput {
  grade: string;
  outcome: ClimbOutcome;
  attempts?: number;
  routeId?: string;
  gymId?: string;
  sessionId?: string;
  note?: string;
  hasMedia?: boolean;
}
