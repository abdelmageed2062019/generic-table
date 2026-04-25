"use client";

import { useState } from "react";
import { ColumnDef, RowSelectionState, ExpandedState } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { UsersFilters } from "./UsersFilters";
import { UserRowActions } from "./UserRowActions";
import { UserExpandedRow } from "./UserExpandedRow";
import { useUsers } from "../hooks/useUsers";
import type { User, UserRole, UserStatus } from "../types/user.types";
import { formatLongDate } from "@/lib/formatters";

const statusVariant: Record<UserStatus, "default" | "secondary" | "destructive"> = {
     active: "default",
     inactive: "secondary",
     banned: "destructive",
};

export function UsersTable() {
     const locale = useLocale();
     const t = useTranslations("users");
     const tCommon = useTranslations("common");
     const [tableMode, setTableMode] = useState<"selection" | "expandable">(
          "selection"
     );

     const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
     const [search, setSearch] = useState("");
     const [role, setRole] = useState<UserRole | "">("");
     const [status, setStatus] = useState<UserStatus | "">("");
     const [joinedDate, setJoinedDate] = useState("");
     const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
     const [expanded, setExpanded] = useState<ExpandedState>({});

     const { data, isLoading } = useUsers({
          page: pagination.pageIndex + 1,
          perPage: pagination.pageSize,
          search,
          role,
          status,
          joinedDate,
          locale,
     });

     const handleReset = () => {
          setRole("");
          setStatus("");
          setJoinedDate("");
          setSearch("");
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
     };

     const baseColumns: ColumnDef<User>[] = [
          {
               id: "name",
               accessorKey: "name",
               header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("columns.name")} />
               ),
               cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                         <img
                              src={row.original.avatar}
                              alt={row.original.name}
                              className="h-8 w-8 rounded-full bg-muted"
                         />
                         <div className="flex flex-col">
                              <span className="font-medium text-sm">{row.original.name}</span>
                              <span className="text-xs text-muted-foreground">
                                   {row.original.email}
                              </span>
                         </div>
                    </div>
               ),
          },

          // Role
          {
               id: "role",
               accessorKey: "role",
               header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("columns.role")} />
               ),
               cell: ({ row }) => (
                    <Badge variant="outline" className="capitalize">
                         {t(`filters.${row.original.role}`)}
                    </Badge>
               ),
          },

          // Status
          {
               id: "status",
               accessorKey: "status",
               header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("columns.status")} />
               ),
               cell: ({ row }) => (
                    <Badge variant={statusVariant[row.original.status]} className="capitalize">
                         {t(`filters.${row.original.status}`)}
                    </Badge>
               ),
          },

          // Created At
          {
               id: "createdAt",
               accessorKey: "createdAt",
               header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={t("columns.createdAt")} />
               ),
               cell: ({ row }) => (
                    <span className="text-sm text-muted-foreground">
                         {formatLongDate(row.original.createdAt, locale)}
                    </span>
               ),
          },

          // Actions
          {
               id: "actions",
               cell: ({ row }) => <UserRowActions row={row} />,
               size: 40,
          },
     ];

     const selectionColumns: ColumnDef<User>[] = [
          {
               id: "select",
               header: ({ table }) => (
                    <Checkbox
                         checked={
                              table.getIsAllPageRowsSelected() ||
                              (table.getIsSomePageRowsSelected() && "indeterminate")
                         }
                         onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
                         aria-label={tCommon("selectAll")}
                    />
               ),
               cell: ({ row }) => (
                    <Checkbox
                         checked={row.getIsSelected()}
                         onCheckedChange={(val) => row.toggleSelected(!!val)}
                         aria-label={tCommon("selectRow")}
                    />
               ),
               enableSorting: false,
               enableHiding: false,
               size: 40,
          },
          ...baseColumns,
     ];

     const expandableColumns: ColumnDef<User>[] = [
          {
               id: "expand",
               header: () => null,
               cell: ({ row }) => (
                    <Button
                         variant="ghost"
                         size="sm"
                         className="h-8 w-8 p-0"
                         onClick={() => row.toggleExpanded()}
                         aria-label={tCommon("toggleExpandedRow")}
                    >
                         {row.getIsExpanded() ? (
                              <ChevronDown className="h-4 w-4" />
                         ) : (
                              <ChevronRight className="h-4 w-4" />
                         )}
                    </Button>
               ),
               enableSorting: false,
               enableHiding: false,
               size: 40,
          },
          ...baseColumns,
     ];

     const activeColumns =
          tableMode === "selection" ? selectionColumns : expandableColumns;

     const sharedTableProps = {
          data: data?.data ?? [],
          total: data?.total ?? 0,
          isLoading,
          search,
          onSearchChange: (val: string) => {
               setSearch(val);
               setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          },
          filterSlot: (
               <UsersFilters
                    role={role}
                    status={status}
                    joinedDate={joinedDate}
                    onRoleChange={(val) => {
                         setRole(val);
                         setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                    onStatusChange={(val) => {
                         setStatus(val);
                         setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                    onJoinedDateChange={(value) => {
                         setJoinedDate(value);
                         setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                    onReset={handleReset}
               />
          ),
          pagination,
          onPaginationChange: setPagination,
          getRowId: (row: User) => row.id,
     };

     return (
          <div className="space-y-4">
               <div>
                    <h1 className="text-2xl font-semibold">{t("title")}</h1>
                    <p className="text-muted-foreground text-sm">{t("description")}</p>
               </div>

               {tableMode === "selection" && Object.keys(rowSelection).length > 0 && (
                    <div className="flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-sm">
                         <span className="font-medium">
                              {tCommon("selected", {
                                   count: Object.keys(rowSelection).length,
                                   total: data?.total ?? 0,
                              })}
                         </span>
                    </div>
               )}

               <Tabs
                    value={tableMode}
                    onValueChange={(value) => {
                         const nextMode = value as "selection" | "expandable";
                         setTableMode(nextMode);
                         if (nextMode === "selection") {
                              setExpanded({});
                         } else {
                              setRowSelection({});
                         }
                    }}
               >
                    <TabsList>
                         <TabsTrigger value="selection">
                              {t("modes.selectable")}
                         </TabsTrigger>
                         <TabsTrigger value="expandable">
                              {t("modes.expandable")}
                         </TabsTrigger>
                    </TabsList>

                    <TabsContent value="selection" className="mt-0">
                         <DataTable
                              columns={selectionColumns}
                              {...sharedTableProps}
                              rowSelection={rowSelection}
                              onRowSelectionChange={setRowSelection}
                         />
                    </TabsContent>

                    <TabsContent value="expandable" className="mt-0">
                         <DataTable
                              columns={activeColumns}
                              {...sharedTableProps}
                              expanded={expanded}
                              onExpandedChange={setExpanded}
                              renderExpandedRow={(user) => (
                                   <UserExpandedRow userId={user.id} />
                              )}
                         />
                    </TabsContent>
               </Tabs>
          </div>
     );
}
