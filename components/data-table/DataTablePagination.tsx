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
import { useDirection } from "@/components/ui/direction";
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
     const tCommon = useTranslations("common");
     const direction = useDirection();

     const { pageIndex, pageSize } = table.getState().pagination;
     const selectedCount = table.getFilteredSelectedRowModel().rows.length;
     const totalRows = table.getFilteredRowModel().rows.length;
     const pageCount = table.getPageCount();

     const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
     const formatNumber = (value: number) => numberFormatter.format(value);

     const FirstPageIcon = direction === "rtl" ? ChevronsRight : ChevronsLeft;
     const PreviousPageIcon = direction === "rtl" ? ChevronRight : ChevronLeft;
     const NextPageIcon = direction === "rtl" ? ChevronLeft : ChevronRight;
     const LastPageIcon = direction === "rtl" ? ChevronsLeft : ChevronsRight;

     return (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
               {/* Selection count */}
               <div className="text-sm text-muted-foreground">
                    {tCommon("selected", {
                         count: formatNumber(selectedCount),
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
                              <FirstPageIcon className="h-4 w-4" />
                         </Button>
                         <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => table.previousPage()}
                              disabled={!table.getCanPreviousPage()}
                              title={t("previous")}
                         >
                              <PreviousPageIcon className="h-4 w-4" />
                         </Button>
                         <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => table.nextPage()}
                              disabled={!table.getCanNextPage()}
                              title={t("next")}
                         >
                              <NextPageIcon className="h-4 w-4" />
                         </Button>
                         <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => table.setPageIndex(pageCount - 1)}
                              disabled={!table.getCanNextPage()}
                              title={t("last")}
                         >
                              <LastPageIcon className="h-4 w-4" />
                         </Button>
                    </div>
               </div>
          </div>
     );
}
