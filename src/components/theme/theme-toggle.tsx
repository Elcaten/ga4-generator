import { Moon, Sun, SunMoon } from "lucide-react";

import { Theme, useTheme } from "@/components/theme/theme-provider";
import clsx from "clsx";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <ToggleGroup
      type="single"
      onValueChange={(newTheme: Theme | "") => {
        if (!newTheme) {
          return;
        }
        setTheme(newTheme);
      }}
    >
      <ToggleGroupItem value={"light" satisfies Theme}>
        <Sun
          className={clsx(
            "transition-all duration-700",
            theme === "light" ? "text-blue-500" : "text-primary"
          )}
        />
      </ToggleGroupItem>
      <ToggleGroupItem value={"dark" satisfies Theme}>
        <Moon
          className={clsx(
            "transition-all duration-700",
            theme === "dark" ? "text-blue-500" : "text-primary"
          )}
        />
      </ToggleGroupItem>
      <ToggleGroupItem value={"system" satisfies Theme}>
        <SunMoon
          className={clsx(
            "transition-all duration-700",
            theme === "system" ? "text-blue-500" : "text-primary"
          )}
        />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
