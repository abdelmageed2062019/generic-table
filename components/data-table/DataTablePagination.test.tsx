"use client";

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useReactTable, getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { DataTablePagination } from "./DataTablePagination";

vi.mock("next-intl", () => {
     return {
          useLocale: () => "en",
          useTranslations: () => (key: string) => key,
     };
});

type Row = { id: string };

function TestPagination() {
     const table = useReactTable<Row>({
          data: Array.from({ length: 30 }, (_, i) => ({ id: String(i + 1) })),
          columns: [{ accessorKey: "id", header: "id" }],
          getCoreRowModel: getCoreRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
          state: { pagination: { pageIndex: 0, pageSize: 10 } },
     });

     return <DataTablePagination table={table} />;
}

describe("DataTablePagination", () => {
     it("renders fixed-direction arrow buttons", () => {
          render(<TestPagination />);

          const first = screen.getByTitle("first");
          const previous = screen.getByTitle("previous");
          const next = screen.getByTitle("next");
          const last = screen.getByTitle("last");

          expect(first.querySelector("svg.lucide-chevrons-left")).toBeTruthy();
          expect(previous.querySelector("svg.lucide-chevron-left")).toBeTruthy();
          expect(next.querySelector("svg.lucide-chevron-right")).toBeTruthy();
          expect(last.querySelector("svg.lucide-chevrons-right")).toBeTruthy();
     });
});
