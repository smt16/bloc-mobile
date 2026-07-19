/**
 * Auth0 configuration.
 *
 * Fill these in with the values from your Auth0 Native Application + API.
 * Auth0 Dashboard → Applications → Bloc Mobile → Settings.
 *
 * Domain example:    "bloc-prod.us.auth0.com"
 * Client ID example: "abc123xyz..."
 * Audience example:  "https://api.bloc.app"  (matches the API Identifier you created)
 *
 * These can also be overridden at runtime via Expo `extra` in app.json or env.
 */
import Constants from 'expo-constants';
import { Platform } from 'react-native';

type Auth0Config = {
  domain: string;
  clientId: string;
  audience: string;
  scopes: string[];
  /**
   * Prefer HTTPS Universal Links / App Links callbacks (skips Auth0's
   * non-verifiable custom-scheme confirmation prompt). Requires a custom
   * dev/production build with associated domains configured — not Expo Go.
   */
  useHttpsCallbacks: boolean;
};

type AuthExtras = Partial<Auth0Config>;

const extra =
  (Constants.expoConfig?.extra as AuthExtras | undefined) ?? {};

export const auth0Config: Auth0Config = {
  domain: extra.domain ?? 'gym-extension.jp.auth0.com',
  clientId: extra.clientId ?? 'rbOqPyztMJ0KmnyHYemIkNG8tlMv3uTb',
  audience: extra.audience ?? 'https://api.bloc.app',
  scopes: extra.scopes ?? ['openid', 'profile', 'email', 'offline_access'],
  // HTTPS Universal Links only work after Auth0 Device Settings populate
  // apple-app-site-association (Team ID + Bundle ID). Until then, use the
  // custom scheme and enable skip_non_verifiable_callback_uri_confirmation_prompt
  // on the Native app to avoid the Auth0 “Authorize App” screen.
  useHttpsCallbacks: extra.useHttpsCallbacks ?? false,
};

export const isAuth0Configured = (): boolean =>
  auth0Config.domain !== 'YOUR_AUTH0_DOMAIN' &&
  auth0Config.clientId !== 'YOUR_AUTH0_CLIENT_ID';

export const auth0Endpoints = {
  authorization: `https://${auth0Config.domain}/authorize`,
  token: `https://${auth0Config.domain}/oauth/token`,
  revocation: `https://${auth0Config.domain}/oauth/revoke`,
  userInfo: `https://${auth0Config.domain}/userinfo`,
  endSession: `https://${auth0Config.domain}/v2/logout`,
};

export const auth0Discovery = {
  authorizationEndpoint: auth0Endpoints.authorization,
  tokenEndpoint: auth0Endpoints.token,
  revocationEndpoint: auth0Endpoints.revocation,
};

/**
 * Custom URL scheme (non-verifiable). Kept as a fallback for Expo Go / when
 * HTTPS associated domains are not available.
 */
export const nativeScheme = 'com.bloc';

/**
 * Real iOS bundle ID / Android package — must match app.json and the values
 * registered under Auth0 Application → Advanced → Device Settings.
 */
export const appBundleId = 'com.bloc.mobile';

/** @deprecated Use `nativeScheme` — kept for older call sites. */
export const nativeBundleId = nativeScheme;

/**
 * Auth0 HTTPS callback for Universal Links / App Links:
 *   https://{domain}/ios/{bundleId}/callback
 *   https://{domain}/android/{packageName}/callback
 */
export const buildHttpsCallbackUri = (
  platform: 'ios' | 'android' | 'web' = Platform.OS === 'ios'
    ? 'ios'
    : Platform.OS === 'android'
      ? 'android'
      : 'web',
): string =>
  `https://${auth0Config.domain}/${platform}/${appBundleId}/callback`;

/**
 * Legacy custom-scheme callback (triggers Auth0 confirmation prompt on
 * modern tenants unless skip_non_verifiable_callback_uri_confirmation_prompt).
 */
export const buildCustomSchemeCallbackUri = (
  platform: 'ios' | 'android' = Platform.OS === 'ios' ? 'ios' : 'android',
): string =>
  `${nativeScheme}://${auth0Config.domain}/${platform}/${nativeScheme}/callback`;
