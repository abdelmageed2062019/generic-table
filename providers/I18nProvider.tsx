"use client";

import { NextIntlClientProvider } from "next-intl";

type Props = {
     locale: string;
     messages: Record<string, string>;
     children: React.ReactNode;
};

export function I18nProvider({ locale, messages, children }: Props) {
     return (
          <NextIntlClientProvider locale={locale} messages={messages}>
               {children}
          </NextIntlClientProvider>
     );
}