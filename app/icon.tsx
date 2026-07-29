import { ImageResponse } from "next/og";

// آیکون سایت (favicon) به‌صورت پویا ساخته می‌شود — بدون نیاز به فایل عکس آپلودی
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#050505",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#D4AF37",
            fontSize: 18,
            fontWeight: 900,
            fontFamily: "sans-serif",
          }}
        >
          CA
        </span>
      </div>
    ),
    { ...size }
  );
}
