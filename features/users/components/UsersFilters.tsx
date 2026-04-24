"use client";

import { useTranslations } from "next-intl";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserRole, UserStatus } from "../types/user.types";

interface UsersFiltersProps {
     role: UserRole | "";
     status: UserStatus | "";
     joinedDate: string;
     onRoleChange: (value: UserRole | "") => void;
     onStatusChange: (value: UserStatus | "") => void;
     onJoinedDateChange: (value: string) => void;
     onReset: () => void;
}

export function UsersFilters({
     role,
     status,
     joinedDate,
     onRoleChange,
     onStatusChange,
     onJoinedDateChange,
     onReset,
}: UsersFiltersProps) {
     const t = useTranslations("users.filters");
     const tCommon = useTranslations("common");

     const hasActiveFilters = role !== "" || status !== "" || joinedDate !== "";

     return (
          <div className="flex items-center gap-2 flex-wrap">
               {/* Role filter */}
               <Select
                    value={role || "all"}
                    onValueChange={(val) =>
                         onRoleChange(val === "all" ? "" : (val as UserRole))
                    }
               >
                    <SelectTrigger className="w-[140px]">
                         <SelectValue placeholder={t("role")} />
                    </SelectTrigger>
                    <SelectContent>
                         <SelectItem value="all">{t("allRoles")}</SelectItem>
                         <SelectItem value="admin">{t("admin")}</SelectItem>
                         <SelectItem value="moderator">{t("moderator")}</SelectItem>
                         <SelectItem value="user">{t("user")}</SelectItem>
                    </SelectContent>
               </Select>

               {/* Status filter */}
               <Select
                    value={status || "all"}
                    onValueChange={(val) =>
                         onStatusChange(val === "all" ? "" : (val as UserStatus))
                    }
               >
                    <SelectTrigger className="w-[140px]">
                         <SelectValue placeholder={t("status")} />
                    </SelectTrigger>
                    <SelectContent>
                         <SelectItem value="all">{t("allStatuses")}</SelectItem>
                         <SelectItem value="active">{t("active")}</SelectItem>
                         <SelectItem value="inactive">{t("inactive")}</SelectItem>
                         <SelectItem value="banned">{t("banned")}</SelectItem>
                    </SelectContent>
               </Select>

               <Input
                    type="date"
                    value={joinedDate}
                    onChange={(event) => onJoinedDateChange(event.target.value)}
                    className="w-[170px]"
                    aria-label={t("joinedDate")}
               />

               {/* Reset button — only shows when a filter is active */}
               {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={onReset}>
                         {tCommon("reset")}
                    </Button>
               )}
          </div>
     );
}
