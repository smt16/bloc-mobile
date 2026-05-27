# Bloc Mobile

The digital identity, community, and progression layer for indoor climbing — built with Expo + React Native.

This app is the consumer wedge described in the [Bloc business plan](https://www.notion.so/Business-Plan-36a4b9830ba8805fb309d59051abff21): a climber identity, a session/route log, and a social feed that travels with you between gyms.

## Stack

- **Expo SDK 56** (React Native 0.85, React 19)
- **Expo Router** (file-based routing, typed routes)
- **TypeScript**, strict mode
- **Auth0** via `expo-auth-session` (Authorization Code + PKCE)
- **expo-secure-store** for tokens (Keychain / Keystore)

## Getting started

```bash
cd bloc-mobile
npm install
npm run start      # Expo dev server
npm run ios        # iOS Simulator
npm run android    # Android Emulator
```

## Auth0 setup

This app authenticates with Auth0 using OAuth 2.0 Authorization Code Flow + PKCE — the modern recommended approach for mobile apps. Tokens (access, refresh, id) are stored in the device's secure enclave.

### 1. Configure your Auth0 Native Application

In the [Auth0 Dashboard](https://manage.auth0.com):

1. **Create a Native application** named "Bloc Mobile".
2. **Allowed Callback URLs** — add both:
   ```
   com.bloc://YOUR_DOMAIN/ios/com.bloc/callback
   com.bloc://YOUR_DOMAIN/android/com.bloc/callback
   ```
3. **Allowed Logout URLs**:
   ```
   com.bloc://logout
   ```
4. **Allowed Origins (CORS)** — for Expo dev:
   ```
   exp://127.0.0.1:19000
   ```
5. **Grant Types** → enable **Refresh Token** and **Refresh Token Rotation**.

### 2. Create the Bloc API

Auth0 Dashboard → **APIs → Create API**:

| Setting           | Value                  |
| ----------------- | ---------------------- |
| Name              | Bloc API               |
| Identifier        | `https://api.bloc.app` |
| Signing Algorithm | **RS256**              |

(Optional but recommended: enable **RBAC** + **Add Permissions in Access Token**.)

### 3. Fill in the placeholders

Open `src/config/auth.ts` and replace the placeholders:

```ts
export const auth0Config: Auth0Config = {
  domain: 'bloc-prod.us.auth0.com', // your tenant domain
  clientId: 'YOUR_AUTH0_CLIENT_ID', // Native App → Client ID
  audience: 'https://api.bloc.app', // matches the API Identifier above
  scopes: ['openid', 'profile', 'email', 'offline_access'],
};
```

> Alternatively, set them as runtime config via `app.json` → `expo.extra` (`domain`, `clientId`, `audience`) without touching code.

### 4. Verify the deep link scheme

The scheme `com.bloc` and bundle identifier `com.bloc.mobile` live in `app.json`. If you change either, update the Auth0 **Allowed Callback URLs** accordingly.

## Project layout

```
bloc-mobile/
├── app/                       # Expo Router routes (file-based)
│   ├── _layout.tsx            # Root layout · AuthProvider · GestureHandler
│   ├── index.tsx              # Auth-aware redirect entry
│   ├── (auth)/
│   │   ├── _layout.tsx        # Public stack (redirects authed users → /app)
│   │   └── login.tsx          # Auth0 Universal Login launcher
│   └── (app)/                 # Protected tabs (redirects guests → /login)
│       ├── _layout.tsx
│       ├── index.tsx          # Feed
│       ├── sessions.tsx       # Session log
│       └── profile.tsx        # Profile + sign out
├── src/
│   ├── api/client.ts          # Fetch wrapper that attaches the access token
│   ├── auth/
│   │   ├── AuthContext.tsx    # Hydration, login, logout, refresh
│   │   ├── authService.ts     # PKCE exchange, refresh, revoke
│   │   └── tokenStorage.ts    # expo-secure-store wrapper
│   ├── components/            # Button · Card · Screen · BrandMark
│   ├── config/auth.ts         # Auth0 config (placeholders → fill in)
│   └── theme/index.ts         # Colors · spacing · type
├── assets/                    # Icons, splash
├── app.json                   # Expo config (scheme, bundle, plugins)
└── package.json
```

## How auth works

| Step | What happens |
| ---- | ------------ |
| 1 | App mounts → `<AuthProvider>` hydrates tokens from secure storage. |
| 2 | If tokens are expired, we silently call Auth0 `/oauth/token` with the refresh token. |
| 3 | If no tokens (or hydration fails) → user is routed to `(auth)/login`. |
| 4 | "Continue with Auth0" launches the system browser (PKCE flow). |
| 5 | Auth0 redirects back via the `com.bloc://…/callback` deep link. |
| 6 | We exchange the code for tokens, persist them, decode the user, and route to `(app)`. |
| 7 | API calls go through `apiFetch(path, { getAccessToken })` which attaches `Authorization: Bearer …` and auto-refreshes. |

## Connecting to the Bloc NestJS backend

The companion `bloc-backend` should validate Auth0-issued RS256 JWTs via JWKS. See the NestJS sections of the Auth0 setup guide in the repository root for the strategy + guard implementation.

Once the backend is up, point `apiBaseUrl` at it via either:

```ts
// src/api/client.ts
export const API_BASE_URL = 'https://api.bloc.app';
```

or override at runtime with `app.json` → `expo.extra.apiBaseUrl`.

## Roadmap (from the business plan)

- Universal climber profile
- QR / NFC route logging
- Tribe feed + reactions
- Group + gym communities
- Progression timeline
- AI beta assistant
