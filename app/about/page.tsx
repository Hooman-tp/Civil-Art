import Link from "next/link";

export const metadata = {
  title: "درباره ما | Civil-Art",
  description:
    "Civil-Art، شرکت فنی و مهندسی فعال در طراحی، نظارت، مدیریت و اجرای پروژه‌های عمرانی، ساختمانی و صنعتی با بیش از یک دهه تجربه.",
};

const STATS = [
  { value: "+120", label: "پروژه تکمیل شده" },
  { value: "+18", label: "سال تجربه" },
  { value: "+60", label: "نیروی متخصص" },
  { value: "+40", label: "کارفرمای دائمی" },
];

const VALUES = [
  {
    title: "دقت مهندسی",
    desc: "هر پروژه با محاسبات دقیق و رعایت کامل استانداردهای فنی روز دنیا طراحی و اجرا می‌شود.",
  },
  {
    title: "شفافیت در اجرا",
    desc: "کارفرمایان ما در تمام مراحل پروژه، از طراحی تا تحویل نهایی، در جریان کامل روند کار قرار دارند.",
  },
  {
    title: "تعهد به زمان‌بندی",
    desc: "برنامه‌ریزی دقیق پروژه از ابتدا، تحویل به‌موقع را برای هر کارفرما تضمین می‌کند.",
  },
  {
    title: "کیفیت ماندگار",
    desc: "استفاده از مصالح استاندارد و نظارت مستمر، تضمین‌کننده‌ی ماندگاری و ایمنی سازه‌هاست.",
  },
];

const TEAM = [
  { name: "مهندس هومن تقی پور", role: "مدیرعامل و مهندس معمار" },
  { name: "مهندس محسن منصوری", role: "مدیر پروژه و نظارت اجرایی" },
  { name: "خانم مهندس فاطمه طباطبائی", role: "مهندس معمار و طراح نما" },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#050505", color: "#fff" }}>
      {/* ── Hero بخش درباره ما ── */}
      <section
        style={{
          paddingTop: "160px",
          paddingBottom: "80px",
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
            درباره ما
          </span>
          <div style={{ width: 40, height: 2, background: "#D4AF37" }} />
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 900,
            marginBottom: "24px",
            lineHeight: 1.2,
          }}
        >
          Civil-Art؛ مهندسی که با هنر گره خورده است
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "18px",
            lineHeight: 2,
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          Civil-Art یک شرکت فنی و مهندسی فعال در زمینه طراحی، نظارت، مدیریت و اجرای
          پروژه‌های عمرانی، ساختمانی و صنعتی است. هدف ما ارائه راهکارهای مهندسی نوین
          و اجرای پروژه‌ها با بالاترین استانداردهای کیفیت است.
        </p>
      </section>

      {/* ── آمار ── */}
      <section
        style={{
          borderTop: "1px solid rgba(212,175,55,0.15)",
          borderBottom: "1px solid rgba(212,175,55,0.15)",
          padding: "60px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: "40px",
            textAlign: "center",
          }}
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <div
                style={{
                  color: "#D4AF37",
                  fontSize: "clamp(32px,4vw,48px)",
                  fontWeight: 900,
                }}
              >
                {s.value}
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ارزش‌ها ── */}
      <section
        style={{
          padding: "100px 24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div style={{ width: 32, height: 1, background: "#D4AF37" }} />
            <span
              style={{
                color: "#D4AF37",
                letterSpacing: "4px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              ارزش‌های ما
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 900 }}>
            اصولی که کار ما را متمایز می‌کند
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "1px",
            background: "rgba(212,175,55,0.1)",
          }}
        >
          {VALUES.map((v) => (
            <div
              key={v.title}
              style={{
                background: "#0b0b0d",
                padding: "36px 28px",
              }}
            >
              <h3
                style={{
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                {v.title}
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "14px",
                  lineHeight: 1.9,
                }}
              >
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── تیم ── */}
      <section
        style={{
          padding: "100px 24px",
          background: "#0b0b0d",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div style={{ width: 32, height: 1, background: "#D4AF37" }} />
              <span
                style={{
                  color: "#D4AF37",
                  letterSpacing: "4px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                تیم ما
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 900 }}>
              افرادی که پشت هر پروژه ایستاده‌اند
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: "24px",
            }}
          >
            {TEAM.map((member) => (
              <div
                key={member.name}
                style={{
                  background: "#111",
                  border: "1px solid rgba(212,175,55,0.15)",
                  borderRadius: "8px",
                  padding: "32px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg,#D4AF37,#8a6d1f)",
                    margin: "0 auto 20px",
                  }}
                />
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>
                  {member.name}
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "13px",
                    marginTop: "6px",
                  }}
                >
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA پایانی ── */}
      <section
        style={{
          padding: "100px 24px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(24px,3vw,36px)",
            fontWeight: 900,
            marginBottom: "24px",
          }}
        >
          آماده‌ی شروع پروژه بعدی خود هستید؟
        </h2>
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
          تماس با ما
        </Link>
      </section>
    </div>
  );
}
