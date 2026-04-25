"use client";

import { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue> {
     column: Column<TData, TValue>;
     title: string;
     className?: string;
}

export function DataTableColumnHeader<TData, TValue>({
     column,
     title,
     className,
}: DataTableColumnHeaderProps<TData, TValue>) {
     // Non-sortable columns just render the title
     if (!column.getCanSort()) {
          return (
               <div className={cn("text-xs font-semibold text-muted-foreground", className)}>
                    {title}
               </div>
          );
     }

     return (
          <div className={cn("flex items-center", className)}>
               <span className="text-xs font-semibold text-muted-foreground">{title}</span>
          </div>
     );
}
