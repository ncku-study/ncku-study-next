type ApiFetchOptions = RequestInit & { noStore?: boolean };

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { noStore = false, ...requestOptions } = options;
  const method = (requestOptions.method ?? 'GET').toUpperCase();
  const isReadRequest = method === 'GET' || method === 'HEAD';
  const shouldNoStore = noStore || !isReadRequest;
  const headers = new Headers(requestOptions.headers);

  if (shouldNoStore) headers.set('x-api-cache', 'no-store');

  const res = await fetch(`/api/v2${path.startsWith("/") ? path : `/${path}`}`, {
    ...requestOptions,
    headers,
    cache: shouldNoStore ? 'no-store' : 'default',
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  return (await res.json()) as T;
}

export function adminApiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return apiFetch<T>(`/admin${normalizedPath}`, { ...options, noStore: true });
}
