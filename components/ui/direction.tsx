"use client";

import { createContext, useContext } from "react";

type Direction = "ltr" | "rtl";

const DirectionContext = createContext<Direction>("ltr");

export function DirectionProvider({
     direction,
     lang,
     className,
     children,
}: {
     direction: Direction;
     lang?: string;
     className?: string;
     children: React.ReactNode;
}) {
     return (
          <DirectionContext.Provider value={direction}>
               <div dir={direction} lang={lang} className={className}>
                    {children}
               </div>
          </DirectionContext.Provider>
     );
}

export function useDirection() {
     return useContext(DirectionContext);
}
