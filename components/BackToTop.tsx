"use client";

import { useEffect, useRef } from "react";

export default function BackToTop() {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    /*
      مستقیم روی DOM با opacity/pointerEvents کار می‌کند — بدون
      useState، پس هیچ re-render در حین اسکرول اتفاق نمی‌افتد.
      این دقیقاً همان روشی است که از تداخل با بخش سینمایی ویدیو
      جلوگیری می‌کند.
    */
    const update = () => {
      if (!btnRef.current) return;
      const show = window.scrollY > 500;
      btnRef.current.style.opacity = show ? "1" : "0";
      btnRef.current.style.pointerEvents = show ? "auto" : "none";
    };

    window.addEventListener("scroll", update, { passive: true });
    update();

    return () => window.removeEventListener("scroll", update);
  }, []);

  const scrollToTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      ref={btnRef}
      onClick={scrollToTop}
      aria-label="بازگشت به بالای صفحه"
      style={{
        position: "fixed",
        left: "20px",
        bottom: "20px",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        border: "none",
        background: "linear-gradient(180deg,#efd98a,#D4AF37)",
        color: "#000",
        fontSize: "20px",
        fontWeight: 900,
        cursor: "pointer",
        zIndex: 9999,
        boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        opacity: 0,
        pointerEvents: "none",
        transition: "opacity 0.3s ease",
      }}
    >
      ↑
    </button>
  );
}
