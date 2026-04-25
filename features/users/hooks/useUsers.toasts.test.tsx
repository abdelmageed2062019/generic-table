"use client";

import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCreateUser, useDeleteUser } from "./useUsers";

vi.mock("next-intl", () => {
     return {
          useTranslations: () => (key: string) => key,
     };
});

const createUserMock = vi.fn(async (_payload: unknown) => ({ id: "USR-9999" }));
const deleteUserMock = vi.fn(async (_id: string) => { });

vi.mock("../api/users.api", () => {
     return {
          fetchUsers: vi.fn(),
          createUser: (payload: unknown) => createUserMock(payload),
          deleteUser: (id: string) => deleteUserMock(id),
     };
});

vi.mock("sonner", () => {
     return {
          toast: {
               success: vi.fn(),
               error: vi.fn(),
          },
     };
});

function CreateButton() {
     const mutation = useCreateUser();
     return (
          <button
               type="button"
               onClick={() =>
                    mutation.mutate({
                         name: "New User",
                         email: "new.user@example.com",
                         role: "user",
                         status: "active",
                    })
               }
          >
               create
          </button>
     );
}

function DeleteButton() {
     const mutation = useDeleteUser();
     return (
          <button type="button" onClick={() => mutation.mutate("USR-1001")}>
               delete
          </button>
     );
}

function renderWithQueryClient(ui: React.ReactNode) {
     const queryClient = new QueryClient({
          defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
     });
     return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("useUsers toasts", () => {
     it("shows success toast when user is created", async () => {
          renderWithQueryClient(<CreateButton />);
          fireEvent.click(screen.getByText("create"));

          await waitFor(() => {
               expect(toast.success).toHaveBeenCalledWith("userCreated");
          });
     });

     it("shows success toast when user is deleted", async () => {
          renderWithQueryClient(<DeleteButton />);
          fireEvent.click(screen.getByText("delete"));

          await waitFor(() => {
               expect(toast.success).toHaveBeenCalledWith("userDeleted");
          });
     });
});
