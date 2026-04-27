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
     const contentDir = locale === "ar" ? "rtl" : "ltr";

     const { pageIndex, pageSize } = table.getState().pagination;
     const totalRows = table.getFilteredRowModel().rows.length;
     const pageCount = table.getPageCount();

     const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
     const formatNumber = (value: number) => numberFormatter.format(value);

     const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
     const to = totalRows === 0 ? 0 : Math.min((pageIndex + 1) * pageSize, totalRows);

     return (
          <div
               dir="ltr"
               className="flex flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-3"
          >
               <div dir={contentDir} className="text-xs sm:text-sm text-muted-foreground">
                    {t("showing", {
                         from: formatNumber(from),
                         to: formatNumber(to),
                         total: formatNumber(totalRows),
                    })}
               </div>

               <div dir="ltr" className="flex items-center gap-3 sm:gap-6">
                    {/* Rows per page */}
                    <div className="flex items-center gap-2">
                         <span
                              dir={contentDir}
                              className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap"
                         >
                              {t("rowsPerPage")}
                         </span>
                         <Select
                              value={String(pageSize)}
                              onValueChange={(val) => {
                                   table.setPageSize(Number(val));
                              }}
                         >
                              <SelectTrigger
                                   size="sm"
                                   className="h-7 w-[60px] px-2 text-xs leading-none tabular-nums sm:h-8 sm:w-[64px] sm:px-3 sm:text-sm [&_[data-slot=select-value]]:justify-center"
                              >
                                   <SelectValue />
                              </SelectTrigger>
                              <SelectContent
                                   side="top"
                                   className="min-w-[64px] text-xs [&_[data-slot=select-item]]:py-1"
                              >
                                   {pageSizeOptions.map((size) => (
                                        <SelectItem
                                             key={size}
                                             value={String(size)}
                                             className="text-xs leading-none"
                                        >
                                             {formatNumber(size)}
                                        </SelectItem>
                                   ))}
                              </SelectContent>
                         </Select>
                    </div>

                    {/* Page indicator */}
                    <div
                         dir={contentDir}
                         className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap"
                    >
                         {t("page")} <bdi>{formatNumber(pageIndex + 1)}</bdi> {t("of")}{" "}
                         <bdi>{formatNumber(pageCount)}</bdi>
                    </div>

                    {/* Navigation buttons */}
                    <div dir="ltr" className="flex items-center gap-1">
                         <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              onClick={() => table.setPageIndex(0)}
                              disabled={!table.getCanPreviousPage()}
                              title={t("first")}
                         >
                              <ChevronsLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                         </Button>
                         <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              onClick={() => table.previousPage()}
                              disabled={!table.getCanPreviousPage()}
                              title={t("previous")}
                         >
                              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                         </Button>
                         <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              onClick={() => table.nextPage()}
                              disabled={!table.getCanNextPage()}
                              title={t("next")}
                         >
                              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                         </Button>
                         <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              onClick={() => table.setPageIndex(pageCount - 1)}
                              disabled={!table.getCanNextPage()}
                              title={t("last")}
                         >
                              <ChevronsRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                         </Button>
                    </div>
               </div>
          </div>
     );
}
