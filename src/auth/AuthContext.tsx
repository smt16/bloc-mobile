/**
 * Auth context: drives the entire app's auth state.
 *
 * Responsibilities:
 *  - Hydrate persisted tokens on launch (and silently refresh if expired)
 *  - Provide `login` / `logout` methods backed by Auth0 Universal Login (PKCE)
 *  - Expose the current user + access token to the UI tree
 */
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';

import { auth0Discovery, isAuth0Configured } from '../config/auth';
import {
  buildAuthRequestConfig,
  buildLogoutUrl,
  buildRedirectUri,
  decodeUserFromIdToken,
  exchangeAuthorizationCode,
  refreshAccessToken,
  revokeRefreshToken,
  type Auth0User,
} from './authService';
import { tokenStorage, type StoredTokens } from './tokenStorage';

WebBrowser.maybeCompleteAuthSession();

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  status: AuthStatus;
  user: Auth0User | null;
  accessToken: string | null;
  error: string | null;
  isConfigured: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const REFRESH_SKEW_MS = 60_000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<Auth0User | null>(null);
  const [tokens, setTokens] = useState<StoredTokens | null>(null);
  const [error, setError] = useState<string | null>(null);

  const redirectUri = useMemo(buildRedirectUri, []);
  const isConfigured = useMemo(isAuth0Configured, []);

  const [request, , promptAsync] = AuthSession.useAuthRequest(
    buildAuthRequestConfig(redirectUri),
    auth0Discovery,
  );

  const tokensRef = useRef<StoredTokens | null>(null);
  tokensRef.current = tokens;

  const setSession = useCallback(
    async (next: { tokens: StoredTokens; user: Auth0User | null }) => {
      await tokenStorage.save(next.tokens);
      setTokens(next.tokens);
      setUser(next.user ?? decodeUserFromIdToken(next.tokens.idToken));
      setStatus('authenticated');
      setError(null);
    },
    [],
  );

  const clearSession = useCallback(async () => {
    await tokenStorage.clear();
    setTokens(null);
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const stored = await tokenStorage.load();
        if (!stored) {
          setStatus('unauthenticated');
          return;
        }

        const isExpired =
          stored.expiresAt !== null &&
          stored.expiresAt - REFRESH_SKEW_MS <= Date.now();

        if (isExpired && stored.refreshToken && isConfigured) {
          try {
            const refreshed = await refreshAccessToken(stored.refreshToken);
            await setSession(refreshed);
            return;
          } catch {
            await clearSession();
            return;
          }
        }

        setTokens(stored);
        setUser(decodeUserFromIdToken(stored.idToken));
        setStatus(stored.accessToken ? 'authenticated' : 'unauthenticated');
      } catch (err) {
        console.warn('[auth] hydration failed', err);
        setStatus('unauthenticated');
      }
    })();
  }, [clearSession, isConfigured, setSession]);

  const login = useCallback(async () => {
    setError(null);

    if (!isConfigured) {
      setError(
        'Auth0 is not configured. Add your domain + clientId in src/config/auth.ts.',
      );
      return;
    }

    if (!request) {
      setError('Auth request is not ready yet. Please try again.');
      return;
    }

    try {
      const result = await promptAsync();

      if (result.type === 'cancel' || result.type === 'dismiss') {
        return;
      }

      if (result.type === 'error') {
        throw new Error(
          result.error?.message ?? result.params?.error_description ?? 'Login failed',
        );
      }

      if (result.type !== 'success' || !result.params.code) {
        throw new Error('Login did not complete.');
      }

      if (!request.codeVerifier) {
        throw new Error('Missing PKCE code verifier.');
      }

      const exchanged = await exchangeAuthorizationCode({
        code: result.params.code,
        codeVerifier: request.codeVerifier,
        redirectUri,
      });

      await setSession(exchanged);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      console.warn('[auth] login error', err);
      setError(message);
    }
  }, [isConfigured, promptAsync, redirectUri, request, setSession]);

  const logout = useCallback(async () => {
    const currentTokens = tokensRef.current;

    try {
      if (currentTokens?.refreshToken) {
        await revokeRefreshToken(currentTokens.refreshToken);
      }

      if (isConfigured && Platform.OS !== 'web') {
        const returnTo = `${redirectUri.split('://')[0]}://logout`;
        const logoutUrl = buildLogoutUrl(returnTo);
        try {
          await WebBrowser.openAuthSessionAsync(logoutUrl, returnTo);
        } catch {
          // Best effort: ignore failures so the local session always clears.
        }
      }
    } finally {
      await clearSession();
    }
  }, [clearSession, isConfigured, redirectUri]);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const current = tokensRef.current;
    if (!current) return null;

    const isExpired =
      current.expiresAt !== null &&
      current.expiresAt - REFRESH_SKEW_MS <= Date.now();

    if (!isExpired) return current.accessToken;

    if (!current.refreshToken) {
      await clearSession();
      return null;
    }

    try {
      const refreshed = await refreshAccessToken(current.refreshToken);
      await setSession(refreshed);
      return refreshed.tokens.accessToken;
    } catch {
      await clearSession();
      return null;
    }
  }, [clearSession, setSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      accessToken: tokens?.accessToken ?? null,
      error,
      isConfigured,
      login,
      logout,
      getAccessToken,
    }),
    [error, getAccessToken, isConfigured, login, logout, status, tokens?.accessToken, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
};
