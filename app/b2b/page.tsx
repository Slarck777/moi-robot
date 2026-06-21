import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { station } from "@/lib/station";

export const metadata: Metadata = {
  title: "Корпоративная мойка для автопарков — МОЙ РОБОТ, Мытищи",
  description: "Роботизированная мойка для корпоративных клиентов в Мытищах. Личный кабинет, контроль расходов, договор, 24/7. 2 бесплатные мойки при заключении договора.",
  openGraph: {
    title: "Корпоративная мойка для автопарков — МОЙ РОБОТ",
    description: "Роботизированная бесконтактная мойка для автопарков в Мытищах. Договор, личный кабинет, 24/7.",
    locale: "ru_RU",
    type: "website",
  },
  alternates: { canonical: "https://moi-robot.ru/b2b" },
};
import { B2BContactForm } from "./B2BContactForm";

const ACCENT = "#00AEEF";
const BG = "#3a3a3c";
const CARD = "rgba(255,255,255,0.05)";
const BORDER = "rgba(255,255,255,0.1)";

const STATS = [
  { value: "80 бар", label: "давление воды" },
  { value: "5–15 мин", label: "полный цикл" },
  { value: "360°", label: "обработка кузова" },
  { value: "0 щёток", label: "бесконтактно" },
];

const PROBLEMS = [
  { icon: "⏱", title: "Время", desc: "Водители тратят 20–30 мин на ожидание и мойку" },
  { icon: "💰", title: "Расходы", desc: "Нет контроля: кто, когда и сколько потратил" },
  { icon: "📊", title: "Отчётность", desc: "Никакой аналитики — только наличные" },
];

const SOLUTIONS = [
  { icon: "⚡", title: "5–15 минут", desc: "Водитель не ждёт — проехал и свободен" },
  { icon: "🛡", title: "Без повреждений", desc: "0 щёток, 0 царапин, 0 претензий" },
  { icon: "📱", title: "Личный кабинет", desc: "Контроль расходов онлайн" },
  { icon: "🕐", title: "24 / 7", desc: "В любое время, без очередей" },
];

const HOW_STEPS = [
  { num: "01", title: "Приезжает", desc: "Водитель подъезжает в любое время" },
  { num: "02", title: "Выбирает", desc: "Услугу онлайн или через терминал" },
  { num: "03", title: "Проезжает", desc: "Заезжает на пост 1 или пост 2" },
  { num: "04", title: "Едет дальше", desc: "Чистый автомобиль за считанные минуты" },
];

const CORP_FEATURES = [
  { icon: "👥", title: "Управление водителями", desc: "Добавляйте и удаляйте по номеру телефона" },
  { icon: "💳", title: "Корпоративный баланс", desc: "Пополняйте счёт — водители без наличных" },
  { icon: "📈", title: "Контроль расходов", desc: "Статистика по каждому водителю онлайн" },
  { icon: "🔒", title: "Лимиты и пакеты", desc: "Задайте допустимый пакет каждому водителю" },
];

const START_STEPS = [
  { num: "01", title: "Договор", desc: "Заключаем договор на обслуживание" },
  { num: "02", title: "Личный кабинет", desc: "Создаём кабинет вашей компании" },
  { num: "03", title: "Автопарк", desc: "Добавляем водителей по номеру телефона" },
];

const WHY_ITEMS = [
  { num: "01", title: "Нет очереди", desc: "Ваше время не тратится зря" },
  { num: "02", title: "Личный кабинет", desc: "Отчётность, онлайн-оплата и контроль" },
  { num: "03", title: "Гарантия сохранности ЛКП", desc: "Бесконтактная мойка, нет риска повреждений" },
  { num: "04", title: "Поддержка 24/7", desc: "Бесплатная техническая поддержка" },
  { num: "05", title: "Индивидуальный подход", desc: "Условия под ваш автопарк" },
  { num: "06", title: "Удобство 24/7", desc: "Мойте авто в любое время без ограничений" },
];

const COMPARE_ROWS = [
  { param: "Время мойки",        manual: "25–45 мин + очередь", robot: "5–15 минут",           benefit: "Экономия до 40 минут" },
  { param: "Время водителя",     manual: "Существенные потери", robot: "Практически ноль",      benefit: "10+ часов в месяц" },
  { param: "Очереди",            manual: "Есть",                robot: "Нет",                   benefit: "Машины не простаивают" },
  { param: "Качество мойки",     manual: "Зависит от человека", robot: "Стабильно высокое",     benefit: "Без «рулетки»" },
  { param: "Мойка днища",        manual: "Часто отсутствует",   robot: "Полноценная",           benefit: "Защита от соли и реагентов" },
  { param: "Риск повреждения ЛКП", manual: "Высокий",          robot: "Минимальный",           benefit: "Сохранность автопарка" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "2rem" }}>
      {children}
    </h2>
  );
}

