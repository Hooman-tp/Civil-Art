import Link from "next/link";

export const metadata = {
  title: "خدمات | Civil-Art",
  description:
    "خدمات تخصصی Civil-Art در طراحی سازه، راه و ترابری، آب و فاضلاب، نظارت کارگاهی، ژئوتکنیک و مشاوره مدیریت پروژه.",
};

const SERVICES = [
  {
    num: "۰۱",
    icon: "🏗️",
    title: "طراحی سازه",
    desc: "محاسبه و طراحی سازه‌های بتنی، فلزی و مختلط با رویکرد بهینه‌سازی فنی و اقتصادی، مطابق آخرین آیین‌نامه‌های ملی و بین‌المللی.",
  },
  {
    num: "۰۲",
    icon: "🛣️",
    title: "راه و ترابری",
    desc: "طراحی راه، پل، تونل و زیرساخت‌های حمل‌ونقل با استانداردهای روز دنیا و رعایت کامل ملاحظات ایمنی و ترافیکی.",
  },
  {
    num: "۰۳",
    icon: "💧",
    title: "آب و فاضلاب",
    desc: "طراحی سیستم‌های آبرسانی، تصفیه‌خانه، سد و شبکه‌های توزیع آب شهری با در نظر گرفتن پایداری زیست‌محیطی.",
  },
  {
    num: "۰۴",
    icon: "📋",
    title: "نظارت کارگاهی",
    desc: "نظارت عالیه و مقیم بر اجرای پروژه با تیم متخصص، بازدید دوره‌ای مستمر و گزارش‌دهی شفاف و منظم.",
  },
  {
    num: "۰۵",
    icon: "🗺️",
    title: "ژئوتکنیک",
    desc: "مطالعات خاک، طراحی فنداسیون، پایدارسازی شیروانی و تحلیل خطر زلزله برای اطمینان از پایداری بلندمدت سازه.",
  },
  {
    num: "۰۶",
    icon: "📊",
    title: "مشاوره و مدیریت",
    desc: "امکان‌سنجی، مطالعات توجیهی اقتصادی، مدیریت پروژه سرتاسری و مشاوره سرمایه‌گذاری در پروژه‌های عمرانی.",
  },
];

export default function ServicesPage() {
  return (
    <div style={{ background: "#050505", color: "#fff" }}>
      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "160px",
          paddingBottom: "70px",
          paddingLeft: "24px",
          paddingRight: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
          <span
            style={{
              color: "#D4AF37",
              letterSpacing: "5px",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            خدمات تخصصی
          </span>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
        </div>

        <h1
          style={{
            fontSize: "clamp(30px,5vw,52px)",
            fontWeight: 900,
            marginBottom: "20px",
            lineHeight: 1.25,
          }}
        >
          آنچه برای ساختن آینده ارائه می‌دهیم
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "17px",
            lineHeight: 2,
            maxWidth: "750px",
            margin: "0 auto",
          }}
        >
          از اولین طرح مفهومی تا تحویل نهایی پروژه، تیم Civil-Art در کنار شماست
          تا هر ایده را با دقتِ مهندسی به واقعیتی ماندگار تبدیل کند.
        </p>
      </section>

      {/* ── گرید خدمات ── */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: "1px",
            background: "rgba(212,175,55,0.1)",
          }}
        >
          {SERVICES.map((s) => (
            <div
              key={s.num}
              style={{
                background: "#0b0b0d",
                padding: "36px 28px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "20px",
                  fontSize: "40px",
                  fontWeight: 900,
                  color: "rgba(212,175,55,0.08)",
                  fontFamily: "monospace",
                }}
              >
                {s.num}
              </div>

              <div
                style={{
                  width: 52,
                  height: 52,
                  background: "rgba(212,175,55,0.08)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  marginBottom: "20px",
                }}
              >
                {s.icon}
              </div>

              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                {s.title}
              </h3>

              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "14px",
                  lineHeight: 1.9,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA پایانی ── */}
      <section
        style={{
          borderTop: "1px solid rgba(212,175,55,0.15)",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(22px,3vw,32px)",
            fontWeight: 900,
            marginBottom: "20px",
          }}
        >
          نیاز به مشاوره تخصصی دارید؟
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            marginBottom: "32px",
          }}
        >
          کارشناسان ما آماده بررسی رایگان پروژه شما هستند.
        </p>
        <Link
          href="/contact"
          style={{
            display: "inline-block",
            background: "linear-gradient(180deg,#efd98a,#D4AF37)",
            color: "#000",
            fontWeight: 700,
            padding: "16px 40px",
            borderRadius: "999px",
            textDecoration: "none",
          }}
        >
          درخواست مشاوره رایگان
        </Link>
      </section>
    </div>
  );
}
