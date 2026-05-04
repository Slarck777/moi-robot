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
        <h2 className="mb-8 text-center text-2xl font-black tracking-tight">
          Как это работает
        </h2>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="flex gap-4 rounded-2xl border border-border bg-background p-5 fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
