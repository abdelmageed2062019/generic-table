"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type Props = {
     error: Error & { digest?: string };
     reset: () => void;
};

export default function ErrorBoundary({ reset }: Props) {
     const t = useTranslations("errors");

     return (
          <div className="mx-auto flex max-w-xl flex-col gap-3 rounded-lg border bg-card p-6 text-card-foreground">
               <h1 className="text-lg font-semibold">{t("title")}</h1>
               <p className="text-sm text-muted-foreground">{t("description")}</p>
               <div className="flex items-center justify-end">
                    <Button type="button" onClick={reset}>
                         {t("retry")}
                    </Button>
               </div>
          </div>
     );
}
