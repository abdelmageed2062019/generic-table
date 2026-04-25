"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDirection } from "@/components/ui/direction";
import { cn } from "@/lib/utils";
import { formatLongDate } from "@/lib/formatters";
import { useUpdateUser } from "../hooks/useUsers";
import type { User } from "../types/user.types";
import { UserFormFields, type UserFormValues } from "./UserFormFields";

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

     const editDefaultValues: UserFormValues = useMemo(
          () => ({
               name: user?.name ?? "",
               email: user?.email ?? "",
               role: user?.role ?? "user",
               status: user?.status ?? "active",
          }),
          [user]
     );

     const editForm = useForm<UserFormValues>({
          defaultValues: editDefaultValues,
          mode: "onChange",
     });

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
                              <form
                                   className="mt-5 grid gap-4"
                                   onSubmit={editForm.handleSubmit(async (values) => {
                                        if (!user) return;
                                        try {
                                             await updateUserMutation.mutateAsync({
                                                  id: user.id,
                                                  payload: {
                                                       name: values.name.trim(),
                                                       email: values.email.trim(),
                                                       role: values.role,
                                                       status: values.status,
                                                  },
                                             });
                                             onModeChange("view");
                                             onOpenChange(false);
                                        } catch {
                                        }
                                   })}
                              >
                                   <UserFormFields
                                        register={editForm.register}
                                        control={editForm.control}
                                        errors={editForm.formState.errors}
                                   />

                                   <div className="flex items-center justify-end gap-2">
                                        <Button
                                             variant="ghost"
                                             size="sm"
                                             type="button"
                                             onClick={() => {
                                                  editForm.reset(editDefaultValues);
                                                  onModeChange("view");
                                             }}
                                             disabled={updateUserMutation.isPending}
                                        >
                                             {tCommon("cancel")}
                                        </Button>
                                        <Button
                                             size="sm"
                                             type="submit"
                                             className="rounded-md bg-blue-600 hover:bg-blue-700"
                                             disabled={
                                                  updateUserMutation.isPending ||
                                                  !editForm.formState.isValid ||
                                                  !editForm.formState.isDirty
                                             }
                                        >
                                             {tCommon("save")}
                                        </Button>
                                   </div>
                              </form>
                         )}
                    </DialogPrimitive.Content>
               </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
     );
}
