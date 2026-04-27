"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
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
  return raw.toUpperCase().replace(/[^А-ЯA-Z0-9]/gi, "").slice(0, 9);
}

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 12,
  color: "#fff",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
};

const LABEL_STYLE: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  letterSpacing: 1,
  textTransform: "uppercase" as const,
  color: "rgba(255,255,255,0.5)",
  marginBottom: 6,
};

export function PromoPage() {
  const [step, setStep] = useState<"form" | "success">("form");
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

  function validate() {
    const errs: Record<string, string> = {};
    if (phone.replace(/\D/g, "").length < 10) errs.phone = "Введите корректный номер";
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
      const res = await fetch("/api/promo", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.code) {
        setErrors({ phone: "Коды временно закончились. Позвоните нам." });
        setSending(false);
        return;
      }

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
      setErrors({ phone: "Ошибка соединения. Попробуйте ещё раз." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ minHeight: "100svh", background: "#414042", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Image src="/logo-full.png" alt="МОЙ РОБОТ" width={160} height={44} style={{ objectFit: "contain" }} />
        </div>

        {step === "form" ? (
          <div style={{ background: "linear-gradient(135deg, #0a2a4a 0%, #0d1f35 100%)", border: `1px solid rgba(0,174,239,0.25)`, borderRadius: 20, padding: "1.75rem" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                width: 64, height: 64, borderRadius: 16,
                background: `linear-gradient(135deg, ${ACCENT}, #0080b8)`,
                boxShadow: `0 0 24px rgba(0,174,239,0.4)`,
                marginBottom: 14,
              }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: "#fff", lineHeight: 1 }}>35%</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", letterSpacing: 0.5 }}>СКИДКА</span>
              </div>
              <p style={{ fontSize: 11, letterSpacing: 2, color: ACCENT, textTransform: "uppercase", marginBottom: 6 }}>Новым клиентам</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 4 }}>
                Услуги Стандарт и Оптимальная
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Только при первом визите · Один раз</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={LABEL_STYLE}>Номер телефона *</label>
                <input type="tel" placeholder="+7 (___) ___-__-__" value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ ...INPUT_STYLE, borderColor: errors.phone ? "#ff6b6b" : "rgba(255,255,255,0.15)" }} />
                {errors.phone && <p style={{ fontSize: 11, color: "#ff6b6b", marginTop: 4 }}>{errors.phone}</p>}
              </div>

              <div ref={brandRef} style={{ position: "relative" }}>
                <label style={LABEL_STYLE}>Марка автомобиля *</label>
                <input type="text" placeholder="Toyota, Kia, BMW..." value={brandQuery} autoComplete="off"
                  onChange={e => { setBrandQuery(e.target.value); setBrand(""); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  style={{ ...INPUT_STYLE, borderColor: errors.brand ? "#ff6b6b" : "rgba(255,255,255,0.15)" }} />
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
                {errors.brand && <p style={{ fontSize: 11, color: "#ff6b6b", marginTop: 4 }}>{errors.brand}</p>}
              </div>

              <div>
                <label style={LABEL_STYLE}>Гос. номер *</label>
                <input type="text" placeholder="А 123 АА 77" value={plate} maxLength={9}
                  onChange={e => setPlate(formatPlate(e.target.value))}
                  style={{ ...INPUT_STYLE, letterSpacing: 4, fontWeight: 700, fontSize: 16, borderColor: errors.plate ? "#ff6b6b" : "rgba(255,255,255,0.15)" }} />
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Формат: А123АА77</p>
                {errors.plate && <p style={{ fontSize: 11, color: "#ff6b6b", marginTop: 2 }}>{errors.plate}</p>}
              </div>

              <button type="submit" disabled={sending} style={{
                marginTop: 4, padding: "14px", background: sending ? "rgba(0,174,239,0.4)" : ACCENT,
                color: "#0a0e1a", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 12,
                cursor: sending ? "not-allowed" : "pointer",
              }}>
                {sending ? "Выдаём промокод..." : "Получить промокод →"}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background: "linear-gradient(135deg, #0a2a4a 0%, #0d1f35 100%)", border: `1px solid rgba(0,174,239,0.3)`, borderRadius: 20, padding: "1.75rem", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 8, color: ACCENT }}>✓</div>
            <p style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Спасибо за регистрацию!</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>Ваш промокод на скидку 35%</p>

            <div style={{ border: `2px dashed rgba(0,174,239,0.5)`, borderRadius: 16, padding: "1.25rem", background: "rgba(0,174,239,0.06)", marginBottom: 20 }}>
              <p style={{ fontSize: 11, letterSpacing: 2, color: ACCENT, textTransform: "uppercase", marginBottom: 8 }}>Промокод</p>
              <p style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: 4, marginBottom: 4 }}>{promoCode}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>Скидка 35% · Один раз</p>
            </div>

            <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid rgba(255,255,255,0.1)`, background: "rgba(255,255,255,0.04)", aspectRatio: "16/9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ fontSize: 32 }}>📷</div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", padding: "0 1rem" }}>Здесь будет фото терминала у мойки</p>
            </div>

            <div style={{ padding: "12px 16px", background: "rgba(255,200,0,0.08)", border: "1px solid rgba(255,200,0,0.2)", borderRadius: 12, marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: "rgba(255,220,80,0.9)", lineHeight: 1.5 }}>
                ⚠️ Промокод вводится <strong>только на терминале</strong> у роботизированной мойки
              </p>
            </div>

            <Link href="/" style={{ fontSize: 13, color: ACCENT, textDecoration: "none" }}>← На главную</Link>
          </div>
        )}
      </div>
    </div>
  );
}
