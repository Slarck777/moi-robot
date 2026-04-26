import { cn } from "@/lib/utils";

function WaterDrop({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 26"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M10,2 C7,7 2,13 2,18 a8,8 0 0,0 16,0 C18,13 13,7 10,2 Z" />
    </svg>
  );
}

type LogoSize = "sm" | "md" | "lg";

const sizes: Record<LogoSize, { text: string; drop: string; dropOffset: string }> = {
  sm: {
    text: "text-lg",
    drop: "w-2.5 h-3.5",
    dropOffset: "-top-3.5",
  },
  md: {
    text: "text-5xl",
    drop: "w-5 h-7",
    dropOffset: "-top-7",
  },
  lg: {
    text: "text-6xl",
    drop: "w-6 h-8",
    dropOffset: "-top-8",
  },
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
    <span
      className={cn(
        "font-extrabold tracking-tight leading-none select-none",
        s.text,
        className
      )}
    >
      МО
      <span className="relative inline-block">
        <WaterDrop
          className={cn(
            "absolute left-1/2 -translate-x-1/2 text-primary",
            s.drop,
            s.dropOffset
          )}
        />
        Й
      </span>
      {" "}РОБОТ
    </span>
  );
}
