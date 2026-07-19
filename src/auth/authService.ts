/**
 * Auth0 authentication service.
 *
 * - Social (Google / Apple): Authorization Code + PKCE with a forced `connection`
 * - Email/password: tokens come from the Bloc API (`/auth/login`, `/auth/register`),
 *   which proxies Auth0's password-realm grant with a confidential client secret
 * - Refresh / revoke still talk to Auth0 directly from the device
 */
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { jwtDecode } from 'jwt-decode';
import { Platform } from 'react-native';

import { apiFetch, ApiError } from '../api/client';
import {
  auth0Config,
  auth0Discovery,
  auth0Endpoints,
  buildCustomSchemeCallbackUri,
  buildHttpsCallbackUri,
  nativeScheme,
} from '../config/auth';
import type { AuthMethod, StoredTokens } from './tokenStorage';

WebBrowser.maybeCompleteAuthSession();

export type Auth0User = {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  nickname?: string;
  [key: string]: unknown;
};

export type AuthResult = {
  tokens: StoredTokens;
  user: Auth0User | null;
};

export type SocialConnection = 'google-oauth2' | 'apple';

type PasswordTokenPayload = {
  accessToken: string;
  refreshToken: string | null;
  idToken: string | null;
  expiresIn: number | null;
  tokenType?: string;
};

/**
 * Builds the redirect URI registered with Auth0.
 *
 * Prefer HTTPS Universal Links / App Links so Auth0 skips the
 * "Authorize App" confirmation that custom schemes trigger:
 *   https://{domain}/ios|android/{bundleId}/callback
 *
 * Falls back to `com.bloc://…` when `useHttpsCallbacks` is false (Expo Go).
 */
export const buildRedirectUri = (): string => {
  if (Platform.OS === 'web') {
    return AuthSession.makeRedirectUri({ path: 'callback' });
  }

  if (auth0Config.useHttpsCallbacks) {
    return buildHttpsCallbackUri(Platform.OS === 'ios' ? 'ios' : 'android');
  }

  return buildCustomSchemeCallbackUri(
    Platform.OS === 'ios' ? 'ios' : 'android',
  );
};

/**
 * Logout `returnTo` must be listed under Auth0 Allowed Logout URLs.
 * Use the same HTTPS callback when Universal Links are enabled.
 */
export const buildLogoutReturnTo = (): string => {
  if (Platform.OS === 'web') {
    return AuthSession.makeRedirectUri({ path: 'logout' });
  }

  if (auth0Config.useHttpsCallbacks) {
    return buildHttpsCallbackUri(Platform.OS === 'ios' ? 'ios' : 'android');
  }

  return `${nativeScheme}://logout`;
};

const decodeUserFromIdToken = (idToken: string | null | undefined): Auth0User | null => {
  if (!idToken) return null;
  try {
    return jwtDecode<Auth0User>(idToken);
  } catch {
    return null;
  }
};

const toStoredTokens = (
  result: Pick<
    AuthSession.TokenResponse,
    'accessToken' | 'refreshToken' | 'idToken' | 'expiresIn' | 'issuedAt'
  >,
  authMethod: AuthMethod,
): StoredTokens => {
  const expiresAt =
    result.expiresIn && result.issuedAt
      ? (result.issuedAt + result.expiresIn) * 1000
      : null;

  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken ?? null,
    idToken: result.idToken ?? null,
    expiresAt,
    authMethod,
  };
};

const tokensFromPasswordPayload = (payload: PasswordTokenPayload): AuthResult => {
  const issuedAt = Math.floor(Date.now() / 1000);
  const tokens = toStoredTokens(
    {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken ?? undefined,
      idToken: payload.idToken ?? undefined,
      expiresIn: payload.expiresIn ?? undefined,
      issuedAt,
    },
    'password',
  );

  return {
    tokens,
    user: decodeUserFromIdToken(tokens.idToken),
  };
};

