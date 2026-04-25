"use client";

import { useMemo } from "react";

import { useLocale, useTranslations } from "next-intl";
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
     pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
     table,
     pageSizeOptions = [5, 10, 20, 50],
}: DataTablePaginationProps<TData>) {
     const locale = useLocale();
     const t = useTranslations("pagination");

     const { pageIndex, pageSize } = table.getState().pagination;
     const totalRows = table.getFilteredRowModel().rows.length;
     const pageCount = table.getPageCount();

     const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
     const formatNumber = (value: number) => numberFormatter.format(value);

     const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
     const to = totalRows === 0 ? 0 : Math.min((pageIndex + 1) * pageSize, totalRows);

     return (
          <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
               <div className="text-sm text-muted-foreground">
                    {t("showing", {
                         from: formatNumber(from),
                         to: formatNumber(to),
                         total: formatNumber(totalRows),
                    })}
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
                                             {formatNumber(size)}
                                        </SelectItem>
                                   ))}
                              </SelectContent>
                         </Select>
                    </div>

                    {/* Page indicator */}
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                         {t("page")} <bdi>{formatNumber(pageIndex + 1)}</bdi> {t("of")}{" "}
                         <bdi>{formatNumber(pageCount)}</bdi>
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
                              onClick={() => table.setPageIndex(pageCount - 1)}
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
