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

  // Test phones: skip SMS and rate limit, fixed code 0000
  const TEST_PHONES = new Set(["79670064618", "79166929243"]);
  if (TEST_PHONES.has(normalized)) {
    await redis.set(`moi_robot:otp:${normalized}`, "0000", { ex: 300 });
    return Response.json({ ok: true });
  }

  // Rate limit: max 3 OTP sends per phone per hour
  const rlKey = `moi_robot:otp_rl:${normalized}`;
  const attempts = await redis.incr(rlKey);
  if (attempts === 1) await redis.expire(rlKey, 3600);
  if (attempts > 3) {
    return Response.json({ error: "too_many_attempts" }, { status: 429 });
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

  if (smsData.status !== "OK") {
    return Response.json({ error: "sms_failed" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
