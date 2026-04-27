"use client";

import { useLayoutEffect, useState } from "react";
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

function getInitialTheme(): Theme {
     const saved = localStorage.getItem("theme");
     if (saved === "dark" || saved === "light") return saved;
     return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
     const t = useTranslations("common");
     const [theme, setTheme] = useState<Theme>(() => {
          if (typeof window === "undefined") return "light";
          try {
               return getInitialTheme();
          } catch {
               return "light";
          }
     });

     useLayoutEffect(() => {
          applyTheme(theme);
     }, [theme]);

     return (
          <Button
               variant="outline"
               size="icon-xs"
               className="sm:size-7"
               onClick={() => {
                    const nextTheme = theme === "dark" ? "light" : "dark";
                    applyTheme(nextTheme);
                    setTheme(nextTheme);
               }}
               aria-label={t("toggleTheme")}
          >
               {theme === "dark" ? (
                    <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
               ) : (
                    <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
               )}
               <span className="sr-only">{t("toggleTheme")}</span>
          </Button>
     );
}
