export const metadata = {
  title: "گواهینامه‌ها و افتخارات | Civil-Art",
  description: "گواهینامه‌ها، استانداردها و افتخارات کسب‌شده توسط شرکت فنی مهندسی Civil-Art.",
};

const CERTIFICATES = [
  {
    title: "گواهینامه صلاحیت پیمانکاری",
    org: "سازمان برنامه و بودجه کشور",
    desc: "رتبه‌بندی در رشته‌های ابنیه و ساختمان.",
  },
  {
    title: "گواهینامه مدیریت کیفیت ISO 9001",
    org: "نهاد گواهی‌دهنده بین‌المللی",
    desc: "استاندارد مدیریت کیفیت در فرآیندهای طراحی و اجرا.",
  },
  {
    title: "گواهینامه ایمنی و بهداشت حرفه‌ای ISO 45001",
    org: "نهاد گواهی‌دهنده بین‌المللی",
    desc: "رعایت استانداردهای ایمنی کارگاهی و سلامت شغلی.",
  },
  {
    title: "عضویت در سازمان نظام مهندسی",
    org: "سازمان نظام مهندسی ساختمان",
    desc: "عضویت رسمی مهندسان ارشد تیم در نظام مهندسی کشور.",
  },
];

const AWARDS = [
  { year: "۱۴۰۲", title: "تقدیرنامه بهترین پروژه مسکونی سال", org: "همایش ملی مهندسی عمران" },
  { year: "۱۴۰۱", title: "لوح تقدیر کیفیت اجرای پروژه زیرساختی", org: "انجمن مهندسان عمران ایران" },
  { year: "۱۴۰۰", title: "گواهی رعایت استانداردهای HSE", org: "سازمان نظام مهندسی" },
];

export default function CertificatesPage() {
  return (
    <div style={{ background: "#050505", color: "#fff" }}>
      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "160px",
          paddingBottom: "60px",
          paddingLeft: "24px",
          paddingRight: "24px",
          maxWidth: "1000px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
          <span style={{ color: "#D4AF37", letterSpacing: "5px", fontSize: "13px", fontWeight: 700 }}>
            گواهینامه‌ها و افتخارات
          </span>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
        </div>

        <h1 style={{ fontSize: "clamp(28px,5vw,46px)", fontWeight: 900, marginBottom: "16px" }}>
          تعهد ما به کیفیت، مستند و تأییدشده
        </h1>

        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", lineHeight: 1.9 }}>
          استانداردها و افتخاراتی که نتیجه سال‌ها تلاش مستمر برای ارتقای کیفیت
          خدمات مهندسی است.
        </p>
      </section>

      {/* ── گواهینامه‌ها ── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            marginBottom: "28px",
            color: "#D4AF37",
          }}
        >
          گواهینامه‌ها و استانداردها
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "20px",
          }}
        >
          {CERTIFICATES.map((c) => (
            <div
              key={c.title}
              style={{
                background: "#0b0b0d",
                border: "1px solid rgba(212,175,55,0.15)",
                borderRadius: "10px",
                padding: "26px",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "8px",
                  background: "rgba(212,175,55,0.08)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  fontSize: "20px",
                }}
              >
                📜
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>{c.title}</h3>
              <p style={{ fontSize: "12px", color: "#D4AF37", marginBottom: "10px" }}>{c.org}</p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── افتخارات (تایم‌لاین) ── */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 24px 120px",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            marginBottom: "28px",
            color: "#D4AF37",
          }}
        >
          افتخارات کسب‌شده
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {AWARDS.map((a, i) => (
            <div
              key={a.title}
              style={{
                display: "flex",
                gap: "20px",
                padding: "20px 0",
                borderBottom: i < AWARDS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <div
                style={{
                  color: "#D4AF37",
                  fontSize: "20px",
                  fontWeight: 900,
                  minWidth: "70px",
                }}
              >
                {a.year}
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>{a.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{a.org}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
