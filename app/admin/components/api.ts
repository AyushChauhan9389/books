/**
 * API client helper for admin panel fetch calls.
 *
 * Provides a typed wrapper around `fetch` that handles JSON content type,
 * error parsing, and 204 (no content) responses.
 */

export class ApiError extends Error {
  status: number;
  field?: string;

  constructor(message: string, status: number, field?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.field = field;
  }
}

export async function adminFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new ApiError(body.error ?? "Request failed", res.status, body.field);
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}
