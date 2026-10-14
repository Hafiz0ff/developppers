import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Интерактивная карта недвижимости Согдийской области | Maskani.tj",
  description:
    "Полноэкранная гео-карта новостроек, квартир и домов в Худжанде, Гулистоне, Б. Гафурове и Согде. Поиск жилья с точными ценами, контактами и маршрутами.",
  keywords: [
    "карта недвижимости Худжанд",
    "новостройки на карте Худжанд",
    "квартиры на карте Согд",
    "харитаи амволи Хуҷанд",
    "ҳавлӣ дар харита",
    "Maskani.tj",
    "недвижимость Таджикистан",
  ],
  openGraph: {
    title: "Интерактивная гео-карта недвижимости Согда | Maskani.tj",
    description:
      "Ищите новостройки, вторичные квартиры и дома (ҳавлӣ) прямо на интерактивной карте Согдийской области. Реальные цены и маршруты.",
    url: "https://sogd-realty.vercel.app/map",
    siteName: "Maskani.tj",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Интерактивная гео-карта недвижимости Согда | Maskani.tj",
    description:
      "Полноэкранная карта новостроек, квартир и домов в Худжанде и Согдийской области с точными ценами и маршрутами.",
  },
  alternates: {
    canonical: "/map",
  },
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
