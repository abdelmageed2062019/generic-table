"use client";

import { useState } from "react";
import { ColumnDef, RowSelectionState, ExpandedState } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, ChevronRight, Download, Plus } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { useDirection } from "@/components/ui/direction";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { UsersFilters } from "./UsersFilters";
import { UserRowActions } from "./UserRowActions";
import { UserExpandedRow } from "./UserExpandedRow";
import { fetchUsers } from "../api/users.api";
import { useCreateUser, useUsers } from "../hooks/useUsers";
import type { User, UserRole, UserStatus } from "../types/user.types";
import { formatLongDate } from "@/lib/formatters";

const statusVariant: Record<UserStatus, "default" | "secondary" | "destructive"> = {
     active: "default",
     inactive: "secondary",
     banned: "destructive",
};

export function UsersTable() {
     const locale = useLocale();
     const direction = useDirection();
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

     const createUserMutation = useCreateUser();
     const [createOpen, setCreateOpen] = useState(false);
     const [createName, setCreateName] = useState("");
     const [createEmail, setCreateEmail] = useState("");
     const [createRole, setCreateRole] = useState<UserRole>("user");
     const [createStatus, setCreateStatus] = useState<UserStatus>("active");
     const [isDownloading, setIsDownloading] = useState(false);

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
          <div className="space-y-4 pt-2">

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

                    <div
                         dir={direction}
                         className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                         <div className="text-start">
                              <h1 className="text-2xl font-semibold">{t("title")}</h1>
                              <p className="text-muted-foreground text-sm">
                                   {t("description")}
                              </p>
                         </div>

                         <div className="flex items-center gap-2">
                              <PopoverPrimitive.Root open={createOpen} onOpenChange={setCreateOpen}>
                                   <PopoverPrimitive.Trigger asChild>
                                        <Button variant="default" className="gap-2">
                                             <Plus className="h-4 w-4" />
                                             {t("actions.createUser")}
                                        </Button>
                                   </PopoverPrimitive.Trigger>
                                   <PopoverPrimitive.Portal>
                                        <PopoverPrimitive.Content
                                             dir={direction}
                                             align="end"
                                             sideOffset={8}
                                             className="z-50 w-[320px] rounded-md border bg-popover p-3 text-popover-foreground shadow-md outline-hidden"
                                        >
                                             <div className="flex flex-col gap-3 text-start">
                                                  <div className="grid gap-1.5">
                                                       <span className="text-xs text-muted-foreground">
                                                            {t("columns.name")}
                                                       </span>
                                                       <Input
                                                            value={createName}
                                                            onChange={(e) => setCreateName(e.target.value)}
                                                            autoComplete="name"
                                                       />
                                                  </div>

                                                  <div className="grid gap-1.5">
                                                       <span className="text-xs text-muted-foreground">
                                                            {t("columns.email")}
                                                       </span>
                                                       <Input
                                                            value={createEmail}
                                                            onChange={(e) => setCreateEmail(e.target.value)}
                                                            autoComplete="email"
                                                            inputMode="email"
                                                       />
                                                  </div>

                                                  <div className="grid grid-cols-2 gap-2">
                                                       <div className="grid gap-1.5">
                                                            <span className="text-xs text-muted-foreground">
                                                                 {t("filters.role")}
                                                            </span>
                                                            <Select
                                                                 value={createRole}
                                                                 onValueChange={(val) =>
                                                                      setCreateRole(val as UserRole)
                                                                 }
                                                            >
                                                                 <SelectTrigger className="w-full">
                                                                      <SelectValue />
                                                                 </SelectTrigger>
                                                                 <SelectContent>
                                                                      <SelectItem value="admin">
                                                                           {t("filters.admin")}
                                                                      </SelectItem>
                                                                      <SelectItem value="moderator">
                                                                           {t("filters.moderator")}
                                                                      </SelectItem>
                                                                      <SelectItem value="user">
                                                                           {t("filters.user")}
                                                                      </SelectItem>
                                                                 </SelectContent>
                                                            </Select>
                                                       </div>

                                                       <div className="grid gap-1.5">
                                                            <span className="text-xs text-muted-foreground">
                                                                 {t("filters.status")}
                                                            </span>
                                                            <Select
                                                                 value={createStatus}
                                                                 onValueChange={(val) =>
                                                                      setCreateStatus(val as UserStatus)
                                                                 }
                                                            >
                                                                 <SelectTrigger className="w-full">
                                                                      <SelectValue />
                                                                 </SelectTrigger>
                                                                 <SelectContent>
                                                                      <SelectItem value="active">
                                                                           {t("filters.active")}
                                                                      </SelectItem>
                                                                      <SelectItem value="inactive">
                                                                           {t("filters.inactive")}
                                                                      </SelectItem>
                                                                      <SelectItem value="banned">
                                                                           {t("filters.banned")}
                                                                      </SelectItem>
                                                                 </SelectContent>
                                                            </Select>
                                                       </div>
                                                  </div>

                                                  <div className="flex items-center justify-end gap-2">
                                                       <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setCreateOpen(false)}
                                                       >
                                                            {tCommon("cancel")}
                                                       </Button>
                                                       <Button
                                                            type="button"
                                                            size="sm"
                                                            className="gap-2"
                                                            disabled={
                                                                 createUserMutation.isPending ||
                                                                 !createName.trim() ||
                                                                 !createEmail.trim()
                                                            }
                                                            onClick={async () => {
                                                                 try {
                                                                      await createUserMutation.mutateAsync({
                                                                           name: createName,
                                                                           email: createEmail,
                                                                           role: createRole,
                                                                           status: createStatus,
                                                                      });
                                                                      setCreateName("");
                                                                      setCreateEmail("");
                                                                      setCreateRole("user");
                                                                      setCreateStatus("active");
                                                                      setCreateOpen(false);
                                                                      setPagination((prev) => ({
                                                                           ...prev,
                                                                           pageIndex: 0,
                                                                      }));
                                                                 } catch {
                                                                 }
                                                            }}
                                                       >
                                                            {tCommon("create")}
                                                       </Button>
                                                  </div>
                                             </div>
                                        </PopoverPrimitive.Content>
                                   </PopoverPrimitive.Portal>
                              </PopoverPrimitive.Root>

                              <Button
                                   variant="outline"
                                   className="gap-2"
                                   disabled={isDownloading}
                                   onClick={async () => {
                                        setIsDownloading(true);
                                        try {
                                             const res = await fetchUsers({
                                                  page: 1,
                                                  perPage: 100000,
                                                  search,
                                                  role,
                                                  status,
                                                  joinedDate,
                                                  locale,
                                             });

                                             const escapeCsvValue = (value: string) => {
                                                  const normalized = value ?? "";
                                                  if (/[",\r\n]/.test(normalized)) {
                                                       return `"${normalized.replace(/"/g, '""')}"`;
                                                  }
                                                  return normalized;
                                             };

                                             const headers = [
                                                  "id",
                                                  t("columns.name"),
                                                  t("columns.email"),
                                                  t("columns.role"),
                                                  t("columns.status"),
                                                  t("columns.createdAt"),
                                             ];

                                             const lines = [
                                                  headers.map(escapeCsvValue).join(","),
                                                  ...res.data.map((u) =>
                                                       [
                                                            u.id,
                                                            u.name,
                                                            u.email,
                                                            t(`filters.${u.role}`),
                                                            t(`filters.${u.status}`),
                                                            formatLongDate(u.createdAt, locale),
                                                       ]
                                                            .map(escapeCsvValue)
                                                            .join(",")
                                                  ),
                                             ];

                                             const csv = `\uFEFF${lines.join("\r\n")}`;
                                             const blob = new Blob([csv], {
                                                  type: "text/csv;charset=utf-8",
                                             });
                                             const url = URL.createObjectURL(blob);

                                             const a = document.createElement("a");
                                             a.href = url;
                                             a.download = `users-${locale}.csv`;
                                             document.body.appendChild(a);
                                             a.click();
                                             a.remove();
                                             URL.revokeObjectURL(url);
                                        } catch {
                                        } finally {
                                             setIsDownloading(false);
                                        }
                                   }}
                              >
                                   <Download className="h-4 w-4" />
                                   {t("actions.downloadCsv")}
                              </Button>
                         </div>
                    </div>


                    <TabsContent value="selection" className="mt-0 p-4">
                         <DataTable
                              columns={selectionColumns}
                              {...sharedTableProps}
                              rowSelection={rowSelection}
                              onRowSelectionChange={setRowSelection}
                         />
                    </TabsContent>



                    <TabsContent value="expandable" className="mt-0 p-4">
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
               </Tabs >


          </div >
     );
}
