import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Admin panel is dark-first. Default to dark unless user explicitly set light.
  const [theme, setTheme] = useState(
    () => localStorage.getItem("agronest-theme") || "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme",      theme); // admin CSS: [data-theme]
    root.setAttribute("data-site-theme", theme); // site CSS: [data-site-theme]
    localStorage.setItem("agronest-theme", theme);
  }, [theme]);

  /**
   * Toggle dark ↔ light and persist the choice to MongoDB settings.
   * The API call is fire-and-forget — the UI never waits for it.
   */
  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";

      // Persist to MongoDB (settings collection › siteTheme field)
      API.put("/settings", { siteTheme: next }).catch(() => {
        // Silently ignore network errors — theme still works locally
      });

      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
