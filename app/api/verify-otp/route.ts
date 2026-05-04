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
  const { phone, code } = await req.json().catch(() => ({ phone: "", code: "" }));
  const normalized = normalizePhone(phone as string);

  const stored = await redis.get<string>(`moi_robot:otp:${normalized}`);

  if (!stored || stored !== String(code).trim()) {
    return Response.json({ error: "invalid_code" }, { status: 400 });
  }

  await redis.del(`moi_robot:otp:${normalized}`);
  return Response.json({ ok: true });
}
