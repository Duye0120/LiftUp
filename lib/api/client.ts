export type ApiRequestInit = {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  token?: string | null;
  body?: Record<string, unknown> | FormData;
  signal?: AbortSignal;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com';

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export async function apiClient<TResponse>(options: ApiRequestInit): Promise<TResponse> {
  const { path, method = 'GET', body, token, signal } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body;
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(body);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: requestBody,
    signal,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    throw new ApiError('请求失败', response.status, payload);
  }

  return payload as TResponse;
}
