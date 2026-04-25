"use client";

import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";

type Props = {
     locale: string;
     messages: AbstractIntlMessages;
     children: React.ReactNode;
};

export function I18nProvider({ locale, messages, children }: Props) {
     return (
          <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
               {children}
          </NextIntlClientProvider>
     );
}
