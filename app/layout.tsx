import type { Metadata } from "next";
import { Cairo, Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
     subsets: ["latin"],
     variable: "--font-roboto",
     weight: ["400", "500", "700"],
});

const cairo = Cairo({
     subsets: ["latin", "arabic"],
     variable: "--font-arabic",
});

export const metadata: Metadata = {
     title: "Data Table App",
     description: "Reusable data table with localization",
};

export default async function RootLayout({
     children,
}: {
     children: React.ReactNode;
}) {
     return (
          <html suppressHydrationWarning>
               <head>
                    <script
                         dangerouslySetInnerHTML={{
                              __html:
                                   "(function(){try{var t=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=t==='dark'||(!t&&p);var c=document.documentElement.classList;c.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();",
                         }}
                    />
               </head>
               <body className={`${roboto.variable} ${cairo.variable}`}>{children}</body>
          </html>
     );
}
