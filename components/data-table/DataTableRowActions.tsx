"use client";

import { useTranslations } from "next-intl";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface RowAction<TData> {
     label: string;
     icon?: React.ReactNode;
     onClick: (row: TData) => void;
     variant?: "default" | "destructive";
     separator?: boolean;
}

interface DataTableRowActionsProps<TData> {
     row: Row<TData>;
     actions: RowAction<TData>[];
}

export function DataTableRowActions<TData>({
     row,
     actions,
}: DataTableRowActionsProps<TData>) {
     const t = useTranslations("common");

     return (
          <DropdownMenu>
               <DropdownMenuTrigger asChild>
                    <Button
                         variant="ghost"
                         size="sm"
                         className="h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                         <MoreHorizontal className="h-4 w-4" />
                         <span className="sr-only">{t("actions")}</span>
                    </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-[160px]">
                    {actions.map((action, index) => (
                         <div key={index}>
                              {action.separator && <DropdownMenuSeparator />}
                              <DropdownMenuItem
                                   onClick={() => action.onClick(row.original)}
                                   className={
                                        action.variant === "destructive"
                                             ? "text-destructive focus:text-destructive"
                                             : ""
                                   }
                              >
                                   {action.icon && (
                                        <span className="me-2 h-4 w-4">{action.icon}</span>
                                   )}
                                   {action.label}
                              </DropdownMenuItem>
                         </div>
                    ))}
               </DropdownMenuContent>
          </DropdownMenu>
     );
}