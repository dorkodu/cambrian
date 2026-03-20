import { Button } from "@/components/ui/button";
import { applyTheme, useThemeStore } from "@/stores/theme";
import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect } from "react";

const themes = [
  { value: "light", icon: IconSun, label: "Light" },
  { value: "dark", icon: IconMoon, label: "Dark" },
  { value: "system", icon: IconDeviceDesktop, label: "System" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(theme);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Cycle through themes: light -> dark -> system -> light
  const cycleTheme = () => {
    const currentIndex = themes.findIndex((t) => t.value === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].value);
  };

  const currentTheme = themes.find((t) => t.value === theme) ?? themes[2];
  const Icon = currentTheme.icon;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="h-9 w-9"
      aria-label={`Current theme: ${currentTheme.label}. Click to change.`}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
