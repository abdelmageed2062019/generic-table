"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useDirection } from "@/components/ui/direction";
import { cn } from "@/lib/utils";
import { formatLongDate } from "@/lib/formatters";
import { useUpdateUser } from "../hooks/useUsers";
import type { User, UserRole, UserStatus } from "../types/user.types";

type Mode = "view" | "edit";

interface UserDetailsModalProps {
     open: boolean;
     onOpenChange: (open: boolean) => void;
     user: User | null;
     mode: Mode;
     onModeChange: (mode: Mode) => void;
}

export function UserDetailsModal({
     open,
     onOpenChange,
     user,
     mode,
     onModeChange,
}: UserDetailsModalProps) {
     const locale = useLocale();
     const direction = useDirection();
     const t = useTranslations("users");
     const tCommon = useTranslations("common");

     const updateUserMutation = useUpdateUser();

     const [name, setName] = useState(() => user?.name ?? "");
     const [email, setEmail] = useState(() => user?.email ?? "");
     const [role, setRole] = useState<UserRole>(() => user?.role ?? "user");
     const [status, setStatus] = useState<UserStatus>(() => user?.status ?? "active");

     const isDirty = useMemo(() => {
          if (!user) return false;
          return (
               name.trim() !== user.name ||
               email.trim() !== user.email ||
               role !== user.role ||
               status !== user.status
          );
     }, [email, name, role, status, user]);

     const title = mode === "edit" ? t("modal.editTitle") : t("modal.viewTitle");

     return (
          <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
               <DialogPrimitive.Portal>
                    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
                    <DialogPrimitive.Content
                         dir={direction}
                         className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card p-4 shadow-lg outline-hidden sm:p-6"
                    >
                         <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 text-start">
                                   <DialogPrimitive.Title className="text-lg font-semibold truncate">
                                        {title}
                                   </DialogPrimitive.Title>
                                   {user ? (
                                        <DialogPrimitive.Description className="text-muted-foreground mt-1 text-sm">
                                             {user.id}
                                        </DialogPrimitive.Description>
                                   ) : null}
                              </div>

                              <DialogPrimitive.Close asChild>
                                   <Button variant="ghost" size="icon-sm" aria-label={tCommon("cancel")}>
                                        <X className="h-4 w-4" />
                                   </Button>
                              </DialogPrimitive.Close>
                         </div>

                         {!user ? null : mode === "view" ? (
                              <div className="mt-5 grid gap-4">
                                   <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="rounded-md border bg-background p-3">
                                             <div className="text-xs text-muted-foreground">
                                                  {t("columns.name")}
                                             </div>
                                             <div className="mt-1 text-sm font-medium">{user.name}</div>
                                        </div>
                                        <div className="rounded-md border bg-background p-3">
                                             <div className="text-xs text-muted-foreground">
                                                  {t("columns.email")}
                                             </div>
                                             <div className="mt-1 text-sm font-medium">{user.email}</div>
                                        </div>
                                        <div className="rounded-md border bg-background p-3">
                                             <div className="text-xs text-muted-foreground">
                                                  {t("columns.role")}
                                             </div>
                                             <div className="mt-1">
                                                  <Badge variant="outline" className="capitalize bg-muted/40">
                                                       {t(`filters.${user.role}`)}
                                                  </Badge>
                                             </div>
                                        </div>
                                        <div className="rounded-md border bg-background p-3">
                                             <div className="text-xs text-muted-foreground">
                                                  {t("columns.status")}
                                             </div>
                                             <div className="mt-1">
                                                  <Badge
                                                       variant="secondary"
                                                       className={cn(
                                                            user.status === "active"
                                                                 ? "bg-emerald-100 text-emerald-700"
                                                                 : user.status === "inactive"
                                                                      ? "bg-amber-100 text-amber-700"
                                                                      : "bg-rose-100 text-rose-700",
                                                            "capitalize"
                                                       )}
                                                  >
                                                       {t(`filters.${user.status}`)}
                                                  </Badge>
                                             </div>
                                        </div>
                                        <div className="rounded-md border bg-background p-3 sm:col-span-2">
                                             <div className="text-xs text-muted-foreground">
                                                  {t("columns.createdAt")}
                                             </div>
                                             <div className="mt-1 text-sm font-medium">
                                                  {formatLongDate(user.createdAt, locale)}
                                             </div>
                                        </div>
                                   </div>

                                   <div className="flex items-center justify-end gap-2">
                                        <Button
                                             variant="outline"
                                             size="sm"
                                             className="rounded-md"
                                             onClick={() => onModeChange("edit")}
                                        >
                                             {tCommon("edit")}
                                        </Button>
                                   </div>
                              </div>
                         ) : (
                              <div className="mt-5 grid gap-4">
                                   <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="grid gap-1.5">
                                             <span className="text-xs text-muted-foreground">
                                                  {t("columns.name")}
                                             </span>
                                             <Input value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className="grid gap-1.5">
                                             <span className="text-xs text-muted-foreground">
                                                  {t("columns.email")}
                                             </span>
                                             <Input
                                                  value={email}
                                                  onChange={(e) => setEmail(e.target.value)}
                                                  inputMode="email"
                                                  autoComplete="email"
                                             />
                                        </div>
                                        <div className="grid gap-1.5">
                                             <span className="text-xs text-muted-foreground">
                                                  {t("columns.role")}
                                             </span>
                                             <Select
                                                  value={role}
                                                  onValueChange={(val) => setRole(val as UserRole)}
                                             >
                                                  <SelectTrigger className="h-9 w-full bg-background">
                                                       <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       <SelectItem value="admin">{t("filters.admin")}</SelectItem>
                                                       <SelectItem value="moderator">
                                                            {t("filters.moderator")}
                                                       </SelectItem>
                                                       <SelectItem value="user">{t("filters.user")}</SelectItem>
                                                  </SelectContent>
                                             </Select>
                                        </div>
                                        <div className="grid gap-1.5">
                                             <span className="text-xs text-muted-foreground">
                                                  {t("columns.status")}
                                             </span>
                                             <Select
                                                  value={status}
                                                  onValueChange={(val) => setStatus(val as UserStatus)}
                                             >
                                                  <SelectTrigger className="h-9 w-full bg-background">
                                                       <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       <SelectItem value="active">{t("filters.active")}</SelectItem>
                                                       <SelectItem value="inactive">
                                                            {t("filters.inactive")}
                                                       </SelectItem>
                                                       <SelectItem value="banned">{t("filters.banned")}</SelectItem>
                                                  </SelectContent>
                                             </Select>
                                        </div>
                                   </div>

                                   <div className="flex items-center justify-end gap-2">
                                        <Button
                                             variant="ghost"
                                             size="sm"
                                             onClick={() => onModeChange("view")}
                                             disabled={updateUserMutation.isPending}
                                        >
                                             {tCommon("cancel")}
                                        </Button>
                                        <Button
                                             size="sm"
                                             className="rounded-md bg-blue-600 hover:bg-blue-700"
                                             disabled={
                                                  updateUserMutation.isPending ||
                                                  !name.trim() ||
                                                  !email.trim() ||
                                                  !isDirty
                                             }
                                             onClick={async () => {
                                                  if (!user) return;
                                                  try {
                                                       await updateUserMutation.mutateAsync({
                                                            id: user.id,
                                                            payload: {
                                                                 name: name.trim(),
                                                                 email: email.trim(),
                                                                 role,
                                                                 status,
                                                            },
                                                       });
                                                       onModeChange("view");
                                                       onOpenChange(false);
                                                  } catch {
                                                  }
                                             }}
                                        >
                                             {tCommon("save")}
                                        </Button>
                                   </div>
                              </div>
                         )}
                    </DialogPrimitive.Content>
               </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
     );
}