export default function B2BPage() {
  return (
    <main style={{ background: "#414042", color: "#fff", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ padding: "5rem 1.5rem 4rem", maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: 3, color: ACCENT, textTransform: "uppercase", marginBottom: 20 }}>
          Корпоративное сотрудничество
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 24 }}>
          Круглосуточная<br />бесконтактная мойка<br />для автопарков
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 40 }}>
          {["Экономия времени водителей", "Полный контроль расходов", "Работаем 24/7 без очередей"].map(b => (
            <span key={b} style={{ padding: "6px 14px", background: "rgba(0,174,239,0.12)", border: `1px solid rgba(0,174,239,0.3)`, borderRadius: 999, fontSize: 13, color: ACCENT }}>
              {b}
            </span>
          ))}
        </div>
        <a
          href="#contact"
          style={{ display: "inline-block", padding: "14px 40px", background: ACCENT, color: "#0a0e1a", fontWeight: 700, fontSize: 14, letterSpacing: 1, textTransform: "uppercase", borderRadius: 10, textDecoration: "none" }}
        >
          Обсудить сотрудничество
        </a>
      </section>

      {/* Problem */}
      <section style={{ background: "rgba(0,0,0,0.25)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <SectionTitle>Водители теряют время —<br /><span style={{ color: ACCENT }}>вы теряете деньги</span></SectionTitle>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 32, fontSize: 15, lineHeight: 1.6 }}>
            Очереди, разное качество мойки и отсутствие прозрачности — реальные издержки автопарка.
            <strong style={{ color: "#fff" }}> Качество не должно зависеть от человека.</strong>
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {PROBLEMS.map(p => (
              <div key={p.title} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "1.25rem" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
                <p style={{ fontWeight: 700, marginBottom: 6 }}>{p.title}</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: 3, color: ACCENT, textTransform: "uppercase", marginBottom: 8 }}>МОЙ РОБОТ</p>
          <SectionTitle>Роботизированная мойка — что это?</SectionTitle>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 32, fontSize: 14, lineHeight: 1.6 }}>
            Бесконтактная автоматическая система Kolon Wash 360 / Leisuwash 360.<br />
            Высокое давление + химия — без щёток и касания кузова.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 32 }}>
            {STATS.map(s => (
              <div key={s.value} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "1.5rem" }}>
                <p style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontWeight: 900, color: ACCENT, letterSpacing: "-0.02em", marginBottom: 4 }}>{s.value}</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
            {SOLUTIONS.map(s => (
              <div key={s.title} style={{ background: "rgba(0,174,239,0.08)", border: `1px solid rgba(0,174,239,0.2)`, borderRadius: 12, padding: "1.25rem" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                <p style={{ fontWeight: 700, color: ACCENT, marginBottom: 4, fontSize: 14 }}>{s.title}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "rgba(0,0,0,0.25)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: 3, color: ACCENT, textTransform: "uppercase", marginBottom: 8 }}>4 шага</p>
          <SectionTitle>Как работает робот-мойка</SectionTitle>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 32, fontSize: 14 }}>Без администраторов, кассиров и ожидания</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {HOW_STEPS.map(s => (
              <div key={s.num} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "1.25rem" }}>
                <p style={{ fontSize: 32, fontWeight: 900, color: "rgba(0,174,239,0.25)", letterSpacing: "-0.03em", marginBottom: 8, lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontSize: 13 }}>{s.title}</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <SectionTitle>Линейка услуг</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {["Услуга", "Цена", "Время", "Сушка", "Воск"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, letterSpacing: 1, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Техническая", price: "400 ₽", time: "5 мин", dry: false, wax: false },
                  { name: "Экспресс",     price: "600 ₽", time: "8 мин", dry: false, wax: false },
                  { name: "Оптимальная",  price: "850 ₽", time: "12 мин", dry: true,  wax: false },
                  { name: "Стандарт",     price: "1 050 ₽", time: "15 мин", dry: true,  wax: true },
                ].map((r, i) => (
                  <tr key={r.name} style={{ borderBottom: `1px solid ${BORDER}`, background: i === 3 ? "rgba(0,174,239,0.06)" : "transparent" }}>
                    <td style={{ padding: "14px 12px", fontWeight: i === 3 ? 700 : 400 }}>{r.name}</td>
                    <td style={{ padding: "14px 12px", color: i === 3 ? ACCENT : "#fff", fontWeight: 700 }}>{r.price}</td>
                    <td style={{ padding: "14px 12px", color: "rgba(255,255,255,0.6)" }}>{r.time}</td>
                    <td style={{ padding: "14px 12px" }}>{r.dry ? <span style={{ color: ACCENT }}>✓</span> : <span style={{ color: "rgba(255,255,255,0.25)" }}>—</span>}</td>
                    <td style={{ padding: "14px 12px" }}>{r.wax ? <span style={{ color: ACCENT }}>✓</span> : <span style={{ color: "rgba(255,255,255,0.25)" }}>—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
            * Для юридических лиц цены согласовываются индивидуально при заключении договора
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <SectionTitle>Роботизированная vs ручная мойка</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {["Параметр", "Ручная мойка", "МОЙ РОБОТ", "Выгода"].map((h, i) => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, letterSpacing: 1, color: i === 2 ? ACCENT : "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((r, i) => (
                  <tr key={r.param} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                    <td style={{ padding: "14px 12px", fontWeight: 600, fontSize: 13 }}>{r.param}</td>
                    <td style={{ padding: "14px 12px", color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{r.manual}</td>
                    <td style={{ padding: "14px 12px", color: ACCENT, fontWeight: 700, fontSize: 13 }}>{r.robot}</td>
                    <td style={{ padding: "14px 12px", color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{r.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section style={{ background: "rgba(0,0,0,0.25)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <SectionTitle>Почему компании выбирают <span style={{ color: ACCENT }}>МОЙ РОБОТ</span></SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {WHY_ITEMS.map(w => (
              <div key={w.num} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "1.25rem" }}>
                <p style={{ fontSize: 32, fontWeight: 900, color: "rgba(0,174,239,0.2)", letterSpacing: "-0.03em", marginBottom: 8, lineHeight: 1 }}>{w.num}</p>
                <p style={{ fontWeight: 700, marginBottom: 6, fontSize: 14 }}>{w.title}</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate features */}
      <section style={{ background: "rgba(0,0,0,0.1)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <SectionTitle>Всё для юридического лица</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10, marginBottom: 40 }}>
            {CORP_FEATURES.map(f => (
              <div key={f.title} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "1rem 1.25rem", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{f.title}</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, letterSpacing: 3, color: ACCENT, textTransform: "uppercase", marginBottom: 16 }}>Как начать работу</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
            {START_STEPS.map(s => (
              <div key={s.num} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: ACCENT, color: "#0a0e1a", fontWeight: 900, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.num}</span>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: 2, fontSize: 14 }}>{s.title}</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: 3, color: ACCENT, textTransform: "uppercase", marginBottom: 8, textAlign: "center" }}>Готовы начать?</p>
          <SectionTitle><span style={{ textAlign: "center", display: "block" }}>Оставьте заявку</span></SectionTitle>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 20, fontSize: 14, textAlign: "center" }}>
            Подпишем договор и запустим вашу компанию на мойке уже сегодня.
          </p>
          <div style={{ background: "rgba(0,174,239,0.1)", border: `1px solid rgba(0,174,239,0.35)`, borderRadius: 12, padding: "1rem 1.5rem", marginBottom: 32, textAlign: "center" }}>
            <p style={{ fontSize: 11, letterSpacing: 2, color: ACCENT, textTransform: "uppercase", marginBottom: 6 }}>Специальное предложение</p>
            <p style={{ fontWeight: 900, fontSize: "clamp(1.1rem, 4vw, 1.4rem)", marginBottom: 4 }}>ТЕСТ — 2 БЕСПЛАТНЫЕ МОЙКИ</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>Попробуйте сервис без риска — при заключении договора</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, borderRadius: 16, padding: "2rem" }}>
            <B2BContactForm />
          </div>
          <div style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
            Или позвоните напрямую:{" "}
            <a href={`tel:${station.phone}`} style={{ color: ACCENT, textDecoration: "none", fontWeight: 600 }}>{station.phone}</a>
          </div>
        </div>
      </section>

      {/* Back link */}
      <div style={{ textAlign: "center", padding: "1.5rem", borderTop: `1px solid ${BORDER}` }}>
        <Link href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
          ← На главную
        </Link>
      </div>

    </main>
  );
}
