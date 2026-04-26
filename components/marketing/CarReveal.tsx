"use client";

import { useRef, useState, useCallback } from "react";

const CIRCLE_RADIUS = 130;

type Position = { x: number; y: number };

export function CarReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Position | null>(null);

  const getRelativePos = useCallback(
    (clientX: number, clientY: number): Position | null => {
      const el = containerRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => setPos(getRelativePos(e.clientX, e.clientY)),
    [getRelativePos]
  );
  const handleMouseLeave = useCallback(() => setPos(null), []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      setPos(getRelativePos(t.clientX, t.clientY));
    },
    [getRelativePos]
  );
  const handleTouchEnd = useCallback(() => setPos(null), []);

  const clipPath = pos
    ? `circle(${CIRCLE_RADIUS}px at ${pos.x}px ${pos.y}px)`
    : "circle(0px at 50% 50%)";

  const bgStyle = (src: string) => ({
    backgroundImage: `url(${src})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
  });

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-3 text-center text-2xl font-black tracking-tight">
          До и после
        </h2>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Проведи пальцем по фото
        </p>

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full overflow-hidden rounded-2xl border border-border cursor-none touch-none select-none"
          style={{ aspectRatio: "16/9" }}
        >
          {/* Слой 1 — машина в пене */}
          <div
            className="absolute inset-0"
            style={bgStyle("/car-foam.jpg")}
          />

          {/* Слой 2 — чистая машина (открывается под пальцем) */}
          <div
            className="absolute inset-0 transition-[clip-path] duration-[60ms]"
            style={{ clipPath, ...bgStyle("/car-clean.jpg") }}
          />

          {/* Кружок-курсор */}
          {pos && (
            <div
              className="pointer-events-none absolute z-10 rounded-full border-2 border-white/80 shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
              style={{
                width: CIRCLE_RADIUS * 2,
                height: CIRCLE_RADIUS * 2,
                left: pos.x - CIRCLE_RADIUS,
                top: pos.y - CIRCLE_RADIUS,
              }}
            />
          )}

          {/* Подсказка */}
          {!pos && (
            <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-4">
              <span className="rounded-full bg-black/50 px-4 py-1.5 text-xs text-white/90 backdrop-blur-sm">
                👆 Нажми чтобы увидеть результат
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
