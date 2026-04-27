"use client";

import { MapPin, Clock, CreditCard, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { station } from "@/lib/station";
import { Logo } from "@/components/shared/Logo";

export function Hero() {
  function handleStart() {
    window.location.href = station.kubonUrl;
  }

  return (
    <section className="flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm text-center"
      >
        {/* Логотип */}
        <div className="mb-8 pt-8">
          <h1 className="flex justify-center">
            <Logo size="md" />
          </h1>
          <p className="mt-4 text-sm font-medium uppercase tracking-widest text-primary">
            {station.tagline}
          </p>
        </div>

        {/* Инфо о станции */}
        <div className="mb-8 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{station.address}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{station.workingHours} · {station.boxCount} поста</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            <span>Оплата через {station.payment}</span>
          </div>
        </div>

        {/* Главная кнопка */}
        <motion.button
          onClick={handleStart}
          whileTap={{ scale: 0.97 }}
          className="group relative w-full overflow-hidden rounded-2xl bg-primary px-8 py-5 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-shadow hover:shadow-primary/40"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Начать мойку
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </span>
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.4 }}
          />
        </motion.button>

        <p className="mt-3 text-xs text-muted-foreground">
          Откроется страница оплаты Kubon
        </p>
      </motion.div>
    </section>
  );
}
