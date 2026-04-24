"use client";

import { useTranslations } from "next-intl";
import { Table } from "@tanstack/react-table";
import {
     ChevronLeft,
     ChevronRight,
     ChevronsLeft,
     ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
     table: Table<TData>;
     total: number;
     pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
     table,
     total,
     pageSizeOptions = [5, 10, 20, 50],
}: DataTablePaginationProps<TData>) {
     const t = useTranslations("pagination");
     const tCommon = useTranslations("common");

     const { pageIndex, pageSize } = table.getState().pagination;
     const selectedCount = table.getFilteredSelectedRowModel().rows.length;
     const totalRows = table.getFilteredRowModel().rows.length;

     return (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
               {/* Selection count */}
               <div className="text-sm text-muted-foreground">
                    {selectedCount > 0
                         ? tCommon("selected", { count: selectedCount, total: totalRows })
                         : <span>{total} {t("of")} {total}</span>
                    }
               </div>

               <div className="flex items-center gap-6">
                    {/* Rows per page */}
                    <div className="flex items-center gap-2">
                         <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {t("rowsPerPage")}
                         </span>
                         <Select
                              value={String(pageSize)}
                              onValueChange={(val) => {
                                   table.setPageSize(Number(val));
                              }}
                         >
                              <SelectTrigger className="w-[70px]">
                                   <SelectValue />
                              </SelectTrigger>
                              <SelectContent side="top">
                                   {pageSizeOptions.map((size) => (
                                        <SelectItem key={size} value={String(size)}>
                                             {size}
                                        </SelectItem>
                                   ))}
                              </SelectContent>
                         </Select>
                    </div>

                    {/* Page indicator */}
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                         {t("page")} {pageIndex + 1} {t("of")} {table.getPageCount()}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex items-center gap-1">
                         <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => table.setPageIndex(0)}
                              disabled={!table.getCanPreviousPage()}
                              title={t("first")}
                         >
                              <ChevronsLeft className="h-4 w-4" />
                         </Button>
                         <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => table.previousPage()}
                              disabled={!table.getCanPreviousPage()}
                              title={t("previous")}
                         >
                              <ChevronLeft className="h-4 w-4" />
                         </Button>
                         <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => table.nextPage()}
                              disabled={!table.getCanNextPage()}
                              title={t("next")}
                         >
                              <ChevronRight className="h-4 w-4" />
                         </Button>
                         <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                              disabled={!table.getCanNextPage()}
                              title={t("last")}
                         >
                              <ChevronsRight className="h-4 w-4" />
                         </Button>
                    </div>
               </div>
          </div>
     );
}