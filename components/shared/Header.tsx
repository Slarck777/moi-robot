import Link from "next/link";
import { Phone } from "lucide-react";
import { station } from "@/lib/station";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="relative text-lg font-black tracking-tight text-foreground">
            МОЙ{" "}
            <span className="relative inline-block">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] text-primary">
                💧
              </span>
              РОБОТ
            </span>
          </span>
        </Link>

        <a
          href={`tel:${station.phone}`}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">{station.phone}</span>
        </a>
      </div>
    </header>
  );
}
