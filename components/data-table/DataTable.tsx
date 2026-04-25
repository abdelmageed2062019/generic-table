"use client";

import {
     ColumnDef,
     ExpandedState,
     RowSelectionState,
     flexRender,
     getCoreRowModel,
     getExpandedRowModel,
     useReactTable,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTablePagination } from "./DataTablePagination";
import { Skeleton } from "@/components/ui/skeleton";

interface PaginationState {
     pageIndex: number;
     pageSize: number;
}

interface DataTableProps<TData> {
     // Core
     columns: ColumnDef<TData>[];
     data: TData[];
     total: number;
     isLoading?: boolean;

     // Toolbar
     search: string;
     onSearchChange: (value: string) => void;
     filterSlot?: React.ReactNode;

     // Pagination
     pagination: PaginationState;
     onPaginationChange: (pagination: PaginationState) => void;
     pageSizeOptions?: number[];

     // Row selection (Page 1)
     rowSelection?: RowSelectionState;
     onRowSelectionChange?: (selection: RowSelectionState) => void;

     // Expandable rows (Page 2)
     expanded?: ExpandedState;
     onExpandedChange?: (expanded: ExpandedState) => void;
     renderExpandedRow?: (row: TData) => React.ReactNode;

     // Optional
     getRowId?: (row: TData) => string;
}

export function DataTable<TData>({
     columns,
     data,
     total,
     isLoading,
     search,
     onSearchChange,
     filterSlot,
     pagination,
     onPaginationChange,
     pageSizeOptions,
     rowSelection = {},
     onRowSelectionChange,
     expanded = {},
     onExpandedChange,
     renderExpandedRow,
     getRowId,
}: DataTableProps<TData>) {
     const t = useTranslations("common");

     const table = useReactTable({
          data,
          columns,
          pageCount: Math.ceil(total / pagination.pageSize),
          state: {
               pagination,
               rowSelection,
               expanded,
          },
          getRowId,
          manualPagination: true,
          enableRowSelection: !!onRowSelectionChange,
          getExpandedRowModel: getExpandedRowModel(),
          getCoreRowModel: getCoreRowModel(),
          onPaginationChange: (updater) => {
               const next =
                    typeof updater === "function" ? updater(pagination) : updater;
               onPaginationChange(next);
          },
          onRowSelectionChange: (updater) => {
               if (!onRowSelectionChange) return;
               const next =
                    typeof updater === "function" ? updater(rowSelection) : updater;
               onRowSelectionChange(next);
          },
          onExpandedChange: (updater) => {
               if (!onExpandedChange) return;
               const next =
                    typeof updater === "function" ? updater(expanded) : updater;
               onExpandedChange(next);
          },
     });

     return (
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
               <div className="border-b bg-muted/10 px-4 py-3">
                    <DataTableToolbar
                         search={search}
                         onSearchChange={(val) => {
                              onSearchChange(val);
                              onPaginationChange({ ...pagination, pageIndex: 0 });
                         }}
                         filterSlot={filterSlot}
                    />
               </div>

               <Table>
                    <TableHeader className="bg-muted/30">
                         {table.getHeaderGroups().map((headerGroup) => (
                              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                   {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="h-11">
                                             {header.isPlaceholder
                                                  ? null
                                                  : flexRender(
                                                       header.column.columnDef.header,
                                                       header.getContext()
                                                  )}
                                        </TableHead>
                                   ))}
                              </TableRow>
                         ))}
                    </TableHeader>

                    <TableBody>
                         {isLoading ? (
                              Array.from({ length: pagination.pageSize }).map((_, i) => (
                                   <TableRow key={i}>
                                        {columns.map((_, j) => (
                                             <TableCell key={j}>
                                                  <Skeleton className="h-6 w-full" />
                                             </TableCell>
                                        ))}
                                   </TableRow>
                              ))
                         ) : table.getRowModel().rows.length === 0 ? (
                              <TableRow>
                                   <TableCell
                                        colSpan={columns.length}
                                        className="h-32 text-center text-muted-foreground"
                                   >
                                        {t("noResults")}
                                   </TableCell>
                              </TableRow>
                         ) : (
                              table.getRowModel().rows.map((row) => (
                                   <>
                                        <TableRow
                                             key={row.id}
                                             data-state={row.getIsSelected() ? "selected" : undefined}
                                             className={row.getIsExpanded() ? "border-b-0" : undefined}
                                        >
                                             {row.getVisibleCells().map((cell) => (
                                                  <TableCell key={cell.id} className="py-3">
                                                       {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                       )}
                                                  </TableCell>
                                             ))}
                                        </TableRow>

                                        {row.getIsExpanded() && renderExpandedRow && (
                                             <TableRow key={`${row.id}-expanded`}>
                                                  <TableCell colSpan={columns.length} className="p-0">
                                                       {renderExpandedRow(row.original)}
                                                  </TableCell>
                                             </TableRow>
                                        )}
                                   </>
                              ))
                         )}
                    </TableBody>
               </Table>

               <div className="border-t bg-card">
                    <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
               </div>
          </div>
     );
}
