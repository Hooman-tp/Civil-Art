"use client";

/*
  این بخش قبلاً مستقیم داخل layout.tsx بود، اما چون layout.tsx یک
  Server Component است و نمی‌تواند event handler (مثل onFocus/onBlur)
  را مستقیم بپذیرد، این بخش را به یک کامپوننت جدا با "use client"
  منتقل کردیم. این خطا را رفع می‌کند:

  "Event handlers cannot be passed to Client Component props"
*/
export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      style={{
        position: "absolute",
        right: "-9999px",
        top: "0",
        background: "#D4AF37",
        color: "#000",
        padding: "12px 20px",
        zIndex: 999999,
        fontWeight: 700,
        textDecoration: "none",
      }}
      onFocus={(e) => {
        e.currentTarget.style.right = "10px";
        e.currentTarget.style.top = "10px";
      }}
      onBlur={(e) => {
        e.currentTarget.style.right = "-9999px";
      }}
    >
      رفتن به محتوای اصلی
    </a>
  );
}
