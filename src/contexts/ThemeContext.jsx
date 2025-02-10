import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dashboard-theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    // Apply theme to dashboard layout
    const dashboardElement = document.getElementById("dashboard-layout");
    if (dashboardElement) {
      dashboardElement.classList.remove("light", "dark");
      dashboardElement.classList.add(theme);
    }

    // Apply theme to portal root for dialogs
    const portalRoot = document.getElementById("portal-root");
    if (!portalRoot) {
      const div = document.createElement("div");
      div.id = "portal-root";
      document.body.appendChild(div);
    }
    document.getElementById("portal-root").className = theme;

    localStorage.setItem("dashboard-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
