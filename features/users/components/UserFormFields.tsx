"use client";

import { useTranslations } from "next-intl";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import type { UserRole, UserStatus } from "../types/user.types";

export type UserFormValues = {
     name: string;
     email: string;
     role: UserRole;
     status: UserStatus;
};

function FieldErrorMessage({
     message,
}: {
     message: string | null;
}) {
     if (!message) return null;
     return <div className="text-destructive text-xs">{message}</div>;
}

export function UserFormFields({
     register,
     control,
     errors,
}: {
     register: UseFormRegister<UserFormValues>;
     control: Control<UserFormValues>;
     errors: FieldErrors<UserFormValues>;
}) {
     const t = useTranslations("users");
     const tValidation = useTranslations("users.validation");

     const nameError =
          errors.name?.type === "required"
               ? tValidation("required")
               : errors.name?.type === "minLength"
                    ? tValidation("nameMin", { min: 2 })
                    : null;

     const emailError =
          errors.email?.type === "required"
               ? tValidation("required")
               : errors.email?.type === "pattern"
                    ? tValidation("emailInvalid")
                    : null;

     const roleError = errors.role?.type === "required" ? tValidation("required") : null;
     const statusError = errors.status?.type === "required" ? tValidation("required") : null;

     return (
          <div className="grid gap-3">
               <div className="grid gap-1.5">
                    <span className="text-muted-foreground text-xs">{t("columns.name")}</span>
                    <Input
                         autoComplete="name"
                         aria-invalid={Boolean(errors.name)}
                         {...register("name", { required: true, minLength: 2 })}
                    />
                    <FieldErrorMessage message={nameError} />
               </div>

               <div className="grid gap-1.5">
                    <span className="text-muted-foreground text-xs">{t("columns.email")}</span>
                    <Input
                         inputMode="email"
                         autoComplete="email"
                         aria-invalid={Boolean(errors.email)}
                         {...register("email", {
                              required: true,
                              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                         })}
                    />
                    <FieldErrorMessage message={emailError} />
               </div>

               <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1.5">
                         <span className="text-muted-foreground text-xs">{t("filters.role")}</span>
                         <Controller
                              control={control}
                              name="role"
                              rules={{ required: true }}
                              render={({ field }) => (
                                   <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger
                                             className="w-full"
                                             aria-invalid={Boolean(errors.role)}
                                        >
                                             <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="admin">{t("filters.admin")}</SelectItem>
                                             <SelectItem value="moderator">{t("filters.moderator")}</SelectItem>
                                             <SelectItem value="user">{t("filters.user")}</SelectItem>
                                        </SelectContent>
                                   </Select>
                              )}
                         />
                         <FieldErrorMessage message={roleError} />
                    </div>

                    <div className="grid gap-1.5">
                         <span className="text-muted-foreground text-xs">{t("filters.status")}</span>
                         <Controller
                              control={control}
                              name="status"
                              rules={{ required: true }}
                              render={({ field }) => (
                                   <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger
                                             className="w-full"
                                             aria-invalid={Boolean(errors.status)}
                                        >
                                             <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="active">{t("filters.active")}</SelectItem>
                                             <SelectItem value="inactive">{t("filters.inactive")}</SelectItem>
                                             <SelectItem value="banned">{t("filters.banned")}</SelectItem>
                                        </SelectContent>
                                   </Select>
                              )}
                         />
                         <FieldErrorMessage message={statusError} />
                    </div>
               </div>
          </div>
     );
}

