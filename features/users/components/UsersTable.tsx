"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useDeleteUser, useUsers } from "../hooks/useUsers";
import type { User, UserRole, UserStatus } from "../types/user.types";
import { UserRowActions } from "./UserRowActions";
import { UsersFilters } from "./UsersFilters";

const PER_PAGE = 5;

function formatDate(value: string, locale: string) {
     return new Intl.DateTimeFormat(locale, {
          dateStyle: "medium",
     }).format(new Date(value));
}

function getStatusClasses(status: UserStatus) {
     switch (status) {
          case "active":
               return "bg-emerald-100 text-emerald-700";
          case "inactive":
               return "bg-zinc-100 text-zinc-700";
          case "banned":
               return "bg-rose-100 text-rose-700";
     }
}

export function UsersTable() {
     const t = useTranslations("users");
     const tCommon = useTranslations("common");
     const tPagination = useTranslations("pagination");
     const locale = useLocale();
     const [page, setPage] = useState(1);
     const [search, setSearch] = useState("");
     const [role, setRole] = useState<UserRole | "">("");
     const [status, setStatus] = useState<UserStatus | "">("");

     const usersQuery = useUsers({
          page,
          perPage: PER_PAGE,
          search,
          role,
          status,
     });
     const deleteUserMutation = useDeleteUser();

     const users = usersQuery.data?.data ?? [];
     const totalPages = usersQuery.data?.totalPages ?? 1;

     function handleReset() {
          setSearch("");
          setRole("");
          setStatus("");
          setPage(1);
     }

     function handleRoleChange(value: UserRole | "") {
          setRole(value);
          setPage(1);
     }

     function handleStatusChange(value: UserStatus | "") {
          setStatus(value);
          setPage(1);
     }

     async function handleDeleteUser(user: User) {
          const confirmed = window.confirm(`${t("actions.deleteUser")}: ${user.name}?`);
          if (!confirmed) return;

          await deleteUserMutation.mutateAsync(user.id);
     }

     function handleViewProfile(user: User) {
          window.alert(`${t("actions.viewProfile")}: ${user.name}`);
     }

     function handleEditUser(user: User) {
          window.alert(`${t("actions.editUser")}: ${user.name}`);
     }

     return (
          <section className="space-y-6">
               <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">{t("title")}</h1>
                    <p className="text-sm text-muted-foreground">{t("description")}</p>
               </div>

               <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
                    <input
                         value={search}
                         onChange={(event) => {
                              setSearch(event.target.value);
                              setPage(1);
                         }}
                         placeholder={tCommon("search")}
                         className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-hidden focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                    />
                    <UsersFilters
                         role={role}
                         status={status}
                         onRoleChange={handleRoleChange}
                         onStatusChange={handleStatusChange}
                         onReset={handleReset}
                    />
               </div>

               <div className="overflow-hidden rounded-lg border bg-card">
                    <div className="overflow-x-auto">
                         <table className="min-w-full text-sm">
                              <thead className="bg-muted/50 text-left">
                                   <tr>
                                        <th className="px-4 py-3 font-medium">
                                             {t("columns.name")}
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                             {t("columns.email")}
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                             {t("columns.role")}
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                             {t("columns.status")}
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                             {t("columns.createdAt")}
                                        </th>
                                        <th className="px-4 py-3 font-medium text-right">
                                             {tCommon("actions")}
                                        </th>
                                   </tr>
                              </thead>
                              <tbody>
                                   {usersQuery.isLoading && (
                                        <tr>
                                             <td
                                                  colSpan={6}
                                                  className="px-4 py-8 text-center text-muted-foreground"
                                             >
                                                  {tCommon("loading")}
                                             </td>
                                        </tr>
                                   )}

                                   {!usersQuery.isLoading && users.length === 0 && (
                                        <tr>
                                             <td
                                                  colSpan={6}
                                                  className="px-4 py-8 text-center text-muted-foreground"
                                             >
                                                  {tCommon("noResults")}
                                             </td>
                                        </tr>
                                   )}

                                   {users.map((user) => (
                                        <tr key={user.id} className="border-t">
                                             <td className="px-4 py-3 font-medium">{user.name}</td>
                                             <td className="px-4 py-3 text-muted-foreground">
                                                  {user.email}
                                             </td>
                                             <td className="px-4 py-3">
                                                  {t(`filters.${user.role}`)}
                                             </td>
                                             <td className="px-4 py-3">
                                                  <span
                                                       className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(user.status)}`}
                                                  >
                                                       {t(`filters.${user.status}`)}
                                                  </span>
                                             </td>
                                             <td className="px-4 py-3 text-muted-foreground">
                                                  {formatDate(user.createdAt, locale)}
                                             </td>
                                             <td className="px-4 py-3 text-right">
                                                  <UserRowActions
                                                       user={user}
                                                       onViewProfile={handleViewProfile}
                                                       onEditUser={handleEditUser}
                                                       onDeleteUser={handleDeleteUser}
                                                  />
                                             </td>
                                        </tr>
                                   ))}
                              </tbody>
                         </table>
                    </div>

                    <div className="flex items-center justify-between border-t px-4 py-3">
                         <p className="text-sm text-muted-foreground">
                              {tCommon("selected", {
                                   count: users.length,
                                   total: usersQuery.data?.total ?? 0,
                              })}
                         </p>
                         <div className="flex items-center gap-2">
                              <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={() => setPage((current) => Math.max(1, current - 1))}
                                   disabled={page === 1 || usersQuery.isFetching}
                              >
                                   {tPagination("previous")}
                              </Button>
                              <span className="text-sm text-muted-foreground">
                                   {tPagination("page")} {page} {tPagination("of")}{" "}
                                   {totalPages}
                              </span>
                              <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={() =>
                                        setPage((current) => Math.min(totalPages, current + 1))
                                   }
                                   disabled={page >= totalPages || usersQuery.isFetching}
                              >
                                   {tPagination("next")}
                              </Button>
                         </div>
                    </div>
               </div>
          </section>
     );
}
