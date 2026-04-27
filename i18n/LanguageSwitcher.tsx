"use client";

import { useLocale } from "next-intl";
import { localeConfig, locales, type Locale } from "./config";
import { usePathname, useRouter } from "./navigation";
import { Button } from "@/components/ui/button";
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
     const locale = useLocale() as Locale;
     const router = useRouter();
     const pathname = usePathname();

     const handleLocaleChange = (newLocale: Locale) => {
          router.replace(pathname, { locale: newLocale });
     };

     return (
          <DropdownMenu>
               <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="xs" className="gap-1.5 sm:gap-2 sm:h-7">
                         <Languages className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                         <span className="hidden sm:inline">{localeConfig[locale].label}</span>
                    </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                    {locales.map((l) => (
                         <DropdownMenuItem
                              key={l}
                              onClick={() => handleLocaleChange(l)}
                              className={l === locale ? "bg-accent font-medium" : ""}
                         >
                              {localeConfig[l].label}
                         </DropdownMenuItem>
                    ))}
               </DropdownMenuContent>
          </DropdownMenu>
     );
}
