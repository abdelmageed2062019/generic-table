"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { fetchUsers, deleteUser, createUser } from "../api/users.api";
import type { CreateUserInput, UsersParams } from "../types/user.types";

// Query key factory — keeps keys consistent across the app
export const usersKeys = {
     all: ["users"] as const,
     list: (params: UsersParams) => ["users", "list", params] as const,
};

// Fetches paginated + filtered users — re-runs whenever params change
export function useUsers(params: UsersParams) {
     return useQuery({
          queryKey: usersKeys.list(params),
          queryFn: () => fetchUsers(params),
          placeholderData: (prev) => prev, // keeps old data visible while fetching new page
     });
}

// Deletes a user and invalidates the cache so the table refreshes
export function useDeleteUser() {
     const queryClient = useQueryClient();
     const t = useTranslations("users.toasts");

     return useMutation({
          mutationFn: (id: string) => deleteUser(id),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: usersKeys.all });
               toast.success(t("userDeleted"));
          },
          onError: () => {
               toast.error(t("deleteError"));
          },
     });
}

// Creates a user and invalidates the cache so the table refreshes    
export function useCreateUser() {
     const queryClient = useQueryClient();
     const t = useTranslations("users.toasts");

     return useMutation({
          mutationFn: (payload: CreateUserInput) => createUser(payload),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: usersKeys.all });
               toast.success(t("userCreated"));
          },
          onError: () => {
               toast.error(t("createError"));
          },
     });
}
