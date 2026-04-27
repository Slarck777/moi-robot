import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

export function B2BBanner() {
  return (
    <div className="px-4 pb-4">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/b2b"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 transition-colors hover:border-primary/40 hover:bg-primary/10"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Управляете автопарком?</p>
              <p className="text-xs text-muted-foreground">Корпоративные условия, личный кабинет и контроль расходов</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
