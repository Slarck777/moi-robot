import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

const sizes: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 120, height: 33 },
  md: { width: 280, height: 77 },
  lg: { width: 360, height: 99 },
};

export function Logo({
  size = "md",
  className,
}: {
  size?: LogoSize;
  className?: string;
}) {
  const s = sizes[size];

  return (
    <Image
      src="/logo-full.png"
      alt="МОЙ РОБОТ"
      width={s.width}
      height={s.height}
      className={cn("object-contain select-none", className)}
      priority
    />
  );
}
