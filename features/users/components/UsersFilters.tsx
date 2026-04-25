"use client";

import * as React from "react";

import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import {
     Calendar as CalendarIcon,
     ChevronDown,
     ChevronLeft,
     ChevronRight,
     ChevronUp,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Popover as PopoverPrimitive } from "radix-ui";
import { DayPicker } from "react-day-picker";
import { arSA as arSADayPicker, enUS as enUSDayPicker } from "react-day-picker/locale";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import { useDirection } from "@/components/ui/direction";
import { cn } from "@/lib/utils";
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
     const locale = useLocale();
     const direction = useDirection();
     const t = useTranslations("users.filters");
     const tCommon = useTranslations("common");

     const hasActiveFilters = role !== "" || status !== "" || joinedDate !== "";
     const dateFnsLocale = locale === "ar" ? arSA : enUS;
     const dayPickerLocale = locale === "ar" ? arSADayPicker : enUSDayPicker;

     const selectedDate = React.useMemo(() => {
          if (!joinedDate) return undefined;
          const parts = joinedDate.split("-").map((p) => Number(p));
          if (parts.length !== 3) return undefined;
          const [year, month, day] = parts;
          if (!year || !month || !day) return undefined;
          return new Date(year, month - 1, day);
     }, [joinedDate]);

     const setSelectedDate = (date: Date | undefined) => {
          if (!date) {
               onJoinedDateChange("");
               return;
          }

          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          onJoinedDateChange(`${year}-${month}-${day}`);
     };

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

               <PopoverPrimitive.Root>
                    <PopoverPrimitive.Trigger asChild>
                         <Button
                              variant="outline"
                              data-empty={!selectedDate}
                              dir={direction}
                              className="w-[170px] justify-between text-start font-normal data-[empty=true]:text-muted-foreground"
                         >
                              <CalendarIcon className="h-4 w-4 opacity-70" />
                              {selectedDate ? (
                                   format(selectedDate, "PPP", { locale: dateFnsLocale })
                              ) : (
                                   <span>{t("joinedDate")}</span>
                              )}
                              <ChevronDown className="ms-auto h-4 w-4 opacity-70" />
                         </Button>
                    </PopoverPrimitive.Trigger>
                    <PopoverPrimitive.Portal>
                         <PopoverPrimitive.Content
                              dir={direction}
                              align="start"
                              sideOffset={6}
                              className="z-50 w-auto rounded-md border bg-popover p-3 text-popover-foreground shadow-md outline-hidden"
                         >
                              <DayPicker
                                   mode="single"
                                   selected={selectedDate}
                                   onSelect={setSelectedDate}
                                   initialFocus
                                   locale={dayPickerLocale}
                                   dir={direction}
                                   className="p-0"
                                   classNames={{
                                        root: "p-0",
                                        months: "flex flex-col",
                                        month: "space-y-4",
                                        month_caption:
                                             "flex justify-center pt-1 relative items-center",
                                        caption_label: "text-sm font-medium",
                                        nav: "flex items-center gap-1",
                                        button_previous: cn(
                                             buttonVariants({
                                                  variant: "outline",
                                                  size: "icon-sm",
                                             }),
                                             "absolute start-1 bg-transparent p-0 opacity-60 hover:opacity-100"
                                        ),
                                        button_next: cn(
                                             buttonVariants({
                                                  variant: "outline",
                                                  size: "icon-sm",
                                             }),
                                             "absolute end-1 bg-transparent p-0 opacity-60 hover:opacity-100"
                                        ),
                                        month_grid:
                                             "w-full border-collapse space-y-1",
                                        weekdays: "flex",
                                        weekday:
                                             "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center",
                                        weeks: "flex flex-col w-full",
                                        week: "flex w-full mt-2",
                                        day: "relative h-9 w-9 p-0 text-center text-sm rounded-md focus-within:relative focus-within:z-20",
                                        day_button: cn(
                                             buttonVariants({
                                                  variant: "ghost",
                                                  size: "icon",
                                             }),
                                             "h-9 w-9 p-0 font-normal"
                                        ),
                                        selected:
                                             "bg-primary text-primary-foreground",
                                        today: "bg-accent text-accent-foreground",
                                        outside: "text-muted-foreground opacity-50",
                                        disabled: "text-muted-foreground opacity-50",
                                        hidden: "invisible",
                                   }}
                                   components={{
                                        Chevron: ({ className, orientation, size }) => {
                                             const resolvedOrientation =
                                                  direction === "rtl"
                                                       ? orientation === "left"
                                                            ? "right"
                                                            : orientation === "right"
                                                                 ? "left"
                                                                 : orientation
                                                       : orientation;

                                             const iconProps = {
                                                  className,
                                                  size,
                                             };

                                             if (resolvedOrientation === "up") {
                                                  return <ChevronUp {...iconProps} />;
                                             }

                                             if (resolvedOrientation === "down") {
                                                  return <ChevronDown {...iconProps} />;
                                             }

                                             if (resolvedOrientation === "right") {
                                                  return <ChevronRight {...iconProps} />;
                                             }

                                             return <ChevronLeft {...iconProps} />;
                                        },
                                   }}
                              />
                         </PopoverPrimitive.Content>
                    </PopoverPrimitive.Portal>
               </PopoverPrimitive.Root>

               {/* Reset button — only shows when a filter is active */}
               {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={onReset}>
                         {tCommon("reset")}
                    </Button>
               )}
          </div>
     );
}
