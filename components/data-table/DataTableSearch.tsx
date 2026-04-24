"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface DataTableSearchProps {
     value: string;
     onChange: (value: string) => void;
}

export function DataTableSearch({ value, onChange }: DataTableSearchProps) {
     const t = useTranslations("common");

     return (
          <div className="relative w-full sm:w-[280px]">
               <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                    placeholder={t("search")}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="ps-9 pe-9"
               />
               {value && (
                    <button
                         onClick={() => onChange("")}
                         className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                         <X className="h-4 w-4" />
                    </button>
               )}
          </div>
     );
}