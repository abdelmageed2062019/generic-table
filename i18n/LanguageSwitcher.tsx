"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { localeConfig, locales, type Locale } from "./config";
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
          // Replace the current locale segment in the path
          const segments = pathname.split("/");
          segments[1] = newLocale;
          router.push(segments.join("/"));
     };

     return (
          <DropdownMenu>
               <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                         <Languages className="h-4 w-4" />
                         {localeConfig[locale].label}
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