import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ConsentBanner } from "@/components/shared/ConsentBanner";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://moi-robot.ru"),
  title: "МОЙ РОБОТ — Роботизированная мойка в Мытищах",
  description:
    "Роботизированная бесконтактная мойка без щёток в Мытищах. 2 поста, круглосуточно, от 300 ₽. Оплата через СБП — без очередей и наличных.",
  keywords: [
    "автомойка мытищи",
    "роботизированная мойка",
    "бесконтактная мойка",
    "мойка без щёток",
    "силикатная мытищи",
    "автомойка круглосуточно",
    "мойка СБП",
  ],
  openGraph: {
    title: "МОЙ РОБОТ — Роботизированная мойка в Мытищах",
    description: "Бесконтактная мойка без щёток. 2 поста, круглосуточно, от 300 ₽. Оплата через СБП.",
    locale: "ru_RU",
    type: "website",
    url: "https://moi-robot.ru",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://moi-robot.ru" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CarWash",
  name: "МОЙ РОБОТ",
  description: "Роботизированная бесконтактная мойка без щёток в Мытищах. 2 поста, круглосуточно.",
  url: "https://moi-robot.ru",
  telephone: "+79852127775",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Силикатная с10",
    addressLocality: "Мытищи",
    addressRegion: "Московская область",
    postalCode: "141021",
    addressCountry: "RU",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  priceRange: "₽₽",
  paymentAccepted: "СБП",
  currenciesAccepted: "RUB",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Программы мойки",
    itemListElement: [
      { "@type": "Offer", name: "Техническая", price: "400", priceCurrency: "RUB" },
      { "@type": "Offer", name: "Экспресс", price: "600", priceCurrency: "RUB" },
      { "@type": "Offer", name: "Оптимальная", price: "850", priceCurrency: "RUB" },
      { "@type": "Offer", name: "Стандарт", price: "1050", priceCurrency: "RUB" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${manrope.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <ConsentBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
