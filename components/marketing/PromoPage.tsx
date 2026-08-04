"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";

const ACCENT = "#00AEEF";

const CAR_BRANDS = [
  "Audi", "BMW", "BYD", "Changan", "Chery", "Chevrolet", "Daewoo", "Datsun",
  "Exeed", "Ford", "Geely", "Haval", "Honda", "Hyundai", "Infiniti", "JAC",
  "Jeep", "Jetour", "Kia", "Land Rover", "Lexus", "Lada (ВАЗ)", "Lifan",
  "Mazda", "Mercedes-Benz", "MINI", "Mitsubishi", "Nissan", "Omoda", "Opel",
  "Peugeot", "Porsche", "Renault", "Skoda", "Subaru", "Suzuki", "Tank",
  "Tesla", "Toyota", "Volkswagen", "Volvo", "Voyah", "Zeekr", "ГАЗ", "УАЗ",
];

function formatPlate(raw: string): string {
  return raw.toUpperCase().slice(0, 12);
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  background: "rgba(255,255,255,0.5)",
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: 10,
  color: "#1a1a1a",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  letterSpacing: 1,
  textTransform: "uppercase" as const,
  color: "rgba(0,0,0,0.5)",
  marginBottom: 5,
};

type Step = "form" | "success";

export function PromoPage() {
  const [step, setStep] = useState<Step>("form");
  const [phone, setPhone] = useState("");
  const [brandQuery, setBrandQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [plate, setPlate] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [promoCode, setPromoCode] = useState("");
  const [sending, setSending] = useState(false);
  const brandRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() =>
    brandQuery.length > 0
      ? CAR_BRANDS.filter(b => b.toLowerCase().includes(brandQuery.toLowerCase())).slice(0, 6)
      : [],
    [brandQuery]
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (brandRef.current && !brandRef.current.contains(e.target as Node))
        setShowSuggestions(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (phone.replace(/\D/g, "").length < 10) errs.phone = "Введите корректный номер";
    if (!brand.trim()) errs.brand = "Введите марку автомобиля";
    if (plate.trim().length < 2) errs.plate = "Введите гос. номер";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSending(true);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, brand, plate }),
      });
      const data = await res.json();
      if (res.status === 409) { setErrors({ submit: "Промокод уже был получен с этого устройства." }); return; }
      if (!res.ok || !data.code) { setErrors({ submit: "Коды временно закончились. Позвоните нам." }); return; }
      setPromoCode(data.code);
      await fetch(process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!, {
        method: "POST",
        body: JSON.stringify({ phone, brand, plate, code: data.code }),
      }).catch(() => {});
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: `[Промокод] Новый клиент — ${phone}`,
          from_name: "МОЙ РОБОТ Промо",
          message: `Телефон: ${phone}\nМарка: ${brand}\nГос. номер: ${plate}\nПромокод: ${data.code}`,
        }),
      }).catch(() => {});
      setStep("success");
    } catch {
      setErrors({ submit: "Ошибка соединения. Попробуйте ещё раз." });
    } finally {
      setSending(false);
    }
  }

  const cardStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #FFB800 0%, #FFD000 100%)",
    borderRadius: 20,
    padding: "1.75rem",
    position: "relative",
    overflow: "hidden",
  };

  const glowEl = (
    <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
  );

  const header = (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "badge-pulse 1.8s ease-in-out infinite" }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1 }}>35%</span>
      </div>
      <div>
        <p style={{ fontWeight: 800, fontSize: 18, color: "#1a1a1a", lineHeight: 1.2, marginBottom: 4 }}>Скидка на 1-ый визит</p>
        <p style={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>*Действует на услуги Стандарт и Премиум</p>
      </div>
    </div>
  );

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-sm">
        <style>{`
          @keyframes badge-pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,0,0,0.2); }
            50% { transform: scale(1.08); box-shadow: 0 0 0 6px rgba(0,0,0,0.08); }
          }
        `}</style>

        {step === "form" && (
          <div style={cardStyle}>
            {glowEl}
            {header}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Номер телефона *</label>
                <input type="tel" placeholder="+7 (___) ___-__-__" value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ ...inputStyle, borderColor: errors.phone ? "#ff6b6b" : "rgba(0,0,0,0.15)" }} />
                {errors.phone && <p style={{ fontSize: 11, color: "#c00", marginTop: 4 }}>{errors.phone}</p>}
              </div>
              <div ref={brandRef} style={{ position: "relative" }}>
                <label style={labelStyle}>Марка автомобиля *</label>
                <input type="text" placeholder="Toyota, Kia, BMW..." value={brandQuery} autoComplete="off"
                  onChange={e => { setBrandQuery(e.target.value); setBrand(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  style={{ ...inputStyle, borderColor: errors.brand ? "#ff6b6b" : "rgba(0,0,0,0.15)" }} />
                {showSuggestions && suggestions.length > 0 && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10, background: "#0d1f35", border: `1px solid rgba(0,174,239,0.25)`, borderRadius: 10, marginTop: 4, overflow: "hidden" }}>
                    {suggestions.map(b => (
                      <button key={b} type="button"
                        onClick={() => { setBrand(b); setBrandQuery(b); setShowSuggestions(false); }}
                        style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,174,239,0.1)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}
                      >{b}</button>
                    ))}
                  </div>
                )}
                {errors.brand && <p style={{ fontSize: 11, color: "#c00", marginTop: 4 }}>{errors.brand}</p>}
              </div>
              <div>
                <label style={labelStyle}>Гос. номер *</label>
                <input type="text" placeholder="А 123 АА 77" value={plate} maxLength={9}
                  onChange={e => setPlate(formatPlate(e.target.value))}
                  style={{ ...inputStyle, letterSpacing: 4, fontWeight: 700, fontSize: 16, borderColor: errors.plate ? "#ff6b6b" : "rgba(0,0,0,0.15)" }} />
                <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginTop: 4 }}>Формат: А123АА77</p>
                {errors.plate && <p style={{ fontSize: 11, color: "#c00", marginTop: 2 }}>{errors.plate}</p>}
              </div>
              {errors.submit && <p style={{ fontSize: 12, color: "#c00", textAlign: "center" }}>{errors.submit}</p>}
              <button type="submit" disabled={sending} style={{ marginTop: 4, padding: "14px", background: sending ? "rgba(0,0,0,0.3)" : "#1a1a1a", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 12, cursor: sending ? "not-allowed" : "pointer", width: "100%" }}>
                {sending ? "Выдаём промокод..." : "Получить промокод →"}
              </button>
            </form>
            <Link href="/" style={{ display: "block", marginTop: 14, padding: "13px", background: "rgba(0,0,0,0.15)", border: "2px solid rgba(0,0,0,0.25)", borderRadius: 12, textAlign: "center", fontSize: 14, fontWeight: 700, color: "#1a1a1a", textDecoration: "none" }}>
              ← На главную
            </Link>
          </div>
        )}

        {step === "success" && (
          <div style={{ background: "linear-gradient(135deg, #0a2a4a 0%, #0d1f35 100%)", border: `1px solid rgba(0,174,239,0.3)`, borderRadius: 20, padding: "1.75rem", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Спасибо за регистрацию!</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
              Ваш промокод на скидку 35% (Стандарт / Премиум)
            </p>
            <div style={{ padding: "18px 20px", background: "rgba(255,200,0,0.15)", border: "2px solid rgba(255,210,0,0.6)", borderRadius: 16, marginBottom: 16, boxShadow: "0 0 20px rgba(255,200,0,0.2)" }}>
              <p style={{ fontSize: 18, fontWeight: 900, color: "#FFD700", marginBottom: 8 }}>📸 Сохраните промокод!</p>
              <p style={{ fontSize: 14, color: "rgba(255,230,80,0.95)", lineHeight: 1.6 }}>
                Сделайте скриншот или запишите код — он показывается <strong style={{ color: "#fff" }}>только один раз</strong>.
              </p>
            </div>
            <div style={{ border: `2px dashed rgba(0,174,239,0.5)`, borderRadius: 16, padding: "1.25rem", background: "rgba(0,174,239,0.06)", marginBottom: 16 }}>
              <p style={{ fontSize: 11, letterSpacing: 2, color: ACCENT, textTransform: "uppercase", marginBottom: 8 }}>Промокод</p>
              <p style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: 6, marginBottom: 4 }}>{promoCode}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>Скидка 35% · Один раз</p>
            </div>
            <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid rgba(255,255,255,0.1)`, marginBottom: 16 }}>
              <img src="/terminal-v2.jpg" alt="Терминал оплаты" style={{ width: "100%", display: "block" }} />
            </div>
            <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, marginBottom: 20 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
                Промокод вводится <span style={{ color: ACCENT }}>только на терминале</span> у роботизированной мойки.
              </p>
            </div>
            <Link href="/" style={{ fontSize: 13, color: ACCENT, textDecoration: "none" }}>← На главную</Link>
          </div>
        )}
      </div>
    </div>
  );
}
