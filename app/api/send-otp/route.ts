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

  // Test phones: skip call and rate limit, fixed code 0000
  const TEST_PHONES = new Set(["79162692556", "79670064618", "79166929243"]);
  if (TEST_PHONES.has(normalized)) {
    await redis.set(`moi_robot:otp:${normalized}`, "0000", { ex: 300 });
    return Response.json({ ok: true });
  }

  // Rate limit: max 3 calls per phone per hour
  const rlKey = `moi_robot:otp_rl:${normalized}`;
  const attempts = await redis.incr(rlKey);
  if (attempts === 1) await redis.expire(rlKey, 3600);
  if (attempts > 3) {
    return Response.json({ error: "too_many_attempts" }, { status: 429 });
  }

  // Авторизация звонком — SMS.ru звонит на номер, последние 4 цифры = код
  const params = new URLSearchParams({
    api_id: process.env.SMS_RU_API_ID!,
    phone: normalized,
    json: "1",
  });

  const callRes = await fetch(`https://sms.ru/auth/call?${params}`);
  const callData = await callRes.json();

  console.log("[send-otp] call response:", JSON.stringify(callData));

  if (callData.status !== "OK" || !callData.code) {
    return Response.json({ error: "call_failed" }, { status: 500 });
  }

  // Сохраняем код который вернул SMS.ru (последние 4 цифры входящего номера)
  await redis.set(`moi_robot:otp:${normalized}`, String(callData.code), { ex: 300 });

  return Response.json({ ok: true });
}
