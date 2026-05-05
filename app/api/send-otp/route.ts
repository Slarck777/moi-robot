import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) return "7" + digits.slice(1);
  if (digits.length === 10) return "7" + digits;
  return digits;
}

export async function POST(req: Request) {
  const { phone } = await req.json().catch(() => ({ phone: "" }));
  const normalized = normalizePhone(phone as string);

  if (normalized.length !== 11 || !normalized.startsWith("7")) {
    return Response.json({ error: "invalid_phone" }, { status: 400 });
  }

  // Test phones: fixed code 0000, no SMS sent
  const TEST_PHONES = new Set(["79670064618", "79166929243"]);
  if (TEST_PHONES.has(normalized)) {
    await redis.set(`moi_robot:otp:${normalized}`, "0000", { ex: 300 });
    return Response.json({ ok: true });
  }

  const code = String(Math.floor(1000 + Math.random() * 9000));
  await redis.set(`moi_robot:otp:${normalized}`, code, { ex: 300 });

  const params = new URLSearchParams({
    api_id: process.env.SMS_RU_API_ID!,
    to: normalized,
    msg: `МОЙ РОБОТ: ваш код ${code}. Действует 5 минут.`,
    json: "1",
  });

  const smsRes = await fetch(`https://sms.ru/sms/send?${params}`);
  const smsData = await smsRes.json();

  console.log("[send-otp] sms response:", JSON.stringify(smsData));

  if (smsData.status !== "OK") {
    return Response.json({ error: "sms_failed" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
