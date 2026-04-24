import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
     title: "Data Table App",
     description: "Reusable data table with localization",
};

export default function RootLayout({
     children,
}: {
     children: React.ReactNode;
}) {
     return (
          <html suppressHydrationWarning>
               <body className={geist.className}>{children}</body>
          </html>
     );
}