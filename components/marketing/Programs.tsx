import { Clock, Star } from "lucide-react";
import { station } from "@/lib/station";

const levelLabel: Record<number, string> = {
  1: "Базовая",
  2: "Лёгкая",
  3: "Средняя",
  4: "Улучшенная",
  5: "Максимальная",
};

function CleanMeter({ level }: { level: number }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Очистка</span>
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
        <h2 className="mb-2 text-center text-2xl font-black tracking-tight">
          Программы мойки
        </h2>
        <p className="mb-8 text-center text-xs text-muted-foreground">
          Ночной тариф действует {station.nightHours}
        </p>

        <div className="grid gap-3">
          {station.programs.map((program, i) => (
            <div
              key={program.id}
              className={`relative rounded-2xl border p-5 fade-up ${
                program.popular
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card"
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
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
                  <p className="text-xs font-medium uppercase tracking-wide text-primary/80">
                    {program.subtitle}
                  </p>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />~{program.duration} мин
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                      +{program.bonus} бонусов
                    </span>
                  </div>

                  <CleanMeter level={program.cleanLevel} />

                  <p className="mt-2 text-xs leading-relaxed text-foreground/75">
                    {program.description}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {program.steps.join(" · ")}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <div>
                    <span className="text-2xl font-black text-primary">
                      {program.price.toLocaleString("ru-RU")}
                    </span>
                    <span className="text-sm text-muted-foreground"> ₽</span>
                  </div>
                  <p className="mt-0.5 whitespace-nowrap text-xs text-muted-foreground">
                    ночью {program.nightPrice.toLocaleString("ru-RU")} ₽
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
