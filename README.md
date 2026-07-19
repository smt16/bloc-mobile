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

Bloc uses Auth0 with two client apps:

1. **Native** — Google / Apple Sign In (Authorization Code + PKCE)
2. **Regular Web (confidential)** — email/password proxied by `bloc-backend`

Tokens (access, refresh, id) are stored in the device's secure enclave.

### 1. Configure your Auth0 Native Application (social)

In the [Auth0 Dashboard](https://manage.auth0.com):

1. **Create a Native application** named "Bloc Mobile".
2. **Allowed Callback URLs** — prefer HTTPS Universal Links / App Links (skips Auth0’s “Authorize App” confirmation). Keep the custom scheme as a fallback for Expo Go:

   ```
   https://YOUR_DOMAIN/ios/com.bloc.mobile/callback,
   https://YOUR_DOMAIN/android/com.bloc.mobile/callback,
   com.bloc://YOUR_DOMAIN/ios/com.bloc/callback,
   com.bloc://YOUR_DOMAIN/android/com.bloc/callback
   ```

3. **Allowed Logout URLs**:

   ```
   https://YOUR_DOMAIN/ios/com.bloc.mobile/callback,
   https://YOUR_DOMAIN/android/com.bloc.mobile/callback,
   com.bloc://logout
   ```

4. **Device Settings** (required before HTTPS callbacks work — without this, Auth0
   serves an empty association file and login ends on a **“Not found.”** page):
   - **Applications → Bloc Mobile → Settings → Advanced → Device Settings**
   - **iOS**: Team ID (Apple Developer) + App ID / Bundle Identifier `com.bloc.mobile`
   - **Android**: Package Name `com.bloc.mobile` + SHA256 cert fingerprint(s)  
     (`keytool -list -v -keystore …` → SHA256)
   - Verify the association file is **no longer empty**:
     `https://YOUR_DOMAIN/.well-known/apple-app-site-association`  
     should list `TEAMID.com.bloc.mobile` under `applinks.details`.
   - Then set `expo.extra.useHttpsCallbacks` to `true`, rebuild the native app
     (`npx expo prebuild` / EAS — **not Expo Go**), and reinstall.

5. **Until HTTPS is verified**, keep `useHttpsCallbacks: false` (custom scheme
   `com.bloc://…`). To skip the Auth0 “Authorize App” confirmation with the
   custom scheme, enable on the Native app:

   ```bash
   auth0 api patch clients/YOUR_NATIVE_CLIENT_ID --data '{
     "skip_non_verifiable_callback_uri_confirmation_prompt": true
   }'
   ```

   Or Auth0 Dashboard → Application → Advanced → OAuth → skip non-verifiable
   callback confirmation (wording varies by tenant).

6. **Allowed Origins (CORS)** — for Expo web/dev:
   ```
   exp://127.0.0.1:19000
   ```
7. **Grant Types** → enable **Authorization Code**, **Refresh Token**, and **Refresh Token Rotation**.
8. **Connections** → enable **Google** and **Apple** (Apple is used on iOS only in the app).
9. **APIs** → Bloc API → enable **Allow Skipping User Consent** (first-party).

> **Rebuild required for HTTPS:** `ios.associatedDomains` / Android `intentFilters`
> only apply in a custom development or EAS build — **not Expo Go**.

### 2. Configure email/password (backend proxy)

1. Ensure a **Database** connection exists (default name: `Username-Password-Authentication`).
2. Create a **Regular Web Application** named "Bloc API Auth" (confidential — has a client secret).
3. On that app: **Grant Types** → enable **Password** (Resource Owner Password Grant).
4. On the Auth0 tenant: **Settings → API Authorization Settings** (or the Database connection) — allow the Password grant / set default directory if prompted.
5. Put the confidential app’s Client ID + Secret on the backend:

```bash
# bloc-backend/.env
AUTH0_CLIENT_ID=...      # Regular Web App
AUTH0_CLIENT_SECRET=...
AUTH0_DB_CONNECTION=Username-Password-Authentication
```

The mobile app never sees this secret — it calls `POST /api/auth/login` and `POST /api/auth/register`.

### 3. Create the Bloc API

Auth0 Dashboard → **APIs → Create API**:

| Setting           | Value                  |
| ----------------- | ---------------------- |
| Name              | Bloc API               |
| Identifier        | `https://api.bloc.app` |
| Signing Algorithm | **RS256**              |

(Optional but recommended: enable **RBAC** + **Add Permissions in Access Token**.)

### 4. Fill in the mobile placeholders

Open `src/config/auth.ts` and replace the placeholders with the **Native** app values:

```ts
export const auth0Config: Auth0Config = {
  domain: 'bloc-prod.us.auth0.com', // your tenant domain
  clientId: 'YOUR_AUTH0_CLIENT_ID', // Native App → Client ID
  audience: 'https://api.bloc.app', // matches the API Identifier above
  scopes: ['openid', 'profile', 'email', 'offline_access'],
};
```

> Alternatively, set them as runtime config via `app.json` → `expo.extra` (`domain`, `clientId`, `audience`) without touching code.

### 5. Verify deep links / Universal Links

- Custom scheme: `com.bloc` (fallback)
- Bundle / package: `com.bloc.mobile`
- HTTPS callbacks use Auth0’s domain + associated domains (see §1)

If you change the Auth0 domain, update `ios.associatedDomains`, Android
`intentFilters.host`, and `expo.extra.domain` in `app.json` to match.

## Project layout

```
bloc-mobile/
├── app/                       # Expo Router routes (file-based)
│   ├── _layout.tsx            # Root layout · AuthProvider · GestureHandler
│   ├── index.tsx              # Auth-aware redirect entry
│   ├── (auth)/
│   │   ├── _layout.tsx        # Public stack (redirects authed users → /app)
│   │   ├── login.tsx          # Email/password + Google / Apple
│   │   └── signup.tsx         # Register + social
│   └── (app)/                 # Protected tabs (redirects guests → /login)
│       ├── _layout.tsx
│       ├── index.tsx          # Feed
│       ├── sessions.tsx       # Session log
│       └── profile.tsx        # Profile + sign out
├── src/
│   ├── api/client.ts          # Fetch wrapper that attaches the access token
│   ├── auth/
│   │   ├── AuthContext.tsx    # Hydration, login methods, logout, refresh
│   │   ├── authService.ts     # PKCE social + password API + refresh
│   │   └── tokenStorage.ts    # expo-secure-store wrapper
│   ├── components/            # Button · TextField · SocialAuthButtons · …
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
| 4a | **Email/password** → `POST /api/auth/login` (backend proxies Auth0 password-realm) → tokens saved. |
| 4b | **Google / Apple** → system browser with `connection=google-oauth2` or `connection=apple` (PKCE). |
| 5 | Social: Auth0 redirects back via the `com.bloc://…/callback` deep link; we exchange the code for tokens. |
| 6 | Tokens are persisted, user is decoded from the id token, and we route to `(app)`. |
| 7 | API calls go through `apiFetch(path, { getAccessToken })` which attaches `Authorization: Bearer …` and auto-refreshes. |

## Connecting to the Bloc NestJS backend

The companion `bloc-backend` validates Auth0-issued RS256 JWTs via JWKS, and proxies email/password login when `AUTH0_CLIENT_ID` / `AUTH0_CLIENT_SECRET` are set.

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
