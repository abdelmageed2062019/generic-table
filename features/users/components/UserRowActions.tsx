"use client";

import { useTranslations } from "next-intl";
import { Eye, Pencil, Trash } from "lucide-react";
import { DataTableRowActions, RowAction } from "@/components/data-table";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { User } from "../types/user.types";
import { useDeleteUser } from "../hooks/useUsers";
import { UserDetailsModal } from "./UserDetailsModal";

interface UserRowActionsProps {
     row: Row<User>;
}

export function UserRowActions({ row }: UserRowActionsProps) {
     const t = useTranslations("users.actions");
     const { mutate: deleteUser } = useDeleteUser();
     const [open, setOpen] = useState(false);
     const [mode, setMode] = useState<"view" | "edit">("view");
     const [selectedUser, setSelectedUser] = useState<User | null>(null);

     const actions: RowAction<User>[] = [
          {
               label: t("viewProfile"),
               icon: <Eye className="h-4 w-4" />,
               onClick: (user) => {
                    setSelectedUser(user);
                    setMode("view");
                    setOpen(true);
               },
          },
          {
               label: t("editUser"),
               icon: <Pencil className="h-4 w-4" />,
               onClick: (user) => {
                    setSelectedUser(user);
                    setMode("edit");
                    setOpen(true);
               },
          },
          {
               label: t("deleteUser"),
               icon: <Trash className="h-4 w-4" />,
               onClick: (user) => deleteUser(user.id),
               variant: "destructive",
               separator: true,
          },
     ];

     return (
          <>
               <DataTableRowActions row={row} actions={actions} />
               <UserDetailsModal
                    key={selectedUser?.id ?? "empty"}
                    open={open}
                    onOpenChange={(nextOpen) => {
                         setOpen(nextOpen);
                         if (!nextOpen) setMode("view");
                    }}
                    user={selectedUser}
                    mode={mode}
                    onModeChange={setMode}
               />
          </>
     );
}
