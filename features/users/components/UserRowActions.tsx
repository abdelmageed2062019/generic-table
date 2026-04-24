"use client";

import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "../types/user.types";

interface UserRowActionsProps {
     user: User;
     onViewProfile?: (user: User) => void;
     onEditUser?: (user: User) => void;
     onDeleteUser?: (user: User) => void;
}

export function UserRowActions({
     user,
     onViewProfile,
     onEditUser,
     onDeleteUser,
}: UserRowActionsProps) {
     const t = useTranslations("users.actions");
     const hasActions = Boolean(onViewProfile || onEditUser || onDeleteUser);

     return (
          <DropdownMenu>
               <DropdownMenuTrigger asChild>
                    <Button
                         variant="ghost"
                         size="icon-sm"
                         className="data-[state=open]:bg-accent"
                         aria-label={t("viewProfile")}
                    >
                         <MoreHorizontal className="size-4" />
                    </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                    <DropdownMenuItem
                         disabled={!onViewProfile}
                         onClick={() => onViewProfile?.(user)}
                    >
                         {t("viewProfile")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                         disabled={!onEditUser}
                         onClick={() => onEditUser?.(user)}
                    >
                         {t("editUser")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                         disabled={!onDeleteUser}
                         variant="destructive"
                         onClick={() => onDeleteUser?.(user)}
                    >
                         {t("deleteUser")}
                    </DropdownMenuItem>
                    {!hasActions && (
                         <DropdownMenuItem disabled>{t("viewProfile")}</DropdownMenuItem>
                    )}
               </DropdownMenuContent>
          </DropdownMenu>
     );
}
