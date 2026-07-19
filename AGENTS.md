# Agent guidelines — bloc-mobile

This is an Expo SDK 56 + Expo Router + TypeScript app.

## Stack pinning

- Expo SDK **56** (React Native 0.85, React 19). Always read the versioned docs at https://docs.expo.dev/versions/v56.0.0/ before adding APIs.
- Add Expo-managed native packages with `npx expo install <pkg>` — never `npm install` alone — so version compat is enforced.

## Architecture

- **Routes** live in `app/` (Expo Router, file-based).
- **Shared code** lives in `src/` — keep features colocated under `src/<feature>/`.
- **Auth** is centralized in `src/auth/AuthContext.tsx`. Never access tokens outside of `AuthContext.getAccessToken()` or `tokenStorage`.
- **Theme tokens** live in `src/theme/`. Never hardcode colors / spacing in components.

## Auth

- Auth0 Universal Login via `expo-auth-session` with PKCE.
- Tokens are persisted in `expo-secure-store` via `src/auth/tokenStorage.ts`. Do NOT use AsyncStorage for tokens.
- Auth0 config placeholders live in `src/config/auth.ts` (overridable via `app.json` → `expo.extra`).

## Routing

- Auth gating is handled in `app/(auth)/_layout.tsx` and `app/(app)/_layout.tsx` — both consult `useAuth()` and `<Redirect>` accordingly. Don't re-implement auth gates per screen.

## Style

- Strict TypeScript. Avoid `any`; prefer narrow types or `unknown` + refinement.
- Functional components, hooks-first.
- **NativeWind (Tailwind)** is the default for layout and static styling via `className`. Brand accent is the generic `orange` scale (`orange-main`, `orange-50`…`orange-950`) in `src/theme/orange.js` + `tailwind.config.js`.
- Semantic surfaces (`bg-bg`, `text-text`, `bg-accent`) are CSS variables set by `ThemeProvider`, which follows the **device light/dark setting** by default.
- For StyleSheet / imperative colors, use `useTheme().colors` (or `useThemedStyles`) so light/dark updates apply. Do not bake static `colors` into module-level StyleSheets.
- Prefer token utilities over hardcoded hex values.
