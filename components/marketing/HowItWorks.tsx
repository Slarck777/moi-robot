"use client";

import { motion } from "motion/react";

const steps = [
  {
    num: "01",
    title: "Подъезжайте",
    desc: "Заезжайте в свободный бокс. Система сама покажет какой бокс доступен.",
  },
  {
    num: "02",
    title: "Нажмите «Начать мойку»",
    desc: "Кнопка выше ведёт на страницу оплаты. Войдите по номеру телефона и выберите программу.",
  },
  {
    num: "03",
    title: "Оплатите через СБП",
    desc: "Оплата за несколько секунд через любой банк. Робот запустится автоматически.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-card px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center text-2xl font-black tracking-tight"
        >
          Как это работает
        </motion.h2>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex gap-4 rounded-2xl border border-border bg-background p-5"
            >
              <span className="shrink-0 text-3xl font-black text-primary/30">
                {step.num}
              </span>
              <div>
                <h3 className="font-bold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
