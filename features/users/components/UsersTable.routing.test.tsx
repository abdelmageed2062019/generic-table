"use client";

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UsersTable } from "./UsersTable";

const pushMock = vi.fn();

vi.mock("next/navigation", () => {
     return {
          useRouter: () => ({ push: pushMock }),
          usePathname: () => "/en/users-selection",
     };
});

vi.mock("next-intl", () => {
     return {
          useLocale: () => "en",
          useTranslations: () => (key: string) => key,
     };
});

vi.mock("@/components/data-table", () => {
     return {
          DataTable: () => <div data-testid="datatable" />,
          DataTableColumnHeader: () => <div />,
          DataTableRowActions: () => <div />,
     };
});

vi.mock("./UsersFilters", () => {
     return {
          UsersFilters: () => <div data-testid="filters" />,
     };
});

vi.mock("./UserRowActions", () => {
     return {
          UserRowActions: () => <div data-testid="row-actions" />,
     };
});

vi.mock("./UserExpandedRow", () => {
     return {
          UserExpandedRow: () => <div data-testid="expanded" />,
     };
});

vi.mock("../hooks/useUsers", () => {
     return {
          useUsers: () => ({ data: { data: [], total: 0 }, isLoading: false }),
          useCreateUser: () => ({ mutateAsync: vi.fn(), isPending: false }),
     };
});

describe("UsersTable routing", () => {
     it("navigates to /users-expandable when switching tab", async () => {
          pushMock.mockClear();
          render(<UsersTable />);

          const user = userEvent.setup();
          await user.click(screen.getByRole("tab", { name: "modes.expandable" }));

          expect(pushMock).toHaveBeenCalledWith("/en/users-expandable");
     });
});
