import { useEffect, useMemo, useState, type ReactNode } from "react";
import { authStorage } from "../api/storage";
import { ThemeContext } from "./ThemeContext";
import { THEME_MODE_KEY, getSystemTheme, isThemeMode, type ThemeMode } from "./theme";

function getInitialThemeMode(): ThemeMode {
  const persisted = localStorage.getItem(THEME_MODE_KEY);
  if (isThemeMode(persisted)) {
    return persisted;
  }
  const schoolTheme = authStorage.getUser()?.school_theme_mode;
  return isThemeMode(schoolTheme || null) ? schoolTheme : "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => getInitialThemeMode());
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  const resolvedTheme = mode === "system" ? systemTheme : mode;

  const setMode = (nextMode: ThemeMode) => {
    if (nextMode === "system") {
      setSystemTheme(getSystemTheme());
    }
    setModeState(nextMode);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme-mode", mode);
    root.setAttribute("data-theme", resolvedTheme);
    localStorage.setItem(THEME_MODE_KEY, mode);
  }, [mode, resolvedTheme]);

  useEffect(() => {
    if (mode !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setSystemTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", updateTheme);
    return () => media.removeEventListener("change", updateTheme);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setMode,
    }),
    [mode, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
