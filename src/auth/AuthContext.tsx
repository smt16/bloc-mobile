/**
 * Auth context: drives the entire app's auth state.
 *
 * Responsibilities:
 *  - Hydrate persisted tokens on launch (and silently refresh if expired)
 *  - Email/password via Bloc API → Auth0 (confidential password-realm proxy)
 *  - Google / Apple via Auth0 Authorization Code + PKCE (`connection=…`)
 *  - Expose the current user + access token to the UI tree
 */
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

import { isAuth0Configured } from '../config/auth';
import {
  AuthCancelledError,
  authorizeWithConnection,
  buildLogoutReturnTo,
  buildLogoutUrl,
  buildRedirectUri,
  decodeUserFromIdToken,
  loginWithPassword as passwordLogin,
  refreshAccessToken,
  registerWithPassword as passwordRegister,
  requestPasswordReset as passwordReset,
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
  loginWithPassword: (email: string, password: string) => Promise<void>;
  registerWithPassword: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
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

  const clearError = useCallback(() => setError(null), []);

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

        if (isExpired && stored.refreshToken) {
          const canRefresh =
            stored.authMethod === 'password' || isConfigured;
          if (canRefresh) {
            try {
              const refreshed = await refreshAccessToken(
                stored.refreshToken,
                stored.authMethod,
              );
              await setSession(refreshed);
              return;
            } catch {
              await clearSession();
              return;
            }
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

  const loginWithPassword = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        const result = await passwordLogin(email.trim(), password);
        await setSession(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        console.warn('[auth] password login error', err);
        setError(message);
        throw err;
      }
    },
    [setSession],
  );

  const registerWithPassword = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        const result = await passwordRegister(email.trim(), password);
        await setSession(result);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Could not create account';
        console.warn('[auth] register error', err);
        setError(message);
        throw err;
      }
    },
    [setSession],
  );

  const loginWithSocial = useCallback(
    async (connection: 'google-oauth2' | 'apple') => {
      setError(null);

      if (!isConfigured) {
        setError(
          'Auth0 is not configured. Add your domain + clientId in src/config/auth.ts.',
        );
        return;
      }

      try {
        const result = await authorizeWithConnection({
          redirectUri,
          connection,
        });
        await setSession(result);
      } catch (err) {
        if (err instanceof AuthCancelledError) return;
        const message = err instanceof Error ? err.message : 'Sign-in failed';
        console.warn('[auth] social login error', err);
        setError(message);
      }
    },
    [isConfigured, redirectUri, setSession],
  );

  const loginWithGoogle = useCallback(
    () => loginWithSocial('google-oauth2'),
    [loginWithSocial],
  );

  const loginWithApple = useCallback(() => {
    if (Platform.OS !== 'ios') {
      setError('Apple Sign In is only available on iOS.');
      return Promise.resolve();
    }
    return loginWithSocial('apple');
  }, [loginWithSocial]);

  const requestPasswordReset = useCallback(async (email: string) => {
    setError(null);
    try {
      await passwordReset(email.trim());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not send reset email';
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    const currentTokens = tokensRef.current;

    try {
      if (currentTokens?.refreshToken) {
        await revokeRefreshToken(currentTokens.refreshToken);
      }

      if (isConfigured && Platform.OS !== 'web') {
        const returnTo = buildLogoutReturnTo();
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
      const refreshed = await refreshAccessToken(
        current.refreshToken,
        current.authMethod,
      );
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
      loginWithPassword,
      registerWithPassword,
      loginWithGoogle,
      loginWithApple,
      requestPasswordReset,
      logout,
      clearError,
      getAccessToken,
    }),
    [
      clearError,
      error,
      getAccessToken,
      isConfigured,
      loginWithApple,
      loginWithGoogle,
      loginWithPassword,
      logout,
      registerWithPassword,
      requestPasswordReset,
      status,
      tokens?.accessToken,
      user,
    ],
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
