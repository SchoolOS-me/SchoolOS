export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_MODE_KEY = "kcs_theme_mode";

const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];

export function isThemeMode(value: string | null): value is ThemeMode {
  return !!value && THEME_MODES.includes(value as ThemeMode);
}

export function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode === "system" ? getSystemTheme() : mode;
}
