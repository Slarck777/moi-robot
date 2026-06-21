import type { Metadata } from "next";
import { PromoPage } from "@/components/marketing/PromoPage";

export const metadata: Metadata = {
  title: "Скидка 35% на первую мойку — МОЙ РОБОТ, Мытищи",
  description: "Получите промокод на скидку 35% при первом визите на роботизированную мойку в Мытищах. Программы от 300 ₽, круглосуточно.",
  openGraph: {
    title: "Скидка 35% на первую мойку — МОЙ РОБОТ, Мытищи",
    description: "Получите промокод на скидку 35% при первом визите. Роботизированная мойка без щёток, от 300 ₽.",
    locale: "ru_RU",
    type: "website",
  },
  alternates: { canonical: "https://moi-robot.ru/promo" },
};

export default function Promo() {
  return <PromoPage />;
}
