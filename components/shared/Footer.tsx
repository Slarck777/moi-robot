import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import { station } from "@/lib/station";
import { Logo } from "@/components/shared/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 pt-3">
          <Logo size="sm" />
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span>{station.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-primary" />
            <a href={`tel:${station.phone}`} className="hover:text-primary transition-colors">
              {station.phone}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-primary" />
            <span>{station.workingHours}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} МОЙ РОБОТ. Все права защищены.
          </p>
          <Link href="/b2b" className="text-xs text-primary hover:underline">
            Для бизнеса
          </Link>
        </div>
      </div>
    </footer>
  );
}
