"use client";

import { useState, useMemo } from "react";
import { station } from "@/lib/station";

const ACCENT = "#00AEEF";
const BG_DEEP = "#0a0e1a";
const BG_CARD = "#0f1420";

const TIERS = [
  {
    name: "Техническая",
    price: 400,
    time: "5 мин",
    status: "Базовая промывка",
    carColor: "#3a4458",
    glow: 0,
    dirt: 1,
    drops: 0,
    shine: 0,
    windowReflect: 0,
    headlight: 0.3,
    spray: false,
    steam: false,
    robotY: 0,
    services: [
      { label: "Мойка днища и порогов", on: false },
      { label: "Ополаскивание", on: false },
      { label: "Эмульсия и пенный состав", on: true },
      { label: "Смыв водой", on: true },
      { label: "Обмыв мягкой водой ОСМОС", on: false },
      { label: "Жидкая сушка и гидрофоб (воск)", on: false },
    ],
  },
  {
    name: "Экспресс",
    price: 600,
    time: "8 мин",
    status: "Мойка кузова",
    carColor: "#4a5670",
    glow: 0.12,
    dirt: 0.45,
    drops: 0.7,
    shine: 0,
    windowReflect: 0.1,
    headlight: 0.55,
    spray: true,
    steam: false,
    robotY: 20,
    services: [
      { label: "Мойка днища и порогов", on: true },
      { label: "Ополаскивание", on: true },
      { label: "Эмульсия и пенный состав", on: true },
      { label: "Смыв водой", on: true },
      { label: "Обмыв мягкой водой ОСМОС", on: false },
      { label: "Жидкая сушка и гидрофоб (воск)", on: false },
    ],
  },
  {
    name: "Оптимальная",
    price: 850,
    time: "12 мин",
    status: "Глубокая очистка",
    carColor: "#1e3a5f",
    glow: 0.3,
    dirt: 0.1,
    drops: 0.3,
    shine: 0.45,
    windowReflect: 0.3,
    headlight: 0.8,
    spray: true,
    steam: true,
    robotY: 12,
    services: [
      { label: "Мойка днища и порогов", on: true },
      { label: "Ополаскивание", on: true },
      { label: "Эмульсия и пенный состав", on: true },
      { label: "Смыв водой", on: true },
      { label: "Обмыв мягкой водой ОСМОС", on: true },
      { label: "Жидкая сушка и гидрофоб (воск)", on: false },
    ],
  },
  {
    name: "Стандарт",
    price: 1050,
    time: "15 мин",
    status: "Максимальный блеск",
    carColor: "#0a2a52",
    glow: 0.55,
    dirt: 0,
    drops: 0,
    shine: 0.95,
    windowReflect: 0.5,
    headlight: 1,
    spray: false,
    steam: true,
    robotY: 0,
    services: [
      { label: "Мойка днища и порогов", on: true },
      { label: "Ополаскивание", on: true },
      { label: "Эмульсия и пенный состав", on: true },
      { label: "Смыв водой", on: true },
      { label: "Обмыв мягкой водой ОСМОС", on: true },
      { label: "Жидкая сушка и гидрофоб (воск)", on: true },
    ],
  },
];

function useParticles(seed: number, count: number, type: "spray" | "steam") {
  return useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const r = ((seed * 9301 + i * 49297) % 233280) / 233280;
      const r2 = ((seed * 49297 + i * 9301) % 233280) / 233280;
      if (type === "spray") {
        return { cx: 260 + r * 80, cy: 115 + r2 * 45, radius: 1 + r * 2.2, opacity: 0.35 + r2 * 0.45 };
      }
      return { cx: 180 + r * 240, cy: 125 + r2 * 35, radius: 16 + r * 14, opacity: 0.03 + r2 * 0.05 };
    });
  }, [seed, count, type]);
}

