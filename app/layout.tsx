import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ConsentBanner } from "@/components/shared/ConsentBanner";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "МОЙ РОБОТ - мойка без щеток",
  description:
    "Робот-мойка 2 поста в Мытищах, без очередей 24/7, от 300₽",
  keywords: ["автомойка", "мытищи", "роботизированная", "без щёток", "силикатная"],
  openGraph: {
    title: "МОЙ РОБОТ - мойка без щеток",
    description: "Робот-мойка 2 поста в Мытищах, без очередей 24/7, от 300₽",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ConsentBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
