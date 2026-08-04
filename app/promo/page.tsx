import type { Metadata } from "next";
import { PromoPage } from "@/components/marketing/PromoPage";

export const metadata: Metadata = {
  title: "МОЙ РОБОТ — скидка 35% на первый визит",
  description: "Робот-мойка 2 поста в Мытищах, без очередей 24/7, от 250₽. Получите промокод на скидку 35% при первом визите.",
  openGraph: {
    title: "МОЙ РОБОТ — скидка 35% на первый визит",
    description: "Робот-мойка 2 поста в Мытищах, без очередей 24/7, от 250₽. Получите промокод на скидку 35% при первом визите.",
    locale: "ru_RU",
    type: "website",
  },
};

export default function Promo() {
  return <PromoPage />;
}
