import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { CurrencyProvider } from "@/context/currency-context";
import { LanguageProvider } from "@/context/language-context";
import { PwaInstallPrompt } from "@/components/modules/pwa-install-prompt";

export const viewport: Viewport = {
  themeColor: "#0D9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Maskani — Недвижимость в Худжанде, Душанбе и по всему Таджикистану",
  description:
    "Купить квартиру в новостройке от застройщика, дома (ҳавлӣ), вторичное жильё и коммерция. Интерактивные шахматки и B2B CRM для маклеров на Maskani.tj",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Maskani",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased font-sans">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Maskani" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <LanguageProvider>
          <CurrencyProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <PwaInstallPrompt />
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
