import { API_BASE_URL, DISABLE_AUTH_HEADER } from "../config/env";
import { authStorage } from "./storage";

type RequestOptions = RequestInit & {
  skipAuth?: boolean;
};

let csrfSetupPromise: Promise<void> | null = null;
let tokenRefreshPromise: Promise<string | null> | null = null;

function extractErrorMessage(value: unknown): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const nested = extractErrorMessage(item);
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if ("detail" in (value as Record<string, unknown>)) {
      return extractErrorMessage((value as Record<string, unknown>).detail);
    }
    if ("message" in (value as Record<string, unknown>)) {
      return extractErrorMessage((value as Record<string, unknown>).message);
    }
    for (const [key, nestedValue] of entries) {
      const nested = extractErrorMessage(nestedValue);
      if (nested) {
        return key === "non_field_errors" ? nested : `${key}: ${nested}`;
      }
    }
  }

  return null;
}

function getCookie(name: string): string | null {
  const cookieStr = document.cookie || "";
  const cookies = cookieStr.split(";");
  for (const entry of cookies) {
    const [rawKey, ...rest] = entry.trim().split("=");
    if (rawKey === name) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return null;
}

function isUnsafeMethod(method?: string): boolean {
  const normalized = (method || "GET").toUpperCase();
  return !["GET", "HEAD", "OPTIONS", "TRACE"].includes(normalized);
}

async function ensureCsrfCookie(): Promise<void> {
  if (getCookie("csrftoken")) {
    return;
  }

  if (!csrfSetupPromise) {
    csrfSetupPromise = fetch(`${API_BASE_URL}/auth/csrf/`, {
      method: "GET",
      credentials: "include",
    })
      .then(() => undefined)
      .finally(() => {
        csrfSetupPromise = null;
      });
  }

  await csrfSetupPromise;
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = authStorage.getRefreshToken();
  if (!refresh) {
    return null;
  }

  if (!tokenRefreshPromise) {
    tokenRefreshPromise = fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ refresh }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Token refresh failed");
        }

        const data = (await response.json()) as {
          access?: string;
          refresh?: string;
        };

        if (!data.access) {
          throw new Error("Token refresh failed");
        }

        authStorage.setTokens(data.access, data.refresh || refresh);
        return data.access;
      })
      .catch(() => {
        authStorage.clearAll();
        return null;
      })
      .finally(() => {
        tokenRefreshPromise = null;
      });
  }

  return tokenRefreshPromise;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  if (isUnsafeMethod(options.method)) {
    await ensureCsrfCookie();
  }

  const headers = new Headers(options.headers || {});
  const isFormDataBody = typeof FormData !== "undefined" && options.body instanceof FormData;

  if (!headers.has("Content-Type") && options.body && !isFormDataBody) {
    headers.set("Content-Type", "application/json");
  }

  const shouldSkipAuth = options.skipAuth || DISABLE_AUTH_HEADER;
  if (!shouldSkipAuth) {
    const token = authStorage.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (isUnsafeMethod(options.method)) {
    const csrfToken = getCookie("csrftoken");
    if (csrfToken && !headers.has("X-CSRFToken")) {
      headers.set("X-CSRFToken", csrfToken);
    }
  }

  const requestInit: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  let response = await fetch(`${API_BASE_URL}${path}`, requestInit);

  const isAuthRoute =
    path.startsWith("/auth/login/") ||
    path.startsWith("/auth/token/") ||
    path.startsWith("/auth/token/refresh/");
  if (response.status === 401 && !shouldSkipAuth && !isAuthRoute) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      headers.set("Authorization", `Bearer ${newAccessToken}`);
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...requestInit,
        headers,
      });
    }
  }

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const err = await response.json();
      message = extractErrorMessage(err) || message;
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
