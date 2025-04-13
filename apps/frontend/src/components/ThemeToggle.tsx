import React from "react";
import { Sun, Moon } from "lucide-react";
import { Theme, useAuth } from "../context/AuthContext";

export const getTheme = (theme: Theme): "dark" | "light" => {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return theme;
};

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, getUserSettings } = useAuth();

  React.useEffect(() => {
    const getUserTheme = async () => {
      const userSettings = await getUserSettings();

      if (
        userSettings.data.success &&
        !(localStorage.getItem("theme") as "light" | "dark")
      ) {
        setTheme(getTheme(userSettings.data.data.theme));
      }
    };
    getUserTheme();
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      className="btn btn-ghost btn-circle mr-2"
      onClick={() => setTheme(getTheme(theme === "dark" ? "light" : "dark"))}
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
};
