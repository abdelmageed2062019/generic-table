"use client";

import { DataTableSearch } from "./DataTableSearch";

interface DataTableToolbarProps {
     search: string;
     onSearchChange: (value: string) => void;
     filterSlot?: React.ReactNode;
}

export function DataTableToolbar({
     search,
     onSearchChange,
     filterSlot,
}: DataTableToolbarProps) {
     return (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4">
               {/* Search */}
               <DataTableSearch value={search} onChange={onSearchChange} />

               {/* Filters slot — each feature injects its own filters here */}
               {filterSlot && (
                    <div className="flex items-center gap-2 flex-wrap">
                         {filterSlot}
                    </div>
               )}
          </div>
     );
}