"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // خطا را در کنسول مرورگر لاگ می‌کنیم تا در حین توسعه قابل بررسی باشد.
  // این خط همچنین باعث می‌شود پارامتر error واقعاً «استفاده‌شده» باشد
  // و برخی تنظیمات سخت‌گیرانه‌ی lint/TypeScript خطا ندهند.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "56px", marginBottom: "20px" }}>⚠️</div>

      <h1 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 900, marginBottom: "14px" }}>
        مشکلی پیش آمد
      </h1>

      <p
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "14px",
          marginBottom: "32px",
          maxWidth: "420px",
        }}
      >
        متأسفانه خطایی در بارگذاری این صفحه رخ داد. لطفاً دوباره تلاش کنید.
      </p>

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
    </div>
  );
}
