"use client";

import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { ComponentProps, ReactNode } from "react";
import { UsersModeNav } from "@/components/UsersModeNav";

let pathnameMock = "/users-selection";

afterEach(() => {
     cleanup();
});

vi.mock("@/i18n/navigation", () => {
     return {
          Link: ({
               href,
               children,
               ...props
          }: ComponentProps<"a"> & { href: string; children?: ReactNode }) => (
               <a href={href} {...props}>
                    {children}
               </a>
          ),
          usePathname: () => pathnameMock,
     };
});

vi.mock("next-intl", () => {
     return {
          useLocale: () => "en",
          useTranslations: () => (key: string) => key,
     };
});

describe("UsersTable routing", () => {
     it("highlights Selectable Table when on /users-selection", () => {
          pathnameMock = "/users-selection";
          render(<UsersModeNav />);

          expect(screen.getByRole("link", { name: "modes.selectable" })).toHaveAttribute(
               "aria-current",
               "page"
          );
          expect(screen.getByRole("link", { name: "modes.expandable" })).not.toHaveAttribute(
               "aria-current"
          );
     });

     it("highlights Expandable Table when on /users-expandable", () => {
          pathnameMock = "/users-expandable";
          render(<UsersModeNav />);

          expect(screen.getByRole("link", { name: "modes.expandable" })).toHaveAttribute(
               "aria-current",
               "page"
          );
          expect(screen.getByRole("link", { name: "modes.selectable" })).not.toHaveAttribute(
               "aria-current"
          );
     });
});
