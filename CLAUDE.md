# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> ⚠️ This is **Next.js 16** (App Router, React 19, Turbopack). APIs and conventions differ from older Next.js — see `AGENTS.md` and read the relevant guide in `node_modules/next/dist/docs/` before writing framework code.

## What this is

A marketing landing page for the **"МОЙ РОБОТ"** robotic car wash (Мытищи). It is a **thin wrapper in front of the Kubon platform** — there is no Kubon API. Visitors read about programs/prices and either tap through to `station.kubonUrl`, or claim a first-visit promo code on `/promo`.

## Commands

Package manager is **pnpm**.

```bash
pnpm dev      # dev server (localhost:3000)
pnpm build    # production build
pnpm start    # serve the production build
pnpm lint     # eslint (flat config, eslint.config.mjs)
```

There is no test suite.

## Architecture

**Content is data-driven, not hardcoded.** All station facts — name, address, phone, `kubonUrl`, and the full program list (prices, durations, wash steps) — live in [content/station.json](content/station.json), typed and re-exported by [lib/station.ts](lib/station.ts) as `station`. To change prices, programs, or contact info, **edit `station.json`**, not the components. Components import `{ station }` from `@/lib/station`.

**Routes** ([app/](app/)):
- `/` — landing (`app/page.tsx`), composed of sections from [components/marketing/](components/marketing/)
- `/promo` — promo-code claim flow
- `/b2b` — B2B contact page

**Promo-code system** — the most complex part:
- [app/api/promo/route.ts](app/api/promo/route.ts) is the source of truth for the flow. It uses **Upstash Redis** (REST) with two keys:
  - `moi_robot:promo_codes` — the live pool; codes are handed out one at a time via `LPOP`.
  - `moi_robot:used_phones` — a set of normalized phone numbers that already redeemed (dedup; one code per phone).
  - When the pool is empty, the route **auto-reseeds it via `RPUSH` from [content/promo-codes.ts](content/promo-codes.ts)**. So that file is the fallback seed, and Redis is the live state — they must be kept in sync.
  - IP rate-limited (`@upstash/ratelimit`, 5/min). A `WHITELIST` of test/owner phone numbers bypasses the used-phone check.
- [components/marketing/PromoPage.tsx](components/marketing/PromoPage.tsx) is the client form (phone + car brand autocomplete + plate). On submit it `POST`s to `/api/promo`, then fire-and-forget logs the lead to a **Google Apps Script** sheet (`NEXT_PUBLIC_GOOGLE_SCRIPT_URL`) and emails via **Web3Forms** (`NEXT_PUBLIC_WEB3FORMS_KEY`). Phone validation/normalization logic is duplicated between client and the API route — keep them consistent.

**Components**: `components/marketing/` = landing sections; `components/shared/` = Header/Footer/Logo/ConsentBanner; `components/ui/` = primitives (Button via class-variance-authority). `cn()` helper in [lib/utils.ts](lib/utils.ts).

**Styling**: Tailwind CSS 4 (config-less, via `@tailwindcss/postcss`; globals in `app/globals.css`). Note `PromoPage.tsx` and some marketing components use heavy **inline styles** rather than Tailwind. Brand accent color is `#00AEEF`.

`next.config.ts` sets long-lived cache headers for static assets and `optimizePackageImports` for `lucide-react`/`motion`.

## Updating promo codes

Replacing the code batch requires updating **both** stores or old codes will come back:
1. Regenerate `content/promo-codes.ts` (a `string[]` named `PROMO_CODES`, 6-digit codes) with the new batch, commit, and deploy.
2. Reset the Redis pool — atomically `DEL` `moi_robot:promo_codes` then `RPUSH` the new codes (e.g. via the Upstash REST `/multi-exec` endpoint). Do **not** touch `moi_robot:used_phones` unless you intend to let prior redeemers claim again.

## Environment variables

Set in `.env.local` (not committed). Server-only: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Public (build-time, `NEXT_PUBLIC_`): `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`, `NEXT_PUBLIC_WEB3FORMS_KEY`.

## Deployment

Hosted on a **Beget VPS** (`root@85.198.68.196`, project at `/root/moi-robot`), run under **PM2** as process `moi-robot` on port 3000, fronted by **Nginx** (80/443 → 3000) with a Let's Encrypt cert. Cloudflare DNS points directly at the VPS (proxy intentionally off — МТС blocks Cloudflare IPs).

Deploy = push to `main`, then on the server:
```bash
cd /root/moi-robot && git pull && pnpm build && pm2 restart moi-robot
```
The 1 GB-RAM VPS builds slowly; the `promo-codes.ts` change only takes effect after a rebuild, but the live promo flow reads from Redis, so updating Redis takes effect immediately without deploy.
