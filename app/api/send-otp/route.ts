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
  const TEST_PHONES = new Set(["79670064618", "79166929243"]);
  if (TEST_PHONES.has(normalized)) {
    await redis.set(`moi_robot:otp:${normalized}`, "0000", { ex: 300 });
    return Response.json({ ok: true });
  }

  // Авторизация звонком — SMS.ru звонит на номер, последние 4 цифры = код
  const params = new URLSearchParams({
    api_id: process.env.SMS_RU_API_ID!,
    phone: normalized,
    json: "1",
  });

  const callRes = await fetch(`https://sms.ru/auth/call?${params}`);
  const rawText = await callRes.text();
  console.log("[send-otp] call raw:", rawText);

  // SMS.ru может вернуть JSON или plain text (100\n1234\nbalance)
  let code: string | null = null;
  try {
    const callData = JSON.parse(rawText);
    if (callData.status === "OK" && callData.code) code = String(callData.code);
  } catch {
    // plain text: первая строка — статус (100=OK), вторая — код
    const lines = rawText.trim().split("\n");
    if (lines[0].trim() === "100" && lines[1]) code = lines[1].trim();
  }

  if (!code) {
    console.log("[send-otp] call failed, raw:", rawText);
    return Response.json({ error: "call_failed" }, { status: 500 });
  }

  await redis.set(`moi_robot:otp:${normalized}`, code, { ex: 300 });

  return Response.json({ ok: true });
}
