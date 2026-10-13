import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { CurrencyProvider } from "@/context/currency-context";

export const metadata: Metadata = {
  title: "Sogd Realty — Портал недвижимости Согдийской области",
  description:
    "Новостройки от застройщиков, вторичное жилье, дома (ҳавлӣ) и коммерческая недвижимость в Худжанде, Б. Гафурове, Исфаре, Истаравшане и других городах Согда.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <CurrencyProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </CurrencyProvider>
      </body>
    </html>
  );
}


