"use client";

import { useTranslations } from "next-intl";
import { Eye, Pencil, Trash } from "lucide-react";
import { DataTableRowActions, RowAction } from "@/components/data-table";
import { Row } from "@tanstack/react-table";
import { User } from "../types/user.types";
import { useDeleteUser } from "../hooks/useUsers";

interface UserRowActionsProps {
     row: Row<User>;
}

export function UserRowActions({ row }: UserRowActionsProps) {
     const t = useTranslations("users.actions");
     const { mutate: deleteUser } = useDeleteUser();

     const actions: RowAction<User>[] = [
          {
               label: t("viewProfile"),
               icon: <Eye className="h-4 w-4" />,
               onClick: (user) => console.log("view", user),
          },
          {
               label: t("editUser"),
               icon: <Pencil className="h-4 w-4" />,
               onClick: (user) => console.log("edit", user),
          },
          {
               label: t("deleteUser"),
               icon: <Trash className="h-4 w-4" />,
               onClick: (user) => deleteUser(user.id),
               variant: "destructive",
               separator: true,
          },
     ];

     return <DataTableRowActions row={row} actions={actions} />;
}