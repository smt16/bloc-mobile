/**
 * Thin fetch wrapper that attaches the Auth0 access token to API requests.
 *
 * Designed to be called by feature-specific hooks (e.g. `useFeed`) or React
 * Query loaders. Pass a `getAccessToken` resolver — typically the one returned
 * from the AuthContext — so we can transparently refresh expired tokens.
 */
import Constants from 'expo-constants';

type ApiExtras = { apiBaseUrl?: string };
const extra = (Constants.expoConfig?.extra as ApiExtras | undefined) ?? {};

export const API_BASE_URL = extra.apiBaseUrl ?? 'https://api.bloc.app';

export type RequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown;
  headers?: Record<string, string>;
  getAccessToken?: () => Promise<string | null>;
};

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export const apiFetch = async <TResponse = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> => {
  const { body, headers = {}, getAccessToken, ...rest } = options;

  const accessToken = getAccessToken ? await getAccessToken() : null;

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };
  if (body !== undefined) {
    finalHeaders['Content-Type'] = finalHeaders['Content-Type'] ?? 'application/json';
  }
  if (accessToken) {
    finalHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const parsedBody =
    response.status === 204
      ? null
      : contentType.includes('application/json')
        ? await response.json().catch(() => null)
        : await response.text().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      `API request failed: ${response.status} ${response.statusText}`,
      response.status,
      parsedBody,
    );
  }

  return parsedBody as TResponse;
};
