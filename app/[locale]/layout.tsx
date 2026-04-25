import { notFound } from "next/navigation";
import Link from "next/link";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Database } from "lucide-react";
import { locales, localeConfig, type Locale } from "../../i18n/config";
import { QueryProvider } from "../../providers/QueryProvider";
import { I18nProvider } from "../../providers/I18nProvider";
import { LanguageSwitcher } from "../../i18n/LanguageSwitcher";
import { HtmlLangDirSync } from "../../i18n/HtmlLangDirSync";
import { DirectionProvider } from "../../components/ui/direction";
import { Toaster } from "../../components/ui/sonner";
import { UsersModeNav } from "../../components/UsersModeNav";

type Props = {
     children: React.ReactNode;
     params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
     return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
     const { locale } = await params;

     if (!locales.includes(locale as Locale)) {
          notFound();
     }

     setRequestLocale(locale);
     const messages = await getMessages();
     const { dir } = localeConfig[locale as Locale];

     return (
          <QueryProvider>
               <I18nProvider locale={locale} messages={messages}>
                    <HtmlLangDirSync lang={locale} dir={dir} />
                    <DirectionProvider
                         direction={dir}
                         lang={locale}
                         className="min-h-screen bg-gray-100"
                    >
                         <header className="border-b bg-card">
                              <div className="container mx-auto flex h-14 items-center gap-4 px-4">
                                   <div className="flex items-center gap-6">
                                        <Link href={`/${locale}`} className="inline-flex items-center">
                                             <Database className="h-5 w-5" aria-hidden />
                                             <span className="sr-only">DataApp</span>
                                        </Link>
                                   </div>

                                   <div className="flex flex-1 items-center justify-center">
                                        <UsersModeNav />
                                   </div>

                                   <div className="flex items-center justify-end">
                                        <LanguageSwitcher />
                                   </div>
                              </div>
                         </header>
                         <main className="container mx-auto px-4 py-8 ">{children}</main>
                         <Toaster dir={dir} position={dir === "rtl" ? "top-left" : "top-right"} />
                    </DirectionProvider>
               </I18nProvider>
          </QueryProvider>
     );
}
