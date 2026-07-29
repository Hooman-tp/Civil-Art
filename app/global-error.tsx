"use client";

import { useEffect } from "react";

/*
  ══════════════════════════════════════════════════════════
  چرا این فایل جدا از error.tsx لازم است؟

  app/error.tsx فقط خطاهایی را می‌گیرد که داخل خودِ صفحات
  (children) اتفاق می‌افتند — نه خطاهایی که در خودِ app/layout.tsx
  (یعنی Header، Footer، ScrollProgress و بقیه‌ی کامپوننت‌های
  سراسری) رخ می‌دهند.

  اگر مشکلی در سطح layout.tsx پیش بیاید، کل سایت با یک صفحه‌ی
  سفید یا خطای خام مرورگر متوقف می‌شود و error.tsx معمولی هیچ
  کمکی نمی‌کند. این فایل (global-error.tsx) دقیقاً برای همین حالت
  طراحی شده و باید خودش تگ‌های <html> و <body> را هم رندر کند،
  چون در این حالت کل layout (شامل Header/Footer) هم از دست رفته
  است.
  ══════════════════════════════════════════════════════════
*/

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="fa" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#050505",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: "56px", marginBottom: "20px" }}>⚠️</div>

        <h1 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 900, marginBottom: "14px" }}>
          خطای کلی سایت
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "14px",
            marginBottom: "12px",
            maxWidth: "500px",
          }}
        >
          مشکلی در بارگذاری اصلی سایت رخ داد.
        </p>

        {/* پیام دقیق خطا — فقط برای دیباگ در حین توسعه مفید است */}
        <pre
          style={{
            color: "rgba(255,80,80,0.8)",
            fontSize: "11px",
            maxWidth: "600px",
            overflow: "auto",
            background: "rgba(255,0,0,0.05)",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "24px",
            textAlign: "left",
            direction: "ltr",
          }}
        >
          {error?.message || "جزئیات خطا در دسترس نیست"}
        </pre>

        <button
          onClick={() => reset()}
          style={{
            background: "linear-gradient(180deg,#efd98a,#D4AF37)",
            color: "#000",
            fontWeight: 700,
            padding: "12px 32px",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          تلاش مجدد
        </button>
      </body>
    </html>
  );
}
