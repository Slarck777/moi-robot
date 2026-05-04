import Link from "next/link";
import { Phone } from "lucide-react";
import { station } from "@/lib/station";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image src="/logo-mp.webp" alt="МОЙ РОБОТ" width={40} height={40} className="object-contain" priority />
        </Link>

        <a
          href={`tel:${station.phone}`}
          className="flex items-center gap-2 rounded-full bg-primary/15 border border-primary/40 px-3 py-1.5 transition-all hover:bg-primary/25 hover:border-primary/70 hover:shadow-[0_0_12px_rgba(0,174,239,0.4)]"
          style={{ animation: "pulse-glow 2.5s ease-in-out infinite" }}
        >
          <Phone className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-semibold text-primary sm:hidden">Администратор</span>
          <span className="hidden text-sm font-semibold text-primary sm:inline">{station.phone}</span>
        </a>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,174,239,0); }
          50% { box-shadow: 0 0 14px 3px rgba(0,174,239,0.35); }
        }
      `}</style>
    </header>
  );
}
