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

// Russian plate letters allowed by law
const PLATE_LETTERS = "АВЕКМНОРСТУХ";


function formatPlate(raw: string): string {
  // Keep only allowed chars, max 9
  return raw
    .toUpperCase()
    .replace(/[^А-ЯA-Z0-9]/gi, "")
    .slice(0, 9);
}

type Step = "banner" | "form" | "success";

const DISCOUNT_SERVICES = ["Оптимальная", "Стандарт"];

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
    if (!brand) errs.brand = "Выберите марку автомобиля";
    if (plate.length < 8) errs.plate = "Введите гос. номер полностью";
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
      const res = await fetch("/api/promo", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.code) {
        setErrors({ phone: "Коды временно закончились. Позвоните нам." });
        setSending(false);
        return;
      }

      setPromoCode(data.code);

      // Notify owner via Web3Forms
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
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    color: "#fff",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 5,
  };

  // ─── BANNER ────────────────────────────────────────────────
  if (step === "banner") {
    return (
      <div className="px-4 pb-6">
        <div className="mx-auto max-w-2xl">
          <div
            style={{
              background: "linear-gradient(135deg, #0a2a4a 0%, #0d1f35 60%, #091828 100%)",
              border: `1px solid rgba(0,174,239,0.35)`,
              borderRadius: 20,
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* glow */}
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,174,239,0.18) 0%, transparent 70%)`, pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
              {/* badge */}
              <div style={{
                flexShrink: 0,
                width: 72, height: 72,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${ACCENT}, #0080b8)`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 24px rgba(0,174,239,0.5)`,
              }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1 }}>35%</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", letterSpacing: 0.5 }}>СКИДКА</span>
              </div>

              <div>
                <p style={{ fontSize: 11, letterSpacing: 2, color: ACCENT, textTransform: "uppercase", marginBottom: 4 }}>Новым клиентам</p>
                <p style={{ fontSize: 17, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 4 }}>
                  Оптимальная и Стандарт
                </p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Только при первом визите · Один раз</p>
              </div>
            </div>

            <button
              onClick={() => setStep("form")}
              style={{
                flexShrink: 0,
                padding: "12px 22px",
                background: ACCENT,
                color: "#0a0e1a",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: 0.5,
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                whiteSpace: "nowrap",
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
            background: "linear-gradient(135deg, #0a2a4a 0%, #0d1f35 100%)",
            border: `1px solid rgba(0,174,239,0.25)`,
            borderRadius: 20,
            padding: "1.75rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `rgba(0,174,239,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid rgba(0,174,239,0.3)` }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: ACCENT }}>35%</span>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>Скидка для новых клиентов</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Заполните данные — получите промокод</p>
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
                    setBrand("");
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
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Формат: А123АА77</p>
                {errors.plate && <p style={{ fontSize: 11, color: "#ff6b6b", marginTop: 2 }}>{errors.plate}</p>}
              </div>

              <button
                type="submit"
                disabled={sending}
                style={{
                  marginTop: 4,
                  padding: "13px",
                  background: sending ? "rgba(0,174,239,0.4)" : ACCENT,
                  color: "#0a0e1a",
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

          {/* Promo code coupon */}
          <div style={{
            margin: "0 auto 24px",
            maxWidth: 320,
            border: `2px dashed rgba(0,174,239,0.5)`,
            borderRadius: 16,
            padding: "1.25rem",
            background: "rgba(0,174,239,0.06)",
          }}>
            <p style={{ fontSize: 11, letterSpacing: 2, color: ACCENT, textTransform: "uppercase", marginBottom: 8 }}>Промокод</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: 4, marginBottom: 4 }}>{promoCode}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>Скидка 35% · Один раз</p>
          </div>

          {/* Terminal photo placeholder */}
          <div style={{
            margin: "0 auto 20px",
            maxWidth: 320,
            borderRadius: 14,
            overflow: "hidden",
            border: `1px solid rgba(255,255,255,0.1)`,
            background: "rgba(255,255,255,0.04)",
            aspectRatio: "16/9",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}>
            <div style={{ fontSize: 32 }}>📷</div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "0 1rem" }}>
              Здесь будет фото терминала у мойки
            </p>
          </div>

          {/* Reminder */}
          <div style={{
            padding: "12px 16px",
            background: "rgba(255,200,0,0.08)",
            border: "1px solid rgba(255,200,0,0.2)",
            borderRadius: 12,
            maxWidth: 320,
            margin: "0 auto",
          }}>
            <p style={{ fontSize: 13, color: "rgba(255,220,80,0.9)", lineHeight: 1.5 }}>
              ⚠️ Промокод вводится <strong>только на терминале</strong> у роботизированной мойки
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
