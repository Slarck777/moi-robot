"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "moi_robot_consent";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      padding: "1rem",
      background: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 480,
        background: "#0d1f35",
        border: "1px solid rgba(0,174,239,0.25)",
        borderRadius: 20,
        padding: "1.5rem",
        marginBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 10 }}>
          Обработка персональных данных
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 20 }}>
          Нажимая «Принять», вы соглашаетесь на обработку персональных данных
          (номер телефона, марка и гос. номер автомобиля) в соответствии
          с&nbsp;Федеральным законом №&nbsp;152-ФЗ «О персональных данных»
          в целях предоставления скидки и улучшения сервиса.
          Данные не передаются третьим лицам.
        </p>
        <button
          onClick={accept}
          style={{
            width: "100%",
            padding: "14px",
            background: "#00AEEF",
            color: "#0a0e1a",
            fontWeight: 700,
            fontSize: 15,
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          Принять и продолжить
        </button>
      </div>
    </div>
  );
}
