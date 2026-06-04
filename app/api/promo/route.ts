import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { PROMO_CODES } from "@/content/promo-codes";
import { NextRequest } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const LIST_KEY = "moi_robot:promo_codes";
const USED_IPS_KEY = "moi_robot:used_ips";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  prefix: "moi_robot:rl",
});

// Локальные IP (разработка) всегда могут получить промокод
const IP_WHITELIST = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return Response.json({ error: "too_many_requests" }, { status: 429 });
  }

  if (!IP_WHITELIST.has(ip) && ip !== "unknown") {
    const alreadyUsed = await redis.sismember(USED_IPS_KEY, ip);
    if (alreadyUsed) {
      return Response.json({ error: "already_used" }, { status: 409 });
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

  if (!IP_WHITELIST.has(ip) && ip !== "unknown") {
    await redis.sadd(USED_IPS_KEY, ip);
  }

  return Response.json({ code });
}
