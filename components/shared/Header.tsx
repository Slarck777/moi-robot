import Link from "next/link";
import { Phone } from "lucide-react";
import { station } from "@/lib/station";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image src="/logo-mp.png" alt="МОЙ РОБОТ" width={40} height={40} className="object-contain" priority />
        </Link>

        <a
          href={`tel:${station.phone}`}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <Phone className="h-4 w-4" />
          <span className="sm:hidden">Администратор</span>
          <span className="hidden sm:inline">{station.phone}</span>
        </a>
      </div>
    </header>
  );
}
