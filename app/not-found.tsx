import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        background: "#050505",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "clamp(60px,12vw,140px)",
          fontWeight: 900,
          color: "rgba(212,175,55,0.15)",
          lineHeight: 1,
        }}
      >
        ۴۰۴
      </div>

      <h1 style={{ fontSize: "clamp(20px,3vw,32px)", fontWeight: 900, marginTop: "10px", marginBottom: "16px" }}>
        صفحه مورد نظر پیدا نشد
      </h1>

      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", marginBottom: "36px", maxWidth: "440px" }}>
        متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابه‌جا شده است.
      </p>

      <Link
        href="/"
        style={{
          display: "inline-block",
          background: "linear-gradient(180deg,#efd98a,#D4AF37)",
          color: "#000",
          fontWeight: 700,
          padding: "14px 36px",
          borderRadius: "999px",
          textDecoration: "none",
        }}
      >
        بازگشت به خانه
      </Link>
    </div>
  );
}
