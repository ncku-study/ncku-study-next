export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api/v2${path.startsWith("/") ? path : `/${path}`}`, options);

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  return (await res.json()) as T;
}
