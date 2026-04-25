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
               <body className={`${roboto.variable} ${cairo.variable}`}>{children}</body>
          </html>
     );
}
