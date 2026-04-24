import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { locales, localeConfig, type Locale } from "../../i18n/config";
import { QueryProvider } from "../../providers/QueryProvider";
import { I18nProvider } from "../../providers/I18nProvider";
import { LanguageSwitcher } from "../../i18n/LanguageSwitcher";

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

     const messages = await getMessages();
     const { dir } = localeConfig[locale as Locale];

     return (
          <QueryProvider>
               <I18nProvider locale={locale} messages={messages}>
                    <div lang={locale} dir={dir} className="min-h-screen bg-background">
                         {/* Navbar */}
                         <header className="border-b bg-card">
                              <div className="container mx-auto flex h-14 items-center justify-between px-4">
                                   <nav className="flex items-center gap-6">
                                        <span className="font-semibold text-lg">DataApp</span>
                                   </nav>
                                   <LanguageSwitcher />
                              </div>
                         </header>

                         {/* Page content */}
                         <main className="container mx-auto px-4 py-8">{children}</main>
                    </div>
               </I18nProvider>
          </QueryProvider>
     );
}
