"use client";

import { ReactNode, useMemo, useRef } from "react";
import CinematicWorld from "./CinematicWorld";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export interface CinematicStatItem {
  icon: ReactNode;
  value: string;
  label: string;
}

const SCROLL_TRACK_VH = 350;

// بازه‌ای از پیشرفت که کارت‌های آمار در آن کاملاً دیده می‌شوند؛
// قبل و بعدش با فید نرم وارد/خارج می‌شوند
const REVEAL_START = 0.14;
const REVEAL_FULL = 0.32;
const HOLD_END = 0.82;
const FADE_OUT_END = 0.97;

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

export default function CinematicStatsSection({ stats }: { stats: CinematicStatItem[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const worldProgressRef = useRef(0);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const eyebrowRef = useRef<HTMLDivElement>(null);

  const memoStats = useMemo(() => stats, [stats]);

  useScrollProgress(wrapperRef, (p) => {
    worldProgressRef.current = p;

    let contentOpacity: number;
    let contentShift: number;
    if (p < REVEAL_START) {
      contentOpacity = 0;
      contentShift = 24;
    } else if (p < REVEAL_FULL) {
      const t = easeOutCubic((p - REVEAL_START) / (REVEAL_FULL - REVEAL_START));
      contentOpacity = t;
      contentShift = 24 * (1 - t);
    } else if (p < HOLD_END) {
      contentOpacity = 1;
      contentShift = 0;
    } else if (p < FADE_OUT_END) {
      const t = (p - HOLD_END) / (FADE_OUT_END - HOLD_END);
      contentOpacity = 1 - t;
      contentShift = -18 * t;
    } else {
      contentOpacity = 0;
      contentShift = -18;
    }

    if (eyebrowRef.current) {
      eyebrowRef.current.style.opacity = String(contentOpacity);
      eyebrowRef.current.style.transform = `translateY(${contentShift}px)`;
    }

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      // یک استاگرِ خیلی ظریف بین کارت‌ها، بدون اینکه حس «یکی‌یکی» تند بگیره
      const stagger = i * 0.025;
      const local = Math.max(0, Math.min(1, contentOpacity + (contentOpacity > 0 ? stagger : -stagger)));
      el.style.opacity = String(Math.min(1, local));
      el.style.transform = `translateY(${contentShift}px)`;
    });
  });

  return (
    <div ref={wrapperRef} style={{ height: `${SCROLL_TRACK_VH}vh`, position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#050505",
        }}
      >
        <CinematicWorld progressRef={worldProgressRef} depth={110} buildingCount={7} />

        {/* گرادیانِ ملایم برای خوانا ماندن کارت‌ها روی صحنه‌ی سه‌بعدی */}
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            background: "radial-gradient(ellipse 900px 500px at 50% 55%, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.15) 55%, rgba(5,5,5,0) 75%)",
          }}
        />

        <div
          style={{
            position: "absolute", inset: 0, zIndex: 2,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "0 24px",
          }}
        >
          <div
            ref={eyebrowRef}
            style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 28, opacity: 0, transform: "translateY(24px)" }}
          >
            <div style={{ width: 32, height: 1, background: "#D4AF37" }} />
            <span style={{ color: "#D4AF37", letterSpacing: 4, fontSize: 12, fontWeight: 700 }}>در یک نگاه</span>
            <div style={{ width: 32, height: 1, background: "#D4AF37" }} />
          </div>

          <div
            style={{
              maxWidth: 1100, width: "100%", margin: "0 auto",
              display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 20,
            }}
          >
            {memoStats.map((s, i) => (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                style={{
                  opacity: 0,
                  transform: "translateY(24px)",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(212,175,55,0.18)",
                  borderRadius: 16,
                  padding: "28px 20px",
                  textAlign: "center",
                  backdropFilter: "blur(2px)",
                }}
              >
                <div style={{ color: "#D4AF37", marginBottom: 12, display: "flex", justifyContent: "center" }}>{s.icon}</div>
                <div style={{ color: "#fff", fontSize: "clamp(26px,3.6vw,38px)", fontWeight: 900 }}>{s.value}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", marginTop: 6, fontSize: 13 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
