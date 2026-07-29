"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "../lib/gsap";

export default function Hero() {
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // فقط انیمیشن ورودی روی mount — بدون ScrollTrigger،
    // پس هیچ تداخلی با Lenis یا بخش سینمایی ویدیو ندارد.
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(eyebrowRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
      .fromTo(subtitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
      .fromTo(btnsRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "radial-gradient(circle at 50% 30%, #1a1a1a 0%, #050505 70%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg,rgba(0,0,0,.75) 0%,rgba(0,0,0,.4) 50%,rgba(0,0,0,.75) 100%)",
        }}
      />

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: "900px" }}>
        <div ref={eyebrowRef} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
          <span style={{ color: "#D4AF37", letterSpacing: 5, fontSize: 13, fontWeight: 700 }}>CIVIL-ART</span>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
        </div>

        <h1
          ref={titleRef}
          style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(32px,6vw,64px)", lineHeight: 1.25, marginBottom: 20 }}
        >
          خلق سازه‌هایی فراتر از زمان
        </h1>

        <p
          ref={subtitleRef}
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 16,
            lineHeight: 2,
            maxWidth: 640,
            margin: "0 auto 36px",
          }}
        >
          طراحی، مدیریت و اجرای پروژه‌های عمرانی، ساختمانی و صنعتی با رویکردی
          مدرن، دقیق و مبتنی بر استانداردهای بین‌المللی.
        </p>

        <div ref={btnsRef} style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/projects"
            style={{
              background: "linear-gradient(180deg,#efd98a,#D4AF37)",
              color: "#000",
              fontWeight: 700,
              padding: "14px 34px",
              borderRadius: 999,
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            مشاهده پروژه‌ها
          </Link>
          <Link
            href="/contact"
            style={{
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff",
              padding: "14px 34px",
              borderRadius: 999,
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            دریافت مشاوره
          </Link>
        </div>
      </div>
    </section>
  );
}
