import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { PROMO_CODES } from "@/content/promo-codes";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const LIST_KEY = "moi_robot:promo_codes";
const USED_KEY = "moi_robot:used_phones";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  prefix: "moi_robot:rl",
});

// Номера которые всегда могут получать промокод (тестовые / владельцы)
const WHITELIST = new Set(["9162692556", "9670064618", "9166929243"]);

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  // Привести к 10 цифрам: убрать ведущую 7 или 8
  if ((digits.length === 11) && (digits[0] === "7" || digits[0] === "8")) {
    return digits.slice(1);
  }
  return digits;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return Response.json({ error: "too_many_requests" }, { status: 429 });
  }

  const { phone } = await req.json().catch(() => ({ phone: "" }));
  const normalized = normalizePhone(phone as string);

  if (normalized.length >= 10) {
    if (!WHITELIST.has(normalized)) {
      const alreadyUsed = await redis.sismember(USED_KEY, normalized);
      if (alreadyUsed) {
        return Response.json({ error: "already_used" }, { status: 409 });
      }
    }
  }

  const len = await redis.llen(LIST_KEY);
  if (len === 0) {
    await redis.rpush(LIST_KEY, ...PROMO_CODES);
  }

  const code = await redis.lpop<string>(LIST_KEY);

  if (!code) {
    return Response.json({ error: "no_codes" }, { status: 503 });
  }

  if (normalized.length >= 10 && !WHITELIST.has(normalized)) {
    await redis.sadd(USED_KEY, normalized);
  }

  return Response.json({ code });
}
