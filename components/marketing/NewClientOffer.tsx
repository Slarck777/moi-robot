"use client";

import { useState, useMemo, useRef, useEffect } from "react";

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

type Step = "banner" | "form" | "success";

export function NewClientOffer() {
  const [step, setStep] = useState<Step>("banner");
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

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function validate() {
    const errs: Record<string, string> = {};
    if (!phone.replace(/\D/g, "") || phone.replace(/\D/g, "").length < 10)
      errs.phone = "Введите корректный номер";
    if (!brand.trim()) errs.brand = "Введите марку автомобиля";
    if (plate.trim().length < 2) errs.plate = "Введите гос. номер";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSending(true);

    try {
      // Get real activation code from server
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setErrors({ phone: "Этот номер уже получал промокод." });
        setSending(false);
        return;
      }

      if (!res.ok || !data.code) {
        setErrors({ phone: "Коды временно закончились. Позвоните нам." });
        setSending(false);
        return;
      }

      setPromoCode(data.code);

      // Записать в Google Таблицу
      await fetch(process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!, {
        method: "POST",
        body: JSON.stringify({ phone, brand, plate, code: data.code }),
      }).catch(() => {});

      // Уведомить владельца на почту
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
      setErrors({ phone: "Ошибка соединения. Попробуйте ещё раз." });
    } finally {
      setSending(false);
    }
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

  // ─── BANNER ────────────────────────────────────────────────
  if (step === "banner") {
    return (
      <div className="px-4 pb-6">
        <div className="mx-auto max-w-2xl">
          <div
            style={{
              background: "linear-gradient(135deg, #FFB800 0%, #FFD000 100%)",
              borderRadius: 20,
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* glow */}
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)`, pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* animated 35% badge */}
              <div style={{
                flexShrink: 0,
                width: 72, height: 72,
                borderRadius: 16,
                background: "rgba(0,0,0,0.18)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                animation: "badge-pulse 1.8s ease-in-out infinite",
              }}>
                <span style={{ fontSize: 26, fontWeight: 900, color: "#fff", lineHeight: 1 }}>35%</span>
              </div>

              <div>
                <p style={{ fontSize: 20, fontWeight: 900, color: "#1a1a1a", lineHeight: 1.2, marginBottom: 6 }}>
                  Скидка на 1-ый визит
                </p>
                <p style={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>*Действует на услуги Стандарт и Оптимальная</p>
              </div>
            </div>

            <style>{`
              @keyframes badge-pulse {
                0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,0,0,0.2); }
                50% { transform: scale(1.08); box-shadow: 0 0 0 6px rgba(0,0,0,0.08); }
              }
            `}</style>

            <button
              onClick={() => setStep("form")}
              style={{
                width: "100%",
                padding: "12px",
                background: "#1a1a1a",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: 0.5,
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              Получить скидку →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── FORM ──────────────────────────────────────────────────
  if (step === "form") {
    return (
      <div className="px-4 pb-6">
        <div className="mx-auto max-w-2xl">
          <div style={{
            background: "linear-gradient(135deg, #FFB800 0%, #FFD000 100%)",
            borderRadius: 20,
            padding: "1.75rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 900, color: "#fff", lineHeight: 1 }}>35%</span>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>Скидка на 1-ый визит</p>
                <p style={{ fontSize: 12, color: "rgba(0,0,0,0.5)" }}>Заполните данные — получите промокод</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Phone */}
              <div>
                <label style={labelStyle}>Номер телефона *</label>
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ ...inputStyle, borderColor: errors.phone ? "#ff6b6b" : "rgba(255,255,255,0.15)" }}
                />
                {errors.phone && <p style={{ fontSize: 11, color: "#ff6b6b", marginTop: 4 }}>{errors.phone}</p>}
              </div>

              {/* Car brand with autocomplete */}
              <div ref={brandRef} style={{ position: "relative" }}>
                <label style={labelStyle}>Марка автомобиля *</label>
                <input
                  type="text"
                  placeholder="Toyota, Kia, BMW..."
                  value={brandQuery}
                  autoComplete="off"
                  onChange={e => {
                    setBrandQuery(e.target.value);
                    setBrand(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  style={{ ...inputStyle, borderColor: errors.brand ? "#ff6b6b" : "rgba(255,255,255,0.15)" }}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div style={{
                    position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10,
                    background: "#0d1f35",
                    border: `1px solid rgba(0,174,239,0.25)`,
                    borderRadius: 10,
                    marginTop: 4,
                    overflow: "hidden",
                  }}>
                    {suggestions.map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => { setBrand(b); setBrandQuery(b); setShowSuggestions(false); }}
                        style={{
                          display: "block", width: "100%", textAlign: "left",
                          padding: "10px 14px", background: "none", border: "none",
                          color: "#fff", fontSize: 14, cursor: "pointer",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,174,239,0.1)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "none")}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                )}
                {errors.brand && <p style={{ fontSize: 11, color: "#ff6b6b", marginTop: 4 }}>{errors.brand}</p>}
              </div>

              {/* License plate */}
              <div>
                <label style={labelStyle}>Гос. номер *</label>
                <input
                  type="text"
                  placeholder="А 123 АА 77"
                  value={plate}
                  maxLength={9}
                  onChange={e => setPlate(formatPlate(e.target.value))}
                  style={{
                    ...inputStyle,
                    letterSpacing: 4,
                    fontWeight: 700,
                    fontSize: 16,
                    borderColor: errors.plate ? "#ff6b6b" : "rgba(255,255,255,0.15)",
                  }}
                />
                <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginTop: 4 }}>Формат: А123АА77</p>
                {errors.plate && <p style={{ fontSize: 11, color: "#ff6b6b", marginTop: 2 }}>{errors.plate}</p>}
              </div>

              <button
                type="submit"
                disabled={sending}
                style={{
                  marginTop: 4,
                  padding: "13px",
                  background: sending ? "rgba(0,0,0,0.3)" : "#1a1a1a",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: 0.5,
                  border: "none",
                  borderRadius: 12,
                  cursor: sending ? "not-allowed" : "pointer",
                }}
              >
                {sending ? "Выдаём промокод..." : "Получить промокод"}
              </button>

              <button
                type="button"
                onClick={() => setStep("banner")}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 13, cursor: "pointer" }}
              >
                ← Назад
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─── SUCCESS ───────────────────────────────────────────────
  return (
    <div className="px-4 pb-6">
      <div className="mx-auto max-w-2xl">
        <div style={{
          background: "linear-gradient(135deg, #0a2a4a 0%, #0d1f35 100%)",
          border: `1px solid rgba(0,174,239,0.3)`,
          borderRadius: 20,
          padding: "1.75rem",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Спасибо за регистрацию!</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
            Ваш промокод на скидку 35% (Оптимальная / Стандарт)
          </p>

          {/* Save reminder — above the code so user sees it first */}
          <div style={{
            padding: "18px 20px",
            background: "rgba(255,200,0,0.15)",
            border: "2px solid rgba(255,210,0,0.6)",
            borderRadius: 16,
            maxWidth: 320,
            margin: "0 auto 16px",
            boxShadow: "0 0 20px rgba(255,200,0,0.2)",
          }}>
            <p style={{ fontSize: 18, fontWeight: 900, color: "#FFD700", marginBottom: 8 }}>
              📸 Сохраните промокод!
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,230,80,0.95)", lineHeight: 1.6 }}>
              Сделайте скриншот или запишите код — он показывается <strong style={{ color: "#fff" }}>только один раз</strong>.
            </p>
          </div>

          {/* Promo code coupon */}
          <div style={{
            margin: "0 auto 20px",
            maxWidth: 320,
            border: `2px dashed rgba(0,174,239,0.5)`,
            borderRadius: 16,
            padding: "1.25rem",
            background: "rgba(0,174,239,0.06)",
          }}>
            <p style={{ fontSize: 11, letterSpacing: 2, color: ACCENT, textTransform: "uppercase", marginBottom: 8 }}>Промокод</p>
            <p style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: 6, marginBottom: 4 }}>{promoCode}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>Скидка 35% · Один раз</p>
          </div>

          {/* Terminal photo */}
          <div style={{ margin: "0 auto 16px", maxWidth: 320, borderRadius: 14, overflow: "hidden", border: `1px solid rgba(255,255,255,0.1)` }}>
            <img src="/terminal-photo.jpg" alt="Терминал оплаты" style={{ width: "100%", display: "block", borderRadius: 14 }} />
          </div>

          {/* Terminal reminder */}
          <div style={{
            padding: "16px 20px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 14,
            maxWidth: 320,
            margin: "0 auto",
          }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
              Промокод вводится <span style={{ color: ACCENT }}>только на терминале</span> у роботизированной мойки.
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
              Приносим извинения за неудобства — уже работаем над этим.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
