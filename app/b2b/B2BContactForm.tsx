"use client";

import { useState } from "react";

const ACCENT = "#00AEEF";
const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  color: "#fff",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};
const LABEL_STYLE: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.5)",
  marginBottom: 6,
};

export function B2BContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);

    const company  = data.get("company") as string;
    const name     = data.get("name") as string;
    const phone    = data.get("phone") as string;
    const email    = data.get("email") as string;
    const comment  = data.get("comment") as string;

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: `[B2B] Заявка от ${company}`,
          from_name: name,
          email,
          phone,
          company,
          message: comment || "—",
        }),
      });

      const json = await res.json();
      setStatus(json.success ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
        <div style={{ fontSize: 40, marginBottom: 12, color: ACCENT }}>✓</div>
        <p style={{ color: ACCENT, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Заявка отправлена!</p>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Свяжемся с вами в ближайшее время.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={LABEL_STYLE}>Компания *</label>
          <input name="company" required placeholder="ООО Ромашка" style={INPUT_STYLE} />
        </div>
        <div>
          <label style={LABEL_STYLE}>Контактное лицо *</label>
          <input name="name" required placeholder="Иван Иванов" style={INPUT_STYLE} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={LABEL_STYLE}>Телефон *</label>
          <input name="phone" required type="tel" placeholder="+7 (___) ___-__-__" style={INPUT_STYLE} />
        </div>
        <div>
          <label style={LABEL_STYLE}>Email</label>
          <input name="email" type="email" placeholder="ivan@company.ru" style={INPUT_STYLE} />
        </div>
      </div>
      <div>
        <label style={LABEL_STYLE}>Комментарий</label>
        <textarea
          name="comment"
          rows={3}
          placeholder="Количество автомобилей, пожелания..."
          style={{ ...INPUT_STYLE, resize: "vertical" }}
        />
      </div>

      {status === "error" && (
        <p style={{ color: "#ff6b6b", fontSize: 13 }}>Ошибка отправки. Позвоните нам напрямую.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          padding: "14px",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
          background: status === "loading" ? "rgba(0,174,239,0.5)" : ACCENT,
          color: "#0a0e1a",
          border: "none",
          borderRadius: 10,
          cursor: status === "loading" ? "not-allowed" : "pointer",
          transition: "all 0.2s",
        }}
      >
        {status === "loading" ? "Отправка..." : "Отправить заявку →"}
      </button>
    </form>
  );
}
