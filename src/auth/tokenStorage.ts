/**
 * Secure persistence for OAuth tokens.
 *
 * Uses expo-secure-store on native (Keychain / Keystore) and falls back to a
 * memory-only store on web so that we never accidentally write tokens to
 * AsyncStorage / localStorage.
 */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEYS = {
  accessToken: 'bloc.access_token',
  refreshToken: 'bloc.refresh_token',
  idToken: 'bloc.id_token',
  expiresAt: 'bloc.expires_at',
  authMethod: 'bloc.auth_method',
} as const;

/** How the session was established — drives which refresh path we use. */
export type AuthMethod = 'password' | 'social';

export type StoredTokens = {
  accessToken: string;
  refreshToken: string | null;
  idToken: string | null;
  expiresAt: number | null;
  /** Defaults to `social` for sessions created before this field existed. */
  authMethod: AuthMethod;
};

type Key = (typeof KEYS)[keyof typeof KEYS];

const memoryStore = new Map<Key, string>();

const setItem = async (key: Key, value: string | null): Promise<void> => {
  if (value === null || value === undefined) {
    await deleteItem(key);
    return;
  }
  if (Platform.OS === 'web') {
    memoryStore.set(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

const getItem = async (key: Key): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return memoryStore.get(key) ?? null;
  }
  return SecureStore.getItemAsync(key);
};

const deleteItem = async (key: Key): Promise<void> => {
  if (Platform.OS === 'web') {
    memoryStore.delete(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
};

export const tokenStorage = {
  async save(tokens: StoredTokens): Promise<void> {
    await Promise.all([
      setItem(KEYS.accessToken, tokens.accessToken),
      setItem(KEYS.refreshToken, tokens.refreshToken),
      setItem(KEYS.idToken, tokens.idToken),
      setItem(
        KEYS.expiresAt,
        tokens.expiresAt !== null ? String(tokens.expiresAt) : null,
      ),
      setItem(KEYS.authMethod, tokens.authMethod),
    ]);
  },

  async load(): Promise<StoredTokens | null> {
    const [accessToken, refreshToken, idToken, expiresAtRaw, authMethodRaw] =
      await Promise.all([
        getItem(KEYS.accessToken),
        getItem(KEYS.refreshToken),
        getItem(KEYS.idToken),
        getItem(KEYS.expiresAt),
        getItem(KEYS.authMethod),
      ]);

    if (!accessToken) return null;

    const expiresAt = expiresAtRaw ? Number(expiresAtRaw) : null;
    const authMethod: AuthMethod =
      authMethodRaw === 'password' ? 'password' : 'social';

    return {
      accessToken,
      refreshToken,
      idToken,
      expiresAt: Number.isFinite(expiresAt as number) ? expiresAt : null,
      authMethod,
    };
  },

  async clear(): Promise<void> {
    await Promise.all(Object.values(KEYS).map((key) => deleteItem(key as Key)));
  },

  async getAccessToken(): Promise<string | null> {
    return getItem(KEYS.accessToken);
  },
};