const messageFromApiError = (err: unknown, fallback: string): string => {
  if (err instanceof ApiError) {
    const body = err.body;
    if (body && typeof body === 'object') {
      const message = (body as { message?: unknown }).message;
      if (typeof message === 'string' && message.length > 0) return message;
      if (Array.isArray(message) && typeof message[0] === 'string') {
        return message[0];
      }
      // Nest GlobalExceptionFilter nests HttpException.getResponse() under message
      if (message && typeof message === 'object') {
        const nested = (message as { message?: unknown }).message;
        if (typeof nested === 'string' && nested.length > 0) return nested;
      }
    }
    if (err.status === 401) return 'Invalid email or password.';
    if (err.status === 409) return 'An account with that email already exists.';
    if (err.status === 503) {
      return 'Email/password login is not configured on the server yet.';
    }
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
};

/**
 * Helper for AuthContext: returns a fully-configured AuthRequestConfig.
 * Pass `connection` to skip Universal Login and go straight to a social IdP.
 *
 * Auth0 may still show an "Authorize App" consent after Google unless the API
 * has **Allow Skipping User Consent** enabled (APIs → Bloc API → Settings).
 * That setting is required for a normal Google → app hop with an `audience`.
 */
export const buildAuthRequestConfig = (
  redirectUri: string,
  connection?: SocialConnection,
): AuthSession.AuthRequestConfig => ({
  clientId: auth0Config.clientId,
  scopes: auth0Config.scopes,
  redirectUri,
  responseType: AuthSession.ResponseType.Code,
  usePKCE: true,
  extraParams: {
    audience: auth0Config.audience,
    // Force account picker on social; do not use Auth0 Universal Login UI.
    ...(connection
      ? { connection, prompt: 'select_account' }
      : { prompt: 'login' }),
  },
});

/**
 * Authorization Code + PKCE against a specific Auth0 social connection
 * (Google or Apple). Opens the system browser for that provider only.
 */
export const authorizeWithConnection = async (params: {
  redirectUri: string;
  connection: SocialConnection;
}): Promise<AuthResult> => {
  const request = new AuthSession.AuthRequest(
    buildAuthRequestConfig(params.redirectUri, params.connection),
  );

  const result = await request.promptAsync(auth0Discovery);

  if (result.type === 'cancel' || result.type === 'dismiss') {
    throw new AuthCancelledError();
  }

  if (result.type === 'error') {
    throw new Error(
      result.error?.message ??
        result.params?.error_description ??
        'Social sign-in failed',
    );
  }

  if (result.type !== 'success' || !result.params.code) {
    throw new Error('Social sign-in did not complete.');
  }

  if (!request.codeVerifier) {
    throw new Error('Missing PKCE code verifier.');
  }

  return exchangeAuthorizationCode({
    code: result.params.code,
    codeVerifier: request.codeVerifier,
    redirectUri: params.redirectUri,
  });
};

export class AuthCancelledError extends Error {
  constructor() {
    super('Authentication cancelled');
    this.name = 'AuthCancelledError';
  }
}

export const exchangeAuthorizationCode = async (params: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<AuthResult> => {
  const tokenResult = await AuthSession.exchangeCodeAsync(
    {
      clientId: auth0Config.clientId,
      code: params.code,
      redirectUri: params.redirectUri,
      extraParams: {
        code_verifier: params.codeVerifier,
      },
    },
    auth0Discovery,
  );

  const tokens = toStoredTokens(tokenResult, 'social');
  return {
    tokens,
    user: decodeUserFromIdToken(tokens.idToken),
  };
};

export const loginWithPassword = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  try {
    const payload = await apiFetch<PasswordTokenPayload>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    return tokensFromPasswordPayload(payload);
  } catch (err) {
    throw new Error(messageFromApiError(err, 'Login failed'));
  }
};

export const registerWithPassword = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  try {
    const payload = await apiFetch<PasswordTokenPayload>('/auth/register', {
      method: 'POST',
      body: { email, password },
    });
    return tokensFromPasswordPayload(payload);
  } catch (err) {
    throw new Error(messageFromApiError(err, 'Could not create account'));
  }
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  } catch (err) {
    throw new Error(messageFromApiError(err, 'Could not send reset email'));
  }
};

/**
 * Refreshes the access token.
 * - Social sessions: Auth0 refresh grant with the Native client ID
 * - Password sessions: Bloc API → confidential client (same client that issued them)
 */
export const refreshAccessToken = async (
  refreshToken: string,
  authMethod: AuthMethod = 'social',
): Promise<AuthResult> => {
  if (authMethod === 'password') {
    try {
      const payload = await apiFetch<PasswordTokenPayload>('/auth/refresh', {
        method: 'POST',
        body: { refreshToken },
      });
      const result = tokensFromPasswordPayload(payload);
      // Auth0 may omit refresh_token when rotation is off — keep the existing one.
      return {
        ...result,
        tokens: {
          ...result.tokens,
          refreshToken: result.tokens.refreshToken ?? refreshToken,
        },
      };
    } catch (err) {
      throw new Error(messageFromApiError(err, 'Session expired'));
    }
  }

  const tokenResult = await AuthSession.refreshAsync(
    {
      clientId: auth0Config.clientId,
      refreshToken,
      extraParams: {
        audience: auth0Config.audience,
      },
    },
    auth0Discovery,
  );

  const tokens = toStoredTokens(tokenResult, 'social');
  return {
    tokens: {
      ...tokens,
      refreshToken: tokens.refreshToken ?? refreshToken,
    },
    user: decodeUserFromIdToken(tokens.idToken),
  };
};

/**
 * Best-effort revoke. Networking is wrapped so logout always succeeds locally.
 * - Password sessions: revoke via Bloc API (confidential client that issued them)
 * - Social sessions: revoke against Auth0 with the Native client ID
 */
export const revokeRefreshToken = async (
  refreshToken: string,
  authMethod: AuthMethod = 'social',
): Promise<void> => {
  try {
    if (authMethod === 'password') {
      await apiFetch('/auth/revoke', {
        method: 'POST',
        body: { refreshToken },
      });
      return;
    }

    await AuthSession.revokeAsync(
      {
        clientId: auth0Config.clientId,
        token: refreshToken,
      },
      { revocationEndpoint: auth0Discovery.revocationEndpoint },
    );
  } catch {
    // Network errors during logout shouldn't block the user.
  }
};

export const buildLogoutUrl = (returnTo: string): string => {
  const params = new URLSearchParams({
    client_id: auth0Config.clientId,
    returnTo,
  });
  return `${auth0Endpoints.endSession}?${params.toString()}`;
};

export const decodeAccessToken = <T = Record<string, unknown>>(
  accessToken: string,
): T | null => {
  try {
    return jwtDecode<T>(accessToken);
  } catch {
    return null;
  }
};

export { decodeUserFromIdToken };
