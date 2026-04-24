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
               <div className={cn("text-sm font-medium", className)}>{title}</div>
          );
     }

     return (
          <div className={cn("flex items-center", className)}>
               <span className="text-sm font-medium">{title}</span>
          </div>
     );
}