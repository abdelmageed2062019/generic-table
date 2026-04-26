"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
     const root = document.documentElement;
     const isDark = theme === "dark";
     root.classList.toggle("dark", isDark);
     root.style.colorScheme = isDark ? "dark" : "light";
     localStorage.setItem("theme", theme);
}

export function ThemeToggle() {
     const t = useTranslations("common");
     const [theme, setTheme] = useState<Theme>(() => {
          if (typeof document === "undefined") return "light";
          return document.documentElement.classList.contains("dark") ? "dark" : "light";
     });

     return (
          <Button
               variant="outline"
               size="sm"
               className="gap-2"
               onClick={() => {
                    const nextTheme = theme === "dark" ? "light" : "dark";
                    applyTheme(nextTheme);
                    setTheme(nextTheme);
               }}
               aria-label={t("toggleTheme")}
          >
               {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
               ) : (
                    <Moon className="h-4 w-4" />
               )}
               <span className="sr-only">{t("toggleTheme")}</span>
          </Button>
     );
}
