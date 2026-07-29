import { ImageResponse } from "next/og";

/*
  تصویر پیش‌نمایش اشتراک‌گذاری (Open Graph Image).

  وقتی لینک سایت در واتساپ، تلگرام، توییتر یا هر شبکه‌ی اجتماعی
  دیگری ارسال شود، این تصویر به‌عنوان پیش‌نمایش نشان داده می‌شود.
  این فایل به‌صورت خودکار توسط Next.js در مسیر /opengraph-image
  سرو می‌شود و نیازی به تنظیم دستی در metadata نیست.
*/

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#050505",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* خط تزئینی بالا */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg,#D4AF37,#efd98a,#D4AF37)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 48, height: 2, background: "#D4AF37", display: "flex" }} />
          <span style={{ color: "#D4AF37", fontSize: 22, letterSpacing: 6, fontWeight: 700 }}>
            CIVIL-ART
          </span>
          <div style={{ width: 48, height: 2, background: "#D4AF37", display: "flex" }} />
        </div>

        <div
          style={{
            color: "#fff",
            fontSize: 64,
            fontWeight: 900,
            textAlign: "center",
            display: "flex",
          }}
        >
          شرکت فنی و مهندسی
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 26,
            marginTop: 24,
            display: "flex",
          }}
        >
          طراحی · نظارت · مدیریت · اجرا
        </div>
      </div>
    ),
    { ...size }
  );
}
