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

type Auth0Config = {
  domain: string;
  clientId: string;
  audience: string;
  scopes: string[];
};

const extra =
  (Constants.expoConfig?.extra as Partial<Auth0Config> | undefined) ?? {};

export const auth0Config: Auth0Config = {
  domain: extra.domain ?? 'gym-extension.jp.auth0.com',
  clientId: extra.clientId ?? 'rbOqPyztMJ0KmnyHYemIkNG8tlMv3uTb',
  audience: extra.audience ?? 'https://api.bloc.app',
  scopes: extra.scopes ?? ['openid', 'profile', 'email', 'offline_access'],
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
 * Bundle / native package identifier used to build Auth0 callback URLs in
 * the react-native-auth0 style:
 *   {scheme}://{auth0Domain}/{ios|android}/{bundleId}/callback
 *
 * Must match `ios.bundleIdentifier` / `android.package` in app.json (the
 * domain part is interchangeable for Expo AuthSession as long as the scheme
 * + Allowed Callback URL match).
 */
export const nativeBundleId = 'com.bloc';
