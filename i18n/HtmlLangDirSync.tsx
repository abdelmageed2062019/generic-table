"use client";

import { useEffect } from "react";

export function HtmlLangDirSync({
     lang,
     dir,
}: {
     lang: string;
     dir: "ltr" | "rtl";
}) {
     useEffect(() => {
          document.documentElement.lang = lang;
          document.documentElement.dir = dir;
     }, [lang, dir]);

     return null;
}
