import Link from "next/link";

const MAIN_LINKS = [
  { href: "/about", label: "درباره ما" },
  { href: "/services", label: "خدمات" },
  { href: "/projects", label: "پروژه‌ها" },
  { href: "/gallery", label: "گالری" },
  { href: "/team", label: "تیم ما" },
  { href: "/contact", label: "تماس با ما" },
];

const OTHER_LINKS = [
  { href: "/blog", label: "مقالات" },
  { href: "/faq", label: "سوالات متداول" },
  { href: "/certificates", label: "گواهینامه‌ها و افتخارات" },
  { href: "/careers", label: "همکاری با ما" },
  { href: "/privacy-policy", label: "حریم خصوصی" },
];

const SOCIAL_LINKS = [
  {
    label: "اینستاگرام",
    href: "https://instagram.com/hooman_tp",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "تلگرام",
    href: "https://t.me/09129245664",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21.2 3.6 2.9 10.7c-1.2.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.5c.2.6.4.8.8.8.4 0 .6-.2.8-.4l2.4-2.3 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.6-1.4Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M8.4 13.7 17 8.2l-7.3 7.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#050505",
        borderTop: "1px solid rgba(212,175,55,0.15)",
        padding: "60px 24px 24px",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "40px",
          paddingBottom: "40px",
        }}
      >
        {/* درباره */}
        <div>
          <div style={{ color: "#D4AF37", fontWeight: 900, fontSize: "20px", marginBottom: "14px" }}>
            Civil-Art
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: 1.9 }}>
            شرکت فنی و مهندسی فعال در طراحی، نظارت، مدیریت و اجرای پروژه‌های
            عمرانی، ساختمانی و صنعتی.
          </p>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "1px solid rgba(212,175,55,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#D4AF37",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* لینک‌های اصلی */}
        <div>
          <h4 style={{ color: "#fff", fontSize: "14px", marginBottom: "16px", fontWeight: 700 }}>
            دسترسی سریع
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {MAIN_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", textDecoration: "none" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* لینک‌های دیگر */}
        <div>
          <h4 style={{ color: "#fff", fontSize: "14px", marginBottom: "16px", fontWeight: 700 }}>
            اطلاعات بیشتر
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {OTHER_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", textDecoration: "none" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* تماس */}
        <div>
          <h4 style={{ color: "#fff", fontSize: "14px", marginBottom: "16px", fontWeight: 700 }}>
            اطلاعات تماس
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
            <span>آدرس در حال تکمیل</span>
            <a href="tel:09129245664" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
              ۰۹۱۲-۹۲۴۵۶۶۴
            </a>
            <a href="mailto:hooman.tp@gmail.com" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
              hooman.tp@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "20px",
          textAlign: "center",
          fontSize: "12px",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        © ۱۴۰۳ شرکت فنی مهندسی Civil-Art — تمامی حقوق محفوظ است
      </div>
    </footer>
  );
}
