import { MapPin, Phone, Clock } from "lucide-react";
import { station } from "@/lib/station";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center gap-1.5">
          <span className="text-base font-black tracking-tight">
            МОЙ{" "}
            <span className="relative inline-block">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] text-primary">
                💧
              </span>
              РОБОТ
            </span>
          </span>
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

        <p className="mt-6 text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} МОЙ РОБОТ. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
