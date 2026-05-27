/**
 * Auth0 authentication service using OAuth 2.0 Authorization Code Flow with PKCE.
 *
 * - Uses expo-auth-session (Universal Login in a system browser)
 * - Persists tokens in expo-secure-store via tokenStorage
 * - Supports silent refresh via the Auth0 refresh token grant
 *
 * Reference: https://docs.expo.dev/versions/latest/sdk/auth-session/
 */
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { jwtDecode } from 'jwt-decode';
import { Platform } from 'react-native';

import {
  auth0Config,
  auth0Discovery,
  auth0Endpoints,
  nativeBundleId,
} from '../config/auth';
import type { StoredTokens } from './tokenStorage';

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

/**
 * Builds the redirect URI that we register with Auth0.
 *
 * The format mirrors the react-native-auth0 SDK so the same Allowed Callback
 * URLs work in both worlds:
 *   com.bloc://{auth0Domain}/{ios|android|web}/{bundleId}/callback
 */
export const buildRedirectUri = (): string => {
  if (Platform.OS === 'web') {
    return AuthSession.makeRedirectUri({ path: 'callback' });
  }
  const platformSegment = Platform.OS === 'ios' ? 'ios' : 'android';
  return `${nativeBundleId}://${auth0Config.domain}/${platformSegment}/${nativeBundleId}/callback`;
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
  };
};

/**
 * Kicks off Universal Login, returns tokens + decoded user on success.
 *
 * Must be called from inside a component because expo-auth-session needs to
 * coordinate with the system browser. Prefer the `useAuth0Login` hook in
 * AuthContext for the ergonomic React API.
 */
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

  const tokens = toStoredTokens(tokenResult);
  return {
    tokens,
    user: decodeUserFromIdToken(tokens.idToken),
  };
};

/**
 * Refreshes the access token using the stored refresh token.
 * Throws on failure so callers can decide whether to force a logout.
 */
export const refreshAccessToken = async (
  refreshToken: string,
): Promise<AuthResult> => {
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

  const tokens = toStoredTokens(tokenResult);
  return {
    tokens: {
      ...tokens,
      refreshToken: tokens.refreshToken ?? refreshToken,
    },
    user: decodeUserFromIdToken(tokens.idToken),
  };
};

/**
 * Best-effort revoke + Auth0 session termination URL.
 * Networking is wrapped in try/catch so logout always succeeds locally.
 */
export const revokeRefreshToken = async (refreshToken: string): Promise<void> => {
  try {
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

/**
 * Helper for AuthContext: returns a fully-configured AuthRequestConfig.
 */
export const buildAuthRequestConfig = (
  redirectUri: string,
): AuthSession.AuthRequestConfig => ({
  clientId: auth0Config.clientId,
  scopes: auth0Config.scopes,
  redirectUri,
  responseType: AuthSession.ResponseType.Code,
  usePKCE: true,
  extraParams: {
    audience: auth0Config.audience,
    prompt: 'login',
  },
});

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
