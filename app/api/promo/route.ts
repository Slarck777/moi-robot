import { Redis } from "@upstash/redis";
import { PROMO_CODES } from "@/content/promo-codes";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const LIST_KEY = "moi_robot:promo_codes";

export async function POST() {
  // First call: load all codes into Redis if list is empty
  const len = await redis.llen(LIST_KEY);
  if (len === 0) {
    await redis.rpush(LIST_KEY, ...PROMO_CODES);
  }

  const code = await redis.lpop<string>(LIST_KEY);

  if (!code) {
    return Response.json({ error: "no_codes" }, { status: 503 });
  }

  return Response.json({ code });
}