export function ProgramsWidget() {
  const [idx, setIdx] = useState(0);
  const tier = TIERS[idx];

  const sprayParticles = useParticles(idx * 7 + 3, 14, "spray");
  const steamParticles = useParticles(idx * 13 + 5, 8, "steam");

  const sliderBg = `linear-gradient(to right, ${ACCENT} 0%, ${ACCENT} ${(idx / 3) * 100}%, rgba(255,255,255,0.1) ${(idx / 3) * 100}%, rgba(255,255,255,0.1) 100%)`;

  function handleStart() {
    window.location.href = station.kubonUrl;
  }

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-8 text-center text-2xl font-black tracking-tight">
          Программы мойки
        </h2>

        <div style={{ background: BG_CARD, borderRadius: 16, overflow: "hidden" }}>

          {/* Header */}
          <div style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
              <span style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
                МОЙ РОБОТ · Online
              </span>
            </div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{tier.time}</span>
          </div>

          {/* Car scene */}
          <div style={{ position: "relative", height: 260, overflow: "hidden", background: `radial-gradient(ellipse at 50% 90%, #1a2540 0%, ${BG_DEEP} 70%)` }}>

            {/* Floor grid */}
            <svg viewBox="0 0 600 260" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMax slice">
              {[190, 210, 232, 260].map((y, i) => (
                <line key={i} x1="0" y1={y} x2="600" y2={y} stroke={`rgba(0,174,239,${0.06 + i * 0.02})`} strokeWidth="0.5" />
              ))}
              <line x1="100" y1="260" x2="280" y2="185" stroke="rgba(0,174,239,0.05)" strokeWidth="0.5" />
              <line x1="500" y1="260" x2="320" y2="185" stroke="rgba(0,174,239,0.05)" strokeWidth="0.5" />
            </svg>

            {/* Robot arm */}
            <svg viewBox="0 0 600 260" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid meet">
              <line x1="120" y1="0" x2="120" y2="55" stroke={ACCENT} strokeWidth="1.5" opacity="0.6" />
              <line x1="480" y1="0" x2="480" y2="55" stroke={ACCENT} strokeWidth="1.5" opacity="0.6" />
              <rect x="115" y="50" width="370" height="6" fill="#1a2540" stroke={ACCENT} strokeWidth="1" />
              <circle cx="120" cy="53" r="3" fill={ACCENT} />
              <circle cx="480" cy="53" r="3" fill={ACCENT} />
              <g style={{ transform: `translateY(${tier.robotY}px)`, transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}>
                <line x1="300" y1="56" x2="300" y2="95" stroke={ACCENT} strokeWidth="2" />
                <rect x="272" y="95" width="56" height="20" rx="4" fill="#1a2540" stroke={ACCENT} strokeWidth="1.5" />
                <circle cx="285" cy="105" r="2" fill={ACCENT} />
                <circle cx="300" cy="105" r="2" fill={ACCENT} />
                <circle cx="315" cy="105" r="2" fill={ACCENT} />
              </g>
            </svg>

            {/* Spray */}
            {tier.spray && (
              <svg viewBox="0 0 600 260" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid meet">
                {sprayParticles.map((p, i) => (
                  <circle key={i} cx={p.cx} cy={p.cy} r={p.radius} fill="#aedfff" opacity={p.opacity} />
                ))}
              </svg>
            )}

            {/* Car */}
            <svg viewBox="0 0 600 260" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid meet">
              <ellipse cx="300" cy="232" rx="200" ry="9" fill="#000" opacity="0.5" />
              <ellipse cx="300" cy="195" rx="180" ry="38" fill={ACCENT} opacity={tier.glow} style={{ filter: "blur(20px)", transition: "opacity 0.6s" }} />

              <g style={{ transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)" }}>
                <path d="M155,222 L155,197 Q160,167 200,162 L240,132 Q260,122 290,120 L355,120 Q390,122 415,147 L455,167 Q483,175 483,207 L483,222 Q483,229 476,229 L453,229 Q450,242 436,242 Q422,242 419,229 L183,229 Q180,242 166,242 Q152,242 149,229 L155,229 Z"
                  fill={tier.carColor} stroke="#1a2540" strokeWidth="1" style={{ transition: "fill 0.6s" }} />

                <path d="M205,162 L240,137 Q258,127 285,125 L355,125 Q384,127 408,145 L430,165 Z" fill="#0a1220" opacity="0.88" />
                <line x1="318" y1="125" x2="318" y2="165" stroke="#1a2540" strokeWidth="1.5" opacity="0.7" />
                <path d="M218,157 L246,137 Q258,131 282,129 L325,129 L325,159 Z" fill="#fff" opacity={tier.windowReflect} style={{ transition: "opacity 0.6s" }} />

                <rect x="466" y="192" width="14" height="17" rx="3" fill="#fff" opacity={tier.headlight} style={{ transition: "opacity 0.6s" }} />
                <rect x="158" y="192" width="10" height="13" rx="2" fill="#ff4444" opacity="0.5" />

                <g>
                  <circle cx="423" cy="229" r="19" fill="#0a0e1a" />
                  <circle cx="423" cy="229" r="9" fill={idx >= 2 ? "#7a8aa8" : "#3a4458"} style={{ transition: "fill 0.6s" }} />
                  <circle cx="423" cy="229" r="3" fill="#0a0e1a" />
                </g>
                <g>
                  <circle cx="175" cy="229" r="19" fill="#0a0e1a" />
                  <circle cx="175" cy="229" r="9" fill={idx >= 2 ? "#7a8aa8" : "#3a4458"} style={{ transition: "fill 0.6s" }} />
                  <circle cx="175" cy="229" r="3" fill="#0a0e1a" />
                </g>

                <g opacity={tier.dirt} style={{ transition: "opacity 0.6s" }}>
                  <ellipse cx="200" cy="207" rx="15" ry="6" fill="#3a2a1a" opacity="0.55" />
                  <ellipse cx="248" cy="215" rx="10" ry="4" fill="#3a2a1a" opacity="0.5" />
                  <ellipse cx="295" cy="197" rx="18" ry="5" fill="#3a2a1a" opacity="0.5" />
                  <ellipse cx="348" cy="212" rx="12" ry="4" fill="#3a2a1a" opacity="0.5" />
                  <ellipse cx="390" cy="202" rx="14" ry="5" fill="#3a2a1a" opacity="0.55" />
                  <circle cx="168" cy="218" r="3" fill="#3a2a1a" opacity="0.6" />
                </g>

                <g opacity={tier.drops} style={{ transition: "opacity 0.6s" }}>
                  <circle cx="220" cy="177" r="2" fill="#aedfff" opacity="0.8" />
                  <circle cx="272" cy="172" r="1.5" fill="#aedfff" opacity="0.7" />
                  <circle cx="320" cy="169" r="2" fill="#aedfff" opacity="0.8" />
                  <circle cx="370" cy="175" r="1.5" fill="#aedfff" opacity="0.7" />
                  <circle cx="410" cy="182" r="2" fill="#aedfff" opacity="0.8" />
                </g>

                <path d="M200,167 Q250,152 320,150 Q390,152 440,169" stroke="#fff" strokeWidth="2" fill="none"
                  opacity={tier.shine} strokeLinecap="round" style={{ transition: "opacity 0.6s" }} />
              </g>
            </svg>

            {/* Steam */}
            {tier.steam && (
              <svg viewBox="0 0 600 260" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid meet">
                {steamParticles.map((p, i) => (
                  <circle key={i} cx={p.cx} cy={p.cy} r={p.radius} fill="#fff" opacity={p.opacity} />
                ))}
              </svg>
            )}

            {/* Status badge */}
            <div style={{ position: "absolute", top: 14, right: 14, padding: "4px 10px", background: `rgba(0,174,239,0.12)`, border: `0.5px solid rgba(0,174,239,0.4)`, borderRadius: 999, fontSize: 10, letterSpacing: 1, color: ACCENT, textTransform: "uppercase" }}>
              {tier.status}
            </div>
          </div>

          {/* Controls */}
          <div style={{ padding: "1.25rem 1.25rem 1.5rem" }}>

            {/* Slider */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "0.625rem" }}>
              <span style={{ fontSize: 11, letterSpacing: 1.5, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", minWidth: 52 }}>Уровень</span>
              <input
                type="range"
                min={1} max={4} value={idx + 1} step={1}
                className="programs-slider"
                style={{ flex: 1, background: sliderBg }}
                onChange={e => setIdx(Number(e.target.value) - 1)}
              />
              <span style={{ fontSize: 22, fontWeight: 500, color: ACCENT, minWidth: 18, textAlign: "right" }}>
                {idx + 1}
              </span>
            </div>

            {/* Step labels */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0 66px", marginBottom: "1.25rem" }}>
              {TIERS.map((t, i) => (
                <span key={t.name} style={{ fontSize: 10, color: i <= idx ? ACCENT : "rgba(255,255,255,0.3)", letterSpacing: 0.5, transition: "color 0.3s" }}>
                  {t.name}
                </span>
              ))}
            </div>

            {/* Info cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: "1rem" }}>
              {[
                { label: "Программа", value: tier.name },
                { label: "Цена", value: `${tier.price.toLocaleString("ru-RU")} ₽` },
                { label: "Время", value: tier.time },
              ].map(card => (
                <div key={card.label} style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "0.625rem 0.75rem" }}>
                  <p style={{ fontSize: 10, letterSpacing: 1, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase" }}>{card.label}</p>
                  <p style={{ fontSize: 15, fontWeight: 500, color: "#fff" }}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* Степень очистки */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ fontSize: 11, letterSpacing: 1.5, color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
                  Степень очистки
                </span>
                <span style={{ fontSize: 22, fontWeight: 700, color: ACCENT, fontVariantNumeric: "tabular-nums", transition: "all 0.4s" }}>
                  {(idx + 1) * 25}%
                </span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${(idx + 1) * 25}%`,
                  borderRadius: 99,
                  background: `linear-gradient(to right, rgba(0,174,239,0.6), ${ACCENT})`,
                  boxShadow: `0 0 10px rgba(0,174,239,0.5)`,
                  transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                }} />
              </div>
            </div>

            {/* Services list */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "0.75rem 1rem", marginBottom: "1rem" }}>
              {tier.services.map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", fontSize: 13, color: s.on ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.28)" }}>
                  {s.on ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                      <circle cx="8" cy="8" r="7" fill={ACCENT} />
                      <path d="M5 8 L7 10 L11 6" stroke="#0a0e1a" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                      <circle cx="8" cy="8" r="7" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                    </svg>
                  )}
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <button
              onClick={handleStart}
              style={{ width: "100%", padding: "14px", fontSize: 14, fontWeight: 600, letterSpacing: 1, background: ACCENT, color: BG_DEEP, border: "none", borderRadius: 10, cursor: "pointer", textTransform: "uppercase", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.boxShadow = `0 0 24px rgba(0,174,239,0.45)`; }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.boxShadow = "none"; }}
            >
              Начать мойку →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
