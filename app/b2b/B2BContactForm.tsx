"use client";

import { useActionState } from "react";
import { sendB2BLead, type FormState } from "./actions";

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
  const [state, action, pending] = useActionState<FormState, FormData>(sendB2BLead, null);

  if (state?.ok) {
    return (
      <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
        <p style={{ color: ACCENT, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Заявка отправлена!</p>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Свяжемся с вами в ближайшее время.</p>
      </div>
    );
  }

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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

      {state && !state.ok && (
        <p style={{ color: "#ff6b6b", fontSize: 13 }}>{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          padding: "14px",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
          background: pending ? "rgba(0,174,239,0.5)" : ACCENT,
          color: "#0a0e1a",
          border: "none",
          borderRadius: 10,
          cursor: pending ? "not-allowed" : "pointer",
          transition: "all 0.2s",
        }}
      >
        {pending ? "Отправка..." : "Отправить заявку →"}
      </button>
    </form>
  );
}
