import { API_BASE_URL, DISABLE_AUTH_HEADER } from "../config/env";
import { authStorage } from "./storage";

type RequestOptions = RequestInit & {
  skipAuth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const shouldSkipAuth = options.skipAuth || DISABLE_AUTH_HEADER;
  if (!shouldSkipAuth) {
    const token = authStorage.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const err = await response.json();
      message = err.detail || err.message || message;
    } catch {
      // ignore json parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}
