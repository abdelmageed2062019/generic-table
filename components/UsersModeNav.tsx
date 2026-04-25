"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function UsersModeNav({ className }: { className?: string }) {
     const pathname = usePathname();
     const t = useTranslations("users");

     const currentMode: "selection" | "expandable" = pathname?.includes("/users-expandable")
          ? "expandable"
          : "selection";

     const linkClassName =
          "text-muted-foreground inline-flex h-14 items-center justify-center border-b-2 border-transparent px-2 text-sm font-medium whitespace-nowrap transition-[color,border-color] hover:text-foreground aria-[current=page]:border-sky-400 aria-[current=page]:text-foreground";

     return (
          <nav className={cn("flex h-14 items-stretch gap-6", className)}>
               <Link
                    href="/users-selection"
                    aria-current={currentMode === "selection" ? "page" : undefined}
                    className={linkClassName}
               >
                    {t("modes.selectable")}
               </Link>
               <Link
                    href="/users-expandable"
                    aria-current={currentMode === "expandable" ? "page" : undefined}
                    className={linkClassName}
               >
                    {t("modes.expandable")}
               </Link>
          </nav>
     );
}
