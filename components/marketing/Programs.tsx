"use client";

import { Clock, Star } from "lucide-react";
import { motion } from "motion/react";
import { station } from "@/lib/station";

const MAX_LEVEL = 4;

const levelLabel: Record<number, string> = {
  1: "Базовая",
  2: "Средняя",
  3: "Глубокая",
  4: "Максимальная",
};

function CleanMeter({ level }: { level: number }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Очистка</span>
      <div className="flex items-center gap-1">
        {Array.from({ length: MAX_LEVEL }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 26"
            className={`h-3.5 w-2.5 transition-colors ${
              i < level ? "text-primary" : "text-muted-foreground/25"
            }`}
            fill="currentColor"
          >
            <path d="M10,2 C7,7 2,13 2,18 a8,8 0 0,0 16,0 C18,13 13,7 10,2 Z" />
          </svg>
        ))}
      </div>
      <span className="text-xs font-medium text-primary">
        {levelLabel[level]}
      </span>
    </div>
  );
}

export function Programs() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center text-2xl font-black tracking-tight"
        >
          Программы мойки
        </motion.h2>

        <div className="grid gap-3">
          {station.programs.map((program, i) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative rounded-2xl border p-5 transition-colors ${
                program.popular
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              {program.popular && (
                <div className="absolute -top-3 left-4 flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                  <Star className="h-3 w-3 fill-current" />
                  Популярное
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold">{program.name}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>~{program.duration} мин</span>
                  </div>
                  <CleanMeter level={program.cleanLevel} />
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {program.steps.join(" · ")}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-2xl font-black text-primary">
                    {program.price.toLocaleString("ru-RU")}
                  </span>
                  <span className="text-sm text-muted-foreground"> ₽</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
