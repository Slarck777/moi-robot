"use server";

import { Resend } from "resend";

export type FormState = { ok: boolean; message: string } | null;

export async function sendB2BLead(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const company = (formData.get("company") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const comment = (formData.get("comment") as string)?.trim();

  if (!company || !name || !phone) {
    return { ok: false, message: "Заполните обязательные поля" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = process.env.CONTACT_EMAIL ?? "info@moi-robot.ru";

  try {
    await resend.emails.send({
      from: "МОЙ РОБОТ <onboarding@resend.dev>",
      to,
      replyTo: email || undefined,
      subject: `[B2B] Заявка от ${company}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px">
          <h2 style="color:#00AEEF;margin-bottom:16px">Новая B2B заявка</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:6px 12px 6px 0;color:#888;white-space:nowrap"><b>Компания</b></td><td style="padding:6px 0">${company}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#888"><b>Контакт</b></td><td style="padding:6px 0">${name}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#888"><b>Телефон</b></td><td style="padding:6px 0">${phone}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#888"><b>Email</b></td><td style="padding:6px 0">${email || "—"}</td></tr>
            ${comment ? `<tr><td style="padding:6px 12px 6px 0;color:#888;vertical-align:top"><b>Комментарий</b></td><td style="padding:6px 0">${comment}</td></tr>` : ""}
          </table>
        </div>
      `,
    });
    return { ok: true, message: "Заявка отправлена! Свяжемся с вами в ближайшее время." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Ошибка отправки. Позвоните нам напрямую." };
  }
}
