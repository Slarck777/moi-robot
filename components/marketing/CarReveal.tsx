"use client";

import { useRef, useState, useCallback } from "react";

const CIRCLE_RADIUS = 120;

type Position = { x: number; y: number };

// Замените foamSrc и cleanSrc на реальные пути к фото когда они будут готовы
const foamSrc = ""; // "/car-foam.jpg"
const cleanSrc = ""; // "/car-clean.jpg"

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
            style={
              foamSrc
                ? { backgroundImage: `url(${foamSrc})`, backgroundSize: "cover", backgroundPosition: "center" }
                : undefined
            }
          >
            {!foamSrc && (
              <div className="absolute inset-0 bg-zinc-700">
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage: `
                      radial-gradient(ellipse 80px 55px at 28% 48%, white 0%, transparent 70%),
                      radial-gradient(ellipse 100px 70px at 52% 42%, #e8e8e8 0%, transparent 70%),
                      radial-gradient(ellipse 60px 45px at 73% 53%, white 0%, transparent 70%),
                      radial-gradient(ellipse 50px 35px at 18% 38%, #f0f0f0 0%, transparent 70%),
                      radial-gradient(ellipse 90px 60px at 42% 62%, white 0%, transparent 70%),
                      radial-gradient(ellipse 45px 30px at 85% 38%, #e0e0e0 0%, transparent 70%)
                    `,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xs text-white/40">Фото машины в пене</p>
                </div>
              </div>
            )}
          </div>

          {/* Слой 2 — чистая машина (открывается под пальцем) */}
          <div
            className="absolute inset-0 transition-[clip-path] duration-[60ms]"
            style={{
              clipPath,
              ...(cleanSrc
                ? { backgroundImage: `url(${cleanSrc})`, backgroundSize: "cover", backgroundPosition: "center" }
                : undefined),
            }}
          >
            {!cleanSrc && (
              <div className="absolute inset-0 bg-zinc-900">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(135deg, transparent 35%, rgba(0,174,239,0.25) 50%, transparent 65%),
                      linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%)
                    `,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xs text-white/40">Фото чистой машины</p>
                </div>
              </div>
            )}
          </div>

          {/* Кружок-курсор */}
          {pos && (
            <div
              className="pointer-events-none absolute z-10 rounded-full border-2 border-white/70 shadow-lg"
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
              <span className="rounded-full bg-black/50 px-4 py-1.5 text-xs text-white/80 backdrop-blur-sm">
                👆 Нажми чтобы увидеть результат
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
