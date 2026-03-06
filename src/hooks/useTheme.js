import { useState, useEffect } from "react";

const STORAGE_KEY = "drewbs-theme";

const isBrowser = typeof document !== "undefined";

export function useTheme() {
  const [theme, setThemeState] = useState(
    () => (isBrowser ? document.documentElement.getAttribute("data-theme") || "light" : "light")
  );

  useEffect(() => {
    const handler = () => {
      setThemeState(
        document.documentElement.getAttribute("data-theme") || "light"
      );
    };
    window.addEventListener("theme-change", handler);
    return () => window.removeEventListener("theme-change", handler);
  }, []);

  const setTheme = (newTheme) => {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    setThemeState(newTheme);
    window.dispatchEvent(new Event("theme-change"));
  };

  const toggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return { theme, setTheme, toggle };
}
