import { apiFetch } from "./client";
import { authStorage } from "./storage";
import type { AuthUser } from "./storage";

type LoginResponse = {
  access: string;
  refresh: string;
  user: AuthUser;
};

export async function login(identifier: string, password: string): Promise<AuthUser> {
  const data = await apiFetch<LoginResponse>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
    skipAuth: true,
  });

  authStorage.setTokens(data.access, data.refresh);
  authStorage.setUser(data.user);
  return data.user;
}

export async function logout(): Promise<void> {
  const refresh = authStorage.getRefreshToken();
  if (refresh) {
    await apiFetch("/auth/logout/", {
      method: "POST",
      body: JSON.stringify({ refresh }),
    });
  }
  authStorage.clearAll();
}

export async function fetchMe(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me/");
}
