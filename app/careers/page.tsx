import Link from "next/link";

export const metadata = {
  title: "همکاری با ما | Civil-Art",
  description: "فرصت‌های شغلی و همکاری با تیم مهندسی Civil-Art.",
};

const POSITIONS = [
  {
    title: "مهندس سازه (ارشد)",
    type: "تمام‌وقت",
    location: "تهران",
    desc: "مسئولیت طراحی و محاسبات سازه‌ای پروژه‌های مسکونی و تجاری، آشنایی با ETABS و SAFE الزامی است.",
  },
  {
    title: "مهندس عمران (نظارت کارگاهی)",
    type: "تمام‌وقت",
    location: "اصفهان",
    desc: "نظارت مقیم بر اجرای پروژه‌های عمرانی، حداقل ۳ سال سابقه کار کارگاهی.",
  },
  {
    title: "کارشناس متره و برآورد",
    type: "پاره‌وقت",
    location: "دورکاری",
    desc: "تهیه صورت‌وضعیت، متره و برآورد پروژه‌ها با نرم‌افزارهای تخصصی.",
  },
];

const BENEFITS = [
  { icon: "💰", title: "حقوق رقابتی", desc: "پرداخت منظم و متناسب با تجربه و تخصص" },
  { icon: "📈", title: "رشد حرفه‌ای", desc: "دوره‌های آموزشی و فرصت ارتقای شغلی" },
  { icon: "🤝", title: "محیط کاری سالم", desc: "فرهنگ سازمانی مبتنی بر احترام و همکاری تیمی" },
  { icon: "🏥", title: "بیمه تکمیلی", desc: "پوشش بیمه درمانی برای پرسنل و خانواده" },
];

export default function CareersPage() {
  return (
    <div style={{ background: "#050505", color: "#fff" }}>
      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "160px",
          paddingBottom: "60px",
          paddingLeft: "24px",
          paddingRight: "24px",
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
          <span style={{ color: "#D4AF37", letterSpacing: "5px", fontSize: "13px", fontWeight: 700 }}>
            همکاری با ما
          </span>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
        </div>

        <h1 style={{ fontSize: "clamp(28px,5vw,46px)", fontWeight: 900, marginBottom: "16px" }}>
          به تیم Civil-Art بپیوندید
        </h1>

        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", lineHeight: 1.9 }}>
          اگر به دنبال محیطی حرفه‌ای برای رشد در حوزه مهندسی عمران هستید، فرصت‌های
          شغلی زیر را بررسی کنید.
        </p>
      </section>

      {/* ── مزایا ── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "1px",
            background: "rgba(212,175,55,0.1)",
          }}
        >
          {BENEFITS.map((b) => (
            <div key={b.title} style={{ background: "#0b0b0d", padding: "28px 22px", textAlign: "center" }}>
              <div style={{ fontSize: "26px", marginBottom: "12px" }}>{b.icon}</div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px" }}>{b.title}</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── موقعیت‌های شغلی ── */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 100px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "28px", color: "#D4AF37" }}>
          موقعیت‌های شغلی باز
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {POSITIONS.map((p) => (
            <div
              key={p.title}
              style={{
                background: "#0b0b0d",
                border: "1px solid rgba(212,175,55,0.15)",
                borderRadius: "10px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{p.title}</h3>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      background: "rgba(212,175,55,0.1)",
                      color: "#D4AF37",
                      border: "1px solid rgba(212,175,55,0.2)",
                    }}
                  >
                    {p.type}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {p.location}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: "16px" }}>
                {p.desc}
              </p>
              <Link
                href="/contact"
                style={{
                  fontSize: "13px",
                  color: "#D4AF37",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                ارسال رزومه ←
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
