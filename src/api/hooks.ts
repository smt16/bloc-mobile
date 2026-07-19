/**
 * TanStack Query hooks for the Bloc API.
 *
 * Every hook binds the Auth0 access token from `AuthContext` into `apiFetch`
 * so requests are authenticated (and transparently refreshed).
 */
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback } from 'react';

import { useAuth } from '../auth/AuthContext';
import { apiFetch, type RequestOptions } from './client';
import type {
  ClimberListItem,
  CreateLogInput,
  Crew,
  FeedItem,
  Gym,
  Logbook,
  Profile,
  ReactionType,
  RouteDetail,
  RouteSummary,
  UpdateProfileInput,
} from './types';

export const queryKeys = {
  profileMe: ['profile', 'me'] as const,
  profile: (id: string) => ['profile', id] as const,
  feed: (scope: string) => ['feed', scope] as const,
  gyms: ['gyms'] as const,
  routes: (gymId?: string) => ['routes', gymId ?? 'all'] as const,
  route: (id: string) => ['route', id] as const,
  sessions: ['sessions'] as const,
  crews: ['crews'] as const,
  climbers: (search: string) => ['climbers', search] as const,
};

/** Returns an `apiFetch` bound to the current auth session. */
const useApiFetch = () => {
  const { getAccessToken } = useAuth();
  return useCallback(
    <T>(path: string, options: RequestOptions = {}) =>
      apiFetch<T>(path, { ...options, getAccessToken }),
    [getAccessToken],
  );
};

// ---------------------------------------------------------------- queries ---

export const useProfile = () => {
  const api = useApiFetch();
  const { status } = useAuth();
  return useQuery({
    queryKey: queryKeys.profileMe,
    queryFn: () => api<Profile>('/users/me'),
    enabled: status === 'authenticated',
  });
};

export const useFeed = (scope: 'following' | 'global' = 'global') => {
  const api = useApiFetch();
  const { status } = useAuth();
  return useQuery({
    queryKey: queryKeys.feed(scope),
    queryFn: () => api<FeedItem[]>(`/feed?scope=${scope}`),
    enabled: status === 'authenticated',
  });
};

export const useGyms = () => {
  const api = useApiFetch();
  return useQuery({
    queryKey: queryKeys.gyms,
    queryFn: () => api<Gym[]>('/gyms'),
  });
};

export const useRoutes = (gymId?: string) => {
  const api = useApiFetch();
  return useQuery({
    queryKey: queryKeys.routes(gymId),
    queryFn: () =>
      api<RouteSummary[]>(`/routes${gymId ? `?gymId=${gymId}` : ''}`),
  });
};

export const useRoute = (id: string | undefined) => {
  const api = useApiFetch();
  return useQuery({
    queryKey: queryKeys.route(id ?? ''),
    queryFn: () => api<RouteDetail>(`/routes/${id}`),
    enabled: Boolean(id),
  });
};

export const useSessions = () => {
  const api = useApiFetch();
  const { status } = useAuth();
  return useQuery({
    queryKey: queryKeys.sessions,
    queryFn: () => api<Logbook>('/sessions'),
    enabled: status === 'authenticated',
  });
};

export const useCrews = () => {
  const api = useApiFetch();
  const { status } = useAuth();
  return useQuery({
    queryKey: queryKeys.crews,
    queryFn: () => api<Crew[]>('/crews'),
    enabled: status === 'authenticated',
  });
};

export const useClimbers = (search = '') => {
  const api = useApiFetch();
  const { status } = useAuth();
  return useQuery({
    queryKey: queryKeys.climbers(search),
    queryFn: () =>
      api<ClimberListItem[]>(
        `/users${search ? `?search=${encodeURIComponent(search)}` : ''}`,
      ),
    enabled: status === 'authenticated',
  });
};

// -------------------------------------------------------------- mutations ---

export const useLogClimb = () => {
  const api = useApiFetch();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLogInput) =>
      api<{ feedItemId: string }>('/logs', { method: 'POST', body: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] });
      qc.invalidateQueries({ queryKey: queryKeys.sessions });
      qc.invalidateQueries({ queryKey: ['profile'] });
      qc.invalidateQueries({ queryKey: ['route'] });
    },
  });
};

/**
 * Toggles a reaction on a feed item. Posting the same type the user already
 * reacted with removes it (handled server-side).
 */
export const useReactToFeedItem = () => {
  const api = useApiFetch();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      feedItemId,
      type,
    }: {
      feedItemId: string;
      type: ReactionType;
    }) =>
      api<void>(`/feed/${feedItemId}/reactions`, {
        method: 'POST',
        body: { type },
      }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['feed'] }),
  });
};

export const useFollowClimber = () => {
  const api = useApiFetch();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, follow }: { id: string; follow: boolean }) =>
      api<void>(`/users/${id}/follow`, {
        method: follow ? 'POST' : 'DELETE',
      }),
    onSettled: () => qc.invalidateQueries({ queryKey: ['climbers'] }),
  });
};

export const useToggleCrew = () => {
  const api = useApiFetch();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, join }: { id: string; join: boolean }) =>
      api<Crew | void>(`/crews/${id}/join`, {
        method: join ? 'POST' : 'DELETE',
      }),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.crews });
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useUpdateProfile = () => {
  const api = useApiFetch();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      api<Profile>('/users/me', { method: 'PATCH', body: input }),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.profileMe, data);
      qc.invalidateQueries({ queryKey: ['climbers'] });
      qc.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};
